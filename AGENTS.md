# AGENTS.md: rules for any AI agent working in this repo

**Project:** an SEO-first B2B website for **RK Springs & Wireforms** (legal name RK Enterprises), a spring and wire-form manufacturer in Talawade, Pune, India.
**The app lives in `/website`.** Don't move, rename or edit the planning docs in the repo root unless asked.

## Read these first, in this order of authority
1. `CLIENT-PROFILE.md`: confirmed facts. **It overrides everything else.**
2. `CURSOR-BUILD-PROMPT.md`: the build spec and phase plan.
3. `RESEARCH-AND-SEO-BLUEPRINT.md`: research and SEO strategy. Some facts in it are outdated (see CLIENT-PROFILE §7).

## Non-negotiable rules

1. **Never invent facts.**
   - Don't make up certifications, numbers, machine names, customer names or logos, testimonials, reviews, ratings, awards, or years in business.
   - If something isn't in `CLIENT-PROFILE.md`, write `TODO(client): …` in the content and render it with the `<Todo>` component, which is hidden in production builds.
   - Never output `aggregateRating` or review schema unless there are real reviews visible on the page.

2. **Don't overclaim.**
   - Never claim load testing, PPAP, CPK, an ISO or IATF certificate, a testing lab, "low MOQ", export, or "best / leading / No. 1".
   - MOQ is 5,000–10,000 pcs, and smaller runs carry development charges.
   - "Quote within 24 hours" **is** approved.

3. **SEO basics on every page.**
   - Pages are statically generated HTML.
   - Exactly one `<h1>`.
   - Unique `<title>` (60 characters or fewer) and meta description (155 or fewer).
   - Self-referencing absolute canonical URL.
   - Breadcrumbs plus `BreadcrumbList` JSON-LD.
   - JSON-LD is generated from data files, never hand-pasted.
   - No doorway or duplicate city pages, and no keyword stuffing.
   - `lang="en-IN"`.

4. **Performance budget.**
   - Content pages ship **under 100 KB of JS** (0 KB by default).
   - LCP under 1.8 s and CLS under 0.05 on mobile.
   - Images are AVIF or WebP with width and height set.
   - Fonts are self-hosted with `font-display: swap`.
   - No sliders, carousels, autoplay video, jQuery or heavy animation libraries.
   - YouTube uses a lite facade; maps use a static image with a link.

5. **Accessibility: WCAG 2.2 AA.**
   - Semantic HTML.
   - Visible focus states.
   - Every input has a label.
   - Contrast of at least 4.5:1 for text and 3:1 for UI elements.
   - Never rely on colour alone.
   - Respect `prefers-reduced-motion`.
   - Tap targets of at least 44 px.

6. **Design tokens only.**
   - Use only the blue-and-white tokens in `CURSOR-BUILD-PROMPT.md` §4.
   - **No hard-coded hex values in components.** The palette may change after the client's logo arrives.

7. **Copy style.**
   - Plain, specific Indian-English B2B writing.
   - Metric units first (mm, N, N/mm), and ₹ for prices.
   - Short sentences.
   - No filler: "world-class", "cutting-edge", "one-stop solution", "leading manufacturer", "best quality".

8. **Photos.**
   - No stock photos and no AI-generated factory or product photos.
   - Use `<PhotoPlaceholder>` (aspect ratio + caption + TODO) until the real factory shoot.
   - SVG technical line drawings are encouraged.

9. **Dependencies.**
   - Keep them minimal. Ask before adding any library that isn't in the build spec.
   - Prefer platform features: `<details>` for accordions, CSS for effects.

10. **Security.**
    - Secrets live only in server-side env vars, never in client code or git.
    - Keep `.env.example` up to date.
    - Validate everything server-side: Zod, file type and size checks.

11. **Workflow.**
    - Work one phase at a time, as listed in `CURSOR-BUILD-PROMPT.md` §13.
    - At the end of each phase:
      - run `npm run build` and `npm run check`, and fix any errors
      - update `CONTENT-REVIEW.md`
      - summarise what changed
      - **stop and wait for review**
