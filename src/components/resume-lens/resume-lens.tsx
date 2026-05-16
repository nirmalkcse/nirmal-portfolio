"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Code2,
  Compass,
  Download,
  FileArchive,
  FileText,
  Layers3,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon
} from "lucide-react";
import type { ReactNode } from "react";
import { useRoleLens } from "@/context/role-lens-context";
import {
  certifications,
  profile,
  projects,
  skillClusters,
  type Viewer
} from "@/data";
import { roleOrder } from "@/lib/role-lens";

type ResumeAssetId = "one-page" | "master";
type ResumeRole = Viewer | "balanced";

type ResumeAsset = {
  id: ResumeAssetId;
  label: string;
  href: string;
  fileName: string;
  size: string;
  updated: string;
  summary: string;
  bestFor: string;
  Icon: LucideIcon;
};

type RoleRecommendation = {
  label: string;
  eyebrow: string;
  assetId: ResumeAssetId;
  summary: string;
  why: readonly string[];
  nextHref: string;
  nextLabel: string;
  Icon: LucideIcon;
};

const RESUME_RECOMMENDATION_PANEL_ID = "resume-recommendation-panel";

const resumeAssets = [
  {
    id: "one-page",
    label: "One-page resume",
    href: "/resume/nirmal-kumar-data-engineer-one-page-resume.docx",
    fileName: "nirmal-kumar-data-engineer-one-page-resume.docx",
    size: "29 KB",
    updated: "May 11, 2026",
    summary:
      "Fast recruiter scan with data engineering positioning, core stack, quantified outcomes, credentials, and education.",
    bestFor: "Recruiter screens, referrals, quick fit checks",
    Icon: FileText
  },
  {
    id: "master",
    label: "Master resume",
    href: "/resume/nirmal-kumar-data-engineer-master-resume.docx",
    fileName: "nirmal-kumar-data-engineer-master-resume.docx",
    size: "40 KB",
    updated: "May 11, 2026",
    summary:
      "Expanded source resume for project detail, proof packets, interview preparation, and role-specific document generation.",
    bestFor: "Technical deep dives, leadership context, proof packet source",
    Icon: FileArchive
  }
] as const satisfies readonly ResumeAsset[];

const resumeAssetById = Object.fromEntries(
  resumeAssets.map((asset) => [asset.id, asset])
) as Record<ResumeAssetId, ResumeAsset>;

const roleRecommendations = {
  balanced: {
    label: "Balanced",
    eyebrow: "Default recommendation",
    assetId: "one-page",
    summary:
      "Start with the one-page resume, then use the master resume only when someone asks for deeper project evidence.",
    why: [
      "Keeps the first pass focused on Data Engineer fit.",
      "Surfaces the strongest quantified outcomes before the broader proof system.",
      "Leaves the master resume available without making it the default ask."
    ],
    nextHref: "/projects",
    nextLabel: "Open case files",
    Icon: Sparkles
  },
  recruiter: {
    label: "Recruiter",
    eyebrow: "Fast fit route",
    assetId: "one-page",
    summary:
      "Use the one-page resume for a clean first-pass screen: role, stack, credentials, scope, outcomes, and education all stay visible.",
    why: [
      "The one-page file is the default recruiter download.",
      "Quantified proof sits above deeper implementation detail.",
      "Credentials and current role context are easy to scan."
    ],
    nextHref: "/certifications",
    nextLabel: "Verify credentials",
    Icon: Users
  },
  engineer: {
    label: "Engineer",
    eyebrow: "Implementation route",
    assetId: "master",
    summary:
      "Use the master resume when the conversation is technical and needs architecture, APIs, SQL/Spark depth, and governance implementation detail.",
    why: [
      "The master resume preserves richer implementation context.",
      "Databricks Apps, Fabric pipelines, CDC/SCD2, and orchestration details matter here.",
      "Project case files can carry the follow-up proof."
    ],
    nextHref: "/projects/icore-enterprise-mdm-entity-resolution",
    nextLabel: "Inspect architecture",
    Icon: Code2
  },
  leader: {
    label: "Leader",
    eyebrow: "Outcome route",
    assetId: "one-page",
    summary:
      "Lead with the one-page resume, then move to impact proof around validation quality, governed workflows, and delivery ownership.",
    why: [
      "The first pass should make outcomes obvious.",
      "The master resume remains useful for governance and ownership detail.",
      "Case files can carry business-safe proof after the resume handoff."
    ],
    nextHref: "/projects/bi-migration-validation-analytics",
    nextLabel: "Review impact proof",
    Icon: ShieldCheck
  },
  explorer: {
    label: "Explorer",
    eyebrow: "Full arc route",
    assetId: "master",
    summary:
      "Use the master resume for the wider story across systems, analytics, AI-assisted BI, research, credentials, and current project momentum.",
    why: [
      "The broader arc benefits from the richer source resume.",
      "Research and demo work should supplement, not replace, core data engineering proof.",
      "Timeline and project surfaces are better follow-ups than extra document sprawl."
    ],
    nextHref: "/timeline",
    nextLabel: "Explore timeline",
    Icon: Compass
  }
} as const satisfies Record<ResumeRole, RoleRecommendation>;

const roleMeta = {
  balanced: { label: "Balanced", Icon: Sparkles },
  recruiter: { label: "Recruiter", Icon: Users },
  engineer: { label: "Engineer", Icon: Code2 },
  leader: { label: "Leader", Icon: ShieldCheck },
  explorer: { label: "Explorer", Icon: Compass }
} satisfies Record<ResumeRole, { label: string; Icon: LucideIcon }>;

const metricHighlights = [
  "3 source systems",
  "18-24 daily incremental tables",
  "15+ reports validated",
  "90% discrepancy reduction",
  "6 Tableau reports migrated",
  "9.11/10 CGPA"
] as const;

const resumeStack = [
  "Microsoft Fabric",
  "Databricks",
  "SQL",
  "PySpark",
  "Power BI",
  "Delta Lake",
  "Next.js",
  "TypeScript"
] as const;

const resumeSections = [
  {
    title: "Current focus",
    items: [
      "Fabric lakehouse migration and validation across ingestion, transformation, and BI-serving layers.",
      "Databricks-hosted data products with SQL Warehouse, Jobs API, Unity Catalog, RBAC, and audit logging.",
      "BI modernization with semantic models, report parity checks, and discrepancy reduction."
    ]
  },
  {
    title: "Selected outcomes",
    items: profile.achievements.slice(0, 5)
  }
] as const;

function DownloadButton({
  asset,
  children,
  primary = false
}: {
  asset: ResumeAsset;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      aria-label={`Download ${asset.label} DOCX file: ${asset.fileName}`}
      className={`motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        primary
          ? "border-[var(--border-gold)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:border-[var(--color-champagne)]"
          : "border-[var(--border-subtle)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory)]"
      }`}
      download={asset.fileName}
      href={asset.href}
    >
      <Download aria-hidden="true" className="h-4 w-4" />
      {children}
    </a>
  );
}

function RoleButton({
  active,
  role,
  onSelect
}: {
  active: boolean;
  role: ResumeRole;
  onSelect: () => void;
}) {
  const { Icon, label } = roleMeta[role];

  return (
    <button
      aria-controls={RESUME_RECOMMENDATION_PANEL_ID}
      aria-pressed={active}
      className={`motion-lens-choice inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        active
          ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
          : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

function ResumePaperPreview() {
  const visibleProjects = projects
    .filter((project) => project.status !== "observed")
    .slice(0, 3);
  const visibleCredentials = certifications.slice(0, 4);

  return (
    <section
      aria-label="One-page resume preview"
      className="motion-panel-enter overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-ivory)] text-[var(--color-text-inverse)] shadow-[var(--shadow-float)]"
    >
      <div className="min-h-[820px] p-5 sm:p-7 lg:p-8">
        <header className="grid gap-5 border-b border-[color-mix(in_srgb,var(--color-ink)_18%,transparent)] pb-5 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-start">
          <div>
            <p className="font-mono text-[0.66rem] uppercase text-[var(--color-old-gold)]">
              One-page resume preview
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-semibold leading-[1.08] text-[var(--color-ink)] sm:text-4xl">
              {profile.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-5 text-[var(--color-ink)]">
              {profile.alternateHeadline}
            </p>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)]">
              {profile.location} / {profile.roles[0].title},{" "}
              {profile.roles[0].organization} / {profile.education.degree}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {metricHighlights.slice(0, 3).map((metric) => (
              <div
                className="border-l-2 border-[var(--color-antique-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_10%,transparent)] px-3 py-2"
                key={metric}
              >
                <dt className="font-mono text-[0.62rem] uppercase text-[var(--color-old-gold)]">
                  Signal
                </dt>
                <dd className="mt-1 text-sm font-semibold leading-4 text-[var(--color-ink)]">
                  {metric}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="grid gap-5 pt-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.85fr)]">
          <div className="space-y-5">
            <section>
              <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                Profile
              </h3>
              <p className="mt-2 text-xs leading-5 text-[color-mix(in_srgb,var(--color-ink)_82%,transparent)]">
                {profile.shortBio}
              </p>
            </section>

            <section>
              <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                Experience proof
              </h3>
              <div className="mt-3 space-y-3">
                {visibleProjects.map((project) => (
                  <article
                    className="border-l border-[color-mix(in_srgb,var(--color-ink)_20%,transparent)] pl-3"
                    key={project.slug}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className="text-sm font-semibold leading-5 text-[var(--color-ink)]">
                        {project.title}
                      </h4>
                      <span className="font-mono text-[0.62rem] uppercase text-[var(--color-old-gold)]">
                        {project.dates}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[color-mix(in_srgb,var(--color-ink)_74%,transparent)]">
                      {project.impact}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              {resumeSections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                    {section.title}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {section.items.map((item) => (
                      <li
                        className="flex gap-2 text-xs leading-5 text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)]"
                        key={item}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-old-gold)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>

          <aside className="space-y-4 border-t border-[color-mix(in_srgb,var(--color-ink)_14%,transparent)] pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <section>
              <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                Core stack
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {resumeStack.map((skill) => (
                  <span
                    className="rounded-[var(--radius-control)] border border-[color-mix(in_srgb,var(--color-ink)_16%,transparent)] px-2 py-1 text-[0.68rem] leading-none text-[var(--color-ink)]"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                Credentials
              </h3>
              <ul className="mt-2 space-y-2">
                {visibleCredentials.map((credential) => (
                  <li
                    className="grid grid-cols-[14px_minmax(0,1fr)] gap-2 text-xs leading-5 text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)]"
                    key={credential.slug}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 text-[var(--color-old-gold)]"
                    />
                    <span>{credential.title}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                Skill clusters
              </h3>
              <ul className="mt-2 space-y-2">
                {skillClusters.slice(0, 4).map((skill) => (
                  <li key={skill.id}>
                    <p className="text-xs font-semibold leading-5 text-[var(--color-ink)]">
                      {skill.title}
                    </p>
                    <p className="text-[0.68rem] leading-4 text-[color-mix(in_srgb,var(--color-ink)_66%,transparent)]">
                      {skill.proofPoints.slice(0, 2).join(" / ")}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-mono text-[0.68rem] uppercase text-[var(--color-old-gold)]">
                Education
              </h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-ink)]">
                {profile.education.institution}
              </p>
              <p className="text-[0.68rem] leading-4 text-[color-mix(in_srgb,var(--color-ink)_66%,transparent)]">
                {profile.education.completionYear} / CGPA{" "}
                {profile.education.cgpa}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

function RecommendationPanel({
  recommendation,
  recommendedAsset
}: {
  recommendation: RoleRecommendation;
  recommendedAsset: ResumeAsset;
}) {
  const RecommendationIcon = recommendation.Icon;
  const AssetIcon = recommendedAsset.Icon;

  return (
    <aside
      aria-labelledby={`${RESUME_RECOMMENDATION_PANEL_ID}-title`}
      aria-live="polite"
      className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={RESUME_RECOMMENDATION_PANEL_ID}
      role="region"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            {recommendation.eyebrow}
          </p>
          <h2
            className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]"
            id={`${RESUME_RECOMMENDATION_PANEL_ID}-title`}
          >
            {recommendedAsset.label}
          </h2>
        </div>
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-signal-blue)]">
          <RecommendationIcon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
        {recommendation.summary}
      </p>

      <div className="mt-5 rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] p-4">
        <div className="flex items-center gap-3">
          <AssetIcon
            aria-hidden="true"
            className="h-5 w-5 text-[var(--color-champagne)]"
          />
          <div>
            <p className="text-sm font-medium text-[var(--color-ivory)]">
              {recommendedAsset.fileName}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
              {recommendedAsset.size} / updated {recommendedAsset.updated}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <DownloadButton asset={recommendedAsset} primary>
            Download recommended
          </DownloadButton>
        </div>
      </div>

      <section className="mt-5">
        <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
          Why this file
        </h3>
        <ul className="mt-3 space-y-2">
          {recommendation.why.map((item) => (
            <li
              className="flex gap-3 text-sm leading-6 text-[var(--console-muted)]"
              key={item}
            >
              <CheckCircle2
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Link
        className="motion-cta mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
        href={recommendation.nextHref}
      >
        {recommendation.nextLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </aside>
  );
}

function AssetDownloadCard({ asset }: { asset: ResumeAsset }) {
  const Icon = asset.Icon;

  return (
    <article className="motion-card rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)]">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
            {asset.label}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
            {asset.summary}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-4">
        {[
          ["Best for", asset.bestFor],
          ["File", `${asset.size} / ${asset.updated}`]
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
              {label}
            </dt>
            <dd className="mt-1 text-sm leading-5 text-[var(--color-ivory-soft)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <DownloadButton asset={asset}>
          Download {asset.id === "one-page" ? "one-page" : "master"}
        </DownloadButton>
        <a
          aria-label={`Open ${asset.label} DOCX file: ${asset.fileName}`}
          className="motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-warm-silver)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
          href={asset.href}
        >
          Open file
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export function ResumeLens() {
  const { clearRole, role, setRole } = useRoleLens();
  const activeRole: ResumeRole = role ?? "balanced";
  const recommendation = roleRecommendations[activeRole];
  const recommendedAsset = resumeAssetById[recommendation.assetId];
  const onePageAsset = resumeAssetById["one-page"];

  function handleRoleSelect(nextRole: ResumeRole) {
    if (nextRole === "balanced") {
      clearRole();
      return;
    }

    setRole(nextRole);
  }

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
              Resume lens
            </p>
            <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              One fast resume path, with the deeper proof close by.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              A recruiter-friendly resume surface for Nirmal Kumar: immediate
              one-page download, master resume fallback, role-aware guidance,
              and a compact preview of the story being handed off.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <DownloadButton asset={onePageAsset} primary>
                Download one-page resume
              </DownloadButton>
              <Link
                className="motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                href="/profile"
              >
                Contact route
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]">
            <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
              Recruiter CTA
            </p>
            <p className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
              One-page DOCX, ready in one click.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
              The master resume stays available for deep review, but the page
              leads with the lightweight file that best matches a first screen.
            </p>
          </div>
        </header>

        <section
          aria-label="Resume role recommendation"
          className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                Role-aware recommendation
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
                Choose a lens to change the suggested resume and follow-up proof
                route.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["balanced", ...roleOrder] as const).map((roleOption) => (
                <RoleButton
                  active={activeRole === roleOption}
                  key={roleOption}
                  onSelect={() => handleRoleSelect(roleOption)}
                  role={roleOption}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-6">
            <ResumePaperPreview />

            <section className="motion-list grid gap-4 lg:grid-cols-3">
              {[
                {
                  label: "Fast scan",
                  value: "One page",
                  detail: "Default recruiter artifact",
                  Icon: Clock3
                },
                {
                  label: "Proof density",
                  value: "6 metrics",
                  detail: "Scope, quality, migration, education",
                  Icon: ClipboardCheck
                },
                {
                  label: "Core position",
                  value: "Data Engineer",
                  detail: "Fabric, Databricks, SQL, PySpark, Power BI",
                  Icon: BriefcaseBusiness
                }
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <div
                    className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
                    key={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        aria-hidden="true"
                        className="h-4 w-4 text-[var(--color-champagne)]"
                      />
                      <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-[var(--color-warm-silver)]">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </section>
          </div>

          <div className="grid content-start gap-6">
            <RecommendationPanel
              key={activeRole}
              recommendation={recommendation}
              recommendedAsset={recommendedAsset}
            />

            <section className="grid gap-4">
              <div>
                <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                  Download library
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                  Public resume files.
                </h2>
              </div>
              {resumeAssets.map((asset) => (
                <AssetDownloadCard asset={asset} key={asset.id} />
              ))}
            </section>
          </div>
        </section>

        <section className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Resume proof map
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                The resume points to proof surfaces, not dead ends.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                Recruiters get the file immediately; engineers and leaders can
                follow the resume claims into projects, credentials, and the
                proof graph.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[520px]">
              {[
                { href: "/projects", label: "Case files", Icon: Layers3 },
                { href: "/certifications", label: "Credentials", Icon: CheckCircle2 },
                { href: "/proof", label: "Proof graph", Icon: UserRound }
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <Link
                className="motion-cta flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                    href={item.href}
                    key={item.href}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      {item.label}
                    </span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
