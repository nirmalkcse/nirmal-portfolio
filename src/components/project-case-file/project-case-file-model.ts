import { featuredProjectSlugs, projects } from "@/data";
import type {
  EvidenceConfidence,
  EvidencePublicStatus,
  EvidenceType,
  Priority,
  Project,
  Viewer
} from "@/data";

export type LensId = "balanced" | Viewer;

export type ProjectMetric = {
  label: string;
  value: string;
  detail: string;
};

export type ProjectHeroStat = {
  label: string;
  value: string;
  detail: string;
};

export type ArchitectureStage = {
  label: string;
  detail: string;
  tone: "gold" | "emerald" | "blue" | "silver";
};

export const lensOptions = [
  { id: "balanced", label: "Balanced" },
  { id: "recruiter", label: "Recruiter" },
  { id: "engineer", label: "Engineer" },
  { id: "leader", label: "Leader" },
  { id: "explorer", label: "Explorer" }
] as const satisfies readonly { id: LensId; label: string }[];

const priorityScore = {
  high: 3,
  medium: 2,
  low: 1
} satisfies Record<Priority, number>;

const statusLabels = {
  current: "Current",
  complete: "Complete",
  published: "Published",
  observed: "Under review"
} satisfies Record<Project["status"], string>;

const statusTone = {
  current: "blue",
  complete: "emerald",
  published: "gold",
  observed: "silver"
} satisfies Record<Project["status"], ArchitectureStage["tone"]>;

const lensSummaries = {
  balanced:
    "Standard order starts with the strongest professional work, then adds research, demos, and supporting analytics projects.",
  recruiter:
    "Recruiter view emphasizes role fit, quantified outcomes, relevant credentials, current work, and delivery scope.",
  engineer:
    "Engineer view emphasizes architecture, platform decisions, workflow depth, and implementation tradeoffs.",
  leader:
    "Leader view emphasizes business impact, governance, validation discipline, and responsible delivery.",
  explorer:
    "Explorer view expands into research, AI/data-agent demos, and current learning."
} satisfies Record<LensId, string>;

const evidenceStatusLabels = {
  "publicly-verifiable": "Publicly verifiable",
  "sanitized-for-confidentiality": "Client details anonymized",
  "summarized-from-internal-work": "Private project summary",
  "credential-verified": "Credential verified",
  "evidence-still-being-collected": "Public proof to add",
  "planned-public-artifact": "Artifact to add"
} satisfies Record<EvidencePublicStatus, string>;

const evidenceTypeLabels = {
  metric: "Metric",
  "project-detail": "Project detail",
  "credential-url": "Credential URL",
  "publication-link": "Publication link",
  "code-or-demo-link": "Code or demo link",
  "sanitized-diagram": "Sanitized diagram",
  screenshot: "Screenshot",
  "testimonial-or-recommendation": "Testimonial or recommendation",
  "learning-or-reflection": "Learning or reflection"
} satisfies Record<EvidenceType, string>;

const evidenceConfidenceLabels = {
  high: "High confidence",
  medium: "Medium confidence",
  "needs-review": "Needs review"
} satisfies Record<EvidenceConfidence, string>;

const architectureStagesBySlug: Record<string, readonly ArchitectureStage[]> = {
  "icore-enterprise-mdm-entity-resolution": [
    {
      label: "Reusable intake",
      detail:
        "Connectors and source mappings turn varied source systems into governed onboarding paths.",
      tone: "blue"
    },
    {
      label: "Master entity model",
      detail:
        "Canonical attributes, golden records, and history tables shift the product from connector-first to entity-first.",
      tone: "gold"
    },
    {
      label: "Resolution templates",
      detail:
        "Match logic, review paths, and explainability make entity decisions traceable instead of opaque.",
      tone: "emerald"
    },
    {
      label: "Databricks control plane",
      detail:
        "SQL Warehouse, Jobs, Secrets, Unity Catalog, and Delta control tables carry orchestration and governance.",
      tone: "silver"
    }
  ],
  "telecom-fabric-migration-poc": [
    {
      label: "Legacy extraction",
      detail:
        "Teradata, BTEQ, and mixed source files move into reusable Fabric ingestion paths.",
      tone: "blue"
    },
    {
      label: "Medallion processing",
      detail:
        "Bronze, Silver, and Gold layers preserve validation, retryability, and reporting readiness.",
      tone: "gold"
    },
    {
      label: "CDC and SCD2",
      detail:
        "Hash comparison, validity windows, active flags, and deleted tracking keep incremental history consistent.",
      tone: "emerald"
    },
    {
      label: "Warehouse serving",
      detail:
        "Lakehouse and Warehouse layers prepare migrated data for downstream analytics consumption.",
      tone: "silver"
    }
  ],
  "bi-migration-validation-analytics": [
    {
      label: "Report inventory",
      detail:
        "Legacy BI outputs are grouped by metric intent, source dependency, and parity risk.",
      tone: "silver"
    },
    {
      label: "Regression checks",
      detail:
        "SQL and Gold-to-BI comparisons turn migration quality into measurable checkpoints.",
      tone: "emerald"
    },
    {
      label: "Semantic rebuild",
      detail:
        "Power BI models, DAX, Power Query, and layout work rebuild the analytical experience.",
      tone: "blue"
    },
    {
      label: "Discrepancy reduction",
      detail:
        "Repeated validation loops move the workstream toward trusted report parity.",
      tone: "gold"
    }
  ],
  "ieee-semiconductor-chip-analysis-medallion": [
    {
      label: "Research framing",
      detail:
        "The public artifact frames semiconductor analysis as a modern data architecture problem.",
      tone: "silver"
    },
    {
      label: "Medallion design",
      detail:
        "Structured ingestion and transformation provide the technical spine for the analysis.",
      tone: "gold"
    },
    {
      label: "Power BI delivery",
      detail:
        "Fabric and Power BI convert the architecture into a public research artifact.",
      tone: "blue"
    }
  ],
  "fabcon25-talk-to-your-data-demo": [
    {
      label: "Lakehouse context",
      detail:
        "Fabric data and semantic models give the conversational BI experience a governed analytical base.",
      tone: "blue"
    },
    {
      label: "Conversational BI",
      detail:
        "Power BI Chat with Data and in-report Copilot create the business-user question path.",
      tone: "gold"
    },
    {
      label: "Root-cause layer",
      detail:
        "Data Agent RCA and Copilot Studio connect analysis to incident context and next actions.",
      tone: "emerald"
    }
  ],
  "insurance-analytics-copilot-data-agent-poc": [
    {
      label: "Synthetic dataset",
      detail:
        "Sanitized data keeps the example reviewable without exposing client or operational records.",
      tone: "silver"
    },
    {
      label: "Semantic model",
      detail:
        "Power Query, DAX, and curated measures ground natural-language answers in trusted BI logic.",
      tone: "blue"
    },
    {
      label: "Verified responses",
      detail:
        "Prompt libraries and parameterized SQL patterns make generated answers easier to check.",
      tone: "emerald"
    }
  ],
  "vitac-skincare-market-analysis": [
    {
      label: "Market inputs",
      detail:
        "Fabric and Azure Data Factory provide the analytical intake path for business framing.",
      tone: "blue"
    },
    {
      label: "Sizing logic",
      detail:
        "TAM, SAM, SOM, SCQA, and Pyramid Principle methods shape the insight narrative.",
      tone: "gold"
    },
    {
      label: "Power BI output",
      detail:
        "Report visuals turn the market-sizing work into a shareable analytics story.",
      tone: "silver"
    }
  ],
  align: [
    {
      label: "Repository review",
      detail:
        "The public repository needs README, screenshots, architecture, and positioning review.",
      tone: "silver"
    },
    {
      label: "Case-file angle",
      detail:
        "Promotion should wait until the project has a clear data-engineering or systems story.",
      tone: "gold"
    }
  ]
};

const heroStatsBySlug: Record<string, readonly ProjectHeroStat[]> = {
  "icore-enterprise-mdm-entity-resolution": [
    {
      label: "Role",
      value: "Data product engineer",
      detail: "API workflows, Databricks orchestration, governance controls"
    },
    {
      label: "Stack",
      value: "Databricks + Next.js",
      detail: "SQL Warehouse, Jobs API, Unity Catalog, Delta control tables"
    },
    {
      label: "Scale",
      value: "Governed MDM workflow",
      detail: "Connectors, source mappings, canonical entities, golden records"
    },
    {
      label: "Outcome",
      value: "Traceable decisions",
      detail: "RBAC, audit logging, review paths, explainable resolution"
    }
  ],
  "telecom-fabric-migration-poc": [
    {
      label: "Role",
      value: "Migration engineer",
      detail: "Fabric ingestion, transformation, CDC/SCD2, validation"
    },
    {
      label: "Stack",
      value: "Microsoft Fabric",
      detail: "Data Factory, Lakehouse, Warehouse, PySpark, Delta"
    },
    {
      label: "Scale",
      value: "3 source systems",
      detail: "Roughly 18-24 daily incremental source tables"
    },
    {
      label: "Outcome",
      value: "Reusable migration path",
      detail: "Metadata-driven ingestion and reporting-ready serving layers"
    }
  ],
  "bi-migration-validation-analytics": [
    {
      label: "Role",
      value: "BI validation engineer",
      detail: "Semantic rebuild, regression checks, report parity"
    },
    {
      label: "Stack",
      value: "SQL + Power BI",
      detail: "DAX, Power Query, Report Builder, migration validation"
    },
    {
      label: "Scale",
      value: "15+ reports",
      detail: "Including 6 Tableau-to-Power BI migrations"
    },
    {
      label: "Outcome",
      value: "90% fewer discrepancies",
      detail: "Validation loops reduced report mismatch noise"
    }
  ],
  "ieee-semiconductor-chip-analysis-medallion": [
    {
      label: "Role",
      value: "Research builder",
      detail: "Medallion architecture, analytics framing, BI delivery"
    },
    {
      label: "Stack",
      value: "Fabric + Power BI",
      detail: "Lakehouse pattern, transformation layers, report output"
    },
    {
      label: "Scale",
      value: "Public research",
      detail: "IEEE article with a reviewable external reference"
    },
    {
      label: "Outcome",
      value: "Published proof",
      detail: "A public artifact supporting architecture and analytics range"
    }
  ],
  "fabcon25-talk-to-your-data-demo": [
    {
      label: "Role",
      value: "Demo architect",
      detail: "Conversational BI, governed context, root-cause flow"
    },
    {
      label: "Stack",
      value: "Fabric + Copilot",
      detail: "Power BI Chat with Data, Data Agent RCA, Copilot Studio"
    },
    {
      label: "Scale",
      value: "Conference demo",
      detail: "Public-safe talk-to-your-data concept"
    },
    {
      label: "Outcome",
      value: "Executive-friendly analysis",
      detail: "Natural-language path from question to BI-backed answer"
    }
  ],
  "insurance-analytics-copilot-data-agent-poc": [
    {
      label: "Role",
      value: "Analytics PoC builder",
      detail: "Synthetic data, semantic model, answer validation"
    },
    {
      label: "Stack",
      value: "Power BI + Fabric",
      detail: "DAX, Power Query, SQL patterns, Copilot-assisted analysis"
    },
    {
      label: "Scale",
      value: "Synthetic domain model",
      detail: "Insurance-style measures and prompt workflows"
    },
    {
      label: "Outcome",
      value: "Checkable answers",
      detail: "Prompt libraries and SQL patterns make responses reviewable"
    }
  ],
  "vitac-skincare-market-analysis": [
    {
      label: "Role",
      value: "Market analytics builder",
      detail: "Sizing logic, business framing, Power BI output"
    },
    {
      label: "Stack",
      value: "Fabric + ADF + Power BI",
      detail: "Data intake, transformation, business storytelling"
    },
    {
      label: "Scale",
      value: "Market-sizing model",
      detail: "TAM, SAM, SOM, SCQA, and Pyramid Principle framing"
    },
    {
      label: "Outcome",
      value: "Shareable insight story",
      detail: "Analytics packaged for business decision review"
    }
  ],
  align: [
    {
      label: "Status",
      value: "Under review",
      detail: "Not counted as a finished case study"
    },
    {
      label: "Review focus",
      value: "Repository quality",
      detail: "README, screenshots, architecture, and positioning"
    },
    {
      label: "Public stance",
      value: "Profile artifact",
      detail: "Keep as a GitHub profile reference for now"
    },
    {
      label: "Promotion gate",
      value: "Clear systems story",
      detail: "Promote only if the work supports data-engineering positioning"
    }
  ]
};

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getOrderedProjects(lens: LensId): readonly Project[] {
  return [...projects].sort((a, b) => compareProjects(a, b, lens));
}

export function getCaseFileMetrics(
  projectList: readonly Project[] = projects
): readonly ProjectMetric[] {
  const primaryProjects = projectList.filter(
    (project) => project.status !== "observed"
  );
  const publicLinks = primaryProjects.flatMap((project) =>
    project.links.filter((link) => link.status === "verified")
  );
  const underReviewProjects = projectList.filter(
    (project) => project.status === "observed"
  );

  return [
    {
      label: "Flagship work",
      value: featuredProjectSlugs.length.toString(),
      detail: "primary case studies"
    },
    {
      label: "Case files",
      value: primaryProjects.length.toString(),
      detail: "case-study-ready records"
    },
    {
      label: "Live references",
      value: publicLinks.length.toString(),
      detail: "verified project links"
    },
    {
      label: "Under review",
      value: underReviewProjects.length.toString(),
      detail: "not counted as case studies"
    }
  ];
}

export function getProjectStatusLabel(status: Project["status"]) {
  return statusLabels[status];
}

export function getProjectStatusTone(status: Project["status"]) {
  return statusTone[status];
}

export function getProjectHeroStats(project: Project): readonly ProjectHeroStat[] {
  return (
    heroStatsBySlug[project.slug] ?? [
      {
        label: "Role",
        value: project.type,
        detail: "Primary contribution and delivery context"
      },
      {
        label: "Stack",
        value: project.stack.slice(0, 2).join(" + ") || "Stack to review",
        detail: project.stack.slice(2, 5).join(", ") || "Implementation details to add"
      },
      {
        label: "Scale",
        value: project.dates,
        detail: "Project window and delivery scope"
      },
      {
        label: "Outcome",
        value: project.impact,
        detail: "Result and public-safe impact summary"
      }
    ]
  );
}

export function getLensSummary(lens: LensId) {
  return lensSummaries[lens];
}

export function getPriorityLabel(project: Project, lens: LensId) {
  if (lens === "balanced") {
    return `Priority ${String(projectIndex(project.slug) + 1).padStart(2, "0")}`;
  }

  const priority = project.viewerPriority[lens];

    return priority ? `${publicPriorityLabel(priority)} for ${capitalize(lens)}` : "Supporting work";
}

export function getProjectProofStats(project: Project) {
  const verifiedLinks = project.links.filter(
    (link) => link.status === "verified"
  ).length;
  const pendingLinks = project.links.filter(
    (link) => link.status !== "verified"
  ).length;
  const pendingMedia = project.media.filter(
    (asset) => asset.status === "pending"
  ).length;

  return {
    evidenceNoteCount: project.evidenceNotes?.length ?? 0,
    verifiedLinks,
    pendingLinks,
    pendingMedia,
    mediaCount: project.media.length,
    skillCount: project.relatedSkills.length,
    credentialCount: project.relatedCredentials.length
  };
}

export function getEvidenceStatusLabel(status: EvidencePublicStatus) {
  return evidenceStatusLabels[status];
}

export function getEvidenceTypeLabel(type: EvidenceType) {
  return evidenceTypeLabels[type];
}

export function getEvidenceConfidenceLabel(confidence: EvidenceConfidence) {
  return evidenceConfidenceLabels[confidence];
}

export function getArchitectureStages(project: Project) {
  return (
    architectureStagesBySlug[project.slug] ?? [
      {
        label: "Problem",
        detail: project.problem,
        tone: "silver"
      },
      {
        label: "System",
        detail: project.architecture,
        tone: "blue"
      },
      {
        label: "Impact",
        detail: project.impact,
        tone: "gold"
      }
    ]
  );
}

export function getAdjacentProjects(slug: string) {
  const orderedProjects = getOrderedProjects("balanced").filter(
    (project) => project.status !== "observed"
  );
  const index = orderedProjects.findIndex((project) => project.slug === slug);

  return {
    previous:
      index > 0 ? orderedProjects[index - 1] : orderedProjects.at(-1) ?? null,
    next:
      index >= 0
        ? orderedProjects[(index + 1) % orderedProjects.length]
        : orderedProjects[0] ?? null
  };
}

export function getFeaturedRank(project: Project) {
  const rank = featuredProjectSlugs.indexOf(project.slug);

  return rank === -1 ? null : rank + 1;
}

function compareProjects(a: Project, b: Project, lens: LensId) {
  if (a.status === "observed" && b.status !== "observed") {
    return 1;
  }

  if (a.status !== "observed" && b.status === "observed") {
    return -1;
  }

  if (lens === "balanced") {
    return projectIndex(a.slug) - projectIndex(b.slug);
  }

  const scoreDelta = viewerScore(b, lens) - viewerScore(a, lens);

  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  const featuredDelta = featuredRank(a) - featuredRank(b);

  if (featuredDelta !== 0) {
    return featuredDelta;
  }

  return projectIndex(a.slug) - projectIndex(b.slug);
}

function viewerScore(project: Project, lens: Viewer) {
  const priority = project.viewerPriority[lens];

  return priority ? priorityScore[priority] : 0;
}

function featuredRank(project: Project) {
  const rank = featuredProjectSlugs.indexOf(project.slug);

  return rank === -1 ? featuredProjectSlugs.length + 1 : rank;
}

function projectIndex(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);

  return index === -1 ? projects.length : index;
}

function capitalize(value: string) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function publicPriorityLabel(priority: Priority) {
  switch (priority) {
    case "high":
      return "Core";
    case "medium":
      return "Supporting";
    case "low":
      return "Background";
  }
}
