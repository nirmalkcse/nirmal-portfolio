import type { ProofGraphEdge, SkillCluster } from "./types";

export const skillClusters = [
  {
    id: "fabric-lakehouse-engineering",
    title: "Fabric Lakehouse Engineering",
    priority: 1,
    portfolioRole: "Core Data Engineer credibility",
    canonicalSkills: [
      "Microsoft Fabric",
      "Lakehouse",
      "Warehouse",
      "OneLake",
      "Fabric Data Factory",
      "PySpark notebooks",
      "SQL notebooks",
      "Delta tables",
      "Medallion Architecture"
    ],
    evidenceProjects: [
      "telecom-fabric-migration-poc",
      "bi-migration-validation-analytics",
      "ieee-semiconductor-chip-analysis-medallion",
      "fabcon25-talk-to-your-data-demo"
    ],
    evidenceStrength: "high",
    proofPoints: [
      "3 source systems",
      "18-24 daily incremental source tables",
      "Bronze/Silver/Gold processing",
      "Fabric Lakehouse/Warehouse architecture",
      "validation-ready stages"
    ],
    relatedCredentials: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    publicFraming:
      "Fabric lakehouse delivery across ingestion, transformation, validation, and BI-serving layers.",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    }
  },
  {
    id: "databricks-data-product-engineering",
    title: "Databricks Data Product Engineering",
    priority: 2,
    portfolioRole: "Strongest current depth story",
    canonicalSkills: [
      "Databricks Apps",
      "SQL Warehouse",
      "Jobs API",
      "Secrets API",
      "Unity Catalog",
      "Delta control tables",
      "catalog access",
      "notebook/job orchestration"
    ],
    evidenceProjects: ["icore-enterprise-mdm-entity-resolution"],
    evidenceStrength: "high",
    proofPoints: [
      "Databricks-hosted app",
      "parameterized SQL execution",
      "notebook/job submission",
      "run status polling",
      "secrets-backed credentials",
      "proxy-header auth",
      "RBAC",
      "audit logging"
    ],
    relatedCredentials: [
      "databricks-data-engineer-associate",
      "databricks-uc-upgrade-delivery-specialization",
      "databricks-fundamentals"
    ],
    publicFraming:
      "Databricks-hosted data products with governed orchestration and audit-ready workflows.",
    viewerPriority: {
      engineer: "high",
      leader: "high",
      recruiter: "high",
      explorer: "medium"
    }
  },
  {
    id: "sql-spark-data-quality",
    title: "SQL, Spark, And Data Quality",
    priority: 3,
    portfolioRole: "Implementation backbone",
    canonicalSkills: [
      "SQL",
      "Spark SQL",
      "PySpark",
      "metadata-driven ETL/ELT",
      "CDC",
      "SCD Type 2",
      "schema enforcement",
      "validation",
      "regression checks"
    ],
    evidenceProjects: [
      "telecom-fabric-migration-poc",
      "bi-migration-validation-analytics",
      "insurance-analytics-copilot-data-agent-poc"
    ],
    evidenceStrength: "high",
    proofPoints: [
      "MD5 hash-based CDC",
      "rec_start/rec_end validity windows",
      "active/deleted tracking",
      "optimized unchanged-record handling",
      "SQL regression checks",
      "Gold-to-BI comparisons"
    ],
    relatedCredentials: [
      "fabric-data-engineer-associate",
      "databricks-data-engineer-associate"
    ],
    publicFraming:
      "SQL and Spark implementation depth for reliable migration, historization, and validation.",
    viewerPriority: {
      engineer: "high",
      recruiter: "high",
      leader: "medium",
      explorer: "medium"
    }
  },
  {
    id: "bi-modernization-semantic-modeling",
    title: "BI Modernization And Semantic Modeling",
    priority: 4,
    portfolioRole: "Measurable business impact",
    canonicalSkills: [
      "Power BI",
      "semantic modeling",
      "DAX",
      "Power Query",
      "Power BI Report Builder",
      "KPI modeling",
      "Tableau migration",
      "MicroStrategy validation"
    ],
    evidenceProjects: [
      "bi-migration-validation-analytics",
      "insurance-analytics-copilot-data-agent-poc",
      "fabcon25-talk-to-your-data-demo",
      "vitac-skincare-market-analysis"
    ],
    evidenceStrength: "high",
    proofPoints: [
      "15+ reports validated",
      "90% discrepancy reduction",
      "6 Tableau reports migrated to Power BI",
      "semantic model rebuilding",
      "DAX measures",
      "report layouts",
      "accessibility/usability checks"
    ],
    relatedCredentials: [
      "fabric-analytics-engineer-associate",
      "google-data-analytics-professional"
    ],
    publicFraming:
      "BI migration and validation that protects trust during modernization.",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    id: "governance-stewardship-auditability",
    title: "Governance, Stewardship, And Auditability",
    priority: 5,
    portfolioRole: "Leader-facing maturity signal",
    canonicalSkills: [
      "RBAC",
      "audit logging",
      "decision lineage",
      "approval chains",
      "SLA policies",
      "delegation",
      "escalation",
      "overrides",
      "compliance scorecards",
      "evidence packs"
    ],
    evidenceProjects: ["icore-enterprise-mdm-entity-resolution"],
    evidenceStrength: "medium-high",
    proofPoints: [
      "match review",
      "review queues",
      "approval chains",
      "compliance scorecards",
      "evidence packs",
      "decision lineage",
      "model-backed decision audit trails"
    ],
    relatedCredentials: [
      "databricks-uc-upgrade-delivery-specialization",
      "databricks-fundamentals"
    ],
    publicFraming:
      "Governed data workflows where decisions can be reviewed, explained, and traced.",
    viewerPriority: {
      leader: "high",
      engineer: "high",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "product-engineering-data-workflows",
    title: "Product Engineering For Data Workflows",
    priority: 6,
    portfolioRole: "Differentiator beyond pure ETL",
    canonicalSkills: [
      "TypeScript",
      "Next.js",
      "React",
      "Zod",
      "TanStack Query",
      "REST API routes",
      "server-side Databricks integration APIs",
      "feature flags",
      "rollout planning"
    ],
    evidenceProjects: ["icore-enterprise-mdm-entity-resolution"],
    evidenceStrength: "high",
    proofPoints: [
      "Master Entity workflow",
      "connector/source mapping flows",
      "canonical attributes",
      "golden records",
      "pipeline launch flows",
      "feature-flagged rollout"
    ],
    relatedCredentials: [
      "github-copilot",
      "databricks-data-engineer-associate",
      "databricks-uc-upgrade-delivery-specialization"
    ],
    publicFraming:
      "Data products with real workflow surfaces, not only backend pipelines.",
    viewerPriority: {
      engineer: "high",
      leader: "medium",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "ai-assisted-analytics-data-agents",
    title: "AI-Assisted Analytics And Data Agents",
    priority: 7,
    portfolioRole: "Explorer/future-facing signal",
    canonicalSkills: [
      "Power BI Chat with Data",
      "in-report Copilot",
      "Copilot Studio",
      "data-agent RCA",
      "prompt libraries",
      "verified response patterns",
      "JIRA MCP context"
    ],
    evidenceProjects: [
      "fabcon25-talk-to-your-data-demo",
      "insurance-analytics-copilot-data-agent-poc"
    ],
    evidenceStrength: "medium",
    proofPoints: [
      "Lakehouse data plus semantic models",
      "data-agent RCA",
      "Copilot Studio orchestration",
      "parameterized SQL data agent",
      "verified response patterns"
    ],
    relatedCredentials: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate",
      "github-copilot"
    ],
    publicFraming:
      "Currently applying AI-assisted analytics patterns where responses stay grounded in modeled data.",
    viewerPriority: {
      explorer: "high",
      leader: "medium",
      recruiter: "medium",
      engineer: "medium"
    }
  },
  {
    id: "research-business-storytelling",
    title: "Research And Business Storytelling",
    priority: 8,
    portfolioRole: "Credibility and communication layer",
    canonicalSkills: [
      "Research communication",
      "Medallion Architecture explanation",
      "TAM/SAM/SOM",
      "SCQA",
      "Pyramid Principle",
      "market analysis"
    ],
    evidenceProjects: [
      "ieee-semiconductor-chip-analysis-medallion",
      "vitac-skincare-market-analysis"
    ],
    evidenceStrength: "medium",
    proofPoints: [
      "IEEE publication",
      "semiconductor chip analytics framing",
      "skincare market sizing",
      "structured insight communication"
    ],
    relatedCredentials: [
      "google-data-analytics-professional",
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    publicFraming:
      "Technical systems translated into clear research and business narratives.",
    viewerPriority: {
      explorer: "high",
      leader: "medium",
      recruiter: "medium",
      engineer: "medium"
    }
  }
] satisfies readonly SkillCluster[];

export const proofGraphEdges = [
  {
    from: "fabric-lakehouse-engineering",
    relationship: "proven by",
    to: "telecom-fabric-migration-poc"
  },
  {
    from: "telecom-fabric-migration-poc",
    relationship: "quantified by",
    to: "metric-3-source-systems"
  },
  {
    from: "telecom-fabric-migration-poc",
    relationship: "quantified by",
    to: "metric-18-24-daily-incremental-source-tables"
  },
  {
    from: "sql-spark-data-quality",
    relationship: "demonstrated through",
    to: "cdc-scd2-validation-stages"
  },
  {
    from: "databricks-data-product-engineering",
    relationship: "proven by",
    to: "icore-enterprise-mdm-entity-resolution"
  },
  {
    from: "fabric-data-engineer-associate",
    relationship: "supports",
    to: "fabric-lakehouse-engineering"
  },
  {
    from: "databricks-data-engineer-associate",
    relationship: "supports",
    to: "databricks-data-product-engineering"
  },
  {
    from: "bi-modernization-semantic-modeling",
    relationship: "proven by",
    to: "bi-migration-validation-analytics"
  },
  {
    from: "bi-migration-validation-analytics",
    relationship: "quantified by",
    to: "metric-15-plus-reports-validated"
  },
  {
    from: "bi-migration-validation-analytics",
    relationship: "quantified by",
    to: "metric-90-percent-discrepancy-reduction"
  },
  {
    from: "bi-migration-validation-analytics",
    relationship: "quantified by",
    to: "metric-6-tableau-reports-migrated"
  },
  {
    from: "fabric-analytics-engineer-associate",
    relationship: "supports",
    to: "bi-modernization-semantic-modeling"
  },
  {
    from: "product-engineering-data-workflows",
    relationship: "proven by",
    to: "icore-enterprise-mdm-entity-resolution"
  },
  {
    from: "governance-stewardship-auditability",
    relationship: "proven by",
    to: "review-queues-approval-chains-evidence-packs-decision-lineage"
  },
  {
    from: "databricks-uc-upgrade-delivery-specialization",
    relationship: "supports",
    to: "governance-stewardship-auditability"
  },
  {
    from: "ai-assisted-analytics-data-agents",
    relationship: "demonstrated by",
    to: "fabcon25-talk-to-your-data-demo"
  },
  {
    from: "research-business-storytelling",
    relationship: "proven by",
    to: "ieee-semiconductor-chip-analysis-medallion"
  },
  {
    from: "research-business-storytelling",
    relationship: "supported by",
    to: "vitac-skincare-market-analysis"
  },
  {
    from: "github-copilot",
    relationship: "supports",
    to: "developer-productivity-ai-assisted-workflow"
  }
] satisfies readonly ProofGraphEdge[];

export const weakSignalsToAvoid = [
  "GitHub public repository count",
  "LeetCode solved count",
  "Generic AI claims without FabCon25, Copilot, semantic model, data-agent, or verified-response evidence"
] satisfies readonly string[];
