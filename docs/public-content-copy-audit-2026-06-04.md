# Public Content Copy Audit - June 4, 2026

## Scope

This audit reviews the public-facing wording across the portfolio routes:

- `/` Home
- `/proof` Skills
- `/projects` Project case studies and project detail pattern
- `/certifications` Credentials
- `/timeline` Timeline
- `/future-projects` Current Learning
- `/resume` Resume
- `/documents` Documents
- `/profile` Contact/Profile
- Shared navigation, footer, social/status language

The site copy is honest and generally grounded in real work, but it currently reads too much like an internal evidence-management tool. Public readers need fewer internal labels and more plain descriptions of what Nirmal did, what changed, and what can be verified.

## Research Basis

Key guidance used:

- Digital.gov plain-language guidance: write for the reader, focus on what users want to know, and avoid mixing audiences in a way that makes content harder to find. Source: https://digital.gov/guides/plain-language/principles/write-for-reader
- UC Davis Career Center: accomplishment statements should use action, context, and results; they should provide proof of relevant skills and quantify results where possible. Source: https://careercenter.ucdavis.edu/resumes-and-materials/resumes/accomplishment-statements
- Oregon State Career Development Center: resumes should connect experiences and skills to the role, use action/result language, avoid jargon where possible, and quantify only when appropriate. Source: https://career.oregonstate.edu/resumes-cvs-cover-letters/resumes
- NSW Digital Design System: status labels should be short, scannable, close to the item, and preferably adjectives rather than action-like wording. Source: https://designsystem.nsw.gov.au/components/status-labels/index.html
- Scottish Government Design System: status tags should be used only for state, kept as short as possible, and not overused because too many tags increase cognitive load. Source: https://designsystem.gov.scot/components/status-tag
- Indeed certification guidance: list relevant certifications, write acronyms out at least once, include dates and expiry when applicable, and for in-progress certifications use an expected completion date. Source: https://www.indeed.com/career-advice/resumes-cover-letters/list-certifications-on-a-resume
- Microsoft Fabric documentation: lakehouse language is legitimate for a Fabric audience, but public copy should define it in plain terms when it is central. Source: https://learn.microsoft.com/en-gb/fabric/data-engineering/lakehouse-overview
- Databricks best practices documentation: Git, modular code, jobs, testing, and CI/CD are credible engineering signals when tied to actual implementation rather than listed as loose buzzwords. Source: https://docs.databricks.com/aws/en/notebooks/best-practices

## Public Copy Principles

Use this hierarchy for every page:

1. Audience first: recruiter, hiring manager, engineer, or reviewer.
2. Plain claim: what Nirmal can do.
3. Concrete context: where or on what type of work.
4. Measured result or visible artifact.
5. Status only when the reader needs it.

Prefer:

- "Built validation workflows for a Microsoft Fabric migration covering 3 source systems and 18-24 daily incremental tables."
- "Validated 15+ BI reports and reduced discrepancy count by 90%."
- "Public link needed" for missing credential URLs.
- "Private project summary" for client-sensitive work.
- "Planned export" for future PDFs or packets.

Avoid:

- "Proof engine"
- "Evidence graph"
- "Resume claimed"
- "Pending verification"
- "Not generated"
- "Concept only"
- "Summarized from internal work"
- "Confidentiality boundary"
- "Evidence candidate"
- "Deserves more weight"
- "Medium fit" as a public-facing quality label

These phrases are truthful internally, but they make the portfolio feel unfinished or defensive to outside readers.

## Recommended Status Vocabulary

Use fewer statuses. Put longer explanation in detail text, not in badges.

| Current wording | Public replacement | Use when |
|---|---|---|
| Verified | Verified | Public link exists and current status is clear |
| Verified, expired | Expired | Credential page exists but credential is no longer current |
| Resume claimed | Listed on resume | The item appears in resume, but public URL is not attached |
| Public verification URL pending | Public link needed | The claim is acceptable but missing a public verifier |
| Pending | Planned or Link needed | Use "Planned" for future artifact, "Link needed" for missing URL |
| Not generated | Planned export | A future file is mapped but not available |
| Concept only | Planned packet | A future bundle is planned |
| Summarized from internal work | Private project summary | Work exists but details are confidential |
| Confidentiality boundary | Client details anonymized | Public explanation of privacy constraint |
| Indirectly supported | Supporting link | A link supports the context but is not a direct credential proof |

Credential-specific rule:

- Completed and current: "Verified"
- Completed but expired: "Expired"
- Completed but no public URL: "Listed on resume" plus body copy "Public verification link needed"
- Studying or not completed: only show if actively in progress and include "Expected Month YYYY"
- No date, no URL, no proof: hide from primary cards or move into "Additional items to verify"

## Global Findings

### P0 - Too Much Internal Status Language

The site repeatedly exposes private workflow words: "pending", "resume-claimed", "internal work", "evidence candidate", "not generated", and "confidentiality boundary". This is the highest risk because it reduces perceived polish and may make valid accomplishments feel uncertain.

Recommendation:

- Replace internal workflow terms with public-safe status labels.
- Move details like "source captured locally" or "manual verification needed" out of public body copy.
- Use one short status label per item, not several stacked labels.

### P0 - Credential Wording Needs a Trust Pass

Credentials are important, but the current page overexplains verification mechanics. "Resume claimed" sounds like a warning label. "Pending" appears too often. "Verified, expired" combines a positive and negative state in one badge.

Recommendation:

- Lead with current verified credentials.
- Show expired credentials as "Expired", not "Verified, expired".
- Put missing URLs in a separate "Public link needed" group.
- If dates are unknown, say "Date not shown" rather than "Pending" unless a specific verification process is underway.

### P1 - Strong Work Is Hidden Under Jargon

The strongest claims are real: 3 source systems, 18-24 daily incremental tables, 15+ reports, 90% discrepancy reduction, 6 Tableau reports migrated, Databricks MDM/entity resolution. These should be the core story. Right now, many sentences are stacked with platform terms before the human outcome.

Recommendation:

- Start sentences with the work/result, then name the technologies.
- Define "lakehouse", "semantic model", "CDC/SCD Type 2", "golden record", and "entity resolution" once in reader-friendly language.
- Use technical details deeper in project pages, not in every summary card.

### P1 - Repetition of "Evidence"

"Evidence" is useful, but overused. It appears across Home, Skills, Projects, Timeline, Resume, Documents, and Profile. The repetition makes the site feel like it is defending itself.

Recommendation:

- Use "work", "case studies", "results", "credentials", "links", "artifacts", "examples", and "supporting details" depending on context.
- Keep "evidence" mainly for the Skills page or a single verification section.

## Page-by-Page Audit

## Home `/`

Current strengths:

- The hero positions Nirmal clearly as a Data Engineer.
- The top metrics are strong and scannable.
- The three featured case studies are the right professional anchors.

Problem lines found in rendered copy:

- "PROOF ENGINE"
- "Project files show role, stack, decision path, outcome, and confidentiality boundary."
- "Four core clusters. One evidence system."
- "Fabric and Databricks credentials are shown alongside the work they support, with pending items labeled honestly."
- "Captured links, resume-claimed items, and pending verification stay visible instead of being hidden."
- "Resume claimed / public link pending"

Why this hurts:

- "Proof engine" is clever but unnatural for recruiters.
- "Confidentiality boundary" sounds legal/internal.
- "Resume claimed" makes the reader doubt the claim.
- "Pending verification" on the homepage highlights incompleteness too early.

Recommended direction:

- Hero eyebrow: "Data Engineering Portfolio" is fine.
- Replace "Proof engine" with "What to review" or "Portfolio map".
- Replace "One evidence system" with "Skills tied to shipped work".
- Replace credential homepage copy with: "Credentials are grouped by verified, expired, and public-link-needed status."
- Hide "resume claimed" from the homepage entirely.

Example rewrite:

Current:
"Building reliable data systems from messy enterprise context, with Microsoft Fabric, Databricks, SQL, PySpark, Power BI, and validation-led migration work."

Recommended:
"Data Engineer building Fabric, Databricks, SQL, PySpark, and Power BI systems for migration, validation, and reporting trust."

Current:
"Captured links, resume-claimed items, and pending verification stay visible instead of being hidden."

Recommended:
"Verified credentials, expired credentials, and items needing public links are separated clearly."

## Skills `/proof`

Current strengths:

- The page correctly maps skills to projects, metrics, credentials, and artifacts.
- It is useful for technical reviewers.

Problem lines:

- "EVIDENCE GRAPH"
- "A structured view of skill areas, projects, credentials, metrics, and evidence still being collected for public review."
- "NODES / EDGES / STRONG EVIDENCE / EVIDENCE GAPS"
- "Capability claim / Field evidence / Evidence support"
- "medium" repeated on cards
- "Approved public diagram still pending."
- "Captured and pending verification cleanup."

Why this hurts:

- The graph language is system-internal.
- "Nodes" and "edges" are not useful for a recruiter.
- "Medium" reads like the site is grading Nirmal's skills as average.
- "Evidence gaps" foregrounds weakness.

Recommended direction:

- Rename page heading from "Skills mapped to the work that demonstrates them" to "Skills backed by project work."
- Replace "Evidence graph" with "Skills by proof area" only if keeping the proof metaphor, or better "Skill map".
- Replace "medium" with "Supporting", "Core", or hide strength labels on public cards.
- Replace "Evidence gaps" with "Links to add" or remove from public display.

Example rewrite:

Current:
"A structured view of skill areas, projects, credentials, metrics, and evidence still being collected for public review."

Recommended:
"A practical map of the skills used across Fabric migration, Databricks product work, BI validation, credentials, and public references."

Current:
"Nirmal can build and validate modern lakehouse data systems in Microsoft Fabric and Databricks."

Recommended:
"Nirmal builds and validates Microsoft Fabric and Databricks data systems, from ingestion and transformation to BI-ready outputs."

## Projects `/projects`

Current strengths:

- The page has the right structure: problem, system, impact.
- The top three projects are correctly prioritized.
- Metrics are strong.

Problem lines:

- "Each study follows the same spine..."
- "confidentiality boundary"
- "SUMMARIZED FROM INTERNAL WORK"
- "CONFIDENTIALITY BOUNDARY"
- "PENDING / ANALYTICS PROJECT / MARKET ANALYSIS"
- "PENDING REVIEW / BACKLOG CANDIDATE / PUBLIC REPOSITORY"
- "Stack review pending"

Why this hurts:

- "Spine" is design-process language.
- "Internal work" and "confidentiality boundary" make the work sound unapproved or risky.
- Weak projects such as GitHub Align should not appear at the same visual level as enterprise projects.

Recommended direction:

- Use "Client details anonymized" once per relevant project.
- Use "Private project summary" instead of "Summarized from internal work".
- Move "GitHub Align" out of the main project list until it has a real case-study angle.
- Remove "Pending" dates from project cards. If date unknown, omit date.

Example rewrite:

Current:
"Each study follows the same spine: problem, system, decisions, outcome, and the confidentiality boundary around what can be shown."

Recommended:
"Each case study explains the problem, build approach, decisions, outcome, and what can be shared publicly."

Current:
"Strongest product-engineering evidence; demonstrates ownership across APIs, orchestration, governance workflows, audit logging, RBAC, and explainable decisions."

Recommended:
"Strongest product-engineering case: owned API workflows, Databricks orchestration, governance controls, audit logging, RBAC, and explainable decisions."

## Project Detail Pages `/projects/[slug]`

Current strengths:

- Detail pages have enough material for serious review.
- The structure supports deeper technical readers.

Problems:

- Too many internal labels appear: evidence notes, source, public status, confidence, confidentiality boundary.
- Some pages are more about what cannot be shown than what was done.
- The action "Open case study" appears even when the case study is already open.

Recommended direction:

Use a simple public case-study format:

1. Overview
2. Problem
3. What I built
4. Decisions
5. Result
6. Tools
7. What is public

Status panel replacement:

- Current: "Summarized from internal work"
- Replace with: "Private project summary"
- Current: "Confidentiality boundary"
- Replace with: "Client details anonymized"

## Credentials `/certifications`

Current strengths:

- Separating verified and unverified items is correct.
- Issued/expiry dates are valuable when known.
- Direct verification actions are useful.

Problem lines:

- "direct verification actions separated from resume-claimed items"
- "PENDING URLS"
- "VERIFIED, EXPIRED"
- "INDIRECTLY SUPPORTED"
- "RESUME CLAIMED"
- "Pending" repeated for issue and expiry dates
- "Reference pending"

Why this hurts:

- "Resume claimed" reads accusatory.
- "Pending" repeated 15 times makes the credential area look incomplete.
- "Indirectly supported" is vague.
- "Verified, expired" is cognitively messy.

Recommended public statuses:

- "Verified" for current public credential URL.
- "Expired" for expired credential.
- "Public link needed" for completed credentials with no public URL.
- "Date not shown" for unknown issue/expiry date.
- "Listed on resume" only in body copy, not as a badge.

Recommended page structure:

1. Current verified credentials
2. Expired or historical credentials
3. Items needing public links
4. Related skills/projects

Example rewrite:

Current:
"A compact credential dashboard for Fabric, Databricks, analytics, and cloud credentials, with direct verification actions separated from resume-claimed items."

Recommended:
"A credential overview for Fabric, Databricks, analytics, and cloud learning, with public verification links shown wherever available."

Current:
"Resume claimed; public verification URL pending."

Recommended:
"Listed on resume. Public verification link still needed."

Current:
"Verified, expired"

Recommended:
"Expired"

Important note:

As of June 4, 2026, the DP-700 card is shown as expired on May 1, 2026. Do not present it as current unless renewed.

## Timeline `/timeline`

Current strengths:

- The timeline is visually and structurally strong.
- It gives chronological context across education, work, certs, projects, and current learning.

Problem lines:

- "Data systems, mapped in motion."
- "Tune the story for the viewer."
- "Evidence lanes"
- "Verification date pending" repeated
- "Resume claimed; public verification URL pending" repeated
- "Links 69" feels inflated and unclear
- "Medium fit" and "high fit" may be useful internally but odd publicly

Why this hurts:

- The timeline should be a chronology, not a verification console.
- Repeated credential warning text distracts from career progression.
- "Mapped in motion" is stylish but not informative.

Recommended direction:

- Keep timeline focused on date, milestone, role, and outcome.
- Move credential verification details back to the Credentials page.
- Replace "high fit / medium fit" with "Core", "Supporting", or remove.
- Replace "Links" with "References" only when actual public references exist.

Example rewrite:

Current:
"A compact career atlas from academic foundations to shipped BI, Fabric, Databricks, and AI/data-agent work."

Recommended:
"A chronological view of education, work, credentials, BI delivery, Fabric migration, Databricks product work, and current learning."

Current:
"Verification date pending"

Recommended:
"Date not shown"

## Current Learning `/future-projects`

Current strengths:

- The page is responsible. It does not overclaim.
- It is good to separate future public artifacts from completed work.

Problem lines:

- "Ambitious directions, grounded by existing work."
- "The page records ambition after evidence has a foothold."
- "Evidence candidate"
- "A track earns more weight only when..."
- "Confidentiality-aware shaping"
- "Why inspect it"

Why this hurts:

- It sounds like an internal editorial system.
- "Ambitious directions" can feel vague.
- "Evidence candidate" is not normal public language.

Recommended direction:

- Rename to "Planned Public Demos" or keep "Current Learning" but make copy more direct.
- Use "planned artifact" instead of "evidence candidate".
- Use "why it matters" instead of "why inspect it".

Example rewrite:

Current:
"A current-learning roadmap for responsible public artifacts."

Recommended:
"A roadmap of planned public demos and write-ups based on current Fabric, Databricks, BI, and data-agent work."

Current:
"Nothing here is presented as shipped until a real case study, demo, or verification asset exists."

Recommended:
"These items are planned, not shipped. Completed work remains in the case studies."

## Resume `/resume`

Current strengths:

- The one-page resume is correctly prioritized.
- The preview is useful.
- The page connects resume to projects and credentials.

Problem lines:

- "Resume lens"
- "story being handed off"
- "role-aware guidance"
- "messy enterprise context"
- "resume claims"
- "Evidence graph"

Why this hurts:

- Recruiters want a fast download and a short reason to trust it.
- "Claims" sounds defensive.
- "Lens" is a UI concept, not a resume concept.

Recommended direction:

- Rename "Resume lens" to "Resume".
- Replace "role-aware recommendation" with "Recommended review path".
- Replace "resume claims" with "resume highlights" or "resume statements".

Example rewrite:

Current:
"A recruiter-friendly resume page for Nirmal Kumar: immediate one-page download, master resume fallback, role-aware guidance, and a compact preview of the story being handed off."

Recommended:
"Download Nirmal Kumar's one-page Data Engineer resume, with a master resume and project links available for deeper review."

Current:
"Recruiters get the file immediately; engineers and leaders can follow the resume claims into projects, credentials, and the evidence graph."

Recommended:
"Recruiters can download the file immediately; engineers and leaders can review the related projects, credentials, and skill map."

## Documents `/documents`

Current strengths:

- The page is honest about what is available.
- It correctly separates current DOCX downloads from planned exports.

Problem lines:

- "Personalized documents"
- "credential packet concept"
- "project export queue"
- "Real downloads stay real; planned exports stay labeled until generated."
- "Pending exports"
- "Concept only"
- "Concept, not a PDF"
- "Not generated" repeated many times
- "Resume-claimed credential queue"

Why this hurts:

- The page reads unfinished.
- "Not generated" repeated nine times is a strong negative signal.
- A public documents page should mostly show available downloads.

Recommended direction:

- Rename to "Resume and Documents".
- Put available downloads first.
- Collapse planned exports into one "Planned documents" section.
- Do not show repeated "Not generated" cards.

Example rewrite:

Current:
"A document hub for Nirmal Kumar: recruiter handoff, master resume source, credential packet concept, and project export queue."

Recommended:
"Download the current resume files. Planned credential and case-study packets will be added after public assets are approved."

Current:
"No credential packet download is exposed because certificate thumbnails and several public verification URLs are still pending."

Recommended:
"Credential packet planned. For now, use the credential page for live verification links."

## Profile `/profile`

Current strengths:

- This is one of the better pages.
- The profile summary is clear and human.
- Metrics are strong.

Problem lines:

- "quiet engineering work" may be too poetic for first-screen professional copy.
- "Evidence graph"
- "manual profile verification pending"
- "exact publication metadata still pending"
- "role lens" repeated

Why this hurts:

- Contact/Profile should be confident and simple.
- Internal verification notes should not appear near social links.

Recommended direction:

- Keep the profile human, but reduce abstraction.
- Hide manual verification notes from public UI.
- Replace "View evidence" with "View projects" or "View skills".

Example rewrite:

Current:
"Nirmal Kumar cares about the quiet engineering work that makes data useful..."

Recommended:
"Nirmal Kumar builds data systems that make migration, reporting, and validation easier to trust."

Current:
"Primary professional social link; manual profile verification pending."

Recommended:
"LinkedIn profile"

## Navigation And Footer

Current route labels are mostly good:

- Skills
- Work
- Credentials
- Timeline
- Learning
- Resume
- Docs
- Contact

Route descriptions should be less internal:

- Skills current: "Skills mapped to projects, metrics, credentials, and evidence still being collected."
- Skills recommended: "Skills connected to project work, credentials, and measurable outcomes."

- Credentials current: "Credential verification with clear status labels and public links where available."
- Credentials recommended: "Credentials grouped by public verification status."

- Documents current: "Resume downloads, supporting packets, and planned case-study exports."
- Documents recommended: "Resume downloads now, planned packets clearly marked."

## Technical Jargon Review

Keep, but define once:

- Microsoft Fabric
- Databricks
- Lakehouse
- Warehouse
- PySpark
- SQL
- Power BI
- Delta tables
- Semantic model

Use carefully:

- CDC/SCD Type 2: define as change tracking and history management.
- Medallion Architecture: define as Bronze/Silver/Gold data layers.
- MDM/entity resolution: define as matching and managing records for the same real-world entity.
- Golden records: define as trusted master records.
- RBAC: spell out as role-based access control.
- Auditability: replace with "reviewable decisions" or "traceable changes" in public summaries.
- Data agent: use "analytics agent" or "data question-answering workflow" unless the page defines it.
- MCP: avoid unless this is specifically for an engineer audience.

Avoid in top-level copy:

- Governance workflows
- Stewardship
- Explainability
- Auditability
- Evidence packs
- Decision lineage
- Validation-ready stages
- BI-serving layers
- Role lens
- Proof engine

These can appear deeper on technical pages after the plain explanation.

## Suggested Rewrite Architecture

### First Screen Standard

Every page should answer:

1. What is this page?
2. Why should I trust it?
3. What should I click next?

### Project Card Standard

Use this pattern:

- Title
- Date/status
- One plain result sentence
- Three technology tags
- One public note if needed: "Client details anonymized"

### Credential Card Standard

Use this pattern:

- Credential title
- Issuer
- Status: Verified / Expired / Public link needed
- Issued/expiry if known
- Button: Verify / Details

### Planned Content Standard

Use this pattern:

- Planned artifact
- Why it matters
- Based on
- Next public asset needed

Do not use:

- Not generated
- Concept only
- Candidate
- Pending export

## Priority Rewrite Queue

### Priority 1

1. Replace all "resume claimed" public text.
2. Replace repeated "pending" labels with "Public link needed", "Date not shown", or "Planned".
3. Simplify Certifications page status system.
4. Remove or collapse repeated "not generated" cards on Documents page.
5. Remove "SUMMARIZED FROM INTERNAL WORK" from Projects cards.

### Priority 2

1. Rename Proof/Evidence-heavy headings to skills/results language.
2. Reduce "evidence" repetition globally.
3. Simplify Timeline status labels.
4. Make Home credentials section less defensive.
5. Define key jargon once per page.

### Priority 3

1. Rework Future Projects into planned public demo language.
2. Clean route descriptions.
3. Reduce role-lens language where it appears as visible copy.
4. Hide internal social-link verification notes from Profile.

## Best Immediate Global Replacements

| Find | Replace |
|---|---|
| Proof engine | Portfolio map |
| Evidence graph | Skill map |
| Evidence system | Work-backed skill map |
| Resume claimed | Listed on resume |
| Public verification URL pending | Public link needed |
| Pending verification | Verification link needed |
| Pending export | Planned export |
| Not generated | Planned |
| Concept only | Planned |
| Summarized from internal work | Private project summary |
| Confidentiality boundary | Client details anonymized |
| Evidence candidate | Planned artifact |
| Medium fit | Supporting |
| High fit | Core |

## Final Judgment

The site has enough substance. The problem is not lack of credibility; it is that the copy exposes too much of the credibility-management machinery. The rewrite should make Nirmal sound less like he is defending every claim and more like he is presenting a clear, truthful professional portfolio.

The strongest public story is:

"Data Engineer building Microsoft Fabric, Databricks, SQL/PySpark, and Power BI systems for migration, validation, and reporting trust. Work includes 3 telecom source systems, 18-24 daily incremental tables, 15+ BI report validations, 90% discrepancy reduction, Tableau-to-Power BI migration, and Databricks product workflows for governed entity resolution."

