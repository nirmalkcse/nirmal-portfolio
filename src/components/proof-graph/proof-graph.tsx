"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import {
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock3,
  Code2,
  Compass,
  Database,
  ExternalLink,
  FileCheck2,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { useRoleLens } from "@/context/role-lens-context";
import {
  certifications,
  projects,
  proofGraphEdges,
  skillClusters,
  type Certification,
  type Priority,
  type Project,
  type SkillCluster,
  type Viewer,
  type ViewerPriority
} from "@/data";
import { roleOrder } from "@/lib/role-lens";

type ProofRole = Viewer | "balanced";
type ProofNodeKind =
  | "skill"
  | "project"
  | "credential"
  | "metric"
  | "artifact"
  | "practice";
type ProofStrength = "verified" | "strong" | "supported" | "pending";
type ProofLane = "claim" | "proof" | "support";

type ProofNode = {
  id: string;
  label: string;
  kind: ProofNodeKind;
  summary: string;
  detail: string;
  strength: ProofStrength;
  source: string;
  href?: string;
  viewerPriority: ViewerPriority;
};

type ProofEdge = {
  from: string;
  relationship: string;
  to: string;
};

type ProofCluster = {
  id: string;
  title: string;
  shortTitle: string;
  claim: string;
  summary: string;
  viewerPriority: Record<Viewer, Priority>;
  lanes: Record<ProofLane, readonly string[]>;
};

type PositionedNode = ProofNode & {
  lane: ProofLane;
  x: number;
  y: number;
};

type IconComponent = ComponentType<{
  "aria-hidden"?: boolean;
  className?: string;
}>;

const PROOF_CLUSTER_SUMMARY_ID = "proof-cluster-summary";
const PROOF_NODE_DETAIL_ID = "proof-node-detail";

const priorityScore = {
  high: 3,
  medium: 2,
  low: 1
} satisfies Record<Priority, number>;

const roleLabels = {
  balanced: "Balanced",
  recruiter: "Recruiter",
  engineer: "Engineer",
  leader: "Leader",
  explorer: "Explorer"
} satisfies Record<ProofRole, string>;

const roleFilters = [
  { id: "balanced", label: "Balanced", Icon: Network },
  { id: "recruiter", label: "Recruiter", Icon: Users },
  { id: "engineer", label: "Engineer", Icon: Code2 },
  { id: "leader", label: "Leader", Icon: ShieldCheck },
  { id: "explorer", label: "Explorer", Icon: Compass }
] satisfies readonly {
  id: ProofRole;
  label: string;
  Icon: IconComponent;
}[];

const laneLabels = {
  claim: "Capability claim",
  proof: "Field proof",
  support: "Evidence support"
} satisfies Record<ProofLane, string>;

const laneX = {
  claim: 16,
  proof: 50,
  support: 84
} satisfies Record<ProofLane, number>;

const supplementalEvidenceNodes = [
  {
    id: "metric-3-source-systems",
    label: "3 source systems",
    kind: "metric",
    summary: "Telecom Fabric PoC migration scope.",
    detail:
      "Captured as a quantified scope marker for the Fabric migration proof story.",
    strength: "strong",
    source: "Resume extraction and proof graph candidates",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    }
  },
  {
    id: "metric-18-24-daily-incremental-source-tables",
    label: "18-24 daily incremental tables",
    kind: "metric",
    summary: "Daily incremental processing scale.",
    detail:
      "Supports the claim that the migration work handled recurring operational data movement, not a one-off static sample.",
    strength: "strong",
    source: "Resume extraction and proof graph candidates",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    }
  },
  {
    id: "metric-15-plus-reports-validated",
    label: "15+ reports validated",
    kind: "metric",
    summary: "BI parity and validation scale.",
    detail:
      "Shows migration validation across a report set large enough to matter for trust in business numbers.",
    strength: "strong",
    source: "Resume extraction and proof graph candidates",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    id: "metric-90-percent-discrepancy-reduction",
    label: "90% discrepancy reduction",
    kind: "metric",
    summary: "Measured validation improvement.",
    detail:
      "A leader-facing outcome metric for reducing reporting disagreement during modernization.",
    strength: "strong",
    source: "Resume extraction and proof graph candidates",
    viewerPriority: {
      leader: "high",
      recruiter: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    id: "metric-6-tableau-reports-migrated",
    label: "6 Tableau reports migrated",
    kind: "metric",
    summary: "Tableau-to-Power BI migration proof.",
    detail:
      "A concrete migration count that grounds the BI modernization story in shipped report work.",
    strength: "strong",
    source: "Resume extraction and proof graph candidates",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    id: "cdc-scd2-validation-stages",
    label: "CDC / SCD Type 2 validation stages",
    kind: "practice",
    summary: "Hash-based change detection, validity windows, and checks.",
    detail:
      "This is the implementation backbone behind SQL, Spark, and migration reliability claims.",
    strength: "strong",
    source: "Project decisions",
    viewerPriority: {
      engineer: "high",
      recruiter: "medium",
      leader: "medium",
      explorer: "medium"
    }
  },
  {
    id: "review-queues-approval-chains-evidence-packs-decision-lineage",
    label: "Review queues and evidence packs",
    kind: "practice",
    summary: "Approval chains, traceable decisions, and audit-ready packets.",
    detail:
      "A governance workflow proof point for stewardship, lineage, and explainability.",
    strength: "supported",
    source: "iCORE project model",
    viewerPriority: {
      leader: "high",
      engineer: "high",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "developer-productivity-ai-assisted-workflow",
    label: "AI-assisted developer workflow",
    kind: "practice",
    summary: "Copilot familiarity as a supporting workflow signal.",
    detail:
      "Kept as a support node rather than a headline claim until stronger public proof is attached.",
    strength: "pending",
    source: "Credential inventory",
    viewerPriority: {
      explorer: "medium",
      engineer: "medium",
      recruiter: "low",
      leader: "low"
    }
  },
  {
    id: "fabric-architecture-diagram",
    label: "Fabric architecture diagram",
    kind: "artifact",
    summary: "Public-safe diagram still pending.",
    detail:
      "Needed to make the Fabric migration graph inspectable without exposing client-sensitive detail.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      engineer: "high",
      leader: "medium",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "credential-verification-pages",
    label: "Credential verification pages",
    kind: "artifact",
    summary: "Captured and pending verification cleanup.",
    detail:
      "Credential URLs and screenshots remain part of the proof collection queue.",
    strength: "supported",
    source: "Certification console",
    href: "/certifications",
    viewerPriority: {
      recruiter: "high",
      leader: "medium",
      engineer: "medium",
      explorer: "low"
    }
  },
  {
    id: "validation-matrix",
    label: "Validation matrix",
    kind: "artifact",
    summary: "Anonymized BI validation proof pending.",
    detail:
      "Would let the BI trust story show parity checks directly instead of only describing the process.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      leader: "high",
      engineer: "high",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "anonymized-report-before-after-visuals",
    label: "Before / after report visuals",
    kind: "artifact",
    summary: "Public-safe report visuals pending.",
    detail:
      "A visual artifact queue item for showing report reconstruction and migration quality.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      recruiter: "medium",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    }
  },
  {
    id: "sanitized-ui-screenshots",
    label: "Sanitized UI screenshots",
    kind: "artifact",
    summary: "iCORE product screenshots pending public review.",
    detail:
      "Would strengthen the data-product story by showing the workflow surface, not only backend architecture.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      engineer: "high",
      leader: "high",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "entity-resolution-workflow-diagram",
    label: "Entity-resolution workflow diagram",
    kind: "artifact",
    summary: "Workflow diagram pending.",
    detail:
      "Useful for making master entity modeling, review, approval, and lineage flows inspectable.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      engineer: "high",
      leader: "high",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "governance-evidence-pack-diagram",
    label: "Governance evidence-pack diagram",
    kind: "artifact",
    summary: "Audit and evidence diagram pending.",
    detail:
      "Would connect the governance claims to a public-safe diagram of decision evidence and review trails.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      leader: "high",
      engineer: "high",
      recruiter: "medium",
      explorer: "medium"
    }
  },
  {
    id: "ieee-article",
    label: "IEEE article",
    kind: "artifact",
    summary: "Public research publication.",
    detail:
      "The external article is the strongest public artifact in the research lane.",
    strength: "verified",
    source: "Project link",
    href: "https://ieeexplore.ieee.org/document/10544873",
    viewerPriority: {
      explorer: "high",
      engineer: "medium",
      recruiter: "medium",
      leader: "medium"
    }
  },
  {
    id: "fabcon-demo-proof",
    label: "FabCon25 demo proof",
    kind: "artifact",
    summary: "Demo proof pending public-safe media.",
    detail:
      "Recognition and demo material should stay lower emphasis until public-safe evidence is captured.",
    strength: "pending",
    source: "Proof gap",
    viewerPriority: {
      explorer: "high",
      leader: "medium",
      recruiter: "medium",
      engineer: "medium"
    }
  }
] satisfies readonly ProofNode[];

const supplementalEdges = [
  {
    from: "telecom-fabric-migration-poc",
    relationship: "needs artifact",
    to: "fabric-architecture-diagram"
  },
  {
    from: "fabric-data-engineer-associate",
    relationship: "verified through",
    to: "credential-verification-pages"
  },
  {
    from: "databricks-data-engineer-associate",
    relationship: "tracked through",
    to: "credential-verification-pages"
  },
  {
    from: "bi-modernization-semantic-modeling",
    relationship: "supported by",
    to: "insurance-analytics-copilot-data-agent-poc"
  },
  {
    from: "bi-migration-validation-analytics",
    relationship: "needs artifact",
    to: "validation-matrix"
  },
  {
    from: "bi-migration-validation-analytics",
    relationship: "needs artifact",
    to: "anonymized-report-before-after-visuals"
  },
  {
    from: "icore-enterprise-mdm-entity-resolution",
    relationship: "needs artifact",
    to: "sanitized-ui-screenshots"
  },
  {
    from: "product-engineering-data-workflows",
    relationship: "made visible by",
    to: "entity-resolution-workflow-diagram"
  },
  {
    from: "governance-stewardship-auditability",
    relationship: "made inspectable by",
    to: "governance-evidence-pack-diagram"
  },
  {
    from: "ai-assisted-analytics-data-agents",
    relationship: "also demonstrated by",
    to: "insurance-analytics-copilot-data-agent-poc"
  },
  {
    from: "fabcon25-talk-to-your-data-demo",
    relationship: "needs artifact",
    to: "fabcon-demo-proof"
  },
  {
    from: "ieee-semiconductor-chip-analysis-medallion",
    relationship: "published as",
    to: "ieee-article"
  }
] satisfies readonly ProofEdge[];

const proofClusters = [
  {
    id: "data-engineering",
    title: "Data Engineer Credibility",
    shortTitle: "Data Engineering",
    claim:
      "Nirmal can build and validate modern lakehouse data systems in Microsoft Fabric and Databricks.",
    summary:
      "Fabric migration, SQL/Spark validation, quantified scope, and credential support.",
    viewerPriority: {
      recruiter: "high",
      engineer: "high",
      leader: "high",
      explorer: "medium"
    },
    lanes: {
      claim: ["fabric-lakehouse-engineering", "sql-spark-data-quality"],
      proof: [
        "telecom-fabric-migration-poc",
        "fabric-data-engineer-associate",
        "databricks-data-engineer-associate"
      ],
      support: [
        "metric-3-source-systems",
        "metric-18-24-daily-incremental-source-tables",
        "cdc-scd2-validation-stages",
        "fabric-architecture-diagram",
        "credential-verification-pages"
      ]
    }
  },
  {
    id: "bi-trust",
    title: "BI Trust And Modernization",
    shortTitle: "BI Trust",
    claim:
      "Nirmal can migrate BI systems while preserving trust in the numbers.",
    summary:
      "Validation-first BI migration, semantic modeling, and measurable discrepancy reduction.",
    viewerPriority: {
      recruiter: "high",
      leader: "high",
      engineer: "medium",
      explorer: "medium"
    },
    lanes: {
      claim: ["bi-modernization-semantic-modeling"],
      proof: [
        "bi-migration-validation-analytics",
        "insurance-analytics-copilot-data-agent-poc",
        "fabric-analytics-engineer-associate",
        "google-data-analytics-professional"
      ],
      support: [
        "metric-15-plus-reports-validated",
        "metric-90-percent-discrepancy-reduction",
        "metric-6-tableau-reports-migrated",
        "validation-matrix",
        "anonymized-report-before-after-visuals"
      ]
    }
  },
  {
    id: "governed-products",
    title: "Governed Data Product Builder",
    shortTitle: "Governed Products",
    claim:
      "Nirmal can turn data engineering workflows into governed products with usable interfaces.",
    summary:
      "Databricks product workflows, stewardship, review queues, lineage, and auditability.",
    viewerPriority: {
      engineer: "high",
      leader: "high",
      recruiter: "medium",
      explorer: "medium"
    },
    lanes: {
      claim: [
        "databricks-data-product-engineering",
        "governance-stewardship-auditability",
        "product-engineering-data-workflows"
      ],
      proof: [
        "icore-enterprise-mdm-entity-resolution",
        "databricks-uc-upgrade-delivery-specialization"
      ],
      support: [
        "review-queues-approval-chains-evidence-packs-decision-lineage",
        "sanitized-ui-screenshots",
        "entity-resolution-workflow-diagram",
        "governance-evidence-pack-diagram"
      ]
    }
  },
  {
    id: "explorer-research",
    title: "Explorer And Research Signal",
    shortTitle: "Explorer / Research",
    claim:
      "Nirmal is building a hybrid path across data engineering, analytics, AI-assisted BI, and research.",
    summary:
      "Public research, applied data-agent demos, business storytelling, and future-facing proof.",
    viewerPriority: {
      explorer: "high",
      leader: "medium",
      recruiter: "medium",
      engineer: "medium"
    },
    lanes: {
      claim: [
        "ai-assisted-analytics-data-agents",
        "research-business-storytelling"
      ],
      proof: [
        "fabcon25-talk-to-your-data-demo",
        "ieee-semiconductor-chip-analysis-medallion",
        "vitac-skincare-market-analysis",
        "github-copilot"
      ],
      support: [
        "ieee-article",
        "fabcon-demo-proof",
        "developer-productivity-ai-assisted-workflow"
      ]
    }
  }
] satisfies readonly ProofCluster[];

const kindMeta = {
  skill: {
    label: "Skill",
    Icon: Database,
    badge:
      "border-[color-mix(in_srgb,var(--color-signal-blue)_54%,transparent)] text-[var(--color-signal-blue)]"
  },
  project: {
    label: "Project",
    Icon: Briefcase,
    badge:
      "border-[color-mix(in_srgb,var(--color-antique-gold)_58%,transparent)] text-[var(--color-champagne)]"
  },
  credential: {
    label: "Credential",
    Icon: Award,
    badge:
      "border-[color-mix(in_srgb,var(--color-success)_50%,transparent)] text-[var(--color-success)]"
  },
  metric: {
    label: "Metric",
    Icon: BarChart3,
    badge:
      "border-[color-mix(in_srgb,var(--color-champagne)_54%,transparent)] text-[var(--color-champagne)]"
  },
  artifact: {
    label: "Artifact",
    Icon: FileCheck2,
    badge:
      "border-[color-mix(in_srgb,var(--color-warm-silver)_44%,transparent)] text-[var(--color-warm-silver)]"
  },
  practice: {
    label: "Practice",
    Icon: Layers3,
    badge:
      "border-[color-mix(in_srgb,var(--color-deep-emerald)_80%,transparent)] text-[var(--color-success)]"
  }
} satisfies Record<
  ProofNodeKind,
  { label: string; Icon: IconComponent; badge: string }
>;

const strengthMeta = {
  verified: {
    label: "Verified",
    Icon: CheckCircle2,
    color: "text-[var(--color-success)]",
    border: "border-[color-mix(in_srgb,var(--color-success)_48%,transparent)]",
    fill: "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]"
  },
  strong: {
    label: "Strong",
    Icon: Sparkles,
    color: "text-[var(--color-champagne)]",
    border: "border-[var(--border-gold)]",
    fill:
      "bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)]"
  },
  supported: {
    label: "Supported",
    Icon: ShieldCheck,
    color: "text-[var(--color-signal-blue)]",
    border: "border-[var(--border-cool)]",
    fill: "bg-[color-mix(in_srgb,var(--color-signal-blue)_12%,transparent)]"
  },
  pending: {
    label: "Pending",
    Icon: Clock3,
    color: "text-[var(--color-warm-silver)]",
    border: "border-[var(--border-subtle)]",
    fill: "bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)]"
  }
} satisfies Record<
  ProofStrength,
  {
    label: string;
    Icon: IconComponent;
    color: string;
    border: string;
    fill: string;
  }
>;

function priorityForRole(priority: ViewerPriority, role: ProofRole) {
  if (role === "balanced") {
    return "medium";
  }

  return priority[role] ?? "low";
}

function roleScore(priority: ViewerPriority | Record<Viewer, Priority>, role: ProofRole) {
  if (role === "balanced") {
    return Object.values(priority).reduce(
      (total, value) => total + (value ? priorityScore[value] : 0),
      0
    );
  }

  return priorityScore[priority[role] ?? "low"];
}

function topClusterIdForRole(role: ProofRole) {
  return [...proofClusters].sort((a, b) => {
    const scoreDelta =
      roleScore(b.viewerPriority, role) - roleScore(a.viewerPriority, role);

    return scoreDelta || proofClusters.indexOf(a) - proofClusters.indexOf(b);
  })[0].id;
}

function projectStrength(project: Project): ProofStrength {
  if (project.status === "published") {
    return "verified";
  }

  if (project.links.some((link) => link.status === "verified")) {
    return "verified";
  }

  return project.status === "observed" ? "pending" : "strong";
}

function credentialStrength(credential: Certification): ProofStrength {
  if (credential.verificationStatus === "verified") {
    return "verified";
  }

  if (credential.credentialUrl || credential.candidateCredentialUrls?.length) {
    return "supported";
  }

  return "pending";
}

function buildSkillNode(skill: SkillCluster): ProofNode {
  return {
    id: skill.id,
    label: skill.title,
    kind: "skill",
    summary: skill.publicFraming,
    detail: skill.proofPoints.slice(0, 4).join(" / "),
    strength: skill.evidenceStrength === "high" ? "strong" : "supported",
    source: skill.portfolioRole,
    viewerPriority: skill.viewerPriority
  };
}

function buildProjectNode(project: Project): ProofNode {
  return {
    id: project.slug,
    label: project.title,
    kind: "project",
    summary: project.summary,
    detail: project.impact,
    strength: projectStrength(project),
    source: project.type,
    href: `/projects/${project.slug}`,
    viewerPriority: project.viewerPriority
  };
}

function buildCredentialNode(credential: Certification): ProofNode {
  return {
    id: credential.slug,
    label: credential.title,
    kind: "credential",
    summary: `${credential.issuer} / ${credential.category}`,
    detail:
      credential.note ??
      `Verification status: ${credential.verificationStatus.replaceAll("-", " ")}`,
    strength: credentialStrength(credential),
    source: credential.group,
    href: "/certifications",
    viewerPriority: Object.fromEntries(
      roleOrder.map((role) => [
        role,
        credential.relatedProjects.some((slug) =>
          projects.some(
            (project) =>
              project.slug === slug && project.viewerPriority[role] === "high"
          )
        )
          ? "high"
          : "medium"
      ])
    ) as Record<Viewer, Priority>
  };
}

function buildNodeCatalog() {
  return new Map<string, ProofNode>([
    ...skillClusters.map((skill) => [skill.id, buildSkillNode(skill)] as const),
    ...projects.map((project) => [project.slug, buildProjectNode(project)] as const),
    ...certifications.map(
      (credential) => [credential.slug, buildCredentialNode(credential)] as const
    ),
    ...supplementalEvidenceNodes.map((node) => [node.id, node] as const)
  ]);
}

function buildGraphEdges(nodeCatalog: Map<string, ProofNode>) {
  return [...proofGraphEdges, ...supplementalEdges].filter(
    (edge) => nodeCatalog.has(edge.from) && nodeCatalog.has(edge.to)
  );
}

function getClusterNodeIds(cluster: ProofCluster) {
  return Object.values(cluster.lanes).flat();
}

function layoutClusterNodes(
  cluster: ProofCluster,
  nodeCatalog: Map<string, ProofNode>
) {
  return (Object.entries(cluster.lanes) as [ProofLane, readonly string[]][])
    .flatMap(([lane, nodeIds]) => {
      const count = nodeIds.length;

      return nodeIds.map((nodeId, index) => {
        const y = count === 1 ? 50 : 12 + (76 * index) / (count - 1);
        const node = nodeCatalog.get(nodeId);

        if (!node) {
          return null;
        }

        return {
          ...node,
          lane,
          x: laneX[lane],
          y
        };
      });
    })
    .filter((node): node is PositionedNode => Boolean(node));
}

function relatedEdgesForNode(nodeId: string, edges: readonly ProofEdge[]) {
  return edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
}

function getPrimaryNode(cluster: ProofCluster, nodeCatalog: Map<string, ProofNode>) {
  const firstClaimNode = cluster.lanes.claim
    .map((nodeId) => nodeCatalog.get(nodeId))
    .find((node): node is ProofNode => Boolean(node));

  return firstClaimNode ?? nodeCatalog.get(getClusterNodeIds(cluster)[0]);
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-[var(--radius-control)] border px-2 font-mono text-[0.6875rem] uppercase leading-none ${className}`}
    >
      {children}
    </span>
  );
}

function RoleButton({
  active,
  filter,
  onSelect
}: {
  active: boolean;
  filter: (typeof roleFilters)[number];
  onSelect: () => void;
}) {
  const Icon = filter.Icon;

  return (
    <button
      aria-controls={`${PROOF_CLUSTER_SUMMARY_ID} ${PROOF_NODE_DETAIL_ID}`}
      aria-pressed={active}
      className={`motion-lens-choice inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        active
          ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
          : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {filter.label}
    </button>
  );
}

function ClusterButton({
  activeRole,
  cluster,
  isSelected,
  onSelect
}: {
  activeRole: ProofRole;
  cluster: ProofCluster;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const priority = priorityForRole(cluster.viewerPriority, activeRole);

  return (
    <button
      aria-controls={`${PROOF_CLUSTER_SUMMARY_ID} ${PROOF_NODE_DETAIL_ID}`}
      aria-pressed={isSelected}
      className={`motion-card motion-lens-choice min-h-[132px] rounded-[var(--radius-panel)] border p-4 text-left transition duration-[var(--duration-state)] hover:-translate-y-[var(--motion-distance-xs)] ${
        isSelected
          ? "border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,var(--color-carbon))] shadow-[var(--shadow-gold-trace)]"
          : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] hover:border-[var(--border-strong)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase text-[var(--color-champagne)]">
          {cluster.shortTitle}
        </span>
        <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-warm-silver)]">
          {priority}
        </span>
      </span>
      <span className="mt-3 block text-lg font-semibold leading-[1.18] text-[var(--color-ivory)]">
        {cluster.title}
      </span>
      <span className="mt-2 block text-sm leading-6 text-[var(--color-warm-silver)]">
        {cluster.summary}
      </span>
    </button>
  );
}

function NodeCard({
  activeRole,
  node,
  onSelect,
  selected
}: {
  activeRole: ProofRole;
  node: ProofNode;
  onSelect: () => void;
  selected: boolean;
}) {
  const kind = kindMeta[node.kind];
  const strength = strengthMeta[node.strength];
  const KindIcon = kind.Icon;
  const priority = priorityForRole(node.viewerPriority, activeRole);

  return (
    <button
      aria-controls={PROOF_NODE_DETAIL_ID}
      aria-label={`${node.label}, ${kind.label}`}
      aria-pressed={selected}
      className={`motion-card motion-lens-choice group rounded-[var(--radius-panel)] border bg-[color-mix(in_srgb,var(--color-carbon)_86%,transparent)] p-3 text-left shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] hover:-translate-y-[var(--motion-distance-xs)] hover:bg-[var(--surface-panel-hover)] ${strength.border} ${
        selected
          ? "ring-2 ring-[color-mix(in_srgb,var(--color-antique-gold)_70%,transparent)]"
          : ""
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center justify-between gap-2">
        <Badge className={kind.badge}>
          <KindIcon aria-hidden="true" className="h-3.5 w-3.5" />
          {kind.label}
        </Badge>
        <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
          {priority}
        </span>
      </span>
      <span
        className="mt-3 block text-sm font-semibold leading-[1.25] text-[var(--color-ivory)]"
        style={{
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          display: "-webkit-box",
          overflow: "hidden"
        }}
      >
        {node.label}
      </span>
      <span
        className="mt-2 block text-xs leading-5 text-[var(--color-warm-silver)]"
        style={{
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          display: "-webkit-box",
          overflow: "hidden"
        }}
      >
        {node.summary}
      </span>
    </button>
  );
}

function GraphCanvas({
  activeRole,
  cluster,
  edges,
  nodeCatalog,
  onSelectNode,
  selectedNodeId
}: {
  activeRole: ProofRole;
  cluster: ProofCluster;
  edges: readonly ProofEdge[];
  nodeCatalog: Map<string, ProofNode>;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId: string;
}) {
  const positionedNodes = layoutClusterNodes(cluster, nodeCatalog);
  const nodePositions = new Map(positionedNodes.map((node) => [node.id, node]));
  const visibleEdges = edges.filter(
    (edge) => nodePositions.has(edge.from) && nodePositions.has(edge.to)
  );

  return (
    <section className="hidden xl:block">
      <div className="gold-thread-section relative min-h-[900px] overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-signal-blue)_8%,transparent),transparent_28%),var(--surface-console)] p-6 shadow-[var(--shadow-surface)]">
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-6 grid grid-cols-3 gap-4"
        >
          {(Object.keys(laneLabels) as ProofLane[]).map((lane) => (
            <div
              className="border-b border-[var(--border-subtle)] pb-3 text-center font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]"
              key={lane}
            >
              {laneLabels[lane]}
            </div>
          ))}
        </div>

        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1000 900"
        >
          <defs>
            <marker
              id="proof-arrow"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
            </marker>
          </defs>
          {visibleEdges.map((edge) => {
            const from = nodePositions.get(edge.from);
            const to = nodePositions.get(edge.to);

            if (!from || !to) {
              return null;
            }

            const startX = from.x * 10;
            const startY = 90 + from.y * 7.65;
            const endX = to.x * 10;
            const endY = 90 + to.y * 7.65;
            const active =
              selectedNodeId === edge.from || selectedNodeId === edge.to;
            const curve = Math.abs(endX - startX) * 0.42;

            return (
              <path
                className={
                  active
                    ? "motion-proof-edge text-[var(--color-champagne)] opacity-80"
                    : "motion-proof-edge text-[color-mix(in_srgb,var(--color-warm-silver)_38%,transparent)] opacity-40"
                }
                d={`M ${startX} ${startY} C ${startX + curve} ${startY}, ${
                  endX - curve
                } ${endY}, ${endX} ${endY}`}
                fill="none"
                key={`${edge.from}-${edge.relationship}-${edge.to}`}
                markerEnd="url(#proof-arrow)"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={active ? 2.4 : 1.4}
              />
            );
          })}
        </svg>

        {positionedNodes.map((node) => (
          <div
            className="absolute w-[min(28%,17.5rem)] -translate-x-1/2 -translate-y-1/2"
            key={node.id}
            style={{ left: `${node.x}%`, top: `${10 + node.y * 0.85}%` }}
          >
            <NodeCard
              activeRole={activeRole}
              node={node}
              onSelect={() => onSelectNode(node.id)}
              selected={selectedNodeId === node.id}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileEvidenceChain({
  activeRole,
  cluster,
  edges,
  nodeCatalog,
  onSelectNode,
  selectedNodeId
}: {
  activeRole: ProofRole;
  cluster: ProofCluster;
  edges: readonly ProofEdge[];
  nodeCatalog: Map<string, ProofNode>;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId: string;
}) {
  return (
    <section className="motion-list space-y-4 xl:hidden">
      {(Object.entries(cluster.lanes) as [ProofLane, readonly string[]][]).map(
        ([lane, nodeIds]) => (
          <div
            className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
            key={lane}
          >
            <h2 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
              {laneLabels[lane]}
            </h2>
            <div className="mt-3 grid gap-3">
              {nodeIds.map((nodeId) => {
                const node = nodeCatalog.get(nodeId);
                const nodeEdges = relatedEdgesForNode(nodeId, edges).filter(
                  (edge) =>
                    nodeIds.includes(edge.from) ||
                    nodeIds.includes(edge.to) ||
                    getClusterNodeIds(cluster).includes(edge.from) ||
                    getClusterNodeIds(cluster).includes(edge.to)
                );

                if (!node) {
                  return null;
                }

                return (
                  <div className="grid gap-2" key={node.id}>
                    <NodeCard
                      activeRole={activeRole}
                      node={node}
                      onSelect={() => onSelectNode(node.id)}
                      selected={selectedNodeId === node.id}
                    />
                    {nodeEdges.length > 0 ? (
                      <ul className="space-y-1 pl-3">
                        {nodeEdges.slice(0, 2).map((edge) => {
                          const otherId =
                            edge.from === node.id ? edge.to : edge.from;
                          const other = nodeCatalog.get(otherId);

                          return (
                            <li
                              className="border-l border-[var(--border-subtle)] pl-3 text-xs leading-5 text-[var(--color-warm-silver)]"
                              key={`${edge.from}-${edge.relationship}-${edge.to}`}
                            >
                              {edge.relationship}{" "}
                              <span className="text-[var(--color-ivory-soft)]">
                                {other?.label ?? otherId}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </section>
  );
}

function NodeDetail({
  activeRole,
  edges,
  node,
  nodeCatalog
}: {
  activeRole: ProofRole;
  edges: readonly ProofEdge[];
  node: ProofNode;
  nodeCatalog: Map<string, ProofNode>;
}) {
  const kind = kindMeta[node.kind];
  const strength = strengthMeta[node.strength];
  const KindIcon = kind.Icon;
  const StrengthIcon = strength.Icon;
  const relatedEdges = relatedEdgesForNode(node.id, edges);

  return (
    <aside
      aria-labelledby={`${PROOF_NODE_DETAIL_ID}-title`}
      aria-live="polite"
      className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={PROOF_NODE_DETAIL_ID}
      role="region"
    >
      <div className={`border-b ${strength.border} px-5 py-5`}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={kind.badge}>
            <KindIcon aria-hidden="true" className="h-3.5 w-3.5" />
            {kind.label}
          </Badge>
          <Badge className={`${strength.border} ${strength.color}`}>
            <StrengthIcon aria-hidden="true" className="h-3.5 w-3.5" />
            {strength.label}
          </Badge>
        </div>
        <h2
          className="mt-4 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]"
          id={`${PROOF_NODE_DETAIL_ID}-title`}
        >
          {node.label}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
          {node.summary}
        </p>
      </div>

      <div className="space-y-6 px-5 py-5">
        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Source", node.source],
            ["Role fit", priorityForRole(node.viewerPriority, activeRole)],
            ["Node type", kind.label],
            ["Evidence", strength.label]
          ].map(([label, value]) => (
            <div
              className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] p-3"
              key={label}
            >
              <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                {label}
              </dt>
              <dd className="mt-1 text-sm leading-5 text-[var(--color-ivory-soft)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <section>
          <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Proof detail
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--console-muted)]">
            {node.detail}
          </p>
        </section>

        {node.href ? (
          <Link
            aria-label={`Open proof for ${node.label}${
              node.href.startsWith("http") ? " in a new tab" : ""
            }`}
            className="motion-cta inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium text-[var(--button-primary-text)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--color-champagne)]"
            href={node.href}
            rel={node.href.startsWith("http") ? "noreferrer" : undefined}
            target={node.href.startsWith("http") ? "_blank" : undefined}
          >
            Open proof
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}

        <section>
          <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Connected edges
          </h3>
          {relatedEdges.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {relatedEdges.map((edge) => {
                const otherId = edge.from === node.id ? edge.to : edge.from;
                const other = nodeCatalog.get(otherId);
                const direction = edge.from === node.id ? "to" : "from";

                return (
                  <li
                    className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] px-3 py-2 text-sm leading-5 text-[var(--color-warm-silver)]"
                    key={`${edge.from}-${edge.relationship}-${edge.to}`}
                  >
                    <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                      {direction}
                    </span>{" "}
                    <span className="text-[var(--color-champagne)]">
                      {edge.relationship}
                    </span>{" "}
                    <span className="text-[var(--color-ivory-soft)]">
                      {other?.label ?? otherId}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-2 text-sm leading-6 text-[var(--color-warm-silver)]">
              This node is visible as cluster context, but no explicit edge has
              been captured yet.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}

function ClusterMetrics({
  cluster,
  edges,
  nodeCatalog
}: {
  cluster: ProofCluster;
  edges: readonly ProofEdge[];
  nodeCatalog: Map<string, ProofNode>;
}) {
  const nodeIds = getClusterNodeIds(cluster);
  const nodes = nodeIds
    .map((nodeId) => nodeCatalog.get(nodeId))
    .filter((node): node is ProofNode => Boolean(node));
  const visibleEdgeCount = edges.filter(
    (edge) => nodeIds.includes(edge.from) && nodeIds.includes(edge.to)
  ).length;
  const pendingArtifacts = nodes.filter(
    (node) => node.kind === "artifact" && node.strength === "pending"
  ).length;

  return (
    <dl className="motion-list grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        ["Nodes", nodes.length.toString()],
        ["Edges", visibleEdgeCount.toString()],
        ["Strong proof", nodes.filter((node) => node.strength !== "pending").length.toString()],
        ["Proof gaps", pendingArtifacts.toString()]
      ].map(([label, value]) => (
        <div
          className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
          key={label}
        >
          <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            {label}
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ProofGraph() {
  const { clearRole, role, setRole } = useRoleLens();
  const activeRole: ProofRole = role ?? "balanced";
  const [pinnedClusterId, setPinnedClusterId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState("");
  const nodeCatalog = useMemo(() => buildNodeCatalog(), []);
  const graphEdges = useMemo(() => buildGraphEdges(nodeCatalog), [nodeCatalog]);
  const suggestedClusterId = topClusterIdForRole(activeRole);
  const selectedClusterId = pinnedClusterId ?? suggestedClusterId;

  const rankedClusters = useMemo(
    () =>
      [...proofClusters].sort((a, b) => {
        const scoreDelta =
          roleScore(b.viewerPriority, activeRole) -
          roleScore(a.viewerPriority, activeRole);

        return scoreDelta || proofClusters.indexOf(a) - proofClusters.indexOf(b);
      }),
    [activeRole]
  );

  const selectedCluster =
    proofClusters.find((cluster) => cluster.id === selectedClusterId) ??
    rankedClusters[0];
  const primaryNode = getPrimaryNode(selectedCluster, nodeCatalog);
  const effectiveSelectedNodeId =
    selectedNodeId && getClusterNodeIds(selectedCluster).includes(selectedNodeId)
      ? selectedNodeId
      : primaryNode?.id ?? "";

  const selectedNode =
    nodeCatalog.get(effectiveSelectedNodeId) ??
    primaryNode ??
    nodeCatalog.values().next().value;

  function handleRoleSelect(nextRole: ProofRole) {
    setPinnedClusterId(null);
    setSelectedNodeId("");

    if (nextRole === "balanced") {
      clearRole();
      return;
    }

    setRole(nextRole);
  }

  function handleClusterSelect(clusterId: string) {
    const nextCluster =
      proofClusters.find((cluster) => cluster.id === clusterId) ?? selectedCluster;
    const nextPrimaryNode = getPrimaryNode(nextCluster, nodeCatalog);

    setPinnedClusterId(clusterId);
    setSelectedNodeId(nextPrimaryNode?.id ?? "");
  }

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
              Proof graph
            </p>
            <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              Skills connected to the evidence that earns them.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              A role-aware graph of skill clusters, project proof, credentials,
              metrics, and the public-safe artifacts still waiting to be
              collected.
            </p>
          </div>

          <div className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]">
            <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
              Active lens
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
              {roleLabels[activeRole]}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
              {selectedCluster.claim}
            </p>
          </div>
        </header>

        <section
          aria-label="Proof graph filters"
          className="motion-panel-enter grid gap-4 rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <div>
            <p className="mb-3 font-mono text-xs uppercase text-[var(--color-champagne)]">
              Role filter
            </p>
            <div className="flex flex-wrap gap-2">
              {roleFilters.map((filter) => (
                <RoleButton
                  active={activeRole === filter.id}
                  filter={filter}
                  key={filter.id}
                  onSelect={() => handleRoleSelect(filter.id)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-4">
            <p className="mb-3 font-mono text-xs uppercase text-[var(--color-champagne)]">
              Evidence cluster
            </p>
            <div className="motion-list grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {rankedClusters.map((cluster) => (
                <ClusterButton
                  activeRole={activeRole}
                  cluster={cluster}
                  isSelected={selectedCluster.id === cluster.id}
                  key={cluster.id}
                  onSelect={() => handleClusterSelect(cluster.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <ClusterMetrics
          cluster={selectedCluster}
          edges={graphEdges}
          nodeCatalog={nodeCatalog}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="grid gap-4">
            <div
              aria-labelledby={`${PROOF_CLUSTER_SUMMARY_ID}-title`}
              aria-live="polite"
              className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5"
              id={PROOF_CLUSTER_SUMMARY_ID}
              key={selectedCluster.id}
              role="region"
            >
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                {selectedCluster.title}
              </p>
              <h2
                className="mt-2 text-2xl font-semibold leading-[1.18] text-[var(--color-ivory)]"
                id={`${PROOF_CLUSTER_SUMMARY_ID}-title`}
              >
                {selectedCluster.claim}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-warm-silver)]">
                {selectedCluster.summary}
              </p>
            </div>

            <GraphCanvas
              activeRole={activeRole}
              cluster={selectedCluster}
              edges={graphEdges}
              nodeCatalog={nodeCatalog}
              onSelectNode={setSelectedNodeId}
              selectedNodeId={effectiveSelectedNodeId}
            />
            <MobileEvidenceChain
              activeRole={activeRole}
              cluster={selectedCluster}
              edges={graphEdges}
              nodeCatalog={nodeCatalog}
              onSelectNode={setSelectedNodeId}
              selectedNodeId={effectiveSelectedNodeId}
            />
          </div>

          {selectedNode ? (
            <NodeDetail
              activeRole={activeRole}
              edges={graphEdges}
              key={selectedNode.id}
              node={selectedNode}
              nodeCatalog={nodeCatalog}
            />
          ) : null}
        </section>
      </section>
    </main>
  );
}
