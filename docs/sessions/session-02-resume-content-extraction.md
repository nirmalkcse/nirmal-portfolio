# Session 02: Resume Content Extraction

Status: Complete

## Goal

Extract structured content from the one-page and master resumes.

## Inputs

- `C:\Users\nirma\Downloads\Nirmal_Kumar_Data_Engineer_Resume_One_Page_v7_revised.docx`
- `C:\Users\nirma\Downloads\Nirmal_Kumar_Data_Engineer_Master_Resume_v7_revised.docx`
- [Source Links](../content/source-links.md)

## Deliverables

- Extracted profile summary
- Skills inventory
- Work history
- Education
- Projects
- Certifications
- Quantified achievements
- Resume download strategy notes

## Dependencies

- Documentation hierarchy complete

## Tasks

- [x] Read one-page resume
- [x] Read master resume
- [x] Extract canonical profile facts
- [x] Identify strongest proof points
- [x] Add unresolved gaps to content notes

## Extraction Date

2026-05-16

## Canonical Profile Facts

- Name: Nirmal Kumar P
- Public display name: Nirmal Kumar
- Location: Chennai, India
- Primary headline: Data Engineer | Microsoft Fabric & Databricks | SQL, PySpark, Power BI
- Stronger portfolio headline option: Data Engineer building Fabric lakehouses, Databricks data products, and proof-backed BI systems.
- Current role: Software Engineer Trainee, Data Engineering & Product Development at iLink Systems
- Current tenure: Sep 2024 - Present
- Education: Bachelor of Engineering in Computer Science and Engineering, Sathyabama Institute of Science and Technology, 2024
- CGPA: 9.11/10
- Contact facts present in the one-page resume: email and phone. Confirm phone visibility before using it on the public site.
- Public links: LinkedIn, GitHub, LeetCode, Microsoft Learn credentials, Databricks credential, IEEE article.

## Profile Summary Draft

Nirmal Kumar is a data engineer focused on Microsoft Fabric and Databricks lakehouse delivery across ingestion, CDC/SCD Type 2, validation, BI migration, and data-product workflows. His strongest current proof is enterprise-style implementation work: telecom Fabric migration assets for 3 source systems and 18-24 daily incremental tables, BI validation that reduced report discrepancies by 90%, Tableau-to-Power BI migrations, and a Databricks-hosted MDM/entity-resolution product built with Next.js, TypeScript, Databricks Apps, SQL Warehouse, Unity Catalog, and Delta control tables.

## Skills Inventory

### Platforms And Storage

- Microsoft Fabric: Lakehouse, Warehouse, Data Factory pipelines, OneLake
- Databricks: Apps, SQL Warehouse, Jobs API, Secrets API, Unity Catalog
- Delta Lake
- Power BI

### Data Engineering

- SQL
- Spark SQL
- PySpark
- Metadata-driven ETL/ELT
- Medallion Architecture
- Incremental and CDC pipelines
- SCD Type 2
- Schema enforcement
- Data quality and validation

### Analytics And BI

- Semantic modeling
- DAX
- Power Query
- Power BI Report Builder
- KPI modeling
- Tableau-to-Power BI migration
- MicroStrategy validation

### Application And Workflow

- TypeScript
- Next.js
- React
- Zod
- TanStack Query
- REST API routes
- Git/GitHub
- GitHub Copilot
- Copilot Studio
- SSMS

## Work History

### iLink Systems - Software Engineer Trainee, Data Engineering & Product Development

Dates: Sep 2024 - Present

#### iCORE Enterprise MDM / Entity Resolution Platform

Dates: Jan 2026 - Present

- Owns end-to-end development of a Databricks-hosted MDM/entity-resolution product using Next.js 15, TypeScript, Databricks Apps, SQL Warehouse, Jobs API, Secrets API, Unity Catalog, and Delta control tables.
- Re-architected the accelerator from connector-centric workflows into a Master Entity model with reusable connectors, source mappings, canonical attributes, golden records, golden-record history, and resolution templates.
- Built server-side Databricks integration APIs for parameterized SQL execution, notebook/job submission, run status polling, catalog access, secrets-backed credentials, proxy-header auth, RBAC, and audit logging.
- Developed entity-scoped pipeline launch flows passing entity IDs, source mappings, entity names, and column mappings into Databricks orchestration.
- Implemented stewardship and governance workflows for match review, review queues, approval chains, SLA policies, delegation, escalation, overrides, compliance scorecards, evidence packs, and decision lineage.
- Added explainability features including match reasons, score breakdowns, golden-record suggestions, triage guidance, feature-level model configuration, and audit trails for model-backed decisions.
- Designed feature-flagged rollout and migration planning for Master Entity, entity pipelines, adaptive dashboard, and template-library phases.

#### Tier-1 European Telecom Provider - Microsoft Fabric Data Migration PoC

Dates: Oct 2025 - Dec 2025

- Built PoC artifacts for Teradata-to-Microsoft Fabric modernization into Lakehouse/Warehouse architecture.
- Engineered metadata-driven ingestion for 3 source systems: GRASP SFTP, AMDOCS Oracle, and AIDA SFTP.
- Supported roughly 18-24 daily incremental source tables.
- Implemented Bronze/Silver/Gold processing using Fabric Data Factory pipelines, PySpark, SQL notebooks, Delta tables, and dual-Lakehouse/single-Warehouse architecture.
- Developed SCD Type 2 historization with MD5 hash-based CDC, rec_start/rec_end validity windows, active/deleted status tracking, and optimized unchanged-record handling.
- Processed Gzip text/CSV, pipe-delimited CSV, and Binary JSON sources using regex parsing, JSON flattening, schema correction, UTF-8 standardization, and table normalization.
- Refactored Teradata/BTEQ procedural logic into Fabric SQL/PySpark patterns using CTEs, temp tables, MERGE statements, and orchestration-level error handling.
- Created Subject Area and Solution Mart transformations for Contract, Subscription, Product Instance, IMSI/ICCID, Gross Adds, and Churn reporting logic.
- Designed validation-ready stages for Landing, Transformation, Validation, and Gold loading with idempotent and retry-friendly execution.

#### BI Migration, Validation And Analytics Delivery

Dates: Sep 2024 - Sep 2025

- Validated 15+ MicroStrategy-to-Fabric reports for a Middle East manufacturing client using SQL regression checks, Gold-to-BI comparisons, and Power BI Report Builder layout/data validation.
- Reduced validation discrepancies by 90%.
- Migrated 6 Tableau reports to Power BI for beverage and life sciences clients, rebuilding semantic models, relationships, hierarchies, DAX measures, calculations, report layouts, and accessibility/usability checks.
- Built an insurance analytics PoC with synthetic datasets, semantic models, Power Query/DAX transformations, in-report Copilot, verified response patterns, prompt libraries, and a parameterized SQL data agent.
- Built the FabCon25 Europe 2025 Talk to Your Data demo integrating Lakehouse data, semantic models, Power BI Chat with Data, in-report Copilot, Data Agent RCA, Copilot Studio orchestration, and JIRA MCP incident context.
- Contributed to a team solution recognized by senior company and Microsoft leadership for applied Microsoft Fabric, Power BI, Copilot, and data-agent capabilities.
- Performance ratings improved from 4.4/5 to 4.8/5, with Outstanding performance ratings noted in the master resume.

## Projects

### iCORE Enterprise MDM / Entity Resolution Platform

- Type: data product / MDM / entity resolution / governance workflow
- Stack: Databricks Apps, Next.js 15, TypeScript, Databricks SQL Warehouse, Jobs API, Secrets API, Unity Catalog, Delta control tables, React, Zod, TanStack Query
- Proof value: strongest software-plus-data engineering story; suitable for project case file, proof graph, and architecture storyboard.

### Tier-1 European Telecom Fabric Migration PoC

- Type: enterprise data migration / Fabric lakehouse modernization
- Stack: Microsoft Fabric, Data Factory pipelines, PySpark, SQL notebooks, Delta tables, Lakehouse, Warehouse
- Proof value: strongest scale and data-engineering credibility story, especially for recruiters and senior engineers.

### BI Migration, Validation And Analytics Delivery

- Type: BI modernization / validation / report migration
- Stack: Fabric, SQL, Power BI, Report Builder, DAX, Power Query, Tableau, MicroStrategy
- Proof value: strongest measurable business outcome because it includes 15+ reports, 90% fewer discrepancies, and 6 report migrations.

### IEEE Research - Semiconductor Chip Analysis Using Medallion Architecture

- Type: research publication / analytics design
- Stack: Microsoft Fabric, Power BI, Medallion Architecture
- Proof value: credibility artifact for research, architecture thinking, and early Fabric/Power BI specialization.
- Public link: `https://ieeexplore.ieee.org/document/10544873`

### VITAC - Skincare Market Analysis

- Type: analytics project / market analysis
- Stack: Microsoft Fabric, Azure Data Factory, Power BI
- Methods: TAM/SAM/SOM, SCQA, Pyramid Principle
- Proof value: useful for leader/explorer view; shows business framing and structured insight communication.

## Certifications

- Microsoft Certified: Fabric Data Engineer Associate (DP-700)
- Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)
- Databricks Certified Data Engineer Associate
- Databricks UC Upgrade Delivery Specialization
- Databricks Accredited Databricks Fundamentals
- Microsoft GitHub Copilot
- Google Data Analytics Professional Certificate
- Oracle Cloud Infrastructure Foundations Associate

Credential links currently captured in `docs/content/source-links.md`. Verification pages should be checked again during Session 03 or Session 14 because Microsoft Learn and Accredible/Databricks pages did not expose all credential details through static HTML in this extraction pass.

## Quantified Achievements

- 3 telecom source systems supported in Fabric migration PoC.
- 18-24 daily incremental source tables supported.
- 15+ MicroStrategy-to-Fabric reports validated.
- 90% reduction in report discrepancies.
- 6 Tableau reports migrated to Power BI.
- Performance rating improvement from 4.4/5 to 4.8/5.
- 9.11/10 undergraduate CGPA.

## Strongest Proof Points

1. Enterprise Fabric migration work: metadata-driven ingestion, medallion processing, CDC/SCD2, JSON flattening, schema correction, and legacy Teradata/BTEQ refactoring.
2. Databricks-hosted iCORE data product: combines data engineering, product engineering, governance, APIs, RBAC, audit logging, pipeline orchestration, and explainable entity resolution.
3. BI validation and migration: measurable 90% discrepancy reduction, 15+ validated reports, and 6 Tableau-to-Power BI migrations.
4. Credential stack: Microsoft Fabric, Databricks, GitHub Copilot, Google analytics, and Oracle Cloud credentials.
5. Research signal: IEEE semiconductor chip analytics article using Medallion Architecture, Microsoft Fabric, and Power BI.

## Role Fit Signals

### Recruiter

- Clear Data Engineer positioning.
- Microsoft Fabric and Databricks certifications.
- Quantified report validation and migration outcomes.
- Current enterprise delivery experience.
- Resume download should prioritize the one-page version.

### Engineer

- Strong technical depth in PySpark, SQL, CDC, SCD2, Delta, Fabric pipelines, Databricks APIs, Unity Catalog, and product architecture.
- iCORE and telecom PoC should become deep case files with architecture diagrams.

### Leader

- Owns end-to-end development, governance workflows, validation systems, rollout planning, and measurable quality improvement.
- Business-friendly proof comes from telecom migration, manufacturing validation, and BI migration outcomes.

### Explorer

- Hybrid path across data engineering, analytics, AI/data agents, product engineering, certifications, and research.
- Future Projects Observatory can build from this mix without overpromising.

## Resume Download Strategy Notes

- Default recruiter download: one-page resume.
- Deep-dive/proof packet source: master resume.
- Use the one-page summary for fast role fit and CTA copy.
- Use the master resume for project detail drawers, proof graph evidence, timeline events, and role-specific document packets.
- Confirm whether to publish phone number. Email can be used if the user confirms public contact preference; otherwise use a contact form or mailto hidden behind a CTA.

## Public Source Check

Checked on 2026-05-16:

- GitHub profile resolves at `https://github.com/nirmalkcse`. Public API showed 1 public repository, `Align`, using JavaScript, last pushed 2026-03-10. Treat GitHub as a social/profile link for now; do not make it a headline proof point until project repositories are curated.
- LeetCode profile resolves through GraphQL for username `nirmalkcse`. It showed 10 accepted problems, all Easy, and no badges. Include as a social dock link only; do not emphasize as a proof metric yet.
- LinkedIn public page returned a request-denied response without authenticated browser access. Keep as a primary social link, but verify profile headline manually later.
- Microsoft Learn credential URLs returned generic profile shells in static HTML. Keep credential claims from resumes for now and verify metadata during credential-console work.
- Databricks/Accredible credential URL returned a JS app shell in static HTML. Keep credential claim from resumes and verify through browser rendering or manual review in the credential-console session.

## Unresolved Gaps For Session 03

- Decide canonical public contact method: direct email, contact form, resume-only email, or both.
- Confirm whether the phone number from the one-page resume should appear anywhere public.
- Verify exact issue dates, expiration dates, and credential IDs for Microsoft, Databricks, Google, Oracle, and GitHub Copilot credentials.
- Confirm whether iCORE can be described publicly by name and whether client/telecom details need anonymization.
- Collect links, screenshots, repo visibility, or sanitized media for iCORE, Fabric PoC, BI migration, insurance PoC, FabCon25 demo, IEEE article, and VITAC.
- Decide whether GitHub `Align` should become a project case file or remain only a public profile link.
- Add any missing public profiles: Kaggle, Hugging Face, Medium, Dev.to.
- Confirm the preferred short bio tone before public copy is finalized.

## Learnings Captured

- Best public headline: Data Engineer building Fabric lakehouses, Databricks data products, and proof-backed BI systems.
- Strongest skills: Microsoft Fabric, Databricks, SQL, PySpark, CDC/SCD2, semantic modeling, Power BI, and TypeScript/Next.js for data products.
- Strongest achievements: 3 source systems, 18-24 daily incremental tables, 15+ reports validated, 90% fewer discrepancies, 6 Tableau reports migrated, performance rating improvement from 4.4/5 to 4.8/5, and 9.11/10 CGPA.
- Role fit signals: recruiters need quantified outcomes and certifications; engineers need architecture and implementation depth; leaders need ownership, governance, and business impact; explorers need the hybrid arc.

## Handoff Notes

- Output should feed Session 03 content inventory.
- Session 03 should convert this extraction into structured content docs and draft data objects aligned with `docs/content/data-models.md`.
- Prioritize iCORE, Fabric telecom PoC, BI validation/migration, certifications, and IEEE research as the first proof graph candidates.
- Keep weak or immature public stats, especially GitHub follower counts and LeetCode solved count, out of premium hero copy.
