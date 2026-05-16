# Session Learnings

This file stores cross-session learnings that future sessions must preserve.

## Session 0: Initial Direction

- User wants a hybrid identity, not a single-role positioning.
- Preferred tone is premium, cinematic, elegant, royal, and rich.
- User likes dynamic scroll animation similar to Apple and Bettina Sosa.
- User likes role-wise viewership similar to profile selection.
- User wants a career timeline and certification/course console.
- User has existing professional links and resumes.
- User prefers optimized 2D animation over heavy 3D.

## Session 1: Documentation Hierarchy

- User wants the plan split into multiple markdown files instead of one large file.
- Future sessions should use the structured docs hierarchy.
- The old comprehensive plan remains as archive/reference only.
- Core accepted decisions are stored in `docs/strategy/validated-decisions.md`.
- Progress lives in `docs/tracking/progress-tracker.md`.
- Session-specific state lives in `docs/sessions/`.
- Cross-session learnings live in this file.
- Major decisions live in `docs/learnings/decision-log.md`.

## Session 2: Resume Content Extraction

- Strongest public headline should center on Data Engineering, Microsoft Fabric, Databricks, SQL, PySpark, and Power BI.
- Strongest proof points are the Databricks-hosted iCORE MDM/entity-resolution product, the Tier-1 telecom Fabric migration PoC, and BI validation/migration work.
- Best quantified achievements are 3 source systems, 18-24 daily incremental tables, 15+ reports validated, 90% fewer discrepancies, 6 Tableau reports migrated, 4.4/5 to 4.8/5 performance rating improvement, and 9.11/10 CGPA.
- Role-fit signals should vary by viewer: recruiters get certifications and quantified outcomes, engineers get architecture and implementation depth, leaders get ownership/governance/business impact, and explorers get the hybrid arc.
- GitHub and LeetCode should remain social/profile links for now, not headline proof metrics.
- Credential URLs need metadata verification in the content inventory or certification console sessions.

## Session 3: Content Inventory

- Canonical profile positioning is: "Data Engineer building Fabric lakehouses, Databricks data products, and proof-backed BI systems."
- The first project priority order is iCORE Enterprise MDM / Entity Resolution Platform, Tier-1 European Telecom Fabric Migration PoC, BI Migration/Validation/Analytics Delivery, IEEE Research, FabCon25 Talk to Your Data, Insurance Analytics PoC, and VITAC.
- Skill clusters should be presented as evidence-backed groups, not a flat keyword cloud.
- Proof graph should start with three strong clusters: Data Engineering, BI Trust, and Governed Data Product Builder.
- Certification records are drafted but should remain metadata-pending until issue dates, expiry dates, IDs, and rendered verification pages are checked.
- Public safety rules are now explicit: do not publish phone number, client names, private screenshots, internal URLs, credentials, tokens, or sensitive project details without approval.
- Session 04 should use project priority and viewer positioning to define information architecture before app scaffolding.

## Session 4: Information Architecture

- Homepage order is hero, soft role gateway, proof graph preview, featured projects, evidence-backed skill clusters, timeline preview, certification preview, future projects preview, social dock, and resume/contact close.
- Role lenses should adjust emphasis, ordering, and CTA labels without blocking navigation or splitting the site into isolated experiences.
- Primary navigation should be Work, Proof, Timeline, Credentials, Profile, and Resume, with Contact, Documents, social dock, and role lens as utility navigation.
- The primary case-file spine remains iCORE, Telecom Fabric Migration PoC, and BI Migration/Validation, with research, demos, and future projects used as enrichment after core credibility.
- CTA strategy should vary by viewer: recruiters get resume and credentials, engineers get architecture/proof graph, leaders get impact/case files/contact, and explorers get timeline/future/social routes.
- Content priority rules should keep proof-backed data engineering first, credentials supportive, future work framed as currently exploring, and sensitive details sanitized until approved.

## Session 05: Brand Identity

- Brand identity should explore three directions: Threadline Precision, Atelier Cut, and Proof Seal.
- Threadline Precision is the primary direction because it is the most minimal, scalable, Apple-like, and favicon-safe.
- Atelier Cut is a luxury alternate for larger signature moments, but it needs careful simplification for small sizes.
- Proof Seal is a system extension for certifications, proof moments, and case-file metadata, not the main identity.
- The NK monogram must work in one color before gold accents, shadows, gradients, or material treatments are considered.
- The desired memory cue is "NK with a Gold Thread."
- The wordmark should remain title case, neutral, precise, and minimally customized in only the `N` or `K`.

## Session 06: Design System

- The final palette is locked around obsidian, carbon, charcoal, ivory, champagne, antique gold, emerald, warm silver, and very limited signal blue.
- Gold is a memory cue and should usually appear as a line, thread, stamp, underline, or small accent rather than a large fill.
- Typography uses fixed `rem` tokens, system-first UI fonts, rare editorial accents, mono only for real technical/proof surfaces, and no negative letter spacing.
- The visual system uses 4px spacing, 8px maximum radii for visible cards/panels/controls, satin borders, soft depth, and no nested cards.
- Buttons should be compact professional controls with explicit default, hover, active, focus-visible, disabled, and loading states.
- Case files should use dossier cues: metadata rail, Gold Thread edge, status stamp, proof count, stack tags, and calm public-safety notes.
- Console styling should feel like an instrument panel, not a fake hacker terminal; use warm silver, antique gold, and rare signal blue.
- Motion tokens are finalized for feedback, state, panel, page, and cinematic transitions; animations should clarify, confirm, or reward.
- Reduced-motion mode must remove large movement, parallax, looping ambient effects, animated counters, and path drawing while preserving hierarchy and state visibility.
- Implementation tokens now live in `src/styles/tokens.css` and `src/styles/motion.css`; later UI sessions should reuse them instead of introducing one-off values.

## Session 08: Data Layer

- Portfolio content now lives in typed modules under `src/data/*`, with shared contracts in `src/data/types.ts` and barrel exports in `src/data/index.ts`.
- Cross-module relationships use stable slugs for projects, credentials, skills, timeline events, proof graph edges, and future-project source basis.
- Microsoft credential URLs remain candidate URLs until manual verification confirms which URL maps to DP-700 versus DP-600.
- LinkedIn and LeetCode need browser/manual verification because automated requests returned 429 and 403 respectively.
- Future-project records should stay grounded in existing proof and use "currently exploring" language until a project is actively being built.

## Session 09: Role Gateway

- Role lens state is centralized in `src/context/role-lens-context.tsx` and persists the selected viewer role in local storage.
- `null` role means the balanced default path; future sections should treat it as a first-class state rather than forcing a visitor into a role.
- Role ordering and evidence emphasis are derived from the typed data layer through viewer priorities on projects, skills, timeline events, credentials, and future projects.
- The role gateway is a soft section after the hero: it changes emphasis, CTA labels, and featured proof, but does not block browsing.
- Later homepage sections can import `useRoleLens()` and `src/lib/role-lens.ts` helpers to sort or select content consistently.
- The cinematic hero remains unbuilt; Session 10 should replace the current restrained intro shell while keeping the gateway as the next section.

## Build Stabilization: Social Dock

- Mixed dock collections should preserve the `kind` discriminant for both real links and reserved future slots, with explicit readonly array boundaries when exported or reused.
- Social dock stabilization passed `npm run typecheck`, `npm run lint`, and `npm run build` on 2026-05-16.

## Integration Checkpoint: Hero, Proof Graph, Project Case Files

- The 2026-05-16 production checkpoint after Sessions 10, 12, and 15 passed `npm run typecheck`, `npm run lint`, and `npm run build`.
- Browser route smoke passed for `/`, `/proof`, `/projects`, `/projects/icore-enterprise-mdm-entity-resolution`, and `/certifications` on a local production server.
- Keep future checkpoint notes specific about depth: route smoke confirms rendering and no obvious runtime errors, while full responsive, role-ordering, and visual QA remain separate passes.

## Site Integration: Homepage And Navigation Wiring

- Completed portfolio surfaces should be reachable from both global navigation and homepage preview sections: `/proof`, `/projects`, `/timeline`, `/certifications`, `/future-projects`, `/resume`, and `/documents`.
- The homepage should function as a connected proof index after the hero and role gateway, not only as an introductory landing surface.
- Shared header/footer navigation can wrap completed feature pages, but feature page internals should remain owned by their original sessions unless a later polish pass explicitly scopes changes.
- `/future-projects` is now wired as a secondary-but-visible route; continue using "currently exploring" language until public-safe artifacts exist.

## Site-Wide Integration Checkpoint

- The 2026-05-16 checkpoint after timeline, future projects, resume lens, documents, homepage/nav integration, proof, projects, credentials, and hero passed `npm run typecheck`, `npm run lint`, and `npm run build` with no code fixes needed.
- Browser smoke passed on a local production server for `/`, `/proof`, `/projects`, `/projects/icore-enterprise-mdm-entity-resolution`, `/timeline`, `/certifications`, `/future-projects`, `/resume`, and `/documents`.
- Treat this as rendering and integration confidence only; responsive QA, motion polish, accessibility, performance, and public-safe artifact verification remain separate passes.

## Session 19: Hidden Delight Layer

- Hidden delight should live behind opt-in commands, not visible navigation or
  required flows.
- The command layer can provide utility actions such as proof, credentials,
  timeline, resume, vault, build notes, and Gold Thread unlock without changing
  public IA.
- Achievement moments should be temporary status stamps with professional copy,
  no pointer interception, and reduced-motion-safe presentation.
- Gold Thread unlocks should stay quiet: thread, footer mark, and stamp only,
  not a persistent decorative mode that competes with content.
- Dossier Vault content should summarize public-safe proof signals and guardrails
  rather than expose sensitive artifacts or add speculative claims.

## Session 21: Accessibility Pass

- Capture accessibility findings in the QA checklist format before making UI
  fixes; this keeps launch blockers separate from polish.
- Dynamic detail panels should be stable, labelled live regions connected to
  their selected controls with `aria-controls`; visual remount animation alone
  is not enough.
- Large focusable cards that change selected state need explicit keyboard
  semantics, selected state, and `Enter`/`Space` operation.
- Generic action labels such as "Open proof", "Verify", "Download recommended",
  and "Download DOCX" need accessible names that include target context, file
  type, or new-tab behavior.
- Hidden command palettes must trap focus, close with `Escape`, autofocus the
  active command input or panel action, and return focus after closing.
- Small metadata colors need contrast checks in their actual surfaces; Session
  21 raised `--color-steel` for dark panels and darkened `--color-old-gold` for
  ivory resume-preview labels.
- Same-page document anchors should update the URL fragment and move focus to
  the destination section, especially when the anchor represents a pending
  export or future packet.

## Profile Page Completion

- `/profile` should stay concise and professional: canonical identity, role
  positioning, proof links, social links, resume CTA, and contact boundaries
  before any personality-forward content.
- The profile page can use the persisted role lens, but it should keep one
  stable identity rather than creating separate about pages for each audience.
- Public contact copy should keep LinkedIn as the primary route while email is
  pending confirmation and phone remains unpublished.
- Social links on profile should be useful external routes, not inflated proof
  metrics; GitHub and LeetCode remain low-emphasis until curated.

## Session 23: Performance Pass

- Local SVG brand assets should use plain `img` when the asset is already tiny;
  avoid shipping `next/image` client runtime only to render static SVG marks.
- Shared header/footer navigation should not prefetch every route from the
  first viewport; keep automatic prefetch for deliberate in-page journeys only
  when it is worth the extra network.
- Optional hidden delight UI should stay lazy-loaded. The root layout should pay
  only for the keyboard/listener shell until the visitor explicitly opens it.
- Avoid persistent `will-change` on broad card/control classes. Reserve GPU
  layer promotion for actual interaction or let transform/opacity transitions
  run without permanent layer pressure.
- Client-side brand/social icon packages are not worth the payload for a few
  profile glyphs. Prefer lightweight glyphs or existing local icons unless a
  real brand mark is essential.
- Future performance reviews should parse `.next/server/app/**/page_client-reference-manifest.js`
  when the Next route table omits byte sizes.

## Standing Learnings

- The public site should feel premium and professional before it feels playful.
- The internal concept is Cinematic Engineering Dossier, but public copy should stay elegant and restrained.
- Role gateway should be a soft intro after the hero.
- Planned projects should be described as currently exploring.
- Use both NK monogram and full Nirmal Kumar wordmark.
- Advanced bells and whistles are desired, but should not weaken credibility.
- Use content inventory docs in `docs/content/*` as the canonical source for future data-layer implementation.
- Later UI work should consume the finalized Session 06 design tokens and avoid one-off colors, spacing, timing, or state rules.
