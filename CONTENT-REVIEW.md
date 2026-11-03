# Content review: RK Springs & Wireforms website

Last updated: SEO pass, 23 Oct 2026 (after Phase 7). Domain decided: **rksprings.com** (canonical `https://www.rksprings.com`). Details in `SEO-WORK-LOG.md`.

Phases 0–7 are built. Phase 7 ran every §12 gate, hardened LCP (Latin font subsets, deferred extra weights, `client:idle` islands), added Playwright smoke / RFQ / calculator / keyboard / overflow tests, and wrote `LAUNCH-CHECKLIST.md`. Spiral springs stays draft-gated. **Waiting for review of the numbers and the launch list. Do not start post-Phase-7 work until you approve.**

**Status key:** `planned` (not built) · `draft` (built, needs review) · `needs client input` (built, blocked on a TODO(client)) · `approved`.
Pages flagged **draft-gated** are built but excluded from the production build, sitemap and navigation until the client confirms the facts they depend on.

## 1. Pages (sitemap v1, per CURSOR-BUILD-PROMPT.md §5)

| # | URL | Template | Phase | Status | Client input it depends on |
|---|---|---|---|---|---|
| 1 | `/` | Home | 2 | draft | ZED level/PDF, map pin, main phone |
| 2 | `/springs/` | Hub | 2 | draft | — |
| 3 | `/springs/torsion-springs/` | Product | 2 | draft | Leg types made, finishes via partners, max OD/length |
| 4 | `/springs/double-torsion-springs/` | Product | 2 | draft | Same as torsion + centre-loop limits |
| 5 | `/springs/extension-springs/` | Product | 2 | draft | Hook types made |
| 6 | `/springs/compression-springs/` | Product | 2 | draft | End types made (grinding min. wire Ø) |
| 7 | `/springs/conical-springs/` | Product | 2 | draft | — |
| 8 | `/springs/spiral-springs/` | Product | 2 | draft-gated | **What "spiral" means** (wire vs flat strip) |
| 9 | `/wire-forms/` | Product hub | 2 | draft | Wire-form families made, typical parts |
| 10 | `/industries/` | Hub | 6 | draft | — |
| 11 | `/industries/automotive-springs/` | Industry | 6 | draft | Two-wheeler work, anonymised example |
| 12 | `/industries/electrical-switchgear-springs/` | Industry | 6 | draft | Anonymised example |
| 13 | `/industries/instrumentation-springs/` | Industry | 6 | draft | Permission to describe customer anonymously |
| 14 | `/industries/furniture-springs/` | Industry | 6 | draft | Anonymised example |
| 15 | `/capabilities/` | Hub | 6 | draft | — |
| 16 | `/capabilities/spring-coiling-forming/` | Capability | 6 | draft | Machine list |
| 17 | `/capabilities/prototype-development/` | Capability | 6 | draft | Sample lead time, how development charges work |
| 18 | `/capabilities/reverse-engineering/` | Capability | 6 | draft | How samples are measured |
| 19 | `/capabilities/heat-treatment-grinding/` | Capability | 6 | draft | Furnace/grinder details |
| 20 | `/quality/` | Info | 2 | draft | ZED PDF, sample-approval step, instruments, documents |
| 21 | `/about/` | About | 2 | draft | Founder story, surname, team size, timeline |
| 22 | `/ordering/` | Info | 2 | draft | Payment-terms wording, transport arrangement |
| 23 | `/request-a-quote/` | RFQ | 4 | draft | Notify email, Turnstile/Resend/Supabase keys |
| 24 | `/request-a-quote/thank-you/` | Utility (noindex) | 4 | draft | Company profile PDF |
| 25 | `/contact/` | Contact | 2 | draft | Main phone/email, map pin |
| 26 | `/locations/talawade-pcmc/` | Location | 6 | draft | Landmarks, directions, areas served |
| 27 | `/tools/` | Hub | 5 | draft | — |
| 28 | `/tools/compression-spring-calculator/` | Tool | 5 | draft | — |
| 29 | `/tools/extension-spring-calculator/` | Tool | 5 | draft | — |
| 30 | `/tools/spring-rate-converter/` | Tool | 5 | draft | — |
| 31 | `/resources/` | Hub | 6 | draft | — |
| 32 | `/resources/spring-glossary/` | Glossary | 6 | draft | Technical review |
| 33 | `/resources/hsn-code-gst-springs/` | Article | 6 | draft | CA confirmation of HSN printed for springs vs wire forms |
| 34 | `/resources/how-to-measure-a-spring/` | Article | 6 | draft | Technical review |
| 35 | `/resources/torsion-vs-extension-vs-compression-springs/` | Article | 6 | draft | Technical review |
| 36 | `/resources/what-is-a-double-torsion-spring/` | Article | 6 | draft | Technical review |
| 37 | `/resources/spring-price-guide-india/` | Article | 6 | draft | Price ranges (optional; none published) |
| 38 | `/resources/extension-spring-end-types/` | Article | 6 | draft | Hook types made |
| 39 | `/privacy-policy/` | Legal | 2 | draft | Grievance contact, legal review |
| 40 | `/terms/` | Legal | 2 | draft | Legal review |
| 41 | `404` | Utility (noindex) | 2 | draft | — |
| — | `/styleguide/` | Internal (noindex) | 1 | draft | Logo (wordmark and favicon are temporary) |

## 2. Open TODO(client) items

From CLIENT-PROFILE.md §8:
- [ ] Logo file
- [ ] ZED certificate PDF and level
- [ ] Machine list and name-plate photos
- [ ] Factory map pin and coordinates
- [ ] Main phone number and main email
- [ ] Domain purchase (rksprings.com decided 23 Oct 2026; buy and point DNS at Vercel)
- [ ] Top 5 products
- [ ] Sample and production lead times
- [ ] Team size
- [ ] Founder story
- [ ] 3–5 case stories
- [ ] Testimonials
- [ ] Written permission to name customers
- [ ] What "spiral springs" means
- [ ] Two-wheeler springs
- [ ] Defence work
- [ ] Inspection report / material test certificate availability
- [ ] Factory photo and video shoot

Added in Phase 1:
- [ ] Replace the temporary coil wordmark and `favicon.svg` with the real logo
- [ ] Confirm the spiral-spring drawing once we know wire vs flat-strip (drawing is generic on purpose)

Added in Phase 0:
- [ ] Exact brand spelling on GST certificate and signage ("Wireforms" vs "Wire Forms")
- [ ] Proprietor's surname, and consent to name him as author/reviewer
- [ ] Measuring tools actually used (vernier, micrometer, gauges?) and how tolerances are checked
- [ ] Does the customer approve a development sample before production?
- [ ] End types made: compression ends (and smallest wire that can be ground), extension hook types, torsion leg forms
- [ ] Size limits: max OD, max free length, max torsion leg length, smallest ID
- [ ] Typical tolerances held
- [ ] Finishes available through partners (zinc, black oxide, passivation, powder coat, oiling…)
- [ ] What is supplied to the oil-seal customer (garter springs? another type?)
- [ ] "Quote within 24 hours": does the clock run on Thursdays (closed day)? Clock start for sample-based enquiries?
- [ ] Ex-works delivery: who books transport (buyer's transporter, or we book at buyer's cost)?
- [ ] Public wording for payment terms
- [ ] Is WhatsApp on the main number? Publish the second number or not?
- [ ] Factory landmarks and directions; are customer visits welcome during working hours?
- [ ] Permission to describe customers anonymously (e.g. "a Pune maker of level and flow instruments")
- [ ] Which email receives RFQ notifications
- [ ] IndiaMART and Justdial listing URLs (for `sameAs`)

Added in Phase 6:
- [ ] CA confirmation of the HSN printed for springs (7320 / 7320 20) vs wire forms (possibly 7326)
- [ ] Optional public price bands (none published until you ask for them)
- [ ] Technical review of the glossary and six articles; “Reviewed by Rutvik” line once he has read them

## 3. Key facts used (from CLIENT-PROFILE.md, the only allowed source)

- Brand: RK Springs & Wireforms · legal name: RK Enterprises (proprietorship) · since 2017
- GSTIN 27BDSPK0577Q1ZL · Udyam UDYAM-MH-26-0706268
- Sr. No. 166, Sai Krupa Society, Sahyog Nagar, Talawade, Pune, Maharashtra 411062, India
- Phone/WhatsApp +91 72620 92185 (main TBC) · +91 97679 01954
- Hours: Mon–Wed and Fri–Sun 9:00 AM – 8:00 PM · Thursday closed
- Products (by volume): torsion, double torsion, tension/extension, compression, wire forms, spiral and conical
- Wire Ø 0.40–2.50 mm · OD and length to customer requirement
- Materials: spring steel (HD grades), music wire (on request), SS 302/304/316, oil-tempered
- In-house: coiling and forming, stress-relieving furnace, end grinding · outsourced: plating and finishing
- Reverse engineering from sample: yes · switchgear/MCB springs: yes
- Not made: rolling-shutter, agriculture, heavy springs above 2.50 mm wire
- MOQ 5,000–10,000 pcs, smaller runs carry development charges · quote within 24 hours
- Payment: immediate or within 30 days · ex-works Talawade · all India, no export
- ZED certified (level TBC) · no ISO/IATF · no testing claims
- Industries: automobile, electrical and switchgear, furniture, instrumentation

## 4. Phase 1 notes

- Live routes: `/` and `/styleguide/` (styleguide is noindex). All other sitemap URLs stay `planned` and are not linked in a production build.
- Quote buttons fall back to WhatsApp until `/request-a-quote/` is live.
- Temporary wordmark and favicon use navy / blue-400 tokens. They must be replaced when the logo arrives.
- Fallback font `size-adjust` measured in-browser: Plex Sans 600 is ~1% narrower than Arial; set to `99%`. The ₹ glyph renders in IBM Plex Sans (latin-ext).
- Home is a hero + product-card + CTA preview only. The rest of §6.1 lands in Phase 2.

## 5. Phase 2 notes

- Live routes: `/`, `/springs/` and five spring product pages, `/wire-forms/`, `/about/`, `/quality/`, `/ordering/`, `/contact/`, `/privacy-policy/`, `/terms/`. `/styleguide/` stays noindex. `/springs/spiral-springs/` rewrites to the 404 page in production.
- Header and footer hide unpublished destinations in a production build (Industries, Capabilities, Tools, Resources, spiral). They still appear in `npm run dev`.
- Quote buttons still fell back to WhatsApp in this phase (RFQ was not live yet).
- Product pages are 900–1,300 words. They explain common engineering facts (wind direction, hook failure, spring index) without claiming a lab, CNC list, ISO, PPAP or named customers.
- Two-wheeler work is mentioned only as a common application of the type, with a TODO before we treat it as a regular RK product.
- Industry, tool and resource teasers on Home render as cards; they are not links until those pages exist.
- Homepage hero visual updated 25 Oct 2026 with the supplied spring isolated on transparency and restored technical callouts for the wire range, left/right coils, centre loop and leg span. The original hero copy and all other homepage sections are unchanged.

## 6. Phase 3 notes

- Every indexable page emits one JSON-LD `@graph` (Organization + LocalBusiness, WebSite, WebPage/AboutPage/ContactPage, BreadcrumbList; FAQPage and Product+Service where those props are passed). No `offers`, no `aggregateRating`, no `geo` until a map pin exists, no `sameAs` until listing URLs exist.
- Local and preview builds stay `noindex` and omit the sitemap. A production build with `PUBLIC_SITE_URL` (and not `PUBLIC_SHOW_TODOS`) writes `sitemap-index.xml` of live pages only. Styleguide, spiral, 404 and the RFQ thank-you page are excluded.
- `robots.txt` allows common AI crawlers and points at the sitemap. `public/llms.txt` lists confirmed facts and URLs.
- Default OG image is `public/og-default.png` (1200×630). Per-page OG (satori + resvg) was not added.
- `npm run build` runs `scripts/audit-html.ts`: title ≤60, description ≤155, one H1, absolute canonical, valid `@graph`, no broken internal `/` links, noindex pages not in the sitemap.
- Indexable audit (with `PUBLIC_SITE_URL=https://www.rksprings.in`, after Phase 4): 19 pages, 15 sitemap URLs, 0 errors.

## 7. Phase 4 notes

- `/request-a-quote/` is live. Header, footer and product CTAs now point there instead of WhatsApp. The form is a two-step React island; step 2 is optional specs by spring type. Query-string pre-fill (`?type=torsion&d=1.2&od=10`) and UTM capture are wired.
- `POST /api/rfq` shares a Zod schema with the form. Honeypot field `website`. Turnstile is verified only when `TURNSTILE_SECRET_KEY` is set.
- Without Supabase/Resend keys the handler writes `.rfq-dev/{RFQ-…}/rfq.json` plus uploaded files and still returns a reference. Apply `supabase/migrations/001_rfqs.sql` before going live (RLS on, no public policies; private bucket `rfq-drawings`).
- Thank-you is noindex. It reads `?id=` in a small inline script and offers WhatsApp. Company profile PDF is still a TODO(client).
- Contact now posts a short general enquiry (`type=general`) to the same API.
- Privacy policy names Vercel, Supabase, Resend and Cloudflare Turnstile as processors.
- Vercel serverless request bodies are smaller than the 25 MB upload cap. Large drawings should go by WhatsApp until we add a direct-to-storage upload.

## 8. Phase 5 notes

- Live routes: `/tools/`, `/tools/compression-spring-calculator/`, `/tools/extension-spring-calculator/`, `/tools/spring-rate-converter/`. Home tool cards and product “related” links now point at them. Header “Tools” is visible in production.
- Formulae match CURSOR-BUILD-PROMPT.md §9. Material G/E are typical SMI / Lee Spring values, labelled “typical”. Display rounding is 3 significant figures; tests assert the raw values (k = 1.751 N/mm; Na = 20.395).
- Inputs stay in the query string (`replaceState`). “Copy link” copies the current URL. “Get this spring made” opens `/request-a-quote/?type=&d=&od=…` and maps calculator material IDs onto the RFQ material strings. The RFQ form now re-reads the query string after mount, because static SSR otherwise dropped the pre-fill.
- Disclaimer on every tool: “Indicative engineering estimate. The final design is verified during development.”
- No new dependencies. Calculators are React islands (`client:idle` as of Phase 7). Content pages stay 0 KB JS.

## 9. Phase 6 notes

- Live routes: `/industries/` + four industry pages, `/capabilities/` + four capability pages, `/locations/talawade-pcmc/`, `/resources/` + glossary + six articles. Header “Industries”, “Capabilities” and “Resources” are visible in production. Home industry and guide cards now link; capability snapshot and the factory block link through to the new hubs.
- Industry pages name sectors from CLIENT-PROFILE only. No customer names. Two-wheeler work and the instrumentation customer stay behind `<Todo>`. Defence is not listed. Automotive page states we do not make suspension or valve springs.
- Capability pages stay inside confirmed in-house work (coil/form, development sample, reverse engineering, furnace, end grinding). Machine names, furnace/grinder details, sample lead time and measuring tools are `<Todo>`. No lab, PPAP, CPK or ISO claims.
- Location page is unique Talawade/PCMC copy (Chikhali, Bhosari MIDC, Chakan). FAQs are on the page so FAQ schema is valid. No extra city pages.
- Glossary has 66 terms with anchor IDs and `DefinedTermSet` JSON-LD. Articles use `TechArticle`, a key-takeaways box, TOC when listed, published date 4 Oct 2026, and a “Reviewed by” `<Todo>` until Rutvik reviews.
- HSN article: 7320 / 7320 20, GST commonly 18%, wire forms may be 7326, CA confirmation required. Sources cited (ClearTax, Credlix, Swipe; read 4 Oct 2026). Price guide explains cost drivers only — no invented ₹ figures.
- `public/llms.txt` now lists industries, capabilities, location and resources.
- Indexable audit (with `PUBLIC_SITE_URL=https://www.rksprings.in`): 42 pages, 38 sitemap URLs, 0 errors. `npm run check` and 48 Vitest tests pass.

## 10. Phase 7 notes

- Quality-gate numbers, the Lighthouse table, and the go-live list live in `LAUNCH-CHECKLIST.md`.
- Playwright: 43 tests. RFQ and calculator islands expose `data-ready="true"` after hydrate so e2e fills reach React state. Islands use `client:idle` (build spec).
- Fonts: Latin + Latin-ext only. Heading weight (600) is preloaded with `font-display: optional`. Body, medium, mono and Latin-ext load after `load` / idle so LCP text is not queued behind eight font files.
- Lighthouse is `npm run lh`: gzip on the preview server (as Vercel does), fresh Chrome per page, median of 3 simulated-mobile runs.
- No `TODO(client)` is visible in the production HTML. `npm run todo` still lists 49 markers for you.

## 11. `/landing/` homepage redesign (21 Oct 2026; removed 25 Oct 2026)

- The client did not like the original homepage look, so `/landing/` now holds a new homepage layout for review. **The live `/` is untouched.** It's noindex and kept out of the sitemap, so it can't compete with `/` in search.
- Layout follows a typical industrial-supplier homepage. A dark blueprint hero with the double torsion drawing redrawn white-on-navy. A row of key figures (wire range, 24 h quote, usual batch, since 2017). A registrations strip (ZED, Udyam, GSTIN). Datasheet-style product cards, with torsion and double torsion marked "Specialist". A shop-floor capability block with a to-scale wire-gauge drawing. Then industries, a six-step process, an RFQ checklist with direct contact details, the factory block and the FAQ.
- Every fact comes from `site.ts`, `navigation.ts` and `faqs.ts`. No new claims. "Our highest-volume parts" is based on CLIENT-PROFILE §2, which ranks products by volume.
- Zero client JS. Only token colours, no hex values. The hero drawing's reveal animation is turned off on this page because it sometimes left the drawing blank when it ran off-screen on phones.
- Files: `src/pages/landing.astro`, `src/components/landing/*`, `src/styles/landing.css`.
- Removed on 25 Oct 2026 at Rahul’s request, including its dedicated components/styles, route registry entry, sitemap exclusion and smoke-test entry. The notes above describe the former preview.

## 12. `/landing2/` homepage concept (removed 25 Oct 2026)

- The uncommitted alternative homepage concept has been removed at Rahul’s request, together with `/landing/`. Neither preview is part of the current site.

## 13. Homepage hero visual refinement (25 Oct 2026)

- **Status: ready for visual review.** This is a bounded refinement of the homepage hero from `c063221`, not a new build phase. No deployment or publication.
- Studied the current hero and [Jai Shree Group](https://jaishreegroup.com/) for its layered industrial geometry and motion treatment. RK uses original open wire contours in the existing blue-and-white tokens.
- Replaced the rectangular blueprint grid, title block, dimension arrows and all technical callouts with a soft blue backdrop and fine SVG wire turns behind the supplied photo. A simple “Double torsion spring” caption sits below the photo; there are no labels over the spring.
- Preserved the heading, supporting copy, CTA markup, trust facts, image source, image dimensions, alt text and image delivery settings. The real photo remains stationary and unchanged. No new factual claims or client TODOs.
- Background turns move through a small compression/release range over 16–18 seconds. A keyboard-accessible native checkbox pauses/resumes the motion, with a visible focus ring and 44 px label target. Animation is enabled only under `prefers-reduced-motion: no-preference`; reduced-motion styles keep a static composition and hide the unnecessary control. Mobile renders only one of the two wire groups.
- Zero additional client JavaScript and no dependencies. All new colours reference existing tokens. No stock or generated photos, filters, canvas, or animation libraries.
- Reviewed the local hero at 360, 390, 768, 1024, 1280 and 1440 px. No horizontal overflow observed. Checked the production desktop/mobile composition, photo clearance, caption placement, pause via click, resume via keyboard, focus visibility and control heights. Reduced-motion behaviour was reviewed in CSS; browser preference emulation was not available. Preview captures: `website/.screens/hero-desktop.jpg` and `website/.screens/hero-mobile.jpg` (gitignored).
- Validation: `npm run check` passed (0 errors, warnings or hints); `npm run build` passed; `audit-html` reported 42 pages and 0 errors. The existing local noindex configuration produces 0 sitemap URLs. `npm run js-budget` passed (homepage 6.9 KB under the script's counting method, including inline schema). Mobile 4G LCP/CLS were not remeasured in this visual pass.
- Scope: `website/src/components/home/HomeHero.astro` and this review entry only. Existing `/landing2/` work and prior review-file edits are preserved; `/landing/` and the rest of the homepage are untouched.

- Headline follow-up (25 Oct 2026): changed the main headline to “Your design. Our springs.” at Rahul’s request, with “Spring & wire-form manufacturer in Pune” below it within the same H1. This reflects the confirmed made-to-drawing capability. Supporting copy, CTAs, photo and motion are unchanged. Reviewed at 1280 px and 390 px with no overflow and exactly one H1. `npm run check` and `npm run build` passed; HTML audit: 42 pages, 0 errors. Ready for review.

- Motion visibility follow-up (25 Oct 2026): Rahul could not perceive the background movement. Browser inspection confirmed it was running, with reduced-motion off and pause unchecked; the original movement was too faint and slow. Increased the bounded wire flex from ±2° to ±5°, shortened each half-cycle to 8–10 seconds, slightly strengthened the token-based line gradient, and added a short travelling highlight along one contour per group. The photo remains stationary. All effects stay CSS/SVG-only, pause together, and remain disabled for reduced-motion users. Verified changing transform matrices and highlight offsets, pause/resume, and desktop/mobile appearance. `npm run check` and `npm run build` passed; HTML audit: 42 pages, 0 errors. Ready for review.

- Hero photo quality follow-up (25 Oct 2026): the supplied source is 1006 × 885 px. Created a non-generative 3840 × 3378 px upscale with Lanczos resampling, light sharpening and lossless WebP storage at `website/src/assets/polished-stainless-steel-torsion-springs-hero-4k.webp` (2.61 MiB). This is an upscale, not a native 4K photograph, and does not recover missing captured detail. Original PNG is retained unchanged; product geometry, lighting, framing and transparency are preserved. Raised hero WebP delivery quality from 84 to 98 and added 560/840/1120/1680/2240 px responsive outputs with explicit sizes; the full master is not downloaded by ordinary page views. Output image sizes are approximately 65/112/163/277/409 KiB. Reviewed production desktop (1280 px, DPR 2; 1120 px resource selected) and mobile (390 px) with loaded images and no overflow. `npm run check` and `npm run build` passed; HTML audit: 42 pages, 0 errors. Photo asset and hero image props only; no dependencies or JavaScript added. Ready for review.

- Development-preview fix (25 Oct 2026): the running Astro server at `localhost:4325` returned HTTP 500 for the new 4K image import even though the asset existed and production builds passed. Restarted the existing development server on the same port to clear its stale module-resolution state. Verified HTTP 200 and the loaded hero image in a browser at the exact URL from Rahul’s screenshot, with no error overlay. No source change was needed.

- Responsive annotation restoration (25 Oct 2026): restored CENTRE LOOP, LH COIL, RH COIL, WIRE RANGE (using the confirmed `site.capability.wireRangeLabel`) and LEG SPAN around the real hero photo at Rahul’s request. The former title box remains removed. Added a square stage with a fixed coordinate system, 4% horizontal photo clearance, short SVG callout leaders, and a simple split leg-span rule below the photo. Labels use HTML text with container-relative sizing and an 11 px minimum; they remain separate from the product and do not move with the decorative animation. Updated responsive image size hints to match the 92%-width photo. No image asset, headline, supporting copy, CTA, or other page changes.
- Annotation validation: browser review at 320, 360, 390, 768, 1024, 1280 and 1440 px; all five labels stay within the stage, with no horizontal overflow. Reviewed callout endpoints and image clearance on phones, tablet and desktop, plus the development preview at `localhost:4325`. `npm run check` passed (0 errors/warnings/hints); `npm run build` passed; HTML audit: 42 pages, 0 errors. Updated captures: `website/.screens/hero-labels-desktop.jpg` and `website/.screens/hero-labels-mobile.jpg`. Ready for review; no deployment.

- Hero viewport and control refinement (25 Oct 2026): removed the pause/resume checkbox, label and their styles at Rahul’s request. The CSS/SVG wire effect now runs once and settles by 4.8 seconds, with the travelling highlight fading out; reduced-motion users keep a static background. No persistent animation remains that requires a pause control.
- Reduced hero padding and copy spacing; removed oversized trust-block reserved heights; made trust facts compact; sized the art to the available viewport height with a lower bound that protects annotation legibility. Two-column composition now starts at 768 px, with compact tablet typography/buttons and short-screen spacing. CTA touch targets remain at least 44 px. The real photo, headline, supporting copy, links and all five labels remain present. Mobile keeps a readable vertical flow rather than clipping or shrinking the full content into one screen.
- Verified full hero bottom at or above the viewport bottom in the development preview at 768×650, 768×768, 768×1024, 1024×650, 1024×768, 1280×600, 1280×650, 1280×720, 1366×768 and 1440×900. In particular, the complete hero ends at 720 px on a 1280×720 laptop. Mobile 360/390 px retains a natural vertical layout, with no horizontal overflow or awkward trust-label wrapping; the narrowest 320 px trust list uses one column. Confirmed no pause control remains and the background settles to its final transform. `npm run check` and `npm run build` pass; HTML audit: 42 pages, 0 errors. Screenshot: `website/.screens/hero-fit-laptop.jpg`. Scope remains HomeHero and these notes; no deployment. Ready for review.


## 14. Remove alternative homepage previews (25 Oct 2026)

- Removed `/landing/` and the uncommitted `/landing2/` concept at Rahul’s explicit request. Deleted their dedicated Astro pages, components, CSS and landing2 data. Removed preview route registrations, sitemap exclusions, the former landing smoke-test entry and the unused layout theme-class prop.
- Retained the completed homepage hero work from this chat, including its original photo and non-generative upscale, responsive annotations, revised headline, compact viewport layout and one-time wire animation. Unrelated `.claude/` and `SEO-MASTER-PLAYBOOK.md` files remain outside the commit.
- Validation: `npm run check` and `npm run build` pass. The HTML audit reports 40 pages and 0 errors. Neither preview appears in build output. Local development HTTP checks: `/` → 200; `/landing/` → 404; `/landing2/` → 404. No remaining preview references in runtime source, config or tests.
- Publish scope: commit and push the current `landing-redesign` branch to GitHub, as requested. No deployment command or merge into `main`.


## 15. Homepage factory/contact section redesign (25 Oct 2026)

- **Status: ready for visual review.** Replaced the homepage factory section’s full-page blueprint grid with a deep navy gradient and quiet SVG wire contours. Added a larger location heading, a white address/contact panel, and a contrasting working-hours panel. The design uses existing tokens, borders and inline SVG only; no shadows, photos, client JavaScript or dependencies were added.
- Extracted the section into `website/src/components/home/HomeFactory.astro` and replaced only its former markup/styles in `website/src/pages/index.astro`. The hero, all other homepage sections, shared components, metadata and JSON-LD are untouched.
- Preserved the brand/legal line, full address, both phone numbers, both email addresses, GSTIN, Udyam, weekly schedule, phone/WhatsApp/email actions and the Talawade/PCMC page link. All facts still come from `site.ts`; main-phone and main-email client TODOs remain in development only. Hours are grouped in the weekly table, with Thursday closure called out in text. The dispatch line uses the confirmed ex-works terms. No unconfirmed map pin, live opening status or new business claim.
- Visual/responsive checks at 320, 360, 390, 768, 900, 1024, 1280 and 1440 px found no horizontal overflow or overflowing contact/table content. Contact links have 44 px targets; action buttons have 48 px targets. Checked keyboard focus on the white panel and explicitly retained an action-blue outline there. Light text uses approved blue/white tokens on the dark background; the white panel retains dark text. Static decoration requires no motion preference override.
- `npm run check` passed (0 errors/warnings/hints); `npm run build` passed; HTML audit: 40 pages, 0 errors. Production and development browser checks completed. Captures: `website/.screens/factory-desktop.jpg` and `website/.screens/factory-mobile.jpg`. No commit, push or deployment in this refinement.

- GitHub follow-up (28 Oct 2026): Rahul requested that the factory/contact redesign be committed and pushed. Re-ran `npm run check` and `npm run build` successfully; HTML audit: 40 pages, 0 errors. Commit scope is this review entry, `HomeFactory.astro` and its homepage integration. The earlier hero/preview-removal commit is already on `origin/landing-redesign`. Unrelated local files remain excluded; no merge to `main` or deployment command.

## 16. `/landing3/` homepage concept (3 Nov 2026)

- **Status: ready for visual review. No deployment, no commit.** The client rejected the current homepage look, so `/landing3/` holds a third, deliberately different concept. **The live `/` is untouched** — no homepage file, shared component, token or data file was edited. The only change to an existing file is one line in `astro.config.mjs` adding `/landing3/` to `sitemapExclude`.
- The page is `noindex, nofollow` with a self-referencing canonical and is kept out of the sitemap, so it cannot compete with `/` in search.
- **Deliberate token exception.** At Rahul's explicit instruction ("ignore the colour palette"), this page sets aside the blue-and-white tokens of AGENTS.md §6 and CURSOR-BUILD-PROMPT.md §4. Its palette — graphite base, warm drawing-paper panels, a single amber annotation accent — is declared once under a `.l3` scope in `Landing3Layout.astro` and is used nowhere else. Verified: the built homepage CSS bundles contain zero references to the new variables.
- **Concept: an engineering sheet, not a brochure.** Sections in order: hero with the real spring photo in a CAD-style viewport plus a four-figure readout rail (wire range, MOQ, 24 h quote, since 2017); three proof statements; a seven-product catalogue using the existing SVG technical drawings re-tinted for a dark sheet; the capability data rendered as a drawing frame with zone markers, an annotated part view, a first-angle projection symbol and an ISO 7200-style title block; a six-step process rail; industries and a materials table; a "who makes them" block; a "what we don't do" block; calculators and guides; contact.
- **No new facts.** Every value is read from `site.ts` and `navigation.ts`. The quote "Quality, and development of critical parts with tight tolerances" is CLIENT-PROFILE §5 verbatim, attributed as the reason customers give. The 8–10 new parts per month figure is CLIENT-PROFILE §3 capacity, framed as attention per job. The referral-only line is CLIENT-PROFILE §5.
- **"What we don't do" is new editorial, not a new claim.** It states the limits already in CLIENT-PROFILE: no wire above 2.50 mm, no rolling-shutter or agriculture springs, no in-house plating, no ISO 9001 or IATF 16949 (ZED only), no testing laboratory, no export today. Nothing here asserts a capability.
- Open client TODOs are surfaced through `<Todo>` as usual (surname, ZED level and PDF, machine list, map pin, main phone, main email). They render in development and review builds only; the production build contains zero `data-todo` occurrences.
- **Performance:** zero client JavaScript (0 `<script>` tags in the built page). 99.8 KB raw / 17.3 KB gzipped, lighter than the current homepage at 132.2 KB / 22.3 KB. Reuses the already-installed Plex Sans 500/700 and Plex Mono 500 cuts — no new dependency. Scroll reveals use `animation-timeline: view()` behind `@supports` and `prefers-reduced-motion`, so content is simply visible where that is unsupported.
- **Accessibility:** exactly one H1; no links without an accessible name; no horizontal overflow at 375 px (document scrollWidth equals viewport width); all interactive targets at least 44 px after raising the footer, maker and header link heights; product cards are fully clickable (333 × 404 px) via an overlay span rather than nested interactive elements; closed days are marked with a dashed border and strike-through, never colour alone; dark-page text pairs were contrast-checked (body 7.6:1, amber 8.2:1, dimmest text 5.5:1, amber-on-paper uses a darkened ink at 5.2:1).
- The dev-only `<Todo>` and `<PhotoPlaceholder>` components ship light-on-white for the live site, so they are re-tinted for the dark page inside the `.l3` scope — the client review build is exactly where they are visible.
- Files: `website/src/pages/landing3.astro`, `website/src/layouts/Landing3Layout.astro`, `website/src/components/landing3/*` (Header, Footer, Mark, Hero, Proof, Catalogue, SpecSheet, Process, Markets, Maker, Resources, Contact).
- Validation: `npm run check` passed (0 errors, warnings or hints; Prettier clean); `npm run build` passed; HTML audit: 41 pages, 0 errors. Console on `/landing3/` is clean.

### 16.1 Real logo adopted on `/landing3/` (3 Nov 2026)

- Rahul supplied the client's actual logo: a photograph of a physical blue cut-out sign (401 × 249 px, white background, drop shadow, uneven colour). It replaces the temporary coil-glyph wordmark on `/landing3/` only. The live site's `Wordmark.astro` and `/favicon.svg` are **untouched**, so `/` still shows the placeholder until the client approves this.
- **Brand colour measured, not guessed:** the ink sampled to RGB(10, 50, 98) = **`#0A3262`**, a deep navy. The visually-apparent lighter blue was anti-aliasing against the white card.
- **Redrawn as vector rather than cut out.** The photo was masked on blue-dominance (which rejects the grey drop shadow), upsampled 4×, boundary-traced, and the geometry measured by least squares. Findings: the R's bowl is a **concentric ellipse pair** (outer rx 46.0 / ry 36.2, tangent to the cap line; inner rx 16.9 / ry 11.7) — circle fits failed, ellipses fit to ~0.5 units. The K is a chevron whose arms taper slightly, with a rounded outer point; its parameters were fitted by maximising area overlap.
- Fidelity of the rebuild against the traced original: **R 96.1%, K 93.8% area overlap (IoU)**. The remainder is the physical sign's own hand-cut irregularity, which is precisely what the redraw removes. Result is **315 bytes of SVG**, resolution-independent, no raster logo shipped to the page.
- **Colour adaptation.** Brand navy on the graphite page measures 2.3:1 — unusable for the mark. Two tokens were added, both scoped to `.l3`: `--brand: #0a3262` for the light paper panels (11.3:1 on `--paper`) and `--brand-lift: #7fa9de` for the mark on dark (8.2:1 on `--void`). Amber remains the annotation accent, so blue now means *identity* and amber means *technical layer* — a deliberate two-colour system rather than three competing accents. Verified: the homepage CSS bundles contain zero occurrences of the new colours or tokens.
- The mark also appears in the drawing sheet's title block in true brand navy, which is how a real engineering title block is signed.
- **Brand assets added** under `website/public/brand/`, usable beyond this site (letterhead, IndiaMART, Justdial, WhatsApp profile, signage): `rk-logo.svg` (navy), `rk-logo-white.svg` (knockout for dark), `favicon-rk.svg` (navy tile, mark knocked out — referenced by `/landing3/` only), and `rk-logo-photo-transparent.png` (the original photo background-removed and flattened to the brand navy, 1220 × 564).
- Validation: `npm run check` passed (0 errors/warnings/hints, Prettier clean); `npm run build` passed; HTML audit: 41 pages, 0 errors. Page weight 17.4 KB gzipped, still below the current homepage's 22.3 KB, and still 0 KB of JavaScript. All four brand assets serve 200.
- Open: the client has not supplied a logo **source file**. This vector is a faithful reconstruction from a photo, not the original artwork — worth asking for the AI/CDR/PDF if the sign-maker still has it, before this is used for print.

### 16.2 "What we don't do" replaced with "How we help you" (3 Nov 2026)

- Rahul's direction: a prospect should never be shown what the supplier cannot do; the page should lead with capability and help. The negative block was removed from `/landing3/` and rebuilt as a positive capability section. This reverses the earlier editorial choice recorded in §16.
- **New section — "How we help you"** (eyebrow "Working with us"), four benefit-framed items, each one a confirmed capability from CLIENT-PROFILE §2–§3, not a new claim:
  1. *Three critical steps, one roof* — coiling and forming, stress relieving in our own furnace, end grinding; the operations that decide whether a spring holds free length and sits square.
  2. *We help you choose the wire* — stainless 302/304/316 where damp, oil-tempered under steady load, music wire on request for higher tensile; grade quoted to the application.
  3. *Finishing arranged, one delivery* — plating and finishing through partners, returned on one quote and one delivery, single order placed with RK.
  4. *Small, loaded and critical is the day job* — Ø 0.40–2.50 mm, tight tolerances, parts that must work first time in a switch, instrument or small assembly.
- Closes with an amber CTA panel: "Not sure your part suits us? Send the drawing — you get a straight answer and a price within 24 hours." This keeps the honest fast-qualification benefit of the old block without listing a single negative.
- **Nothing was made less truthful.** The factual envelope still appears where a buyer needs it — the spec sheet still states the wire range, the MOQ and "Through partners" for plating. Only the framing changed, from enumerating exclusions to stating capability.
- Three other lines were reframed the same way: the spec-sheet footer now reads "Anywhere inside this envelope, send it over… you will have an answer and a price within 24 hours" (was a list of three product types not made); the spec-sheet partner note now reads "Name the finish on the drawing; it comes back on your quote" (was "We do not plate in-house"); the catalogue's eighth cell now ends "send the drawing — you will have an answer and a price within 24 hours" (was "we will tell you straight whether we can make it").
- Fixed a rendering bug found during review: "since 2017" rendered as "since2017" because Astro trims whitespace around a line-broken expression. A scan of the whole rendered page for word/digit fusions found no others (the only matches were inside the GSTIN, the email address and "WhatsApp").
- Validation: `npm run check` passed (0 errors/warnings/hints, Prettier clean); `npm run build` passed; HTML audit: 41 pages, 0 errors. No horizontal overflow at 375 px in the new section (document scrollWidth equals viewport). Still 0 `<script>` tags; page 17.7 KB gzipped.

### 16.3 Catalogue parts rendered as lit steel (3 Nov 2026)

- Rahul's note: the product grid "uses sample generated images" and should show real, high-quality,
  photographic parts. The flat line drawings did read as generic clip-art on the dark panel.
- **What was built.** The seven technical drawings are now repainted as lit steel instead of being
  redrawn: the stroke takes a vertical steel gradient (which gives each coil its cylindrical form)
  and runs through an SVG `feSpecularLighting` filter that turns a flat stroke into a round, lit
  wire. New `WireDefs.astro` holds the two gradients and two filters, rendered once per page; the
  existing `src/components/diagrams/*` are untouched and the live site is unaffected.
- Per-part tuning: a wire gauge in viewBox units (close-wound torsion and extension take a thinner
  stroke or the coils merge; compression, conical and wire forms carry a heavier wire) and an
  optical scale so the seven parts read at comparable size in the grid. Centre lines are hidden —
  they belong on the spec sheet, not on a product render. Steel tone is neutral grey, matched to the
  real photograph sharing the same row.
- **Cost: +0.8 KB gzipped** for the whole treatment (17.7 → 18.5 KB), because it is vector, not
  bitmaps. Still 0 `<script>` tags and still under the live homepage's 22.3 KB.
- **These are renders, not photographs, and are not presented as photographs.** No stock image and
  no generated product photo was used, per AGENTS.md §8. The one genuine photograph the client has
  supplied — the polished double torsion spring — now appears on card 02 as a real product shot.
- **Photo slots are data-driven.** `photos` in `Catalogue.astro` maps a diagram key to an imported
  image; any product without an entry falls back to its render. Adopting a real photo is: drop the
  file in `src/assets/products/`, import it, add one line. No layout work.
- **`PHOTO-SHOOT-BRIEF.md` added at the repo root** — a 45-minute phone shoot the client can do
  himself: window side-light, white paper sweep, settings, a 7-shot product list and an 8-shot
  factory list, plus the warning not to send by WhatsApp (which compresses away the detail) and the
  outstanding non-photo items (logo source file, ZED PDF, machine list, map pin).
- Validation: `npm run check` passed (0 errors/warnings/hints, Prettier clean); `npm run build`
  passed; HTML audit: 41 pages, 0 errors. No horizontal overflow at 375 px in the grid; all seven
  renders fit their cards on a phone. Reviewed at 900 px and 1440 px.

### 16.4 Real product photographs adopted on `/landing3/` (3 Nov 2026)

- Rahul supplied six product photographs in `website/public/brand/`. With the double torsion
  photo already held, all seven catalogue cards now carry a real photograph; the rendered steel
  illustrations from §16.3 remain in the code as the fallback for any card without one.
- **Each photo was background-removed, defringed and upscaled**, not used as supplied:
  - Five were shot on white. Keyed by near-white distance, with a size filter so large near-white
    regions (the backdrop *and* enclosed loop interiors) go transparent while small specular
    highlights on the wire stay opaque, plus adjacency handling so JPEG ringing beside the key is
    treated as backdrop rather than left as white dots.
  - The matte is contracted and feathered rather than un-premultiplied; un-premultiplying was
    blowing ringing pixels out to white.
  - **Defringe:** every non-opaque pixel takes the colour of its nearest opaque neighbour. Without
    this the old white backdrop sits in the RGB of transparent pixels and bleeds back in whenever
    the image is resampled — it showed as white speckle around every coil.
  - The wire form was the hard one: grey backdrop, a cast shadow, and a demonstration mandrel that
    is not RK's product. Keyed on smooth-and-light regions wherever they occur (a border flood fill
    cannot reach inside the clip's closed loop), then restricted to the bright zinc so the mandrel
    and shadow drop out.
  - Upscaled to a 1600 px long edge with Lanczos, sharpened on the colour channels only — sharpening
    alpha puts bright speckle on the silhouette.
  - The spiral spring is a black-oxide part and read as a silhouette on the dark card, so its
    midtones were lifted (mean luminance 35 → 61). No other photo was colour-graded.
- Masters stored as WebP with alpha in `src/assets/products/` (51–353 KB each, down from 0.3–2.0 MB
  as PNG). Astro serves 8–28 KB variants at phone size. The six supplied originals were moved to
  `src/assets/products/source/` — they were unreferenced in `public/` and would have been deployed
  and indexable.
- Card art boxes are now a fixed 196 px so every card's title sits on the same line regardless of a
  photo's aspect ratio, with a small per-part optical scale.
- **The page got lighter, not heavier: 18.5 → 15.6 KB gzipped**, because seven inline SVG drawings
  left the markup. Still 0 `<script>` tags.
- **Provenance to confirm with the client.** These are studio shots on white seamless, not bench
  photos from Talawade. Worth confirming they are RK's own parts, or that RK has the right to use
  them, before launch — AGENTS.md §8 rules out stock photography, and original images are also what
  earns the Google Business Profile and image-search value. `PHOTO-SHOOT-BRIEF.md` still stands for
  getting bench photos of the real parts.
- Validation: `npm run check` passed (0 errors/warnings/hints, Prettier clean); `npm run build`
  passed; HTML audit: 41 pages, 0 errors. At 375 px: no horizontal overflow, all 7 images load, and
  the browser selects the 292 px variants rather than the masters.

### 16.5 Pointer-reactive hero (3 Nov 2026)

- Rahul's brief: the hero is too simple; make it react to the cursor, in a way that suits the
  industry, without making the page lag.
- **The interaction is a CAD probe**, which is the on-brand choice for a spring maker — the part sits
  in a viewport and the cursor behaves like a measuring probe over it:
  - A fine amber crosshair with a target ring tracks the pointer across the stage.
  - A live coordinate readout (`X +012.4  Y −008.1 mm`) in the bottom-left corner, the stage mapped
    to a 120 × 110 mm sheet with the datum at centre. It reads out the viewport, exactly as CAD
    does; it asserts nothing about the part.
  - A light you carry with the cursor: a screen-blended radial that lifts the blueprint grid and
    the steel as it passes.
  - Depth parallax at four rates — backdrop glow −26 px, grid −7 px, the part +13 px, the corner
    tags +19 px — so the part separates from the frame as you move.
  - The corner crop marks brighten and thicken while the probe is in the frame.
- **How it stays cheap.** One passive `pointermove` listener on the stage, which only stores the
  coordinates. A single `requestAnimationFrame` per frame does one `getBoundingClientRect` read and
  then writes four custom properties (`--mx`, `--my`, `--nx`, `--ny`) on the hero section. Every
  effect downstream is a `transform` or an `opacity`, so the work is the compositor's and nothing
  re-lays-out. No library, no scroll listener, no per-element JS.
- **Measured, not assumed.** Driving synthetic pointer events at ~120 Hz for one second: frame
  interval median 16.7 ms, p95 17.3 ms, versus 16.7/16.8 ms idle — a held 60 fps. One frame of 69
  exceeded 20 ms, attributable to the measurement harness starting its own interval.
- **Cost: 1,760 B of inline JS (720 B gzipped)**, the page's only script. Against the AGENTS.md §4
  budget of under 100 KB that is 0.7%, and there is no extra request because it is inline.
- **Does nothing where it should not.** The script returns before attaching any listener when the
  pointer is coarse or the user prefers reduced motion — verified at 375 px, where it writes no
  custom property and sets no state, so phones do no work at all. A `prefers-reduced-motion: reduce`
  block also resets every parallax transform; that path is enforced in code and CSS but was not
  browser-emulated in this session.
- The hero image's entry animation was switched from `transform` to the individual `scale` and
  `rotate` properties, so its `both` fill no longer overrides the parallax translate.
- Validation: `npm run check` passed (0 errors/warnings/hints, ESLint and Prettier clean);
  `npm run build` passed; HTML audit: 41 pages, 0 errors. Page 16.2 KB gzipped. No horizontal
  overflow in the hero at 375 px.

### 16.6 Hero interaction rebuilt as a wire field (3 Nov 2026)

- Rahul rejected the §16.5 CAD probe as not good enough. Fair: a 1 px crosshair and a coordinate
  readout are a clever idea but almost nothing to *look* at, and the effect was confined to the
  small viewport box rather than the whole hero. Replaced, not tuned.
- **The new idea is the company's own process.** Move the pointer anywhere in the hero and the
  wire coils around it:
  - A staggered grid of ~750 points covers the whole hero. Each draws a short arc **centred on the
    pointer**, so the field resolves into true concentric rings — a coil being wound, not dashes
    being tilted. Arc length and brightness fall off with distance over a 400 px reach, and the
    stored influence eases back so the coil relaxes rather than snapping when the pointer leaves.
  - The field centre trails the pointer, so the coil winds to catch up instead of being welded to
    the cursor.
  - **Two damped springs** (stiffness 0.055 / 0.03) chase the pointer and drive the part and its
    labels, so the steel overshoots and settles. A spring maker's hero should move like a spring;
    the previous linear parallax did not.
  - A screen-blended light travels with the pointer, lifting the grid and glinting off the part,
    and the viewport's crop marks brighten while the pointer is in the hero.
- **Why it does not cost anything.** Whatever the grid size, the canvas draws in **four batched
  paths — four `stroke()` calls per frame**, bucketed by influence. The DOM side is only
  `transform` and `opacity`, driven through custom properties, so nothing re-lays-out. One passive
  listener; one `getBoundingClientRect` per move.
- **Measured.** Driving synthetic pointer events at ~120 Hz across the hero, with 748 grid points on
  a 2880 × 1750 canvas at DPR 2: frame interval median 16.7 ms, p95 18.1 ms, and **0 of 79 frames
  over 20 ms** — identical to the idle baseline. A held 60 fps.
- **It stops when you stop.** The loop ends once the field has relaxed and both springs have
  settled: 0 `requestAnimationFrame` callbacks in the 1.5 s after settling, so no CPU is burnt
  while the page sits idle.
- **Nothing on phones.** With a coarse pointer or reduced motion the script returns before
  attaching anything — verified at 375 px: the canvas never sizes its backing store, no custom
  property is written, no state is set.
- Field held at 0.88 opacity with the brightest band at 0.74 so the coil never competes with the
  copy it passes under; the text renders above the canvas and stays fully legible.
- Cost: 5,559 B inline JS (**1,937 B gzipped**), the page's only script — about 2% of the
  AGENTS.md §4 budget, with no extra request. Page 17.4 KB gzipped.
- Validation: `npm run check` passed (0 errors/warnings/hints, ESLint and Prettier clean);
  `npm run build` passed; HTML audit: 41 pages, 0 errors. No horizontal overflow at 375 px.

## 17. SEO pass (23 Oct 2026)

Full record in `SEO-WORK-LOG.md`. What changed, for content review:

- **Titles** are keyword-first on every page, e.g. "Torsion Spring Manufacturer in Pune". Long titles use the short suffix "| RK Springs". Please check the wording reads well to a buyer.
- **Product H1s** now carry the place: "Custom torsion springs, made in Pune", "Tension and extension springs, made in Pune", "Custom wire forms, bent in Pune", and so on.
- **Product H2s** name the product: "Torsion spring specification", "Where torsion springs are used", "How we make torsion springs", "Torsion spring FAQ".
- **New contextual links:**
  - Home → all calculators, and all guides + glossary
  - Glossary → "Put the terms to work"
  - HSN and price guides → springs hub
  - Talawade page → springs and industries hubs
  - 404 → "Popular pages"
- **Share cards:** every page now has its own share card (`public/og/`), made from the page's own technical drawing. Re-run `npm run og` after changing an H1 or adding a page.
- **No new facts were added.** No reviews, prices, ISO, PPAP, lab or export claims. No `Product` schema without prices or reviews.
- New open items:
  - [ ] Real logo → re-run `npm run og` (favicon, apple-touch icon, schema logo and all share cards are rendered from the temporary mark).
  - [ ] GBP / IndiaMART / Justdial / LinkedIn URLs for `site.sameAs`.
  - [ ] `sales@rksprings.com` once it exists.
  - [ ] Client OK on allowing AI training crawlers in `robots.txt` (allowed by default, per the blueprint).
  - [x] `SEO-MASTER-PLAYBOOK.md` is now in the repo (committed on `landing-redesign`), so it can be checked against this pass.
