# V2 UI/UX Redesign Brief

Status: Session A moodboard prepared; pending direction validation
Created: 2026-05-16

## Why This Exists

The current portfolio build is technically launch-ready through Session 23, but deployment is paused because the visual and interaction direction may change substantially before hosting.

This V2 track should guide the redesign without losing the completed content, routes, data layer, accessibility work, responsive work, and performance hardening.

## Current Pivot

User wants to explore:

- A lighter theme or lighter visual direction.
- Super smooth transitions and animations.
- Better scalability across mobile, laptop, and widescreen monitors.
- Additional UI/UX inputs before final deployment.
- Possible significant changes to the current look and feel.

## Session A Output

Session A created `docs/redesign/v2-moodboard.md` as the working input-collection artifact.

The current synthesized direction is **Luminous Dossier**:

- Light-first premium portfolio direction.
- Selective dark cinematic moments for proof, timeline, hero depth, and credential-console contrast.
- Gold Thread, Proof Graph, NK monogram, wordmark, role lens, and public-safe evidence model remain core identity assets.
- Motion should become smoother and more continuous while staying reduced-motion safe.
- Responsive design should prioritize mobile clarity, short-height laptop behavior, and composed widescreen layouts.

This is not a final visual decision. It is the recommended baseline for V2 Session B unless new references or user preference point elsewhere.

## Redesign Principle

Do not restart the portfolio from scratch.

Preserve:

- Content inventory
- Typed data layer
- Route structure
- Role lens model
- Project/certification/timeline/resume/documents content
- Accessibility fixes
- Responsive QA learnings
- Performance optimizations

Redesign:

- Visual theme
- Layout density
- Hero expression
- Navigation feel
- Section compositions
- Motion choreography
- Responsive scaling model
- Surface treatment

## Possible V2 Visual Directions

### Direction A: Luminous Apple Premium

Light-first, refined, airy, expensive.

- Warm ivory / porcelain base
- Soft graphite text
- Champagne gold accents
- Subtle glass and thin lines
- Large calm whitespace
- Apple-like transitions
- Best for recruiter and executive credibility

Risk:

- Must avoid looking like a generic SaaS landing page.

### Direction B: Editorial Luxury Portfolio

Magazine-like, elegant, slightly more expressive.

- Ivory background
- Strong typography
- Thin gold rules
- Large case-study compositions
- Alternating quiet and cinematic sections
- Best for memorable professional storytelling

Risk:

- Needs strict restraint to avoid portfolio-template vibes.

### Direction C: Light Instrument Panel

Professional product-dashboard feel, but premium and spacious.

- Soft light canvas
- Dark graphite panels
- Champagne/emerald proof accents
- Precise data visualizations
- Strong proof graph/timeline readability
- Best for technical users and credibility surfaces

Risk:

- Could become too operational if not cinematic enough.

### Direction D: Adaptive Dual Theme

Light default with optional dark cinematic mode.

- Light theme for readability and mass appeal
- Dark mode for cinematic moments or user toggle
- Shared brand system across both
- Best for premium flexibility

Risk:

- More QA and design complexity.

## Scalability Requirements

V2 should explicitly design for:

- Mobile: 360px to 430px
- Tablet: 768px to 1024px
- Laptop: 1280px to 1440px
- Widescreen: 1600px to 2560px+
- Short-height laptop screens
- 200% zoom proxy

Rules:

- Use fluid containers with max-widths.
- Avoid viewport-width font scaling.
- Use stable aspect ratios for visual instruments.
- Avoid fixed-height hero sections that trap content on short screens.
- Keep key CTAs visible without overlap.
- Make wide screens feel composed, not stretched.

## Motion Requirements

V2 motion should feel:

- Smooth
- Tactile
- Calm
- Expensive
- Responsive to input
- Reduced-motion safe

Motion should prioritize:

- Page/section transitions
- Role lens recomposition
- Card expansion
- Timeline focus
- Proof graph selection
- Navigation state
- Download confirmation

Avoid:

- Constant ambient motion
- Scroll-jacking
- Heavy parallax everywhere
- Motion that hides content
- Animations that cause layout shift

## Input Questions For Nirmal

1. Should V2 be light-only, dark-only, or adaptive dual theme?

2. Which light direction feels closest?
   - Luminous Apple Premium
   - Editorial Luxury Portfolio
   - Light Instrument Panel
   - Adaptive Dual Theme

3. Should the site feel more like:
   - Apple product page
   - Luxury editorial magazine
   - Premium analytics product
   - Personal OS / command center

4. How bold should the hero be?
   - Quiet professional
   - Cinematic but minimal
   - Highly interactive

5. What are the new references, screenshots, links, or inspirations to incorporate?

6. Which existing features should definitely stay?

7. Which existing features feel off and should be rethought?

8. Is Cloudflare Pages still the intended free hosting target?

## Recommended Next Sessions

### V2 Session A: Input Collection And Moodboard

Status: Drafted in `docs/redesign/v2-moodboard.md`; awaiting user references, theme preference, and dislike list.

### V2 Session B: Redesign Strategy

Choose the V2 direction, theme model, layout model, motion philosophy, and screen-scaling rules.

### V2 Session C: Design System V2

Implement light/adaptive tokens and component-state rules.

### V2 Session D: Homepage Redesign

Rebuild hero, role gateway presentation, homepage preview sections, and navigation feel.

### V2 Session E: Feature Surface Restyle

Restyle proof, projects, timeline, certifications, future projects, resume, documents, and profile without changing their content model.

### V2 Session F: QA Re-run

Repeat accessibility, responsive, performance, and deployment checks after redesign.

## Deployment Status

Deployment is paused until V2 direction is validated.
