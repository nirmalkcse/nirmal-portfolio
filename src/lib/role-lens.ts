import {
  certifications,
  featuredProjectSlugs,
  futureProjects,
  profile,
  projects,
  skillClusters,
  timelineEvents,
  type Certification,
  type FutureProject,
  type Priority,
  type Project,
  type SkillCluster,
  type TimelineEvent,
  type Viewer
} from "@/data";

export type RoleLens = Viewer | null;

export type RoleCta = {
  label: string;
  href: string;
  emphasis: "primary" | "secondary" | "tertiary";
};

export type RoleEvidence = {
  kind: "Project" | "Skill" | "Credential" | "Timeline" | "Future";
  label: string;
  detail: string;
  href: string;
};

export type LensDisplayModel = {
  role: RoleLens;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  nextStep: string;
  ctas: readonly RoleCta[];
  evidence: readonly RoleEvidence[];
};

export type RoleGatewayModel = LensDisplayModel & {
  role: Viewer;
  cardTitle: string;
  cardSummary: string;
  cardProofLabel: string;
  cardProofValue: string;
};

export const roleOrder = [
  "recruiter",
  "engineer",
  "leader",
  "explorer"
] as const satisfies readonly Viewer[];

const roleSet = new Set<string>(roleOrder);

export function isViewer(value: unknown): value is Viewer {
  return typeof value === "string" && roleSet.has(value);
}

const priorityScore = {
  high: 3,
  medium: 2,
  low: 1
} satisfies Record<Priority, number>;

const projectCatalog: readonly Project[] = projects;
const featuredProjectCatalog: readonly string[] = featuredProjectSlugs;

const roleDefinitions = {
  recruiter: {
    label: "Recruiter",
    eyebrow: "Fast fit check",
    title: "Hiring signals in the first pass.",
    cardTitle: "Shortlist clarity",
    cardSummary:
      "Credentials, current role context, quantified outcomes, and a clear resume route.",
    cardProofLabel: "Primary signal",
    cardProofValue: "Fabric, Databricks, 15+ reports, 90% discrepancy reduction",
    nextStep:
      "Prioritize resume, credentials, quantified outcomes, and the three strongest professional case studies.",
    ctas: [
      { label: "Download Resume", href: "/resume", emphasis: "primary" },
      { label: "View Credentials", href: "/certifications", emphasis: "secondary" },
      { label: "Contact Nirmal", href: "/profile", emphasis: "tertiary" }
    ]
  },
  engineer: {
    label: "Engineer",
    eyebrow: "Implementation depth",
    title: "Architecture, tradeoffs, and decisions you can inspect.",
    cardTitle: "Technical review path",
    cardSummary:
      "Data product architecture, SQL/Spark decisions, APIs, governance, and anonymized project context.",
    cardProofLabel: "Primary signal",
    cardProofValue: "Databricks Apps, Fabric, CDC/SCD2, SQL Warehouse",
    nextStep:
      "Move toward case studies, architecture decisions, the skill map, and technical implementation notes.",
    ctas: [
      {
        label: "Inspect Architecture",
        href: "/projects/icore-enterprise-mdm-entity-resolution",
        emphasis: "primary"
      },
      { label: "View Case Studies", href: "/projects", emphasis: "secondary" },
      { label: "Open Profile", href: "/profile", emphasis: "tertiary" }
    ]
  },
  leader: {
    label: "Leader",
    eyebrow: "Ownership and trust",
    title: "Outcomes, governance, and delivery maturity.",
    cardTitle: "Impact review",
    cardSummary:
      "Validation discipline, stewardship workflows, auditability, and business-facing modernization.",
    cardProofLabel: "Primary signal",
    cardProofValue: "Governance, RBAC, audit logging, discrepancy reduction",
    nextStep:
      "Emphasize business impact, reliability, governed workflows, and client-safe case summaries.",
    ctas: [
      {
        label: "View Impact",
        href: "/projects/bi-migration-validation-analytics",
        emphasis: "primary"
      },
      { label: "Review Case Studies", href: "/projects", emphasis: "secondary" },
      { label: "Contact Nirmal", href: "/profile", emphasis: "tertiary" }
    ]
  },
  explorer: {
    label: "Explorer",
    eyebrow: "Full arc",
    title: "The wider path across systems, research, demos, and what is next.",
    cardTitle: "Curiosity trail",
    cardSummary:
      "Timeline, IEEE research, AI-assisted analytics demos, and currently exploring work.",
    cardProofLabel: "Primary signal",
    cardProofValue: "IEEE research, FabCon25 demo, current learning roadmap",
    nextStep:
      "Open the broader timeline and current learning roadmap without letting speculative work outrank built systems.",
    ctas: [
      { label: "Explore Timeline", href: "/timeline", emphasis: "primary" },
      {
        label: "Read Research",
        href: "/projects/ieee-semiconductor-chip-analysis-medallion",
        emphasis: "secondary"
      },
      { label: "Open Current Learning", href: "/future-projects", emphasis: "tertiary" }
    ]
  }
} satisfies Record<
  Viewer,
  Omit<RoleGatewayModel, "role" | "summary" | "evidence">
>;

function viewerScore(
  item: { viewerPriority: Partial<Record<Viewer, Priority>> },
  role: Viewer
) {
  const priority = item.viewerPriority[role];

  return priority ? priorityScore[priority] : 0;
}

function projectRank(project: Project) {
  const featuredIndex = featuredProjectCatalog.indexOf(project.slug);

  if (featuredIndex === -1) {
    return featuredProjectCatalog.length + 1;
  }

  return featuredIndex;
}

export function getProjectsForRole(role: Viewer, limit = 3): readonly Project[] {
  return [...projects]
    .filter((project) => project.status !== "observed")
    .sort((a, b) => {
      const scoreDelta = viewerScore(b, role) - viewerScore(a, role);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return projectRank(a) - projectRank(b);
    })
    .slice(0, limit);
}

export function getSkillClustersForRole(
  role: Viewer,
  limit = 3
): readonly SkillCluster[] {
  return [...skillClusters]
    .sort((a, b) => {
      const scoreDelta = viewerScore(b, role) - viewerScore(a, role);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return a.priority - b.priority;
    })
    .slice(0, limit);
}

export function getTimelineEventsForRole(
  role: Viewer,
  limit = 2
): readonly TimelineEvent[] {
  return [...timelineEvents]
    .sort((a, b) => {
      const scoreDelta = viewerScore(b, role) - viewerScore(a, role);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return importanceScore(b.importance) - importanceScore(a.importance);
    })
    .slice(0, limit);
}

export function getCertificationsForRole(
  role: Viewer,
  limit = 2
): readonly Certification[] {
  const projectSlugs = new Set(
    getProjectsForRole(role, 4).map(({ slug }) => slug)
  );

  return certifications
    .filter((credential) =>
      credential.relatedProjects.some((slug) => projectSlugs.has(slug))
    )
    .slice(0, limit);
}

export function getFutureProjectsForRole(
  role: Viewer,
  limit = 2
): readonly FutureProject[] {
  if (role !== "explorer") {
    return [];
  }

  return futureProjects.slice(0, limit);
}

export function getRoleGatewayModel(role: Viewer): RoleGatewayModel {
  const definition = roleDefinitions[role];

  return {
    ...definition,
    role,
    summary: profile.viewerPositioning[role],
    evidence: buildEvidenceForRole(role)
  };
}

export function getBalancedGatewayModel(): LensDisplayModel {
  const balancedProjects = featuredProjectSlugs
    .map((slug) => projectCatalog.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  return {
    role: null,
    label: "Balanced",
    eyebrow: "Default path",
    title: "A balanced portfolio path stays active.",
    summary:
      "No gate is applied. The page keeps the core data engineering story first while leaving recruiter, engineer, leader, and explorer paths available.",
    nextStep:
      "Continue with the default review order: data engineering credibility, project case studies, skill map, timeline, credentials, and resume/contact.",
    ctas: [
      { label: "View Skill Map", href: "/proof", emphasis: "primary" },
      { label: "Download Resume", href: "/resume", emphasis: "secondary" },
      { label: "Inspect Credentials", href: "/certifications", emphasis: "tertiary" }
    ],
    evidence: [
      ...balancedProjects.slice(0, 3).map((project) => projectToEvidence(project)),
      skillToEvidence(skillClusters[0]),
      credentialToEvidence(certifications[0])
    ].slice(0, 5)
  };
}

function buildEvidenceForRole(role: Viewer): readonly RoleEvidence[] {
  const projectsForRole = getProjectsForRole(role, 2).map((project) =>
    projectToEvidence(project)
  );
  const skillsForRole = getSkillClustersForRole(role, 2).map((skill) =>
    skillToEvidence(skill)
  );
  const credentialsForRole = getCertificationsForRole(role, 1).map(
    (credential) => credentialToEvidence(credential)
  );
  const timelineForRole = getTimelineEventsForRole(role, 1).map((event) =>
    timelineToEvidence(event)
  );
  const futureForRole = getFutureProjectsForRole(role, 1).map((futureProject) =>
    futureToEvidence(futureProject)
  );

  return [
    ...projectsForRole,
    ...skillsForRole,
    ...credentialsForRole,
    ...timelineForRole,
    ...futureForRole
  ].slice(0, 5);
}

function projectToEvidence(project: Project): RoleEvidence {
  return {
    kind: "Project",
    label: project.title,
    detail: project.impact,
    href: `/projects/${project.slug}`
  };
}

function skillToEvidence(skill: SkillCluster): RoleEvidence {
  return {
    kind: "Skill",
    label: skill.title,
    detail: skill.proofPoints.slice(0, 2).join(" + "),
    href: "/projects"
  };
}

function credentialToEvidence(credential: Certification): RoleEvidence {
  return {
    kind: "Credential",
    label: credential.title,
    detail: `${credential.issuer} - ${credentialStatusLabel(
      credential.verificationStatus
    )}`,
    href: "/certifications"
  };
}

function timelineToEvidence(event: TimelineEvent): RoleEvidence {
  return {
    kind: "Timeline",
    label: event.title,
    detail: event.description,
    href: "/timeline"
  };
}

function futureToEvidence(futureProject: FutureProject): RoleEvidence {
  return {
    kind: "Future",
    label: futureProject.title,
    detail: `${futureProject.status}: ${futureProject.targetOutcome}`,
    href: "/future-projects"
  };
}

function importanceScore(importance: TimelineEvent["importance"]) {
  switch (importance) {
    case "very-high":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}

function credentialStatusLabel(status: Certification["verificationStatus"]) {
  switch (status) {
    case "verified":
      return "verified";
    case "link-captured":
      return "public link available";
    case "resume-claimed":
      return "public link to add";
  }
}
