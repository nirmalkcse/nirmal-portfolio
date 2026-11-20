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
  FileArchive,
  FileText,
  Layers3,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon
} from "lucide-react";
import {
  useCallback,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import { useReducedMotion } from "framer-motion";
import { DownloadLink } from "@/components/ui/download-link";
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
  format: "PDF";
  size: string;
  docxHref: string;
  docxFileName: string;
  docxSize: string;
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
    href: "/resume/nirmal-kumar-data-engineer-one-page-resume.pdf",
    fileName: "nirmal-kumar-data-engineer-one-page-resume.pdf",
    format: "PDF",
    size: "45 KB",
    docxHref: "/resume/nirmal-kumar-data-engineer-one-page-resume.docx",
    docxFileName: "nirmal-kumar-data-engineer-one-page-resume.docx",
    docxSize: "29 KB",
    updated: "May 11, 2026",
    summary:
      "Fast recruiter scan with data engineering positioning, core stack, quantified outcomes, credentials, and education.",
    bestFor: "Recruiter screens, referrals, quick fit checks",
    Icon: FileText
  },
  {
    id: "master",
    label: "Master resume",
    href: "/resume/nirmal-kumar-data-engineer-master-resume.pdf",
    fileName: "nirmal-kumar-data-engineer-master-resume.pdf",
    format: "PDF",
    size: "50 KB",
    docxHref: "/resume/nirmal-kumar-data-engineer-master-resume.docx",
    docxFileName: "nirmal-kumar-data-engineer-master-resume.docx",
    docxSize: "40 KB",
    updated: "May 11, 2026",
    summary:
      "Expanded master resume for project detail, interview preparation, and role-specific document generation.",
    bestFor: "Technical deep dives, leadership context, interview prep",
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
      "Start with the one-page resume, then use the master resume only when someone asks for deeper project context.",
    why: [
      "Keeps the first pass focused on Data Engineer fit.",
      "Keeps the strongest quantified outcomes visible before deeper review.",
      "Leaves the master resume available without making it the default ask."
    ],
    nextHref: "/projects",
    nextLabel: "Open case studies",
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
      "Quantified outcomes sit above deeper implementation detail.",
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
      "Project case studies can carry the follow-up detail."
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
      "Lead with the one-page resume, then move to impact context around validation quality, governed workflows, and delivery ownership.",
    why: [
      "The first pass should make outcomes obvious.",
      "The master resume remains useful for governance and ownership detail.",
      "Case studies can carry business-safe detail after the resume handoff."
    ],
    nextHref: "/projects/bi-migration-validation-analytics",
    nextLabel: "Review impact",
    Icon: ShieldCheck
  },
  explorer: {
    label: "Explorer",
    eyebrow: "Full arc route",
    assetId: "master",
    summary:
      "Use the master resume for the wider story across systems, analytics, AI-assisted BI, research, credentials, and current project momentum.",
    why: [
      "The broader arc benefits from the richer master resume.",
      "Research and demo work should supplement, not replace, core data engineering work.",
      "Timeline and project pages are better follow-ups than extra document bundles."
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

const resumeReviewSteps = [
  {
    step: "01",
    label: "One-page scan",
    detail: "Fast fit check for the first screen"
  },
  {
    step: "02",
    label: "Master context",
    detail: "Use only when deeper detail is needed"
  },
  {
    step: "03",
    label: "Proof follow-up",
    detail: "Credentials and case studies carry depth"
  }
] as const;

const resumeDispatchSteps = [
  {
    action: "Download PDF",
    detail: "Use the one-page file for the first screen and referral handoff.",
    download: resumeAssetById["one-page"].fileName,
    href: resumeAssetById["one-page"].href,
    label: "Start with the one-page resume",
    Icon: FileText
  },
  {
    action: "Verify credentials",
    detail: "Use the credential ledger when the review needs third-party proof.",
    href: "/certifications",
    label: "Confirm public credentials",
    Icon: CheckCircle2
  },
  {
    action: "Open case studies",
    detail: "Use project stories only when the conversation needs delivery depth.",
    href: "/projects",
    label: "Follow with selected proof",
    Icon: Layers3
  }
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
    <DownloadLink
      ariaLabel={`Download ${asset.label} ${asset.format} file: ${asset.fileName}`}
      className={`resume-download-button motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        primary
          ? "primary-action-link border-[var(--border-gold)] bg-[var(--button-primary-bg)] hover:border-[var(--color-champagne)]"
          : "border-[var(--border-subtle)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory)]"
      }`}
      download={asset.fileName}
      href={asset.href}
    >
      <span aria-hidden="true" className="resume-download-spark" />
      {children}
    </DownloadLink>
  );
}

function ResumeReviewPathRail() {
  return (
    <ol
      aria-label="Resume review order"
      className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-3"
    >
      {resumeReviewSteps.map((item) => (
        <li
          className="resume-review-step rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_68%,transparent)] px-3 py-2.5 shadow-[var(--shadow-hairline-inset)]"
          key={item.step}
        >
          <span aria-hidden="true" className="resume-review-step-bead" />
          <span className="flex items-center gap-2">
            <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-antique-gold)]">
              {item.step}
            </span>
            <strong className="text-sm font-semibold text-[var(--color-ivory)]">
              {item.label}
            </strong>
          </span>
          <span className="mt-1 block text-xs leading-5 text-[var(--color-warm-silver)]">
            {item.detail}
          </span>
        </li>
      ))}
    </ol>
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
      className={`resume-role-button motion-lens-choice inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        active
          ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
          : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
      }`}
      data-active={active ? "true" : undefined}
      onClick={onSelect}
      type="button"
    >
      <span aria-hidden="true" className="resume-role-button-glow" />
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

function resetResumeSurfacePresence(target: HTMLElement) {
  target.style.setProperty("--resume-surface-x", "58%");
  target.style.setProperty("--resume-surface-y", "34%");
  target.style.setProperty("--resume-surface-tilt", "0deg");
  target.style.removeProperty("transform");
}

function ResumePaperPreview() {
  const visibleProjects = projects
    .filter((project) => project.status !== "observed")
    .slice(0, 3);
  const visibleCredentials = certifications.slice(0, 4);
  const prefersReducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tilt = (pointerX - 50) * 0.01;

      event.currentTarget.style.setProperty("--resume-surface-x", `${pointerX.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--resume-surface-y", `${pointerY.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--resume-surface-tilt", `${tilt.toFixed(3)}deg`);
      event.currentTarget.style.setProperty(
        "transform",
        `translateY(-2px) rotate(${tilt.toFixed(3)}deg)`,
        "important"
      );
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    resetResumeSurfacePresence(event.currentTarget);
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      event.currentTarget.style.setProperty("--resume-surface-x", "64%");
      event.currentTarget.style.setProperty("--resume-surface-y", "28%");

      if (!prefersReducedMotion) {
        event.currentTarget.style.setProperty(
          "transform",
          "translateY(-2px) rotate(0.12deg)",
          "important"
        );
      }
    },
    [prefersReducedMotion]
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    resetResumeSurfacePresence(event.currentTarget);
  }, []);

  return (
    <section
      aria-label="One-page resume preview"
      className="resume-paper-preview motion-panel-enter overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-ivory)] text-[var(--color-text-inverse)] shadow-[var(--shadow-float)]"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={
        {
          "--resume-surface-x": "58%",
          "--resume-surface-y": "34%",
          "--resume-surface-tilt": "0deg"
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="resume-paper-lens" />
      <span aria-hidden="true" className="resume-paper-scan" />
      <span aria-hidden="true" className="resume-paper-corner resume-paper-corner--top" />
      <span aria-hidden="true" className="resume-paper-corner resume-paper-corner--bottom" />
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
                  Positioning
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
                Selected experience
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
      className="resume-recommendation-panel motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={RESUME_RECOMMENDATION_PANEL_ID}
      role="region"
    >
      <span aria-hidden="true" className="resume-recommendation-ambient" />
      <span aria-hidden="true" className="resume-recommendation-scan" />
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
        <span className="resume-recommendation-icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-signal-blue)]">
          <RecommendationIcon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
        {recommendation.summary}
      </p>

      <div className="resume-file-receipt mt-5 rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] p-4">
        <span aria-hidden="true" className="resume-file-receipt-orbit" />
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
            Download recommended PDF
          </DownloadButton>
          <DownloadLink
            ariaLabel={`Download editable DOCX version of ${recommendedAsset.label}: ${recommendedAsset.docxFileName}`}
            className="resume-download-button motion-cta mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-warm-silver)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
            download={recommendedAsset.docxFileName}
            href={recommendedAsset.docxHref}
          >
            <span aria-hidden="true" className="resume-download-spark" />
            Download editable DOCX
          </DownloadLink>
        </div>
      </div>

      <section className="mt-5">
        <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
          Why this file
        </h3>
        <ul className="mt-3 space-y-2">
          {recommendation.why.map((item) => (
            <li
              className="resume-reason-row flex gap-3 text-sm leading-6 text-[var(--console-muted)]"
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
        className="resume-followup-link motion-cta mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
        href={recommendation.nextHref}
      >
        <span aria-hidden="true" className="resume-followup-sheen" />
        {recommendation.nextLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </aside>
  );
}

function AssetDownloadCard({ asset }: { asset: ResumeAsset }) {
  const Icon = asset.Icon;
  const prefersReducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tilt = (pointerX - 50) * 0.014;

      event.currentTarget.style.setProperty("--resume-surface-x", `${pointerX.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--resume-surface-y", `${pointerY.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--resume-surface-tilt", `${tilt.toFixed(3)}deg`);
      event.currentTarget.style.setProperty(
        "transform",
        `translateY(-2px) rotate(${tilt.toFixed(3)}deg)`,
        "important"
      );
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    resetResumeSurfacePresence(event.currentTarget);
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      event.currentTarget.style.setProperty("--resume-surface-x", "72%");
      event.currentTarget.style.setProperty("--resume-surface-y", "30%");

      if (!prefersReducedMotion) {
        event.currentTarget.style.setProperty(
          "transform",
          "translateY(-2px) rotate(0.18deg)",
          "important"
        );
      }
    },
    [prefersReducedMotion]
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    resetResumeSurfacePresence(event.currentTarget);
  }, []);

  return (
    <article
      className="resume-asset-card motion-card rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)]"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={
        {
          "--resume-surface-x": "58%",
          "--resume-surface-y": "34%",
          "--resume-surface-tilt": "0deg"
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="resume-asset-lens" />
      <span aria-hidden="true" className="resume-asset-rail" />
      <span aria-hidden="true" className="resume-asset-corner resume-asset-corner--top" />
      <span aria-hidden="true" className="resume-asset-corner resume-asset-corner--bottom" />
      <div className="flex items-start gap-4">
        <span className="resume-asset-icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
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
          ["Primary file", `${asset.format} ${asset.size} / ${asset.updated}`],
          ["Editable file", `DOCX ${asset.docxSize}`]
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
          Download PDF
        </DownloadButton>
        <DownloadLink
          ariaLabel={`Download editable DOCX version of ${asset.label}: ${asset.docxFileName}`}
          className="resume-download-button motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-warm-silver)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
          download={asset.docxFileName}
          href={asset.docxHref}
        >
          <span aria-hidden="true" className="resume-download-spark" />
          Download DOCX
        </DownloadLink>
        <a
          aria-label={`Open ${asset.label} PDF file: ${asset.fileName}`}
          className="resume-followup-link motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-warm-silver)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
          href={asset.href}
        >
          <span aria-hidden="true" className="resume-followup-sheen" />
          Open PDF
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function ResumeDispatchSequence() {
  return (
    <section className="resume-dispatch-panel gold-thread-section rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-5 shadow-[var(--shadow-premium-panel)]">
      <span aria-hidden="true" className="resume-dispatch-current" />
      <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
        Resume handoff sequence
      </p>
      <h2 className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
        One file first, then proof when the review asks for it.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
        The page keeps the recruiter path short while leaving credentials and
        project evidence one step away.
      </p>

      <ol className="mt-5 grid gap-3">
        {resumeDispatchSteps.map((step, index) => {
          const Icon = step.Icon;
          const className =
            "resume-dispatch-step motion-cta flex min-h-20 items-center justify-between gap-4 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] px-3 py-3 transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)]";
          const content = (
            <>
              <span aria-hidden="true" className="resume-dispatch-step-sheen" />
              <span className="flex min-w-0 items-start gap-3">
                <span className="resume-dispatch-step-icon mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] text-[var(--color-champagne)]">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="mt-1 block text-sm font-semibold leading-5 text-[var(--color-ivory)]">
                    {step.label}
                  </strong>
                  <span className="mt-1 block text-xs leading-5 text-[var(--color-warm-silver)]">
                    {step.detail}
                  </span>
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[var(--color-ivory-soft)]">
                {step.action}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </>
          );

          return (
            <li key={step.label}>
              {"download" in step ? (
                <a
                  aria-label={`${step.action}: ${step.download}`}
                  className={className}
                  download={step.download}
                  href={step.href}
                >
                  {content}
                </a>
              ) : (
                <Link className={className} href={step.href}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
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
    <main
      className="resume-lens-page min-h-screen px-[var(--layout-gutter)] pb-10 pt-[calc(var(--site-header-offset)+var(--space-5))]"
      id="main-content"
      tabIndex={-1}
    >
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
              Resume
            </p>
            <h1 className="editorial-title editorial-title--section editorial-title--ivory mt-4 max-w-4xl">
              One fast resume path, with deeper context close by.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              Download the Nirmal Kumar one-page Data Engineer resume, with a
              master resume and project links available for deeper review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <DownloadButton asset={onePageAsset} primary>
                Download one-page PDF
              </DownloadButton>
              <Link
                className="motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                href="/profile"
              >
                Contact route
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <ResumeReviewPathRail />
          </div>

          <div className="resume-cta-panel motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]">
            <span aria-hidden="true" className="resume-cta-panel-glow" />
            <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
              Recruiter CTA
            </p>
            <p className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
              One-page PDF, updated May 11, 2026.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
              DOCX versions stay available for editable handoffs, but the page
              leads with the recruiter-friendly file that best matches a first screen.
            </p>
          </div>
        </header>

        <section
          aria-label="Resume role recommendation"
          className="resume-role-panel motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <span aria-hidden="true" className="resume-role-panel-current" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                Recommended review path
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
                Focus updates the suggested resume and follow-up review route.
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
          <div className="grid content-start gap-6">
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
                  label: "Outcome density",
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
                    className="resume-metric-card motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
                    key={item.label}
                  >
                    <span aria-hidden="true" className="resume-metric-dot" />
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

            <ResumeDispatchSequence />
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

        <section className="resume-review-map rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
          <span aria-hidden="true" className="resume-review-map-glow" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Resume review map
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                The resume points to case studies, credentials, and context.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                Recruiters get the file immediately; engineers and leaders can
                follow the resume highlights into projects, credentials, and
                the skill map.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[520px]">
              {[
                { href: "/projects", label: "Case studies", Icon: Layers3 },
                { href: "/certifications", label: "Credentials", Icon: CheckCircle2 },
                { href: "/proof", label: "Skill map", Icon: UserRound }
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <Link
                    className="resume-followup-link motion-cta flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                    href={item.href}
                    key={item.href}
                  >
                    <span aria-hidden="true" className="resume-followup-sheen" />
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
