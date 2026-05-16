# Session 14: Certification Console

Status: Implemented

## Goal

Build the credential and courses console.

## Inputs

- Certification data
- Credential links

## Deliverables

- Certification console implemented at `/certifications`
- Provider-group tabs plus provider, category, and verification-state filters
- Credential cards with direct, supporting, or pending verification CTAs
- Sticky detail shell with evidence notes, metadata, skill tags, and project evidence
- Empty filter state and future verification queue

## Tasks

- [x] Build provider/category filters
- [x] Add credential cards
- [x] Add verify buttons
- [x] Add empty/future states
- [x] Test external-link rendering in browser

## Handoff Notes

- The console uses `src/data/certifications.ts` as the base record source and layers current public verification display metadata inside `src/components/certification-console/certification-console.tsx` because this session did not own the shared data module.
- Verification display follows `docs/content/certification-inventory.md`: DP-700 is shown as verified but expired on May 1, 2026; DP-600 and Databricks UC Upgrade are shown as verified; Databricks Data Engineer Associate is shown as indirectly supported until its direct credential URL is captured.
- Certificate thumbnails are intentionally deferred until public-safe screenshots are approved, because the inventory warns against exposing credential IDs or certificate numbers by accident.
- Browser QA passed on `http://localhost:3000/certifications` for desktop and 390px mobile: route loads, filters work, empty state appears, detail shell updates, and browser console has no errors.
- `npx eslint src\components\certification-console src\app\certifications` passed.
- `npm run typecheck` and `npm run build` are blocked by existing out-of-scope errors in `src/components/social-dock/social-dock.tsx` (`DockSlotItem.kind` missing and related item typing issues). Next build compiled the route before failing in TypeScript.
