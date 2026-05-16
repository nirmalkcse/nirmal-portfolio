import type { FutureProject } from "./types";

export const futureProjects = [
  {
    title: "Public-Safe Lakehouse Reference Case",
    slug: "public-safe-lakehouse-reference-case",
    concept:
      "A sanitized reference case that turns the telecom Fabric migration patterns into a public-friendly lakehouse story without client data or private implementation details.",
    whyItMatters:
      "It would let recruiters and engineers inspect architecture, CDC/SCD2 choices, validation flow, and BI serving design without exposing sensitive project boundaries.",
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
      "Public-safe case-file narrative"
    ],
    status: "currently exploring",
    targetOutcome:
      "A credible, non-sensitive proof artifact for Fabric migration and validation depth.",
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
      "A lightweight public demo that shows the MDM/entity-resolution workflow pattern with synthetic data, explainable decisions, review queues, and audit-friendly governance surfaces.",
    whyItMatters:
      "It would translate the strongest current product-engineering story into visible proof while respecting internal and client sensitivity.",
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
      "Review queue screenshots",
      "Decision-lineage diagram",
      "Governance and evidence-pack walkthrough"
    ],
    status: "currently exploring",
    targetOutcome:
      "A public-safe product case file that proves governed data workflow thinking.",
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
      "It keeps the AI-assisted analytics story practical and evidence-led instead of drifting into generic AI claims.",
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
      "A compact evidence trail for trusted AI-assisted analytics and data-agent experimentation.",
    sourceBasis: [
      "fabcon25-talk-to-your-data-demo",
      "insurance-analytics-copilot-data-agent-poc",
      "ai-assisted-analytics-data-agents"
    ]
  }
] satisfies readonly FutureProject[];
