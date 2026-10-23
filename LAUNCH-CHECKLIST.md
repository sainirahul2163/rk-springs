# Launch checklist: RK Springs & Wireforms

Phase 7 quality gates were run on 4 Oct 2026 and re-run after the SEO pass on 23 Oct 2026 against a production-like build (`PUBLIC_SITE_URL=https://www.rksprings.com`, `PUBLIC_SHOW_TODOS` unset). This file is what to do before the site is public. Do not treat a green local build as “live”.

## 1. Do not launch until these exist

- [ ] Domain **rksprings.com** bought (decided 23 Oct 2026). In Vercel → Project → Domains add `www.rksprings.com` (primary) and `rksprings.com` (set to redirect to `www`). At the registrar: `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com` (or whatever Vercel shows), or move nameservers to Vercel.
- [ ] Nothing else to configure for SEO: the code already uses `https://www.rksprings.com` for every canonical, the sitemap, robots.txt, JSON-LD, share cards and llms.txt. `PUBLIC_SITE_URL` stays empty.
- [ ] Logo file (wordmark + favicon). The coil mark is temporary.
- [ ] Confirm `+91 72620 92185` is the public main number, or give the real one.
- [ ] Pick the public email (plan a domain address such as `sales@<domain>`).
- [ ] ZED level (Bronze / Silver / Gold) and a PDF of the certificate.
- [ ] Factory-gate map pin (lat/long). Maps currently search the address.
- [ ] Supabase project + `supabase/migrations/001_rfqs.sql` applied + private bucket `rfq-drawings`.
- [ ] Resend sending domain verified; `RFQ_FROM_EMAIL` and `RFQ_NOTIFY_EMAIL` set.
- [ ] Cloudflare Turnstile site key + secret.
- [ ] Which email receives RFQ notifications.

Spiral springs stays **draft-gated** (404 in production) until you confirm wire vs flat-strip. That is not a launch blocker if the rest of the catalogue is enough.

## 2. Vercel

- [ ] Project root = `/website`. Framework = Astro. Functions region = `bom1`.
- [ ] Production env only:

  | Name | Notes |
  |---|---|
  | `PUBLIC_SITE_URL` | Leave empty (the code defaults to `https://www.rksprings.com`) |
  | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Server only |
  | `RESEND_API_KEY` / `RFQ_FROM_EMAIL` / `RFQ_NOTIFY_EMAIL` | Server only |
  | `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | |
  | `PUBLIC_GA4_ID` | Optional |
  | `PUBLIC_CLARITY_ID` | Optional |
  | `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION` | Optional (prefer DNS verification) |

- [ ] Do **not** set `PUBLIC_SHOW_TODOS` on production.
- [ ] Preview deployments stay noindex (`VERCEL_ENV !== production`).
- [ ] Confirm a production deploy is indexable: `<meta name="robots">` is absent or `index`, sitemap lists only 200 pages, `/springs/spiral-springs/` is 404.

## 3. RFQ path (must work before ads or IndiaMART)

- [ ] Submit a real drawing from `/request-a-quote/` on production.
- [ ] Row lands in `rfqs`; file lands in `rfq-drawings`.
- [ ] Notify email arrives; reply-to is the buyer.
- [ ] Thank-you URL is `?id=RFQ-YYYYMMDD-XXXX` and WhatsApp still works if email fails.
- [ ] Honeypot `website` is ignored. Turnstile fails closed when the secret is set.
- [ ] Vercel body limit is smaller than 25 MB. Tell buyers to WhatsApp large drawings until direct-to-storage exists.

Without Supabase/Resend the API writes `.rfq-dev/` and still returns a reference. That is for local only.

## 4. Content you can ship without (hidden in production)

`TODO(client)` and photo placeholders are stripped from the production HTML (`audit-html` fails the build if they leak). Open items are listed in `CONTENT-REVIEW.md` §2 and via `npm run todo` (49 markers). None of them invent facts; they leave gaps.

Worth filling soon after launch, not on the critical path:

- Machine list and name-plate photos
- End / hook / leg types actually formed, and size limits
- Sample lead time and how development charges are calculated
- Founder surname + short story, team size
- Technical review of the glossary and six articles (“Reviewed by Rutvik”)
- CA confirmation of HSN 7320 / 7320 20 vs wire forms
- IndiaMART / Justdial / GBP URLs for `sameAs`
- Factory photo and video shoot (no stock, no AI)

## 5. Quality gates (Phase 7, 4 Oct 2026)

Commands (from `/website`):

```bash
npm test                  # Vitest
npm run check             # astro check, ESLint, Prettier
PUBLIC_SITE_URL=https://www.rksprings.com npm run build
npm run js-budget
npm run test:e2e
npm run lh                # needs dist/; median of 3 mobile runs
npm run todo
```

| Gate | Result |
|---|---|
| `astro check` / ESLint / Prettier | 0 errors |
| Vitest | 48 passed |
| Playwright | 43 passed (smoke, RFQ mocked API, calculator, keyboard, overflow at 360–1440) |
| `audit-html` | 42 pages, 38 sitemap URLs, 0 errors. 1 H1, titles ≤60, descriptions ≤155, absolute canonicals, JSON-LD `@graph` parses, no `offers` / `aggregateRating`, no visible `TODO(client)` |
| JS budget | Content pages under 100 KB (largest: glossary 23.1 KB inline). Islands: RFQ 331 KB, contact 316 KB, tools 239–246 KB (React; allowed) |
| Keyboard | Skip link, Springs mega-menu, mobile nav, RFQ step 1→2, calculator fields |
| Overflow | 360, 390, 768, 1024, 1280, 1440 on home, torsion, measure article, calculator, RFQ — no horizontal scroll |

### Lighthouse mobile (simulated Slow 4G, median of 3 cold runs)

| Page | P | A | BP | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 1.36 s | 0.024 |
| `/springs/torsion-springs/` | 100 | 100 | 100 | 100 | 1.35 s | 0.004 |
| `/resources/how-to-measure-a-spring/` | 100 | 100 | 100 | 100 | 1.20 s | 0.000 |
| `/tools/compression-spring-calculator/` | 100 | 98 | 100 | 100 | 1.51 s | 0.002 |
| `/request-a-quote/` | 100 | 100 | 100 | 100 | 1.36 s | 0.000 |

All five meet §12 on that median: every category ≥ 95, LCP < 1.8 s, CLS < 0.05. Calculator accessibility 98 is the lowest category score (still above 95).

### Re-run after the SEO pass (23 Oct 2026, same method)

| Gate | Result |
|---|---|
| `astro check` / ESLint / Prettier | 0 errors, 0 warnings |
| Vitest | 62 passed (adds 11 SEO tests: title fallback, domain, share-card slug, JSON-LD rules) |
| Playwright | 44 passed |
| `audit-html` | 41 pages (38 indexable), 38 sitemap URLs, 0 errors, 0 warnings, with the stricter SEO checks listed in `SEO-WORK-LOG.md` |
| schema.org validator | 38 / 38 indexable pages: 0 errors, 0 warnings |
| JS budget | Content pages unchanged (largest island: RFQ 332 KB) |

| Page | P | A | BP | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 1.65 s | 0.000 |
| `/springs/torsion-springs/` | 100 | 100 | 100 | 100 | 1.50 s | 0.001 |
| `/resources/how-to-measure-a-spring/` | 100 | 100 | 100 | 100 | 1.35 s | 0.000 |
| `/tools/compression-spring-calculator/` | 100 | 100 | 100 | 100 | 1.50 s | 0.000 |
| `/request-a-quote/` | 100 | 100 | 100 | 100 | 1.66 s | 0.000 |

LCP moves ±0.3 s between runs on this machine; every run stayed under 1.8 s.

Island pages (RFQ and the calculators) ship 239–331 KB of React. A later median on the same machine has read 1.80–1.95 s LCP on those two URLs while categories stayed ≥ 99. Content pages stay at 1.20–1.35 s. Quote the table above; if PageSpeed shows ~2 s on `/request-a-quote/` or a calculator, re-run `npm run lh`.

## 6. After go-live

- [ ] `curl -I https://rksprings.com/` → one 308 to `https://www.rksprings.com/`. `curl -I http://www.rksprings.com/` → one redirect to https.
- [ ] `curl -I https://<project>.vercel.app/` shows `x-robots-tag: noindex, nofollow` (the deploy URL must not compete with the domain).
- [ ] Search Console: add a **Domain** property for `rksprings.com` (DNS TXT record), submit `https://www.rksprings.com/sitemap-index.xml`.
- [ ] Bing Webmaster Tools: import from Search Console (one click), confirm the sitemap. Bing also feeds ChatGPT search and Copilot.
- [ ] Run `npm run build && npm run indexnow` once from `/website` (key file `public/bd9d2b2fcc9721684fc2fb79e97dc478.txt` must load on the live site). Repeat after each content release.
- [ ] Google Business Profile: website field = `https://www.rksprings.com/`, same name, address and phone as the footer. Then add the GBP, IndiaMART and Justdial URLs to `site.sameAs` in `src/data/site.ts`.
- [ ] Rich Results Test on `/`, `/springs/torsion-springs/`, `/resources/how-to-measure-a-spring/`: expect Breadcrumbs, FAQ and Organization detected, 0 errors.
- [ ] Fetch `/`, `/springs/torsion-springs/`, `/request-a-quote/` as Googlebot.
- [ ] Confirm `robots.txt` points at the sitemap and does not noindex.
- [ ] Click-test WhatsApp, tel, and the RFQ from a phone.
- [ ] Only then turn on GA4 / Clarity if you want them.

## 7. What this phase did not do

- No real logo, photos, or customer names.
- No ISO / IATF / lab / PPAP / CPK claims.
- No public ₹ price bands.
- No IndiaMART widget, chat bubble, carousel, or third-party script beyond optional GA4/Clarity.
- Per-page OG images (satori) were not added; `og-default.png` is used.
- Direct-to-Supabase uploads for large drawings were not added.
