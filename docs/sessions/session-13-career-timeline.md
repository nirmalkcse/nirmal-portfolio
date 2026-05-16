# Session 13: Career Timeline

Status: Implemented

## Goal

Build the scroll-driven career timeline instrument.

## Inputs

- Timeline data
- Certification data
- Future-project data
- Motion system

## Deliverables

- Timeline route implemented at `/timeline`
- Desktop scroll-driven timeline board with education, work, certifications, projects, and currently-exploring tracks
- Mobile stacked fallback grouped by the same track model
- Sticky/active detail cards with project, credential, and proof-state links
- Role-aware emphasis for balanced, recruiter, engineer, leader, and explorer lenses
- Reduced-motion fallback that keeps the board readable and uses non-animated item jumps

## Tasks

- [x] Define timeline scales
- [x] Build tracks
- [x] Add scroll/focus behavior
- [x] Add detail cards
- [x] Add reduced-motion fallback

## Implementation Notes

- `src/components/timeline/career-timeline.tsx` hydrates base milestones from `src/data/timeline.ts`.
- Certification and currently-exploring rails are derived from `src/data/certifications.ts` and `src/data/future-projects.ts` so the requested tracks exist without editing shared data modules in this session.
- The desktop view uses an IntersectionObserver scroll spy to update the active rail item and detail state. When reduced motion is preferred, the scroll spy is disabled and selection changes happen through focus/click with instant scroll behavior.
- Track items keep public proof boundaries visible: verified links, pending resume-source claims, related project links, and credential queue entries all remain inspectable.
- Compact rail labels were added for dense track readability, especially certification items such as DP-700, DP-600, DBX DE, UC Upgrade, Google DA, and OCI.

## Validation

- `npm run typecheck` passed.
- `npx eslint src\components\timeline src\app\timeline` passed.
- `npm run build` passed.
- Browser QA passed on `http://localhost:3000/timeline` for desktop route load, track rendering, active detail card, derived exploration content, and no new visible runtime errors after the key fix. Mobile fallback is present in the rendered route and uses the same track grouping, with visual responsive QA still included in the later full responsive pass.

## Handoff Notes

- Must feel precise and premium, not like a generic chart.
- Future polish can add a stricter date source for credentials once exact issue dates are captured.
