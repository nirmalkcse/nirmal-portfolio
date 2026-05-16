# V2 Moodboard

Status: Session A draft for review
Updated: 2026-05-16
Scope: Direction only. No app UI code changes.

## Source Inputs

This moodboard is synthesized from:

- `docs/redesign/v2-redesign-brief.md`
- `docs/strategy/validated-decisions.md`
- `docs/design/visual-system.md`
- `docs/design/motion-system.md`
- `docs/tracking/progress-tracker.md`

## Working Direction

V2 should shift the portfolio from a dark-first cinematic dossier into a lighter, more scalable premium system without losing the evidence-led identity that already works.

The strongest direction is **Luminous Dossier**:

- Light-first, calm, high-trust presentation.
- Dark cinematic moments used selectively for hero depth, proof focus, timeline drama, or credential-console contrast.
- Gold Thread remains the memory cue.
- Proof Graph remains the credibility signature.
- Role-aware navigation and evidence emphasis remain, but feel lighter and less heavy.
- Motion becomes smoother and more continuous, with clearer cause and effect.

This direction combines the best parts of:

- Luminous Apple Premium for polish and recruiter trust.
- Editorial Luxury Portfolio for storytelling and memorability.
- Light Instrument Panel for proof, data, and technical credibility.

Adaptive dual theme should remain a candidate, but it is likely better as a controlled later enhancement unless V2 explicitly commits to the extra QA cost.

## Moodboard Matrix

| Design Axis | Mood Target | Concrete Cues | Avoid | Session B Decision Needed |
|---|---|---|---|---|
| Overall atmosphere | Luminous, precise, calm, premium | Porcelain or warm ivory canvas, graphite text, champagne hairlines, restrained emerald verification | Generic SaaS landing page, beige template, heavy gold/brown dominance | Choose light-first vs adaptive dual |
| Brand presence | Quietly confident and first-viewport clear | NK monogram, `Nirmal Kumar` wordmark, one Gold Thread cue near the identity system | Tiny-only branding, decorative overbranding, fake luxury excess | Define hero brand scale |
| Hero expression | Cinematic but readable quickly | Layered light surface, controlled dark contrast, role-aware CTAs, no fixed-height trap | Long unreadable intro, scroll-jacking, oversized empty hero | Pick quiet, cinematic-minimal, or highly interactive |
| Navigation | Subtle professional control layer | Light glass or satin rail, compact route access, role control available after intro | Heavy sticky chrome, crowded mobile nav, pill-heavy marketing buttons | Decide header density and mobile pattern |
| Role gateway | Soft personalization, not a blocker | Segmented control or compact lens cards, immediate skip path, evidence emphasis changes | Full-screen gate, modal interruption, role choice that feels mandatory | Decide whether gateway becomes inline, docked, or section-based |
| Proof Graph | Signature evidence instrument | Stable aspect-ratio graph, emerald verified stamps, signal blue only for active focus | Decorative node art, graph that collapses into illegibility, color-only status | Define desktop/tablet/mobile graph behavior |
| Project case files | Premium evidence stories | Editorial case-study bands, compact metadata rails, Gold Thread edge, public-safety note | Nested cards, cluttered dossier theatrics, overly dark case-file stacks | Choose case-file page composition model |
| Certifications and documents | Trust surfaces with document clarity | Ivory document cards, graphite text, precise verification states, download confirmation | Console-only darkness, fake terminal styling, hidden important links | Decide how much document UI becomes light baseline |
| Typography | Elegant, structured, not theatrical | Strong headings, readable body, compact metadata labels, no viewport-font scaling | Oversized panel headings, negative letter spacing, cramped metadata | Choose display/body pairing rules |
| Surface treatment | Thin, tactile, polished | Satin borders, subtle glass, soft depth, 8px max cards, hairline dividers | Orbs, blobs, loud gradients, rounded pill-heavy UI, cards inside cards | Define V2 light surface tokens |
| Motion | Smooth, tactile, intentional | 140ms feedback, 220ms state, 380ms panels, 560ms page transitions, 900ms hero beats | Constant ambient motion, layout shift, hidden content, parallax everywhere | Define V2 choreography map |
| Responsive scaling | Composed at every viewport | Fluid max-widths, stable instruments, short-height hero rules, wide-screen side rails | Stretching content to 2560px, viewport type scaling, sticky overlap | Lock responsive layout priorities |

## Theme Options

### Option 1: Luminous Dossier

Recommendation: Primary V2 candidate.

Light-first premium portfolio with dark cinematic inserts where contrast helps the story.

Best for:

- Recruiter and executive readability.
- Preserving the existing cinematic dossier identity without staying visually heavy.
- Making resume, documents, certifications, and proof surfaces feel unified.

Likely treatment:

- Page base: warm ivory or porcelain.
- Text: graphite/ink.
- Accent: champagne and antique gold hairlines.
- Trust: emerald stamps and verified states.
- Technical active state: signal blue used rarely.
- Dark surfaces: hero depth, proof-focus panels, timeline focus, console moments.

Risks:

- Could become generic if the proof system and Gold Thread are too quiet.
- Needs strong composition so "light" does not become empty.

### Option 2: Editorial Evidence Magazine

Elegant portfolio with stronger magazine rhythm, larger case-study moments, and a more authored reading experience.

Best for:

- Memorable storytelling.
- Project pages and timeline.
- Making the portfolio feel less like a product UI.

Likely treatment:

- Large editorial titles.
- Thin gold rules.
- Alternating calm content bands and cinematic evidence moments.
- More generous whitespace.

Risks:

- Can become template-like if every section uses the same editorial formula.
- Needs careful mobile reduction.

### Option 3: Precision Instrument Panel

Light professional system with dashboard-grade proof readability and premium restraint.

Best for:

- Technical credibility.
- Proof Graph, certification console, role-specific evidence.
- Users scanning for facts.

Likely treatment:

- Light canvas with graphite instrument panels.
- Dense but breathable metadata.
- Clear selected/current states.
- Stable graph and timeline geometry.

Risks:

- Could feel too operational or SaaS-like.
- Needs cinematic relief in hero and case studies.

### Option 4: Adaptive Cinematic Dual Theme

Shared brand system across light and dark modes, with a user-visible theme toggle or contextual dark sections.

Best for:

- Premium flexibility.
- Users who prefer dark cinematic mode.
- Preserving the current visual identity as an alternate state.

Risks:

- More token work.
- More visual QA.
- More interaction states to test.
- Should only be selected if the added complexity is valuable before deployment.

## What To Preserve

- Existing content inventory and public-safe boundaries.
- Typed data layer and route structure.
- Role lens model, including non-blocking role selection.
- Gold Thread motif.
- Proof Graph as the distinctive credibility system.
- NK monogram and `Nirmal Kumar` wordmark.
- Project, certification, timeline, resume, document, future-project, and profile content.
- Accessibility fixes, reduced-motion support, and keyboard behavior.
- Performance optimizations and lazy-loading work.
- Future Projects Observatory framing as "currently exploring."
- Download and credential packet concepts, with honest placeholder language where assets are pending.

## What To Rethink

- Dark-first dominance across the whole site.
- Hero height and first-viewport content balance, especially on short laptops.
- Navigation visual weight and mobile behavior.
- Role gateway visual treatment, so personalization feels lighter and faster.
- Section density and repeated card rhythm.
- Surface language for proof, project, and document areas in a light theme.
- How Gold Thread appears on light surfaces without turning into decoration.
- Proof Graph scaling across mobile, tablet, laptop, and widescreen.
- Timeline behavior on short-height and touch devices.
- Whether console styling should remain dark, become mixed, or appear only in credential/proof contexts.
- Motion choreography across route transitions, role changes, and selected evidence states.
- Wide-screen composition so 1600px to 2560px layouts feel intentionally arranged, not stretched.

## Responsive Scaling Priorities

### Mobile: 360px to 430px

- Make content readable before cinematic behavior.
- Keep primary CTA access visible without overlap.
- Use compact role controls with clear selected/current state.
- Collapse Proof Graph into evidence chains or focused cards if geometry becomes too small.
- Avoid fixed-height hero sections.
- Avoid sticky elements that consume too much vertical space.
- Preserve 44px touch targets where density allows.

### Tablet: 768px to 1024px

- Use one-column or restrained two-column layouts based on content density.
- Keep navigation and role controls from competing for the same row.
- Let case-file metadata move beside or above content based on available width.
- Maintain stable aspect ratios for graph, timeline, and preview instruments.

### Laptop: 1280px to 1440px

- Treat this as the primary composition target.
- Keep page rhythm dense enough for scanning but airy enough for premium feel.
- Ensure hero, role gateway, proof preview, and project preview all feel balanced without excessive scrolling.
- Validate short-height laptop behavior before wide-screen expansion.

### Widescreen: 1600px to 2560px+

- Use composed max-widths, side rails, proof detail panes, or editorial split bands.
- Do not stretch reading text beyond comfortable measure.
- Let empty space feel intentional through alignment, rule lines, and secondary evidence rails.
- Keep instruments centered or paired with useful context instead of floating alone.

### Short-Height Screens

- Avoid viewport-height hero traps.
- Keep navigation, hero identity, and primary CTA in view quickly.
- Prefer content-led scroll over pinned sequences.
- Test with compact browser heights before approving cinematic sections.

### 200% Zoom Proxy

- Preserve route access and role changes.
- Let multi-column layouts collapse early.
- Avoid clipped buttons, badges, and metadata labels.
- Maintain focus visibility and selected/current states without relying on motion.

## Animation Goals

V2 motion should feel smoother, more continuous, and more tactile while staying restrained.

| Interaction | Goal | Motion Treatment | Reduced-Motion Fallback |
|---|---|---|---|
| Page transition | Make routes feel connected | 350-650ms opacity/transform envelope, no blocking navigation | Instant route change with brief fade if supported |
| Hero reveal | Establish premium identity fast | 900ms maximum staged reveal, primary text readable early | Static hero with hierarchy preserved |
| Role lens change | Show recomposition, not a reload | 220-380ms panel/content swap, selected state lands clearly | Instant selected state and content update |
| Proof Graph focus | Clarify evidence relationships | Node focus, line emphasis, opacity changes, tiny scale range only | Static selected node, line, stamp, and text state |
| Case-file open | Feel tactile and deliberate | 320-480ms panel entrance with `--ease-emphasized` | Immediate open with clear heading/focus |
| Timeline focus | Support exploration | Scrubbed or selected-state transition only where helpful | Static selected card and visible progress state |
| Navigation state | Confirm location | 140-220ms underline, border, or background state | Immediate state change |
| Download confirmation | Reward completion without spectacle | Small success stamp, icon swap, or toast | Static success text/icon |

Motion constraints:

- Animate transform and opacity first.
- Do not use motion to hide required content.
- Do not cause layout shift.
- Avoid scroll-jacking.
- Avoid ambient loops unless they have a visible pause/reduce path.
- Keep reduced-motion mode polished, not broken or bare.

## Input Still Needed From Nirmal

1. Preferred theme model:
   - Light-first Luminous Dossier.
   - Editorial Evidence Magazine.
   - Precision Instrument Panel.
   - Adaptive dual theme.

2. Reference inputs:
   - Screenshots.
   - Links.
   - Apps/sites with the right feeling.
   - Apps/sites to avoid.

3. Existing feature judgment:
   - Features that must stay visually prominent.
   - Features that feel off or too heavy.
   - Any section that should feel more personal, more technical, or more recruiter-focused.

4. Hero boldness:
   - Quiet professional.
   - Cinematic but minimal.
   - Highly interactive.

5. Deployment assumption:
   - Confirm whether Cloudflare Pages remains the intended free hosting target after V2.

## Session B Handoff

Recommended next move:

1. Select `Luminous Dossier` as the baseline unless Nirmal provides references that strongly favor another direction.
2. Decide whether V2 ships light-first only or light-first with selective dark cinematic sections.
3. Define the V2 layout model for homepage, proof, projects, timeline, certifications, resume, documents, and profile.
4. Draft V2 token changes before touching component code.
5. Turn the animation goals above into a route-by-route choreography map.
