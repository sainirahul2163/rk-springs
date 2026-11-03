# RK Springs & Wireforms website

Static Astro site deployed on Vercel (project root = `/website`, functions region `bom1`). Read `../AGENTS.md` before changing anything.

**Domain: `rksprings.com`.** The one canonical host is **`https://www.rksprings.com`**; the bare domain 308-redirects to it (`vercel.json`). The origin lives in `src/data/site.ts` (`site.origin`). SEO decisions and the go-live search setup are in `../SEO-WORK-LOG.md`.

Requires **Node.js 22.18 or later** (the `scripts/*.ts` files run with Node’s built-in TypeScript strip).

## Local setup

```bash
cd website
cp .env.example .env
npm install
npx playwright install chromium   # first time only, for e2e
npm run dev
```

Dev server: http://localhost:4321

## Commands

| Command             | What it does                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| `npm run dev`       | Dev server                                                              |
| `npm run build`     | Static build + `audit-html`                                             |
| `npm run preview`   | Serve the build locally                                                 |
| `npm run check`     | `astro check`, ESLint and Prettier                                      |
| `npm run format`    | Format everything with Prettier                                         |
| `npm test`          | Vitest (RFQ validators and calculator formulae)                         |
| `npm run test:e2e`  | Playwright smoke, RFQ (mocked API), calculators, a11y                   |
| `npm run js-budget` | External JS size per built page (must stay under 100 KB)                |
| `npm run lh`        | Mobile Lighthouse on the five §12 pages (median of 3; needs `dist/`)    |
| `npm run todo`      | List every `TODO(client)` marker still in the code                      |
| `npm run og`        | Re-render share cards, favicons and logo into `public/` (needs `dist/`) |
| `npm run indexnow`  | Ping IndexNow (Bing etc.) with every sitemap URL, after a live deploy   |

A production-like local audit:

```bash
PUBLIC_SITE_URL=https://www.rksprings.com npm run build
npm run js-budget
npm run lh
```

## Environment

Copy `.env.example` to `.env`. Secrets stay server-side. `PUBLIC_*` is visible in the browser.

| Variable                                                            | Use                                                                                                                                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`                                                   | Local only: any value rehearses an indexable production build. It never changes URLs (always `https://www.rksprings.com`). Ignored on Vercel; delete it there. |
| `PUBLIC_SHOW_TODOS`                                                 | `true` shows TODO markers, photo placeholders, `/styleguide/` and draft pages (always noindex).                                                                |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`                        | RFQ storage. Leave blank for the `.rfq-dev/` fallback.                                                                                                         |
| `RESEND_API_KEY` / `RFQ_FROM_EMAIL` / `RFQ_NOTIFY_EMAIL`            | Quote emails.                                                                                                                                                  |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`                | Bot check. Skipped when unset.                                                                                                                                 |
| `PUBLIC_GA4_ID` / `PUBLIC_CLARITY_ID`                               | Optional analytics. Scripts load only when set.                                                                                                                |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION` | Optional verification meta tags (a DNS TXT record is preferred).                                                                                               |

Without RFQ keys, `POST /api/rfq` writes JSON and uploaded files to `.rfq-dev/` and still returns a reference.

## Supabase (before a public launch)

1. Create a project. Apply `supabase/migrations/001_rfqs.sql` (RLS on, no public policies).
2. Create a **private** Storage bucket named `rfq-drawings`.
3. Put the URL and service-role key in Vercel env (never in git).
4. Verify a test RFQ lands in `rfqs` and the drawing in the bucket.

## Vercel

- Root directory: `/website`
- Framework: Astro
- Functions region: `bom1`
- Node.js 22.18 or later
- Domains: add `www.rksprings.com` (primary) and `rksprings.com` (redirects to www). Delete any old `PUBLIC_SITE_URL` from the Vercel env (it is ignored)
- Do **not** set `PUBLIC_SHOW_TODOS` on production
- Preview deployments stay noindex (`VERCEL_ENV !== production`), and every `*.vercel.app` host sends `X-Robots-Tag: noindex`
- `/styleguide/` and draft pages (spiral springs) return a real 404 unless `PUBLIC_SHOW_TODOS=true`
- The Vercel team is on the **Hobby** plan. Hobby blocks deployments of a **private** repo when a commit author is not the account owner (e.g. commits authored by Claude). The GitHub repo is **public** since 24 Oct 2026, which lifts that check. If the repo goes private again, use **Redeploy** in the Vercel dashboard after each merge, or upgrade to Pro

## Adding content

**Product (spring type).** Add a row in `src/data/products.ts` and a matching route in `src/data/routes.ts` (`status: 'live'` only when the page exists). Add the page under `src/pages/springs/`. The product template is `src/layouts/ProductLayout.astro`. Put facts only from `CLIENT-PROFILE.md`; unknowns go through `<Todo>`.

**Article.** Add a route in `src/data/routes.ts`, then a page under `src/pages/resources/` that uses `ArticleLayout`. Write the `<title>` keyword-first; `formatTitle` adds `| RK Springs & Wireforms` when it fits in 60 characters and `| RK Springs` otherwise, so keep it at or under 47 characters. Cite sources; do not invent ₹ figures or certificates.

**After adding or renaming any page**, run `npm run build && npm run og` and commit `public/og/`. `audit-html` warns when a share card is missing or stale, and fails the build on SEO errors (title/description length, one H1 first, heading order, canonical = og:url = sitemap loc, breadcrumbs, JSON-LD `@id` references, orphan pages, vague link text, image alt/size).

**Glossary term.** Append an object to `src/data/glossary.ts` with a unique `id` (used as the URL hash). The glossary page and JSON-LD pick it up automatically.

**Industry or capability.** Same pattern: route + page using `IndustryLayout` or `CapabilityLayout`. No customer names without written permission.

Company facts (address, phones, hours) live in `src/data/site.ts`. Do not hard-code them on pages.

## Colour palette

Tokens live in `src/styles/global.css` under `@theme`. Change the hex values there only. Components use token names (`navy-900`, `action-600`, …) and must not contain hard-coded hex.

## Where things live

- `src/data/site.ts`: company facts (from `CLIENT-PROFILE.md`). Never hard-code them in pages.
- `src/data/routes.ts`: every URL. Unpublished pages are never linked in a production build.
- `src/styles/global.css`: design tokens.
- `src/components/diagrams/`: SVG technical drawings.
- `/styleguide/`: internal design-system page. 404 in production; visible in dev and `PUBLIC_SHOW_TODOS` builds (noindex).
