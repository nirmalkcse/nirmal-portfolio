import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Database,
  FileText,
  Layers,
  Link as LinkIcon,
  ShieldCheck,
  Workflow
} from "lucide-react";
import type { Project } from "@/data";
import {
  getAdjacentProjects,
  getArchitectureStages,
  getProjectProofStats,
  getProjectStatusTone
} from "./project-case-file-model";
import {
  ExternalProjectLink,
  PublicSafetyNote,
  SectionShell,
  StackTags,
  StatusBadge,
  toneClass
} from "./project-case-file-primitives";

export function ProjectCaseFileDetail({ project }: { project: Project }) {
  const stages = getArchitectureStages(project);
  const adjacentProjects = getAdjacentProjects(project.slug);
  const stats = getProjectProofStats(project);
  const statusTone = getProjectStatusTone(project.status);

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <article className="mx-auto max-w-[var(--layout-wide-max)]">
        <Link
          className="motion-cta mb-6 inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] px-3 text-sm text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
          href="/projects"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Project index
        </Link>

        <header className="motion-section gold-thread-section relative overflow-hidden rounded-[var(--radius-case-file)] border border-[var(--border-gold)] bg-[var(--surface-case-file)] shadow-[var(--shadow-surface)]">
          <div
            aria-hidden="true"
            className={`motion-thread-rail absolute inset-y-0 left-0 w-[var(--case-file-rail-width)] ${toneClass(statusTone, "line")}`}
          />
          <div className="grid gap-8 p-6 pl-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8 lg:pl-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={project.status} />
                <span className="font-mono text-xs uppercase text-[var(--color-warm-silver)]">
                  {project.dates}
                </span>
              </div>
              <p className="mt-5 font-mono text-xs uppercase text-[var(--color-antique-gold)]">
                {project.type}
              </p>
              <h1 className="mt-3 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
                {project.summary}
              </p>
            </div>

            <aside className="grid content-start gap-4">
              <PublicSafetyNote project={project} />
              <dl className="grid grid-cols-2 gap-3">
                <HeroStat label="Links" value={stats.verifiedLinks.toString()} />
                <HeroStat label="Media" value={stats.mediaCount.toString()} />
                <HeroStat label="Skills" value={stats.skillCount.toString()} />
                <HeroStat
                  label="Credentials"
                  value={stats.credentialCount.toString()}
                />
              </dl>
            </aside>
          </div>
        </header>

        <section className="motion-list grid gap-4 py-10 lg:grid-cols-3">
          <StoryPanel
            icon={<Database aria-hidden="true" className="h-5 w-5" />}
            label="Problem"
            text={project.problem}
          />
          <StoryPanel
            icon={<Workflow aria-hidden="true" className="h-5 w-5" />}
            label="System"
            text={project.architecture}
          />
          <StoryPanel
            icon={<Layers aria-hidden="true" className="h-5 w-5" />}
            label="Impact"
            text={project.impact}
          />
        </section>

        <SectionShell eyebrow="Architecture" title="Workflow spine">
          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-console)] p-5">
              <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                System summary
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                {project.architecture}
              </p>
            </div>

            <ol className="motion-list grid gap-3 md:grid-cols-2">
              {stages.map((stage, index) => (
                <li
                  className={`motion-card relative overflow-hidden rounded-[var(--radius-panel)] border bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-5 ${toneClass(stage.tone, "border")}`}
                  key={stage.label}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 ${toneClass(stage.tone, "line")}`}
                  />
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                      Stage {String(index + 1).padStart(2, "0")}
                    </span>
                    <CircleDot
                      aria-hidden="true"
                      className={`h-4 w-4 ${toneClass(stage.tone, "badge")}`}
                    />
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-[1.2] text-[var(--color-ivory)]">
                    {stage.label}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                    {stage.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </SectionShell>

        <SectionShell eyebrow="Technical decisions" title="What shaped the build">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <ul className="motion-list grid gap-3">
              {project.decisions.map((decision) => (
                <li
                  className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4 text-sm leading-6 text-[var(--color-ivory-soft)]"
                  key={decision}
                >
                  {decision}
                </li>
              ))}
            </ul>

            <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-console)] p-5">
              <p className="mb-3 font-mono text-xs uppercase text-[var(--color-champagne)]">
                Stack
              </p>
              <StackTags project={project} />
            </div>
          </div>
        </SectionShell>

        <SectionShell eyebrow="Proof" title="Links, media, and approval queue">
          <div className="grid gap-4 lg:grid-cols-2">
            <ProofPanel project={project} />
            <MediaPanel project={project} />
          </div>
        </SectionShell>

        <SectionShell eyebrow="Boundaries" title="Tradeoffs and public framing">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Sensitivity
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                {project.publicSensitivity}
              </p>
            </div>
            <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-5">
              <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                Tradeoff
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                {project.tradeoffs}
              </p>
            </div>
          </div>
        </SectionShell>

        <SectionShell eyebrow="Related evidence" title="Skills and credentials">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <EvidenceTagList items={project.relatedSkills} label="Skills" />
            <EvidenceTagList
              items={project.relatedCredentials}
              label="Credentials"
            />
          </div>
        </SectionShell>

        <footer className="border-t border-[var(--border-subtle)] py-10">
          <div className="grid gap-4 lg:grid-cols-2">
            {adjacentProjects.previous ? (
              <AdjacentProjectLink
                direction="Previous"
                href={`/projects/${adjacentProjects.previous.slug}`}
                project={adjacentProjects.previous}
              />
            ) : null}
            {adjacentProjects.next ? (
              <AdjacentProjectLink
                direction="Next"
                href={`/projects/${adjacentProjects.next.slug}`}
                project={adjacentProjects.next}
              />
            ) : null}
          </div>
        </footer>
      </article>
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] p-3">
      <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold text-[var(--color-ivory)]">
        {value}
      </dd>
    </div>
  );
}

function StoryPanel({
  icon,
  label,
  text
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <section className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-5">
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
        {icon}
        {label}
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-ivory-soft)]">
        {text}
      </p>
    </section>
  );
}

function ProofPanel({ project }: { project: Project }) {
  return (
    <section className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-console)] p-5">
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
        <LinkIcon aria-hidden="true" className="h-4 w-4" />
        Project links
      </div>
      <div className="mt-4 grid gap-3">
        {project.links.map((link) =>
          link.url ? (
            <div
              className="flex flex-col gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3 sm:flex-row sm:items-center sm:justify-between"
              key={link.label}
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-ivory)]">
                  {link.label}
                </p>
                <p className="mt-1 text-xs text-[var(--color-warm-silver)]">
                  {link.note ?? link.status}
                </p>
              </div>
              <ExternalProjectLink
                ariaLabel={`Open proof for ${project.title}: ${link.label}. Opens in a new tab.`}
                href={link.url}
              >
                Open proof
              </ExternalProjectLink>
            </div>
          ) : (
            <div
              className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
              key={link.label}
            >
              <p className="text-sm font-medium text-[var(--color-ivory)]">
                {link.label}
              </p>
              <p className="mt-1 text-xs text-[var(--color-warm-silver)]">
                {link.note ?? "Public-safe proof pending."}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function MediaPanel({ project }: { project: Project }) {
  return (
    <section className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-console)] p-5">
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
        <FileText aria-hidden="true" className="h-4 w-4" />
        Media
      </div>
      {project.media.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {project.media.map((asset) => (
            <li
              className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
              key={`${asset.label}-${asset.type}`}
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-ivory)]">
                  {asset.label}
                </p>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                  {asset.type}
                </p>
              </div>
              <span className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase text-[var(--color-warm-silver)]">
                {asset.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3 text-sm leading-6 text-[var(--color-warm-silver)]">
          Media review pending.
        </p>
      )}
    </section>
  );
}

function EvidenceTagList({
  items,
  label
}: {
  items: readonly string[];
  label: string;
}) {
  return (
    <section className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-5">
      <p className="mb-3 font-mono text-xs uppercase text-[var(--color-champagne)]">
        {label}
      </p>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-ivory-soft)]"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-warm-silver)]">
          Evidence mapping pending.
        </p>
      )}
    </section>
  );
}

function AdjacentProjectLink({
  direction,
  href,
  project
}: {
  direction: "Previous" | "Next";
  href: string;
  project: Project;
}) {
  return (
    <Link
      className="motion-card motion-cta group flex min-h-32 flex-col justify-between rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-case-file)] p-5 transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)]"
      href={href}
    >
      <span className="font-mono text-xs uppercase text-[var(--color-steel)]">
        {direction} case file
      </span>
      <span className="mt-3 flex items-end justify-between gap-4">
        <span className="text-lg font-semibold leading-[1.2] text-[var(--color-ivory)]">
          {project.title}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--color-champagne)] transition duration-[var(--duration-feedback)] group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
