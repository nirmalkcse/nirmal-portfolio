# Awwwards-grade audit — 2026-10-16

Full visual pass over all 14 routes at 1440×900, 1100×800 and 390×844
(headless Chromium, scroll-stepped), plus a code read of the shared shell
(layout, tokens, nav, footer, hero, transitions). The brief was to raise the
craft ceiling without removing anything that already exists.

## What already worked

- A coherent warm-ivory / lacquer palette and a single editorial title voice.
- Signature moments: the splash reveal with its sound bloom, the sticky
  "monitor" project showcase, the five-element `/journey` WebGL world, the
  profile folio, the ⌘K command layer and its achievement stamps.
- Reduced-motion branches in most scroll stories.

## Defects found and fixed

| # | Where | Problem | Cause → fix |
|---|-------|---------|-------------|
| 1 | `/profile` (and any `useScroll({ target })` fade) | The "A quiet measure of the work." chapter faded out, then faded back in over "Choose the channel…" and "Start with the work." | Framer Motion 12.38 hands scroll-linked opacity/transform/clip-path to the browser's native ViewTimeline, whose ranges don't match the JS offsets these stories were tuned on. → `src/lib/motion/scroll-timeline-guard.ts` keeps every scroll animation on Framer's JS path (imported once from `SmoothScroll`). |
| 2 | `/404`, `/future-projects`, case-study detail, `/portfolio` | Headlines and key values near-invisible (ivory on ivory). | Dark-theme leftovers (`editorial-title--ivory`, `text-[var(--color-ivory)]`) on light surfaces. → ink tokens; local token remaps where whole panels were written for dark. |
| 3 | Every page | Display faces never loaded (Windows/Android/Chrome fell back to Georgia, Segoe UI and Arial), and the hero set its name in a didone at +0.08em tracking with per-letter gradient fringing. | Moved to Apple's system after review: SF Pro on Apple devices, Inter (with its optical-size axis) elsewhere, via `src/app/fonts.ts` and `tokens.css`. Headlines are semibold and tracked in; emphasis words stay upright in bronze or warm grey (two-tone) instead of italic serif. Geist Mono is kept for data labels and code. |
| 4 | Every page, bottom-left | The ⌘K switch rendered as an unlabeled grey chip. | Its mark sat at `opacity: 0` until hover. → a visible ⌘K / Ctrl K keycap pair (steps aside on `/timeline`, where the year counter lives). |
| 5 | Home hero | "Contact" was a placeholder `mailto:`; the Blueprint rows showed arrows but weren't links; "90% variance / 3 deployments" misdescribed the metrics; title-case mono CTA. | → `/profile`; rows link to the three flagship case studies; "fewer discrepancies / source systems"; CTA in caps like the splash CTA. |
| 6 | Home hero ≤1279px | Name and CTA ran to the screen edge on tablets and phones. | No horizontal padding below the page max-width. → gutter padding. |
| 7 | Home "Selected work" | Project chapters had no way into the case study. | → an indexed "Read the case study" link per chapter. |
| 8 | Case-study detail | Semi-transparent espresso cards over ivory read as muddy taupe. | → solid lacquer panels; back link redrawn as a light pill. |
| 9 | Site metadata | `metadataBase` unset, description read "Portfolio foundation for…", no theme colour. | → uses `siteConfig` from `src/lib/seo.ts`; viewport theme colour. **Set `NEXT_PUBLIC_SITE_URL` in the deploy environment** so OG/Twitter URLs resolve to the real domain. |

## What was added

- **Route arrival title card** (`src/components/signature/route-curtain.tsx`):
  on client navigation a lacquer sheet set like a chapter opener (the
  destination's name in semibold display type, a hairline, one written line
  about the page) is in place on the first painted frame, then lifts away
  *under* the header. Skipped on first load, on the way back to home, and
  under reduced motion.
- **Kinetic discipline ribbon** on the home page (`discipline-marquee.tsx`):
  two-tone semibold phrases with bronze interpuncts, drifting left, sped up
  and reversed by scroll velocity, paused off-screen, static under reduced
  motion.
- **Hero scroll cue**: a brass bead travelling down a hairline, fading as
  soon as scrolling starts (wide screens only).
- **404 numeral**: an outlined 404 set very large behind the recovery console.
- **Tab presence**: the tab title notices when the visitor leaves and greets
  them back; a signed note in the devtools console.
- Brass hairline scrollbar.

## Second pass: story and continuity

Built after a discovery round with Nirmal (answers recorded in memory):

- **Databricks Brickbuilder recognition** (`src/data/recognition.ts`,
  `src/components/signature/recognition-seal.tsx`). iCORE, designed and built
  end to end, is the solution behind a Databricks Brickbuilder accreditation.
  Databricks is named; the company holding the accreditation is not. Shown as
  a one-line seal on the Work flagship, the iCORE case study and the Timeline
  moment, and as a "Product recognition" panel on Credentials, kept apart
  from personal certifications.
- **Highlights rail** (`highlights-rail.tsx`) on Home, after the disciplines
  ribbon and before Credentials: four proof cards (Brickbuilder, 90% fewer
  discrepancies, 15+ reports validated, 8 credentials), swipe on touch, drag
  or arrows with a mouse, snap points, every figure traced to `src/data`.
  First tried directly under the hero; moved at the owner's request, and the
  hero and Selected work were restored to their previous state.
- **Seamless return visits**: once a visitor enters, a reload in the same tab
  opens straight onto the revealed home; a head script hides the gate before
  first paint so it never flashes. One shared press feel (`scale`) on buttons
  and button-like links, and in-page anchors on Lenis' own curve.

## Third pass: logos and case studies

- **Official logos** (`src/components/brand/brand-logos.tsx`). The
  Credentials page drew Oracle with a hand-traced path that rendered as
  "OPACI" and Databricks with an approximate stack; the home credential cards
  showed the Microsoft squares for every non-Databricks issuer. All issuer
  marks now come from one module: Databricks, GitHub (Simple Icons) and
  Oracle (Grommet) vectors via react-icons, and Microsoft and Google in their
  published geometry and colours. Credential cards pair each mark with the
  issuer's name. The home project monitor uses the same Databricks mark.
- **Case studies, rebuilt** (`src/components/case-study/`). The dark "case
  file console" template is replaced by the Work page's language: a two-tone
  hero with the project's hairline drawing, an at-a-glance facts row, and six
  numbered chapters (brief, how it works, decisions, proof, tradeoffs,
  related) with a sticky "On this page" index and a next-case card. Every
  section and fact from the old template is still there. Each of the eight
  projects has its own theme in `case-themes.ts`: an accent from its own
  world (Databricks ember, Fabric teal, Power BI amber, IEEE blue, and so on)
  that tints the kicker, numerals, rules and drawing, plus its own two-tone
  headline. Related credentials now show certificate titles, not slugs.
  `project-case-file-detail.tsx` is no longer rendered.

## Removed after review

- **Custom cursors, everywhere.** A contextual cursor ring was tried in this
  pass and taken out at the owner's request: the site uses the native cursor
  only. The unused `custom-cursor.tsx` was deleted with it.

## Deliberately left alone

- **The footer.** Its stylesheet records an earlier decision to keep it plain:
  no status dot, live clock or ghosted wordmark, because they read as
  template furniture. That decision stands.
- The dark Resume and Documents consoles (intentional working surfaces).
- The splash gate and sound design.
- The `/timeline` chapter headline passing over the fixed year counter while
  scrolling: a brief pass-through by design, not a resting overlap.
- Pre-existing lint errors (8, all in files untouched beyond a font string).
