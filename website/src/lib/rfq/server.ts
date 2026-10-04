/**
 * POST /api/rfq handler body. Cloud path when keys exist; otherwise .rfq-dev/.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { primaryEmail, primaryPhone, site } from '@/data/site';
import { makeRfqCodeSecure } from './code';
import { extOf, sanitiseName, validateFiles } from './files';
import {
  boolFromForm,
  e164FromInput,
  fieldErrors,
  parseSpecs,
  rfqFieldsSchema,
  SPRING_TYPE_LABELS,
  type RfqFields,
} from './schema';

export interface RfqResult {
  status: number;
  body: { ok: true; id: string } | { ok: false; error: string };
}

interface FileMeta {
  name: string;
  size: number;
  type: string;
  path: string;
}

function env(name: string): string {
  return (process.env[name] ?? '').trim();
}

function hasCloud(): boolean {
  return Boolean(env('SUPABASE_URL') && env('SUPABASE_SERVICE_ROLE_KEY'));
}

function parseUtm(raw: string): Record<string, string> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) out[key] = value.trim().slice(0, 200);
    }
    return out;
  } catch {
    return {};
  }
}

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function storagePrefix(code: string, now: Date): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `rfq/${year}/${month}/${code}`;
}

async function supabaseHeaders(): Promise<Record<string, string>> {
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

async function uploadFile(path: string, bytes: ArrayBuffer, contentType: string): Promise<void> {
  const url = `${env('SUPABASE_URL').replace(/\/+$/, '')}/storage/v1/object/rfq-drawings/${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(await supabaseHeaders()),
      'Content-Type': contentType || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: bytes,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storage upload failed (${res.status}): ${text.slice(0, 200)}`);
  }
}

async function signFile(path: string): Promise<string | null> {
  const base = env('SUPABASE_URL').replace(/\/+$/, '');
  const res = await fetch(`${base}/storage/v1/object/sign/rfq-drawings/${path}`, {
    method: 'POST',
    headers: {
      ...(await supabaseHeaders()),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: 7 * 24 * 60 * 60 }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { signedURL?: string; signedUrl?: string };
  const signed = data.signedURL ?? data.signedUrl;
  if (!signed) return null;
  return signed.startsWith('http') ? signed : `${base}/storage/v1${signed}`;
}

async function insertRfq(row: Record<string, unknown>): Promise<void> {
  const url = `${env('SUPABASE_URL').replace(/\/+$/, '')}/rest/v1/rfqs`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(await supabaseHeaders()),
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RFQ insert failed (${res.status}): ${text.slice(0, 200)}`);
  }
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
  const key = env('RESEND_API_KEY');
  const from = env('RFQ_FROM_EMAIL');
  if (!key || !from) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Resend failed (${res.status}): ${body.slice(0, 300)}`);
  }
}

function quantityOf(data: RfqFields): number | null {
  if (data.spring_type === 'general') return null;
  const n = Number(data.quantity.replace(/,/g, ''));
  return Number.isInteger(n) ? n : null;
}

function rowsHtml(pairs: [string, string][]): string {
  const cells = pairs
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;color:#52606d">${escapeHtml(label)}</th><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  return `<table>${cells}</table>`;
}

function summaryPairs(data: RfqFields, code: string, files: FileMeta[]): [string, string][] {
  const specs = data.specs ?? {};
  const specLines = Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
  return [
    ['Reference', code],
    ['Name', data.name],
    ['Company', data.company],
    ['Phone', e164FromInput(data.phone) ?? data.phone],
    ['Email', data.email],
    ['City', data.city],
    ['Type', SPRING_TYPE_LABELS[data.spring_type]],
    ['Quantity', data.quantity],
    ['Sample coming', data.sample_coming ? 'Yes' : 'No'],
    ['Notes', data.notes],
    ['Specs', specLines],
    ['Files', files.map((f) => f.name).join(', ')],
  ];
}

export async function handleRfq(
  request: Request,
  extras: { ip: string; userAgent: string },
): Promise<RfqResult> {
  const form = await request.formData();
  if (String(form.get('website') ?? '').trim()) {
    return { status: 400, body: { ok: false, error: 'Please try again.' } };
  }

  const token = String(form.get('cf-turnstile-response') ?? form.get('turnstile') ?? '');
  if (!(await verifyTurnstile(token, extras.ip))) {
    return {
      status: 400,
      body: {
        ok: false,
        error:
          'We could not verify the form. WhatsApp us your drawing and we will reply within 24 hours.',
      },
    };
  }

  const parsed = rfqFieldsSchema.safeParse({
    name: String(form.get('name') ?? ''),
    company: String(form.get('company') ?? ''),
    phone: String(form.get('phone') ?? ''),
    email: String(form.get('email') ?? ''),
    city: String(form.get('city') ?? ''),
    spring_type: String(form.get('spring_type') ?? ''),
    quantity: String(form.get('quantity') ?? ''),
    notes: String(form.get('notes') ?? ''),
    sample_coming: boolFromForm(form, 'sample_coming'),
    consent: boolFromForm(form, 'consent'),
    source_page: String(form.get('source_page') ?? '').slice(0, 300),
    utm: parseUtm(String(form.get('utm') ?? '{}')),
    specs: parseSpecs(form),
  });

  if (!parsed.success) {
    const first =
      Object.values(fieldErrors(parsed.error))[0] ?? 'Please complete the required fields.';
    return { status: 400, body: { ok: false, error: first } };
  }

  const files = form
    .getAll('files')
    .filter((item): item is File => item instanceof File && item.size > 0);
  const fileCheck = validateFiles(files);
  if (!fileCheck.ok) return { status: 400, body: { ok: false, error: fileCheck.error } };

  const data = parsed.data;
  const now = new Date();
  const code = makeRfqCodeSecure(now);
  const prefix = storagePrefix(code, now);
  const fileBytes: { meta: FileMeta; bytes: ArrayBuffer }[] = [];

  for (const file of files) {
    const safe = sanitiseName(file.name);
    const rand = sanitiseName(makeRfqCodeSecure(now).slice(-4));
    const path = `${prefix}/${rand}-${safe}`;
    fileBytes.push({
      meta: {
        name: file.name.slice(0, 120),
        size: file.size,
        type: file.type || extOf(file.name),
        path,
      },
      bytes: await file.arrayBuffer(),
    });
  }

  const fileMeta = fileBytes.map((f) => f.meta);
  const phone = e164FromInput(data.phone) ?? data.phone;
  const row = {
    rfq_code: code,
    name: data.name,
    company: data.company || null,
    phone,
    email: data.email || null,
    city: data.city || null,
    spring_type: data.spring_type,
    quantity: quantityOf(data),
    target_date: data.specs?.target_date ?? null,
    specs: data.specs ?? {},
    notes: data.notes || null,
    files: fileMeta,
    sample_coming: data.sample_coming,
    source_page: data.source_page || null,
    utm: data.utm ?? {},
    consent: true,
    status: 'new',
    user_agent: extras.userAgent.slice(0, 400) || null,
    ip_hash: extras.ip ? await hashIp(extras.ip) : null,
  };

  let signedLinks: string[] = [];

  if (hasCloud()) {
    for (const file of fileBytes) {
      await uploadFile(file.meta.path, file.bytes, file.meta.type);
    }
    await insertRfq(row);
    const signed = await Promise.all(fileMeta.map((f) => signFile(f.path)));
    signedLinks = signed.filter((u): u is string => Boolean(u));
  } else {
    const dir = join(process.cwd(), '.rfq-dev', code);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'rfq.json'), `${JSON.stringify(row, null, 2)}\n`);
    for (const file of fileBytes) {
      await writeFile(join(dir, sanitiseName(file.meta.name)), Buffer.from(file.bytes));
    }
    console.info(`[rfq] dev fallback wrote ${dir}`);
  }

  const typeLabel = SPRING_TYPE_LABELS[data.spring_type];
  const qtyLabel = data.quantity || '—';
  const pairs = summaryPairs(data, code, fileMeta);
  const buyerWa = `https://wa.me/${phone.replace(/\D/g, '')}`;
  const fileBlock =
    signedLinks.length > 0
      ? signedLinks.map((u, i) => `${fileMeta[i]?.name ?? 'file'}: ${u}`).join('\n')
      : fileMeta.length
        ? fileMeta.map((f) => f.name).join(', ')
        : 'None';

  const notify = env('RFQ_NOTIFY_EMAIL');
  if (notify && env('RESEND_API_KEY') && env('RFQ_FROM_EMAIL')) {
    const subject = `New RFQ: ${typeLabel}, ${data.company || data.name} (${qtyLabel})`;
    const text = [
      ...pairs.map(([k, v]) => (v ? `${k}: ${v}` : '')),
      '',
      'Files:',
      fileBlock,
      '',
      `WhatsApp the buyer: ${buyerWa}`,
    ]
      .filter(Boolean)
      .join('\n');
    const html = `${rowsHtml(pairs)}<p>Files:</p><p>${
      signedLinks.length
        ? signedLinks
            .map(
              (u, i) => `<a href="${escapeHtml(u)}">${escapeHtml(fileMeta[i]?.name ?? 'file')}</a>`,
            )
            .join('<br/>')
        : escapeHtml(fileBlock)
    }</p><p><a href="${escapeHtml(buyerWa)}">WhatsApp the buyer</a></p>`;
    await sendEmail(notify, subject, html, text);
  }

  if (data.email && env('RESEND_API_KEY') && env('RFQ_FROM_EMAIL')) {
    const subject = `${code} — we have your enquiry`;
    const text = [
      `Hello ${data.name},`,
      '',
      `We have your request ${code}. We will reply within 24 hours.`,
      '',
      `${site.brand} is a brand of ${site.legalName}.`,
      site.hours.summary,
      primaryPhone.display,
      primaryEmail,
    ].join('\n');
    const html = `<p>Hello ${escapeHtml(data.name)},</p><p>We have your request <strong>${escapeHtml(code)}</strong>. We will reply within 24 hours.</p><p>${escapeHtml(site.brand)} is a brand of ${escapeHtml(site.legalName)}.<br/>${escapeHtml(site.hours.summary)}<br/>${escapeHtml(primaryPhone.display)}<br/>${escapeHtml(primaryEmail)}</p>`;
    await sendEmail(data.email, subject, html, text);
  }

  return { status: 200, body: { ok: true, id: code } };
}
