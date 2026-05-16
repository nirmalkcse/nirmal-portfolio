# Session 11: Social Dock

Status: Complete

## Goal

Build the premium profile CTA dock from the canonical link data.

## Inputs

- `src/data/links.ts`
- [Source Links](../content/source-links.md)

## Deliverables

- Social/profile dock implemented in `src/components/social-dock/`
- Tooltips for profile, proof, credential, and reserved-slot states
- Role-aware emphasis via the `viewer` prop
- Mobile-safe horizontal dock layout
- Homepage mount for scaffold visibility

## Tasks

- [x] Add LinkedIn
- [x] Add GitHub
- [x] Add LeetCode
- [x] Add Microsoft Learn
- [x] Add Databricks
- [x] Add IEEE
- [x] Add future-link slots

## Implementation Notes

- Source of truth remains `src/data/links.ts`; the dock normalizes `socialLinks`, `credentialLinks`, and `publicationLinks` without changing data records.
- Brand icons are used for LinkedIn, GitHub, Databricks, IEEE, and LeetCode; lucide icons cover Microsoft Learn, future slots, and external-link affordances.
- Microsoft Learn opens the first captured credential URL and shows a count for the two captured Microsoft Learn credential links.
- Future-safe slots are disabled placeholders for Kaggle, Hugging Face, and writing profiles so new public links can be added without redesigning the dock.
- The dock defaults to the recruiter viewer lens and can be re-used later with `viewer="engineer"`, `viewer="leader"`, or `viewer="explorer"` once Session 09 role state exists.

## Handoff Notes

- Must remain fast and easy for recruiters.
- Revisit copy and emphasis after the role gateway provides live viewer state.

## Stabilization Checkpoint

- Dock link items and future-slot items now keep explicit readonly type boundaries so the mixed dock array remains a safe discriminated union.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass as of 2026-05-16.
