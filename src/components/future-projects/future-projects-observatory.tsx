"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Compass,
  Database,
  FileText,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import {
  futureProjects,
  projects,
  skillClusters,
  timelineEvents,
  type FutureProject
} from "@/data";

type SourceKind = "Project" | "Skill" | "Timeline" | "Reference";

type SourceEvidence = {
  detail: string;
  href: string | null;
  kind: SourceKind;
  label: string;
  slug: string;
};

type FutureProjectView = FutureProject & {
  order: number;
  sources: readonly SourceEvidence[];
};

const FUTURE_DETAIL_PANEL_ID = "future-project-detail-panel";

const roadmapStages = [
  {
    icon: <Database aria-hidden="true" className="h-4 w-4" />,
    label: "Grounded input",
    detail:
      "Each exploration starts from existing portfolio proof, not from a cold idea."
  },
  {
    icon: <ShieldCheck aria-hidden="true" className="h-4 w-4" />,
    label: "Public-safe shaping",
    detail:
      "Client-sensitive edges stay anonymized until a sanitized artifact exists."
  },
  {
    icon: <FileText aria-hidden="true" className="h-4 w-4" />,
    label: "Proof candidate",
    detail:
      "A track earns more weight only when diagrams, screenshots, or walkthroughs are ready."
  }
] as const;

const sourceKindStyles = {
  Project:
    "border-[color-mix(in_srgb,var(--color-antique-gold)_54%,transparent)] text-[var(--color-champagne)]",
  Skill:
    "border-[color-mix(in_srgb,var(--color-signal-blue)_46%,transparent)] text-[var(--color-signal-blue)]",
  Timeline:
    "border-[color-mix(in_srgb,var(--color-success)_42%,transparent)] text-[var(--color-success)]",
  Reference:
    "border-[var(--border-subtle)] text-[var(--color-warm-silver)]"
} satisfies Record<SourceKind, string>;

function uniqueCount(values: readonly string[]) {
  return new Set(values).size;
}

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveSourceBasis(slug: string): SourceEvidence {
  const project = projects.find((item) => item.slug === slug);

  if (project) {
    return {
      detail: project.type,
      href: `/projects/${project.slug}`,
      kind: "Project",
      label: project.title,
      slug
    };
  }

  const skill = skillClusters.find((item) => item.id === slug);

  if (skill) {
    return {
      detail: skill.portfolioRole,
      href: "/projects",
      kind: "Skill",
      label: skill.title,
      slug
    };
  }

  const timelineEvent = timelineEvents.find((item) => item.id === slug);

  if (timelineEvent) {
    return {
      detail: timelineEvent.category,
      href: "/timeline",
      kind: "Timeline",
      label: timelineEvent.title,
      slug
    };
  }

  return {
    detail: "Reference captured in the future-project data model.",
    href: null,
    kind: "Reference",
    label: toTitleCase(slug),
    slug
  };
}

function buildProjectViews(): readonly FutureProjectView[] {
  return futureProjects.map((project, index) => ({
    ...project,
    order: index + 1,
    sources: project.sourceBasis.map(resolveSourceBasis)
  }));
}

function getMetrics(projectViews: readonly FutureProjectView[]) {
  return [
    {
      detail: "all framed as explorations",
      label: "Tracks",
      value: projectViews.length.toString()
    },
    {
      detail: "candidate artifacts named",
      label: "Proof queue",
      value: projectViews
        .reduce((total, project) => total + project.plannedProof.length, 0)
        .toString()
    },
    {
      detail: "existing proof anchors",
      label: "Source basis",
      value: uniqueCount(projectViews.flatMap((project) => project.sourceBasis))
        .toString()
    },
    {
      detail: "possible build surface",
      label: "Stack signals",
      value: uniqueCount(projectViews.flatMap((project) => project.plannedStack))
        .toString()
    }
  ] as const;
}

function statusLabel(status: FutureProject["status"]) {
  if (status === "actively building") {
    return "Actively building";
  }

  return "Currently exploring";
}

function ExplorationBadge({ status }: { status: FutureProject["status"] }) {
  const active = status === "actively building";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none ${
        active
          ? "border-[color-mix(in_srgb,var(--color-success)_52%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]"
          : "border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-[var(--color-success)]" : "bg-[var(--color-antique-gold)]"
        }`}
      />
      {statusLabel(status)}
    </span>
  );
}

function MetricGrid({
  metrics
}: {
  metrics: readonly { detail: string; label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <div
          className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
          key={metric.label}
        >
          <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            {metric.label}
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
            {metric.value}
          </dd>
          <dd className="mt-1 text-xs leading-5 text-[var(--color-warm-silver)]">
            {metric.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SectionLabel({
  children,
  icon
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
      {icon}
      {children}
    </div>
  );
}

function StackTags({
  items,
  limit = items.length
}: {
  items: readonly string[];
  limit?: number;
}) {
  const visibleItems = items.slice(0, limit);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleItems.map((item) => (
        <span
          className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_54%,transparent)] px-2.5 py-1 text-xs text-[var(--color-ivory-soft)]"
          key={item}
        >
          {item}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className="rounded-[var(--radius-control)] border border-[var(--border-cool)] px-2.5 py-1 text-xs text-[var(--color-signal-blue)]">
          +{hiddenCount} more
        </span>
      ) : null}
    </div>
  );
}

function SourceChip({ source }: { source: SourceEvidence }) {
  const className = `inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-control)] border px-2.5 text-xs transition duration-[var(--duration-feedback)] ${sourceKindStyles[source.kind]}`;
  const content = (
    <>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
      />
      <span>{source.label}</span>
    </>
  );

  if (!source.href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      className={`motion-cta ${className} hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory)]`}
      href={source.href}
    >
      {content}
    </Link>
  );
}

function RoadmapStage({
  detail,
  icon,
  index,
  label
}: {
  detail: string;
  icon: ReactNode;
  index: number;
  label: string;
}) {
  return (
    <article className="motion-card relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_68%,transparent)] p-5">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[var(--color-antique-gold)]"
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
          {icon}
          Stage {index + 1}
        </div>
        <span className="font-mono text-xs text-[var(--color-steel)]">
          0{index + 1}
        </span>
      </div>
      <h2 className="mt-4 text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
        {label}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
        {detail}
      </p>
    </article>
  );
}

function ProjectTrackCard({
  isSelected,
  onSelect,
  project
}: {
  isSelected: boolean;
  onSelect: () => void;
  project: FutureProjectView;
}) {
  return (
    <article
      className={`motion-card motion-case-card motion-lens-choice group relative overflow-hidden rounded-[var(--radius-card)] border bg-[var(--card-bg)] shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] ease-[var(--ease-standard)] hover:-translate-y-[var(--motion-distance-xs)] hover:bg-[var(--card-bg-hover)] ${
        isSelected
          ? "border-[var(--border-gold)] shadow-[var(--shadow-gold-trace)]"
          : "border-[var(--card-border)]"
      }`}
    >
      <div
        aria-hidden="true"
        className="motion-thread-rail absolute inset-y-0 left-0 w-[var(--case-file-rail-width)] bg-[var(--color-antique-gold)]"
      />
      <button
        aria-controls={FUTURE_DETAIL_PANEL_ID}
        aria-label={`${project.title}. ${project.status}. ${project.plannedProof.length} proof candidates.`}
        aria-pressed={isSelected}
        className="flex min-h-[430px] w-full flex-col items-start gap-5 p-5 pl-6 text-left"
        onClick={onSelect}
        type="button"
      >
        <div className="flex w-full flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
              Track 0{project.order}
            </p>
            <p className="mt-1 text-xs text-[var(--color-champagne)]">
              {project.plannedProof.length} proof candidates
            </p>
          </div>
          <ExplorationBadge status={project.status} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
            {project.concept}
          </p>
        </div>

        <div className="grid gap-3 border-t border-[var(--border-subtle)] pt-4">
          <SectionLabel
            icon={<Compass aria-hidden="true" className="h-4 w-4" />}
          >
            Why inspect it
          </SectionLabel>
          <p className="text-sm leading-6 text-[var(--color-ivory-soft)]">
            {project.whyItMatters}
          </p>
        </div>

        <div className="mt-auto w-full border-t border-[var(--border-subtle)] pt-4">
          <div className="mb-3 flex items-center gap-2 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            <CircleDot aria-hidden="true" className="h-3.5 w-3.5" />
            Basis
          </div>
          <div className="flex flex-wrap gap-2">
            {project.sources.slice(0, 3).map((source) => (
              <span
                className={`rounded-[var(--radius-control)] border px-2.5 py-1 text-xs ${sourceKindStyles[source.kind]}`}
                key={source.slug}
              >
                {source.kind}
              </span>
            ))}
          </div>
        </div>
      </button>
    </article>
  );
}

function ProofChecklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li
          className="flex gap-3 text-sm leading-6 text-[var(--console-muted)]"
          key={item}
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-1 h-4 w-4 shrink-0 text-[var(--color-antique-gold)]"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function DetailPanel({ project }: { project: FutureProjectView }) {
  const primarySource = project.sources.find((source) => source.href);

  return (
    <aside
      aria-labelledby={`${FUTURE_DETAIL_PANEL_ID}-title`}
      aria-live="polite"
      className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--console-bg)] shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={FUTURE_DETAIL_PANEL_ID}
      role="region"
    >
      <div className="border-b border-[var(--border-gold)] px-5 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Selected exploration
          </span>
          <ExplorationBadge status={project.status} />
        </div>
        <h2
          className="mt-4 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]"
          id={`${FUTURE_DETAIL_PANEL_ID}-title`}
        >
          {project.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--console-muted)]">
          {project.targetOutcome}
        </p>
      </div>

      <div className="space-y-6 px-5 py-5">
        <section>
          <SectionLabel
            icon={<ShieldCheck aria-hidden="true" className="h-4 w-4" />}
          >
            Public-safety stance
          </SectionLabel>
          <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
            Treat this as a direction of travel. It becomes a stronger public
            artifact only after sensitive implementation details are removed
            and the named proof items are reviewable.
          </p>
        </section>

        <section>
          <SectionLabel
            icon={<FileText aria-hidden="true" className="h-4 w-4" />}
          >
            Proof to collect
          </SectionLabel>
          <ProofChecklist items={project.plannedProof} />
        </section>

        <section>
          <SectionLabel
            icon={<Layers3 aria-hidden="true" className="h-4 w-4" />}
          >
            Planned stack signal
          </SectionLabel>
          <div className="mt-3">
            <StackTags items={project.plannedStack} limit={10} />
          </div>
        </section>

        <section>
          <SectionLabel
            icon={<Network aria-hidden="true" className="h-4 w-4" />}
          >
            Source basis
          </SectionLabel>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.sources.map((source) => (
              <SourceChip key={source.slug} source={source} />
            ))}
          </div>
        </section>

        {primarySource?.href ? (
          <Link
            aria-label={`Open grounding proof for ${project.title}`}
            className="motion-cta inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium text-[var(--button-primary-text)] transition duration-[var(--duration-feedback)] hover:border-[var(--color-champagne)]"
            href={primarySource.href}
          >
            Open grounding proof
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

function GuardrailPanel() {
  return (
    <section
      aria-label="Roadmap guardrails"
      className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] lg:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Roadmap posture
          </div>
          <h2 className="mt-3 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            The page records ambition after evidence has a foothold.
          </h2>
        </div>
        <p className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] px-4 py-3 text-sm leading-6 text-[var(--color-warm-silver)]">
          Language stays in the present tense: currently exploring, candidate
          proof, public-safe artifact. Nothing here is presented as shipped
          until a real case file, demo, or verification asset exists.
        </p>
      </div>
    </section>
  );
}

export function FutureProjectsObservatory() {
  const projectViews = useMemo(() => buildProjectViews(), []);
  const metrics = useMemo(() => getMetrics(projectViews), [projectViews]);
  const [selectedSlug, setSelectedSlug] = useState(
    projectViews[0]?.slug ?? ""
  );
  const selectedProject =
    projectViews.find((project) => project.slug === selectedSlug) ??
    projectViews[0];

  if (!selectedProject) {
    return null;
  }

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
              Future Projects Observatory
            </p>
            <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              Ambitious directions, grounded by existing proof.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              A currently-exploring roadmap for public-safe portfolio artifacts.
              Each track starts from work already represented in the case files
              and names the evidence needed before it deserves more weight.
            </p>
          </div>

          <MetricGrid metrics={metrics} />
        </header>

        <GuardrailPanel />

        <section aria-label="Roadmap stages" className="motion-list grid gap-4 lg:grid-cols-3">
          {roadmapStages.map((stage, index) => (
            <RoadmapStage
              detail={stage.detail}
              icon={stage.icon}
              index={index}
              key={stage.label}
              label={stage.label}
            />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="motion-list grid content-start gap-4 lg:grid-cols-3 xl:grid-cols-1">
            {projectViews.map((project) => (
              <ProjectTrackCard
                isSelected={project.slug === selectedProject.slug}
                key={project.slug}
                onSelect={() => setSelectedSlug(project.slug)}
                project={project}
              />
            ))}
          </div>

          <DetailPanel key={selectedProject.slug} project={selectedProject} />
        </section>
      </section>
    </main>
  );
}
