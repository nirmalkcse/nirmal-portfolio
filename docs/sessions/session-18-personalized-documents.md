# Session 18: Personalized Documents

Status: Complete

## Goal

Build or scope role-aware document packets.

## Inputs

- Resume lens
- Project case files
- Certification console
- [Advanced Backlog](../features/advanced-backlog.md)

## Deliverables

- [x] Document packet strategy
- [x] Static document downloads using existing public resume files
- [x] Proof packet concept
- [x] Export placeholders for project case studies

## Tasks

- [x] Decide static vs dynamic v1
- [x] Define document packet types
- [x] Build documents page
- [x] Verify downloads/exports

## Strategy Decision

V1 is static and honest. It exposes the two real public DOCX downloads from
Session 17, then uses route-based packet guidance for proof, credentials, and
case-study review. Generated PDFs, ZIP bundles, credential packets, contact
cards, and project one-pagers are not linked until they exist and pass
public-safe review.

## Packet Types

- Recruiter packet: one-page resume DOCX plus credential and case-file routes.
- Master resume / proof packet: master resume DOCX plus proof graph, case
  files, and credential routes.
- Credential packet concept: certification console, verification queue, related
  skills, and related projects. No bundled credential PDF yet.
- Project case-study exports: live case-file routes with explicit "not
  generated" one-pager placeholders.

## Implementation Notes

- Replaced the `/documents` placeholder route with `DocumentsHub` wrapped in the
  existing `RoleLensProvider`.
- Added `src/components/documents/documents-hub.tsx` and
  `src/components/documents/index.ts`.
- The hub uses persisted role lens state across Balanced, Recruiter, Engineer,
  Leader, and Explorer.
- Document recommendation logic maps roles to the most appropriate packet:
  recruiter/default to the recruiter packet, engineer/explorer to the master
  proof packet, and leader to the case-file export queue.
- The page separates real download actions from pending export concepts with
  visible status badges and explanatory notes.
- Project export placeholders are role-ordered and route to existing case files
  instead of linking to missing PDFs.
- A small homepage typing fix was added so planned route links use the literal
  route type required by Next's generated route checks.

## Verification

- Ran `npm run typecheck` successfully.
- Ran `npm run lint` successfully; only existing `<img>` warnings remain in
  `src/components/site/site-navigation.tsx`.
- Ran `npm run build` successfully; `/documents` prerenders as a static route.
- Smoke-checked `http://localhost:3000/documents`; the route returned `200` and
  included the new hub and placeholder copy.
- Verified `/resume/nirmal-kumar-data-engineer-one-page-resume.docx` returns
  `200` with Word document content type and `29430` bytes.
- Verified `/resume/nirmal-kumar-data-engineer-master-resume.docx` returns
  `200` with Word document content type and `40557` bytes.

## Handoff Notes

- Keep the static-v1 boundary until real generated assets are created.
- Future export work can add generated PDFs/ZIPs behind the existing packet
  cards without changing the route strategy.
- Credential packet generation should wait for certificate images and remaining
  public verification URLs.
- Case-study one-pagers should wait for public-safe screenshots, diagrams, and
  sanitized summaries.
