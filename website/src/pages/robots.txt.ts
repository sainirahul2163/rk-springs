import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/env';

export const GET: APIRoute = () => {
  const sitemap = absoluteUrl('/sitemap-index.xml');
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${sitemap}`, ''].join(
    '\n',
  );

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
