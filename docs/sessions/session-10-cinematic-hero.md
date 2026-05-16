# Session 10: Cinematic Hero

Status: Implemented

## Goal

Build the premium first impression.

## Inputs

- Brand identity
- Motion system
- Data layer

## Deliverables

- Hero section
- Identity reveal
- Gold Thread start
- Primary CTAs
- Reduced-motion fallback

## Tasks

- [x] Build hero layout
- [x] Add wordmark/monogram usage
- [x] Add staged reveal
- [x] Add CTA layer
- [x] Verify desktop/mobile framing

## Implementation Notes

- The homepage intro shell was replaced with `src/components/cinematic/CinematicHero`, mounted before `RoleGateway` so the role gateway remains the second homepage section.
- The hero uses the NK Threadline wordmark and social-avatar SVG assets, a full-height Gold Thread motif, proof signal tiles, and a compact proof path.
- Hero CTAs read the persisted role lens and fall back to the balanced path; narrow mobile hides tertiary CTAs so the next section remains visible above the dock.
- Motion is CSS-token driven with staged reveal, thread draw, and scanline effects; `prefers-reduced-motion` removes the staged movement while preserving hierarchy.
- Browser QA passed on desktop and 390px mobile: hero loads first, Role Gateway content is visible as the next section, fixed Social Dock remains usable, and browser console errors were zero.

## Handoff Notes

- This is the primary emotional peak.
- Future hero refinements should preserve the first-viewport Role Gateway hint and avoid moving the role gateway out of the second section slot.
