import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/env';

export const GET: APIRoute = () => {
  const sitemap = absoluteUrl('/sitemap-index.xml');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /request-a-quote/thank-you/',
    'Disallow: /styleguide/',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    'User-agent: ChatGPT-User',
    'Allow: /',
    'User-agent: ClaudeBot',
    'Allow: /',
    'User-agent: anthropic-ai',
    'Allow: /',
    'User-agent: PerplexityBot',
    'Allow: /',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
