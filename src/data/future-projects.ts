import type { FutureProject } from "./types";

export const futureProjects = [
  {
    title: "Responsible Lakehouse Reference Case",
    slug: "public-safe-lakehouse-reference-case",
    concept:
      "A public reference case that turns telecom Fabric migration patterns into a clear lakehouse story without client data or private implementation details.",
    whyItMatters:
      "It would let recruiters and engineers review architecture, CDC/SCD2 choices, validation flow, and BI serving design without exposing sensitive project details.",
    plannedStack: [
      "Microsoft Fabric",
      "Fabric Data Factory",
      "Lakehouse",
      "Warehouse",
      "PySpark",
      "Spark SQL",
      "Delta tables",
      "Power BI"
    ],
    plannedProof: [
      "Sanitized medallion architecture diagram",
      "Mock incremental-load validation matrix",
      "CDC/SCD Type 2 walkthrough",
      "Responsible case-study narrative"
    ],
    status: "currently exploring",
    targetOutcome:
      "A credible public artifact for Fabric migration and validation depth.",
    sourceBasis: [
      "telecom-fabric-migration-poc",
      "fabric-lakehouse-engineering",
      "sql-spark-data-quality"
    ]
  },
  {
    title: "Governed Entity Resolution Demo",
    slug: "governed-entity-resolution-demo",
    concept:
      "A lightweight public demo that shows the MDM/entity-resolution workflow pattern with synthetic data, explainable decisions, stewardship workflows, and governance controls.",
    whyItMatters:
      "It would translate the strongest current product-engineering story into a visible public example while respecting internal and client sensitivity.",
    plannedStack: [
      "Databricks Apps",
      "Next.js",
      "TypeScript",
      "React",
      "Zod",
      "TanStack Query",
      "Delta",
      "Unity Catalog patterns"
    ],
    plannedProof: [
      "Synthetic entity-resolution dataset",
      "Reviewer workflow screenshots",
      "Decision review diagram",
      "Governance walkthrough"
    ],
    status: "currently exploring",
    targetOutcome:
      "A responsible product case study that demonstrates governed data workflow thinking.",
    sourceBasis: [
      "icore-enterprise-mdm-entity-resolution",
      "databricks-data-product-engineering",
      "governance-stewardship-auditability",
      "product-engineering-data-workflows"
    ]
  },
  {
    title: "Grounded Analytics Agent Lab",
    slug: "grounded-analytics-agent-lab",
    concept:
      "A focused exploration of BI and data-agent patterns where natural-language answers stay tied to semantic models, parameterized SQL, prompt libraries, and verification examples.",
    whyItMatters:
      "It keeps the AI-assisted analytics story practical and grounded instead of drifting into broad AI language.",
    plannedStack: [
      "Power BI",
      "Semantic models",
      "DAX",
      "Power Query",
      "SQL",
      "Copilot Studio",
      "Data Agent patterns"
    ],
    plannedProof: [
      "Prompt library sample",
      "Verified response examples",
      "Semantic model map",
      "Root-cause workflow diagram"
    ],
    status: "currently exploring",
    targetOutcome:
      "A compact public walkthrough for trusted AI-assisted analytics and data-agent experimentation.",
    sourceBasis: [
      "fabcon25-talk-to-your-data-demo",
      "insurance-analytics-copilot-data-agent-poc",
      "ai-assisted-analytics-data-agents"
    ]
  }
] satisfies readonly FutureProject[];
