import type { APIRoute } from 'astro';
import { handleRfq } from '@/lib/rfq/server';

export const prerender = false;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const result = await handleRfq(request, {
      ip: clientAddress ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '',
      userAgent: request.headers.get('user-agent') ?? '',
    });
    return json(result.body, result.status);
  } catch (error) {
    console.error(error);
    return json(
      {
        ok: false,
        error: 'Something went wrong. WhatsApp us your drawing and we will reply within 24 hours.',
      },
      500,
    );
  }
};

export const GET: APIRoute = () => json({ ok: false, error: 'Method not allowed.' }, 405);
