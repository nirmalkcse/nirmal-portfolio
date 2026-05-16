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
| `--color-obsidian` | `#070707` | Primary page background |
| `--color-carbon` | `#111111` | Elevated dark surfaces |
| `--color-charcoal` | `#181613` | Warm secondary surfaces |
| `--color-ink` | `#25221D` | Strong warm-dark dividers and ivory-mode text |
| `--color-ivory` | `#F4EFE4` | Primary text on dark, premium light surfaces |
| `--color-ivory-soft` | `#E8DFCF` | Secondary bright text |
| `--color-ivory-muted` | `#CFC6B6` | Muted copy and quiet labels |

### Material Accents

| Token | Value | Use |
|---|---:|---|
| `--color-champagne` | `#D8C28A` | Warm highlight, premium dividers |
| `--color-antique-gold` | `#B9974A` | Gold Thread, primary accents, verification stamps |
| `--color-old-gold` | `#8F7335` | Pressed/active gold and darker metallic edges |
| `--color-deep-emerald` | `#12372A` | Governance, validation, and trust accents |
| `--color-emerald-soft` | `#2C5946` | Positive state surfaces and secondary accents |
| `--color-warm-silver` | `#B8B6AD` | Satin borders and neutral metadata |
| `--color-steel` | `#74777A` | Cool muted metadata |
| `--color-signal-blue` | `#7EA7D8` | Limited interactive/data signal only |

### State Colors

| Token | Value | Use |
|---|---:|---|
| `--color-success` | `#83B49A` | Verified or complete states |
| `--color-warning` | `#D8C28A` | Metadata pending or needs review |
| `--color-danger` | `#D78370` | Errors, unavailable proof, destructive action |
| `--color-info` | `#7EA7D8` | Active data/selection signal |

## Semantic Color Rules

- Default pages use obsidian, carbon, ivory, warm silver, and antique gold.
- Gold is a memory cue, not a fill color. Prefer it as a 1px line, a small icon/stamp color, an underline, or a single vertical Gold Thread.
- Emerald is reserved for governance, validation, trust, and success contexts.
- Signal blue is rare and should mark active data, graph focus, or an inspectable technical state.
- Ivory surfaces are allowed for document/resume moments, but the core portfolio should remain dark and cinematic.
- Do not build one-note gold/brown screens. Every major view should include neutral contrast and at least one cool or green counterweight where appropriate.

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
| `--surface-panel` | Standard elevated dark panel |
| `--surface-panel-hover` | Hovered repeated item surface |
| `--surface-case-file` | Dossier/case-file card surface |
| `--surface-console` | Technical console or credential console surface |
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

- Primary: obsidian or carbon base with antique-gold border/thread and ivory text.
- Secondary: transparent or soft dark base with satin border and ivory text.
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
- Subtle dark surface with satin border.
- Content density should support scanning.
- Use one clear title, one compact summary, metadata, and one action.
- Hover may reveal a gold thread or stronger border, but should not resize the card.

Case-file cards:

- Use dossier cues: metadata rail, small status stamp, proof count, sensitivity note, and stack tags.
- A single vertical Gold Thread may run along the left edge or metadata rail.
- Use `--surface-case-file`, `--border-gold`, and `--shadow-surface`.
- Public-safety notes should be visible but calm; do not dramatize confidential boundaries.
- Case-file pages later should follow the Session 04 case-file sequence.

Proof cards:

- Show claim, evidence type, linked project/credential, and verification state.
- Use emerald for verified governance/trust signals.
- Use warning for metadata-pending credentials.

## Console Styling

The console is an instrument panel, not a hacker terminal.

- Use carbon/obsidian surfaces, warm silver text, and precise mono typography.
- Use antique gold for prompts, dividers, and verified marks.
- Use signal blue only for active query, selected row, or focused data path.
- Avoid green-on-black theatrics, blinking walls of text, scanlines, and fake command spam.
- Console rows should support real content: credential status, proof records, actions, timestamps, and verification links.

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

## Accessibility And Contrast Rules

- Primary text on dark must use ivory or ivory-soft.
- Muted text on dark should not drop below warm-silver contrast unless it is decorative metadata.
- Focus rings are required for keyboard users.
- Do not communicate verification state by color alone; pair color with text, icon, or stamp language.
- Hit targets should be at least 40px high for controls and 44px where mobile density allows.
- Reduced-motion rules from `motion-system.md` are required for all animated components.

## Implementation Handoff

- Base tokens live in `src/styles/tokens.css`.
- Motion tokens live in `src/styles/motion.css`.
- Global reset and base document styling live in `src/styles/globals.css`.
- Later UI sessions should consume tokens directly rather than introducing one-off hex values.
- Final UI sections should not be implemented from this document alone; use the relevant session files for ownership.
