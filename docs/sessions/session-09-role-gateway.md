# Session 09: Role Gateway

Status: Complete

## Goal

Build the soft role lens section and role state behavior.

## Inputs

- Information architecture
- Data layer
- [Signature Features](../features/signature-features.md)

## Deliverables

- Role gateway component: complete
- Role state model: complete
- Role-specific CTA/content emphasis: complete
- Change-role control: complete

## Tasks

- [x] Implement role cards
- [x] Store selected role
- [x] Change content emphasis by role
- [x] Ensure role gateway is skippable
- [x] Test keyboard access

## Implementation Notes

- Added `src/lib/role-lens.ts` as the role lens model layer.
- Added `src/context/role-lens-context.tsx` for persisted role state using `localStorage`.
- Added `src/components/role-gateway/*` for the soft role lens section, role cards, selected/balanced state, CTA changes, evidence list, and change-role control.
- Integrated the role gateway on the homepage after a restrained non-cinematic intro section. The cinematic hero remains deferred to Session 10.
- Role evidence is derived from the typed data layer through project, skill, certification, timeline, and future-project viewer priorities.
- The gateway stays skippable through the balanced default and the `Keep balanced` control.
- Keyboard access uses native buttons and links with visible focus styles inherited from the global design system.

## Handoff Notes

- Later sections should consume `useRoleLens()` when they need role-aware ordering, CTA copy, or emphasis.
- The current selected role can be `null`; treat `null` as the balanced/default portfolio path.
- The social dock is currently preserved on the homepage with its existing recruiter default. A later session can connect it to `useRoleLens()` if the dock becomes client-side role-aware.
- Session 10 should replace the restrained intro shell with the cinematic hero without moving the role gateway out of the second section position.

## Completion Date

2026-05-16
