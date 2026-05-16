# Proof Graph Candidates

Status: Canonical draft
Last updated: 2026-05-16
Primary source: [Session 02 Resume Content Extraction](../sessions/session-02-resume-content-extraction.md)

## Purpose

The proof graph should connect claims to evidence instead of presenting skills as a flat list. A useful graph node answers one of three questions:

- What can Nirmal do?
- Where has he done it?
- What proof supports the claim?

## Node Types

- Skill cluster: A grouped capability such as Fabric Lakehouse Engineering.
- Project: A workstream or artifact from [Project Inventory](project-inventory.md).
- Credential: A certification or accreditation from [Certification Inventory](certification-inventory.md).
- Metric: A quantified result.
- Artifact: A link, screenshot, architecture diagram, resume, publication, or proof packet.

## Core Graph: Data Engineer Credibility

Primary claim:

> Nirmal can build and validate modern lakehouse data systems in Microsoft Fabric and Databricks.

Candidate nodes:

- Skill cluster: Fabric Lakehouse Engineering
- Skill cluster: SQL, Spark, And Data Quality
- Project: Tier-1 European Telecom Fabric Migration PoC
- Project: iCORE Enterprise MDM / Entity Resolution Platform
- Credential: Microsoft Certified: Fabric Data Engineer Associate
- Credential: Databricks Certified Data Engineer Associate
- Metric: 3 source systems
- Metric: 18-24 daily incremental source tables
- Artifact: Fabric architecture diagram, pending
- Artifact: Credential verification pages, pending

Candidate edges:

- Fabric Lakehouse Engineering -> proven by -> Telecom Fabric Migration PoC
- Telecom Fabric Migration PoC -> quantified by -> 3 source systems
- Telecom Fabric Migration PoC -> quantified by -> 18-24 daily incremental source tables
- SQL, Spark, And Data Quality -> demonstrated through -> CDC/SCD Type 2 and validation stages
- Databricks Data Product Engineering -> proven by -> iCORE Enterprise MDM
- Microsoft Fabric credential -> supports -> Fabric Lakehouse Engineering
- Databricks credential -> supports -> Databricks Data Product Engineering

## Core Graph: BI Trust And Modernization

Primary claim:

> Nirmal can migrate BI systems while preserving trust in the numbers.

Candidate nodes:

- Skill cluster: BI Modernization And Semantic Modeling
- Project: BI Migration, Validation And Analytics Delivery
- Project: Insurance Analytics PoC
- Credential: Microsoft Certified: Fabric Analytics Engineer Associate
- Credential: Google Data Analytics Professional Certificate
- Metric: 15+ reports validated
- Metric: 90% discrepancy reduction
- Metric: 6 Tableau reports migrated
- Artifact: Validation matrix, pending
- Artifact: Anonymized report before/after visuals, pending

Candidate edges:

- BI Modernization And Semantic Modeling -> proven by -> BI Migration, Validation And Analytics Delivery
- BI Migration, Validation And Analytics Delivery -> quantified by -> 15+ reports validated
- BI Migration, Validation And Analytics Delivery -> quantified by -> 90% discrepancy reduction
- BI Migration, Validation And Analytics Delivery -> quantified by -> 6 Tableau reports migrated
- Fabric Analytics credential -> supports -> Power BI and semantic modeling skills

## Core Graph: Governed Data Product Builder

Primary claim:

> Nirmal can turn data engineering workflows into governed products with usable interfaces.

Candidate nodes:

- Skill cluster: Databricks Data Product Engineering
- Skill cluster: Governance, Stewardship, And Auditability
- Skill cluster: Product Engineering For Data Workflows
- Project: iCORE Enterprise MDM / Entity Resolution Platform
- Credential: Databricks UC Upgrade Delivery Specialization
- Artifact: Sanitized UI screenshots, pending
- Artifact: Entity-resolution workflow diagram, pending
- Artifact: Governance/evidence-pack diagram, pending

Candidate edges:

- Product Engineering For Data Workflows -> proven by -> iCORE Enterprise MDM
- Governance, Stewardship, And Auditability -> proven by -> review queues, approval chains, evidence packs, and decision lineage
- Databricks Data Product Engineering -> proven by -> SQL Warehouse, Jobs API, Secrets API, Unity Catalog, and Delta control tables
- Databricks UC specialization -> supports -> governance and Unity Catalog claims

## Supporting Graph: Explorer And Research Signal

Primary claim:

> Nirmal is building a hybrid path across data engineering, analytics, AI-assisted BI, and research.

Candidate nodes:

- Skill cluster: AI-Assisted Analytics And Data Agents
- Skill cluster: Research And Business Storytelling
- Project: FabCon25 Europe Talk to Your Data Demo
- Project: IEEE Research
- Project: VITAC
- Credential: GitHub Copilot
- Artifact: IEEE article
- Artifact: Demo proof, pending

Candidate edges:

- AI-Assisted Analytics And Data Agents -> demonstrated by -> FabCon25 Talk to Your Data Demo
- Research And Business Storytelling -> proven by -> IEEE Research
- Research And Business Storytelling -> supported by -> VITAC market analysis
- GitHub Copilot credential -> supports -> developer productivity and AI-assisted workflow familiarity

## Initial UI Priorities

1. Start with three graph clusters: Data Engineering, BI Trust, Data Product Governance.
2. Use Explorer/Research as a secondary graph layer or alternate lens.
3. Keep credentials as supporting nodes, not the center of the graph.
4. Keep weak public stats out of the graph until stronger repositories or coding artifacts are curated.

## Proof Gaps Blocking Strong Graph Edges

- Public-safe architecture diagrams for iCORE and telecom Fabric PoC.
- Credential metadata and verification screenshots.
- Anonymized BI validation proof, such as a validation matrix or before/after report screenshots.
- Confirmation that iCORE can be named publicly.
- Public links for FabCon25/demo recognition, if available.
