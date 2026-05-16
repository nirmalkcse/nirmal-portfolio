# QA Checklist

Last updated: 2026-05-16

Session 21 accessibility planning target: WCAG 2.2 AA-oriented manual QA for the implemented Next.js route surface. W3C reference: https://www.w3.org/TR/WCAG22/

## Implemented Route Scope

| Route | Implementation | Current state | Accessibility scope |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Implemented | Header/footer, cinematic hero, role gateway, homepage link cards, evidence previews, future/resume/document links, and profile dock |
| `/proof` | `src/app/proof/page.tsx`, `src/components/proof-graph/proof-graph.tsx` | Implemented | Role filters, evidence cluster buttons, graph node buttons, mobile evidence chain, selected-node detail panel, external/internal proof links |
| `/projects` | `src/app/projects/page.tsx`, `src/components/project-case-file/project-case-files-index.tsx` | Implemented | Project ordering lens, project cards, case-file links, observed-project section |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx`, `src/components/project-case-file/project-case-file-detail.tsx` | Implemented for static project slugs | Back link, proof/media sections, external proof links, adjacent project navigation, all generated case-file pages |
| `/timeline` | `src/app/timeline/page.tsx`, `src/components/timeline/career-timeline.tsx` | Implemented | Role lens, desktop timeline marker buttons, focusable scroll cards, mobile fallback buttons, detail panel, proof links, reduced-motion scroll behavior |
| `/certifications` | `src/app/certifications/page.tsx`, `src/components/certification-console/certification-console.tsx` | Implemented | Group/provider filter buttons, select controls, credential cards, verify links, detail shell, empty state |
| `/future-projects` | `src/app/future-projects/page.tsx`, `src/components/future-projects/future-projects-observatory.tsx` | Implemented | Exploration track buttons, selected-detail panel, source chips, roadmap stages, grounding-proof links |
| `/resume` | `src/app/resume/page.tsx`, `src/components/resume-lens/resume-lens.tsx` | Implemented | Role recommendation buttons, DOCX downloads, resume preview region, contact route, proof-map links |
| `/documents` | `src/app/documents/page.tsx`, `src/components/documents/documents-hub.tsx` | Implemented | Document lens buttons, packet actions, DOCX downloads, same-page pending-export anchors, recommendation panel |
| `/profile` | `src/app/profile/page.tsx`, `src/components/profile/professional-profile.tsx` | Implemented | Profile hero, canonical profile card, role lens, proof links, social links, resume download, and contact boundaries |

Project slugs to include in the `/projects/[slug]` pass:

- `icore-enterprise-mdm-entity-resolution`
- `telecom-fabric-migration-poc`
- `bi-migration-validation-analytics`
- `ieee-semiconductor-chip-analysis-medallion`
- `fabcon25-talk-to-your-data-demo`
- `insurance-analytics-copilot-data-agent-poc`
- `vitac-skincare-market-analysis`
- `align`

## Session 21 Accessibility Execution Result

- [x] Baseline `npm run typecheck`, `npm run lint`, and `npm run build` passed
  before accessibility fixes.
- [x] Findings were captured in Session 21 issue format before UI edits.
- [x] No `P0 blocker` findings were found.
- [x] `P1 must fix before launch` dynamic detail-panel findings were fixed on
  the role gateway, proof graph, timeline, certifications, future projects,
  resume, and documents.
- [x] `P1 must fix before launch` timeline keyboard findings were fixed by
  adding meaningful names, selected state, and `Enter`/`Space` operation to
  desktop scroll cards and richer names to compact markers.
- [x] `P1 must fix before launch` generic external-link and download-name
  findings were fixed for proof links, credential verification links, project
  proof links, resume DOCX actions, document DOCX actions, and pending export
  anchors.
- [x] `P1 must fix before launch` hidden command palette focus findings were
  fixed with focus containment, `Escape` close, autofocus, and return focus.
- [x] `P1 must fix before launch` contrast findings were fixed by adjusting
  `--color-steel` and `--color-old-gold`.
- [x] Final `npm run typecheck`, `npm run lint`, and `npm run build` passed
  after fixes.
- [x] Browser smoke confirmed one `main` landmark and one route-level `h1` on
  all main implemented routes, `/profile`, and all eight project detail pages.
- [x] Keyboard smoke passed for representative controls on `/`, `/proof`,
  `/projects`, `/timeline`, `/certifications`, `/future-projects`, `/resume`,
  and `/documents`.
- [x] Full 200% zoom, mobile breakpoint, and responsive overlap checks were
  completed in Session 22.
- [x] Lighthouse-style performance checks were completed in Session 23.

## Session 22 Responsive Execution Result

- [x] Responsive QA covered `/`, `/profile`, `/proof`, `/projects`,
  `/projects/icore-enterprise-mdm-entity-resolution`, `/timeline`,
  `/certifications`, `/future-projects`, `/resume`, and `/documents`.
- [x] Desktop, laptop, tablet, mobile, and 200% zoom proxy screenshots were
  inspected for text overflow, overlap, cramped cards, sticky panel behavior,
  mobile nav visibility, mobile dock behavior, and responsive motion issues.
- [x] Shared header wrapping was fixed by moving the full desktop header to
  `xl` and keeping smaller widths on a stable horizontal nav rail.
- [x] Mobile nav active-route visibility was fixed by scrolling the active nav
  item into view on route changes with reduced-motion awareness.
- [x] Homepage social dock behavior was fixed for tablet/mobile and very short
  200% zoom-like viewports.
- [x] Proof graph and timeline dense desktop layouts now start at `xl`, with
  stacked tablet/mobile fallbacks below that breakpoint.
- [x] Sticky side panels now use a shared header offset and viewport max height
  on desktop, while stacked tablet/mobile layouts avoid sticky crowding.
- [x] Final `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- [x] Final browser smoke passed on desktop home, desktop project detail,
  mobile documents, and 200% zoom proxy home.

## Session 23 Performance Execution Result

- [x] Baseline and final `npm run typecheck`, `npm run lint`, and
  `npm run build` passed.
- [x] Production build stayed fully static across 19 generated pages.
- [x] Route client bundle sizes were reviewed from
  `.next/server/app/**/page_client-reference-manifest.js`; final route JS ranges
  from 120.6 KB on `/certifications` to 157.2 KB on `/documents`.
- [x] Shared route CSS dropped from 79.2 KB to 70.6 KB after moving the hidden
  overlay CSS out of the initial route path.
- [x] Local SVG brand marks no longer ship the `next/image` client component.
- [x] Shared header/footer links no longer prefetch every route from the first
  viewport.
- [x] Hidden delight command UI is lazy-loaded; its async JS/CSS chunk is absent
  from initial route HTML.
- [x] `react-icons` was removed from the app dependency graph.
- [x] Public assets were reviewed; loaded brand SVGs are under 1 KB each, resume
  DOCX assets remain intentionally public, and no large media/WebGL payload ships
  in v1.
- [x] Headless Edge route smoke passed for `/`, `/proof`, `/projects`,
  `/timeline`, `/certifications`, `/future-projects`, `/resume`, `/documents`,
  and `/profile`.

## Visual QA

- [x] Text fits containers on desktop and mobile after Session 22 responsive fixes.
- [x] No incoherent overlap between UI elements was found in Session 22 route smoke.
- [x] Palette does not become one-note in the tested responsive route set.
- [ ] Logo works at 16px, 32px, and 96px.
- [x] Gold Thread is visible but not distracting in tested hero and route views.
- [x] Hero leaves a hint of next content visible on desktop and mobile.

## Motion QA

- [x] Animations mostly use transform and opacity.
- [x] Reduced-motion mode works globally through `src/styles/motion.css`.
- [x] Cinematic hero reduced-motion styles work through `cinematic-hero.module.css`.
- [x] Timeline scroll behavior respects `prefers-reduced-motion`.
- [x] No looping/ambient motion runs beyond five seconds without control.
- [x] Scroll scenes have no obvious heavy runtime payload in the Session 23 code
  and build review.
- [x] Mobile avoids heavy scroll theatrics in the tested responsive route set.
- [x] Transitions do not block navigation in Session 22 browser smoke.

## Accessibility QA

### Global Checks

- [ ] Every route has one primary `main` landmark after the shared header.
- [ ] Header and footer navigation have clear labels and preserve `aria-current` on active routes.
- [ ] Heading order is logical: one route-level `h1`, then meaningful `h2`/`h3` sections.
- [ ] Keyboard order follows visual order from header, page content, sticky/detail panels, footer, and dock when present.
- [ ] All interactive controls are reachable by keyboard where they should be, and non-interactive placeholders are not accidentally tabbable.
- [ ] `Tab`, `Shift+Tab`, `Enter`, and `Space` operate buttons, links, filters, cards, timeline markers, graph nodes, and downloads predictably.
- [ ] Focus is visible on every interactive element using the global `:focus-visible` ring or an equivalent component-level style.
- [ ] Focus state is visually distinct from hover, selected, active, and disabled states.
- [ ] Selected-state controls expose state with `aria-pressed`, `aria-current`, or equivalent semantics.
- [ ] Dynamic detail swaps do not steal focus or leave focus on hidden/removed content.
- [ ] Sticky detail panels do not cover focused controls during keyboard navigation.
- [ ] Icon-only or icon-led controls have accessible names; decorative icons use `aria-hidden="true"`.
- [ ] External links that open new tabs include clear accessible names or visible context.
- [ ] Download links expose the document purpose and file type through visible text or surrounding context.
- [ ] Color contrast passes for body text, captions, badges, focus rings, disabled states, selected states, links, and buttons.
- [ ] Information is not conveyed by color alone, especially proof strength, credential state, selected lenses, and pending/verified status.
- [ ] Reduced-motion mode removes reveal/scroll movement while preserving content, selected states, and route usability.
- [x] Browser zoom at 200% keeps controls usable and text readable after Session 22 responsive fixes.

### Shared Chrome

- [ ] Site header home link has an accessible name and does not repeat noisy image text.
- [x] Primary nav links work by keyboard, expose current route, and wrap or scroll without trapping focus.
- [ ] Header resume CTA is reachable and named.
- [ ] Footer route index is reachable after page content and does not duplicate current-route state confusingly.
- [ ] Footer utility/profile route remains discoverable even though `/profile` is a placeholder.
- [ ] Homepage profile dock links expose names, statuses, tooltips on focus, and new-tab behavior.
- [ ] Homepage profile dock future slots are announced as unavailable/reserved without becoming misleading interactive targets.

### Route Checks

| Surface | Keyboard and focus checks | Semantics and labels | Contrast and motion checks |
|---|---|---|---|
| `/` | Hero CTAs, role cue, RoleGateway role cards, keep-balanced button, switcher buttons, evidence links, homepage card links, social dock links | `aria-live` regions in RoleGateway, hero/proof signal labels, link names, dock tooltip descriptions | Hero text over visual field, gold thread, dock focus tooltip, reduced cinematic motion |
| `/proof` | Role filter buttons, cluster buttons, graph node buttons, mobile node buttons, selected proof links | Graph canvas SVG remains decorative, node buttons include label/kind, detail panel updates are understandable | Node badge contrast, edge/selection contrast, desktop graph and mobile fallback both usable with reduced motion |
| `/projects` | Ordering lens buttons, project card links, observed-project links | Lens group state, card headings, proof stat/public-safety text order | Case-file rail focus/hover contrast, card text density, selected lens contrast |
| `/projects/[slug]` | Back link, external proof CTAs, adjacent previous/next links across all generated slugs | Article structure, proof/media sections, external link context, pending media labels | Hero/case-file contrast, public-safety note contrast, focus ring inside dense panels |
| `/timeline` | Role lens buttons, desktop timeline marker buttons, focusable scroll cards, mobile timeline item buttons, detail links | Timeline items expose meaningful names beyond compact visual labels, detail panel reflects selected item, proof links have context | Board marker contrast, sticky detail focus behavior, smooth scroll disabled in reduced motion |
| `/certifications` | Provider group buttons, provider chips, two selects, credential card buttons, verify links, detail proof links | Filter labels, `aria-pressed` state, selected credential detail, pending proof control semantics | Status badge contrast for verified/expired/supported/pending states, empty-state readability |
| `/future-projects` | Track cards, source chips, grounding proof link | Selected exploration state, public-safety/detail sections, source chips with and without links | Exploration badge contrast, proof checklist readability, sticky detail focus behavior |
| `/resume` | Role buttons, recommended download, asset downloads, open-file links, contact route, proof-map links | Download names, preview region label, recommendation panel relationship to active role | Ivory resume preview contrast, download button contrast, focus ring on document actions |
| `/documents` | Document lens buttons, packet actions, resume downloads, same-page anchors, export placeholder links | Packet status labels, pending export anchors, recommendation panel, real downloads versus future files | Packet status contrast, fragment navigation focus/scroll behavior, pending/export label contrast |
| `/profile` | Resume download, proof link, role lens buttons, profile proof route cards, social links, document hub link | Profile `h1`, canonical profile card, role-lens panel, proof/social/contact sections, external-link context | Profile hero/card contrast, social link cards, mobile text wrapping, role-lens button contrast |

## Performance QA

- [x] Production build succeeds.
- [x] Images are optimized.
- [x] Bundle size is watched.
- [x] No unnecessary WebGL/3D payload in v1.
- [x] Scroll animations do not cause obvious jank.
- [x] Lighthouse/performance checks are run before launch.

## Content QA

- [ ] Resume downloads work.
- [ ] Profile links open correctly.
- [ ] Credential verification links open correctly.
- [ ] Project claims connect to evidence.
- [ ] Future projects are labeled as currently exploring.
- [ ] Placeholder or pending exports are clearly labeled and do not look like missing files.

## Launch Metadata QA

- [ ] Homepage title, description, and social preview copy match the Session 24 launch metadata plan.
- [ ] Every shipped route has a final title and description.
- [ ] Dynamic project pages use project-specific titles and public-safe summaries.
- [ ] Public metadata avoids overusing internal planning language such as "Cinematic Engineering Dossier."
- [ ] Canonical URLs use the final production domain, not a deployment preview URL.
- [ ] Favicon renders in browser tabs, bookmarks, and light/dark browser UI contexts.
- [ ] OG image renders at `1200x630` and remains legible in small social preview sizes.
- [ ] OG image alt text describes the preview without keyword stuffing.
- [ ] LinkedIn/Twitter-style previews show the intended title, description, image, and URL.
- [ ] Metadata does not imply completed proof for future projects or unverified credentials.
- [ ] Resume, document, and proof asset previews do not expose private or internal file details.

## Professionalism QA

- [ ] Recruiter can find resume/contact quickly.
- [ ] Engineer can find technical depth.
- [ ] Leader can find impact and ownership signals.
- [ ] Easter eggs do not weaken credibility.

## Issue Capture Format

Use this format during Session 21 execution before editing UI code:

- Route:
- Viewport/input mode:
- Finding:
- Severity: `P0 blocker`, `P1 must fix before launch`, `P2 polish`, or `P3 follow-up`
- Evidence:
- Expected behavior:
- Proposed fix owner/component:
