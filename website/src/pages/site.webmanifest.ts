import type { APIRoute } from 'astro';
import tokens from '@/styles/global.css?raw';
import { site } from '@/data/site';

/** Read a colour token from global.css so the manifest follows the palette. */
function token(name: string): string {
  const m = tokens.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
  if (!m?.[1]) throw new Error(`site.webmanifest: token --color-${name} not found`);
  return m[1].trim();
}

export const GET: APIRoute = () => {
  const manifest = {
    name: site.brand,
    short_name: site.shortBrand,
    description: 'Precision springs and wire forms made to drawing or sample in Talawade, Pune.',
    lang: 'en-IN',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: token('white'),
    theme_color: token('navy-900'),
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
