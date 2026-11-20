# Homepage World-Class Redesign Plan

Status: Planning and review pass  
Created: 2026-05-27  
Scope: Homepage only, with navigation/motion-system implications

## Executive Direction

The homepage should move from "cinematic spectacle" to "calm cinematic confidence."

The best fit for this portfolio is still the existing **Luminous Dossier** direction: light-first, precise, trust-building, Apple-like in restraint, with only a few cinematic moments. The current homepage already has strong raw material: a memorable NK identity, proof-led content, typed project data, routeable evidence, and a 3D hero. The fix is not to add more effects. The fix is to choreograph fewer effects with stronger cause and effect.

## Current Homepage Diagnosis

### What Works

- The first desktop viewport has a clear identity: "Nirmal Kumar" is immediately visible.
- The site has a distinct visual asset in the glass NK mark.
- The primary user paths are present: proof, resume, selected work.
- The content strategy is stronger than a normal portfolio: projects, credentials, timeline, and proof routes are connected.
- The codebase already has Framer Motion and Three.js, so the desired interaction quality is feasible without changing stacks.
- Existing docs already point toward the right baseline: `Luminous Dossier`, calm premium presentation, restrained motion, and responsive scaling discipline.

### What Currently Breaks The Desired Feeling

- The hero starts calm, then the scroll transition becomes aggressive: title scale reaches `3`, blur reaches `30px`, actions move `500px`, and eyebrow text flies away. This feels like the page is disassembling instead of inviting exploration.
- Mobile hero composition is unstable. The NK 3D object dominates the narrow viewport, clips heavily, and pushes key copy/buttons into blurred or partially unreadable states.
- The homepage uses long pinned scroll tracks (`220svh`, `300vh`, `400vh`). This can feel like scroll-jacking, especially when there are blank states between animated beats.
- The proof-ledger iMac has empty-screen moments between metric cards. Blank states read as broken, not peaceful.
- Motion is spread everywhere: hero scroll transforms, 3D breathing, sparkles, hover tilts, route orbit, header hide/show, draggable nav pill, card reveals, dark wipe. The user receives many motion languages at once.
- The dark navigation pill looks cool but visually fights the light hero. On mobile it leaves only four links visible and hides useful routes without a clear overflow pattern.
- The visual design mixes local homepage light tokens with global dark tokens. That makes the site harder to reason about and increases the chance of inconsistent surfaces.
- Lint currently fails because `useTransform` is called inside a `.map()` callback in `src/app/page.tsx`. This must be fixed before the homepage can be considered production-polished.

## Research-Backed Principles

### 1. Aesthetic Calm Must Serve Usability

The aesthetic-usability effect says visually pleasing design is often perceived as easier to use. For this homepage, beauty should signal order, care, and trust. It should not mask confusing motion or hidden navigation.

Plan implication:

- Use one dominant hero idea.
- Keep the primary CTA visible and readable.
- Let proof and credentials feel precise, not theatrical.
- Remove blank scrollytelling states.

### 2. Motion Must Clarify, Not Perform

Apple's motion guidance emphasizes purposeful motion that supports feedback and context without overshadowing the experience. WCAG also requires user control for nonessential moving content that runs alongside other content for more than five seconds.

Plan implication:

- Replace "shattering" scroll motion with soft spatial continuity.
- Keep ambient hero motion extremely subtle or user-controlled.
- Add a visible "Reduce motion" or "Still mode" control if ambient 3D/sparkles remain.
- Ensure reduced-motion mode is a first-class composition, not just a disabled animation state.

### 3. Peak-End Memory Should Be Designed

Visitors will remember the strongest moment and the ending more than the average of the page. The peak should be the calm hero-to-proof handoff, not a chaotic blur. The end should feel like a confident closing title card with resume/contact actions.

Plan implication:

- Peak: hero settles into proof path through a single graceful transition.
- End: a quiet final CTA with resume, proof, and contact/download confidence.

### 4. Distinctive Elements Need Restraint

Von Restorff effect supports making key items stand out, but too many standout items reduce salience.

Plan implication:

- The distinctive memory cue should be the Gold Thread plus NK identity.
- Only one primary CTA should be visually dominant.
- Use signal blue rarely for active data states.
- Do not give every card a dramatic 3D hover.

### 5. Performance Is Part Of Luxury

High-performance animation guidance consistently favors `transform` and `opacity`, and warns that blur, shadows, and heavy paint effects can hurt smoothness. A world-class homepage should feel calm because it never stutters.

Plan implication:

- Remove large `filter: blur(...)` scroll transforms.
- Avoid animating expensive full-screen blur/shadow layers.
- Use transform/opacity for reveals.
- Profile the 3D hero on desktop and mobile.

## Visual Thesis

A luminous technical portfolio that opens like a quiet premium object: porcelain light, graphite type, a restrained glass NK form, one gold memory thread, and proof surfaces that feel precise enough to inspect.

## Content Thesis

The homepage story should be:

1. **Identity:** Nirmal Kumar, data engineer, proof-led portfolio.
2. **Orientation:** Choose proof, work, resume, or continue the guided path.
3. **Evidence:** Show that claims connect to projects, credentials, and timeline.
4. **Selected Work:** Present three case files with clear impact.
5. **Routes:** Make navigation feel like a map, not a card maze.
6. **Credentials:** Reinforce platform trust.
7. **Close:** End with resume, documents, and contact-ready confidence.

## Interaction Thesis

Use three motion ideas only:

1. **Hero Breathing Glass:** a very subtle, slow 3D/pointer response that gives the NK mark material presence without competing with text.
2. **Gold Thread Scrollytelling:** a thin line/progress cue that carries the user through proof, work, credentials, and close.
3. **Tactile Controls:** small hover/tap state changes with stable dimensions, crisp focus rings, and 1-2px press/lift feedback.

## Proposed Homepage Structure

### Section 1: Hero, "Calm First Breath"

Goal: Make the visitor feel oriented, relaxed, and impressed within three seconds.

Composition:

- Full-bleed luminous canvas.
- NK glass form as a supporting visual, not a competing billboard.
- `Nirmal Kumar` remains the loudest text.
- One short positioning sentence.
- Primary CTA: `View Proof`.
- Secondary actions: `Selected Work`, `Resume`.
- Small text link or scroll cue: `Follow the proof path`.

Psychology:

- Use processing fluency: fewer elements, obvious hierarchy, soft contrast.
- Use safety cues: readable type, stable nav, generous whitespace.
- Avoid threat/startle cues: no sudden blur, no aggressive scale, no scattering.

Motion:

- On load: 700-900ms text reveal, max 16-24px vertical movement, opacity only after initial paint.
- NK object: slow pointer tilt under 4 degrees; no large scroll-driven scale on mobile.
- Scroll handoff: hero content gently lifts 40-80px and fades to 0.35, while the Gold Thread/proof label enters. No blur.

Implementation notes:

- Replace `titleScale` `[1, 3]` with `[1, 1.08]` or remove title scaling entirely.
- Replace `titleBlur` `30px` with opacity only, or a max 2px blur if absolutely needed.
- Replace `actionsY` `500px` with max `48px`.
- Shorten hero track from `220svh` to about `130-160svh` on desktop, and use normal-flow content on mobile.
- Keep text readable throughout the transition.

Acceptance:

- At 1280x720, the hero text and primary CTA are readable at page load and during the first scroll.
- At 390x844, no hero button or key text is blurred, clipped, or hidden by the 3D object.
- The hero creates one emotional peak: a calm identity reveal, not a collapse.

### Section 2: Proof Path, "Evidence Becomes Inspectable"

Goal: Establish credibility without asking users to decode a dashboard.

Composition:

- Replace the iMac mockup as the main object, or make it smaller and less literal.
- Use a proof ledger strip with four stable metrics.
- Connect each metric to one proof route or case file.
- Use one thin Gold Thread line running through the section.

Motion:

- Each proof item can fade/slide into a stable position.
- If using scrollytelling, every scroll position must show meaningful content.
- No empty screen states.

Implementation notes:

- Fix hook violation by moving metric transforms into a child component, or use static staggered reveal rather than per-item `useTransform` inside `.map()`.
- Replace absolute metric cards that fade fully out with a persistent stack or carousel-like stepper where one item is active and the others remain faintly visible.
- Add progress dots or labels: Skills, Case Files, Timeline, Credentials.

Acceptance:

- Lint passes.
- The proof section never shows an empty device/surface.
- Keyboard and reduced-motion users can access the same proof content in DOM order.

### Section 3: Selected Work, "Three Case Files, One Narrative"

Goal: Show depth quickly and invite inspection.

Composition:

- Use an editorial band rather than huge card drama.
- Lead case file gets visual priority, supporting cases sit as compact rows/tiles.
- Show one impact line per case.
- Include clear action text: `Open Case File`.

Motion:

- Dark cinematic insert can remain, but it should feel like a calm gallery wall, not a sudden wipe.
- Use a gentle background depth shift, not a scale from `0.05` to `1`.
- Hover: border/gold-thread reveal, 1-2px lift. Avoid heavy 3D rotation for text-heavy cards.

Acceptance:

- Text remains readable while section transitions in.
- No section header/copy overlaps case cards.
- Cards do not resize or reflow on hover.

### Section 4: Route Map, "Easy Navigation Throughout"

Goal: Make the portfolio feel easy to move through.

Composition:

- Convert route cards into a clean route map/list with six or seven destinations.
- Add a sticky local "You are here" progress rail on desktop.
- On mobile, provide a compact route drawer or segmented route list.

Navigation behavior:

- Header should remain available, but reduce visual weight over light sections.
- Avoid fully hiding the header during long scrollytelling unless a clear route index remains.
- The draggable liquid pill can stay as a delight only if it does not impair normal link behavior.

Acceptance:

- Every key route is reachable within one tap/click from the homepage.
- Mobile does not silently hide important routes without an alternate menu.
- Active route state is clear without requiring motion.

### Section 5: Credentials, "Trust Reinforcement"

Goal: Reinforce credibility after projects without feeling like a badge dump.

Composition:

- Use a verification rail: issuer, credential, status, proof link.
- Emerald is reserved for verified/trust states.
- Use precise document-like surfaces, not blurred floating cards.

Motion:

- Small stamp reveal on hover/focus.
- Optional scroll-linked line drawing for the Gold Thread.

Acceptance:

- Verification state is conveyed with text/icon, not color alone.
- Credentials remain scannable at mobile widths.

### Section 6: Closing, "Quiet Confidence"

Goal: Leave the user with a clear next action and a composed ending.

Composition:

- One calm closing statement.
- Actions: `Download Resume`, `View Documents`, `Contact / LinkedIn`.
- Mention current exploration only if it supports the hiring story.

Motion:

- Subtle final fade and Gold Thread landing.
- No parallax glow sweep unless it is extremely subtle and reduced-motion safe.

Acceptance:

- The final screen feels like a composed close, not another animated panel.
- Primary action is obvious.

## Navigation Redesign Plan

### Desktop

- Use a lighter satin/glass nav on homepage light sections.
- Keep route labels compact but readable.
- Keep primary routes visible: Proof, Work, Timeline, Credentials.
- Put Resume/Docs/Contact in a utility cluster or menu.
- Remove or simplify full hide-on-scroll. Prefer a compact shrink state.

### Mobile

- Replace horizontal crowding with:
  - brand mark,
  - current/active label,
  - menu button,
  - optional Resume quick action.
- Menu opens as a full-width sheet with all routes.
- Keep 44px touch targets.
- Do not rely on the draggable pill on mobile.

## Motion System Fixes

### Keep

- Framer Motion for hero entrance, section reveals, route transitions, and tactile controls.
- Three.js for the NK hero if performance remains healthy.
- Scroll-linked transforms only for the hero handoff and one proof/work narrative moment.

### Remove Or Reduce

- Large blur transforms.
- Large scale transforms on text.
- Long blank pinned scroll zones.
- Heavy 3D card rotations on every repeated item.
- Ambient loops without a visible still/reduce option.
- Repeated duplicate `Environment` in the 3D scene.

### Add

- A site-level motion preference:
  - `Auto`
  - `Still`
  - respects `prefers-reduced-motion`
- A route transition wrapper:
  - 350-560ms opacity/translate envelope.
  - Future option: View Transition API where supported.
- A consistent tactile feedback utility:
  - hover: 1-2px lift or border contrast.
  - active: press back to plane.
  - focus: visible gold ring.

## Responsive Plan

### Desktop 1280-1440

- Primary design target.
- Hero content anchored left, visual object right/center.
- CTA cluster visible without scrolling.
- Proof and work sections balanced within viewport.

### Widescreen 1600-2560

- Do not stretch text.
- Use side rails, progress line, or wider visual object.
- Keep content max widths intentional.

### Mobile 360-430

- Use a static or gently animated hero.
- Scale the NK object down and crop intentionally behind the text.
- Stack CTAs cleanly.
- Disable pinned tracks; use normal-flow reveal sections.
- Replace iMac/proof scrollytelling with compact proof cards.

### Short-Height Laptops

- Avoid requiring 2+ screens before content changes.
- Keep nav, identity, and CTA visible quickly.
- Test at 1280x650.

## Technical Cleanup Plan

### Phase 1: Production Hygiene

- Fix `react-hooks/rules-of-hooks` in `src/app/page.tsx`.
- Remove unused `profile` import in `src/components/cinematic/cinematic-hero.tsx`.
- Remove or fix unused eslint-disable directives in profile/social components.
- Investigate Framer warning about scroll offset container positioning from browser logs.
- Confirm `npm run lint`, `npm run typecheck`, and `npm run build` pass.

### Phase 2: Token Alignment

- Decide whether global tokens become light-first now.
- Stop overriding large color systems inside `home.module.css`.
- Add semantic homepage aliases:
  - `--home-canvas`
  - `--home-ink`
  - `--home-muted`
  - `--home-thread`
  - `--home-proof`
  - `--home-glass`
- Keep cards/panels at 8px radius unless they are controls or hero-only glass objects.

### Phase 3: Hero Rebuild

- Recompose hero CSS for desktop, mobile, short height, and wide screens.
- Replace shatter transforms with a soft handoff.
- Add mobile-specific 3D position and scale.
- Add still/reduced-motion version.
- Verify screenshots at 390x844, 768x1024, 1280x720, 1440x900, 1920x1080.

### Phase 4: Scrollytelling Rebuild

- Replace long pinned tracks with shorter narrative scenes.
- Ensure no blank states.
- Use progressive disclosure: active item plus visible surrounding context.
- Add a Gold Thread progress cue.

### Phase 5: Navigation Rebuild

- Create light/dark adaptive header treatment.
- Add mobile menu/sheet.
- Make header shrink instead of vanish.
- Keep draggable pill optional and nonessential.

### Phase 6: Polish And Microinteractions

- Standardize hover, active, focus, selected, loading, and disabled states.
- Add small confirmation interactions:
  - resume link press state,
  - credential verified stamp,
  - case file hover gold-thread reveal,
  - proof node focus.
- Ensure dimensions do not shift on hover.

### Phase 7: QA

- Visual screenshots at all breakpoints.
- Reduced-motion screenshots.
- Keyboard tab order check.
- Lighthouse/performance check.
- Browser console check.
- FPS/paint check for hero.

## Code Hotspots

- `src/components/cinematic/cinematic-hero.tsx`: hero scroll transforms are too aggressive.
- `src/components/cinematic/cinematic-hero.module.css`: hero height, mobile layout, and threshold behavior need redesign.
- `src/components/cinematic/Scene3D.tsx`: duplicate environment, heavy 3D text, sparkles, and scroll-scale behavior need performance and composition review.
- `src/app/page.tsx`: proof scrollytelling has hook lint errors and blank states.
- `src/app/home.module.css`: long pinned tracks, large heading scale, heavy hover language, and local token overrides need cleanup.
- `src/components/site/site-navigation.tsx`: hiding behavior and mobile route access need UX revision.
- `src/styles/tokens.css`: global dark-first tokens conflict with the current light homepage direction.

## Success Criteria

The homepage is successful when:

- It feels calm within the first three seconds.
- The hero remains readable during scroll.
- Mobile hero does not crop or blur essential content.
- Motion feels tactile and intentional, not decorative.
- Users always know where they can go next.
- The proof story is understandable without waiting for animations.
- Reduced-motion mode looks designed.
- Lint, typecheck, build, and browser console are clean.

## Research Sources

- Apple Human Interface Guidelines: Motion  
  https://developer.apple.com/design/human-interface-guidelines/motion
- Laws of UX: Aesthetic-Usability Effect  
  https://lawsofux.com/aesthetic-usability-effect/
- Laws of UX: Peak-End Rule  
  https://lawsofux.com/peak-end-rule/
- Laws of UX: Von Restorff Effect  
  https://lawsofux.com/von-restorff-effect/
- Laws of UX: Doherty Threshold  
  https://lawsofux.com/doherty-threshold/
- W3C WCAG 2.2: Pause, Stop, Hide  
  https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- web.dev: High-performance CSS animations  
  https://web.dev/articles/animations-guide
- Chrome Developers: View Transition API  
  https://developer.chrome.com/docs/web-platform/view-transitions/
- MDN: CSS scroll-driven animations  
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
