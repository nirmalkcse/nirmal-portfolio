/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Compass,
  Download,
  ExternalLink,
  GraduationCap,
  Layers3,
  MapPin,
  Network,
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
  featuredProjectSlugs,
  profile,
  projects,
  skillClusters,
  type SocialLink,
  type Viewer
} from "@/data";
import {
  getBalancedGatewayModel,
  getProjectsForRole,
  getRoleGatewayModel,
  getSkillClustersForRole,
  roleOrder,
  type RoleCta,
  type RoleEvidence
} from "@/lib/role-lens";

type ProfileLens = Viewer | "balanced";

type ProfileRoute = {
  href: string;
  label: string;
  detail: string;
  Icon: LucideIcon;
};

const PROFILE_LENS_PANEL_ID = "profile-lens-panel";

const onePageResume = {
  href: "/resume/nirmal-kumar-data-engineer-one-page-resume.docx",
  fileName: "nirmal-kumar-data-engineer-one-page-resume.docx"
} as const;

const lensMeta = {
  balanced: { label: "Balanced", Icon: Sparkles },
  recruiter: { label: "Recruiter", Icon: Users },
  engineer: { label: "Engineer", Icon: Code2 },
  leader: { label: "Leader", Icon: ShieldCheck },
  explorer: { label: "Explorer", Icon: Compass }
} satisfies Record<ProfileLens, { label: string; Icon: LucideIcon }>;

const roleDisciplineLabels = [
  "Data Engineering",
  "Analytics Engineering",
  "BI Modernization",
  "Data Product Engineering"
] as const;

const proofRoutes = [
  {
    href: "/proof",
    label: "Proof graph",
    detail: "Skills, projects, credentials, metrics, and proof gaps connected as evidence.",
    Icon: Network
  },
  {
    href: "/projects",
    label: "Case files",
    detail: "Public-safe project stories for Fabric, Databricks, BI, research, and demos.",
    Icon: Layers3
  },
  {
    href: "/certifications",
    label: "Credentials",
    detail: "Fabric, Databricks, analytics, cloud, and supporting credentials with verification state.",
    Icon: BadgeCheck
  },
  {
    href: "/timeline",
    label: "Timeline",
    detail: "Education, work, project, publication, credential, and exploration momentum.",
    Icon: BriefcaseBusiness
  }
] as const satisfies readonly ProfileRoute[];

const contactBoundaries = [
  "LinkedIn is the primary public contact path.",
  "Email can be added after confirmation.",
  "Phone remains unpublished on the public site."
] as const;

const currentRole = profile.roles[0];
const featuredProjects = featuredProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project));

function profileMetricCards() {
  return [
    {
      label: "Enterprise scale",
      value: "3 systems",
      detail: "Telecom Fabric migration PoC"
    },
    {
      label: "Daily tables",
      value: "18-24",
      detail: "Incremental source tables supported"
    },
    {
      label: "Validation",
      value: "15+ reports",
      detail: "MicroStrategy-to-Fabric checks"
    },
    {
      label: "Quality gain",
      value: "90%",
      detail: "Validation discrepancy reduction"
    }
  ] as const;
}

function statusLabel(status: SocialLink["status"]) {
  return status.replaceAll("-", " ");
}

function ctaClasses(emphasis: RoleCta["emphasis"]) {
  if (emphasis === "primary") {
    return "border-[var(--border-gold)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:border-[var(--color-champagne)]";
  }

  if (emphasis === "secondary") {
    return "border-[var(--border-subtle)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]";
  }

  return "border-transparent text-[var(--color-warm-silver)] hover:border-[var(--border-subtle)] hover:bg-[color-mix(in_srgb,var(--color-carbon)_74%,transparent)] hover:text-[var(--color-ivory-soft)]";
}

function ProfileLensButton({
  active,
  lens,
  onSelect
}: {
  active: boolean;
  lens: ProfileLens;
  onSelect: () => void;
}) {
  const { Icon, label } = lensMeta[lens];

  return (
    <button
      aria-controls={PROFILE_LENS_PANEL_ID}
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

function ResumeDownloadLink({
  children,
  primary = false
}: {
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      aria-label={`Download one-page resume DOCX file: ${onePageResume.fileName}`}
      className={`motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm font-semibold transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        primary
          ? "border-[var(--border-gold)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:border-[var(--color-champagne)]"
          : "border-[var(--border-subtle)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
      }`}
      download={onePageResume.fileName}
      href={onePageResume.href}
    >
      <Download aria-hidden="true" className="h-4 w-4" />
      {children}
    </a>
  );
}

function HeroProfileCard() {
  return (
    <aside className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)]">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)]">
          <img
            alt=""
            height={36}
            loading="lazy"
            src="/assets/brand/nk-threadline-monogram-one-color-ivory.svg"
            width={36}
          />
        </span>
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Canonical profile
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            {profile.displayName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
            {profile.alternateHeadline}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 border-t border-[var(--border-subtle)] pt-5">
        <div className="grid gap-1">
          <dt className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            <BriefcaseBusiness aria-hidden="true" className="h-3.5 w-3.5" />
            Current role
          </dt>
          <dd className="text-sm leading-6 text-[var(--color-ivory-soft)]">
            {currentRole.title}, {currentRole.discipline}
          </dd>
          <dd className="text-sm leading-6 text-[var(--color-warm-silver)]">
            {currentRole.organization} / {currentRole.startDate} -{" "}
            {currentRole.endDate}
          </dd>
        </div>

        <div className="grid gap-1">
          <dt className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            <GraduationCap aria-hidden="true" className="h-3.5 w-3.5" />
            Education
          </dt>
          <dd className="text-sm leading-6 text-[var(--color-ivory-soft)]">
            {profile.education.degree}
          </dd>
          <dd className="text-sm leading-6 text-[var(--color-warm-silver)]">
            {profile.education.institution} / {profile.education.completionYear} /{" "}
            CGPA {profile.education.cgpa}
          </dd>
        </div>

        <div className="grid gap-1">
          <dt className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            Location
          </dt>
          <dd className="text-sm leading-6 text-[var(--color-ivory-soft)]">
            {profile.location}
          </dd>
        </div>
      </dl>
    </aside>
  );
}

function LensPanel({
  activeLens,
  evidence,
  model
}: {
  activeLens: ProfileLens;
  evidence: readonly RoleEvidence[];
  model: ReturnType<typeof getBalancedGatewayModel> | ReturnType<typeof getRoleGatewayModel>;
}) {
  return (
    <section
      aria-labelledby="profile-role-title"
      className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)]"
      id={PROFILE_LENS_PANEL_ID}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            {lensMeta[activeLens].label} lens
          </p>
          <h2
            className="mt-3 text-3xl font-semibold leading-[1.14] text-[var(--color-ivory)]"
            id="profile-role-title"
          >
            {model.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
            {model.summary}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--color-ivory-soft)]">
            {model.nextStep}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {model.ctas.map((cta) => (
              <Link
                className={`motion-cta inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${ctaClasses(
                  cta.emphasis
                )}`}
                href={cta.href}
                key={cta.label}
              >
                {cta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {evidence.map((item) => (
            <Link
              className="motion-card group rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] p-4 transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)]"
              href={item.href}
              key={`${item.kind}-${item.label}`}
            >
              <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-antique-gold)]">
                {item.kind}
              </span>
              <strong className="mt-2 flex items-start justify-between gap-3 text-sm font-semibold leading-5 text-[var(--color-ivory-soft)]">
                {item.label}
                <ArrowRight
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 transition group-hover:translate-x-1"
                />
              </strong>
              <span className="mt-2 block text-xs leading-5 text-[var(--color-warm-silver)]">
                {item.detail}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofRouteCard({ route }: { route: ProfileRoute }) {
  const Icon = route.Icon;

  return (
    <Link
      className="motion-card group flex min-h-[214px] flex-col rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:bg-[var(--surface-panel-hover)]"
      href={route.href}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <strong className="mt-5 block text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
        {route.label}
      </strong>
      <span className="mt-3 block text-sm leading-6 text-[var(--color-warm-silver)]">
        {route.detail}
      </span>
      <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--color-ivory-soft)]">
        Open
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

function SocialLinkCard({ link }: { link: SocialLink }) {
  return (
    <a
      aria-label={`${link.label}. ${link.publicUse} Opens in a new tab.`}
      className="motion-card group rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-4 transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)]"
      href={link.url}
      rel="noreferrer"
      target="_blank"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] text-[var(--color-champagne)]">
          <SocialLinkIcon label={link.label} />
        </span>
        <ExternalLink
          aria-hidden="true"
          className="h-4 w-4 text-[var(--color-warm-silver)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
      <strong className="mt-4 block text-base font-semibold text-[var(--color-ivory)]">
        {link.label}
      </strong>
      <span className="mt-2 block text-sm leading-6 text-[var(--color-warm-silver)]">
        {link.publicUse}
      </span>
      <span className="mt-4 inline-flex rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase text-[var(--color-ivory-muted)]">
        {statusLabel(link.status)}
      </span>
    </a>
  );
}

function SocialLinkIcon({ label }: { label: string }) {
  switch (label) {
    case "LinkedIn":
      return <SocialGlyph label="in" />;
    case "GitHub":
      return <SocialGlyph label="GH" />;
    case "IEEE":
      return <SocialGlyph label="IEEE" />;
    case "LeetCode":
      return <SocialGlyph label="LC" />;
    default:
      return <ExternalLink aria-hidden="true" className="h-5 w-5" />;
  }
}

function SocialGlyph({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 place-items-center font-mono text-[0.64rem] font-semibold leading-none"
    >
      {label}
    </span>
  );
}

export function ProfessionalProfile() {
  const { clearRole, role, setRole } = useRoleLens();
  const activeLens: ProfileLens = role ?? "balanced";
  const activeViewer: Viewer = role ?? "recruiter";
  const model = role ? getRoleGatewayModel(role) : getBalancedGatewayModel();
  const highlightedProjects = role ? getProjectsForRole(role, 3) : featuredProjects;
  const highlightedSkills = role
    ? getSkillClustersForRole(role, 3)
    : skillClusters.slice(0, 3);
  const credentialCount = certifications.filter((credential) =>
    credential.relatedProjects.some((slug) =>
      highlightedProjects.some((project) => project.slug === slug)
    )
  ).length;

  function handleLensSelect(nextLens: ProfileLens) {
    if (nextLens === "balanced") {
      clearRole();
      return;
    }

    setRole(nextLens);
  }

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
        <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
          <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Professional profile
              </p>
              <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[1.04] text-[var(--color-ivory)] sm:text-7xl">
                {profile.displayName}
              </h1>
              <p className="mt-5 max-w-3xl text-xl leading-8 text-[var(--color-ivory-soft)]">
                {profile.headline}
              </p>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--color-warm-silver)]">
                {profile.expandedBio}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ResumeDownloadLink primary>
                  Download one-page resume
                </ResumeDownloadLink>
                <Link
                  className="motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                  href="/proof"
                >
                  View proof
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <HeroProfileCard />
          </header>

          <section
            aria-label="Profile proof metrics"
            className="motion-list grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {profileMetricCards().map((metric) => (
              <div
                className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
                key={metric.label}
              >
                <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[var(--color-ivory)]">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--color-warm-silver)]">
                  {metric.detail}
                </p>
              </div>
            ))}
          </section>

          <section
            aria-label="Profile role lens selection"
            className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,560px)] lg:items-center">
              <div>
                <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                  Role lens
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
                  Recruiters, engineers, leaders, and explorers need different
                  evidence density; the profile keeps one identity while the
                  emphasis shifts.
                </p>
              </div>
              <div className="flex flex-wrap gap-2" role="group">
                {(["balanced", ...roleOrder] as const).map((lens) => (
                  <ProfileLensButton
                    active={activeLens === lens}
                    key={lens}
                    lens={lens}
                    onSelect={() => handleLensSelect(lens)}
                  />
                ))}
              </div>
            </div>
          </section>

          <LensPanel
            activeLens={activeLens}
            evidence={model.evidence}
            model={model}
          />

          <section
            aria-labelledby="profile-spine-title"
            className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
          >
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Professional spine
              </p>
              <h2
                className="mt-3 text-3xl font-semibold leading-[1.14] text-[var(--color-ivory)]"
                id="profile-spine-title"
              >
                Current role, core disciplines, and public-safe proof.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                The profile stays focused on the work that can be inspected:
                data platforms, report trust, governed products, role-fit
                positioning, and carefully bounded public content.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="motion-card rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5">
                <BriefcaseBusiness
                  aria-hidden="true"
                  className="h-5 w-5 text-[var(--color-champagne)]"
                />
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-ivory)]">
                  Work focus
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                  {currentRole.discipline} at {currentRole.organization}, with
                  Fabric migration, Databricks products, validation, and BI
                  modernization in scope.
                </p>
              </article>

              <article className="motion-card rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5">
                <UserRound
                  aria-hidden="true"
                  className="h-5 w-5 text-[var(--color-champagne)]"
                />
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-ivory)]">
                  Role positioning
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                  {profile.viewerPositioning[activeViewer]}
                </p>
              </article>
            </div>
          </section>

          <section
            aria-labelledby="profile-proof-title"
            className="border-t border-[var(--border-subtle)] pt-8"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                  Proof links
                </p>
                <h2
                  className="mt-3 text-3xl font-semibold leading-[1.14] text-[var(--color-ivory)]"
                  id="profile-proof-title"
                >
                  Claims route into case files, credentials, and evidence.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                  {highlightedProjects.length} highlighted case files,{" "}
                  {highlightedSkills.length} evidence-backed skill clusters, and{" "}
                  {credentialCount} related credential links support the current
                  profile view.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {roleDisciplineLabels.map((label) => (
                  <span
                    className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-1.5 font-mono text-xs text-[var(--color-ivory-muted)]"
                    key={label}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="motion-list mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {proofRoutes.map((route) => (
                <ProofRouteCard key={route.href} route={route} />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="profile-social-title"
            className="grid gap-6 border-t border-[var(--border-subtle)] pt-8 xl:grid-cols-[minmax(0,1fr)_380px]"
          >
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Social and proof routes
              </p>
              <h2
                className="mt-3 text-3xl font-semibold leading-[1.14] text-[var(--color-ivory)]"
                id="profile-social-title"
              >
                External links stay useful without overclaiming.
              </h2>
              <div className="motion-list mt-6 grid gap-4 sm:grid-cols-2">
                {profile.socialLinks.map((link) => (
                  <SocialLinkCard key={link.label} link={link} />
                ))}
              </div>
            </div>

            <aside className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)]">
              <p className="font-mono text-xs uppercase text-[var(--color-champagne)]">
                Public contact
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
                Professional contact stays simple and safe.
              </h3>
              <ul className="mt-5 grid gap-3">
                {contactBoundaries.map((item) => (
                  <li
                    className="flex gap-3 text-sm leading-6 text-[var(--color-warm-silver)]"
                    key={item}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-2">
                <a
                  className="motion-cta inline-flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_14%,transparent)] px-4 text-sm font-semibold text-[var(--color-ivory)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)]"
                  href="https://www.linkedin.com/in/nirmalkumar6/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="inline-flex items-center gap-2">
                    <SocialGlyph label="in" />
                    Open LinkedIn
                  </span>
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
                <ResumeDownloadLink>Download resume</ResumeDownloadLink>
                <Link
                  className="motion-cta inline-flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-semibold text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                  href="/documents"
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
                    Open document hub
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </section>
        </section>
    </main>
  );
}
