# Project Inventory

Status: Canonical draft
Last updated: 2026-05-16
Primary source: [Session 02 Resume Content Extraction](../sessions/session-02-resume-content-extraction.md)

## Priority Order

| Priority | Project | Primary Portfolio Job |
|---:|---|---|
| 1 | iCORE Enterprise MDM / Entity Resolution Platform | Show software-plus-data engineering depth |
| 2 | Tier-1 European Telecom Fabric Migration PoC | Show enterprise Fabric lakehouse credibility |
| 3 | BI Migration, Validation And Analytics Delivery | Show measurable business impact |
| 4 | IEEE Research - Semiconductor Chip Analysis Using Medallion Architecture | Show research and publication proof |
| 5 | FabCon25 Europe 2025 Talk to Your Data Demo | Show AI/data-agent and executive-facing demo range |
| 6 | Insurance Analytics PoC | Show semantic-model and Copilot/data-agent experimentation |
| 7 | VITAC - Skincare Market Analysis | Show business framing and analytics storytelling |

## iCORE Enterprise MDM / Entity Resolution Platform

- Slug: `icore-enterprise-mdm-entity-resolution`
- Status: Current
- Dates: Jan 2026 - Present
- Type: Data product / MDM / entity resolution / governance workflow
- Public sensitivity: Confirm whether the iCORE name and implementation details can be public.
- Summary: Databricks-hosted MDM/entity-resolution product combining Next.js product workflows, Databricks orchestration, governance, stewardship, explainability, and auditability.
- Problem: Enterprise source data needs reusable connectors, mapped canonical entities, governed golden records, review workflows, and traceable entity-resolution decisions.
- Architecture: Next.js 15 and TypeScript application hosted through Databricks Apps, integrating with Databricks SQL Warehouse, Jobs API, Secrets API, Unity Catalog, and Delta control tables.
- Stack: Databricks Apps, Next.js 15, TypeScript, React, Zod, TanStack Query, Databricks SQL Warehouse, Jobs API, Secrets API, Unity Catalog, Delta control tables.
- Decisions: Re-architected from connector-centric workflows into a Master Entity model with reusable connectors, source mappings, canonical attributes, golden records, golden-record history, and resolution templates.
- Tradeoffs: Public case file may need sanitized architecture and anonymized data because the project is current and likely client/internal sensitive.
- Impact: Strongest product-engineering proof point; demonstrates ownership across APIs, orchestration, governance workflows, audit logging, RBAC, and explainable decisions.
- Links: Pending
- Media: Pending screenshots, sanitized UI captures, architecture diagram, workflow diagram
- Related skills: Databricks, SQL Warehouse, Unity Catalog, Delta, TypeScript, Next.js, React, Zod, TanStack Query, RBAC, audit logging, orchestration, governance, entity resolution
- Related credentials: Databricks Certified Data Engineer Associate, Databricks UC Upgrade Delivery Specialization, Databricks Fundamentals, Microsoft Fabric credentials as adjacent proof
- Timeline date: 2026-01
- Viewer priority: Engineer high, leader high, recruiter high, explorer medium

## Tier-1 European Telecom Fabric Migration PoC

- Slug: `telecom-fabric-migration-poc`
- Status: Complete
- Dates: Oct 2025 - Dec 2025
- Type: Enterprise data migration / Fabric lakehouse modernization
- Public sensitivity: Keep client anonymized as "Tier-1 European telecom provider" unless permission is confirmed.
- Summary: Teradata-to-Microsoft Fabric modernization PoC using metadata-driven ingestion, Bronze/Silver/Gold processing, CDC/SCD Type 2, Delta tables, and Lakehouse/Warehouse architecture.
- Problem: Modernize legacy telecom data flows from Teradata/BTEQ and mixed source formats into Microsoft Fabric while preserving validation, retryability, and reporting readiness.
- Architecture: Fabric Data Factory pipelines and notebooks orchestrating source ingestion, landing, transformation, validation, Gold loading, and Warehouse serving across dual Lakehouse/single Warehouse architecture.
- Stack: Microsoft Fabric, Fabric Data Factory, Lakehouse, Warehouse, OneLake, PySpark, Spark SQL, SQL notebooks, Delta tables.
- Decisions: Used metadata-driven ingestion, MD5 hash-based CDC, rec_start/rec_end validity windows, active/deleted tracking, schema correction, UTF-8 standardization, JSON flattening, and idempotent execution patterns.
- Tradeoffs: Detailed source-system names may be acceptable from resume extraction but should still be reviewed before public launch.
- Impact: Supported 3 source systems and roughly 18-24 daily incremental tables; strongest scale and enterprise data-engineering credibility story.
- Links: Pending
- Media: Pending architecture diagram, medallion flow, sanitized validation screenshots
- Related skills: Microsoft Fabric, Data Factory pipelines, PySpark, SQL, Spark SQL, Delta Lake, Medallion Architecture, CDC, SCD Type 2, schema enforcement, data validation
- Related credentials: Microsoft Certified: Fabric Data Engineer Associate, Microsoft Certified: Fabric Analytics Engineer Associate
- Timeline date: 2025-10
- Viewer priority: Recruiter high, engineer high, leader high, explorer medium

## BI Migration, Validation And Analytics Delivery

- Slug: `bi-migration-validation-analytics`
- Status: Complete
- Dates: Sep 2024 - Sep 2025
- Type: BI modernization / validation / report migration
- Public sensitivity: Keep clients anonymized by industry and region unless permission is confirmed.
- Summary: BI modernization and validation work spanning MicroStrategy-to-Fabric validation, Tableau-to-Power BI migration, semantic modeling, report reconstruction, and analytics PoCs.
- Problem: Enterprise reporting migrations need reliable parity checks, semantic model rebuilding, DAX/Power Query transformations, layout validation, and discrepancy reduction.
- Architecture: SQL regression checks, Gold-to-BI comparisons, Power BI Report Builder validation, Power BI semantic models, DAX measures, Power Query transformations, and report rebuild workflows.
- Stack: Microsoft Fabric, SQL, Power BI, Power BI Report Builder, DAX, Power Query, Tableau, MicroStrategy.
- Decisions: Emphasized validation-first migration with SQL regression, BI output comparisons, semantic-model reconstruction, accessibility/usability checks, and layout/data parity.
- Tradeoffs: This is a bundled workstream rather than one single product; case file should group it as a "migration and validation system" to avoid looking scattered.
- Impact: Validated 15+ reports, reduced validation discrepancies by 90%, and migrated 6 Tableau reports to Power BI.
- Links: Pending
- Media: Pending anonymized report thumbnails, validation matrix, before/after report migration story
- Related skills: SQL, Power BI, semantic modeling, DAX, Power Query, Report Builder, Tableau migration, MicroStrategy validation, KPI modeling
- Related credentials: Microsoft Fabric Analytics Engineer Associate, Google Data Analytics Professional Certificate
- Timeline date: 2024-09
- Viewer priority: Recruiter high, leader high, engineer medium, explorer medium

## IEEE Research - Semiconductor Chip Analysis Using Medallion Architecture

- Slug: `ieee-semiconductor-chip-analysis-medallion`
- Status: Published
- Dates: 2024, exact publication metadata pending
- Type: Research publication / analytics design
- Public sensitivity: Public IEEE article.
- Summary: Research artifact using Medallion Architecture, Microsoft Fabric, and Power BI for semiconductor chip analysis.
- Problem: Semiconductor analysis needs structured ingestion, transformation, and insight delivery using a modern data architecture.
- Architecture: Medallion Architecture with Microsoft Fabric and Power BI.
- Stack: Microsoft Fabric, Power BI, Medallion Architecture.
- Decisions: Use as a credibility artifact for architecture thinking, research discipline, and early Fabric/Power BI specialization.
- Tradeoffs: Needs exact publication metadata and citation details before certification-console or publication-card polish.
- Impact: Public research signal and credible external proof point.
- Links: `https://ieeexplore.ieee.org/document/10544873`
- Media: Pending citation card, publication screenshot, DOI metadata if available
- Related skills: Microsoft Fabric, Power BI, Medallion Architecture, research communication
- Related credentials: Microsoft Fabric credentials as adjacent proof
- Timeline date: 2024
- Viewer priority: Explorer high, engineer medium, recruiter medium, leader medium

## FabCon25 Europe 2025 Talk to Your Data Demo

- Slug: `fabcon25-talk-to-your-data-demo`
- Status: Complete
- Dates: 2025, exact event date pending
- Type: AI/data-agent demo / Fabric and Power BI experience
- Public sensitivity: Confirm demo assets and company/client references before public use.
- Summary: Demo integrating Lakehouse data, semantic models, Power BI Chat with Data, in-report Copilot, Data Agent RCA, Copilot Studio orchestration, and JIRA MCP incident context.
- Problem: Show how business users can move from data questions to root-cause and incident context through Microsoft Fabric, Power BI, and agentic workflows.
- Architecture: Fabric Lakehouse and semantic model connected to Power BI conversational surfaces, Copilot Studio orchestration, data-agent RCA, and JIRA MCP incident context.
- Stack: Microsoft Fabric, Power BI, Copilot, Copilot Studio, Data Agent, JIRA MCP.
- Decisions: Position as a demo/proof moment rather than a standalone product until more public media is available.
- Tradeoffs: High signal for AI/data agents, but needs evidence assets before it can carry major homepage weight.
- Impact: Team solution recognized by senior company and Microsoft leadership for applied Fabric, Power BI, Copilot, and data-agent capabilities.
- Links: Pending
- Media: Pending demo screenshots, architecture map, event proof
- Related skills: Fabric, Power BI, semantic modeling, Copilot Studio, data agents, workflow orchestration
- Related credentials: Microsoft Fabric credentials, GitHub Copilot credential as adjacent proof
- Timeline date: 2025
- Viewer priority: Leader high, explorer high, recruiter medium, engineer medium

## Insurance Analytics PoC

- Slug: `insurance-analytics-copilot-data-agent-poc`
- Status: Complete
- Dates: 2025, exact date pending
- Type: Analytics PoC / semantic model / AI-assisted BI
- Public sensitivity: Confirm whether PoC details and visuals can be public.
- Summary: Insurance analytics PoC with synthetic datasets, semantic models, Power Query/DAX transformations, in-report Copilot, prompt libraries, verified response patterns, and a parameterized SQL data agent.
- Problem: Demonstrate trusted analytics experiences where users can ask natural-language questions and receive verifiable, data-grounded answers.
- Architecture: Synthetic data feeding Power BI semantic models and report experiences, paired with prompt libraries, response verification, and parameterized SQL data-agent access.
- Stack: Power BI, Power Query, DAX, SQL, Copilot, data agent patterns.
- Decisions: Use as supporting proof for AI-assisted analytics and semantic-model craft.
- Tradeoffs: Keep below the top three project cards unless strong visuals or demo artifacts are collected.
- Impact: Supports the hybrid story across BI, semantic modeling, and data-agent experimentation.
- Links: Pending
- Media: Pending screenshots, prompt-library sample, response verification example
- Related skills: Power BI, DAX, Power Query, semantic modeling, SQL, data agents, prompt design
- Related credentials: Microsoft Fabric Analytics Engineer Associate, Google Data Analytics Professional Certificate
- Timeline date: 2025
- Viewer priority: Explorer medium, leader medium, recruiter low, engineer low

## VITAC - Skincare Market Analysis

- Slug: `vitac-skincare-market-analysis`
- Status: Complete
- Dates: Pending
- Type: Analytics project / market analysis
- Public sensitivity: Confirm source material and whether project assets can be public.
- Summary: Market analysis project using Microsoft Fabric, Azure Data Factory, and Power BI with TAM/SAM/SOM, SCQA, and Pyramid Principle framing.
- Problem: Translate skincare market data into structured market-sizing and business insight narratives.
- Architecture: Data ingestion and analysis flow through Fabric/Azure Data Factory and Power BI.
- Stack: Microsoft Fabric, Azure Data Factory, Power BI.
- Decisions: Use as a supporting project for business framing and analytics storytelling rather than a core data-engineering proof point.
- Tradeoffs: Needs clearer artifacts and dates before promotion.
- Impact: Shows business communication and structured insight delivery.
- Links: Pending
- Media: Pending report screenshots, market-sizing visuals, presentation excerpt
- Related skills: Power BI, Fabric, Azure Data Factory, TAM/SAM/SOM, SCQA, Pyramid Principle
- Related credentials: Google Data Analytics Professional Certificate
- Timeline date: Pending
- Viewer priority: Explorer medium, leader medium, recruiter low, engineer low

## Backlog Candidate: GitHub Align

- Slug: `align`
- Status: Public repository observed, not yet portfolio-ready
- Public use: Keep as a GitHub profile artifact only until the repository is reviewed and a case-file angle is defined.
- Missing: Project purpose, README quality, screenshots, architecture, relevance to Data Engineer positioning, and whether it should appear in project inventory.
