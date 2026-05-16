# Session 21: Accessibility Pass

Status: Complete

## Goal

Plan the accessibility pass for the actual implemented portfolio routes before
making any UI code changes.

## Inputs Reviewed

- [QA Checklist](../validation/qa-checklist.md)
- [Progress Tracker](../tracking/progress-tracker.md)
- [Session 20 Motion Polish](session-20-motion-polish.md)
- [Session 22 Responsive QA](session-22-responsive-qa.md)
- `src/app/**/page.tsx`
- `src/lib/constants/routes.ts`
- Shared route components under `src/components/**`
- Focus, token, and reduced-motion styles under `src/styles/`

## Planning Deliverables

- Route inventory aligned to implemented routes, not only planned routes
- Route-specific accessibility checklist in `docs/validation/qa-checklist.md`
- Execution order for keyboard, focus, contrast, labels, reduced motion, and
  dynamic-state QA
- Known risk list for the first implementation pass

## Actual Route Inventory

| Route | Status | Notes |
|---|---|---|
| `/` | Implemented | Homepage with cinematic hero, role gateway, portfolio maps, evidence previews, social dock |
| `/proof` | Implemented | Role-aware proof graph with desktop graph nodes and mobile evidence chain |
| `/projects` | Implemented | Project case-file index with role/order lens |
| `/projects/[slug]` | Implemented | Static project detail pages generated from the project data layer |
| `/timeline` | Implemented | Desktop timeline board, scroll cards, mobile fallback, role lens |
| `/certifications` | Implemented | Credential console with filters, selects, selected detail shell, verification links |
| `/future-projects` | Implemented | Exploration cards, source basis links, selected detail shell |
| `/resume` | Implemented | Role-aware resume recommendations, DOCX downloads, preview surface |
| `/documents` | Implemented | Role-aware packet recommendations, downloads, future export placeholders |
| `/profile` | Placeholder | Route exists as a professional profile placeholder |

Project detail slugs to include in the pass:

- `icore-enterprise-mdm-entity-resolution`
- `telecom-fabric-migration-poc`
- `bi-migration-validation-analytics`
- `ieee-semiconductor-chip-analysis-medallion`
- `fabcon25-talk-to-your-data-demo`
- `insurance-analytics-copilot-data-agent-poc`
- `vitac-skincare-market-analysis`
- `align`

## Non-Goals

- No UI code changes during planning.
- No responsive layout fixes; Session 22 owns full breakpoint repair.
- No performance optimization; Session 23 owns performance pass.
- No credential, resume, or proof artifact content changes.

## Execution Plan

1. Run baseline validation: `npm run typecheck`, `npm run lint`, and `npm run build`.
2. Start the local app and visit every implemented route in the inventory.
3. Perform keyboard-only navigation with `Tab`, `Shift+Tab`, `Enter`, and `Space`.
4. Verify focus visibility, focus order, selected state, and no focus loss after
   dynamic detail swaps.
5. Verify accessible names and states for buttons, links, downloads, filters,
   graph nodes, timeline items, and dock links.
6. Check contrast for default text, muted text, badges, selected states,
   disabled states, and focus rings.
7. Emulate `prefers-reduced-motion: reduce` and repeat interaction checks for
   hero, role gateway, proof graph, timeline, cards, detail panels, and anchors.
8. Capture findings in the QA checklist issue format before any UI edits.

## Route QA Order

1. Shared chrome: header, footer, active nav state, `/profile` placeholder.
2. Homepage: hero, role gateway, homepage cards, social dock.
3. Dense interaction surfaces: `/proof`, `/timeline`, `/certifications`.
4. Case-file surfaces: `/projects` and every `/projects/[slug]` static page.
5. Document surfaces: `/resume` and `/documents`.
6. Future-facing surface: `/future-projects`.

## Known Risk Areas

- Global CSS removes default `:focus`; every interactive element must get a
  visible `:focus-visible` treatment through the shared ring or component CSS.
- Proof graph and timeline use visual layouts that must still expose meaningful
  keyboard order and selected-detail state.
- Timeline scroll selection must respect reduced motion and avoid disorienting
  jumps.
- Sticky detail panels on proof, timeline, certifications, future projects,
  resume, and documents need focus/scroll checks.
- Role-lens controls repeat across routes; verify `aria-pressed` state and
  focus behavior consistently.
- Social dock tooltips and reserved future slots need keyboard and screen-reader
  sanity checks.
- External proof links, new-tab links, and DOCX downloads must be named clearly.
- Badge/status color systems need contrast checks and non-color text labels.

## Tasks

- [x] Inventory implemented routes
- [x] Expand the central QA checklist for actual routes
- [x] Define route-by-route accessibility scope
- [x] Define issue capture format
- [x] Run baseline validation commands
- [x] Record findings before UI fixes
- [x] Run keyboard pass
- [x] Test focus states
- [x] Check contrast
- [x] Check ARIA labels and states
- [x] Verify reduced-motion behavior

## Baseline Validation

- `npm run typecheck`: passed before UI edits.
- `npm run lint`: passed before UI edits.
- `npm run build`: passed before UI edits.
- Existing local dev server found at `http://127.0.0.1:3000`.
- Browser smoke confirmed one `main` landmark and one route-level `h1` on
  `/`, `/proof`, `/projects`, `/timeline`, `/certifications`,
  `/future-projects`, `/resume`, and `/documents`.
- Browser smoke confirmed one `main` landmark and one route-level `h1` on all
  eight generated `/projects/[slug]` pages listed in this session.

## Findings Captured Before UI Fixes

- Route: `/proof`, `/timeline`, `/certifications`, `/future-projects`, `/resume`, `/documents`
- Viewport/input mode: Desktop keyboard and screen-reader semantics review
- Finding: Dynamic selected-detail panels update visually, but the controls do
  not consistently expose their relationship to the changing panel and the
  panels are not announced as live, labelled regions.
- Severity: `P1 must fix before launch`
- Evidence: Selected buttons expose `aria-pressed`, while detail asides render
  as plain `aside` containers with remounted motion content and no stable
  `aria-controls`, `role="region"`, `aria-labelledby`, or `aria-live`
  relationship.
- Expected behavior: Selecting a cluster, node, timeline item, credential,
  future track, resume role, or document role should keep focus stable while
  making the updated detail region understandable to assistive technology.
- Proposed fix owner/component: Detail panels and selection controls in
  `src/components/proof-graph/proof-graph.tsx`,
  `src/components/timeline/career-timeline.tsx`,
  `src/components/certification-console/certification-console.tsx`,
  `src/components/future-projects/future-projects-observatory.tsx`,
  `src/components/resume-lens/resume-lens.tsx`, and
  `src/components/documents/documents-hub.tsx`.

- Route: `/timeline`
- Viewport/input mode: Desktop keyboard
- Finding: Desktop scroll cards are focusable with `tabIndex={0}` and update
  selection on focus, but they do not expose button semantics and do not respond
  to `Enter` or `Space`.
- Severity: `P1 must fix before launch`
- Evidence: `TimelineScrollCard` renders an `article` with `tabIndex={0}` and
  `onFocus={onSelect}` only. Compact board marker buttons also rely on truncated
  visible labels and `title` for fuller context.
- Expected behavior: Focusable timeline cards and markers should have meaningful
  accessible names, selected state, and predictable `Enter`/`Space` operation.
- Proposed fix owner/component:
  `src/components/timeline/career-timeline.tsx`.

- Route: `/proof`, `/projects/[slug]`, `/timeline`, `/certifications`, `/resume`, `/documents`
- Viewport/input mode: Keyboard and screen-reader link review
- Finding: Several external proof links and download links have visible labels
  that are too generic when encountered out of context.
- Severity: `P1 must fix before launch`
- Evidence: Labels such as `Open proof`, `Verify`, `Download recommended`, and
  `Download DOCX` do not always include the proof target, credential/project
  context, file type, or new-tab behavior in the accessible name.
- Expected behavior: External links should name the target and new-tab behavior;
  download links should name the document purpose and DOCX file type.
- Proposed fix owner/component: External proof link helpers, detail panel links,
  resume download actions, and document packet actions.

- Route: Global, `/resume`
- Viewport/input mode: Contrast review for small text
- Finding: `--color-steel` is used for small uppercase metadata on dark panels
  and falls below AA contrast on carbon/charcoal surfaces; `--color-old-gold`
  falls below AA for small resume-preview labels on ivory.
- Severity: `P1 must fix before launch`
- Evidence: Quick contrast check showed `#74777a` on `#111111` at about 4.19:1
  and on `#181613` at about 4.01:1. `#8f7335` on `#f4efe4` is about 3.92:1.
- Expected behavior: Small metadata labels should meet at least 4.5:1 contrast
  in their actual dark and ivory surfaces.
- Proposed fix owner/component: `src/styles/tokens.css`.

- Route: Global hidden command palette
- Viewport/input mode: Keyboard, `Ctrl/Cmd+K`
- Finding: The hidden command layer opens and keyboard command execution works,
  but modal focus is not trapped and focus is not returned to the invoking
  control when closed.
- Severity: `P1 must fix before launch`
- Evidence: `HiddenDelightLayer` stores no previously focused element, has no
  Tab/Shift+Tab cycle handling, and the background remains reachable while the
  dialog declares `aria-modal="true"`.
- Expected behavior: The command dialog should keep keyboard focus inside the
  dialog, close on `Escape`, and restore focus after close without leaving the
  user disoriented.
- Proposed fix owner/component:
  `src/components/hidden-delight/hidden-delight-layer.tsx`.

- Route: `/`, `/proof`, `/projects`, `/timeline`, `/certifications`, `/future-projects`, `/resume`, `/documents`, `/profile`
- Viewport/input mode: Landmark and heading smoke
- Finding: Primary route landmarks and route-level headings passed the first
  smoke test.
- Severity: `P3 follow-up`
- Evidence: Browser DOM snapshots showed one `main` and one `h1` on each main
  implemented route and on `/profile`.
- Expected behavior: Keep this invariant while patching component semantics.
- Proposed fix owner/component: No immediate code fix.

## Fixes Applied

- Added stable `aria-controls`, `aria-live`, `role="region"`, and labelled
  detail-panel relationships for the homepage role gateway, proof graph,
  timeline, certifications, future projects, resume, and documents.
- Upgraded desktop timeline scroll cards from passive focusable articles to
  keyboard-operable `role="button"` controls with selected state and
  `Enter`/`Space` handling.
- Added full accessible names for compact timeline markers, future-project track
  controls, external proof links, credential verification links, resume DOCX
  downloads, document packet downloads, and same-page document anchors.
- Added focus trapping, `Escape` close, panel autofocus, and focus restoration
  to the hidden command palette.
- Corrected contrast tokens for small metadata text:
  `--color-steel` changed from `#74777a` to `#85898c`, and
  `--color-old-gold` changed from `#8f7335` to `#755d2b`.
- Made document same-page anchors keyboard-safe by updating the URL fragment,
  scrolling to the target section, and moving focus to the target.

## Final Verification

- `npm run typecheck`: passed after fixes.
- `npm run lint`: passed after fixes.
- `npm run build`: passed after fixes.
- Browser route smoke passed for `/`, `/proof`, `/projects`, `/timeline`,
  `/certifications`, `/future-projects`, `/resume`, `/documents`, and
  `/profile`.
- Browser route smoke passed for all eight generated `/projects/[slug]` pages.
- Keyboard smoke passed for representative controls on `/`, `/proof`,
  `/projects`, `/timeline`, `/certifications`, `/future-projects`, `/resume`,
  and `/documents`.
- Hidden command palette smoke passed for `Ctrl/Cmd+K`, initial input focus,
  Tab containment, `Escape` close, and command navigation.
- Document same-page anchor smoke passed for `Enter` on the credential packet
  anchor, including `#credential-packet` URL update.
- Reduced-motion verification was completed by code review of
  `src/styles/motion.css`, `cinematic-hero.module.css`, and the timeline
  `prefers-reduced-motion` scroll branch; full viewport responsive motion QA
  remains owned by Session 22.

## Handoff Notes

- Session 21 fixed all captured `P1 must fix before launch` accessibility
  issues.
- Session 22 should continue with responsive and 200% zoom QA; do not treat this
  pass as a full breakpoint repair.
- Performance and launch metadata remain owned by Sessions 23 and 24.
