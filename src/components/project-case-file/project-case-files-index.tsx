"use client";

import Link from "next/link";
import {
  ArrowRight,
  Database,
  FileText,
  Layers,
  SlidersHorizontal,
  Workflow
} from "lucide-react";
import { useMemo } from "react";
import { useRoleLens } from "@/context/role-lens-context";
import type { Project } from "@/data";
import {
  getCaseFileMetrics,
  getFeaturedRank,
  getLensSummary,
  getOrderedProjects,
  getPriorityLabel,
  lensOptions,
  type LensId
} from "./project-case-file-model";
import {
  ProofStatLine,
  PublicSafetyNote,
  StackTags,
  StatusBadge
} from "./project-case-file-primitives";

export function ProjectCaseFilesIndex() {
  const { clearRole, role, setRole } = useRoleLens();
  const activeLens: LensId = role ?? "balanced";
  const orderedProjects = useMemo(
    () => getOrderedProjects(activeLens),
    [activeLens]
  );
  const metrics = getCaseFileMetrics(orderedProjects);
  const primaryProjects = orderedProjects.filter(
    (project) => project.status !== "observed"
  );
  const observedProjects = orderedProjects.filter(
    (project) => project.status === "observed"
  );

  function handleLensChange(lens: LensId) {
    if (lens === "balanced") {
      clearRole();
      return;
    }

    setRole(lens);
  }

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
              Project case files
            </p>
            <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              Proof, told as systems under pressure.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              Each record follows the same spine: problem, system, decisions,
              impact, and the public-safety boundary around what can be shown.
            </p>
          </div>

          <ProjectMetrics metrics={metrics} />
        </header>

        <section
          aria-label="Project ordering lens"
          className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] lg:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Active order
              </div>
              <div className="mt-3 flex flex-wrap gap-2" role="group">
                {lensOptions.map((option) => (
                  <button
                    aria-pressed={activeLens === option.id}
                    className={`motion-lens-choice min-h-10 rounded-[var(--radius-control)] border px-3 text-sm transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
                      activeLens === option.id
                        ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
                        : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
                    }`}
                    key={option.id}
                    onClick={() => handleLensChange(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] px-4 py-3 text-sm leading-6 text-[var(--color-warm-silver)]">
              {getLensSummary(activeLens)}
            </p>
          </div>
        </section>

        <section className="motion-list grid gap-4 xl:grid-cols-3">
          {primaryProjects.map((project) => (
            <ProjectCard
              activeLens={activeLens}
              key={project.slug}
              project={project}
            />
          ))}
        </section>

        {observedProjects.length > 0 ? (
          <section className="border-t border-[var(--border-subtle)] pt-8">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-steel)]">
              <FileText aria-hidden="true" className="h-4 w-4" />
              Backlog candidate
            </div>
            <div className="motion-list grid gap-4 lg:grid-cols-2">
              {observedProjects.map((project) => (
                <ProjectCard
                  activeLens={activeLens}
                  key={project.slug}
                  project={project}
                />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function ProjectMetrics({ metrics }: { metrics: readonly { label: string; value: string; detail: string }[] }) {
  return (
    <dl className="motion-list grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <div
          className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
          key={metric.label}
        >
          <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            {metric.label}
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
            {metric.value}
          </dd>
          <dd className="mt-1 text-xs text-[var(--color-warm-silver)]">
            {metric.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectCard({
  activeLens,
  project
}: {
  activeLens: LensId;
  project: Project;
}) {
  const featuredRank = getFeaturedRank(project);

  return (
    <article className="motion-card motion-case-card group relative flex min-h-[520px] flex-col overflow-hidden rounded-[var(--radius-case-file)] border border-[var(--card-border)] bg-[var(--surface-case-file)] shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] ease-[var(--ease-standard)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:shadow-[var(--shadow-surface)]">
      <div
        aria-hidden="true"
        className="motion-thread-rail absolute inset-y-0 left-0 w-[var(--case-file-rail-width)] bg-[var(--color-antique-gold)]"
      />

      <div className="flex flex-1 flex-col gap-5 p-5 pl-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
              {getPriorityLabel(project, activeLens)}
            </p>
            {featuredRank ? (
              <p className="mt-1 text-xs text-[var(--color-champagne)]">
                Featured proof {featuredRank}
              </p>
            ) : null}
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-warm-silver)]">
            {project.dates} / {project.type}
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
            {project.summary}
          </p>
        </div>

        <div className="grid gap-3">
          <StoryRow icon={<Database aria-hidden="true" className="h-4 w-4" />} label="Problem">
            {project.problem}
          </StoryRow>
          <StoryRow icon={<Workflow aria-hidden="true" className="h-4 w-4" />} label="System">
            {project.architecture}
          </StoryRow>
          <StoryRow icon={<Layers aria-hidden="true" className="h-4 w-4" />} label="Impact">
            {project.impact}
          </StoryRow>
        </div>

        <StackTags limit={5} project={project} />
      </div>

      <div className="border-t border-[var(--border-subtle)] px-5 py-4 pl-6">
        <div className="mb-4">
          <ProofStatLine project={project} />
        </div>
        <div className="mb-4">
          <PublicSafetyNote project={project} />
        </div>
        <Link
          className="motion-cta inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium text-[var(--button-primary-text)] transition duration-[var(--duration-feedback)] hover:border-[var(--color-champagne)]"
          href={`/projects/${project.slug}`}
        >
          Open case file
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition duration-[var(--duration-feedback)] group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

function StoryRow({
  children,
  icon,
  label
}: {
  children: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-2 border-t border-[var(--border-subtle)] pt-3 sm:grid-cols-[110px_minmax(0,1fr)]">
      <div className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase text-[var(--color-champagne)]">
        {icon}
        {label}
      </div>
      <p className="text-sm leading-6 text-[var(--color-ivory-soft)]">
        {children}
      </p>
    </div>
  );
}
