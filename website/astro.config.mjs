// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { lastmodForPath } from './src/data/page-dates.ts';
import { site as company } from './src/data/site.ts';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
/** Explicit override; otherwise the final domain (https://www.rksprings.com). */
const siteUrl = (process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');
const site = siteUrl || company.origin;
/** Same gate as INDEXABLE in src/lib/env.ts. */
const indexable =
  (process.env.VERCEL_ENV === undefined
    ? Boolean(siteUrl)
    : process.env.VERCEL_ENV === 'production') &&
  (process.env.PUBLIC_SHOW_TODOS || env.PUBLIC_SHOW_TODOS) !== 'true';

/** Built pages that must not appear in the sitemap even when the build is indexable. */
const sitemapExclude = new Set([
  '/styleguide/',
  '/springs/spiral-springs/',
  '/404/',
  '/request-a-quote/thank-you/',
  '/llms.txt',
  '/landing/',
]);

export default defineConfig({
  site,
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        if (!indexable) return false;
        const path = new URL(page).pathname;
        return !sitemapExclude.has(path) && !path.startsWith('/api/');
      },
      serialize: (item) => ({
        ...item,
        lastmod: lastmodForPath(new URL(item.url).pathname),
      }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  devToolbar: { enabled: false },
});
