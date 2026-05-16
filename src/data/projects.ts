import type { Project } from "./types";

export const projects = [
  {
    title: "iCORE Enterprise MDM / Entity Resolution Platform",
    slug: "icore-enterprise-mdm-entity-resolution",
    status: "current",
    dates: "Jan 2026 - Present",
    type: "Data product / MDM / entity resolution / governance workflow",
    publicSensitivity:
      "Confirm whether the iCORE name and implementation details can be public.",
    summary:
      "Databricks-hosted MDM/entity-resolution product combining Next.js product workflows, Databricks orchestration, governance, stewardship, explainability, and auditability.",
    problem:
      "Enterprise source data needs reusable connectors, mapped canonical entities, governed golden records, review workflows, and traceable entity-resolution decisions.",
    architecture:
      "Next.js 15 and TypeScript application hosted through Databricks Apps, integrating with Databricks SQL Warehouse, Jobs API, Secrets API, Unity Catalog, and Delta control tables.",
    stack: [
      "Databricks Apps",
      "Next.js 15",
      "TypeScript",
      "React",
      "Zod",
      "TanStack Query",
      "Databricks SQL Warehouse",
      "Jobs API",
      "Secrets API",
      "Unity Catalog",
      "Delta control tables"
    ],
    decisions: [
      "Re-architected from connector-centric workflows into a Master Entity model.",
      "Modeled reusable connectors, source mappings, canonical attributes, golden records, golden-record history, and resolution templates."
    ],
    tradeoffs:
      "Public case file may need sanitized architecture and anonymized data because the project is current and likely client/internal sensitive.",
    impact:
      "Strongest product-engineering proof point; demonstrates ownership across APIs, orchestration, governance workflows, audit logging, RBAC, and explainable decisions.",
    links: [
      {
        label: "Project link",
        url: null,
        status: "pending",
        note: "Public-safe link pending."
      }
    ],
    media: [
      {
        label: "Sanitized UI captures",
        type: "screenshot",
        url: null,
        status: "pending"
      },
      {
        label: "Architecture diagram",
        type: "diagram",
        url: null,
        status: "pending"
      },
      {
        label: "Workflow diagram",
        type: "diagram",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "Databricks",
      "SQL Warehouse",
      "Unity Catalog",
      "Delta",
      "TypeScript",
      "Next.js",
      "React",
      "Zod",
      "TanStack Query",
      "RBAC",
      "audit logging",
      "orchestration",
      "governance",
      "entity resolution"
    ],
    relatedCredentials: [
      "databricks-data-engineer-associate",
      "databricks-uc-upgrade-delivery-specialization",
      "databricks-fundamentals",
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    timelineDate: "2026-01",
    viewerPriority: {
      engineer: "high",
      leader: "high",
      recruiter: "high",
      explorer: "medium"
    }
  },
  {
    title: "Tier-1 European Telecom Fabric Migration PoC",
    slug: "telecom-fabric-migration-poc",
    status: "complete",
    dates: "Oct 2025 - Dec 2025",
    type: "Enterprise data migration / Fabric lakehouse modernization",
    publicSensitivity:
      "Keep client anonymized as a Tier-1 European telecom provider unless permission is confirmed.",
    summary:
      "Teradata-to-Microsoft Fabric modernization PoC using metadata-driven ingestion, Bronze/Silver/Gold processing, CDC/SCD Type 2, Delta tables, and Lakehouse/Warehouse architecture.",
    problem:
      "Modernize legacy telecom data flows from Teradata/BTEQ and mixed source formats into Microsoft Fabric while preserving validation, retryability, and reporting readiness.",
    architecture:
      "Fabric Data Factory pipelines and notebooks orchestrating source ingestion, landing, transformation, validation, Gold loading, and Warehouse serving across dual Lakehouse/single Warehouse architecture.",
    stack: [
      "Microsoft Fabric",
      "Fabric Data Factory",
      "Lakehouse",
      "Warehouse",
      "OneLake",
      "PySpark",
      "Spark SQL",
      "SQL notebooks",
      "Delta tables"
    ],
    decisions: [
      "Used metadata-driven ingestion for reusable migration flows.",
      "Applied MD5 hash-based CDC, rec_start/rec_end validity windows, active/deleted tracking, schema correction, UTF-8 standardization, JSON flattening, and idempotent execution patterns."
    ],
    tradeoffs:
      "Detailed source-system names may be acceptable from resume extraction but should still be reviewed before public launch.",
    impact:
      "Supported 3 source systems and roughly 18-24 daily incremental tables; strongest scale and enterprise data-engineering credibility story.",
    links: [
      {
        label: "Project link",
        url: null,
        status: "pending",
        note: "Public-safe artifact pending."
      }
    ],
    media: [
      {
        label: "Architecture diagram",
        type: "diagram",
        url: null,
        status: "pending"
      },
      {
        label: "Medallion flow",
        type: "diagram",
        url: null,
        status: "pending"
      },
      {
        label: "Sanitized validation screenshots",
        type: "screenshot",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "Microsoft Fabric",
      "Data Factory pipelines",
      "PySpark",
      "SQL",
      "Spark SQL",
      "Delta Lake",
      "Medallion Architecture",
      "CDC",
      "SCD Type 2",
      "schema enforcement",
      "data validation"
    ],
    relatedCredentials: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    timelineDate: "2025-10",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    }
  },
  {
    title: "BI Migration, Validation And Analytics Delivery",
    slug: "bi-migration-validation-analytics",
    status: "complete",
    dates: "Sep 2024 - Sep 2025",
    type: "BI modernization / validation / report migration",
    publicSensitivity:
      "Keep clients anonymized by industry and region unless permission is confirmed.",
    summary:
      "BI modernization and validation work spanning MicroStrategy-to-Fabric validation, Tableau-to-Power BI migration, semantic modeling, report reconstruction, and analytics PoCs.",
    problem:
      "Enterprise reporting migrations need reliable parity checks, semantic model rebuilding, DAX/Power Query transformations, layout validation, and discrepancy reduction.",
    architecture:
      "SQL regression checks, Gold-to-BI comparisons, Power BI Report Builder validation, Power BI semantic models, DAX measures, Power Query transformations, and report rebuild workflows.",
    stack: [
      "Microsoft Fabric",
      "SQL",
      "Power BI",
      "Power BI Report Builder",
      "DAX",
      "Power Query",
      "Tableau",
      "MicroStrategy"
    ],
    decisions: [
      "Emphasized validation-first migration with SQL regression and BI output comparisons.",
      "Rebuilt semantic models, report layouts, and data parity checks with accessibility and usability review."
    ],
    tradeoffs:
      "This is a bundled workstream rather than one single product; case file should group it as a migration and validation system to avoid looking scattered.",
    impact:
      "Validated 15+ reports, reduced validation discrepancies by 90%, and migrated 6 Tableau reports to Power BI.",
    links: [
      {
        label: "Project link",
        url: null,
        status: "pending",
        note: "Anonymized proof pending."
      }
    ],
    media: [
      {
        label: "Anonymized report thumbnails",
        type: "thumbnail",
        url: null,
        status: "pending"
      },
      {
        label: "Validation matrix",
        type: "document",
        url: null,
        status: "pending"
      },
      {
        label: "Before/after migration story",
        type: "diagram",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "SQL",
      "Power BI",
      "semantic modeling",
      "DAX",
      "Power Query",
      "Report Builder",
      "Tableau migration",
      "MicroStrategy validation",
      "KPI modeling"
    ],
    relatedCredentials: [
      "fabric-analytics-engineer-associate",
      "google-data-analytics-professional"
    ],
    timelineDate: "2024-09",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    title: "IEEE Research - Semiconductor Chip Analysis Using Medallion Architecture",
    slug: "ieee-semiconductor-chip-analysis-medallion",
    status: "published",
    dates: "2024",
    type: "Research publication / analytics design",
    publicSensitivity: "Public IEEE article.",
    summary:
      "Research artifact using Medallion Architecture, Microsoft Fabric, and Power BI for semiconductor chip analysis.",
    problem:
      "Semiconductor analysis needs structured ingestion, transformation, and insight delivery using a modern data architecture.",
    architecture: "Medallion Architecture with Microsoft Fabric and Power BI.",
    stack: ["Microsoft Fabric", "Power BI", "Medallion Architecture"],
    decisions: [
      "Use as a credibility artifact for architecture thinking, research discipline, and early Fabric/Power BI specialization."
    ],
    tradeoffs:
      "Needs exact publication metadata and citation details before certification-console or publication-card polish.",
    impact: "Public research signal and credible external proof point.",
    links: [
      {
        label: "IEEE article",
        url: "https://ieeexplore.ieee.org/document/10544873",
        status: "verified",
        note: "Exact publication metadata pending."
      }
    ],
    media: [
      {
        label: "Citation card",
        type: "citation-card",
        url: null,
        status: "pending"
      },
      {
        label: "Publication screenshot",
        type: "screenshot",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "Microsoft Fabric",
      "Power BI",
      "Medallion Architecture",
      "research communication"
    ],
    relatedCredentials: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    timelineDate: "2024",
    viewerPriority: {
      explorer: "high",
      engineer: "medium",
      recruiter: "medium",
      leader: "medium"
    }
  },
  {
    title: "FabCon25 Europe 2025 Talk to Your Data Demo",
    slug: "fabcon25-talk-to-your-data-demo",
    status: "complete",
    dates: "2025",
    type: "AI/data-agent demo / Fabric and Power BI experience",
    publicSensitivity:
      "Confirm demo assets and company/client references before public use.",
    summary:
      "Demo integrating Lakehouse data, semantic models, Power BI Chat with Data, in-report Copilot, Data Agent RCA, Copilot Studio orchestration, and JIRA MCP incident context.",
    problem:
      "Show how business users can move from data questions to root-cause and incident context through Microsoft Fabric, Power BI, and agentic workflows.",
    architecture:
      "Fabric Lakehouse and semantic model connected to Power BI conversational surfaces, Copilot Studio orchestration, data-agent RCA, and JIRA MCP incident context.",
    stack: [
      "Microsoft Fabric",
      "Power BI",
      "Copilot",
      "Copilot Studio",
      "Data Agent",
      "JIRA MCP"
    ],
    decisions: [
      "Position as a demo/proof moment rather than a standalone product until more public media is available."
    ],
    tradeoffs:
      "High signal for AI/data agents, but needs evidence assets before it can carry major homepage weight.",
    impact:
      "Team solution recognized by senior company and Microsoft leadership for applied Fabric, Power BI, Copilot, and data-agent capabilities.",
    links: [
      {
        label: "Demo proof",
        url: null,
        status: "pending",
        note: "Event or demo proof pending."
      }
    ],
    media: [
      {
        label: "Demo screenshots",
        type: "screenshot",
        url: null,
        status: "pending"
      },
      {
        label: "Architecture map",
        type: "diagram",
        url: null,
        status: "pending"
      },
      {
        label: "Event proof",
        type: "document",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "Fabric",
      "Power BI",
      "semantic modeling",
      "Copilot Studio",
      "data agents",
      "workflow orchestration"
    ],
    relatedCredentials: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate",
      "github-copilot"
    ],
    timelineDate: "2025",
    viewerPriority: {
      leader: "high",
      explorer: "high",
      recruiter: "medium",
      engineer: "medium"
    }
  },
  {
    title: "Insurance Analytics PoC",
    slug: "insurance-analytics-copilot-data-agent-poc",
    status: "complete",
    dates: "2025",
    type: "Analytics PoC / semantic model / AI-assisted BI",
    publicSensitivity: "Confirm whether PoC details and visuals can be public.",
    summary:
      "Insurance analytics PoC with synthetic datasets, semantic models, Power Query/DAX transformations, in-report Copilot, prompt libraries, verified response patterns, and a parameterized SQL data agent.",
    problem:
      "Demonstrate trusted analytics experiences where users can ask natural-language questions and receive verifiable, data-grounded answers.",
    architecture:
      "Synthetic data feeding Power BI semantic models and report experiences, paired with prompt libraries, response verification, and parameterized SQL data-agent access.",
    stack: ["Power BI", "Power Query", "DAX", "SQL", "Copilot", "data agent patterns"],
    decisions: [
      "Use as supporting proof for AI-assisted analytics and semantic-model craft."
    ],
    tradeoffs:
      "Keep below the top three project cards unless strong visuals or demo artifacts are collected.",
    impact:
      "Supports the hybrid story across BI, semantic modeling, and data-agent experimentation.",
    links: [
      {
        label: "PoC proof",
        url: null,
        status: "pending",
        note: "Screenshots, prompt examples, or response verification samples pending."
      }
    ],
    media: [
      {
        label: "PoC screenshots",
        type: "screenshot",
        url: null,
        status: "pending"
      },
      {
        label: "Prompt-library sample",
        type: "document",
        url: null,
        status: "pending"
      },
      {
        label: "Response verification example",
        type: "document",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "Power BI",
      "DAX",
      "Power Query",
      "semantic modeling",
      "SQL",
      "data agents",
      "prompt design"
    ],
    relatedCredentials: [
      "fabric-analytics-engineer-associate",
      "google-data-analytics-professional"
    ],
    timelineDate: "2025",
    viewerPriority: {
      explorer: "medium",
      leader: "medium",
      recruiter: "low",
      engineer: "low"
    }
  },
  {
    title: "VITAC - Skincare Market Analysis",
    slug: "vitac-skincare-market-analysis",
    status: "complete",
    dates: "Pending",
    type: "Analytics project / market analysis",
    publicSensitivity:
      "Confirm source material and whether project assets can be public.",
    summary:
      "Market analysis project using Microsoft Fabric, Azure Data Factory, and Power BI with TAM/SAM/SOM, SCQA, and Pyramid Principle framing.",
    problem:
      "Translate skincare market data into structured market-sizing and business insight narratives.",
    architecture:
      "Data ingestion and analysis flow through Fabric/Azure Data Factory and Power BI.",
    stack: ["Microsoft Fabric", "Azure Data Factory", "Power BI"],
    decisions: [
      "Use as a supporting project for business framing and analytics storytelling rather than a core data-engineering proof point."
    ],
    tradeoffs: "Needs clearer artifacts and dates before promotion.",
    impact: "Shows business communication and structured insight delivery.",
    links: [
      {
        label: "Project proof",
        url: null,
        status: "pending",
        note: "Report screenshots or presentation excerpt pending."
      }
    ],
    media: [
      {
        label: "Report screenshots",
        type: "screenshot",
        url: null,
        status: "pending"
      },
      {
        label: "Market-sizing visuals",
        type: "diagram",
        url: null,
        status: "pending"
      },
      {
        label: "Presentation excerpt",
        type: "document",
        url: null,
        status: "pending"
      }
    ],
    relatedSkills: [
      "Power BI",
      "Fabric",
      "Azure Data Factory",
      "TAM/SAM/SOM",
      "SCQA",
      "Pyramid Principle"
    ],
    relatedCredentials: ["google-data-analytics-professional"],
    timelineDate: null,
    viewerPriority: {
      explorer: "medium",
      leader: "medium",
      recruiter: "low",
      engineer: "low"
    }
  },
  {
    title: "GitHub Align",
    slug: "align",
    status: "observed",
    dates: "Pending review",
    type: "Backlog candidate / public repository",
    publicSensitivity:
      "Keep as a GitHub profile artifact until the repository is reviewed and a case-file angle is defined.",
    summary:
      "Public repository observed, but not yet portfolio-ready based on the current inventory.",
    problem:
      "The repository needs a clearer purpose, README quality review, screenshots, architecture, and relevance to Data Engineer positioning before promotion.",
    architecture: "Pending review.",
    stack: [],
    decisions: [
      "Keep out of primary project cards until repository quality and positioning are reviewed."
    ],
    tradeoffs:
      "Promoting weak public repositories would distract from stronger enterprise data-engineering proof.",
    impact: "Potential future engineer-facing proof after curation.",
    links: [
      {
        label: "GitHub profile",
        url: "https://github.com/nirmalkcse",
        status: "verified",
        note: "Use profile link only for now."
      }
    ],
    media: [],
    relatedSkills: [],
    relatedCredentials: [],
    timelineDate: null,
    viewerPriority: {
      engineer: "low",
      explorer: "low"
    }
  }
] satisfies readonly Project[];

export const featuredProjectSlugs = [
  "icore-enterprise-mdm-entity-resolution",
  "telecom-fabric-migration-poc",
  "bi-migration-validation-analytics"
] satisfies readonly string[];
