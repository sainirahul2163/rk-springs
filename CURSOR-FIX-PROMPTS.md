# Cursor fix prompts after the 4 Oct 2026 review

Paste these into Cursor **one at a time**, in this order. **A** and **B** are required before launch. **C** is optional (free hosting). **D** comes after Rutvik reviews the content.

| Prompt | What it does | When |
|---|---|---|
| **A** | Replaces Supabase with a free Google Apps Script backend (Sheet + Drive + Gmail) | Now |
| **B** | Fixes everything the review found: copy, bugs, SEO, accessibility, tracking | After A |
| **C** | Moves hosting from Vercel to Cloudflare Pages (free, and commercial use is allowed) | If you're on Vercel's free Hobby plan |
| **D** | Deepens the 6 guides and strengthens internal links | After Rutvik's content review |

---

## Prompt A: replace Supabase with Google Apps Script (₹0, never sleeps)

```
Decision: we are removing Supabase completely. The free plan pauses after 7 days of
inactivity and then every form submission fails. Replace the RFQ backend with a Google
Apps Script web app on the client's Google account: a Google Sheet as the log, a Google
Drive folder for drawings, and Gmail for notifications.

Re-read AGENTS.md and CLIENT-PROFILE.md first. This prompt overrides CURSOR-BUILD-PROMPT.md
§2 and §8 wherever they conflict. Update those sections, plus README.md and
LAUNCH-CHECKLIST.md, so nobody re-adds Supabase.

1. REMOVE
   - @supabase/supabase-js, website/supabase/, every SUPABASE_* env var, the Supabase
     code paths in src/lib/rfq/server.ts, and their tests.
   - The /api/rfq server route and the .rfq-dev dev fallback.
   - If no server routes remain, switch Astro to a fully static build (output: 'static')
     and remove the @astrojs/vercel adapter. This also removes the path-to-regexp npm
     audit advisory.
   - Keep the security headers in vercel.json, and generate an equivalent
     website/public/_headers so the site can be hosted on Cloudflare Pages later.

2. ADD website/apps-script/ (versioned in git): Code.gs, appsscript.json and a
   README-apps-script.md. doPost(e) must:
   a) Parse the JSON body (sent as text/plain to avoid a CORS preflight). If the honeypot
      field has a value, return ok:true and do nothing else.
   b) Verify Turnstile server-side by calling
      https://challenges.cloudflare.com/turnstile/v0/siteverify with TURNSTILE_SECRET from
      Script Properties. FAIL CLOSED: reject if the secret is missing or verification fails.
   c) Validate with the same rules as src/lib/rfq/schema.ts:
      - required: name, company, phone (accept mobiles AND landlines, e.g. +91 20 …),
        spring type (no silent default), quantity (positive integer, max 10,000,000),
        consent = true
      - length limits on every text field
   d) Check files:
      - max 5 files, max 10 MB total after decoding
      - allowed extensions only: pdf, dwg, dxf, step, stp, iges, igs, jpg, jpeg, png
      - set the MIME type from the EXTENSION on the server; never trust the client
      - sanitise file names
   e) Rate-limit with CacheService: at most 3 submissions per phone number per 10 minutes,
      and 30 per day in total.
   f) Generate the RFQ code RFQ-YYYYMMDD-XXXX in the Asia/Kolkata time zone.
   g) Create the Drive folder "<RFQ code>" inside DRIVE_PARENT_FOLDER_ID and save the files
      there. Folders are private to the owner's account.
   h) Append a row to the "RFQ log" tab of SHEET_ID with these columns:
      timestamp (IST), RFQ code, name, company, phone, email, city, spring type, quantity,
      target date, specs (readable text), notes, Drive folder link, landing page,
      referrer, UTM source/medium/campaign, status = "New".
   i) Email NOTIFY_EMAIL with MailApp:
      - subject: "New RFQ: {type}, {company} ({qty})"
      - body: an HTML table of all fields, with EVERY user value HTML-escaped
      - the Drive folder link and a WhatsApp click-to-chat link to the buyer
      - replyTo set to the buyer's email if one was given
   j) If the buyer gave an email, send ONE generic acknowledgement containing the RFQ code,
      "We will reply within 24 hours", phone/WhatsApp and address. Do NOT echo the name,
      notes or any other user text, because that would let spammers use the form to send
      their text to anyone. Send at most 1 acknowledgement per address per hour.
   k) Return JSON {ok:true, id} through ContentService. On any error return {ok:false}
      without stack traces and log the error with console.error. The Sheet row and Drive
      save must happen BEFORE the emails, and an email failure must not lose the row.
   - Put TURNSTILE_SECRET, NOTIFY_EMAIL, SHEET_ID and DRIVE_PARENT_FOLDER_ID in Script
     Properties, never in code.
   - In appsscript.json set timeZone "Asia/Kolkata" and the web app to execute as the
     deploying user, with access for anyone (anonymous).
   - README-apps-script.md: step-by-step setup for Rutvik's Google account
     (create the Sheet and Drive folder, paste the script, set the Script Properties,
     deploy as a web app, copy the URL into PUBLIC_RFQ_ENDPOINT, redeploy after edits),
     plus a 1-minute test plan.

3. FRONT END (src/components/rfq/RfqForm.tsx and EnquiryForm.tsx)
   - POST JSON to import.meta.env.PUBLIC_RFQ_ENDPOINT with
     Content-Type: text/plain;charset=utf-8. Read files as base64 in the browser.
   - Enforce 10 MB total BEFORE sending. If it's larger, show "Larger drawing? Send it on
     WhatsApp" with the pre-filled WhatsApp link.
   - Send the REAL honeypot value (currently it always sends '').
   - Keep the Turnstile widget (PUBLIC_TURNSTILE_SITE_KEY) and reset it after any failed
     submit.
   - Show an uploading/progress state. On success go to
     /request-a-quote/thank-you/?id=RFQ-…; on failure show the existing WhatsApp fallback.
   - If PUBLIC_RFQ_ENDPOINT or PUBLIC_TURNSTILE_SITE_KEY is missing in a production build,
     render the phone and WhatsApp fallback instead of the form. Never fail silently.
   - Capture the first-touch landing page, referrer and UTM parameters on the FIRST page
     view (sessionStorage wrapped in try/catch) and send them with the RFQ. Fix the
     `search ?? location.search` bug: the empty string passed as a prop must fall back
     too, so use `||`.

4. CSP (vercel.json and public/_headers): add https://script.google.com and
   https://script.googleusercontent.com to connect-src. Keep Turnstile, GA4 and Clarity.

5. PRIVACY POLICY: enquiries and drawings are stored in the business's own Google account
   (Sheet and Drive). Say how long they're kept, how to request deletion, and that the
   grievance contact is TODO(client).

6. TESTS AND DOCS
   - Vitest: shared validation, base64 size limit, phone formats (mobile and landline).
   - Playwright: mock PUBLIC_RFQ_ENDPOINT with page.route. Fix playwright.config so it
     reuses an existing server (reuseExistingServer) instead of failing.
   - Update .env.example (remove SUPABASE_*/RESEND_*; add PUBLIC_RFQ_ENDPOINT), README and
     LAUNCH-CHECKLIST.
   - Run npm run build, npm run check, npm test and npm run test:e2e. Report the results,
     then stop.
```

---

## Prompt B: fix the review findings

```
Fix the findings from the 4 Oct 2026 review. Re-read AGENTS.md and CLIENT-PROFILE.md
first. Work through the sections in order, then run every quality gate and report.

1. COPY: honest is good, but stop announcing what we don't have (high priority).
   Internal rule-following has leaked into public copy. Remove every sentence that talks
   about what we "do not claim", "will not invent" or "will not list", what is "not
   measured here", "stays off this site", "city-swap pages", "keyword lists", the
   website itself, or competitors' tactics.
   Rewrite each one positively and truthfully: say what we DO. Leave out anything
   unconfirmed instead of denying it.
   Known places:
   - quality.astro
   - capabilities/index.astro
   - capabilities/spring-coiling-forming.astro
   - capabilities/heat-treatment-grinding.astro
   - capabilities/reverse-engineering.astro
   - industries/automotive-springs.astro
   - industries/instrumentation-springs.astro
   - industries/electrical-switchgear-springs.astro
   - resources/index.astro
   - resources/spring-price-guide-india.astro, including its meta description
     ("No invented rupee figures")
   - locations/talawade-pcmc.astro ("no city-swap page pretending…")
   - the "What we do not claim / Do not expect a load-test report, PPAP pack or CPK…"
     note on every product page and on wire-forms
   - "not measured here" in the glossary and calculators (say "typical published value")
   Certification wording:
   - Homepage FAQ: replace "Are you ISO or IATF certified? No." with
     "Which certification do you hold?" answered "ZED certified (MSME)".
   - Mention ISO/IATF only on /quality/, neutrally: "We hold ZED certification. We are not
     currently ISO 9001 / IATF 16949 certified."
   After this, grep the built HTML for: "do not claim", "will not", "not measured",
   "pretend", "invent", "keyword", "this site". Zero hits should remain outside legal pages.

2. TONE: replace "shop", "this shop" and "a small spring shop" (37 places) with "we",
   "our factory" or "our unit". Procurement buyers read "shop" as a retail store.

3. MISSING SPACES after inline tags. These render as "directionsand", "helixwith",
   "diameterand", "springfor", "springwith", "springand", "estimatefrom" on
   double-torsion, extension, compression, conical, /springs/ and /tools/.
   Find the root cause (whitespace collapsed around <strong>/<a> at line breaks), fix it
   everywhere, and add an audit-html check that fails on </strong>, </a> or </em> followed
   directly by a letter.

4. KEYWORD-BEARING H1s on hub pages (keep a friendly subline under each):
   - /capabilities/ → "Spring manufacturing capabilities"
   - /industries/ → "Springs for your industry"
   - /contact/ → "Contact RK Springs & Wireforms"
   - /quality/ → "Quality and certification"
   - /resources/ → "Spring design guides"

5. TRACKING: add one delegated click listener that sends every [data-event] (whatsapp_click,
   call_click, email_click, outbound_click) to track(). There are currently 22 dead
   attributes, so the main conversions aren't tracked.

6. SEO FIXES
   a) Fail production builds when PUBLIC_SITE_URL is missing (it currently falls back to
      localhost). Make audit-html check that canonical === SITE + page path.
   b) robots.txt: separate AI-bot groups replace the * group, so put every Disallow rule
      in ONE group that applies to all bots. Remove Disallow for pages that are already
      noindex (thank-you, styleguide), otherwise crawlers can't see the noindex.
   c) /styleguide/ and draft pages (spiral) must return a real 404 in production builds,
      not 200 + noindex.
   d) Sitemap lastmod must come from each page's real updated date, not a hard-coded value.
   e) JSON-LD (jsonld.ts):
      - replace the Product node with Service (no public price means Product shows as
        invalid in Search Console)
      - add WebApplication to the tool pages
      - give TechArticle headline, author (Organization for now), publisher,
        datePublished and dateModified
      - set addressLocality to "Pune" (keep Talawade in streetAddress)
      - remove availableLanguage "hi" (unconfirmed)
      - point logo to a square logo (TODO(client): real logo), not the OG banner
   f) Internal links:
      - on product pages, add "How we make it" links to the matching capability pages and
        "Used in" links to the industry pages
      - add Industries and Capabilities columns to the footer
      - link each guide from its related product page
      - every indexable page must have at least 3 contextual inlinks

7. PERFORMANCE AND ACCESSIBILITY
   a) Preload IBM Plex Sans 400 and IBM Plex Mono 400 with <link rel="preload">. Don't
      load fonts with JS after the load event. Fix the home-page CLS (0.059, caused by
      the hero trust bar) to below 0.05: use fallback font metrics and reserve the
      trust-bar height.
   b) Mobile nav: set `inert` on main and footer while the menu is open. Today focus lands
      on hidden links (WCAG 2.2 SC 2.4.11).
   c) RFQ file input: tabIndex -1, with a visible focus ring on the visible button.
      "Remove" buttons say "Remove <file name>" and are at least 44 px tall.
   d) Calculators:
      - use an h2 for the results heading (it currently jumps h1 → h3)
      - add aria-invalid and aria-describedby on fields with errors
      - warn when free length ≤ solid height
      - warn when a working length is greater than the free length (negative load)
      - when both OD and ID are entered, show which one is used
   e) CSP: allow https://*.clarity.ms (not only www.clarity.ms) and follow Google's GA4
      CSP list for regional endpoints.

8. HOUSEKEEPING
   - remove dead code (lib/paths.ts, isRfqCode) and the duplicated RFQ regex
     (thank-you.astro)
   - move the thank-you <script> inside <body>
   - make site.ts the single source for the address (faqs.ts, talawade-pcmc.astro,
     llms.txt), and show the full "Pune, Maharashtra 411062, India" in the footer
   - make list-todos.ts catch multi-line <Todo> tags
   - set engines to Node >= 22.18 or run the scripts with tsx
   - correct the README

Run npm run build, npm run check, npm test, npm run test:e2e, npm run js-budget and
npm run lh. Report the numbers and the before/after grep counts from section 1, then stop.
```

---

## Prompt C (optional): move hosting to Cloudflare Pages (free; commercial use allowed)

> Vercel's free Hobby plan is for non-commercial use only, and a client's business site counts as commercial. Either upgrade to Vercel Pro, or run this prompt. Do it after Prompt A, once the site is fully static.

```
Move hosting from Vercel to Cloudflare Pages (free plan, commercial use allowed). The
site is fully static after Prompt A.

- Astro output: 'static', no server adapter. Build command `npm run build`, root
  directory `website`, output directory `website/dist`. Pin the Node version.
- website/public/_headers: same security headers and CSP as vercel.json (including
  Turnstile, Apps Script, GA4 and Clarity). Long cache for /_astro/*. Add
  X-Robots-Tag: noindex for any non-production deployment.
- website/public/_redirects: the canonical host redirect (apex → www, or the reverse,
  matching PUBLIC_SITE_URL) and the trailing-slash rules we use.
- Replace VERCEL_ENV checks with a generic PUBLIC_DEPLOY_ENV (production | preview).
  Preview builds stay noindex; production requires PUBLIC_SITE_URL.
- Update README and LAUNCH-CHECKLIST with exact Cloudflare Pages steps: connect the repo,
  set env vars PUBLIC_SITE_URL / PUBLIC_RFQ_ENDPOINT / PUBLIC_TURNSTILE_SITE_KEY /
  PUBLIC_GA4_ID (optional) / PUBLIC_DEPLOY_ENV=production, add the custom domain, set DNS.
- Keep vercel.json until the switch is confirmed. Run all gates and report.
```

---

## Prompt D (after Rutvik's review): deepen the guides and internal links

```
The 6 guides under /resources/ are 400–500 words. Expand each to 1,200–2,000 words of
genuinely useful, India-specific, metric content:
- worked examples, tables and SVG diagrams in our blueprint style
- the real "People also ask" questions from RESEARCH-AND-SEO-BLUEPRINT.md §2.4 and §9.1
- an FAQ block

Facts must stay within CLIENT-PROFILE.md; client-specific data stays TODO(client).
Each guide links to 1 primary product page, 2 related guides and glossary terms. Add a
"Reviewed by" placeholder. Keep the JS budget at 0 KB.
Then run audit-html and lh, report, and stop.
```
