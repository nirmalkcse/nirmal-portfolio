# Session 24: Deployment

Status: Planning complete; implementation pending

## Goal

Launch the portfolio with production-safe metadata, social previews, favicon handling, final route verification, and clear deployment notes.

## Inputs

- Production-ready app
- QA, accessibility, responsive, and performance results
- Existing brand assets in `public/assets/brand/`
- Existing route metadata in `src/app/**/page.tsx`
- Final production URL or domain

## Launch Metadata Strategy

Public metadata should position the site as a proof-led professional portfolio for data engineering, AI / ML systems, cloud architecture, BI modernization, and governed analytics.

Avoid overusing the internal creative phrase "Cinematic Engineering Dossier" in public metadata. It can guide tone, but public titles and descriptions should be direct enough for recruiters, engineering leaders, and technical peers.

### Global Metadata

Recommended root metadata implementation target:

| Field | Planned value |
|---|---|
| Default title | `Nirmal Kumar | Data Engineer, AI/ML, Cloud` |
| Title template | `%s | Nirmal Kumar` |
| Application name | `Nirmal Kumar Portfolio` |
| Description | `Proof-led portfolio for data engineering, AI/ML systems, cloud architecture, BI modernization, and governed analytics by Nirmal Kumar.` |
| Author | `Nirmal Kumar` |
| Creator | `Nirmal Kumar` |
| Publisher | `Nirmal Kumar` |
| Canonical metadata base | Final production URL once confirmed |
| Robots | Index and follow only after final live QA passes |

Description guardrails:

- Keep the homepage description under roughly 155 characters where possible.
- Lead with professional clarity before cinematic language.
- Include "Nirmal Kumar" and primary role language on the homepage.
- Do not imply unverified employment outcomes, unpublished credentials, or private client artifacts.
- Keep future projects framed as currently exploring, not completed proof.

### Route Metadata Plan

| Route | Title plan | Description plan |
|---|---|---|
| `/` | `Nirmal Kumar | Data Engineer, AI/ML, Cloud` | Use the global proof-led description. |
| `/proof` | `Proof Graph` | Keep the current role-aware evidence framing; ensure it mentions skills, projects, credentials, metrics, and proof gaps. |
| `/projects` | `Project Case Files` | Emphasize inspectable data engineering, BI modernization, research, and AI/data-agent projects. |
| `/projects/[slug]` | Project title from data | Use `project.summary`, then verify summaries are public-safe and under social-preview length limits. |
| `/timeline` | `Career Timeline` | Position as education, career, credential, project, and exploration momentum. |
| `/certifications` | `Certifications` | Emphasize credential verification states and public proof links. |
| `/future-projects` | `Future Projects` | Preserve currently-exploring language and avoid completed-project claims. |
| `/resume` | `Resume` | Emphasize one-page and master resume downloads with role-aware recommendations. |
| `/documents` | `Documents` | Emphasize proof packets, resume assets, and honest placeholders for future exports. |
| `/profile` | `Profile` | Keep placeholder metadata conservative until the page becomes a complete public profile. |

Future route note:

- `/contact` appears in the site-shape documentation but is not part of the implemented route scope yet. Do not include launch metadata for it until the route exists.

## OG Image Plan

Preferred format:

- Static image at `1200x630`.
- File target: `public/assets/brand/og-image.png`.
- Optional source target: `public/assets/brand/og-image.svg` or a design source kept near brand assets.
- Use the existing Threadline Precision identity system rather than a new visual language.

Primary OG image copy:

```text
Nirmal Kumar
Data Engineering. AI Systems. Cloud Architecture.
Proof-led portfolio: projects, credentials, resume, and role-aware evidence.
```

Shorter crop-safe variant:

```text
Nirmal Kumar
Proof-led data, AI, and cloud portfolio.
```

Visual composition:

- Obsidian background using the established brand color.
- Threadline monogram or horizontal lockup with generous clear space.
- Antique-gold vertical thread as the memory cue, used sparingly.
- Text should stay legible in small social cards and mobile message previews.
- Avoid dense graphs, dashboard screenshots, code blocks, or decorative visual noise.
- Do not use client/internal screenshots or unpublished artifacts.

OG metadata fields to implement later:

| Field | Planned value |
|---|---|
| `openGraph.type` | `website` |
| `openGraph.siteName` | `Nirmal Kumar Portfolio` |
| `openGraph.title` | Match route title or homepage default |
| `openGraph.description` | Match route description |
| `openGraph.url` | Final canonical URL for each route |
| `openGraph.images` | `/assets/brand/og-image.png`, `1200x630`, descriptive alt |
| `twitter.card` | `summary_large_image` |
| `twitter.title` | Match route title |
| `twitter.description` | Match route description |
| `twitter.images` | `/assets/brand/og-image.png` |

Recommended OG image alt:

```text
Nirmal Kumar portfolio preview with NK Threadline Precision mark and proof-led data, AI, and cloud positioning.
```

## Favicon And Icon Usage

Existing asset:

- `public/assets/brand/favicon.svg`

Implementation target:

- Wire the favicon through Next metadata `icons` or app icon conventions.
- Keep the SVG favicon as the primary browser-tab icon.
- If platform testing shows poor SVG support in a target context, add generated PNG/ICO fallbacks from the same `favicon.svg` source.
- Use `social-avatar.svg` only for social/avatar contexts, not as the browser favicon.
- Do not redraw the logo inside app code; consume files from `public/assets/brand/`.

Icon acceptance checks:

- Browser tab renders on local production build.
- 16px favicon retains the vertical Gold Thread cue.
- 32px mobile/bookmark rendering remains readable.
- Dark and light browser UI contexts do not wash out the mark.
- No oversized or blurry icon appears in social previews.

## Social Preview Text

Homepage share text:

```text
Proof-led portfolio for Nirmal Kumar across data engineering, AI/ML systems, cloud architecture, BI modernization, and governed analytics.
```

Recruiter-friendly variant:

```text
Resume, projects, credentials, and evidence paths for Nirmal Kumar's data engineering and AI/cloud systems work.
```

Engineering peer variant:

```text
Inspectable project case files across Microsoft Fabric, Databricks, BI modernization, entity resolution, and grounded AI systems.
```

Leader-friendly variant:

```text
A proof-led view of ownership, delivery maturity, governed data products, and business-facing analytics systems.
```

Short profile/bio variant:

```text
Data engineering, AI systems, cloud architecture, and proof-led project case files.
```

## Deployment Checklist

### Pre-Deployment Gates

- [ ] Session 21 accessibility pass is acceptable.
- [ ] Session 22 responsive QA is acceptable.
- [ ] Session 23 performance pass is acceptable.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Route smoke test covers `/`, `/proof`, `/projects`, every generated `/projects/[slug]`, `/timeline`, `/certifications`, `/future-projects`, `/resume`, `/documents`, and `/profile`.
- [ ] Resume DOCX downloads work from production build.
- [ ] External profile, credential, publication, and proof links are manually checked.

### Metadata Implementation

- [ ] Set final root title, template, description, authors, creator, publisher, and metadata base.
- [ ] Add canonical URL handling after the production URL is known.
- [ ] Add favicon/icon references using existing brand assets.
- [ ] Add OG/Twitter metadata defaults.
- [ ] Add route-level overrides where page-specific descriptions are stronger than the global default.
- [ ] Verify dynamic project metadata remains public-safe and does not exceed preview-friendly length.
- [ ] Add or confirm robots behavior only after live QA is green.

### OG Image Production

- [ ] Produce `public/assets/brand/og-image.png` at `1200x630`.
- [ ] Keep source design/export notes near brand assets.
- [ ] Verify text remains legible when rendered at small preview sizes.
- [ ] Confirm image alt text is descriptive and not keyword-stuffed.
- [ ] Confirm file size is reasonable for social preview loading.

### Live Deployment Verification

- [ ] Confirm production URL loads over HTTPS.
- [ ] Confirm no deployment preview URL is accidentally used as canonical.
- [ ] Confirm title and description in browser devtools for homepage and core routes.
- [ ] Confirm favicon appears in browser tab and bookmark contexts.
- [ ] Confirm OG/Twitter card previews with platform/debug tools where available.
- [ ] Confirm all primary navigation links work on the live site.
- [ ] Confirm no 404s for brand assets, OG image, resumes, or generated project routes.
- [ ] Confirm mobile live view does not regress from responsive QA.
- [ ] Update docs with final launch URL and deployment notes.

## Launch Notes Template

Use this once deployment is complete:

```md
## Launch Notes

- Launch URL:
- Deployment platform:
- Deployment date:
- Commit or build reference:
- Metadata status:
- OG image status:
- Favicon status:
- Known post-launch follow-ups:
```

## Handoff Notes

- Deployment should happen only after QA, accessibility, responsive, and performance checks are acceptable.
- This session currently defines the launch metadata plan only. No app code has been edited for metadata yet.
- Final canonical URL is the main blocker for complete metadata implementation.
