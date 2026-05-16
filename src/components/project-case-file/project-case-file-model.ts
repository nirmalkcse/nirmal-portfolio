import { featuredProjectSlugs, projects } from "@/data";
import type { Priority, Project, Viewer } from "@/data";

export type LensId = "balanced" | Viewer;

export type ProjectMetric = {
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
  observed: "Observed"
} satisfies Record<Project["status"], string>;

const statusTone = {
  current: "blue",
  complete: "emerald",
  published: "gold",
  observed: "silver"
} satisfies Record<Project["status"], ArchitectureStage["tone"]>;

const lensSummaries = {
  balanced:
    "Default order keeps the three strongest professional proof points first, then opens the research, demo, and supporting analytics trail.",
  recruiter:
    "Recruiter order favors fast fit signals: quantified outcomes, credential-adjacent proof, current work, and clear delivery scope.",
  engineer:
    "Engineer order favors inspectable systems: architecture, platform decisions, workflow depth, and implementation tradeoffs.",
  leader:
    "Leader order favors ownership signals: business impact, governance, validation discipline, and public-safe delivery maturity.",
  explorer:
    "Explorer order widens the trail toward research, AI/data-agent demos, and portfolio-ready experiments."
} satisfies Record<LensId, string>;

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
        "Lakehouse and Warehouse surfaces prepare migrated data for downstream analytics consumption.",
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
        "Fabric and Power BI convert the architecture into an externally inspectable research proof point.",
      tone: "blue"
    }
  ],
  "fabcon25-talk-to-your-data-demo": [
    {
      label: "Lakehouse context",
      detail:
        "Fabric data and semantic models give the conversational surfaces a governed analytical base.",
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
        "Public-safe data keeps the proof inspectable without exposing client or operational records.",
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

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getOrderedProjects(lens: LensId): readonly Project[] {
  return [...projects].sort((a, b) => compareProjects(a, b, lens));
}

export function getCaseFileMetrics(
  projectList: readonly Project[] = projects
): readonly ProjectMetric[] {
  const publicLinks = projectList.flatMap((project) =>
    project.links.filter((link) => link.status === "verified")
  );
  const pendingMedia = projectList.flatMap((project) =>
    project.media.filter((asset) => asset.status === "pending")
  );
  const primaryProjects = projectList.filter(
    (project) => project.status !== "observed"
  );

  return [
    {
      label: "Case files",
      value: primaryProjects.length.toString(),
      detail: "portfolio-ready records"
    },
    {
      label: "Featured",
      value: featuredProjectSlugs.length.toString(),
      detail: "primary proof stories"
    },
    {
      label: "Public links",
      value: publicLinks.length.toString(),
      detail: "verified artifacts"
    },
    {
      label: "Media queue",
      value: pendingMedia.length.toString(),
      detail: "assets to approve"
    }
  ];
}

export function getProjectStatusLabel(status: Project["status"]) {
  return statusLabels[status];
}

export function getProjectStatusTone(status: Project["status"]) {
  return statusTone[status];
}

export function getLensSummary(lens: LensId) {
  return lensSummaries[lens];
}

export function getPriorityLabel(project: Project, lens: LensId) {
  if (lens === "balanced") {
    return `Priority ${String(projectIndex(project.slug) + 1).padStart(2, "0")}`;
  }

  const priority = project.viewerPriority[lens];

  return priority ? `${capitalize(priority)} for ${capitalize(lens)}` : "Support signal";
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
    verifiedLinks,
    pendingLinks,
    pendingMedia,
    mediaCount: project.media.length,
    skillCount: project.relatedSkills.length,
    credentialCount: project.relatedCredentials.length
  };
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
