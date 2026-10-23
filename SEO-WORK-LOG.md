# SEO work log: RK Springs & Wireforms

The running record of SEO work on this site: what was done, why, and what is still open. Add a dated section for each SEO pass. Read this before changing titles, schema, robots, the sitemap or share images.

## Fixed context (read first)

| Item | Value |
|---|---|
| Domain | **rksprings.com** (final, chosen by the client on 23 Oct 2026; purchase and DNS pending) |
| Canonical host | **https://www.rksprings.com** — the bare `rksprings.com` 308-redirects to `www` (`website/vercel.json`) |
| Where it is set | `website/src/data/site.ts` → `site.domain`, `site.origin`. `PUBLIC_SITE_URL` is now only an optional override |
| Language / region | `en-IN`, metric first, ₹ |
| Facts allowed | `CLIENT-PROFILE.md` only. No reviews, ratings, prices, ISO/IATF, PPAP, test lab, export or "best/leading" |

To switch to the bare domain (not recommended), change `site.origin` to `https://rksprings.com`, flip the redirect in `vercel.json`, then rebuild and run `npm run og`.

---

## 23 Oct 2026: full SEO pass (overnight session)

### Note on `SEO-MASTER-PLAYBOOK.md`

The brief said a new file `SEO-MASTER-PLAYBOOK.md` had been added. **It is not in the repository**: not on `main`, not on any branch, not on GitHub. It was probably saved locally and never pushed. This pass therefore follows `CLIENT-PROFILE.md`, `CURSOR-BUILD-PROMPT.md` §5–§7 and `RESEARCH-AND-SEO-BLUEPRINT.md` §4, plus current Google Search guidance.

**When the playbook is pushed:** compare it with the "What was done" list below, and add anything it asks for that is missing.

### What was done

**1. Domain and hosts**
- `site.ts` holds the domain and origin. Every absolute URL uses it: canonical, `og:url`, `og:image`, JSON-LD `@id`s, sitemap, robots.txt and llms.txt.
- Builds no longer fail or emit localhost URLs when `PUBLIC_SITE_URL` is missing.
- Indexable only on Vercel **production**, or locally with `PUBLIC_SITE_URL` set (`src/lib/env.ts`, `astro.config.mjs`). Preview and dev builds stay `noindex`. A client-review build (`PUBLIC_SHOW_TODOS`) is never indexable.
- `vercel.json` adds three redirects:
  - `rksprings.com/*` → `https://www.rksprings.com/*` (308)
  - `/sitemap.xml` → `/sitemap-index.xml`
  - `/index.html` → `/`
- `vercel.json` also sends `X-Robots-Tag: noindex, nofollow` on every `*.vercel.app` host, so the deploy URL can never compete with the domain.

**2. Titles, descriptions and headings (every page)**
- `formatTitle` uses `Page | RK Springs & Wireforms` when that fits in 60 characters, otherwise `Page | RK Springs`. The keyword phrase is never cut to make room for the brand.
- Every indexable title was rewritten, keyword first, mapped to build spec §5 targets. No two pages target the same phrase. Examples:
  - `Torsion Spring Manufacturer in Pune`
  - `Tension & Extension Spring Manufacturer, Pune`
  - `Free Compression Spring Calculator`
  - `HSN Code for Springs and GST Rate`
  - `Spring Price in India: What Decides Cost`
  - `Spring Manufacturer in Talawade, PCMC`
- Home keeps `Spring Manufacturer in Pune`. The location page targets Talawade / PCMC, and the springs hub targets "industrial springs", to avoid cannibalisation.
- Descriptions were tightened where they were short or weak (rate converter, measure guide, calculators, glossary, resources hub, heat treatment, switchgear). All are 70–155 characters.
- Product H1s now carry the product and the place, e.g. "Custom torsion springs, made in Pune".
- Product H2s now name the product with varied wording: "Torsion spring specification", "Where torsion springs are used", "Torsion spring FAQ". This covers spec §7.5, "keyword in one H2", without stuffing.
- Glossary counts in hub copy now come from the data (66 terms), not a hard-coded "60".

**3. Structured data (`src/lib/jsonld.ts`)**
- **Organization + LocalBusiness** (one `@id`):
  - adds `alternateName` (RK Springs, RK Enterprises) and a `description`
  - adds a raster `logo` ImageObject (`/logo.png`, 512×512)
  - folds the opening hours into one `OpeningHoursSpecification` (Thursday still excluded)
  - widens `knowsAbout`
- **WebSite** adds `alternateName` (`RK Springs`, `rksprings.com`), for Google's site-name display.
- **WebPage**: adds `primaryImageOfPage` (the page's share card) and `dateModified` from `page-dates.ts`.
- **Home**: the one-item BreadcrumbList is no longer emitted.
- **Hubs** (springs, industries, capabilities, tools, resources) emit an `ItemList` of their published children, built from `routes.ts`. Draft pages are excluded automatically.
- **Product pages** keep `Service` (name, serviceType, provider, brand, areaServed, url, image) as the page's `mainEntity`.
  - `Product` is **deliberately not used**. Google treats a Product without `offers`, `review` or `aggregateRating` as an invalid item, and we may not publish prices or reviews.
  - Revisit when real reviews or public price bands exist.
- **Industry pages** now emit a `Service` with a `BusinessAudience`, per blueprint §4.8. Capability pages emit a `Service` too.
- **Articles**: the page is a `WebPage` whose `mainEntity` is a separate `TechArticle` (headline, dates, author/publisher = the organization, image).
  - Before this, the page node itself was a TechArticle carrying `breadcrumb` and `primaryImageOfPage`, which schema.org flags.
- **Calculators**: `WebApplication` adds `isAccessibleForFree`, `browserRequirements` and an image. No `offers` (the audit bans them site-wide).
- **Glossary**: each `DefinedTerm` gets an `@id` and `inDefinedTermSet`.
- **Result:** schema.org validator, all 38 indexable pages, **0 errors, 0 warnings**. Unit tests guard "no offers / price / review / rating", "no Product", ItemList contents, the article model and `@id` resolution.

**4. Social share images and icons**
- `npm run og` (`scripts/make-og.mjs`) renders a 1200×630 PNG per public page into `public/og/`.
  - It uses Playwright's Chromium (already a dev dependency) on top of the built page, so it uses the real IBM Plex fonts, the colour tokens and the page's own SVG technical drawing. Pages without a drawing borrow the closest product drawing.
  - No AI imagery and no new dependency.
  - The old pixel-font default card was replaced; it also wrote "AND" for "&".
- The head emits:
  - `og:image` (per page), `og:image:type` and `og:image:alt`, and `twitter:image:alt`
  - `article:published_time` and `modified_time` on guides
  - optional Google and Bing verification meta tags (`PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_BING_SITE_VERIFICATION`)
- Added `favicon.ico` (32 and 48 px), `apple-touch-icon.png`, `icon-192.png` and `icon-512.png`, plus `/site.webmanifest`. The manifest's colours are read from the tokens in `global.css`, so no hex value is hard-coded.
- All icons are rendered from the temporary `favicon.svg`. Re-run `npm run og` when the real logo arrives.

**5. Crawling and indexing**
- `robots.txt` names Googlebot, Bingbot, Applebot, DuckDuckBot and the AI search and answer bots, all allowed, per blueprint §4.13:
  - OpenAI: OAI-SearchBot, ChatGPT-User, GPTBot
  - Perplexity: PerplexityBot, Perplexity-User
  - Anthropic: Claude-SearchBot, Claude-User, ClaudeBot
  - Training opt-out tokens: Google-Extended, Applebot-Extended
  - Others: DuckAssistBot, CCBot
- Noindex pages are deliberately **not** disallowed, so crawlers can see their `noindex`. The training bots are allowed per the blueprint's recommendation; the client can opt out by removing them.
- `llms.txt` is rebuilt in the llms.txt format: summary, facts, then absolute-URL link lists generated from `routes.ts`, so drafts never leak.
  - Also fixed a casing bug: "ex-works talawade", "all over india".
- **IndexNow**:
  - key in `site.ts`, key file `public/bd9d2b2fcc9721684fc2fb79e97dc478.txt`
  - `npm run indexnow` submits every sitemap URL (or the paths you pass)
  - run it after each live deploy
- Sitemap `lastmod` was updated only for pages whose visible copy changed today (`page-dates.ts`).

**6. Internal linking**
- Home now links to the Tools and Resources hubs from page copy, not only from navigation.
- The glossary gained a "Put the terms to work" link block; it previously linked to nothing in its body.
- Other new contextual links:
  - HSN guide → springs hub and wire forms
  - price guide → springs hub
  - rate converter → torsion springs
  - Talawade page → springs and industries hubs
  - conical springs → measuring guide
  - torsion springs → furniture industry
- The 404 page gained a "Popular pages" block (spec §4.7: useful 404 with top links).

**7. `audit-html` now fails the build on:**
- **Head tags**:
  - title over 60 or under 30 characters; description over 155 or under 70
  - `lang` other than `en-IN`
  - an indexable page without an `index` robots meta
- **Canonical and social**:
  - canonical ≠ the `www.rksprings.com` URL
  - `og:url` ≠ canonical
  - `og:image` missing or not built
- **Page structure**:
  - first heading not the H1, or a heading level skipped
  - `<img>` without `alt`, `width` or `height`
- **Links**:
  - link with no accessible text, or vague anchor text ("click here", "read more", …)
  - `target=_blank` without `rel=noopener`
  - orphan pages (no internal links in)
- **Breadcrumbs**: an inner page without visible breadcrumbs or `BreadcrumbList` JSON-LD
- **JSON-LD**: an `@id` reference with no node, or Organization / WebSite missing
- **Sitemap**:
  - a loc not on the production origin, a loc ≠ the page canonical, or a listed page that wasn't built
  - an indexable page missing from the sitemap
- **Leaks**: localhost or `vercel.app` URLs anywhere in the HTML

It **warns** on:
- a page linked only from navigation
- duplicate H1s
- a share card that is missing or stale (H1 changed since `npm run og`)

### Verification (all run on 23 Oct 2026)

| Gate | Result |
|---|---|
| `npm run check` (astro check, ESLint, Prettier) | 0 errors, 0 warnings |
| `npm test` (Vitest) | 62 passed (11 new SEO tests) |
| `npm run test:e2e` (Playwright) | 44 passed |
| `PUBLIC_SITE_URL=https://www.rksprings.com npm run build` → `audit-html` | 41 pages, 38 indexable, 38 sitemap URLs, 0 errors, 0 warnings |
| schema.org validator (38 indexable pages) | 0 errors, 0 warnings |
| Lighthouse mobile, 5 key pages (median of 3) | 100 / 100 / 100 / 100 on all five; LCP 1.35–1.66 s; CLS ≤ 0.001 |
| JS budget | Content pages unchanged (~0 KB external JS) |

### One thing to verify on the first deploy

Vercel builds this Astro project through the Build Output API (`.vercel/output/config.json`). The `vercel.json` headers and redirects (HSTS, CSP, the apex → `www` redirect, the `*.vercel.app` noindex header) are expected to be merged in by Vercel at deploy time; the security headers added in Phase 3 rely on the same behaviour. It cannot be proved from a local build. After the first production deploy, run the `curl -I` checks in `LAUNCH-CHECKLIST.md` §6.

The apex redirect is also set in Vercel → Domains (`rksprings.com` → redirect to `www.rksprings.com`), so it works either way. If the headers are missing, move them into Vercel's project settings or an Astro middleware.

### Decisions you may want to revisit

1. **`www` as the canonical host.** Matches the earlier plan and Vercel's recommended setup. One line to change (see top).
2. **Training crawlers allowed** (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended). Remove them from `src/pages/robots.txt.ts` if the client objects.
3. **No `Product` schema** until real reviews or prices exist (see §3).
4. **Short brand suffix** ("| RK Springs") on long titles, instead of truncating keywords.

### Off-site work the code cannot do (do these at launch)

Full steps are in `LAUNCH-CHECKLIST.md` §1 and §6. In order:

1. Buy `rksprings.com`. In Vercel, add `www.rksprings.com` (primary) and `rksprings.com` (redirect to `www`).
2. Search Console:
   - Add a **Domain** property using a DNS TXT record.
   - Submit `https://www.rksprings.com/sitemap-index.xml`.
   - Inspect `/`, `/springs/torsion-springs/` and `/request-a-quote/`.
3. Bing Webmaster Tools: import from Search Console. Then run `npm run indexnow`.
4. Google Business Profile:
   - Use the exact NAP from the footer, with website `https://www.rksprings.com/`.
   - Primary category "Spring supplier", or the closest available. Add photos after the shoot.
5. Put the GBP, IndiaMART, Justdial and LinkedIn URLs into `site.sameAs` in `src/data/site.ts`. They flow into the Organization schema.
6. When the logo arrives:
   - Replace `public/favicon.svg` and the `Wordmark` component.
   - Run `npm run build && npm run og` to re-render every icon, the logo and the share cards.
   - Commit `public/`.
7. When `sales@rksprings.com` exists, put it first in `site.emails`.

### Content still worth adding (needs client input or review; not built tonight)

These come from blueprint §4.3 and §4.9. They are new pages, not fixes, so per AGENTS rule 11 they wait for review. Keyword targets are in brackets.

- Torsion and double-torsion spring calculator [torsion spring calculator]. Spec §5 lists it as "not in v1".
- Torsion spring end types, leg orientation and wind direction [torsion spring end types].
- Compression spring end types: closed, ground, open [compression spring end types].
- Spring materials guide, SS 302 vs 304 vs 316 [stainless steel spring]. Use only the materials in `CLIENT-PROFILE.md`.
- How to choose a spring manufacturer in Pune [spring manufacturer in pune], local commercial.
- Case studies, once the client gives permission and details.
- A "Reviewed by Rutvik" line on the guides (E-E-A-T), once he has read them. This needs his surname confirmed and consent.
