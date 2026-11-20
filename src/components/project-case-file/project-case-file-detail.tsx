import Link from "next/link";
import { RecognitionSeal } from "@/components/signature/recognition-seal";
import { brickbuilderRecognition } from "@/data/recognition";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CircleDot,
  Database,
  FileDown,
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
  getProjectHeroStats,
  getProjectProofStats,
  getProjectStatusTone
} from "./project-case-file-model";
import {
  EvidenceNoteCard,
  ExternalProjectLink,
  SectionShell,
  StackTags,
  StatusBadge,
  toneClass
} from "./project-case-file-primitives";
import { CaseDetailHeroShell } from "./project-case-detail-presence";

type CaseFileReadingPathItem = {
  detail: string;
  id: string;
  label: string;
};

function getCaseFileReadingPath(project: Project): CaseFileReadingPathItem[] {
  const evidenceNoteCount = project.evidenceNotes?.length ?? 0;
  const path = [
    {
      detail: `${project.stack.length} stack signals`,
      id: "workflow-overview",
      label: "Architecture"
    },
    {
      detail: `${project.decisions.length} build choices`,
      id: "build-decisions",
      label: "Decisions"
    },
    {
      detail: `${project.links.length} references / ${project.media.length} artifacts`,
      id: "proof-artifacts",
      label: "Proof"
    }
  ];

  if (evidenceNoteCount > 0) {
    path.push({
      detail: `${evidenceNoteCount} public notes`,
      id: "evidence-notes",
      label: "Shareable notes"
    });
  }

  path.push(
    {
      detail: "Sensitivity and tradeoffs",
      id: "public-context",
      label: "Context"
    },
    {
      detail: `${project.relatedSkills.length} skills / ${project.relatedCredentials.length} credentials`,
      id: "related-work",
      label: "Related proof"
    }
  );

  return path;
}

export function ProjectCaseFileDetail({ project }: { project: Project }) {
  const stages = getArchitectureStages(project);
  const adjacentProjects = getAdjacentProjects(project.slug);
  const heroStats = getProjectHeroStats(project);
  const proofStats = getProjectProofStats(project);
  const readingPath = getCaseFileReadingPath(project);
  const statusTone = getProjectStatusTone(project.status);

  return (
    <main
      className="project-case-detail-page min-h-screen px-[var(--layout-gutter)] pb-10 pt-[calc(var(--site-header-offset)+var(--space-5))]"
      id="main-content"
      tabIndex={-1}
    >
      <article className="mx-auto max-w-[var(--layout-wide-max)]">
        <Link
          className="motion-cta mb-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border-luxury)] bg-[var(--surface-panel)] px-4 text-sm text-[var(--color-ink)] shadow-[var(--shadow-surface)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ink-strong)]"
          href="/projects"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Project studies
        </Link>

        <CaseDetailHeroShell railClassName={toneClass(statusTone, "line")}>
          <div className="relative z-10 grid gap-8 p-6 pl-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8 lg:pl-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={project.status} />
                <span className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">
                  {project.dates}
                </span>
              </div>
              <p className="mt-5 font-mono text-xs uppercase text-[var(--color-antique-gold)]">
                {project.type}
              </p>
              <h1 className="editorial-title editorial-title--section mt-3 max-w-4xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--color-ink-muted)] sm:text-lg">
                {project.summary}
              </p>
              {project.slug === brickbuilderRecognition.projectSlug ? (
                <RecognitionSeal className="mt-6" />
              ) : null}
            </div>

            <aside className="grid content-start gap-4">
              <dl className="grid grid-cols-2 gap-3">
                {heroStats.map((stat) => (
                  <HeroStat
                    detail={stat.detail}
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                  />
                ))}
              </dl>
            </aside>
          </div>
        </CaseDetailHeroShell>

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

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <div className="relative hidden self-stretch lg:block">
            <div className="sticky top-[var(--site-header-offset)]">
              <CaseFileWayfinder
                project={project}
                proofStats={proofStats}
                readingPath={readingPath}
              />
            </div>
          </div>

          <div>
            <SectionShell
              eyebrow="Architecture"
              id="workflow-overview"
              title="Workflow overview"
            >
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
                      className={`motion-card relative overflow-hidden rounded-[var(--radius-panel)] border bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-5 ${toneClass(stage.tone, "border")}`}
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

            <SectionShell
              eyebrow="Technical decisions"
              id="build-decisions"
              title="What shaped the build"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                <ul className="motion-list grid gap-3">
                  {project.decisions.map((decision) => (
                    <li
                      className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-4 text-sm leading-6 text-[var(--color-ivory-soft)]"
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

            <SectionShell
              eyebrow="Proof status"
              id="proof-artifacts"
              title="Public proof and artifacts"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <ProofPanel project={project} />
                <MediaPanel project={project} />
              </div>
            </SectionShell>

            {project.evidenceNotes?.length ? (
              <SectionShell
                eyebrow="Public notes"
                id="evidence-notes"
                title="What can be shared publicly"
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {project.evidenceNotes.map((note) => (
                    <EvidenceNoteCard
                      key={`${project.slug}-${note.claim}`}
                      note={note}
                    />
                  ))}
                </div>
              </SectionShell>
            ) : null}

            <SectionShell
              eyebrow="Public context"
              id="public-context"
              title="Tradeoffs and anonymized details"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-5">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
                    <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                    Client details anonymized
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                    {project.publicSensitivity}
                  </p>
                </div>
                <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-5">
                  <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                    Tradeoff
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                    {project.tradeoffs}
                  </p>
                </div>
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Related work"
              id="related-work"
              title="Skills and credentials"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                <EvidenceTagList items={project.relatedSkills} label="Skills" />
                <EvidenceTagList
                  items={project.relatedCredentials}
                  label="Credentials"
                />
              </div>
            </SectionShell>
          </div>
        </div>

        <CaseStudyCloseout
          adjacentProjects={adjacentProjects}
          project={project}
          proofStats={proofStats}
        />
      </article>
    </main>
  );
}

function CaseFileWayfinder({
  project,
  proofStats,
  readingPath
}: {
  project: Project;
  proofStats: ReturnType<typeof getProjectProofStats>;
  readingPath: CaseFileReadingPathItem[];
}) {
  return (
    <aside
      aria-label="Case study reading path"
      className="case-detail-wayfinder gold-thread-section"
    >
      <div className="case-detail-wayfinder-panel rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-4 shadow-[var(--shadow-premium-panel)]">
        <span aria-hidden="true" className="case-detail-wayfinder-light" />
        <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
          Case file path
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
          Outcome first, then architecture, decisions, proof, and public
          boundaries.
        </p>

        <ol className="mt-4 grid gap-2">
          {readingPath.map((item, index) => (
            <li key={item.id}>
              <a
                className="case-detail-path-link motion-cta group grid min-h-14 grid-cols-[28px_minmax(0,1fr)] items-center gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] px-3 py-2 text-left transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:bg-[var(--card-bg-hover)]"
                href={`#${item.id}`}
              >
                <span className="case-detail-path-marker flex h-7 w-7 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] font-mono text-[0.6875rem] text-[var(--color-champagne)]">
                  <span aria-hidden="true" className="case-detail-path-pulse" />
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--color-ivory)]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[0.64rem] uppercase text-[var(--color-steel)]">
                    {item.detail}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--border-subtle)] pt-4">
          {[
            ["Links", proofStats.verifiedLinks.toString()],
            ["Visuals", proofStats.mediaCount.toString()],
            ["Skills", proofStats.skillCount.toString()],
            ["Creds", proofStats.credentialCount.toString()]
          ].map(([label, value]) => (
            <div className="border-l border-[var(--border-subtle)] pl-3" key={label}>
              <dt className="font-mono text-[0.625rem] uppercase text-[var(--color-steel)]">
                {label}
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--color-ivory)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          className="primary-action-link motion-cta mt-4 inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium shadow-[var(--shadow-gold-trace)] transition duration-[var(--duration-feedback)] hover:border-[var(--color-champagne)]"
          href="/projects"
        >
          <span className="text-[var(--button-primary-text)]">
            All project studies
          </span>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 text-[var(--button-primary-text)]"
          />
        </Link>

        <p className="mt-4 border-t border-[var(--border-subtle)] pt-4 font-mono text-[0.6875rem] uppercase leading-5 text-[var(--color-steel)]">
          {project.status.replace("-", " ")} / {project.dates}
        </p>
      </div>
    </aside>
  );
}

function HeroStat({
  detail,
  label,
  value
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="case-detail-stat rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-3">
      <span aria-hidden="true" className="case-detail-stat-breath" />
      <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold leading-snug text-[var(--color-ivory)]">
        {value}
      </dd>
      <dd className="mt-2 text-xs leading-5 text-[var(--color-warm-silver)]">
        {detail}
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
    <section className="case-detail-story-panel motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-5">
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
        <span className="case-detail-story-icon" aria-hidden="true">
          {icon}
        </span>
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
    <section className="case-detail-proof-panel motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-console)] p-5 [--color-champagne:var(--color-bronze)] [--color-ivory:var(--color-ink-strong)] [--color-warm-silver:var(--color-ink-muted)]">
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
        <LinkIcon aria-hidden="true" className="h-4 w-4" />
        Public references
      </div>
      <div className="mt-4 grid gap-3">
        {project.links.map((link) =>
          link.url ? (
            <div
              className="case-detail-proof-row flex flex-col gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3 sm:flex-row sm:items-center sm:justify-between"
              key={link.label}
            >
              <span
                aria-hidden="true"
                className="case-detail-row-bead"
                data-state="live"
              />
              <div>
                <p className="text-sm font-medium text-[var(--color-ivory)]">
                  {link.label}
                </p>
                <p className="mt-1 text-xs text-[var(--color-warm-silver)]">
                  {link.note ?? link.status}
                </p>
              </div>
              <ExternalProjectLink
                ariaLabel={`Open reference for ${project.title}: ${link.label}. Opens in a new tab.`}
                href={link.url}
              >
                Open reference
              </ExternalProjectLink>
            </div>
          ) : (
            <div
              className="case-detail-proof-row rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
              key={link.label}
            >
              <span
                aria-hidden="true"
                className="case-detail-row-bead"
                data-state="pending"
              />
              <p className="text-sm font-medium text-[var(--color-ivory)]">
                {link.label}
              </p>
              <p className="mt-1 text-xs text-[var(--color-warm-silver)]">
                {link.note ?? "Reference to add after public review."}
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
    <section className="case-detail-proof-panel motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-console)] p-5 [--color-champagne:var(--color-bronze)] [--color-ivory:var(--color-ink-strong)] [--color-warm-silver:var(--color-ink-muted)]">
      <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
        <FileText aria-hidden="true" className="h-4 w-4" />
        Visual artifacts
      </div>
      {project.media.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {project.media.map((asset) => (
            <li
              className="case-detail-proof-row flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
              key={`${asset.label}-${asset.type}`}
            >
              <span
                aria-hidden="true"
                className="case-detail-row-bead"
                data-state={asset.status === "available" ? "live" : "pending"}
              />
              <div>
                <p className="text-sm font-medium text-[var(--color-ivory)]">
                  {asset.label}
                </p>
                <p className="mt-1 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                  {asset.type}
                </p>
              </div>
              <span className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase text-[var(--color-warm-silver)]">
                {asset.status === "available" ? "Available" : "To approve"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3 text-sm leading-6 text-[var(--color-warm-silver)]">
          Visual artifacts to add after public review.
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
    <section className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-5">
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
          Related mapping to add.
        </p>
      )}
    </section>
  );
}

function AdjacentProjectLink({
  direction,
  href,
  project,
  variant = "standard"
}: {
  direction: "Previous" | "Next";
  href: string;
  project: Project;
  variant?: "featured" | "standard";
}) {
  const isFeatured = variant === "featured";

  return (
    <Link
      className={`motion-card motion-cta group flex flex-col justify-between rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-case-file)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] ${isFeatured ? "min-h-52 p-5 sm:p-6" : "min-h-32 p-5"}`}
      href={href}
    >
      <span>
        <span className="font-mono text-xs uppercase text-[var(--color-steel)]">
          {direction} case study
        </span>
        <span
          className={`mt-3 block font-semibold leading-[1.18] text-[var(--color-ivory)] ${isFeatured ? "text-2xl" : "text-lg"}`}
        >
          {project.title}
        </span>
        {isFeatured ? (
          <span className="mt-4 block text-sm leading-6 text-[var(--color-warm-silver)]">
            {project.summary}
          </span>
        ) : null}
      </span>
      <span className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
        <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
          {project.dates}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-[var(--color-champagne)] transition duration-[var(--duration-feedback)] group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function CaseStudyCloseout({
  adjacentProjects,
  project,
  proofStats
}: {
  adjacentProjects: ReturnType<typeof getAdjacentProjects>;
  project: Project;
  proofStats: ReturnType<typeof getProjectProofStats>;
}) {
  const proofSignals = [
    ["Links", proofStats.verifiedLinks.toString()],
    ["Visuals", proofStats.mediaCount.toString()],
    ["Skills", proofStats.skillCount.toString()],
    ["Creds", proofStats.credentialCount.toString()]
  ];

  return (
    <section
      aria-labelledby="case-study-closeout-title"
      className="gold-thread-section motion-section relative my-10 overflow-hidden rounded-[var(--radius-case-file)] border border-[var(--border-gold)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-antique-gold)_10%,transparent),transparent_36%),color-mix(in_srgb,var(--color-carbon)_94%,transparent)] p-5 shadow-[var(--shadow-surface)] sm:p-6 lg:p-8"
      id="case-study-closeout"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-antique-gold)_70%,transparent),transparent)]"
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
            Case file close
          </p>
          <h2
            className="mt-3 max-w-3xl font-[var(--font-display)] text-3xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-4xl"
            id="case-study-closeout-title"
          >
            Continue from this case into the next proof route.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)] sm:text-base sm:leading-7">
            {project.title} is now framed through role, system, decisions,
            public boundaries, and proof context. Use the routes below to keep
            the review moving without losing the thread.
          </p>

          <dl className="mt-6 grid overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_76%,transparent)] sm:grid-cols-4">
            {proofSignals.map(([label, value]) => (
              <div
                className="border-b border-[var(--border-subtle)] p-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                key={label}
              >
                <dt className="font-mono text-[0.625rem] uppercase text-[var(--color-steel)]">
                  {label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-ivory)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link
              className="primary-action-link motion-cta inline-flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-semibold shadow-[var(--shadow-gold-trace)] transition duration-[var(--duration-feedback)] hover:border-[var(--color-champagne)]"
              href="/projects"
            >
              <span className="inline-flex items-center gap-2 text-[var(--button-primary-text)]">
                <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
                All work
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-[var(--button-primary-text)]"
              />
            </Link>
            <Link
              className="motion-card motion-cta inline-flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_62%,transparent)] px-3 text-sm font-semibold text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:border-[var(--border-gold)] hover:bg-[var(--surface-panel-hover)]"
              href="/proof"
            >
              Skills map
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              className="motion-card motion-cta inline-flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_62%,transparent)] px-3 text-sm font-semibold text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:border-[var(--border-gold)] hover:bg-[var(--surface-panel-hover)]"
              href="/resume"
            >
              <span className="inline-flex items-center gap-2">
                <FileDown aria-hidden="true" className="h-4 w-4" />
                Resume
              </span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <nav aria-label="Adjacent case studies" className="grid gap-3">
          {adjacentProjects.next ? (
            <AdjacentProjectLink
              direction="Next"
              href={`/projects/${adjacentProjects.next.slug}`}
              project={adjacentProjects.next}
              variant="featured"
            />
          ) : null}
          {adjacentProjects.previous ? (
            <AdjacentProjectLink
              direction="Previous"
              href={`/projects/${adjacentProjects.previous.slug}`}
              project={adjacentProjects.previous}
            />
          ) : null}
        </nav>
      </div>
    </section>
  );
}
