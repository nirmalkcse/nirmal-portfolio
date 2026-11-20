# Cinematic Experience Research

Date: 2026-07-02

## Intent

Elevate the portfolio into a high-value cinematic experience: fluid, interactive, luxurious, and memorable, while preserving clarity for recruiters, hiring managers, and technical reviewers.

The goal is not to use every possible effect. The goal is to make the site feel authored, expensive, and responsive at every meaningful touchpoint.

## Sources Reviewed

- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Nielsen Norman Group: The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/)
- [Nielsen Norman Group: Microinteractions in User Experience](https://www.nngroup.com/articles/microinteractions/)
- [Nielsen Norman Group: Executing UX Animations](https://www.nngroup.com/articles/animation-duration/)
- [Awwwards: Interactive Websites](https://www.awwwards.com/websites/web-interactive/)
- [Awwwards: UI Animation and Microinteractions](https://www.awwwards.com/awwwards/collections/animation/)
- [Awwwards: 3D Websites](https://www.awwwards.com/websites/3d/)
- [Awwwards: Luxury Websites](https://www.awwwards.com/websites/luxury/)
- [Awwwards: Portfolio Websites](https://www.awwwards.com/websites/portfolio/)
- [Figma: Web Design Trends](https://www.figma.com/resource-library/web-design-trends/)
- [Codrops: Scroll-driven 3D Portfolio Case Study](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- [Codrops: Creative Hub](https://tympanus.net/codrops/hub/)
- [Motion.dev: React Scroll Animations](https://motion.dev/docs/react-scroll-animations)
- [Motion.dev: useScroll](https://motion.dev/docs/react-use-scroll)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Lenis Smooth Scroll](https://lenis.dev/)
- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [MDN: CSS Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [React Three Fiber Introduction](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Rive State Machine Overview](https://help.rive.app/editor/state-machine)
- [dotLottie Web Documentation](https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/)

## Core Takeaways

Apple-like motion works because it clarifies state, creates continuity, and responds to user intent. The luxury impression comes from restraint, consistency, material quality, and timing.

NN/g's guidance supports the same direction: animation should communicate, confirm, and orient. Motion that exists only to entertain becomes a distraction, especially for task-focused users.

Awwwards and Codrops examples show that the strongest immersive sites usually have one memorable motion language: a scroll-synced world, 3D product/object choreography, cinematic typography, or a living interface surface. They do not treat every section as a separate special effect.

## Current Portfolio Fit

The repo already has the right foundations:

- Next.js 16 and React 19
- Framer Motion / Motion scroll-linked primitives
- Three.js, React Three Fiber, Drei, postprocessing
- Existing cinematic hero, scroll progress, hidden delight system, sound toggle, and proof-led sections
- Existing warm luxury palette: ivory, porcelain, lacquer, brass, steel, emerald

Missing or optional additions:

- GSAP ScrollTrigger for highly authored pinned timelines
- Lenis for smoother scroll feel if we need DOM/WebGL sync beyond native scroll
- View Transition API for route-level continuity
- Rive or dotLottie only if we need designer-authored vector state-machine animations

## Experience Principles

1. Motion must serve the review flow.
   Every movement should answer: where am I, what changed, what can I do next?

2. Luxury should feel quiet.
   Use deep material detail, spacing, alignment, and timing before adding more effects.

3. One cinematic idea per section.
   Hero can be atmospheric. Review can be scrollytelling. Work can be a gallery. Skills can be a proof room. Credentials can be a verification rail.

4. Interactions should feel physically responsive.
   Hover, focus, press, selection, and route transitions should have immediate tactile feedback.

5. Reduced motion must still feel premium.
   The static composition should hold up without parallax, loops, or large movement.

## High-Value Effect Menu

### 1. Live Cinematic Background

Use for: homepage hero and major proof sections.

Ideas:

- WebGL data-lake artifact that slowly rotates, breathes, and responds to pointer movement
- Ambient brushed-light sheet that follows pointer attention on desktop
- Low-opacity data ribbons or particles that align to scroll progress
- Section-specific material fields: porcelain hero, dark lacquer proof room, soft metallic credentials

Implementation:

- Keep the existing React Three Fiber scene and improve it in layers
- Lazy-load heavy WebGL
- Use static image or CSS fallback on mobile and reduced motion

Priority: High.

### 2. Scroll-Linked Story Worlds

Use for: one-minute review, proof map, selected work.

Ideas:

- Pinned section where one visual surface changes through 3-4 evidence scenes
- Vertical wipe or scanline transition between review states
- Text that enters only when its corresponding visual evidence is present
- Project cards that move from abstract signals into concrete case studies

Implementation:

- Continue using Motion `useScroll`, `useTransform`, and springs for current sections
- Introduce GSAP ScrollTrigger only if the timeline needs precise pin/scrub/snap authoring

Priority: High.

### 3. Luxury Microinteractions

Use for: all interactive elements.

Ideas:

- Buttons: soft sheen, tiny icon travel, press depth, stable focus halo
- Links: underline draws from the action direction
- Cards: border brightens, internal tags rise 1px, arrow responds
- Credential states: verification stamp / scanline / completion tick
- Downloads: quick receipt toast with file type and status

Implementation:

- Prefer CSS and existing Motion wrappers
- Animate transform, opacity, color, border, and shadow only
- Keep states stable; no layout shift

Priority: Immediate.

### 4. Route Transitions And Cinematic Cuts

Use for: moving from homepage to case study, proof, resume, contact.

Ideas:

- Shared-element transition from selected work card into case-study hero
- Soft lacquer curtain between pages
- Case-study page opens with a precise vertical reveal, like a product keynote
- Back navigation restores scroll position and card context

Implementation:

- Explore View Transition API with progressive enhancement
- Keep navigation instant when unsupported
- Avoid blocking route changes

Priority: Medium-high.

### 5. 3D Objects And Spatial Navigation

Use for: hero, proof map, selected work.

Ideas:

- Data artifact composed of glass planes, nodes, and threads
- 3D proof constellation: projects, skills, credentials, outcomes
- Selected work carousel with slight perspective, not a gimmicky spinning wheel
- Project detail 3D object that decomposes into stack, decision, outcome, evidence

Implementation:

- Use React Three Fiber and Drei
- Use low-poly or procedural geometry first
- Add postprocessing only when it materially improves depth

Priority: Medium.

### 6. Carousels And Sliding Systems

Use for: selected work, proof snapshots, credentials.

Ideas:

- Scroll-synced horizontal gallery for selected work
- Magnetic snap carousel for case-study evidence
- Vertical credential rail with active certificate enlargement
- Small thumbnail filmstrip for project detail media

Implementation:

- Avoid autoplay
- Support keyboard navigation, touch, and reduced motion
- Keep carousel as a focused review tool, not content hiding

Priority: Medium.

### 7. Special Effects And Visual Cuts

Use sparingly at section boundaries.

Ideas:

- Light sweep from hero into review
- Iris/viewport aperture reveal for proof graph
- Split-panel cinematic cut between project states
- Scanline verification effect for credentials
- Subtle chromatic edge only on inert decorative layers

Avoid:

- Glitch effects on important text
- Constant grain/noise movement
- Heavy blur behind long text
- Overlapping animated backgrounds and foreground copy

Priority: Selective.

### 8. Hidden Delight And Easter Eggs

Use for: repeat visitors and people who explore.

Current foundation:

- Hidden command layer
- Review vault
- Gold Thread unlock
- Achievement stamps

Ideas:

- Footer mark picks up a gold line after full-site exploration
- Case study detail unlocks a "systems view" after visiting all selected work
- Sound toggle produces one soft confirmation tone when enabled
- Command palette exposes "review paths" instead of novelty-only shortcuts

Implementation:

- Keep easter eggs optional and discoverable through exploration
- Do not hide core content behind them

Priority: Medium.

## Layout Direction

Use a cinematic editorial structure:

- Full-bleed hero with one strong dimensional object
- Pinned review section with one dominant visual
- Selected work as large, low-count premium surfaces
- Skills as a proof room, not a tag dump
- Credentials as a verification rail
- Case studies as cinematic dossiers with stack, decision, outcome, proof

Avoid:

- Dense card mosaics
- Too many floating panels
- Generic SaaS dashboards
- One-note beige or one-note dark palette
- Decorative 3D that says nothing about the work

## Color And Material Direction

Base:

- Warm ivory / porcelain background
- Deep lacquer for high-value contrast
- Brass as restrained accent
- Steel and emerald as evidence/system colors

Add selectively:

- One dark cinematic section for contrast and memorability
- Slightly cooler steel-blue in data/technical sections
- Low-saturation emerald for trust/verification
- Brass only for high-value state, focus, active path, and confirmation

Avoid:

- Purple-blue gradient dominance
- Brown/orange overload
- Too much beige without lacquer/steel contrast
- Neon effects unless contained to the WebGL layer

## Implementation Roadmap

### Phase 1: Microinteraction Baseline

Scope:

- Site-wide tactile buttons and links
- Card hover/focus states
- Credential verification scan
- Cursor-attention sheen on desktop
- Reduced-motion fallbacks

Status: First homepage pass started on 2026-07-02.

### Phase 2: Fluid Navigation

Scope:

- View Transition API proof of concept
- Shared transition from selected work card to project detail
- Softer route-level page entrance
- Back/return state polish

### Phase 3: Hero And Live Background Upgrade

Scope:

- Upgrade React Three Fiber hero artifact
- Add pointer-reactive material layers
- Add mobile/static fallback
- Verify canvas pixels and performance

### Phase 4: Scrollytelling System

Scope:

- Author one pinned proof journey
- Convert selected work into cinematic review gallery
- Add progress indicators that serve orientation
- Consider GSAP ScrollTrigger if Motion timeline complexity grows

### Phase 5: Signature Delight Layer

Scope:

- Extend Gold Thread into meaningful review path completion
- Add refined achievement receipts
- Add optional sound confirmation
- Keep all delight non-blocking

### Phase 6: QA And Performance

Scope:

- Playwright screenshots: desktop and mobile
- Reduced-motion pass
- Keyboard navigation
- Contrast review
- WebGL fallback checks
- Frame-rate/performance check on common laptop viewport

## What Not To Do

- Do not add every effect at once.
- Do not add autoplay carousels.
- Do not add visual effects that compete with text.
- Do not make recruiters wait through animations to access resume or work.
- Do not hide the actual proof behind cinematic atmosphere.
- Do not add heavy dependencies unless the existing Motion/R3F stack cannot handle the desired behavior cleanly.

## Recommended Next Build Pass

Build a "cinematic continuity" pass:

1. Add route transition prototype for homepage to selected project.
2. Upgrade the existing hero 3D artifact into a clearer data-object moment.
3. Convert selected work into a scroll-linked gallery with one active project at a time.
4. Extend the hidden Gold Thread into a real review-completion moment.
5. Verify with Playwright screenshots and reduced-motion checks.

