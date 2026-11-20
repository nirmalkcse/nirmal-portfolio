# Missing Content List

Status: Active
Last updated: 2026-05-16
Primary source: Session 02 unresolved gaps and Session 03 inventory work

## High Priority

| Item | Why It Matters | Blocks | Suggested Resolution |
|---|---|---|---|
| Public contact preference | Determines contact CTA and profile schema | Hero CTA, contact card, recruiter quick-copy | Confirm contact form, direct email, resume-only email, or both |
| Phone visibility | Avoids exposing private contact information | Resume lens, contact card | Confirm whether phone should appear anywhere public |
| Credential issue dates, expiry dates, and IDs | Required for credible certification console | Certification console, proof packets, timeline | Verify Microsoft Learn, Databricks, Google, Oracle, and GitHub Copilot metadata |
| Mapping Microsoft credential URLs to DP-700 vs DP-600 | Prevents wrong certificate labels | Certification cards | Manually verify rendered Microsoft Learn pages |
| iCORE public naming permission | Prevents leaking sensitive internal/client details | Top project case file, proof graph | Confirm whether "iCORE" can be public or needs anonymized title |
| iCORE sole-developer proof | Determines whether the site can publicly say "sole developer" and "built end to end" | iCORE case file, resume, homepage, timeline | User confirmed sole developer/end-to-end builder; collect Git history, manager confirmation, demo proof, and public-safety approval |
| Databricks Brickbuilder Solutions accreditation proof | Converts iCORE from project proof into platform/company accreditation proof | iCORE case file, proof graph, timeline, resume | User says Databricks issued company accreditation with iCORE as a criterion; confirm exact accreditation name, public badge/listing, and approved wording |
| Telecom PoC public-detail boundaries | Prevents over-disclosing client/source-system details | Telecom case file, proof graph | Confirm if source-system names and industry details are safe |
| Client appreciation proof | Adds external stakeholder validation beyond project claims | Project case files, profile, timeline, resume | Confirm whether Coke/Coca-Cola name is public-safe; collect redacted appreciation note or manager confirmation |
| Microsoft leadership appreciation proof | Strengthens Fabric PoC and AI/data-agent credibility | Fabric/FabCon case files, homepage, timeline, resume | Confirm which PoC was appreciated, whether the recognition was team/company/individual, and what public wording is approved |
| AI Hackathon win details | Adds award/innovation proof to the portfolio | Timeline, profile, AI/data-agent demo, resume | Capture event name, date, team size, project, Nirmal's role, result, and proof artifact |
| Actionable track-record cards | Prevents portfolio content from being limited to already-known projects | Resume, case studies, proof map, timeline, LinkedIn, interview prep | Use `docs/content/actionable-track-record-map.md` to capture 15-25 memory cards across ownership, data engineering, quality, migration, AI, recognition, communication, and learning |
| Project media for top three projects | Makes case files and proof graph feel real | Project case files, proof graph, homepage | Collect sanitized screenshots, architecture diagrams, validation matrices, and workflow visuals |

## Medium Priority

| Item | Why It Matters | Blocks | Suggested Resolution |
|---|---|---|---|
| Exact IEEE publication metadata | Improves publication credibility | Timeline, publication card | Capture title, authorship, date, DOI/conference details |
| FabCon25 demo proof | Supports leadership/AI-agent claim | Timeline, proof graph, project card | Add event link, internal-safe screenshot, or recognition note |
| Insurance Analytics PoC artifacts | Strengthens AI-assisted analytics story | Explorer view, future data-agent copy | Add screenshots, prompt examples, verified response sample |
| VITAC project date and artifacts | Supports business storytelling | Explorer/leader view | Add project date, report screenshots, or presentation excerpts |
| GitHub Align review | Determines whether to promote repository | Engineer view, project inventory | Review repo quality, README, screenshots, and relevance |
| Public profile additions | Broadens social dock if useful | Social dock | Confirm Kaggle, Hugging Face, Medium, Dev.to, or other profiles |
| Preferred short bio tone | Prevents mismatch between polish and personality | Hero copy, metadata, about page | Choose restrained, energetic, or more cinematic bio tone |

## Lower Priority

| Item | Why It Matters | Blocks | Suggested Resolution |
|---|---|---|---|
| Resume file hosting path | Needed before download implementation | Resume lens, document packets | Decide final public asset location during app scaffold/data layer |
| Credential card images | Adds polish | Certification console | Capture after metadata verification |
| Project repository curation | Adds engineer-facing proof | Engineer lens | Improve or select repositories after core content is stable |
| Additional testimonials or references | Adds trust, if available | Leader/recruiter views | Collect only if public and appropriate |

## Public-Safe Artifact Collection Prep

All staged assets under `public/assets` are publicly servable. Use these folders only for approved, sanitized, portfolio-ready media. Keep raw/internal source material outside the repo.

### Collection Gate

- [ ] Asset is either already public, recreated with synthetic data, or explicitly approved for public portfolio use.
- [ ] Client names, client logos, internal team names, internal product names, workspace names, hostnames, URLs, and source-system names are removed unless approved.
- [ ] Dataset rows, employee/customer names, emails, IDs, account numbers, financial values, tokens, secrets, and private notes are absent.
- [ ] Credential IDs and certificate numbers are hidden unless there is an intentional verification-detail surface.
- [ ] Screenshot browser chrome is cropped if it exposes signed-in state, local paths, internal URLs, tabs, bookmarks, extensions, or account menus.
- [ ] Architecture visuals use public-safe labels such as `Source systems`, `Lakehouse`, `Warehouse`, `Validation checks`, `Stewardship workflow`, and `Audit trail`.
- [ ] Source URL, owner approval, and public-safety status are recorded in `docs/content/source-links.md`.
- [ ] File name follows lowercase kebab-case and includes a status word such as `approved`, `redacted`, `synthetic`, or `draft`.

### Staging Queues

| Queue | Target Folder | Needed For | Status |
|---|---|---|---|
| Certificate thumbnails | `public/assets/certificates/thumbnails/{credential-slug}/` | Certification console polish | Staged, assets pending |
| Credential verification screenshots | `public/assets/certificates/verification-screenshots/` | Credential proof packets and verification drawers | Staged, screenshots pending |
| Credential proof packets | `public/assets/certificates/proof-packets/` | Future personalized documents/proof exports | Staged, packet design pending |
| Project screenshots | `public/assets/project-media/{project-slug}/screenshots/` | Project case files, proof graph, homepage | Staged, sanitized media pending |
| Project diagrams | `public/assets/project-media/{project-slug}/diagrams/` | Architecture and workflow proof | Staged, sanitized visuals pending |
| Project proof packets | `public/assets/project-media/{project-slug}/proof-packet/` | Interview prep and document exports | Staged, packet design pending |
| Shared sanitized architecture | `public/assets/project-media/_shared/sanitized-architecture/` | Reusable homepage/proof graph visuals | Staged, visual design pending |
| Shared project proof packets | `public/assets/project-media/_shared/proof-packets/` | Cross-project proof bundles | Staged, packet design pending |

### Project Asset Checklist

| Project | Priority Assets To Collect | Public-Safety Notes | Target Status |
|---|---|---|---|
| iCORE Enterprise MDM / Entity Resolution Platform | Sanitized UI screenshots, entity-resolution workflow diagram, governance evidence-pack diagram, abstract architecture visual | Confirm whether `iCORE` can be named publicly; recreate with synthetic records and generic source labels | Pending approval and synthetic media |
| Tier-1 European Telecom Fabric Migration PoC | Medallion architecture diagram, Fabric pipeline flow, validation screenshot/matrix | Keep client anonymized; generalize source systems unless approved | Pending sanitized diagrams |
| BI Migration, Validation And Analytics Delivery | Anonymized report thumbnails, validation matrix, before/after migration story | Remove client names, report titles, data values, and platform workspace details | Pending redacted media |
| IEEE Research - Semiconductor Chip Analysis Using Medallion Architecture | Citation card, publication screenshot, DOI/conference metadata visual | Public article is acceptable, but use only public metadata and do not imply unverified publication details | Pending metadata confirmation |
| FabCon25 Europe 2025 Talk to Your Data Demo | Demo screenshots, architecture map, event/recognition proof | Confirm event media and any company/Microsoft references before publishing | Pending public-use confirmation |
| Insurance Analytics PoC | Synthetic report screenshots, prompt-library sample, verified response example | Use synthetic insurance data only; avoid proprietary prompt flows if internal | Pending synthetic proof |
| VITAC - Skincare Market Analysis | Report screenshot, market-sizing visual, presentation excerpt | Confirm source material and remove private presentation notes | Pending date and artifact confirmation |

### Certificate Asset Checklist

| Credential | Target Thumbnail Folder | Next Safe Action |
|---|---|---|
| Microsoft Certified: Fabric Data Engineer Associate (DP-700) | `public/assets/certificates/thumbnails/microsoft-fabric-data-engineer-associate-dp-700/` | Capture only after renewal/status decision; label expired truthfully if still used |
| Microsoft Certified: Fabric Analytics Engineer Associate (DP-600) | `public/assets/certificates/thumbnails/microsoft-fabric-analytics-engineer-associate-dp-600/` | Capture cropped public thumbnail without certificate number unless approved |
| Databricks UC Upgrade Delivery Specialization | `public/assets/certificates/thumbnails/databricks-uc-upgrade-delivery-specialization/` | Capture cropped Accredible thumbnail; avoid account UI and unnecessary numeric reference exposure |
| Databricks Certified Data Engineer Associate | `public/assets/certificates/thumbnails/databricks-certified-data-engineer-associate/` | Collect direct public credential URL before thumbnail work |
| Databricks Accredited Databricks Fundamentals | `public/assets/certificates/thumbnails/databricks-fundamentals/` | Collect public verification URL before thumbnail work |
| Microsoft GitHub Copilot | `public/assets/certificates/thumbnails/microsoft-github-copilot/` | Collect public verification URL before thumbnail work |
| Google Data Analytics Professional Certificate | `public/assets/certificates/thumbnails/google-data-analytics-professional-certificate/` | Collect public verification URL before thumbnail work |
| Oracle Cloud Infrastructure Foundations Associate | `public/assets/certificates/thumbnails/oracle-cloud-infrastructure-foundations-associate/` | Collect public verification URL before thumbnail work |

## Content Safety Rules

- Do not publish phone number without explicit approval.
- Do not publish client names unless already public or explicitly approved.
- Do not publish screenshots containing private data, client branding, credentials, tokens, internal URLs, or employee/customer information.
- Use "currently exploring" for planned work unless a project is actively being built.
- Keep GitHub and LeetCode as low-emphasis social links until stronger public proof is available.
