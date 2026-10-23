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

## 11. SEO pass (23 Oct 2026)

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
  - [ ] `SEO-MASTER-PLAYBOOK.md` was mentioned but is not in the repo; push it so it can be checked against this pass.
