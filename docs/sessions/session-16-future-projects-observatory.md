# Session 16: Future Projects Observatory

Status: Implemented

## Goal

Build the currently-exploring roadmap.

## Inputs

- Future project data
- Advanced backlog

## Deliverables

- [x] Future Projects Observatory page at `/future-projects`
- [x] Status language
- [x] Currently exploring cards
- [x] Expanded selected-detail rail

## Tasks

- [x] Define future projects
- [x] Use currently exploring language
- [x] Add visual roadmap
- [x] Keep claims soft and professional

## Implementation Notes

- Added `src/components/future-projects/future-projects-observatory.tsx` as the primary observatory experience.
- Added `src/app/future-projects/page.tsx` with route metadata.
- Uses `src/data/future-projects.ts` as the source of truth and resolves `sourceBasis` slugs back to existing project, skill, and timeline records where possible.
- The page includes roadmap guardrails, stage cards, selectable exploration tracks, planned proof checklists, stack tags, and source-basis links.
- Copy keeps each item framed as currently exploring, candidate proof, or public-safe shaping rather than promised delivery.

## Handoff Notes

- This section shows ambition without overpromising.
- Future sessions can promote an item only after sanitized diagrams, screenshots, walkthroughs, or verification assets exist.
- If homepage navigation expands, add `/future-projects` as the Explorer-facing route without letting it outrank built project case files.
