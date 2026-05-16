# Session 15: Project Case Files

Status: Implemented

## Goal

Build project cards and deep-dive case files.

## Inputs

- Project data
- Information architecture

## Deliverables

- Project index implemented at `/projects`
- Project case file pages implemented at `/projects/[slug]`
- Case file transition through dossier cards and matching detail surfaces
- Architecture/story sections for problem, system, decisions, impact, proof, boundaries, and related evidence

## Tasks

- [x] Build project cards
- [x] Build case file template
- [x] Add architecture sections
- [x] Add links/media
- [x] Test role-specific ordering

## Handoff Notes

- Projects should tell problem -> system -> impact.
- Implementation stays inside `src/components/project-case-file/*` and the owned project routes.
- `/projects` uses the persisted role lens from the homepage and can also switch ordering locally across Balanced, Recruiter, Engineer, Leader, and Explorer.
- Observed/backlog candidates stay visible but lower-emphasis so weak public repositories do not outrank stronger professional proof.
- Public-safety notes, pending media, and pending proof links remain visible by design because several project assets still need approval before public launch.
- Browser QA should cover `/projects`, at least one primary case file, role ordering, desktop, and mobile.
