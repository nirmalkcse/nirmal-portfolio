# Session 12: Proof Graph

Status: Complete

## Goal

Build the skill-to-proof visualization.

## Inputs

- Skills data
- Projects data
- Certifications data

## Deliverables

- Proof graph component at `src/components/proof-graph/*`
- `/proof` route at `src/app/proof/page.tsx`
- Evidence nodes for skills, projects, credentials, metrics, practices, artifacts, and proof gaps
- Role-aware filtering for balanced, recruiter, engineer, leader, and explorer lenses
- Desktop graph canvas plus mobile evidence-chain fallback

## Tasks

- [x] Define graph schema
- [x] Build visual graph
- [x] Connect skills to proof
- [x] Add interactions
- [x] Test readability

## Implementation Notes

- The graph schema stays local to the proof graph component and hydrates real skill, project, and credential nodes from the canonical `src/data/*` arrays.
- Supplemental metric, practice, and artifact nodes are defined in the component because they are proof-evidence objects rather than full portfolio records.
- The role filter reuses the existing role-lens context so role choice can remain consistent with the rest of the portfolio.
- Desktop renders a node-and-edge canvas with selectable node detail. Mobile renders the same cluster as stacked evidence chains for readability.
- Pending proof artifacts remain visible as graph nodes so the page doubles as a proof collection map.

## Handoff Notes

- This is one of the most distinctive credibility features.
- Next proof-hardening pass should collect public-safe architecture diagrams, anonymized validation matrices, credential verification screenshots, and approved iCORE/FabCon demo artifacts.
