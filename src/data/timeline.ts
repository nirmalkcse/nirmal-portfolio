import type { TimelineEvent } from "./types";

const resumeSource = {
  label: "Resume source",
  url: null,
  status: "pending",
  note: "Resume download available through the site."
} satisfies TimelineEvent["proofLinks"][number];

export const timelineEvents = [
  {
    id: "education-cse-degree",
    title: "Completed B.E. in Computer Science and Engineering",
    category: "education",
    startDate: null,
    endDate: "2024",
    description:
      "Completed Bachelor of Engineering in Computer Science and Engineering at Sathyabama Institute of Science and Technology with 9.11/10 CGPA.",
    proofLinks: [resumeSource],
    relatedProjects: [
      "ieee-semiconductor-chip-analysis-medallion",
      "vitac-skincare-market-analysis"
    ],
    relatedCertifications: [
      "google-data-analytics-professional",
      "oracle-cloud-infrastructure-foundations"
    ],
    importance: "high",
    viewerPriority: {
      recruiter: "high",
      explorer: "medium",
      engineer: "low",
      leader: "low"
    }
  },
  {
    id: "ieee-semiconductor-publication",
    title: "IEEE Research on Semiconductor Chip Analysis",
    category: "publication",
    startDate: "2024",
    endDate: "2024",
    description:
      "Published or contributed to IEEE research on semiconductor chip analysis using Medallion Architecture, Microsoft Fabric, and Power BI.",
    proofLinks: [
      {
        label: "IEEE article",
        url: "https://ieeexplore.ieee.org/document/10544873",
        status: "verified",
        note: "Public IEEE article."
      }
    ],
    relatedProjects: ["ieee-semiconductor-chip-analysis-medallion"],
    relatedCertifications: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    importance: "medium",
    viewerPriority: {
      explorer: "high",
      engineer: "medium",
      recruiter: "medium",
      leader: "medium"
    }
  },
  {
    id: "ilink-role-start",
    title: "Started Data Engineering And Product Development Role At iLink Systems",
    category: "work",
    startDate: "2024-09",
    endDate: "Present",
    description:
      "Joined iLink Systems as Software Engineer Trainee focused on data engineering, analytics modernization, and product development.",
    proofLinks: [resumeSource],
    relatedProjects: [
      "bi-migration-validation-analytics",
      "telecom-fabric-migration-poc",
      "icore-enterprise-mdm-entity-resolution"
    ],
    relatedCertifications: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate",
      "databricks-data-engineer-associate",
      "databricks-uc-upgrade-delivery-specialization",
      "databricks-fundamentals"
    ],
    importance: "high",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    }
  },
  {
    id: "bi-validation-migration-workstream",
    title: "BI Migration, Validation And Analytics Delivery",
    category: "project",
    startDate: "2024-09",
    endDate: "2025-09",
    description:
      "Validated 15+ MicroStrategy-to-Fabric reports, reduced validation discrepancies by 90%, migrated 6 Tableau reports to Power BI, and delivered analytics PoCs using Power BI, SQL, DAX, Power Query, and semantic models.",
    proofLinks: [resumeSource],
    relatedProjects: [
      "bi-migration-validation-analytics",
      "insurance-analytics-copilot-data-agent-poc"
    ],
    relatedCertifications: [
      "fabric-analytics-engineer-associate",
      "google-data-analytics-professional"
    ],
    importance: "high",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    id: "fabcon25-talk-to-your-data-demo",
    title: "FabCon25 Europe Talk To Your Data Demo",
    category: "demo",
    startDate: "2025",
    endDate: "2025",
    description:
      "Built or contributed to a Microsoft Fabric and Power BI demo integrating Lakehouse data, semantic models, Power BI Chat with Data, in-report Copilot, Data Agent RCA, Copilot Studio orchestration, and JIRA MCP incident context.",
    proofLinks: [
      resumeSource,
      {
        label: "Event/demo reference",
        url: null,
        status: "pending",
        note: "Public event or demo reference to add after approval."
      }
    ],
    relatedProjects: ["fabcon25-talk-to-your-data-demo"],
    relatedCertifications: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate",
      "github-copilot"
    ],
    importance: "medium",
    viewerPriority: {
      leader: "high",
      explorer: "high",
      recruiter: "medium",
      engineer: "medium"
    }
  },
  {
    id: "telecom-fabric-migration-poc",
    title: "Tier-1 European Telecom Fabric Migration PoC",
    category: "project",
    startDate: "2025-10",
    endDate: "2025-12",
    description:
      "Built Teradata-to-Microsoft Fabric modernization assets for 3 source systems and 18-24 daily incremental source tables using metadata-driven ingestion, Bronze/Silver/Gold processing, CDC/SCD Type 2, PySpark, SQL, Delta tables, Lakehouse, and Warehouse architecture.",
    proofLinks: [
      resumeSource,
      {
        label: "Approved public artifacts",
        url: null,
        status: "pending",
        note: "Architecture diagram and validation example to add after approval."
      }
    ],
    relatedProjects: ["telecom-fabric-migration-poc"],
    relatedCertifications: [
      "fabric-data-engineer-associate",
      "fabric-analytics-engineer-associate"
    ],
    importance: "very-high",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    }
  },
  {
    id: "icore-mdm-entity-resolution",
    title: "iCORE Enterprise MDM / Entity Resolution Platform",
    category: "project",
    startDate: "2026-01",
    endDate: "Present",
    description:
      "Owns end-to-end development of a Databricks-hosted MDM/entity-resolution product with Master Entity workflows, reusable connectors, source mappings, golden records, Databricks orchestration APIs, governance workflows, audit logging, and explainability features.",
    proofLinks: [
      resumeSource,
      {
        label: "Approved public artifacts",
        url: null,
        status: "pending",
        note: "UI screenshots and architecture example to add after approval."
      }
    ],
    relatedProjects: ["icore-enterprise-mdm-entity-resolution"],
    relatedCertifications: [
      "databricks-data-engineer-associate",
      "databricks-uc-upgrade-delivery-specialization",
      "databricks-fundamentals"
    ],
    importance: "very-high",
    viewerPriority: {
      engineer: "high",
      leader: "high",
      recruiter: "high",
      explorer: "medium"
    }
  },
  {
    id: "performance-rating-growth",
    title: "Performance Rating Improvement",
    category: "recognition",
    startDate: "2024-09",
    endDate: "2025",
    description:
      "Performance ratings improved from 4.4/5 to 4.8/5, with Outstanding performance ratings noted in the master resume.",
    proofLinks: [resumeSource],
    relatedProjects: [
      "bi-migration-validation-analytics",
      "telecom-fabric-migration-poc"
    ],
    relatedCertifications: [],
    importance: "medium",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "low",
      explorer: "low"
    }
  }
] satisfies readonly TimelineEvent[];
