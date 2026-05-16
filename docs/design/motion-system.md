# Motion System

## Motion Personality

- Calm
- Weighted
- Precise
- Smooth
- Tactile
- Intentional

Motion should feel like a precision instrument: clear cause and effect, gentle weight, and no decorative noise.

## Core Rules

- Animate `transform` and `opacity` wherever possible.
- Avoid layout-shifting animations.
- Use scroll-driven scenes for major narrative beats only.
- Use Motion for component transitions.
- Use GSAP ScrollTrigger for authored cinematic/pinned sequences.
- Use CSS scroll-driven animations where support and simplicity make sense.
- Respect `prefers-reduced-motion`.
- Provide a visible pause/reduce option for any looping or ambient motion that lasts more than five seconds.

## Final Motion Tokens

Token names are implemented in `src/styles/motion.css`.

| Token | Value | Use |
|---|---:|---|
| `--duration-instant` | `80ms` | Tiny acknowledgement only |
| `--duration-feedback` | `140ms` | Hover, tap, icon feedback |
| `--duration-state` | `220ms` | Small component state transition |
| `--duration-panel` | `380ms` | Card, case-file, drawer, modal entrance |
| `--duration-page` | `560ms` | Route/view transition envelope |
| `--duration-cinematic` | `900ms` | Hero identity reveal and authored narrative beats |

Compatibility aliases:

- `--motion-fast: var(--duration-feedback)`
- `--motion-standard: var(--duration-state)`
- `--motion-slow: var(--duration-page)`

## Easing Tokens

| Token | Value | Use |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default state movement |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances and reveals |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exits |
| `--ease-emphasized` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Premium case-file openings |
| `--ease-linear` | `linear` | Scrubbed or progress-only motion |

## Distance Tokens

| Token | Value | Use |
|---|---:|---|
| `--motion-distance-xs` | `2px` | Button press and hover lift |
| `--motion-distance-sm` | `6px` | Small reveal or row transition |
| `--motion-distance-md` | `12px` | Panel or card entrance |
| `--motion-distance-lg` | `24px` | Hero/cinematic layer movement |

## Timing Targets

- Hover/tap feedback: 100-180ms
- Small state transition: 180-280ms
- Modal/case file open: 320-480ms
- Page/view transition: 350-650ms
- Scroll-scrubbed cinematic scenes: user-controlled

## Motion Use Cases

Use motion for:

- Identity reveal
- Role lens transition
- Proof graph expansion
- Timeline focus
- Case file opening
- Certification verification stamp
- Social dock tactile feedback
- Document download confirmation

Avoid motion for:

- Constant distraction
- Decorative loops without purpose
- Blocking navigation
- Making basic content harder to read

## Component Motion Rules

Buttons:

- Hover may lift by `--motion-distance-xs` or tighten the border contrast.
- Active state should press back to the original plane.
- Disabled state must not animate.

Cards and case files:

- Hover may use a subtle lift, border shift, or Gold Thread reveal.
- Case-file open transitions may use `--duration-panel` and `--ease-emphasized`.
- Content within a card should not slide independently unless the card is expanding.

Proof graph:

- Node focus may use opacity, scale within 0.98-1.02, and line drawing.
- Graph transitions should not reflow surrounding content.
- Reduced motion should show the selected state instantly with fades only.

Console:

- Row focus can use opacity, border, or background.
- Avoid blinking cursors unless tied to a real input state.
- No looping text effects longer than five seconds without a pause/reduce control.

Page and hero:

- Hero identity reveal may use cinematic timing, but primary text must become readable quickly.
- Scroll-scrubbed sequences belong only in hero, timeline, and major proof narrative moments.
- Basic navigation should never be blocked by an animation.

## Reduced Motion

Reduced motion mode should still feel premium:

- Use fades.
- Use clean static composition.
- Preserve hierarchy.
- Remove large parallax and scrubbed transitions.
- Keep essential feedback visible.

Implementation rules:

- Set motion distance tokens to `0px`.
- Collapse transition and animation durations to `1ms`.
- Disable smooth scrolling.
- Remove parallax, pinned scroll scenes, animated counters, path drawing, and looping ambient effects.
- Preserve selected, verified, loading, and error states through color, border, icon, text, or stamp changes.

## Motion Acceptance Tests

- Keyboard focus remains visible with or without motion.
- No animation is required to understand content.
- Hover and active states do not resize components.
- Reduced motion mode removes large movement but keeps the interface polished.
- Any ambient or looping animation over five seconds has a visible pause/reduce path.
