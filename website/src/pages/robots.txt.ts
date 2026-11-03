import type { APIRoute } from 'astro';
import { site } from '@/data/site';
import { absoluteUrl } from '@/lib/env';

/**
 * Search and AI answer crawlers are allowed explicitly (blueprint §4.13: be citable in
 * Google AI Overviews, ChatGPT, Perplexity, Claude, Copilot). A named group replaces the `*`
 * group for that bot, so each group repeats the /api/ rule.
 * Noindex pages (thank-you, 404) are not blocked here: a crawler must fetch them to see noindex.
 */
const NAMED_BOTS = [
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'DuckAssistBot',
  'CCBot',
];

export const GET: APIRoute = () => {
  const body = [
    `# ${site.brand} — ${absoluteUrl('/')}`,
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    '# Search engines and AI answer engines',
    ...NAMED_BOTS.map((b) => `User-agent: ${b}`),
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
