# Session 04: Information Architecture

Status: Complete

## Goal

Define page structure, section order, navigation, and role-specific journeys.

## Inputs

- Content inventory
- [North Star](../strategy/north-star.md)
- [Validated Decisions](../strategy/validated-decisions.md)

## Deliverables

- Homepage section order: complete
- Deep-dive page map: complete
- Role-specific content ordering: complete
- Navigation model: complete
- CTA strategy: complete
- Content priority rules: complete

## Tasks

- [x] Define homepage sequence
- [x] Define deep-dive pages
- [x] Map recruiter journey
- [x] Map engineer journey
- [x] Map leader journey
- [x] Map explorer journey
- [x] Define navigation model
- [x] Define CTA strategy
- [x] Define content priority rules

## IA Principle

The portfolio should feel like a premium professional product, not a resume dump. The homepage should establish identity, credibility, and curiosity quickly, then route visitors into deeper proof through role lenses, case files, credentials, timeline, and resume/document surfaces.

Role selection is a soft lens, not a gate. Every visitor can still browse the full site, but selected role context should change ordering, highlights, microcopy, and CTA emphasis.

## Homepage Sequence

1. Cinematic hero
   - Primary job: establish Nirmal Kumar as a data engineer with hybrid software/product depth.
   - Use canonical headline: "Data Engineer building Fabric lakehouses, Databricks data products, and proof-backed BI systems."
   - Support with a restrained proof strip: Microsoft Fabric, Databricks, SQL/PySpark, Power BI, governance, BI trust.
   - Primary CTA: "View Proof"
   - Secondary CTA: "Download Resume"

2. Soft role gateway
   - Primary job: let visitors choose Recruiter, Engineer, Leader, or Explorer without blocking the page.
   - Default state should remain balanced.
   - Role choice should update featured proof, project order, CTA labels, and suggested next steps.
   - Role control should remain available later as a subtle persistent lens switcher.

3. Proof graph preview
   - Primary job: introduce the portfolio's distinctive credibility system.
   - Start with three graph clusters:
     - Data Engineering: Fabric lakehouse, SQL/Spark quality, telecom Fabric PoC, Fabric and Databricks credentials.
     - BI Trust: BI modernization, validation work, 15+ reports, 90% discrepancy reduction, 6 Tableau migrations.
     - Governed Data Product Builder: iCORE, Databricks Apps, Unity Catalog, RBAC, audit logging, stewardship.
   - Keep credentials as support nodes rather than the center.
   - Link to full proof graph or relevant case files once implemented.

4. Featured project case files
   - Primary job: turn abstract skills into inspectable work.
   - Default order:
     1. iCORE Enterprise MDM / Entity Resolution Platform
     2. Tier-1 European Telecom Fabric Migration PoC
     3. BI Migration, Validation And Analytics Delivery
   - Supporting carousel/list order:
     4. IEEE Research
     5. FabCon25 Talk to Your Data Demo
     6. Insurance Analytics PoC
     7. VITAC
   - Each card should show project type, one-sentence value, proof points, stack tags, and sensitivity status if relevant.

5. Skill clusters by evidence
   - Primary job: avoid a flat keyword cloud.
   - Use the priority order from [Skill Clusters](../content/skill-clusters.md).
   - Each cluster should surface "proven by" links to projects, credentials, metrics, or artifacts.
   - Do not promote weak public stats such as GitHub repository count or LeetCode solved count.

6. Career timeline preview
   - Primary job: show momentum from education/research into data engineering delivery and current product ownership.
   - Recommended preview events:
     - B.E. CSE, 9.11/10 CGPA
     - IEEE research publication
     - iLink role start
     - BI migration and validation workstream
     - Telecom Fabric Migration PoC
     - iCORE Enterprise MDM / Entity Resolution Platform
   - Keep exact-date gaps visibly handled as year/month-level records in data, not over-claimed in copy.

7. Certification console preview
   - Primary job: support credibility with verified credentials.
   - Lead with Microsoft Fabric and Databricks credentials.
   - Keep metadata-pending credentials honest until issue dates, expiry dates, IDs, and verification pages are confirmed.
   - CTA: "Inspect Credentials"

8. Future Projects Observatory preview
   - Primary job: show ambition without promising unbuilt work.
   - Use "currently exploring" language.
   - Keep future-facing AI/data-agent content secondary until proof assets are stronger.

9. Social profile dock
   - Primary job: provide trusted external routes.
   - Priority order: LinkedIn, GitHub, Microsoft Learn, Databricks credentials, IEEE, LeetCode.
   - GitHub and LeetCode remain social links, not headline proof metrics.

10. Resume and contact close
   - Primary job: end with clear action.
   - Primary CTA changes by role lens.
   - Default primary CTA: "Download Resume"
   - Default secondary CTA: "Contact Nirmal"
   - Do not publish phone number until explicitly confirmed.

## Deep-Dive Page Map

### `/`

- Homepage experience.
- Contains the role gateway, proof preview, featured projects, preview surfaces, and closing CTAs.
- Should be useful even if a visitor never opens a deep page.

### `/projects`

- Project index.
- Default order follows project priority from Session 03.
- Filters/lenses:
  - Data Engineering
  - Databricks/Product
  - BI Modernization
  - Research/Demo
  - Explorer
- Project cards should expose evidence density, public-safety status, stack, metrics, and primary viewer relevance.

### `/projects/[slug]`

- Case-file page.
- Recommended sequence:
  1. Case-file hero: project title, type, status, dates, sensitivity note, one-line result.
  2. Problem and context.
  3. Architecture and workflow.
  4. Technical decisions.
  5. Proof points and metrics.
  6. Tradeoffs and public-safety boundaries.
  7. Related skills, credentials, and timeline events.
  8. Next project / contact CTA.
- Initial case-file priority:
  1. `icore-enterprise-mdm-entity-resolution`
  2. `telecom-fabric-migration-poc`
  3. `bi-migration-validation-analytics`

### `/proof`

- Full proof graph.
- The graph should connect claims, skills, projects, credentials, metrics, and artifacts.
- Initial clusters:
  - Data Engineer Credibility
  - BI Trust And Modernization
  - Governed Data Product Builder
  - Explorer And Research Signal as a secondary layer
- This page can be added to the North Star page map even though earlier drafts only named the preview.

### `/certifications`

- Credential console.
- Group credentials by Microsoft Fabric, Databricks, analytics, cloud/foundations, and supporting credentials.
- Each credential should show verification status:
  - Verified
  - Metadata pending
  - Needs manual check
- Avoid overstating unverified issue dates or credential IDs.

### `/timeline`

- Career timeline.
- Default chronological path should show education, publication, role start, project workstreams, demos, recognition, and current ownership.
- Allow role lenses to emphasize different event types:
  - Recruiter: work, credentials, recognition
  - Engineer: projects, architecture, technical growth
  - Leader: ownership, outcomes, governance
  - Explorer: education, research, demos, future direction

### `/profile`

- Professional profile.
- Should include canonical bio, role positioning, social links, selected achievements, and public contact strategy.
- Useful as a stable "about" page, not a personality-heavy page.

### `/resume`

- Resume lens.
- Default: one-page recruiter resume.
- Secondary: master resume/proof packet surface when available.
- Role-specific resume emphasis can be added later:
  - Data Engineering
  - BI/Analytics
  - Databricks/Product
  - Leadership/Ownership

### `/documents`

- Document hub for resume downloads, future proof packets, project exports, and credential packets.
- Keep advanced/personalized documents behind a later phase.

### `/future-projects`

- Future Projects Observatory.
- Use "currently exploring" language throughout.
- Prioritize AI-assisted analytics, data-agent, and product-development directions only when they are grounded in evidence, demos, or learning artifacts.
- Keep this page secondary to projects/proof until stronger public artifacts exist.

### `/contact`

- Simple contact surface or anchored section route.
- Public default should be contact form plus LinkedIn.
- Email can be added after confirmation.
- Phone should stay unpublished until explicitly approved.

## Navigation Model

### Primary Navigation

- Work: `/projects`
- Proof: `/proof`
- Timeline: `/timeline`
- Credentials: `/certifications`
- Profile: `/profile`
- Resume: `/resume`

### Utility Navigation

- Contact
- Documents
- Social dock
- Role lens switcher

### Mobile Navigation

- Use a compact menu with the same primary order.
- Keep Resume and Contact reachable without scrolling through every nav item.
- Role lens should be available after initial selection, but it should not dominate the mobile header.

### Footer Navigation

- Repeat primary routes.
- Include social links.
- Include contact/resume actions.
- Include a tiny craft note only if it stays restrained and avoids over-explaining the internal dossier concept.

## Role-Specific Journeys

### Recruiter Journey

Primary question:

> Is Nirmal a credible fit for data engineering roles, and can I quickly contact or shortlist him?

Recommended journey:

1. Hero headline and proof strip.
2. Recruiter lens card.
3. Featured quantified outcomes.
4. Top three project cards with business-readable summaries.
5. Certification preview.
6. Resume lens.
7. Contact.

Content emphasis:

- Fabric and Databricks credentials.
- Current iLink role and Sep 2024 - Present tenure.
- 3 source systems, 18-24 daily incremental tables.
- 15+ reports validated, 90% discrepancy reduction, 6 Tableau reports migrated.
- 9.11/10 CGPA as early-career support.

Primary CTA:

- Download Resume

Secondary CTAs:

- View Projects
- View Credentials
- Contact Nirmal

### Engineer Journey

Primary question:

> Can Nirmal actually build the systems he claims, and what technical tradeoffs has he handled?

Recommended journey:

1. Hero technical proof strip.
2. Engineer lens card.
3. Proof graph preview.
4. iCORE case file.
5. Telecom Fabric case file.
6. Skill clusters with evidence links.
7. Full proof graph.
8. GitHub/social dock as supplemental context.

Content emphasis:

- PySpark, Spark SQL, SQL, Delta, CDC, SCD Type 2.
- Databricks Apps, SQL Warehouse, Jobs API, Secrets API, Unity Catalog.
- Next.js, TypeScript, Zod, TanStack Query only where they support data workflows.
- Architecture diagrams, tradeoffs, public-safety boundaries, implementation decisions.

Primary CTA:

- Inspect Architecture

Secondary CTAs:

- Open Proof Graph
- View Case Files
- Visit GitHub

### Leader Journey

Primary question:

> Does Nirmal understand ownership, reliability, governance, and business-facing outcomes?

Recommended journey:

1. Hero with outcome-led proof.
2. Leader lens card.
3. Governed Data Product Builder proof graph cluster.
4. BI Trust case summary.
5. iCORE governance/workflow summary.
6. Timeline preview showing progression and recognition.
7. Contact.

Content emphasis:

- Governance, stewardship, auditability, RBAC, approval chains, decision lineage.
- Validation-first modernization and discrepancy reduction.
- Ownership across product workflows and data orchestration.
- Executive-facing demo range through FabCon25 once proof assets are confirmed.

Primary CTA:

- View Impact

Secondary CTAs:

- Review Case Files
- Download Resume
- Contact Nirmal

### Explorer Journey

Primary question:

> What is the full arc behind Nirmal's work, interests, and future direction?

Recommended journey:

1. Cinematic hero.
2. Explorer lens card.
3. Timeline preview.
4. Future Projects Observatory preview.
5. IEEE research and FabCon25 demo.
6. Supporting project cards.
7. Social dock.

Content emphasis:

- Hybrid path across data engineering, analytics, data agents, research, and product engineering.
- IEEE publication and research discipline.
- FabCon25 and AI-assisted analytics as future-facing signals.
- "Currently exploring" language for future projects.

Primary CTA:

- Explore Timeline

Secondary CTAs:

- View Future Projects
- Read Research Proof
- Open Social Links

## CTA Strategy

### Global CTA Hierarchy

1. Resume/download action for fast professional conversion.
2. Proof/case-file action for credibility inspection.
3. Contact action for conversion.
4. Social action for external verification.

### Default CTA Labels

- View Proof
- Download Resume
- View Projects
- Inspect Credentials
- Contact Nirmal

### Role CTA Labels

| Lens | Primary CTA | Secondary CTA | Tertiary CTA |
|---|---|---|---|
| Recruiter | Download Resume | View Credentials | Contact Nirmal |
| Engineer | Inspect Architecture | Open Proof Graph | View Case Files |
| Leader | View Impact | Review Case Files | Contact Nirmal |
| Explorer | Explore Timeline | View Future Projects | Open Social Links |

### CTA Placement Rules

- Hero must have no more than two visible CTAs.
- Each major homepage section should have one clear next action.
- Project cards should link to case files, not generic contact.
- Credential preview should link to the certification console.
- Resume/contact CTAs should reappear near the page close.
- Avoid making every surface ask for hiring action; proof should do most of the persuasion.

## Content Priority Rules

1. Lead with proof-backed Data Engineering positioning.
2. Use the top three projects as the primary work spine.
3. Keep iCORE prominent but sanitize details until public permission is confirmed.
4. Use the telecom Fabric PoC as the strongest enterprise-scale lakehouse proof.
5. Use BI migration/validation as the strongest quantified business-impact proof.
6. Use certifications as supporting trust, not as the main identity.
7. Use skill clusters only when they connect to evidence.
8. Use research, demos, and future projects as enrichment after core credibility is established.
9. Keep GitHub and LeetCode low-emphasis until stronger public code/coding proof is curated.
10. Do not publish phone number, private client names, private screenshots, internal URLs, credentials, tokens, or sensitive implementation details.
11. Use "currently exploring" for future projects.
12. Prefer specific metrics over generic adjectives.
13. Prefer public-safe diagrams and sanitized architecture over raw internal screenshots.
14. Keep the internal "Cinematic Engineering Dossier" concept implicit in the experience, not heavy public copy.

## Handoff Notes

- Output should guide scaffold and component structure.
- No UI code should be implemented from this session.
- Session 08 should convert this IA into typed route/content records only after aligning with the data models.
- Session 09 role gateway should use the role journey definitions here.
- Session 12 proof graph should use the three primary proof clusters and secondary explorer/research layer.
- Session 15 project case files should use the case-file page sequence here.
- Session 17 resume lens should use the CTA and role-priority rules here.

## Completion Date

2026-05-16
