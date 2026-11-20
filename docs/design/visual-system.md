# Visual System

## Tone

Apple-like minimal premium with a luxurious undercurrent.

The visual system should feel:

- Precise
- Calm
- Elegant
- Premium
- Technical
- Trustworthy

## Final Palette Tokens

The palette is now locked for implementation. Future visual sessions may add component-specific aliases, but should not replace these base values without updating `src/styles/tokens.css`.

### Core Neutrals

| Token | Value | Use |
|---|---:|---|
| `--color-obsidian` | `#F6F4EE` | Primary light page background |
| `--color-carbon` | `#FFFDF8` | Elevated light surfaces |
| `--color-charcoal` | `#E7EBE2` | Soft sage secondary surfaces |
| `--color-ink` | `#171512` | Strong warm-dark dividers and document text |
| `--color-ivory` | `#211D17` | Primary ink text on light surfaces |
| `--color-ivory-soft` | `#40382E` | Secondary ink text |
| `--color-ivory-muted` | `#6F675B` | Muted copy and quiet labels |

### Material Accents

| Token | Value | Use |
|---|---:|---|
| `--color-champagne` | `#8A6727` | Warm highlight, premium dividers, and metadata text |
| `--color-antique-gold` | `#A1782D` | Gold Thread, primary actions, verification stamps |
| `--color-old-gold` | `#6D4D1D` | Pressed/active gold and darker metallic edges |
| `--color-deep-emerald` | `#1F624C` | Governance, validation, and trust accents |
| `--color-emerald-soft` | `#34835F` | Positive state surfaces and secondary accents |
| `--color-warm-silver` | `#7D766B` | Satin borders and neutral metadata |
| `--color-steel` | `#687179` | Cool muted metadata |
| `--color-signal-blue` | `#3C6F9A` | Limited interactive/data signal only |

### State Colors

| Token | Value | Use |
|---|---:|---|
| `--color-success` | `#2F7A55` | Verified or complete states |
| `--color-warning` | `#8A6727` | Metadata pending or needs review |
| `--color-danger` | `#AF4E40` | Errors, unavailable proof, destructive action |
| `--color-info` | `#3C6F9A` | Active data/selection signal |

## Semantic Color Rules

- Default pages now use a warm light stone base, white glass panels, ink text, warm silver metadata, and antique gold actions.
- Gold is a memory cue, not a fill color. Prefer it as a 1px line, a small icon/stamp color, an underline, or a single vertical Gold Thread.
- Emerald is reserved for governance, validation, trust, and success contexts.
- Signal blue is rare and should mark active data, graph focus, or an inspectable technical state.
- Ivory document surfaces are still reserved for resume/document preview moments, but the core portfolio should remain light, precise, and cinematic.
- Do not build one-note cream, gold, or brown screens. Every major view should include neutral contrast and at least one cool or green counterweight where appropriate.

## Layout And Spacing Tokens

Use a 4px spacing base with restrained fixed type sizes. Do not scale font size with viewport width.

| Token | Value | Use |
|---|---:|---|
| `--space-1` | `4px` | Hairline offsets, icon gaps |
| `--space-2` | `8px` | Compact control gaps |
| `--space-3` | `12px` | Dense metadata gaps |
| `--space-4` | `16px` | Base component padding |
| `--space-5` | `20px` | Compact panel padding |
| `--space-6` | `24px` | Card and toolbar padding |
| `--space-8` | `32px` | Section-internal groups |
| `--space-10` | `40px` | Small section rhythm |
| `--space-12` | `48px` | Medium section rhythm |
| `--space-16` | `64px` | Major desktop rhythm |
| `--space-20` | `80px` | Cinematic band rhythm |
| `--space-24` | `96px` | Hero/top-level rhythm |

Layout tokens:

- `--layout-page-max: 1180px`
- `--layout-reading-max: 720px`
- `--layout-wide-max: 1440px`
- `--layout-gutter: clamp(20px, 4vw, 56px)` for spacing only, never font size
- `--layout-section-y: 96px`
- `--site-header-offset` should track the closed fixed navigation shell plus
  breathing room. Keep mobile/tablet offsets compact enough that the first
  headline appears without a dead band, and rely on `scroll-padding-top` for
  anchor clearance.

## Surface Language

Use:

- Fine gold lines
- Satin borders
- Subtle glass only where useful
- Soft depth
- Warm highlights
- Crisp content containers

Avoid:

- Loud gradients
- Heavy neon
- Fake hacker terminal aesthetics
- Decorative blobs or orbs
- Cartoon avatars
- Overly rounded pill-heavy UI
- Cards inside cards

### Surface Tokens

| Token | Use |
|---|---|
| `--surface-page` | Main page background |
| `--surface-panel` | Standard elevated light panel |
| `--surface-panel-hover` | Hovered repeated item surface |
| `--surface-case-file` | Dossier/case-file card surface |
| `--surface-console` | Technical console or credential console surface, tuned for the light theme |
| `--surface-ivory` | Resume/document surfaces |
| `--surface-glass` | Rare translucent overlay where content remains readable |

Border tokens:

- `--border-subtle`: default satin divider
- `--border-strong`: stronger panel edge
- `--border-gold`: Gold Thread divider
- `--border-cool`: blue/silver technical divider

Radius tokens:

- `--radius-control: 6px`
- `--radius-card: 8px`
- `--radius-panel: 8px`
- `--radius-case-file: 8px`
- `--radius-console: 6px`

Do not exceed 8px radius for visible cards, panels, and controls unless a later component has a documented reason.

## Button Rules

Buttons are compact, clear controls. They should never look like marketing pills.

### Variants

- Primary: antique-gold fill with light text and a crisp gold edge.
- Secondary: transparent or soft light base with satin border and ink text.
- Quiet: no fill, subtle text, visible hover/focus state.
- Ivory/document: ivory base, ink text, antique-gold accent line.
- Danger: dark base, danger border/text, used sparingly.

### States

- Default: clear label, minimum 40px height, icon optional.
- Hover: raise contrast through border, background, or a 1-2px transform; avoid glow-heavy effects.
- Active: return to plane and darken/press the accent.
- Focus visible: use the global gold focus ring and do not remove outlines.
- Disabled: lower opacity, remove transform, keep label readable.
- Loading: keep width stable; replace or pair icon with progress indicator.

Button labels should stay action-oriented: `View Proof`, `Download Resume`, `Inspect Credentials`, `Contact Nirmal`.

## Card And Case-File Rules

Cards are only for repeated items, modals, case files, and console entries.

Default cards:

- 8px radius maximum.
- Subtle elevated light surface with satin border, a faint porcelain highlight, and an optional Gold Thread hairline.
- Content density should support scanning.
- Use one clear title, one compact summary, metadata, and one action.
- Hover may reveal a gold thread or stronger border, but should not resize the card.

Case-file cards:

- Use dossier cues: metadata rail, small status stamp, proof count, sensitivity note, and stack tags.
- A single vertical Gold Thread may run along the left edge or metadata rail.
- Use `--surface-case-file`, `--border-gold`, and `--shadow-surface`.
- Public-safety notes should be visible but calm; do not dramatize confidential boundaries.
- Case-file pages later should follow the Session 04 case-file sequence.
- Thread rails may use a subtle warm/cool glow, but the rail must stay thinner than the content hierarchy.
- Project index cards should expose route type, review state, proof-note count,
  verified-link count, and skill/credential depth near the summary so visitors
  understand why a case is worth opening before they reach the footer.
- If project cards use an evidence-profile band near the summary, do not repeat
  the same count grid in the footer. Use the lower card area for the primary
  evidence note, public-safety boundary, and action.
- Long project-detail pages may use a desktop-only sticky reading path with
  concrete section labels and proof counts. Keep it compact, hide it on narrow
  mobile viewports, and avoid explanatory UI copy beyond the section structure
  itself.
- Project-detail pages should finish with a case-file closeout before the
  shared footer: proof counts, the main work index, the proof/skills route, the
  resume route, and adjacent case-study navigation.
- Long project-detail proof sections must remain visible in full-page review and
  screenshot workflows. Do not rely on scroll-timeline reveal for the core case
  narrative.

Proof cards:

- Show claim, evidence type, linked project/credential, and verification state.
- Use emerald for verified governance/trust signals.
- Use warning for metadata-pending credentials.
- Selected proof inspectors should include a credibility route: source named,
  relationship map, review route, and proof state.
- On mobile, selected proof detail should appear before the long evidence chain
  so visitors can recognize the active node without remembering context from
  earlier cards.
- Place reference actions near the credibility route; do not bury openable
  verification paths below long descriptive copy.
- Credential pages may include a compact verification ledger before the card
  list. Use it to separate current third-party verification, historical or
  supporting records, and public-link gaps; do not hide weaker evidence or give
  it the same visual weight as active proof.
- Selected credential inspectors should include a proof receipt before deep
  metadata: method, public-link state, validity window, and caveat.

Document hubs:

- Keep resume/download CTAs direct and primary.
- Use role-aware recommendations to guide the first handoff, but keep all
  files and routes visible for manual review.
- Lower sections that explain publishing policy, route availability, or future
  exports should render without scroll-hidden reveal states so full-page
  captures and review workflows do not show false blank gaps.
- Put a compact review-order rail near the first download action when the page
  offers PDFs, role packets, and proof depth. The order should clarify first
  pass, audience route, and deeper evidence without becoming another nav.

Contact pages:

- Rank public links by outreach policy. The primary professional route should
  have stronger surface treatment than supporting coding, credential, or
  publication profiles.
- Keep phone and email boundaries calm and explicit when they are intentionally
  unpublished.
- When multiple hero CTAs appear together, use a compact ordered protocol to
  explain the review path: outreach, resume, proof.

Resume pages:

- Keep the one-page PDF as the strongest first action.
- Place master resume, DOCX, credentials, and case studies as follow-up routes,
  not equal first-pass demands.
- In the hero, prefer a compact review-order rail over loose metadata chips:
  one-page scan, master context, proof follow-up.
- Avoid stretched summary cards beside tall download rails; use `content-start`
  or a compact handoff sequence so empty space becomes useful orientation.

Future roadmap pages:

- Treat planned work as governed exploration, not a promise wall.
- Show the promotion rule before the track list: existing work anchors first,
  public-safe shaping second, reviewable deliverables last.
- Give each roadmap card a compact signal rail for source anchors, proof
  packet size, and implementation scope.
- Keep selected-track CTAs close to the title in sticky panels; deeper proof
  lists can scroll, but the next route should not be buried.
- Use promotion gates to explain what is mapped, scoped, guarded, and next
  before adding more decorative detail.
- Hide optional floating chrome on compact touch layouts when it overlaps
  body copy or evidence cards.

Timeline pages:

- Explain the arc before exposing dense filters or long chronological lists.
- Use a compact reading spine when the page combines career, education,
  credentials, projects, and future work into one narrative.
- Keep selected milestone detail near the atlas heading on collapsed layouts;
  mobile users should see the active story before scrolling through every row.
- Preserve left-edge information scent with years, indices, track labels, and
  proof counts, but avoid forcing readers to decode a chart before reading.
- Selected milestone inspectors should include a compact receipt for date,
  track, current lens fit, and proof density before metadata chips and actions.

Homepage staged sections:

- Scroll-staged homepage sections may use sticky motion and reveal timing, but
  URL-targeted sections must force their headline, narrative, and first proof
  surface visible immediately.
- Treat homepage section anchors as real navigation surfaces during QA, even
  when the public header mostly routes to standalone pages.

Navigation:

- Desktop primary navigation can stay label-only when the surrounding page and
  active state are visible, but compact hidden menus should include one short
  route description per item to preserve information scent.
- The mobile drawer should feel like a quiet route index: clear label, concise
  destination context, active state, and one unmistakable resume action.
- Long pages may use one global top-edge progress thread for orientation. Keep
  it 2-3px tall, decorative, non-interactive, and subordinate to the fixed
  header; do not add labels or extra controls to it.
- Footers should act as closing route atlases, not generic link dumps. Use
  identity, a compact proof ledger, primary proof routes, and one resume/contact
  handoff so the visitor leaves with a next step.
- Footer proof signals should be few, factual, and close to navigation. Avoid
  adding another dense card grid at the bottom of long pages.
- Not-found and empty states should still behave like route recovery surfaces:
  one clear explanation, one primary action, a short proof ledger, and compact
  links back to the strongest public paths.

Immersive hero and WebGL:

- Full-bleed 3D may be used on the landing hero when it behaves like a crafted
  proof artifact, material sculpture, or spatial narrative anchor.
- Keep WebGL behind the primary reading path. The name, role statement, first
  CTA, and proof map must remain readable before and after motion settles.
- Do not frame the primary 3D scene inside a decorative card. Let it occupy the
  scene layer with masks, opacity, and depth ordering.
- The 3D palette should reuse champagne, antique gold, warm stone, and limited
  cool trust accents. Avoid neon, game-like materials, and one-note gold fills.
- Mobile 3D should become a quiet signature layer, never a second interface.
  Lower opacity, adjust masks, and preserve CTA and metric contrast.
- Respect reduced motion by stopping loops/parallax and keeping a composed
  still frame visible.
- Always verify WebGL with desktop and mobile screenshots plus a nonblank/detail
  check of the rendered region.

## Console Styling

The console is an instrument panel, not a hacker terminal.

- Use carbon/obsidian surfaces, warm silver text, and precise mono typography.
- Use antique gold for prompts, dividers, and verified marks.
- Use signal blue only for active query, selected row, or focused data path.
- When a console is intentionally dark inside the warm-light theme, use inverse
  text tokens for labels and body copy rather than the light-surface ivory and
  warm-silver tokens.
- Avoid green-on-black theatrics, blinking walls of text, scanlines, and fake command spam.
- Console rows should support real content: credential status, proof records, actions, timestamps, and verification links.
- Scrollbars inside long proof and console surfaces should use the same satin/gold/cool accent language as the rest of the system.

Console tokens:

- `--console-bg`
- `--console-border`
- `--console-text`
- `--console-muted`
- `--console-prompt`
- `--console-active`

## Component State Rules

All interactive components must define:

- Default
- Hover
- Active/pressed
- Focus visible
- Disabled
- Loading or pending, when async work exists
- Selected/current, when the component is part of navigation, tabs, filters, role lens controls, graph nodes, or timelines
- Error/invalid, when the component accepts user input or verification state

State changes should prefer border, color, opacity, and transform tokens. Do not introduce layout shift, font-size changes, or reflow as a state cue.

## Signature Visual Cues

- Gold Thread
- NK monogram
- Proof Graph nodes
- Verification stamp
- Dossier-like case file layout
- Instrument-console credential surfaces

## Social Preview Images

- OpenGraph and Twitter images should behave like a compressed portfolio cover,
  not a generic nameplate.
- Keep the name and role readable at thumbnail scale, then add a compact proof
  ledger and route rail.
- Use the same warm light field, NK seal, satin border, gold rule, and proof
  metrics as the site. Do not overfill the 1200x630 frame with page UI.
- Fit all text and rails inside the image bounds; social cards should never
  rely on browser crop tolerance.

## Browser And App Chrome

- Treat favicon, app icon, Apple touch icon, mask icon, theme color, and web app
  manifest as part of the designed experience, not deployment leftovers.
- Browser-tab/favicon use should prioritize the simplified SVG NK mark so the
  Gold Thread cue survives at 16px and 32px.
- High-resolution PNG app icons may use a restrained seal treatment, but the NK
  geometry must remain the dominant read; avoid miniature page screenshots,
  busy text, dense crests, or decorative symbols.
- The icon field should use the same warm stone, obsidian, ivory, antique-gold,
  and limited cool accent language as the Luminous Dossier system.
- Always verify generated icon routes visually at their native sizes and confirm
  the document head exposes favicon, touch icon, manifest, theme-color, and
  mask-icon discovery tags.

## Accessibility And Contrast Rules

- Primary text on light must use ink or the primary text token.
- Muted text on light should not drop below warm-silver contrast unless it is decorative metadata.
- Focus rings are required for keyboard users.
- A skip-to-content affordance should be mounted before fixed navigation and
  target a consistent `main-content` landmark on every route. Style it as a
  focus-only service control using the same gold/satin material language as the
  header.
- Do not communicate verification state by color alone; pair color with text, icon, or stamp language.
- Hit targets should be at least 40px high for controls and 44px where mobile density allows.
- Reduced-motion rules from `motion-system.md` are required for all animated components.

## Implementation Handoff

- Base tokens live in `src/styles/tokens.css`.
- Motion tokens live in `src/styles/motion.css`.
- Global reset and base document styling live in `src/styles/globals.css`.
- Later UI sessions should consume tokens directly rather than introducing one-off hex values.
- Final UI sections should not be implemented from this document alone; use the relevant session files for ownership.
