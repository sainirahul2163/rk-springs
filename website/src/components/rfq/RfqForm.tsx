import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { site } from '@/data/site';
import { ACCEPT_ATTR, formatBytes, MAX_FILES, validateFiles } from '@/lib/rfq/files';
import { parsePrefill, readUtm } from '@/lib/rfq/prefill';
import {
  fieldErrors,
  RFQ_SPRING_TYPES,
  rfqFieldsSchema,
  SPRING_TYPE_LABELS,
  type SpringType,
} from '@/lib/rfq/schema';
import { CheckField, SelectField, TextAreaField, TextField } from './fields';
import { TurnstileField } from './TurnstileField';

export interface RfqFormProps {
  sourcePage: string;
  turnstileSiteKey: string;
  whatsappHref: string;
  search?: string;
}

const NOT_SURE = { value: 'not-sure', label: 'Not sure' };

const materialOptions = [
  { value: '', label: 'Select' },
  ...site.capability.materials.map((m) => ({ value: m, label: m })),
  NOT_SURE,
];

const windOptions = [
  { value: '', label: 'Select' },
  { value: 'lh', label: 'Left-hand' },
  { value: 'rh', label: 'Right-hand' },
  NOT_SURE,
];

function typeOptions(): { value: string; label: string }[] {
  return [
    { value: '', label: 'Select a type' },
    ...RFQ_SPRING_TYPES.map((t) => ({ value: t, label: SPRING_TYPE_LABELS[t] })),
  ];
}

export function RfqForm({ sourcePage, turnstileSiteKey, whatsappHref, search }: RfqFormProps) {
  const queryString = search || (typeof window === 'undefined' ? '' : window.location.search);
  const prefill = useMemo(() => parsePrefill(queryString), [queryString]);

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [springType, setSpringType] = useState<SpringType | ''>(
    prefill.type && prefill.type !== 'general' ? prefill.type : '',
  );
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [sampleComing, setSampleComing] = useState(false);
  const [consent, setConsent] = useState(false);
  const [specs, setSpecs] = useState<Record<string, string>>(prefill.specs);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);
  const step2Title = useId();
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReady(true);
    const parsed = parsePrefill(search || window.location.search);
    if (parsed.type && parsed.type !== 'general') {
      setSpringType((prev) => prev || parsed.type);
    }
    if (Object.keys(parsed.specs).length > 0) {
      setSpecs((prev) => ({ ...parsed.specs, ...prev }));
    }
  }, [search]);

  function setSpec(key: string, value: string) {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  }

  function onFiles(list: FileList | null) {
    const next = [...files, ...Array.from(list ?? [])].slice(0, MAX_FILES);
    const check = validateFiles(next);
    setFileError(check.ok ? '' : check.error);
    setFiles(next);
  }

  function payload() {
    return {
      name,
      company,
      phone,
      email,
      city,
      spring_type: springType || 'not-sure',
      quantity,
      notes,
      sample_coming: sampleComing,
      consent,
      specs,
    };
  }

  function validateStep1(): boolean {
    const parsed = rfqFieldsSchema.safeParse(payload());
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next = fieldErrors(parsed.error);
    const step1 = [
      'name',
      'company',
      'phone',
      'email',
      'city',
      'spring_type',
      'quantity',
      'consent',
    ];
    const shown: Record<string, string> = {};
    for (const key of step1) {
      if (next[key]) shown[key] = next[key];
    }
    setErrors(shown);
    return Object.keys(shown).length === 0;
  }

  function goStep2() {
    const filesOk = validateFiles(files);
    if (!filesOk.ok) {
      setFileError(filesOk.error);
      return;
    }
    if (!validateStep1()) return;
    setFormError('');
    setStep(2);
    track('rfq_step2_view', { spring_type: springType || 'not-sure' });
  }

  useEffect(() => {
    if (step === 2) document.getElementById(step2Title)?.focus();
  }, [step, step2Title]);

  async function submit() {
    const parsed = rfqFieldsSchema.safeParse(payload());
    const filesOk = validateFiles(files);
    if (!filesOk.ok) {
      setFileError(filesOk.error);
      return;
    }
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError(
        Object.values(fieldErrors(parsed.error))[0] ?? 'Please complete the required fields.',
      );
      setStep(1);
      return;
    }

    setPending(true);
    setFormError('');
    try {
      const body = new FormData();
      body.set('name', name);
      body.set('company', company);
      body.set('phone', phone);
      body.set('email', email);
      body.set('city', city);
      body.set('spring_type', springType || 'not-sure');
      body.set('quantity', quantity);
      body.set('notes', notes);
      if (sampleComing) body.set('sample_coming', 'true');
      if (consent) body.set('consent', 'true');
      body.set('source_page', sourcePage);
      const utm = readUtm(search ?? window.location.search, sessionStorage.getItem('rk_utm'));
      sessionStorage.setItem('rk_utm', JSON.stringify(utm));
      body.set('utm', JSON.stringify(utm));
      for (const [key, value] of Object.entries(specs)) {
        if (value) body.set(key, value);
      }
      for (const file of files) body.append('files', file);
      if (token) body.set('cf-turnstile-response', token);
      body.set('website', '');

      const res = await fetch('/api/rfq/', { method: 'POST', body });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok || !data.id) {
        setFormError(
          data.error ??
            'Something went wrong. WhatsApp us your drawing and we will reply within 24 hours.',
        );
        return;
      }
      track('rfq_submit', { spring_type: springType || 'not-sure' });
      window.location.assign(`/request-a-quote/thank-you/?id=${encodeURIComponent(data.id)}`);
    } catch {
      setFormError(
        'Something went wrong. WhatsApp us your drawing and we will reply within 24 hours.',
      );
    } finally {
      setPending(false);
    }
  }

  const type = springType;
  const torsion = type === 'torsion' || type === 'double-torsion';
  const compression = type === 'compression' || type === 'conical';
  const extension = type === 'extension';
  const wire = type === 'wire-form';

  return (
    <form
      className="grid gap-6"
      data-ready={ready ? 'true' : undefined}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) goStep2();
        else void submit();
      }}
    >
      <p className="text-small font-medium text-slate">
        Step {step} of 2 — {step === 1 ? 'your details' : 'optional specs'}
      </p>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {step === 1 ? (
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Your name"
              name="name"
              value={name}
              onChange={setName}
              required
              autoComplete="name"
              error={errors.name}
            />
            <TextField
              label="Company"
              name="company"
              value={company}
              onChange={setCompany}
              required
              autoComplete="organization"
              error={errors.company}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Phone / WhatsApp"
              name="phone"
              value={phone}
              onChange={setPhone}
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              error={errors.phone}
            />
            <TextField
              label="Email"
              name="email"
              value={email}
              onChange={setEmail}
              type="email"
              inputMode="email"
              autoComplete="email"
              hint="Optional. We send the reference number here if you give one."
              error={errors.email}
            />
          </div>
          <TextField
            label="City"
            name="city"
            value={city}
            onChange={setCity}
            autoComplete="address-level2"
            error={errors.city}
          />
          <SelectField
            label="Spring type"
            name="spring_type"
            value={springType}
            onChange={(v) => setSpringType(v as SpringType | '')}
            options={typeOptions()}
            required
            error={errors.spring_type}
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={quantity}
            onChange={setQuantity}
            required
            inputMode="numeric"
            hint={`Our usual MOQ is ${site.terms.moq}. Smaller development runs are charged.`}
            error={errors.quantity}
          />

          <div className="grid gap-1.5">
            <p className="field-label" id="files-label">
              Upload a drawing or photo
            </p>
            <input
              ref={fileInput}
              id="files"
              name="files"
              type="file"
              className="sr-only"
              accept={ACCEPT_ATTR}
              multiple
              aria-labelledby="files-label"
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              className="field-input min-h-14 text-left"
              onClick={() => fileInput.current?.click()}
            >
              PDF, DWG, DXF, STEP, IGES, JPG or PNG. Up to 5 files, 25 MB total.
            </button>
            {files.length > 0 ? (
              <ul className="mt-2 grid gap-2">
                {files.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex min-h-11 items-center justify-between gap-3 text-small"
                  >
                    <span>
                      {file.name} <span className="text-slate">({formatBytes(file.size)})</span>
                    </span>
                    <button
                      type="button"
                      className="text-blue-700 underline"
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {fileError ? (
              <p className="field-error" role="alert">
                {fileError}
              </p>
            ) : null}
          </div>

          <CheckField name="sample_coming" checked={sampleComing} onChange={setSampleComing}>
            I will send a sample instead of, or with, a drawing.
          </CheckField>
          <TextAreaField
            label="Anything else we should know?"
            name="notes"
            value={notes}
            onChange={setNotes}
            hint="Where it is fitted, the load, or a target date."
          />
          <CheckField name="consent" checked={consent} onChange={setConsent} error={errors.consent}>
            I agree that RK Enterprises may use my details and drawings to quote and supply parts.{' '}
            <a href="/privacy-policy/" className="text-blue-700 underline">
              Privacy policy
            </a>
            .
          </CheckField>
        </div>
      ) : (
        <div className="grid gap-5">
          <h2 id={step2Title} tabIndex={-1} className="text-h3">
            Optional dimensions
          </h2>
          <p className="text-slate">
            Skip any field you do not know. A drawing or sample is enough for a first quote.
          </p>
          <TypeSketch type={type} />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Material"
              name="material"
              value={specs.material ?? ''}
              onChange={(v) => setSpec('material', v)}
              options={materialOptions}
            />
            <TextField
              label="Wire diameter"
              name="wire_d"
              value={specs.wire_d ?? ''}
              onChange={(v) => setSpec('wire_d', v)}
              hint="mm"
            />
            <TextField
              label="Outer diameter"
              name="od"
              value={specs.od ?? ''}
              onChange={(v) => setSpec('od', v)}
              hint="mm"
            />
            <TextField
              label="Inner diameter"
              name="id"
              value={specs.id ?? ''}
              onChange={(v) => setSpec('id', v)}
              hint="mm"
            />
            <TextField
              label="Free length"
              name="free_length"
              value={specs.free_length ?? ''}
              onChange={(v) => setSpec('free_length', v)}
              hint="mm"
            />
            <TextField
              label="Number of coils"
              name="coils"
              value={specs.coils ?? ''}
              onChange={(v) => setSpec('coils', v)}
            />
            <SelectField
              label="Wind direction"
              name="wind_direction"
              value={specs.wind_direction ?? ''}
              onChange={(v) => setSpec('wind_direction', v)}
              options={windOptions}
            />
            <TextField
              label="Finish"
              name="finish"
              value={specs.finish ?? ''}
              onChange={(v) => setSpec('finish', v)}
              hint="Through partners if plating is needed."
            />
            <TextField
              label="Target date"
              name="target_date"
              value={specs.target_date ?? ''}
              onChange={(v) => setSpec('target_date', v)}
              type="date"
            />
          </div>

          {compression ? (
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="field-label">Compression</legend>
              <SelectField
                label="End type"
                name="end_type"
                value={specs.end_type ?? ''}
                onChange={(v) => setSpec('end_type', v)}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'open', label: 'Open' },
                  { value: 'open-ground', label: 'Open and ground' },
                  { value: 'closed', label: 'Closed' },
                  { value: 'closed-ground', label: 'Closed and ground' },
                  NOT_SURE,
                ]}
              />
              <TextField
                label="Solid height"
                name="solid_height"
                value={specs.solid_height ?? ''}
                onChange={(v) => setSpec('solid_height', v)}
                hint="mm"
              />
              <TextField
                label="Load at length 1"
                name="load_l1"
                value={specs.load_l1 ?? ''}
                onChange={(v) => setSpec('load_l1', v)}
                hint="N at mm"
              />
              <TextField
                label="Length 1"
                name="length_l1"
                value={specs.length_l1 ?? ''}
                onChange={(v) => setSpec('length_l1', v)}
                hint="mm"
              />
              <TextField
                label="Load at length 2"
                name="load_l2"
                value={specs.load_l2 ?? ''}
                onChange={(v) => setSpec('load_l2', v)}
                hint="N at mm"
              />
              <TextField
                label="Length 2"
                name="length_l2"
                value={specs.length_l2 ?? ''}
                onChange={(v) => setSpec('length_l2', v)}
                hint="mm"
              />
            </fieldset>
          ) : null}

          {extension ? (
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="field-label">Extension</legend>
              <TextField
                label="Length inside hooks"
                name="length_inside_hooks"
                value={specs.length_inside_hooks ?? ''}
                onChange={(v) => setSpec('length_inside_hooks', v)}
                hint="mm"
              />
              <SelectField
                label="Hook type"
                name="hook_type"
                value={specs.hook_type ?? ''}
                onChange={(v) => setSpec('hook_type', v)}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'machine', label: 'Machine hook' },
                  { value: 'crossover', label: 'Cross-over' },
                  { value: 'side', label: 'Side hook' },
                  { value: 'extended', label: 'Extended hook' },
                  NOT_SURE,
                ]}
              />
              <TextField
                label="Hook orientation"
                name="hook_orientation"
                value={specs.hook_orientation ?? ''}
                onChange={(v) => setSpec('hook_orientation', v)}
              />
              <TextField
                label="Initial tension"
                name="initial_tension"
                value={specs.initial_tension ?? ''}
                onChange={(v) => setSpec('initial_tension', v)}
                hint="N, if known"
              />
            </fieldset>
          ) : null}

          {torsion ? (
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="field-label">
                {type === 'double-torsion' ? 'Double torsion' : 'Torsion'}
              </legend>
              <TextField
                label="Leg 1 length"
                name="leg_length_1"
                value={specs.leg_length_1 ?? ''}
                onChange={(v) => setSpec('leg_length_1', v)}
                hint="mm"
              />
              <TextField
                label="Leg 1 shape"
                name="leg_shape_1"
                value={specs.leg_shape_1 ?? ''}
                onChange={(v) => setSpec('leg_shape_1', v)}
              />
              <TextField
                label="Leg 2 length"
                name="leg_length_2"
                value={specs.leg_length_2 ?? ''}
                onChange={(v) => setSpec('leg_length_2', v)}
                hint="mm"
              />
              <TextField
                label="Leg 2 shape"
                name="leg_shape_2"
                value={specs.leg_shape_2 ?? ''}
                onChange={(v) => setSpec('leg_shape_2', v)}
              />
              <TextField
                label="Free angle"
                name="free_angle"
                value={specs.free_angle ?? ''}
                onChange={(v) => setSpec('free_angle', v)}
                hint="degrees"
              />
              <TextField
                label="Torque at angle"
                name="torque_at_angle"
                value={specs.torque_at_angle ?? ''}
                onChange={(v) => setSpec('torque_at_angle', v)}
                hint="N·mm at °"
              />
              <TextField
                label="Shaft diameter"
                name="shaft_d"
                value={specs.shaft_d ?? ''}
                onChange={(v) => setSpec('shaft_d', v)}
                hint="mm"
              />
              <SelectField
                label="Loading direction"
                name="loading_direction"
                value={specs.loading_direction ?? ''}
                onChange={(v) => setSpec('loading_direction', v)}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'unwind', label: 'Unwinds the coil' },
                  { value: 'wind', label: 'Winds the coil tighter' },
                  NOT_SURE,
                ]}
              />
              {type === 'double-torsion' ? (
                <TextField
                  label="Centre-loop width"
                  name="centre_loop_width"
                  value={specs.centre_loop_width ?? ''}
                  onChange={(v) => setSpec('centre_loop_width', v)}
                  hint="mm"
                />
              ) : null}
            </fieldset>
          ) : null}

          {wire ? (
            <TextAreaField
              label="Bend angles and radii"
              name="bend_notes"
              value={specs.bend_notes ?? ''}
              onChange={(v) => setSpec('bend_notes', v)}
              hint="Or attach a drawing on the previous step."
            />
          ) : null}
        </div>
      )}

      <TurnstileField siteKey={turnstileSiteKey} token={token} setToken={setToken} />

      {formError ? (
        <p className="field-error" role="alert">
          {formError}{' '}
          <a href={whatsappHref} className="underline" target="_blank" rel="noopener">
            WhatsApp us your drawing
          </a>
          .
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step === 2 ? (
          <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
            Back
          </button>
        ) : null}
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Sending…' : step === 1 ? 'Continue' : 'Send quote request'}
        </button>
      </div>
    </form>
  );
}

function TypeSketch({ type }: { type: SpringType | '' }) {
  const label =
    type && type !== 'not-sure' && type !== 'general' ? SPRING_TYPE_LABELS[type] : 'Spring';
  return (
    <figure className="rfq-sketch" aria-hidden="true">
      <svg viewBox="0 0 160 64" width="160" height="64" className="drawing">
        {type === 'extension' ? (
          <path
            className="w"
            d="M8 32h18 M26 32c4-10 8 10 12 0s8 10 12 0 8 10 12 0 8 10 12 0 8 10 12 0 8 10 12 0 M110 32h18 M8 32l6-8 M8 32l6 8 M128 32l-6-8 M128 32l-6 8"
          />
        ) : type === 'compression' || type === 'conical' ? (
          <path
            className="w"
            d="M20 12v40 M140 12v40 M32 16c8 0 8 32 16 32s8-32 16-32 8 32 16 32 8-32 16-32 8 32 16 32 8-32 16-32"
          />
        ) : type === 'double-torsion' ? (
          <path
            className="w"
            d="M20 48v-20c0-10 8-16 16-16h16c8 0 16 6 16 16v4c0 10-8 16-16 16H52c-8 0-16-6-16-16 M100 48v-20c0-10 8-16 16-16h16c8 0 16 6 16 16v4"
          />
        ) : type === 'wire-form' ? (
          <path className="w" d="M12 44 40 16h36l20 20 28-12 20 16" />
        ) : (
          <path
            className="w"
            d="M24 52c8-28 20-36 36-36 20 0 28 16 40 16 16 0 24-12 36-12 M24 52h-8 M128 20h12"
          />
        )}
      </svg>
      <figcaption className="field-hint">{label} — fill what you know.</figcaption>
    </figure>
  );
}
