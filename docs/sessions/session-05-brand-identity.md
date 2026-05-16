# Session 05: Brand Identity

Status: Complete for direction definition; Session 05.1 vector asset production complete

## Goal

Design the personal identity system.

## Inputs

- [Typography And Brand](../design/typography-and-brand.md)
- [Visual System](../design/visual-system.md)

## Deliverables

- NK monogram direction: complete
- Nirmal Kumar wordmark direction: complete
- Favicon plan: complete
- Social avatar plan: complete
- Logo acceptance test framework: complete
- Session 05.1 primary monogram SVG assets: complete
- Session 05.1 wordmark and horizontal lockup SVG assets: complete
- Session 05.1 favicon, social avatar, background, and one-color tests: complete

No app UI components were changed in this session. Session 05.1 added production SVG assets under `public/assets/brand`.

## Session 05.1 Asset Production

Primary assets:

- `public/assets/brand/nk-threadline-monogram.svg`
- `public/assets/brand/nk-threadline-wordmark.svg`
- `public/assets/brand/nk-threadline-lockup-horizontal.svg`
- `public/assets/brand/favicon.svg`
- `public/assets/brand/social-avatar.svg`

Variant assets:

- `public/assets/brand/nk-threadline-monogram-one-color-black.svg`
- `public/assets/brand/nk-threadline-monogram-one-color-ivory.svg`
- `public/assets/brand/nk-threadline-monogram-on-obsidian.svg`
- `public/assets/brand/nk-threadline-monogram-on-ivory.svg`
- `public/assets/brand/nk-threadline-wordmark-one-color-black.svg`
- `public/assets/brand/nk-threadline-wordmark-one-color-ivory.svg`
- `public/assets/brand/nk-threadline-lockup-horizontal-on-obsidian.svg`
- `public/assets/brand/nk-threadline-lockup-horizontal-on-ivory.svg`

QA assets:

- `public/assets/brand/brand-variant-test-sheet.svg`
- `public/assets/brand/brand-variant-test-sheet.png`
- `public/assets/brand/README.md`

Production notes:

- The monogram remains unenclosed for primary use.
- The Gold Thread is a restrained vertical line, not a glow, gradient, node, or circuit trace.
- The wordmark uses a vector custom `N` and system-font text to avoid embedding licensed font files.
- One-color variants preserve the thread through stroke weight rather than color contrast.

## Selected Direction Set

### Direction A: Threadline Precision

Use as the primary exploration.

- Minimal geometric `NK`.
- The `N` contains one uninterrupted Gold Thread.
- The `K` branches from the thread with two clean diagonals.
- Monoline or near-monoline construction with optical tapering.
- No enclosing shape in the primary mark.
- Best for favicon, loader, navigation, social avatar, and formal identity.

Wordmark:

- Clean Apple-like sans direction.
- Title-case `Nirmal Kumar`.
- One custom detail in the `N` or `K`.
- Restrained tracking and precise optical alignment.

### Direction B: Atelier Cut

Use as the luxury alternate.

- Higher-contrast, precision-cut `NK`.
- Gold Thread appears as an inset incision through the `N`.
- `K` join feels machined and refined.
- Best for hero signature, premium document covers, footer signature, and polished social headers.

Wordmark:

- Neutral sans foundation.
- One tailored typographic detail.
- More editorial mood, but not ornate.

### Direction C: Proof Seal

Use as a system extension only.

- Simplified Threadline `NK` inside a restrained seal container.
- Single fine border at most.
- Optional proof-node details only at larger sizes.
- Best for certification marks, project proof stamps, case-file metadata, and future proof packets.

Wordmark:

- Pair with the standard wordmark when space allows.
- Do not use as the main public identity.

## Favicon Plan

- Start from Direction A.
- Remove all nonessential detailing.
- Preserve the vertical Gold Thread as the main memory cue.
- Use one-color first; add gold only if contrast survives.
- Produce and test at 16px and 32px.
- Avoid tiny graph nodes, decorative cuts, or seal borders in favicon form.

## Social Avatar Plan

- Use Direction A as the default avatar.
- Use obsidian background with antique-gold or ivory mark.
- Keep clear space generous so the mark survives circular cropping.
- Direction B may be used for premium banner/header contexts.
- Direction C may be used only for proof/certification contexts, not the main profile avatar.

## Acceptance Test Readiness

| Test | Direction A | Direction B | Direction C | Notes |
|---|---|---|---|---|
| 16px favicon | Strong candidate | Risky | Risky | Direction A should be simplified first |
| 32px mobile nav | Strong candidate | Moderate | Moderate | Direction B needs optical cleanup |
| 96px social avatar | Strong candidate | Strong candidate | Moderate | Direction C can feel too badge-like |
| One-color | Strong candidate | Moderate | Strong candidate | Direction B must not rely on gold cuts |
| Black background | Strong candidate | Strong candidate | Strong candidate | Gold should stay restrained |
| Ivory background | Strong candidate | Strong candidate | Moderate | Seal borders need contrast control |
| Five-second recall | Strong candidate | Strong candidate | Moderate | Desired memory cue: NK with a Gold Thread |

## Session 05.1 Acceptance Results

| Test | Result | Notes |
|---|---|---|
| 16px favicon | Pass | Simplified favicon keeps the vertical-thread cue |
| 32px mobile nav | Pass | `NK` is readable at small UI scale |
| 96px social avatar | Pass | Avatar mark remains premium and circle-crop safe |
| One-color | Pass | Black and ivory one-color SVGs do not depend on gold |
| Black background | Pass | Ivory/gold mark holds contrast on obsidian |
| Ivory background | Pass | Obsidian/gold mark holds contrast on ivory |
| Render validation | Pass | SVGs parsed as XML and the test sheet rendered through headless Edge |

## Tasks

- [x] Sketch monogram geometry concept
- [x] Define wordmark rules
- [x] Define favicon/submark behavior
- [x] Test black and ivory variants conceptually against acceptance criteria
- [x] Document final direction rules
- [x] Produce primary Threadline Precision monogram SVG
- [x] Produce primary wordmark and horizontal lockup SVGs
- [x] Produce favicon and social avatar SVGs
- [x] Produce black, ivory, obsidian, and one-color variants
- [x] Render and validate the brand variant test sheet

## Decisions

- Direction A, Threadline Precision, is the recommended primary path.
- Direction B, Atelier Cut, should be explored as a premium alternate for larger brand moments.
- Direction C, Proof Seal, should remain a limited-use extension for proof and certification contexts.
- The monogram must be resolved in one color before any gold accent treatment is applied.
- The wordmark should remain title case and avoid ornamental typography.

## Handoff Notes

- Output should feed visual mockups, vector logo exploration, visual system refinement, and later hero implementation.
- Use `public/assets/brand` as the source for future app integration.
- Do not redraw the logo inside app components; consume the SVG files.
- The next optional brand pass should explore Direction B only for larger hero or document-cover moments.
