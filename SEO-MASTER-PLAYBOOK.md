# SEO Master Playbook: B2B manufacturer websites (Google + AI search)

> **Version:** 24 Oct 2026. Written from the Sudarshan Paints build (an industrial paint manufacturer in Chakan, Pune), Google's own 2026 guidance, and 2026 industry research.
> **Use it for:** any Indian B2B manufacturer website, first **RK Springs & Wireforms** (section 13).
> **Who reads it:** you, and any AI coding agent (Claude, Cursor) working on the site. Section 14 is a ready-to-paste instruction for the agent.

---

## 0. How an AI agent must use this file

1. **Order of authority:** the client's confirmed facts file (for RK Springs: `CLIENT-PROFILE.md`) **always wins**. Next comes the project's own `AGENTS.md`. This playbook sets the SEO standard on top of them. If this file disagrees with a confirmed client fact, the client fact wins.
2. **Never invent facts** to "help SEO": no made-up numbers, certifications, customers, reviews, ratings, years, machines or awards. A missing fact becomes a visible `TODO(client)` in development and is hidden in production. Invented facts are the fastest way to lose trust with Google, AI engines and buyers.
3. Work through section 9 (the checklist). Mark each item done or not applicable, with the file it lives in.
4. Before calling SEO work finished, run the quality gates in section 8.

---

## 1. Reality check: what "ranking in 2 months" really means

Nobody can guarantee a Google position, and anyone who promises "#1 in 2 months" is guessing or using spam. Here is what a well-built new site can **realistically** get in about 60 days:

| Within ~2 months (realistic) | 3–6 months | 6–12+ months |
|---|---|---|
| All pages indexed in Google and Bing; brand name searches show the site + Google Business Profile (GBP) | Page 1 for specific long-tail local searches ("double torsion spring manufacturer pune") | Top 3 for big local head terms ("spring manufacturers in pune") |
| GBP showing in the Maps pack near the factory, **if** it is verified, complete and collecting real reviews | Map-pack top 3 across the nearby industrial belt | National terms ("torsion spring manufacturer india"): needs links and brand mentions |
| First impressions in Search Console for long-tail and "near me" searches | Informational guides ranking (price guide, HSN/GST, how to measure) | Regular citations in ChatGPT / Perplexity / AI Overviews for category questions |
| First enquiries from GBP (usually before the website ranks) | Steady qualified enquiries from organic | |

**Why it takes time:** Google has to discover, crawl and index the pages, then build trust in a new domain from links, mentions, reviews and how users behave. The fastest levers are, in order: **GBP + real reviews (weeks) → citations and directory listings (weeks) → content depth and internal links (months) → links and brand mentions (months)**.

**What speeds it up:** a verified GBP on day 1, Search Console + Bing Webmaster set up before launch, a clean sitemap, 15–30 real reviews in the first 60 days, listings on IndiaMART / Justdial / TradeIndia with **identical** name, address and phone, and replying to enquiries within hours.

---

## 2. How Google and AI engines choose results in 2026 (the short version)

- **Google's own position: normal SEO is still the foundation for AI features.** Google's "AI features and your website" guide says SEO best practices still apply to AI Overviews and AI Mode. Those features use "query fan-out": they run several related sub-searches and cite supporting pages. So a site that answers the main question **and** the follow-up questions (materials, tolerances, MOQ, lead time, price factors) gets more chances to be cited.
- **2026 core updates rewarded depth and topical authority.** The March and May 2026 core updates were large. Reports say focused sites with fewer, deeply researched pages on one narrow topic beat high-volume content farms. Pages with real examples, real data and original testing gained over generic rewrites. A manufacturer is naturally a narrow-topic expert. Use that.
- **Spam policies are actively enforced** (spam updates in March, June and August 2026). The ones that matter for us:
  - *scaled content abuse*: mass-produced pages made mainly to rank, whether written by AI, templates or freelancers. 50 copy-paste "spring manufacturer in {city}" pages are exactly this.
  - *expired domain abuse*: buying an old domain to borrow its ranking.
  - *site reputation abuse*: putting third-party content on a trusted domain to borrow its authority.
- **AI engines cite differently from each other.**
  - Google AI Overviews mostly cite pages that already rank well in Google.
  - ChatGPT search is widely believed to lean on Bing-style results. OpenAI has not confirmed this, but Bing Webmaster Tools is free, so do it anyway.
  - Perplexity strongly favours fresh, dated content.
  - All of them prefer pages that put a **direct answer near the top**, with clear structure (tables, short definitions, FAQs) and a clearly identified business behind them.
- **FAQ rich results are gone from Google (retired 7 May 2026);** HowTo rich results went in 2023. FAQ *content* is still very useful, for AI answers and for buyers. Keeping `FAQPage` markup is harmless, but don't expect FAQ dropdowns in Google any more.
- **llms.txt is cheap but low-impact.** Adoption grew fast, but log studies found 97% of llms.txt files got zero AI-bot requests (May 2026). Google says it does not use it. Keep one because it takes minutes, but never count it as an SEO win.

---

## 3. The foundation: one clear business identity ("entity")

Google and AI engines must be 100% sure who the business is. Ambiguity makes them skip you.

- **NAP must be identical everywhere:** name, address and phone, character for character, on the site footer, contact page, schema, GBP, IndiaMART, Justdial, TradeIndia, LinkedIn, Facebook, the GST listing and invoices. Decide the exact public name and the legal name once. RK example: brand "RK Springs & Wireforms", legal "RK Enterprises".
- **Organization / LocalBusiness schema** on the site carries `name`, `legalName`, `url`, `logo`, `address`, `geo`, `telephone`, `email`, `openingHoursSpecification`, `foundingDate`, and `sameAs` links to every real profile (GBP, IndiaMART, LinkedIn, YouTube, Facebook). Generate it from the single site-config file, never hand-pasted.
- **About page with real facts:** founding year, founder, factory address, real capabilities, certificates **with the certificate number or PDF**, what you do *not* do. Honest limits ("we don't make springs above 2.5 mm wire") build trust and filter out bad leads.
- **The domain** should be the brand (e.g. rksprings.in or .com). Never buy an expired domain to "inherit" ranking.
- **A domain email** (sales@domain), not Gmail, on the site and GBP. It is a trust signal.

---

## 4. Site architecture and keyword mapping

**Rule: one search intent = one page. Every important keyword cluster has exactly one page that owns it.** Two pages targeting the same thing compete with each other ("cannibalisation").

Typical B2B manufacturer structure (Sudarshan and RK both follow this):

```
/                                   Brand + main head term ("industrial paint manufacturer in Pune")
/products/ (or /springs/)           Hub: all categories
/products/<category>/               Category page: owns "<category> manufacturer" terms
/products/<category>/<product>/     Product page: owns the exact product name + specs searches
/industries/ and /industries/<x>/   Buyer-industry pages ("springs for switchgear")
/capabilities/<process>/            What we can do (reverse engineering, heat treatment…)
/<location page(s)>                 Only for places you genuinely serve, each with unique content
/resources/ or /blog/<guide>/       Informational guides that answer real buyer questions
/tools/<calculator>/                Calculators: earn links and AI citations
/about/ /quality/ /contact/ /request-a-quote/
/faq/ (optional)                    Only if the answers are not already on the relevant pages
```

- **URLs:** lowercase, hyphens, short, English keywords, **one consistent trailing-slash rule** (both sites use a trailing slash), no dates, no IDs, no query strings for real pages.
- **Depth:** every important page is reachable within 3 clicks from home.
- **Keyword research:** use Google autocomplete, "People also ask", Search Console queries (after launch), competitor sitemaps, and IndiaMART category names (buyers use those words). Map each cluster to a page in a keyword map table, kept in the repo.
- **Location pages:** build one only where there is something true and specific to say: the factory's own area, a nearby industrial belt you really supply, an export country you really ship to. Each needs unique content: which industries there, delivery time, real examples. **Never** make city pages with only the city name swapped.
- **Old site migration:** map every old URL to its new URL with a **301 redirect**. Sudarshan kept a `redirects.json` for this. Lost redirects mean lost rankings.

---

## 5. On-page rules (every page)

| Element | Rule |
|---|---|
| `<title>` | Unique, ≤ 60 characters, main keyword first, brand last. E.g. "Torsion Spring Manufacturer in Pune \| RK Springs" |
| Meta description | Unique, ≤ 155 characters, says what the page offers plus one concrete proof (wire range, MOQ, quote in 24 h). It is ad copy for the click, not a ranking factor |
| H1 | Exactly one per page. Says what the page is, in the buyer's words. Can differ slightly from the title |
| First 2–3 sentences | **Answer first:** what it is, who it's for, the key spec range, where you are. AI engines quote the top of the page most often |
| Headings | H2/H3 in logical order, written as the questions buyers ask ("What wire sizes can you coil?") |
| Specs | Real numbers in an HTML **table** (not an image): material, wire diameter range, finishes, standards, MOQ, lead time |
| Body | Specific, plain Indian-English B2B writing. No filler ("world-class", "leading", "one-stop solution", "best quality") |
| FAQs | 3–6 real buyer questions per key page, answered in 2–4 sentences each |
| Internal links | Descriptive anchor text ("compression springs for switchgear"), never "click here". Product ↔ category ↔ industry ↔ guide links both ways. No orphan pages |
| Images | Real photos (or honest drawings). Descriptive file names (`torsion-spring-0.8mm-ss304.avif`), useful `alt` text, width/height set, AVIF/WebP |
| CTA | A clear next step on every page: request a quote, WhatsApp, call. A form that asks the qualifying questions (quantity, drawing upload, material) |
| Freshness | Show "Last updated" on guides and update them for real. Don't fake dates |
| Language | `lang="en-IN"`, ₹ for prices, metric units first |

---

## 6. Technical SEO specification

- **Rendering:** pages are server-rendered or static HTML, so all content is in the HTML source. Never put important text only behind JavaScript.
- **Canonical:** every page has a self-referencing **absolute** canonical. Filter, sort, UTM and prefill URLs canonicalise to the clean URL.
- **robots.txt:**
  - Allow everything public.
  - Disallow `/api/`, thank-you pages, style guides, dev or preview pages and query-string variants.
  - Link the sitemap.
  - Allow the AI search crawlers too: `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`, `Claude-User`, `Bingbot`, `Applebot`. Sudarshan names each one explicitly.
  - Decide consciously about training-only bots (`GPTBot`, `Google-Extended`, `ClaudeBot`). For a manufacturer that wants to be known, allowing them is usually fine.
- **Sitemap.xml:**
  - Only indexable 200-status canonical URLs. No noindex pages, redirects or thank-you pages.
  - Real `lastmod` dates.
  - Image entries for product photos (helps image search).
  - Submit it in Google Search Console and Bing Webmaster Tools.
- **noindex** on thank-you pages, internal search results, styleguide, previews, and any staging or preview deployment (gate on the production environment variable, as both projects do).
- **Status codes:** a real 404 page returning HTTP 404, which links back to the main sections. 301 redirects for moved pages. No redirect chains.
- **HTTPS everywhere, one host:** pick www or non-www and 301 the other.
- **Core Web Vitals (mobile):** LCP < 2.5 s (aim < 1.8 s), INP < 200 ms, CLS < 0.1 (aim < 0.05). Self-hosted fonts with `font-display: swap`. No sliders, carousels or autoplay video. Lazy-load below-the-fold images and keep the hero image eager. Sudarshan's home page scored Lighthouse 100.
- **Mobile-first:** Google indexes the mobile version. Everything on desktop must also exist on mobile.
- **Open Graph / social images** for every page (WhatsApp and LinkedIn previews). Sudarshan generates them from text at build time.
- **hreflang:** only if you publish in more than one language or region version. English-only sites don't need it.
- **IndexNow** (Bing, Yandex and others; *not* Google): optional ping on deploy so Bing picks up changes fast.

---

## 7. Structured data (JSON-LD) specification

Generate all schema from the data files. It must match what is **visible on the page**: schema that claims things the page doesn't show is spam.

| Schema | Where | Notes |
|---|---|---|
| `Organization` (site-wide, with a stable `@id`) + `LocalBusiness` (`additionalType` Manufacturer, `parentOrganization` → the org `@id`) | Organization on every page via the layout; LocalBusiness on home, contact and the factory's location page | name, legalName, alternateName, disambiguatingDescription (if the name collides with other firms), logo, address, geo, phone, email, opening hours (only once confirmed), foundingDate, sameAs, areaServed, hasCredential (only real certificates) |
| `WebSite` | Home | Add `SearchAction` only if the site really has search |
| `BreadcrumbList` | Every page except home | Must match the visible breadcrumbs |
| `Product` | Product pages | name, description, image, brand, manufacturer, material, additionalProperty for specs. **No `offers` with a price unless a real price is shown. No `aggregateRating` or `review` unless real reviews are visible on the page** |
| `ItemList` / `CollectionPage` | Category hubs | Lists the products |
| `Article` / `BlogPosting` | Guides | headline, datePublished, dateModified (real), author (real person or the organization), image |
| `FAQPage` | Pages with visible FAQs | No longer shows rich results in Google (May 2026), but harmless and still readable by other engines. Optional |
| `Service` | Capability pages (reverse engineering, prototyping) | Optional |

Validate with Google's Rich Results Test and the Schema.org validator before launch, and after every template change.

---

## 8. Quality gates before any SEO work is "done"

Run these and fix everything before launch and after big changes. Sudarshan has a script (`scripts/seo-report.ts`) that checks most of them automatically. Copy the idea.

1. Every indexable page: exactly one H1, unique title ≤ 60, unique meta ≤ 155, absolute canonical, at least one internal link pointing in, no broken links.
2. Sitemap URLs = indexable pages (nothing missing, nothing extra).
3. No `noindex` on real pages, and `noindex` on all preview and staging deploys.
4. JSON-LD validates, and every claim in it is visible on the page.
5. No placeholder or TODO text in the production build (Sudarshan: `scripts/check-placeholders.ts`).
6. Lighthouse mobile ≥ 90 for performance, accessibility, best practices and SEO on the key templates (home, category, product, guide).
7. All images have alt text and dimensions. No image larger than needed.
8. Every old-site URL redirects (301) to the right new page.
9. Real-browser check of key pages, forms and WhatsApp links on a phone.

---

## 9. Master checklist (DO list)

### A. Before launch
- [ ] Final brand name, legal name, address, phone, email written down once (the site config file is the single source)
- [ ] Domain bought (the brand name; never an expired domain for its "authority"); domain email set up
- [ ] Keyword map: every cluster → one page
- [ ] Every page passes sections 5–8
- [ ] Redirect map from the old site (if any)
- [ ] Analytics with a consent banner (GA4 or a privacy-friendly tool); conversion events for form submit, WhatsApp click and phone click
- [ ] Privacy policy and terms (India's DPDP Act: consent text on forms)

### B. Launch day
- [ ] Google Search Console: verify the domain property, submit the sitemap, inspect the home page and request indexing for the 10 most important URLs
- [ ] Bing Webmaster Tools: import from GSC, submit the sitemap (Bing also feeds DuckDuckGo, Yahoo and Copilot, and likely ChatGPT search)
- [ ] Google Business Profile: verified, correct primary category (e.g. "Spring supplier" / "Paint manufacturer") plus secondary categories, hours, phone, website URL with UTM, services/products listed, 10+ real photos (factory, machines, products, team), business description with the main keywords written naturally
- [ ] Remove any "noindex" or password left over from preview

### C. First 60 days (see the week-by-week plan in section 10)
- [ ] Citations with identical NAP: IndiaMART, Justdial, TradeIndia, ExportersIndia, Sulekha, LinkedIn company page, Facebook page, Udyam/MSME listings where public, the local industry association (e.g. PCMC / MCCIA / Chakan industries association), Bing Places, Apple Business Connect
- [ ] A review system: after every delivered order, send the GBP review link on WhatsApp. Ask buyers to mention the product and their use ("double torsion springs for switchgear"). Reply to every review
- [ ] GBP posts weekly (a product photo plus 2–3 lines plus a link)
- [ ] One strong guide every 1–2 weeks answering a real buyer question
- [ ] Check GSC weekly: indexing errors, queries with impressions but low click-through (rewrite their titles), pages not indexed

### D. Ongoing (monthly)
- [ ] Update one older guide with new facts and real data (Perplexity and Google like genuine freshness)
- [ ] Add real case stories: problem → spring/coating solution → result. Photos with the customer's permission
- [ ] Earn links: supplier pages of customers ("our suppliers"), industry associations, local news (new machine, ZED certificate), trade-show listings, college/ITI collaborations, guest technical articles
- [ ] YouTube: short factory videos (coiling, grinding, painting line) with the same NAP in the description and a link to the matching page
- [ ] AI visibility test: run the same 20 prompts monthly in ChatGPT, Perplexity, Gemini and Google AI Mode ("best torsion spring manufacturer in Pune", "who makes MCB springs in Pune"…). Record whether the business is mentioned and which sources are cited, then get listed on those cited sources
- [ ] Report monthly: GSC clicks/impressions, top queries, GBP calls/directions/website clicks, reviews count, enquiries, and orders won (₹)

---

## 10. 60-day action plan

| Week | Website | Google Business Profile & listings | Content & authority |
|---|---|---|---|
| 0 (pre-launch) | Pass quality gates; final NAP; analytics + conversions | Create/claim GBP; start verification (can take days) | Keyword map final; first 3 guides drafted |
| 1 | Launch; GSC + Bing; sitemap; request indexing for top 10 URLs | GBP complete with photos; first 5 review requests to happy customers | Publish guide 1 |
| 2 | Fix anything GSC flags; check mobile on real phones | IndiaMART, Justdial, TradeIndia, LinkedIn, Facebook with identical NAP | Publish guide 2; first GBP post |
| 3 | Add internal links from new guides to products | Bing Places, Apple Business Connect, association directory | Ask 3 customers for a supplier-page link or testimonial (written permission) |
| 4 | Review GSC queries; rewrite titles with impressions but low CTR | 10+ reviews target; reply to all | Publish guide 3; first case story |
| 5–6 | Add a calculator or comparison table if missing (link magnet) | Weekly GBP posts with photos; Q&A on GBP | Local PR: a new machine, certificate or capacity news to local business news/association newsletter |
| 7–8 | Content refresh of week-1 pages with new FAQs from real enquiries | 15–30 reviews target | AI prompt test #1 (baseline); list the business on the sites the AI tools cite |

**The biggest single factor in 60 days is the GBP + reviews + correct citations.** The website makes those convert and starts the long-term organic growth.

---

## 11. DON'T list (and why)

| Don't | Why |
|---|---|
| Invent facts: certifications, years, customers, numbers, test labs, "100% inspection" | Misleading claims lose buyer trust and legal safety, and AI engines cross-check facts across sources |
| Fake reviews, review swaps, paid reviews, reviews from staff | Breaks Google's GBP policies; reviews get removed and the profile can be suspended |
| `aggregateRating` / review schema without real visible reviews | Structured-data spam; manual action risk |
| Keyword-stuffed GBP name ("RK Springs Best Spring Manufacturer Pune") | GBP policy violation; competitors can report it and get the profile suspended |
| Copy-paste city pages ("spring manufacturer in Nashik/Nagpur/…" with only the city changed) | Scaled content abuse / doorway pages: the whole site can drop |
| Mass AI-written blog posts with no real expertise | Scaled content abuse; 2026 core updates demote generic content |
| Copying competitor text or manufacturer catalogue text word for word | Duplicate content; no reason for Google to rank you |
| Buying links, link packages, PBNs, "DA 50 guest posts" | Link spam; ignored at best, penalised at worst |
| Buying an expired domain to inherit its ranking | Expired domain abuse policy |
| Stock or AI-generated photos presented as your factory, team or products | Deceptive; buyers and AI vision checks notice; RK's rules forbid it |
| Hiding text, cloaking, showing Google different content from users | Spam policy violation |
| Changing URLs without 301 redirects | Loses the ranking the old URL earned |
| Leaving staging/preview sites indexable | Duplicate copies of the site in Google |
| Many thin pages for tiny keyword variations | Cannibalisation and thin content; one strong page beats five weak ones |
| Blocking CSS/JS or the AI search bots in robots.txt by accident | Google can't render the page; AI tools can't read it |
| Chasing "GEO hacks" (hidden prompts for AI, invisible text for LLMs) | Google's 2026 AI guide explicitly says standard SEO is what works; hidden-text tricks are spam |
| Using popups that cover content on mobile | Intrusive interstitials hurt mobile experience |
| Publishing customer names or logos without written permission | Legal risk; a removal request later breaks pages |
| Promising "#1 in 2 months" to the client | It can't be guaranteed; set the expectations in section 1 |

---

## 12. Worked example: what we built for Sudarshan Paints

Use this as the reference implementation. Code: `~/Documents/sudarshan-website` (Next.js 16, fully prerendered, hosted on Vercel in Mumbai).

### 12.1 Results at the 23 Oct 2026 audit

- **94 indexable URLs, 0 SEO issues** (`SEO_REPORT.md`, generated by `npm run seo:report`).
- **Lighthouse mobile:** home 100/100/100/100, product page 98/100/100/100, category 95, product finder 94. CLS 0 everywhere. (The old site's home page was about 65 MB of video.)
- **Tests:** 101 Playwright tests pass, 184 cross-browser, and 0 accessibility violations on 27 templates.

### 12.2 Architecture

| Page type | Count | URL pattern | Owns the keyword |
|---|---|---|---|
| Home | 1 | `/` | "industrial paint manufacturer & exporter, Pune" |
| Category | 11 | `/products/<category>/` | "<product type> manufacturer in Pune" |
| Product | 38 indexable (+12 noindex) | `/products/<category>/<product>/` | exact product name and spec searches |
| Industry | 9 | `/industries/<slug>/` | "paints for cranes / transformers / sugar plants…" |
| Paint system | 6 | `/paint-systems/<slug>/` | "ISO 12944 C4 paint system", "high-temperature system" |
| Location | 4 | `/industrial-paint-manufacturer-chakan/`, `…-pune/`, `/industrial-paint-supplier-maharashtra/`, `…-india/` | local head terms |
| Export | hub + 2 countries | `/export/`, `/export/uae/`, `/export/russia/` | "paint supplier to the UAE" |
| Guides | 3 | `/blog/<slug>/` | comparison questions (epoxy vs PU, 250 vs 400 vs 600 °C) |
| Trust / tools | ~20 | `/about-us/`, `/quality-lab/`, `/clients/`, `/downloads/`, `/resources/tds/`, `/tools/paint-coverage-calculator/`, `/shade-studio/`, `/faq/`, `/site-map/`… | brand trust, data, link magnets |

- **One URL registry** (`lib/routes.ts` → `liveInternalPaths()`) feeds the sitemap, the SEO report and the crawler tests, so nothing can drift.
- **No thin doorway pages.** The old site had about 80 near-identical "paint in {city}" pages (85–96% the same text). They were merged into the 4 rich location pages with **159 permanent (301) redirects** (`data/redirects.json`). A test checks that every redirect lands on a live page.
- **Export country pages publish only for confirmed markets** (`data/markets.json` → `confirmed: true`). Unconfirmed countries return 404.
- **12 products without a technical data sheet stay `noindex`** and out of the sitemap, so no thin pages are indexed. They index automatically once their data arrives.

### 12.3 On-page system

- Every title and meta is hand-written per page. The build **throws** if a title is over 60 characters, a description is outside 50–155, or two pages share a title or description (`lib/metadata.ts`, `lib/catalog-metadata.ts`).
- Title patterns:
  - Category: "Epoxy Primer Manufacturer in Pune | Sudarshan Paints"
  - Product: "Epoxy Zinc Rich Primer – 2K, Grey | Sudarshan Paints"
  - Location: "Industrial Paint Manufacturer in Chakan MIDC | Sudarshan"
- **H1 differs from the title** and says it in the buyer's words.
- **Answer-first product pages:** H1 → a 2–3 sentence intro → a "Key facts" list built **only from the data sheet**. It covers film thickness, coverage, drying, mixing ratio, salt-spray hours, heat rating, thinner and pack sizes. These are the facts AI engines love to quote.
- **450+ unique words per indexable product.** Spec sentences are generated from the data; the prose is hand-written. A gate fails the build below that.
- **4–6 real FAQs per product, category, industry and location page.**
- **Internal links:**
  - Product → recommended system (primer → intermediate → topcoat → thinner) → related products → industries that use it → guides that mention it.
  - A footer "Where we supply" column links every location and export page from every page. Before this fix those pages had only 3–4 inbound links.
- **Site search** understands trade shorthand (MIO, ZRP, DTM, GI, HR, 2K, PU, QD, RAL).
- **Lead attribution:** each enquiry email records the landing page, referrer and UTM tags, so you can see which SEO page produced the lead.

### 12.4 Technical

- Absolute self-canonicals with a trailing slash. Filter and query URLs canonicalise to the clean page.
- `robots.txt` blocks `/api/`, the thank-you page, styleguide, dev pages and every query-string variant (`/*?*`). It explicitly allows `/_next/image`; a bug was caught where `/*?*` had blocked Google from crawling optimised images. It names 14 search and AI crawlers with the same rules.
- The sitemap lists only live indexable URLs, **with image entries** (pack photo per product, application photo per industry).
- **Real 404 status** for unknown URLs. A "soft 404" bug, where the framework returned 200 for missing pages, was found and fixed in `proxy.ts`.
- Branded 1200×630 social images generated per page (product cards even show film thickness and salt-spray hours).
- Security headers (HSTS, nosniff, frame options, referrer policy).

### 12.5 Structured data (`lib/schema.ts`)

- **Organization + Corporation** site-wide:
  - legalName, 3 alternate names, and a `disambiguatingDescription`. There are two other "Sudarshan" companies, so the entity must be unmistakable.
  - Logo, founder, address, contact point and `sameAs`.
  - ISO 9001 as `hasCredential`.
  - `areaServed` (India + confirmed export countries) and `knowsAbout`.
- **LocalBusiness** (additionalType Manufacturer) on home, contact, Chakan and Pune, with geo and map.
- **Other types:** BreadcrumbList on every inner page; Product with one `additionalProperty` per data-sheet spec; ItemList on hubs; FAQPage; BlogPosting; WebApplication for the calculator.
- **Deliberately absent:** `offers`/price (no approved price policy), `aggregateRating`/reviews (none on the page), and VideoObject (the only video was not real plant footage).

### 12.6 AI search

- `/llms.txt` generated from the same data as the pages: a summary of who they are (and that they don't make house paint), contact, every product with its key facts, systems, industries, export, locations and guides.
- All AI search and training crawlers allowed.
- One source of truth for name, address and phone (`lib/site.config.ts`) feeds the footer, schema, llms.txt, social cards and FAQs.
- **Data assets that earn citations and links:** an HTML data-sheet library, 36 data-sheet PDFs, a coverage calculator, a 215-shade RAL card, and ISO 12944 system pages.

### 12.7 Honesty gates (the part most sites skip)

- Unknown facts are typed `todo()` values. `scripts/check-placeholders.ts` fails the build if any TODO reaches the public HTML (750 files checked).
- `tests/copy.spec.ts` scans every page **and the JSON-LD** for about 50 banned phrases (developer wording, hedging, decorative-paint language).
- **Untrue claims were removed in the audit:** "SDS for every product" became "SDS on request"; "see our plant" became "product video"; unverified stats and price claims were dropped.
- Client names appear only as logos until the client gives written permission.

### 12.8 What Sudarshan still needs (and what to do better next time)

- **Client side:**
  - Google Business Profile claim and URL, opening hours, map-pin check, legal numbers.
  - ISO certificate scan, MD photo and bio, a named technical author, testimonials, a real plant video.
  - Price policy, data sheets for 12 products, more export markets.
  - Then reviews, citations and links.
- **Improve in the next project:**
  - Add real `lastmod` dates to the sitemap. Sudarshan has none; RK's Astro site already has `page-dates.ts`, so keep that.
  - Use a **named person** as blog author, not just "technical team".
  - Add `dateModified` to all pages that change.
  - Keep `inLanguage` consistent.

---

## 13. Applying this to RK Springs & Wireforms

RK Springs already has a strong foundation: `CLIENT-PROFILE.md` (confirmed facts), `AGENTS.md` (strict no-invention and SEO rules), and `RESEARCH-AND-SEO-BLUEPRINT.md` (keyword universe, competitor audit, KPIs). The Astro site in `website/` already has products under `/springs/`, `/industries/`, `/capabilities/`, `/resources/`, `/tools/`, one location page (`/locations/talawade-pcmc/`), a sitemap integration, `robots.txt`, `llms.txt`, JSON-LD components, and the indexable gate on production. **Don't rebuild it. Audit it against this playbook and close the gaps.**

### 13.1 What the agent should check first (gap audit)

| Area | Check | Sudarshan reference |
|---|---|---|
| robots.txt | Today it only allows `*` and disallows `/api/`. Consider: disallow `/request-a-quote/thank-you/`, `/styleguide/`, `/landing/` and query-string variants (`/*?*`), plus named AI search crawler groups | `app/robots.ts` |
| Sitemap | Image entries for product photos (once real photos exist); `lastmod` from `page-dates.ts` stays real | `app/sitemap.ts` |
| Schema | `Organization`/`LocalBusiness` with legalName "RK Enterprises", brand "RK Springs & Wireforms", geo (TODO(client): map pin), hours (Thursday closed), sameAs (GBP, IndiaMART, Justdial). `Product` on each spring page with material and wire-range `additionalProperty`, no price, no rating | `lib/schema.ts` |
| Quality gate script | An SEO report script that fails the build on duplicate titles, missing H1, title > 60, meta > 155, missing canonical, orphan pages | `scripts/seo-report.ts` |
| Placeholder check | Production build fails if any `TODO(client)` text leaks | `scripts/check-placeholders.ts` |
| Answer-first intros | Every spring page opens with what it is, wire range 0.40–2.50 mm, materials, MOQ 5,000–10,000 pcs, quote in 24 h, Talawade Pune | product pages |
| Specs tables | HTML tables for material, wire range, ends, finishes, industries | product pages |
| Internal links | Spring ↔ industry ↔ capability ↔ guide ↔ tool, both directions, descriptive anchors | — |
| Location pages | Only `/locations/talawade-pcmc/` is justified now. Bhosari, Chakan or Chikhali pages only if there is unique, true content (real customers or deliveries there) | `content/locations.ts` |
| Draft pages | `/springs/spiral-springs/` has `status: 'draft'` and is left out of the sitemap until the client confirms what "spiral" means. Confirm the built page also carries `noindex` and isn't linked from live pages | — |
| GBP | Category "Spring supplier" (check the closest available: "Spring supplier", "Metal fabricator"…), Talawade address, hours with Thursday closed, products list = the 6 product families | — |
| Not for RK | No export pages (no export now), no rolling-shutter, heavy-duty, agriculture or die-spring pages, no ISO/IATF/PPAP/testing claims | client profile §7 |

### 13.2 RK Springs keyword priorities (from the blueprint, filtered by the client profile)

1. Local transactional: "spring manufacturer in pune", "spring manufacturers in pcmc / bhosari / chakan / talawade", "torsion spring manufacturer pune", "double torsion spring manufacturer", "wire form manufacturer pune", "extension spring manufacturer pune", "compression spring manufacturer pune".
2. Industry: "switchgear springs / MCB springs manufacturer", "instrumentation springs", "furniture springs", "automotive springs pune".
3. Capability: "spring reverse engineering from sample", "custom spring manufacturer", "spring prototype development".
4. Informational (link and AI-citation magnets): "spring HSN code GST", "spring price in India", "how to measure a spring", "torsion vs extension vs compression spring", "what is a double torsion spring", calculators.

### 13.3 RK Springs 60-day focus (in order)

1. Domain + domain email + launch with the gates passed (blocked on the client: domain, logo, main phone/email, map pin).
2. GBP verified at Talawade with real factory photos, then 15–30 real reviews from existing referral customers (they already trust Rutvik: this is RK's fastest win).
3. IndiaMART, Justdial (the "RK Enterprises" listing they own; never touch the "R K Spring Works, Bhosari" one), TradeIndia, LinkedIn with **identical** NAP and the same brand line.
4. Factory photo and video shoot. It unlocks real images, YouTube and GBP posts.
5. Two new guides per month plus one case story per month (with permission), each linking to the matching spring page.
6. The monthly 20-prompt AI test from the blueprint's KPI table.

---

## 14. Ready-to-paste instruction for an AI agent

Copy this into the RK Springs session (or any new client project), together with this file:

```
Read these files fully before changing anything, in this order of authority:
1. CLIENT-PROFILE.md (confirmed facts; overrides everything)
2. AGENTS.md (project rules)
3. SEO-MASTER-PLAYBOOK.md (the SEO standard)
4. RESEARCH-AND-SEO-BLUEPRINT.md (research; some facts outdated, see CLIENT-PROFILE §7)

Task: audit the website in /website against SEO-MASTER-PLAYBOOK.md sections 5–9 and 13.
First produce SEO_AUDIT.md: a table of every gap (area, page/file, what's wrong,
fix, priority P1/P2/P3). Do not edit code yet. Wait for my approval, then fix the
gaps one priority at a time, run npm run build and npm run check after each batch,
and keep a log of what changed in SEO_AUDIT.md.

Never invent facts. Anything not confirmed in CLIENT-PROFILE.md stays a TODO(client).
```

---

## 15. Sources (checked 24 Oct 2026)

Google first-party:
- [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): Google Search Central
- [February 2026 Discover core update](https://developers.google.com/search/blog/2026/02/discover-core-update): Google Search Central Blog

2026 core updates, spam updates and AI search (secondary reporting; treat exact numbers with caution):
- [Google's May 2026 Core Update + AI Search Overhaul](https://cliquestudios.com/university/resources/google-may-2026-core-update-ai-search)
- [Google Core Updates 2026: Timeline, Changes and Recovery](https://www.dataslayer.ai/blog/google-core-update-december-2025-what-changed-and-how-to-fix-your-rankings)
- [Google's 2026 Algorithm Updates Explained](https://almcorp.com/googles-2026-algorithm-updates-explained/)
- [Google's New AI Search Guide Tells SEOs to Stop Chasing GEO Hacks](https://www.techwyse.com/news/ai-search/google-ai-search-guide-seo-geo-hacks)
- [Google's official advice on optimizing for AI Overviews & AI Mode](https://www.searchenginejournal.com/googles-official-advice-on-optimizing-for-ai-overviews-ai-mode/547341/)
- [Scaled content abuse](https://ppc.land/scaled-content-abuse/)
- [Google's August 2026 spam update](https://www.relevantaudience.com/seo/google-august-2026-spam-update/)

AI citations:
- [How ChatGPT, Google AI Overviews, and Perplexity source information (2026)](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026)
- [How AI engines choose sources in 2026](https://aeohunt.com/blog/how-ai-engines-choose-sources-2026)
- [llms.txt adoption rises 8.8x but 97% of files get zero AI requests](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/)
- [llms.txt is the meta keywords of 2026](https://guptadeepak.com/llms-txt-meta-keywords-2026/)
- [Bing Webmaster Tools and IndexNow for AI search: what's confirmed](https://eseospace.com/blog/bing-webmaster-tools-indexnow-ai-search/)

Rich results:
- [Google killed the FAQ rich result](https://jsonld.com/google-faq-rich-results-deprecated/)
- [Google drops FAQ rich results](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/)

Local SEO:
- [Local SEO ranking factors 2026](https://storerocket.io/learn/local-seo-ranking-factors)
- [Local SEO ranking factors in 2026: what moves the local pack](https://www.centricdxb.com/insights/local-seo-ranking-factors)
