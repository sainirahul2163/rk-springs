# Cursor build prompt: RK Springs & Wireforms website

## How to use this (for Rahul)

1. Open the whole `rk spring` folder in Cursor. Cursor automatically picks up the rules in `AGENTS.md`.
2. Open **Agent** mode and pick the strongest model available.
3. Paste the **kickoff prompt** below. Cursor will plan (Phase 0) and stop.
4. Review each phase, then reply with the matching **phase prompt** from the list further down.
5. Before Phase 4, have these ready: a Supabase project, a Resend API key with a verified sending domain, and Cloudflare Turnstile keys.

### Kickoff prompt (paste into Cursor)

```
You are the lead engineer, product designer and technical-SEO specialist for the
RK Springs & Wireforms website (a spring and wire-form manufacturer in Talawade, Pune).

Before doing anything, read these files completely:
1. AGENTS.md: rules you must always follow
2. CLIENT-PROFILE.md: confirmed client facts (highest authority; overrides everything)
3. CURSOR-BUILD-PROMPT.md: the full build spec and phase plan (sections 1–14)
4. The sections of RESEARCH-AND-SEO-BLUEPRINT.md that the spec references
   (§1.2–1.4, §4.3, §4.5–4.10, §5.3–5.6)

Build the site in /website exactly as specified.

The quality bar: this must be the best spring-manufacturer website in India. It has to be
faster, clearer, more technically useful and more trustworthy than every competitor in the
blueprint, with a distinctive blue-and-white "engineering blueprint" design that doesn't
look like a template.

Never invent facts. Mark unknowns as TODO(client).

Work one phase at a time. Do PHASE 0 ONLY now: give me your build plan, the final
sitemap, the component list, and every question, conflict or risk you find in the docs.
Then stop and wait for my go-ahead.
```

### Phase prompts (send these one at a time after reviewing each phase)

| After | Send |
|---|---|
| Phase 0 approved | `Proceed to Phase 1. Re-read CURSOR-BUILD-PROMPT.md §2–4 and §13 first. Build the /styleguide page so I can review the look and feel before any real page.` |
| Phase 1 approved | `Proceed to Phase 2. Re-read §5–6 and §10. Write real, specific copy, with no lorem ipsum.` |
| Phase 2 approved | `Proceed to Phase 3. Re-read §7. Add the HTML audit script and show me its output.` |
| Phase 3 approved | `Proceed to Phase 4. Re-read §8. Use the dev fallback until I add keys to .env.` |
| Phase 4 approved | `Proceed to Phase 5. Re-read §9. Show me the unit-test results for every formula.` |
| Phase 5 approved | `Proceed to Phase 6. Re-read §5, §6 and §10.` |
| Phase 6 approved | `Proceed to Phase 7. Re-read §12. Run every quality gate and report the numbers.` |

### Extra prompts that raise quality

- **Design polish pass:** `Act as a senior product designer who has designed for Stripe and Linear. Review /styleguide, Home and one product page at 360px and 1280px. List the 15 biggest visual and UX improvements, ranked by impact (hierarchy, spacing rhythm, typography, alignment, contrast, consistency, the blueprint motif). Implement the top 10 without breaking AGENTS.md.`
- **SEO audit pass:** `Act as a technical-SEO auditor. Crawl the built /website/dist output. For every page, report title and meta length, H1 count, canonical, JSON-LD validity, internal links in and out, word count and target keyword (per §5). Fix every issue and re-run.`
- **Copy review pass:** `Act as an engineering copy editor. Check every page against CLIENT-PROFILE.md. Flag and fix any claim that isn't backed by it (certifications, testing, MOQ, years, customers). List what you changed.`

---

# FULL BUILD SPECIFICATION

## 1. Mission and definition of "top-notch"

**Mission:** an SEO-first B2B website that ranks #1 in Pune for torsion, double torsion, tension/extension, compression, conical and spiral springs and wire forms, and turns visitors into qualified RFQs (requests for quotation) through the form, WhatsApp or a phone call.

"Top-notch" means all of the following:
- **Fastest in the category.** Content pages ship close to 0 KB of JS. LCP is under 1.8 s on mobile 4G. Lighthouse scores are ≥ 95 in every category.
- **Most useful content.** Real engineering depth: diagrams, spec tables, end types, materials, design tips, calculators. No fluff.
- **Most trustworthy.** Honest, specific facts; clear terms (MOQ, quote time, payment, ex-works delivery); no fake claims; full company details (name, address, phone, GSTIN, Udyam).
- **Distinctive design.** A blue-and-white "engineering blueprint" look that's consistent and polished at every breakpoint, from 360 px to 1440 px+.
- **Perfect technical SEO.** Clean structure, a structured-data graph, sitemap, canonicals, internal linking.
- **Accessible.** WCAG 2.2 AA throughout.

## 2. Tech stack (fixed unless Rahul says otherwise)

| Concern | Choice |
|---|---|
| Framework | **Astro** (latest stable), `output: 'static'` with **@astrojs/vercel** adapter; only `/api/*` routes use `export const prerender = false` |
| Language | TypeScript (strict) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`). Tokens are defined in CSS with `@theme`. No hard-coded hex values in components |
| Content | **Astro Content Collections** (Zod schemas) + **@astrojs/mdx** |
| Interactivity | **@astrojs/react**, used ONLY for islands: calculators, RFQ form, mobile nav if needed. Use `client:visible` / `client:idle`. Everything else is zero-JS Astro components |
| Images | `astro:assets` (`<Image>` / `<Picture>`, AVIF + WebP) |
| Fonts | Self-hosted **IBM Plex Sans** (400/500/600) + **IBM Plex Mono** (400/500) via Fontsource, Latin subset, `font-display: swap`, preload the body weight |
| Icons | Lucide icons as inline SVG components (1.5 px stroke, `currentColor`) |
| SEO | `@astrojs/sitemap`, a custom `<SEO>` component, JSON-LD builders in `src/lib/seo.ts` (typed with `schema-dts`) |
| Forms backend | Astro API route → **Zod** → **Cloudflare Turnstile** → **Supabase** (Postgres + private Storage) → **Resend** emails |
| Tests | **Vitest** (calculators, validators) · **Playwright** (smoke + RFQ flow with mocked backend) · Lighthouse CI budgets |
| Quality | ESLint + Prettier + `astro check` |
| Hosting | **Vercel** (project root = `/website`, functions region `bom1`) |

> If Rahul asks for Next.js instead, use Next.js App Router with full static generation and keep every other requirement the same. The default is Astro: it ships near-zero JS, which is the biggest Core Web Vitals advantage over the competitors.

`astro.config`: set `site` from `PUBLIC_SITE_URL`, `trailingSlash: 'always'`, `build.format: 'directory'`.

## 3. Project structure

```
website/
  astro.config.mjs · package.json · tsconfig.json · vercel.json · .env.example · README.md
  src/
    data/
      site.ts          # single source of truth: brand, legal name, address, phone, hours, GSTIN, Udyam, socials, IDs
      navigation.ts    # header, footer, mega-menu
      materials.ts     # typical material properties for calculators
    content/           # collections: springs, wireforms, industries, capabilities, resources, glossary
    components/
      layout/          # Header, MegaMenu, MobileNav, MobileActionBar, Footer (title block), Breadcrumbs
      ui/              # Button, Card, Badge, SpecTable, FAQ, Callout, ProcessSteps, TrustBar, CTASection, Todo, PhotoPlaceholder
      diagrams/        # SVG technical drawings: Torsion, DoubleTorsion, Extension, Compression, Conical, Spiral, WireForm, DimensionLine
      seo/             # SEO, JsonLd
      rfq/             # RfqForm (React island), file upload, step components
      tools/           # calculator islands + shared NumberField / ResultPanel
    layouts/           # BaseLayout, PageLayout, ArticleLayout, ToolLayout
    lib/               # seo.ts, analytics.ts, validation.ts (shared Zod), calculators/*.ts, rfq-code.ts
    pages/             # routes (see §5), api/rfq.ts, styleguide.astro (noindex)
    styles/global.css  # @theme tokens, base, prose
  public/              # favicons, og-default.png, llms.txt
  supabase/migrations/001_rfqs.sql
  scripts/             # audit-html.ts (SEO checks on dist), list-todos.ts
  tests/               # vitest + playwright
```

Put `CONTENT-REVIEW.md` and, at the end, `LAUNCH-CHECKLIST.md` in the **repo root**.

## 4. Design system: "Engineering blueprint" in blue and white

### 4.1 Colour tokens (client wants blue and white; may change after the logo arrives)

Define these once in `@theme` (e.g. `--color-navy-950`) and use them only through utilities or CSS variables.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `navy-950` | `#071A33` | Footer background | white text 17.4:1 |
| `navy-900` | `#0B2545` | Dark sections, H1/H2 colour, header text | white text 15.4:1 |
| `blue-800` | `#123A6B` | Secondary dark | white text 11.4:1 |
| `blue-700` | `#1D4E89` | Links, icons, H3, outline buttons | 8.4:1 on white |
| `action-600` | `#1A56DB` | **Primary button** background (white text), focus ring | 6.2:1 |
| `action-700` | `#1E40AF` | Primary button hover and active | 8.7:1 |
| `blue-400` | `#6EA8FE` | Links and accents **on dark** backgrounds | 6.4:1 on navy |
| `blue-300` | `#9CC3F5` | Secondary text on dark backgrounds | 8.5:1 on navy |
| `blue-100` | `#DCE9F8` | Badges, chips, selected states | navy text 12.5:1 |
| `blue-50` | `#EEF4FB` | Tinted sections, table zebra rows | — |
| `grid` | `#C9DAF0` | Blueprint grid lines (decorative only) | — |
| `ink` | `#1F2933` | Body text | 14.8:1 |
| `slate` | `#52606D` | Secondary text | 6.5:1 |
| `border-strong` | `#7B8794` | Input borders, meaningful outlines | 3.7:1 (UI) |
| `border` | `#E4E7EB` | Dividers, card borders (decorative) | — |
| `surface` | `#F5F7FA` | Alternate section background | — |
| `white` | `#FFFFFF` | Page background, product photo background | — |
| `success` / `warning` / `error` | `#1B7F3B` / `#B45309` / `#B42318` | Form and calculator states (always icon + text) | ≥ 5:1 |
| `whatsapp` | `#25D366` | WhatsApp button background, **navy-900 text only** | 7.8:1 (never white text: 2.0:1) |

**Rules**
- On light sections the primary button is `action-600` with white text.
- On dark sections the primary button is white with `navy-900` text.
- Body-text links are always underlined.
- Only one primary CTA style across the site.

### 4.2 Typography

- **IBM Plex Sans** for UI and body text. **IBM Plex Mono** for specs, numbers, units, eyebrow labels, breadcrumbs, table values and calculator results.
- **Fluid scale:**
  - H1 `clamp(2rem, 1.35rem + 2.6vw, 3.5rem)` / 1.1 / weight 600 / tracking −0.015em
  - H2 `clamp(1.625rem, 1.3rem + 1.3vw, 2.5rem)` / 1.15 / 600
  - H3 1.375rem / 1.3 / 600
  - Body 1.0625rem / 1.65
  - Small 0.875rem
  - Eyebrow: mono 0.8125rem, uppercase, tracking 0.08em
- Prose max width 70ch. Product and spec tables use `font-variant-numeric: tabular-nums`.

### 4.3 Layout

- Container max-width 1240 px. Side padding 20 / 32 / 40 px at mobile / ≥768 / ≥1280.
- 12-column grid on desktop. Section rhythm is 64 px on mobile and 96 px on desktop.
- 4 px spacing base. Corner radius 4 px on controls and 8 px on cards (crisp and engineered, not bubbly).
- 1 px borders. **No drop shadows**, except a subtle shadow on the sticky header after scroll and on menus.

### 4.4 Signature elements (these make it look unlike any competitor)

1. **Blueprint grid:**
   - A CSS-only background grid: 24 px minor lines, 120 px major lines, using `grid` at reduced opacity, fading out at the edges with a mask.
   - Use it in the hero, tool pages and selected section dividers. Never put it behind long body text.
2. **Dimension lines:** SVG annotations with thin lines, tick or arrow ends and mono labels (e.g. `Ø 0.40–2.50 mm`, `Quote ≤ 24 h`), placed around the hero drawing and product visuals.
3. **Technical line drawings:**
   - Make one SVG component per product (torsion, double torsion, extension with hooks, compression closed-and-ground, conical, spiral, wire-form clip/hook).
   - Style: line art, `stroke="currentColor"`, 1.5 px, consistent viewBox and perspective.
   - Use them in cards, heroes, end-type guides and the mega-menu.
   - **Hero drawing:** a large double torsion spring with dimension callouts and a one-time stroke "draw-on" animation (skip it under `prefers-reduced-motion`).
4. **Spec-sheet styling:** tables with a slate label column, mono values and `blue-50` zebra rows. They should feel like an engineering datasheet.
5. **Section eyebrows:** subtle mono index labels such as `01 · PRODUCTS`.
6. **Footer "title block":** a bottom strip styled like an engineering-drawing title block (mono, ruled cells). It holds the brand, "a brand of RK Enterprises", GSTIN, Udyam no., "Est. 2017" and the Talawade, Pune address. It doubles as a trust signal.

**Quality bar for references (for inspiration only; don't copy):** Stripe and Linear for typographic polish and restraint; leespring.com and centuryspring.com for B2B product-page depth.

### 4.5 Components (build all of them in Phase 1 on `/styleguide`)

- **Header:**
  - Sticky, white, 1 px bottom border.
  - Nav order: Springs (mega-menu showing the six spring types with mini drawings, plus Wire forms), Industries, Capabilities, Tools, Resources, About, Contact.
  - Right side: phone link and a **"Get a quote"** button.
- **MobileNav:** an accessible disclosure menu.
- **MobileActionBar:** sticky at the bottom on screens under 768 px, with three equal buttons: Call / WhatsApp / Get quote. Hidden on the RFQ page.
- **Other layout and content components:**
  - Footer (title block), Breadcrumbs
  - Button variants: primary, secondary/outline, ghost, inverse, whatsapp
  - Card variants: product, industry, article, tool
  - SpecTable, ProcessSteps (numbered 01–05 with a connecting dimension line), FAQ (`<details>`), TrustBar, CTASection
  - Callout (info / warning), Badge, PhotoPlaceholder, Todo, RelatedLinks, TableOfContents (long guides), Prose styles
- **Calculator UI:** NumberField with unit suffix, Select, ResultPanel, Warning list.
- **States:** every component needs hover, focus-visible, active and disabled (avoid disabled buttons; validate on submit instead).

### 4.6 Motion

- Transitions of 150–250 ms ease-out on hover and focus only.
- No parallax, no scroll-jacking, no carousels, no autoplay.
- The only "show-off" motion is the hero line-drawing animation.
- Everything respects `prefers-reduced-motion`.

### 4.7 Imagery

- Until the factory shoot, use `<PhotoPlaceholder ratio caption>`: a `blue-50` box with the blueprint grid, a camera icon and a caption such as "Photo: double torsion springs on white background (after factory shoot)", plus a `TODO(client)`.
- **No stock photos and no AI-generated photos.**
- Final photos must be on white or light grey. Alt text describes the product and its spec.
- **Temporary logo:** a text wordmark "RK Springs & Wireforms" in Plex Sans 600 with a small coil glyph SVG. Mark it `TODO(client): replace with the real logo`.

## 5. Sitemap v1 (launch)

| # | URL | Template | Primary target keyword(s) |
|---|---|---|---|
| 1 | `/` | Home | spring manufacturers in pune · spring company in pune |
| 2 | `/springs/` | Hub | industrial spring manufacturers in pune |
| 3 | `/springs/torsion-springs/` | Product | torsion spring manufacturers in pune / india |
| 4 | `/springs/double-torsion-springs/` | Product | double torsion spring manufacturer |
| 5 | `/springs/extension-springs/` | Product | tension spring manufacturers in pune · extension spring manufacturer |
| 6 | `/springs/compression-springs/` | Product | compression spring manufacturer in pune |
| 7 | `/springs/conical-springs/` | Product | conical spring manufacturers in pune |
| 8 | `/springs/spiral-springs/` | Product | spiral spring manufacturers in pune (TODO(client): which spiral type) |
| 9 | `/wire-forms/` | Product hub | wire form manufacturer in pune · custom wire forms |
| 10 | `/industries/` | Hub | — |
| 11 | `/industries/automotive-springs/` | Industry | automotive springs |
| 12 | `/industries/electrical-switchgear-springs/` | Industry | switchgear springs · mcb springs |
| 13 | `/industries/instrumentation-springs/` | Industry | springs for level and float switches |
| 14 | `/industries/furniture-springs/` | Industry | furniture springs |
| 15 | `/capabilities/` | Hub | custom spring manufacturer |
| 16 | `/capabilities/spring-coiling-forming/` | Capability | — |
| 17 | `/capabilities/prototype-development/` | Capability | development runs (charged) |
| 18 | `/capabilities/reverse-engineering/` | Capability | spring from sample · reverse engineering |
| 19 | `/capabilities/heat-treatment-grinding/` | Capability | stress relieving · end grinding (finishing via partners) |
| 20 | `/quality/` | Info | factual and minimal (see CLIENT-PROFILE §4) |
| 21 | `/about/` | About | brand |
| 22 | `/ordering/` | Info | "Ordering with us": MOQ, quote time, payment, ex-works, GST invoice |
| 23 | `/request-a-quote/` | RFQ | — |
| 24 | `/request-a-quote/thank-you/` | Utility (noindex) | — |
| 25 | `/contact/` | Contact | spring manufacturer near me (via local signals) |
| 26 | `/locations/talawade-pcmc/` | Location (genuine, unique) | spring manufacturer in talawade / pimpri chinchwad |
| 27 | `/tools/` | Hub | spring calculator |
| 28 | `/tools/compression-spring-calculator/` | Tool | compression spring calculator (metric) |
| 29 | `/tools/extension-spring-calculator/` | Tool | extension / tension spring calculator |
| 30 | `/tools/spring-rate-converter/` | Tool | spring rate calculator n/mm · unit converter |
| 31 | `/resources/` | Hub | — |
| 32 | `/resources/spring-glossary/` | Glossary | spring terms |
| 33 | `/resources/hsn-code-gst-springs/` | Article | compression spring hsn code and gst rate |
| 34 | `/resources/how-to-measure-a-spring/` | Article | how to measure spring |
| 35 | `/resources/torsion-vs-extension-vs-compression-springs/` | Article | torsion vs extension spring |
| 36 | `/resources/what-is-a-double-torsion-spring/` | Article | what is double torsion spring |
| 37 | `/resources/spring-price-guide-india/` | Article | spring price in india (cost factors; no invented ₹ figures) |
| 38 | `/resources/extension-spring-end-types/` | Article | extension spring end types / hook types |
| 39 | `/privacy-policy/` · `/terms/` | Legal | — |
| 40 | `404` | Utility | — |

**Not in v1** (later, and only with real content):
- torsion and double-torsion calculator
- wire-form sub-pages
- more location pages (Chakan, Bhosari)
- defence page (needs client confirmation)
- case studies, parts gallery, CAD downloads (after the shoot)

**Never build:** rolling-shutter, heavy-duty, agriculture, die-spring, export or city-swap doorway pages.

## 6. Page templates (section order)

### 6.1 Home
1. Header
2. **Hero** on the blueprint grid:
   - Eyebrow: `PRECISION SPRINGS · WIRE Ø 0.40–2.50 MM`
   - H1 containing "spring manufacturer" and "Pune" (e.g. "Precision spring and wire-form manufacturer in Pune")
   - Subline: torsion and double torsion specialists, made to drawing or sample
   - CTAs: **Get a quote in 24 hours** (primary), **WhatsApp us** (whatsapp), and an "Upload a drawing" text link
   - TrustBar: Since 2017 · ZED certified · Quote within 24 h · Supply across India
   - Right side: the animated double-torsion drawing with dimension callouts
3. Product grid: torsion, double torsion, extension, compression, conical, spiral, wire forms. Each card has its drawing, a one-line description and mono spec chips.
4. "Why buyers choose RK Springs & Wireforms": 4 true proof points:
   - quote in 24 h
   - development of critical, tight-tolerance parts
   - reverse engineering from a sample
   - since 2017, ZED certified
5. How it works (ProcessSteps): send drawing or sample → quote in 24 h → development sample → approval → production → dispatch (ex-works Talawade)
6. Capability snapshot (SpecTable): wire Ø, materials, in-house processes, MOQ, quote time, supply area
7. Industries served: automotive, electrical and switchgear, instrumentation, furniture, and more
8. Tools and resources teaser (3 calculators + 3 guides)
9. FAQ (6–8)
10. Location block: full company details, hours (Thursday closed), static map image linking to Google Maps (TODO(client) coordinates), Call / WhatsApp
11. Final CTA section
12. Footer

### 6.2 Spring product page (the most important template)
1. Breadcrumbs. H1 + value line + CTAs. Drawing plus PhotoPlaceholder.
2. **Quick spec table:**
   - wire Ø 0.40–2.50 mm
   - materials (only the ones in CLIENT-PROFILE)
   - end / leg / hook options
   - finishes (via partners)
   - MOQ 5,000–10,000 pcs (development runs charged)
   - quote in 24 h
3. What it is and how it works (diagram)
4. Types, end types or leg types (diagram grid)
5. Materials table: material · standard · when to choose it
6. Design tips + "What to put on your drawing" checklist
7. Applications and industries (internal links)
8. How we make it: honest process (coiling/forming → stress relieving → grinding where relevant → finishing via partners → dispatch)
9. RFQ checklist + inline CTA to `/request-a-quote/?type=<slug>`
10. FAQs (5–8, direct 40–80-word answers)
11. Related: other spring types, the matching calculator, 2–3 guides

Each product page has **900–1,500 words of genuinely useful content**. Draw the technical facts from blueprint §1.2–1.3, and keep them consistent with CLIENT-PROFILE.

### 6.3 Other templates
- **Hub:** intro → card grid → short "how to choose" guidance → CTA.
- **Industry:** context → typical springs and wire forms for this industry → requirements (materials, finishes, tolerances) → product links → FAQ → CTA. **No customer names** without written permission.
- **Capability:** what it is → how it works → when to use it → limits (e.g. development charges, wire range) → CTA.
- **Article:**
  - H1, then a "Key takeaways" box
  - Table of contents (if longer than 1,200 words)
  - Body with diagrams and tables
  - "Reviewed by" line (TODO(client) until Rutvik reviews)
  - Related product CTA, related articles, FAQ
  - Published and updated dates
- **Tool:** H1 → calculator → results → formulas and assumptions → worked example → disclaimer → **Get this spring made** (pre-filled RFQ).
- **RFQ:** intro (24 h quote, MOQ note) → 2-step form → trust sidebar (company details, WhatsApp alternative, "your drawings are kept confidential") → privacy note.
- **Contact:** company details, hours, static map linking to Google Maps, call and WhatsApp buttons, a short general-enquiry form (same API with `type=general`), CTA to the RFQ.
- **About:** founder story (TODO), timeline since 2017 (TODO), what we make, where we are, how we work.
- **Quality:** factual and minimal: ZED certified; in-house stress relieving and grinding; first-piece approval with the customer; documents on request (TODO(client)). **No** lab, PPAP or CPK claims.
- **Ordering:** terms table (MOQ, development charges, quote time, payment terms, ex-works delivery, GST invoice) + FAQ.
- **Location (Talawade/PCMC):** genuinely local content: where the factory is, nearby industrial areas served (Chikhali, Bhosari, Chakan, Pimpri-Chinchwad), directions, hours, map, CTA. Unique text only.

## 7. SEO implementation

1. **`<SEO>` component on every page:**
   - title: `%s | RK Springs & Wireforms`, kept to 60 characters or fewer (per-page override allowed)
   - meta description of 155 characters or fewer
   - absolute canonical with a trailing slash
   - robots meta: `noindex` on thank-you, styleguide and 404
   - Open Graph and Twitter tags
   - `lang="en-IN"`
2. **JSON-LD `@graph`, built from `src/data/site.ts`:**
   - `Organization` + `LocalBusiness`, defined once:
     - identity: `@id` `{SITE}/#organization`, name "RK Springs & Wireforms", `legalName` "RK Enterprises", `foundingDate` 2017, `founder` (Person: Rutvik), `taxID` = GSTIN
     - contact: phone, email, address, `geo` (TODO), `hasMap` (TODO), `contactPoint`
     - opening hours (**not Thursday**), `areaServed` India
     - `knowsAbout`, and `sameAs` (TODO: GBP, IndiaMART, Justdial, LinkedIn, YouTube)
   - `WebSite` (`{SITE}/#website`) and `WebPage` (or `AboutPage` / `ContactPage`) with a `breadcrumb` → `BreadcrumbList`
   - **Product pages:**
     - `Product` with brand and manufacturer pointing to the organization, `material`, and `additionalProperty` (wire Ø range)
     - **No `offers` price and no `aggregateRating`**
     - Plus a `Service` for custom manufacturing
   - `FAQPage` wherever FAQs are shown · `TechArticle` for guides · `WebApplication` for tools · `DefinedTermSet` + `DefinedTerm` for the glossary
3. **Crawling and indexing files:**
   - `robots.txt` (generated): allow all; disallow `/api/`, `/request-a-quote/thank-you/` and `/styleguide/`; include a Sitemap line; allow AI search crawlers
   - `@astrojs/sitemap` lists indexable pages only, with `lastmod` taken from frontmatter `updated`
   - `public/llms.txt`: a plain-text summary of the company, key facts and key URLs
4. **Internal linking (blueprint §4.6):**
   - Every product page links to its calculator, end-type guide, related materials, 2–3 industries and the RFQ.
   - Every article links to one primary product page, 2–3 related articles and glossary terms.
   - Hubs link to all their children, and children link back to the hub.
   - Anchor text is descriptive.
5. **On-page:**
   - Primary keyword used naturally in the title, H1, first 100 words and one H2. Use synonyms; no stuffing.
   - Image file names and alt text are descriptive.
6. **OG images:**
   - One designed default (1200×630, blueprint style).
   - Per-page OG images for the product pages via a build-time template (satori + resvg). **Ask before adding these two dependencies.**
7. **`vercel.json`:**
   - Security headers: HSTS, X-Content-Type-Options, Referrer-Policy, a sensible CSP that allows Turnstile, GA4 and Clarity.
   - Long cache for hashed assets.
   - Host redirects for the canonical host (TODO once the domain is chosen).
8. **`scripts/audit-html.ts`** runs against `dist/` and fails the build on any of these:
   - missing or duplicate title or meta, wrong lengths
   - an H1 count other than 1
   - a missing or incorrect canonical
   - invalid JSON-LD
   - broken internal links
   - noindex pages that appear in the sitemap

## 8. RFQ system

**Form** (React island, two steps, works on mobile with one thumb):
- **Step 1 (required fields \*):**
  - Name\*, Company\*, Phone/WhatsApp\*, Email, City
  - Spring type\*: Torsion / Double torsion / Tension-Extension / Compression / Conical / Spiral / Wire form / Not sure
  - Quantity\*: helper text "Our usual MOQ is 5,000–10,000 pcs. Smaller development runs are charged."
  - **Upload drawing or photo**: PDF, DWG, DXF, STEP/STP, IGES/IGS, JPG, PNG; up to 5 files, 25 MB total. Or a checkbox: "I'll send a sample".
  - Consent checkbox\* (DPDP Act wording linking to the privacy policy)
- **Step 2 (optional, fields depend on the spring type; each has a small diagram and a "Not sure" option):**
  - **Common:** material, wire Ø, OD/ID, free length, coils, wind direction, finish, notes, target date
  - **Compression:** end type, loads at lengths, solid height
  - **Extension:** length inside hooks, hook type and orientation, initial tension, loads
  - **Torsion / double torsion:** leg lengths and shapes, free angle, torque at angle, shaft Ø, loading direction, centre-loop width (double)
  - **Wire form:** bend angles and radii notes
- **Hidden fields:** source page, UTM parameters, calculator pre-fill payload. Accept query-string pre-fill from calculators.

**API: `POST /api/rfq`** (`prerender = false`)
1. Parse the multipart data. Validate with the **shared Zod schema**. Check the honeypot field. Verify the **Turnstile** token on the server.
2. Validate files by extension, MIME type and size. Generate random storage keys and sanitise file names.
3. Upload to the Supabase Storage **private** bucket `rfq-drawings` at `rfq/{yyyy}/{mm}/{rfq_code}/…`.
4. Insert into the table `rfqs` (migration in `supabase/migrations/001_rfqs.sql`):
   - `id` uuid pk, `rfq_code` (e.g. `RFQ-20261004-7K2P`), `created_at`
   - `name`, `company`, `phone`, `email`, `city`, `spring_type`, `quantity`, `target_date`
   - `specs` jsonb, `notes`, `files` jsonb, `sample_coming` bool
   - `source_page`, `utm` jsonb, `consent` bool not null
   - `status` default `'new'`, `user_agent`, `ip_hash`
   - **RLS enabled with no public policies**: the server writes with the service role only.
5. **Resend** emails:
   - To `RFQ_NOTIFY_EMAIL`: subject `New RFQ: {type}, {company} ({qty})`, a summary table, **signed file URLs (7-day expiry)** and a WhatsApp click-to-chat link to the buyer.
   - To the buyer (if they gave an email): acknowledgement with the RFQ code, "We'll reply within 24 hours" and contact details.
6. Return JSON. The client redirects to `/request-a-quote/thank-you/?id=RFQ-…` (noindex). The thank-you page shows next steps, a WhatsApp button and a download link for the company profile (TODO).
7. Errors show a friendly message plus the fallback "WhatsApp us your drawing".
8. **Dev fallback:** if the keys are missing, log the submission to the console and write JSON to `.rfq-dev/` (gitignored) so the whole flow is testable.

**Env vars** (`.env.example`): `PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RFQ_FROM_EMAIL`, `RFQ_NOTIFY_EMAIL`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_GA4_ID`, `PUBLIC_CLARITY_ID`.

## 9. Calculators

**Approach:** pure TypeScript functions in `src/lib/calculators/` with **Vitest tests**, and React islands for the UI (`client:visible`). Inputs are kept in URL params so results can be shared and bookmarked.

**Material table** (`src/data/materials.ts`). Typical values from SMI / Lee Spring tables; label them "typical" in the UI.

| Material | G (MPa) | E (MPa) |
|---|---|---|
| Music wire | 81,700 | 206,800 |
| Hard-drawn spring steel | 79,300 | 200,000 |
| Oil-tempered | 77,200 | 196,500 |
| Stainless 302/304 | 69,000 | 193,000 |
| Stainless 316 | 69,000 | 193,000 |

### Compression spring calculator
- **Inputs:** d, OD (or ID), free length L₀, total coils Nₜ, end type, material, working lengths L₁/L₂ (optional).
- **Mean diameter:** D = OD − d. **Spring index:** C = D/d.
- **Active coils Nₐ by end type:**
  - closed and ground: Nₜ − 2
  - closed: Nₜ − 2
  - open: Nₜ
  - open and ground: Nₜ − 1
- **Rate:** **k = G·d⁴ / (8·D³·Nₐ)** (N/mm)
- **Solid height Ls:**
  - closed and ground: Nₜ·d
  - closed: (Nₜ + 1)·d
  - open: (Nₜ + 1)·d
  - open and ground: Nₜ·d
- **Load:** F = k·(L₀ − L)
- **Shear stress:** τ = K_w·8FD/(πd³), with K_w = (4C − 1)/(4C − 4) + 0.615/C
- **Warnings:**
  - C < 4 or C > 12: hard to manufacture
  - L₀/D > 4: buckling risk, so guide it
  - L ≤ Ls: coil bind
  - d outside 0.40–2.50 mm: "outside our standard range, contact us"

### Extension spring calculator
- **Inputs:** d, OD, body coils N_b, initial tension Fᵢ (optional), material.
- **Active coils:** Nₐ = N_b + G/E
- **Rate:** k as above
- **Load:** F(x) = Fᵢ + k·x
- **Body length:** (N_b + 1)·d
- Body stress as above, plus a hook-stress caution note.

### Spring rate converter
N/mm ↔ kgf/mm ↔ lbf/in · N ↔ kgf ↔ lbf · mm ↔ in · N·mm/° ↔ kgf·mm/° ↔ lbf·in/°

### Every tool
- Show the formulas used and the assumptions.
- Round to 3 significant figures, with units on every value.
- Disclaimer: "Indicative engineering estimate. The final design is verified during development."
- "Copy link" button.
- **Get this spring made** button → `/request-a-quote/?type=…&d=…&od=…` (pre-fills step 2).

### Required tests (examples)
- Compression: d = 1.0, OD = 10 (so D = 9), Nₐ = 8, music wire → k = 81,700 / (8·729·8) = **1.751 N/mm**.
- Extension: N_b = 20, music wire → Nₐ = 20.395.
- Plus edge cases: zero or negative values, NaN, and C extremes.

## 10. Content rules and seed content

- **Voice:** specific, helpful, confident, plain Indian English. Use "we" for the company. Metric first. Short paragraphs. Answer the question in the first paragraph.
- **Never invent facts** (see AGENTS.md). Anything unconfirmed becomes `TODO(client)` and is rendered through `<Todo>` (visible in dev, `null` in production). `npm run todo` lists every open item.
- **FAQs:** real buyer questions, including the "People also ask" questions in blueprint §2.4 and §9.1, with direct answers.
- **Glossary:** 60+ terms (active coils, spring index, rate, initial tension, solid height, free angle, mandrel, pitch, set, wind direction…), each with an anchor ID so it can be linked from other pages.
- **HSN / GST article:**
  - HSN 7320 covers springs of iron or steel; 7320 20 covers helical springs; GST is 18%.
  - Add a "confirm with your CA" note, and cite the sources listed in blueprint §9.6.
  - Classify wire forms carefully (possibly 7326) and flag the uncertainty.
- **Price guide:** explain what drives cost (material, wire size, quantity, tooling and development, finish, tolerances). **No invented ₹ figures.** Mark ranges as TODO(client).
- **`CONTENT-REVIEW.md`** (repo root): one row per page with status (draft / needs client input / approved), a TODO(client) list and the key facts used. Keep it updated every phase.

## 11. Analytics and tracking

- Load GA4 (gtag) only if `PUBLIC_GA4_ID` is set, after idle.
- Events:
  - `rfq_submit` (with `spring_type`), `rfq_step2_view`
  - `whatsapp_click`, `call_click`, `email_click`
  - `calculator_used` (tool), `quote_from_calculator`
  - `pdf_download`, `outbound_click`
- Load Microsoft Clarity only if `PUBLIC_CLARITY_ID` is set.
- Capture UTM parameters into the RFQ. No other third-party scripts.

## 12. Quality gates (Phase 7 must report the actual numbers)

- `npm run build`, `astro check`, ESLint, Vitest and Playwright all pass with 0 errors.
- **Lighthouse on mobile ≥ 95 in all four categories** for these pages:
  - `/`
  - `/springs/torsion-springs/`
  - `/resources/how-to-measure-a-spring/`
  - `/tools/compression-spring-calculator/`
  - `/request-a-quote/`
- JS per content page is under 100 KB (report the sizes). CLS < 0.05. LCP < 1.8 s (simulated mobile).
- `audit-html` passes:
  - 1 H1 on every page
  - valid titles and metas
  - canonicals correct
  - JSON-LD parses and validates
  - no broken links
  - the sitemap contains only indexable 200 pages
- Keyboard-only walkthrough of: header, mega-menu, mobile nav, RFQ (both steps plus upload), calculators.
- Visual check at 360, 390, 768, 1024, 1280 and 1440 px, with no horizontal scroll.
- No `TODO(client)` is visible in the production build. Produce the list of open items for Rahul.

## 13. Phases and stop points (stop after each one and wait for review)

| Phase | Scope | Stop and show |
|---|---|---|
| **0. Plan** | Read all docs. No code | Build plan, final sitemap, component list, questions, conflicts, risks |
| **1. Foundation and design system** | Scaffold Astro, tokens, fonts, layouts, every §4.5 component, the 7 SVG drawings, header/footer/mobile bar, `/styleguide` | `/styleguide` + Home hero preview for look-and-feel approval |
| **2. Core pages** | Home, `/springs/` + 6 product pages, `/wire-forms/`, About, Contact, Ordering, Quality, legal, 404, with full copy | All pages + `CONTENT-REVIEW.md` |
| **3. SEO layer** | `<SEO>`, JSON-LD graph, breadcrumbs, sitemap, robots, llms.txt, OG images, `vercel.json`, `audit-html` | Audit output |
| **4. RFQ system** | Form, API, migration, Turnstile, Resend, dev fallback, thank-you page, tests | Demo of the dev-fallback submission |
| **5. Tools** | 3 calculators + tests + RFQ pre-fill | Test results + screenshots |
| **6. Remaining pages** | Industries (4), capabilities (4), location page, resources hub + glossary + 6 articles | Pages + updated `CONTENT-REVIEW.md` |
| **7. QA and hardening** | Run every §12 gate, fix issues, write `LAUNCH-CHECKLIST.md` | Numbers report + TODO(client) list |

## 14. Final deliverables

- A working site in `/website`.
- A **README**: local setup, env vars, Supabase setup, Vercel deploy (root `/website`), how to add a product, article or glossary term, how to swap the colour palette (tokens only).
- `CONTENT-REVIEW.md`, `LAUNCH-CHECKLIST.md`, the Supabase migration, `.env.example`, the test suites and the `audit-html` and `list-todos` scripts.
