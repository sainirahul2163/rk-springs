# RK Springs & Wireforms website

Static Astro site deployed on Vercel (project root = `/website`, functions region `bom1`). Read `../AGENTS.md` before changing anything.

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

| Command             | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `npm run dev`       | Dev server                                                           |
| `npm run build`     | Static build + `audit-html`                                          |
| `npm run preview`   | Serve the build locally                                              |
| `npm run check`     | `astro check`, ESLint and Prettier                                   |
| `npm run format`    | Format everything with Prettier                                      |
| `npm test`          | Vitest (RFQ validators and calculator formulae)                      |
| `npm run test:e2e`  | Playwright smoke, RFQ (mocked API), calculators, a11y                |
| `npm run js-budget` | External JS size per built page (must stay under 100 KB)             |
| `npm run lh`        | Mobile Lighthouse on the five §12 pages (median of 3; needs `dist/`) |
| `npm run todo`      | List every `TODO(client)` marker still in the code                   |

A production-like local audit:

```bash
PUBLIC_SITE_URL=https://www.rksprings.in npm run build
npm run js-budget
npm run lh
```

## Environment

Copy `.env.example` to `.env`. Secrets stay server-side. `PUBLIC_*` is visible in the browser.

| Variable                                                 | Use                                                                                           |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL`                                        | Canonical origin, no trailing slash. Empty locally. Production builds without it are noindex. |
| `PUBLIC_SHOW_TODOS`                                      | `true` shows TODO markers and photo placeholders (always noindex).                            |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`             | RFQ storage. Leave blank for the `.rfq-dev/` fallback.                                        |
| `RESEND_API_KEY` / `RFQ_FROM_EMAIL` / `RFQ_NOTIFY_EMAIL` | Quote emails.                                                                                 |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`     | Bot check. Skipped when unset.                                                                |
| `PUBLIC_GA4_ID` / `PUBLIC_CLARITY_ID`                    | Optional analytics. Scripts load only when set.                                               |

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
- Set `PUBLIC_SITE_URL` to the live origin (e.g. `https://www.rksprings.in`)
- Do **not** set `PUBLIC_SHOW_TODOS` on production
- Preview deployments stay noindex (`VERCEL_ENV !== production`)

## Adding content

**Product (spring type).** Add a row in `src/data/products.ts` and a matching route in `src/data/routes.ts` (`status: 'live'` only when the page exists). Add the page under `src/pages/springs/`. The product template is `src/layouts/ProductLayout.astro`. Put facts only from `CLIENT-PROFILE.md`; unknowns go through `<Todo>`.

**Article.** Add a route in `src/data/routes.ts`, then a page under `src/pages/resources/` that uses `ArticleLayout`. Keep the `<title>` at or under 35 characters (the brand suffix adds 25). Cite sources; do not invent ₹ figures or certificates.

**Glossary term.** Append an object to `src/data/glossary.ts` with a unique `id` (used as the URL hash). The glossary page and JSON-LD pick it up automatically.

**Industry or capability.** Same pattern: route + page using `IndustryLayout` or `CapabilityLayout`. No customer names without written permission.

## Colour palette

Tokens live in `src/styles/global.css` under `@theme`. Change the hex values there only. Components use token names (`navy-900`, `action-600`, …) and must not contain hard-coded hex.

## Where things live

- `src/data/site.ts`: company facts (from `CLIENT-PROFILE.md`). Never hard-code them in pages.
- `src/data/routes.ts`: every URL. Unpublished pages are never linked in a production build.
- `src/styles/global.css`: design tokens.
- `src/components/diagrams/`: SVG technical drawings.
- `/styleguide/` (noindex): every component and drawing.
