import {
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Code2,
  Compass,
  Database,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import type { ComponentType } from "react";
import {
  certifications,
  projects,
  skillClusters,
  type Certification,
  type Priority,
  type Project,
  type SkillCluster,
  type Viewer,
  type ViewerPriority
} from "@/data";
import { roleOrder } from "@/lib/role-lens";

// -----------------------------------------------------------------------------
// Core Types
// -----------------------------------------------------------------------------

export type RoleFilter = Viewer | "balanced";

export type SkillKind =
  | "technology"
  | "project"
  | "credential"
  | "metric"
  | "practice";

export type ExpertiseLevel = "mastered" | "advanced" | "proficient" | "learning";

export type SkillItem = {
  id: string;
  label: string;
  kind: SkillKind;
  summary: string;
  detail: string;
  level: ExpertiseLevel;
  source: string;
  href?: string;
  viewerPriority: ViewerPriority;
};

export type ExpertiseDomain = {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  viewerPriority: Record<Viewer, Priority>;
  items: readonly string[];
};

export type IconComponent = ComponentType<{
  "aria-hidden"?: boolean;
  className?: string;
}>;

// -----------------------------------------------------------------------------
// UI Configuration
// -----------------------------------------------------------------------------

export const priorityScore: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export const roleFilters: readonly {
  id: RoleFilter;
  label: string;
  Icon: IconComponent;
}[] = [
  { id: "balanced", label: "Overview", Icon: Network },
  { id: "recruiter", label: "Recruiter", Icon: Users },
  { id: "engineer", label: "Engineering", Icon: Code2 },
  { id: "leader", label: "Leadership", Icon: ShieldCheck },
  { id: "explorer", label: "Research", Icon: Compass }
];

export const kindMeta: Record<SkillKind, { label: string; Icon: IconComponent }> = {
  technology: { label: "Technology", Icon: Database },
  project: { label: "Case File", Icon: Briefcase },
  credential: { label: "Certification", Icon: Award },
  metric: { label: "Impact", Icon: BarChart3 },
  practice: { label: "Methodology", Icon: Layers3 }
};

export const levelMeta: Record<ExpertiseLevel, { label: string; Icon: IconComponent }> = {
  mastered: { label: "Mastered", Icon: CheckCircle2 },
  advanced: { label: "Advanced", Icon: Sparkles },
  proficient: { label: "Proficient", Icon: ShieldCheck },
  learning: { label: "Exploratory", Icon: Compass }
};

// -----------------------------------------------------------------------------
// Data Synthesis
// -----------------------------------------------------------------------------

const supplementalSkills: readonly SkillItem[] = [
  {
    id: "metric-3-source-systems",
    label: "3 source systems",
    kind: "metric",
    summary: "Telecom Fabric PoC migration scope.",
    detail: "A quantified scope marker for the Fabric migration story.",
    level: "advanced",
    source: "Resume",
    viewerPriority: { recruiter: "high", engineer: "high", leader: "high", explorer: "medium" }
  },
  {
    id: "metric-90-percent-discrepancy-reduction",
    label: "90% discrepancy reduction",
    kind: "metric",
    summary: "Measured validation improvement.",
    detail: "A leader-facing outcome metric for reducing reporting disagreement.",
    level: "mastered",
    source: "Resume",
    viewerPriority: { leader: "high", recruiter: "high", engineer: "medium", explorer: "medium" }
  },
  {
    id: "cdc-scd2-validation-stages",
    label: "CDC / SCD Type 2 validation stages",
    kind: "practice",
    summary: "Hash-based change detection and validity checks.",
    detail: "Implementation backbone behind SQL, Spark, and migration reliability.",
    level: "advanced",
    source: "Methodology",
    viewerPriority: { engineer: "high", recruiter: "medium", leader: "medium", explorer: "medium" }
  },
  {
    id: "review-queues-approval-chains",
    label: "Stewardship workflows",
    kind: "practice",
    summary: "Approval chains, traceable decisions, and evidence trails.",
    detail: "A governance workflow point for stewardship and explainability.",
    level: "proficient",
    source: "Governance",
    viewerPriority: { leader: "high", engineer: "high", recruiter: "medium", explorer: "medium" }
  }
];

export const expertiseDomains: readonly ExpertiseDomain[] = [
  {
    id: "data-engineering",
    title: "Data Engineering",
    shortTitle: "Engineering",
    tagline: "Building modern lakehouse data systems.",
    summary: "Specialized in Microsoft Fabric and Databricks architecture, ensuring highly scalable, governed, and performant data processing pipelines.",
    viewerPriority: { recruiter: "high", engineer: "high", leader: "high", explorer: "medium" },
    items: [
      "fabric-lakehouse-engineering",
      "sql-spark-data-quality",
      "telecom-fabric-migration-poc",
      "fabric-data-engineer-associate",
      "databricks-data-engineer-associate",
      "metric-3-source-systems",
      "cdc-scd2-validation-stages"
    ]
  },
  {
    id: "bi-trust",
    title: "BI Modernization",
    shortTitle: "BI Validation",
    tagline: "Migrating BI systems while preserving trust.",
    summary: "Validation-first BI migration emphasizing rigorous semantic modeling and measurable discrepancy reduction across enterprise reports.",
    viewerPriority: { recruiter: "high", leader: "high", engineer: "medium", explorer: "medium" },
    items: [
      "bi-modernization-semantic-modeling",
      "bi-migration-validation-analytics",
      "fabric-analytics-engineer-associate",
      "metric-90-percent-discrepancy-reduction"
    ]
  },
  {
    id: "governed-products",
    title: "Governed Data",
    shortTitle: "Governance",
    tagline: "Turning workflows into governed products.",
    summary: "Transforming ad-hoc engineering workflows into structured, auditable data products with clear lineage and usable interfaces.",
    viewerPriority: { engineer: "high", leader: "high", recruiter: "medium", explorer: "medium" },
    items: [
      "databricks-data-product-engineering",
      "governance-stewardship-auditability",
      "icore-enterprise-mdm-entity-resolution",
      "review-queues-approval-chains"
    ]
  },
  {
    id: "research",
    title: "Research & AI",
    shortTitle: "Exploration",
    tagline: "Connecting engineering with AI-assisted research.",
    summary: "Exploring applied data-agent demos, business storytelling, and authoring public research to push the boundaries of data.",
    viewerPriority: { explorer: "high", leader: "medium", recruiter: "medium", engineer: "medium" },
    items: [
      "ai-assisted-analytics-data-agents",
      "fabcon25-talk-to-your-data-demo",
      "ieee-semiconductor-chip-analysis-medallion"
    ]
  }
];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

export function priorityForRole(priority: ViewerPriority, role: RoleFilter) {
  if (role === "balanced") return "medium";
  return priority[role] ?? "low";
}

export function roleScore(priority: ViewerPriority | Record<Viewer, Priority>, role: RoleFilter) {
  if (role === "balanced") {
    return Object.values(priority).reduce((total, value) => total + (value ? priorityScore[value as Priority] : 0), 0);
  }
  return priorityScore[priority[role as keyof typeof priority] as Priority ?? "low"];
}

function determineProjectLevel(project: Project): ExpertiseLevel {
  return project.status === "published" || project.links.some(l => l.status === "verified")
    ? "mastered"
    : "advanced";
}

function determineCredentialLevel(credential: Certification): ExpertiseLevel {
  return credential.verificationStatus === "verified" ? "mastered" : "proficient";
}

function buildSkillItem(skill: SkillCluster): SkillItem {
  return {
    id: skill.id,
    label: skill.title,
    kind: "technology",
    summary: skill.publicFraming,
    detail: skill.proofPoints.slice(0, 3).join(" • "),
    level: skill.evidenceStrength === "high" ? "mastered" : "advanced",
    source: skill.portfolioRole,
    viewerPriority: skill.viewerPriority
  };
}

function buildProjectItem(project: Project): SkillItem {
  return {
    id: project.slug,
    label: project.title,
    kind: "project",
    summary: project.summary,
    detail: project.impact,
    level: determineProjectLevel(project),
    source: project.type,
    href: `/projects/${project.slug}`,
    viewerPriority: project.viewerPriority
  };
}

function buildCredentialItem(credential: Certification): SkillItem {
  return {
    id: credential.slug,
    label: credential.title,
    kind: "credential",
    summary: `${credential.issuer} • ${credential.category}`,
    detail: credential.note ?? `Status: ${credential.verificationStatus}`,
    level: determineCredentialLevel(credential),
    source: credential.group,
    href: "/certifications",
    viewerPriority: Object.fromEntries(
      roleOrder.map((role) => [
        role,
        credential.relatedProjects.some((slug) =>
          projects.some((project) => project.slug === slug && project.viewerPriority[role] === "high")
        ) ? "high" : "medium"
      ])
    ) as Record<Viewer, Priority>
  };
}

export function buildSkillCatalog() {
  return new Map<string, SkillItem>([
    ...skillClusters.map((skill) => [skill.id, buildSkillItem(skill)] as const),
    ...projects.map((project) => [project.slug, buildProjectItem(project)] as const),
    ...certifications.map((credential) => [credential.slug, buildCredentialItem(credential)] as const),
    ...supplementalSkills.map((skill) => [skill.id, skill] as const)
  ]);
}
