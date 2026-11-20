# UI/UX Warm-Light Improvement Plan

Status: Implementation plan and critique
Created: 2026-05-30
Scope: Portfolio-wide UI/UX, visual system, interaction design, accessibility, and implementation sequence

## Design Thesis

The portfolio should feel like a modern technical editorial artifact: warm paper, precise ink, quiet data diagrams, and crafted evidence panels. It should be calm enough for recruiters, rigorous enough for engineers, and beautiful enough to feel memorable without becoming ornamental.

Visual thesis:

```text
Warm editorial data atelier: paper-light surfaces, deep ink typography,
amber proof accents, sage/steel data states, and restrained motion.
```

Interaction thesis:

```text
The interface should feel gently responsive: hover states clarify,
scroll reveals orient, and evidence expands without making the visitor
work to understand the basics.
```

Content thesis:

```text
Every section should either orient, prove, deepen, or convert.
No decorative section should exist without helping the reviewer decide.
```

## Research Basis

This plan is grounded in current UX and accessibility guidance:

- NN/g's aesthetic-usability research says attractive interfaces can make people perceive a product as more usable, but only when aesthetics support the task rather than hide usability issues: https://www.nngroup.com/articles/aesthetic-usability-effect/
- NN/g's visual hierarchy guidance emphasizes contrast, scale, grouping, and restraint. It specifically warns against too many colors and too many competing contrast levels: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- Material Design 3's design-system approach supports a tonal color system with surface roles rather than one-off colors, which is useful for a warm-light theme that still needs depth and state: https://m3.material.io/styles/color/the-color-system/overview
- W3C WCAG 2.2 contrast guidance keeps the visual system honest: normal text needs sufficient contrast, and color cannot be the only way meaning is communicated: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- web.dev's Core Web Vitals guidance keeps the "premium" feeling tied to speed and stability, not just visuals: https://web.dev/articles/defining-core-web-vitals-thresholds

## Current UI/UX Critique

### 1. The Site Feels Split Between Two Personalities

The homepage has a warm-light, spacious feel. The Work and case-study pages are still largely dark, console-like, and heavy. This creates a context break: the visitor moves from a calm portfolio into a technical dashboard. That makes the brand feel less intentional.

Fix:

- Unify the site with a warm-light token system.
- Keep dark ink only for typography, buttons, and selected contrast moments.
- Replace console darkness with paper, parchment, linen, and warm glass surfaces.

### 2. The Navigation Looks Cool But Slightly Heavy

The nav has a premium glass-pill idea, but it currently reads as dark and dense against the light hero. The active pill is visually interesting, but the overall header feels more like a sci-fi control bar than a calm professional portfolio.

Fix:

- Use translucent warm glass instead of black glass.
- Make the active pill amber/ivory rather than smoky black.
- Keep the brand mark strong, but soften the chrome.
- Ensure mobile nav does not feel cramped.

### 3. The Hero Is Stronger Than The Rest Of The Site

The hero now has clear name, role, CTA, and a calm background. It works. The issue is that later pages do not carry the same material language. The hero's typographic confidence should become the site-wide visual standard.

Fix:

- Repeat the hero's warm paper and deep-ink system across pages.
- Use the same CTA shape and typography rhythm throughout.
- Avoid returning to dark blocks unless a section truly benefits from contrast.

### 4. The Project Cards Are Informative But Too Heavy

The project cards contain strong content, but the current dark card treatment, dense borders, and many small labels make them feel more like admin panels than polished case-study covers.

Fix:

- Turn cards into editorial case-study covers.
- Use a thin amber rail, generous inner spacing, and fewer heavy borders.
- Make title and one-sentence summary dominate.
- Show the evidence note as a trust stamp, not a dense block.

### 5. Evidence Notes Are The Right Idea, But Need More Elegance

The evidence-note system is a differentiator. Right now it is text-heavy and functional. It should feel like a crafted "source note" in a technical publication.

Fix:

- Use compact status badges.
- Separate claim, source, confidence, and boundary through spacing, not heavy boxes.
- Keep the claim readable first.
- Make status language scannable: `Summarized from internal work`, `Publicly verifiable`, `Sanitized`.

### 6. Motion Is Sometimes Dramatic Before It Is Useful

The site uses motion extensively. Some of it is delightful; some of it risks feeling performative. The goal should be "quiet responsiveness," not constant spectacle.

Fix:

- Keep hero and selected work motion.
- Reduce page-wide hover scaling on dense cards.
- Prefer opacity, small translate, and subtle shadow changes.
- Respect reduced motion throughout.

### 7. Information Density Needs Better Rhythm

Some pages place several dense modules back to back: metadata, problem/system/impact, workflow, links, media, evidence notes, boundaries, related evidence. The content is good, but the visual rhythm needs more editorial pacing.

Fix:

- Use section bands with consistent spacing.
- Alternate dense modules with quieter reading blocks.
- Limit grid complexity on mobile.
- Use short section headers that say exactly what the visitor can inspect.

### 8. Warm Theme Must Not Become Beige Soup

The user wants warm, relaxing tones. That is the right direction, but the palette must avoid becoming monotone beige. It needs a calm range:

- ivory and porcelain surfaces
- warm parchment panels
- deep espresso ink
- amber proof accent
- sage trust accent
- muted steel-blue data accent

## Target Experience

The site should feel like:

- a technical casebook
- a refined data product
- a personal editorial portfolio
- a calm proof system

It should not feel like:

- a black terminal theme
- a generic SaaS card grid
- a design experiment that buries the resume
- a neon tech portfolio
- a beige landing page with weak contrast

## Visual System Plan

### Palette

Core:

- Page: warm porcelain
- Panels: ivory, parchment, warm glass
- Text: espresso ink
- Muted text: roasted taupe
- Accent: antique amber
- Trust: muted sage
- Data: desaturated steel blue

Design rule:

Use amber for evidence and primary action, sage for verified/trust states, and steel blue only for data/technical emphasis. Do not let blue dominate the system.

### Typography

Use a simple hierarchy:

- Display: large, confident, deep ink
- Section headings: editorial, compact, clear
- Body: readable, warm gray/taupe
- Mono labels: small, not overused

Rules:

- No negative letter spacing.
- Keep body text line length under roughly 70 characters where possible.
- Use scale intentionally: one dominant heading per section.
- Avoid all-caps labels becoming visual noise.

### Layout

Principles:

- Page sections should feel like calm full-width bands, not stacked boxes.
- Cards should be reserved for project covers, evidence notes, and grouped data.
- Avoid cards inside cards where possible.
- Each section should have one dominant idea.

Desktop rhythm:

- wide editorial hero
- one-minute review
- selected work
- skills/evidence
- credentials
- resume/contact close

Mobile rhythm:

- one column
- CTAs full-width when needed
- evidence notes stacked
- no sticky panels that obstruct content

### Components

#### Header

Direction:

- warm translucent glass
- soft amber active state
- deep ink nav text
- compact but not cramped

Acceptance:

- readable over light and warm sections
- mobile nav usable at 390px
- resume remains obvious

#### Hero

Direction:

- keep current clarity
- soften background into paper, not abstract tech
- make first viewport look intentional immediately

Acceptance:

- name visible within first paint
- all CTA labels fit mobile
- no blank first viewport

#### Project Cards

Direction:

- editorial case-study covers
- less dark dashboard, more technical magazine
- evidence note appears as trust stamp

Acceptance:

- title, summary, impact, and CTA are scannable in five seconds
- evidence note status is visible without overwhelming the card
- cards do not feel like equal-weight boxes of text

#### Case Study Pages

Direction:

- turn into polished technical case files
- warm paper hero
- evidence notes as source notes
- architecture stages as calm diagram cards

Acceptance:

- project title and outcome dominate
- evidence notes are directly linkable
- confidentiality is visible but not alarming

#### Skills Page

Direction:

- present as capability atlas, not graph-first spectacle
- graph can remain as advanced layer, but public copy should be calm

Acceptance:

- page title says skills mapped to evidence
- no public copy implies every claim is fully verified if it is still being collected

#### Footer

Direction:

- less dense
- more editorial
- warm final contact cue

Acceptance:

- resume, work, LinkedIn/GitHub/contact routes remain visible
- utility links do not dominate

## UX Improvements

### Reviewer Path

Recruiter:

- Hero
- One-minute review
- Resume
- Selected work
- Credentials
- Contact

Engineer:

- Hero
- Selected work
- Case-study detail
- Architecture
- Evidence notes
- Skills

Academic or leader:

- Hero
- Evidence notes
- Education/credentials
- Case-study decisions
- Contact

### Interaction Improvements

- Use hover states to clarify clickability, not to decorate.
- Keep active states visually stable.
- Add direct anchors for evidence sections.
- Keep all key pages reachable without hidden interactions.
- Use scroll motion sparingly and never require it to understand content.

### Accessibility Improvements

- Maintain WCAG AA contrast for text.
- Focus states must be visible on warm backgrounds.
- Do not rely only on amber/green/blue to communicate status.
- Ensure text wraps cleanly inside buttons and evidence badges.
- Verify at 390px width and 200% zoom.

### Performance Improvements

- Avoid heavy blur and large animated filters.
- Keep 3D/WebGL optional or off the critical path.
- Use stable dimensions for hero and cards.
- Avoid scroll-jacking.
- Keep LCP hero content text-first and visible.

## Implementation Phases

### Phase 1: Warm-Light Foundation

Goal:

Unify the site into one warm-light visual system.

Tasks:

- Update global color tokens.
- Change `color-scheme` from dark to light.
- Convert dark surfaces to warm panels.
- Update nav glass to warm translucent material.
- Tune global shadows and borders for light mode.
- Keep contrast accessible.

### Phase 2: Project And Evidence Polish

Goal:

Make the strongest portfolio proof feel crafted.

Tasks:

- Restyle project cards as editorial case-study covers.
- Restyle case-study hero, architecture, and evidence notes.
- Make evidence notes more readable on mobile.
- Add a "verified/summarized/sanitized" visual system.

### Phase 3: Homepage Refinement

Goal:

Make the homepage feel like a polished product narrative.

Tasks:

- Warm the selected work section.
- Make one-minute review cards feel like elegant source panels.
- Use a more tactile visual anchor than dark monitor chrome.
- Soften hover scale and reduce visual noise.

### Phase 4: Skills And Credentials

Goal:

Make skills and credentials feel like a professional evidence atlas.

Tasks:

- Rewrite Skills page copy.
- Reduce graph-first language.
- Use calm grouped evidence sections.
- Align credential panels with warm theme.

### Phase 5: Final Craft Pass

Goal:

Turn the site from "good" to memorable.

Tasks:

- Check every hover/focus state.
- Check every mobile section.
- Check scroll reveals and reduced motion.
- Remove leftover dark-theme language and visual artifacts.
- Run Lighthouse, typecheck, lint, and production build.

## Immediate Implementation Slice

This session should implement Phase 1 and part of Phase 2:

- global warm-light token system
- warm body background
- warm navigation
- warm project/case-study surfaces
- improved evidence-note treatment
- visual smoke checks for homepage, work page, and evidence notes

## Acceptance Checklist

The pass is acceptable when:

- the site feels consistently warm-light across homepage and Work pages
- project pages no longer feel like a separate dark product
- nav is readable and calmer
- evidence notes remain readable on mobile
- primary CTAs remain obvious
- `npm run typecheck`, `npm run lint`, and `npm run build` pass
- screenshots show no blank first viewport, major overlap, or unreadable text

## Design North Star

The final site should feel quiet, intelligent, and carefully made.

The visitor should leave thinking:

```text
This person does not just know data tools. He knows how to structure trust.
```
