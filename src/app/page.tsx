import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  FileText,
  Layers3,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { CinematicHero } from "@/components/cinematic";
import { RoleGateway } from "@/components/role-gateway";
import { SocialDock } from "@/components/social-dock";
import { RoleLensProvider } from "@/context/role-lens-context";
import {
  certifications,
  featuredProjectSlugs,
  futureProjects,
  projects,
  skillClusters,
  timelineEvents,
  type TimelineEvent
} from "@/data";
import { plannedRoutes } from "@/lib/constants/routes";

type PlannedRouteHref = (typeof plannedRoutes)[number]["href"];

type SurfaceCard = {
  href: PlannedRouteHref;
  label: string;
  title: string;
  description: string;
  stat: string;
  Icon: LucideIcon;
};

const routeDescriptionByHref = new Map<PlannedRouteHref, string>(
  plannedRoutes.map((route) => [route.href, route.description])
);

const featuredProjects = featuredProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter(isDefined);

const timelineHighlights = timelineEvents
  .filter((event) => ["very-high", "high"].includes(event.importance))
  .slice(0, 3);

const credentialHighlights = certifications.slice(0, 4);
const futureProject = futureProjects[0];

const portfolioSurfaces: readonly SurfaceCard[] = [
  {
    href: "/proof",
    label: "Proof",
    title: "Claims connected to inspectable evidence.",
    description: routeDescription("/proof"),
    stat: `${skillClusters.length} skill clusters`,
    Icon: Network
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Case files for systems under pressure.",
    description: routeDescription("/projects"),
    stat: `${featuredProjectSlugs.length} core case files`,
    Icon: Layers3
  },
  {
    href: "/timeline",
    label: "Timeline",
    title: "Momentum from education to current ownership.",
    description: routeDescription("/timeline"),
    stat: `${timelineEvents.length} milestones`,
    Icon: CalendarDays
  },
  {
    href: "/certifications",
    label: "Credentials",
    title: "Certifications with verification state visible.",
    description: routeDescription("/certifications"),
    stat: `${certifications.length} credentials`,
    Icon: ShieldCheck
  },
  {
    href: "/future-projects",
    label: "Future",
    title: "What is next, grounded by existing proof.",
    description: routeDescription("/future-projects"),
    stat: `${futureProjects.length} explorations`,
    Icon: Rocket
  },
  {
    href: "/resume",
    label: "Resume",
    title: "Fast recruiter path with deeper proof nearby.",
    description: routeDescription("/resume"),
    stat: "2 resume assets",
    Icon: FileText
  },
  {
    href: "/documents",
    label: "Documents",
    title: "Proof packets and exports have a home.",
    description: routeDescription("/documents"),
    stat: "Document hub",
    Icon: Award
  }
];

export default function HomePage() {
  return (
    <RoleLensProvider>
      <main className="min-h-screen overflow-hidden px-[var(--layout-gutter)] pb-[calc(var(--space-24)+88px)]">
        <CinematicHero />
        <RoleGateway />
        <PortfolioMapSection />
        <FeaturedProjectsSection />
        <EvidencePreviewSection />
        <FutureDocumentsSection />
      </main>
      <SocialDock viewer="recruiter" />
    </RoleLensProvider>
  );
}

function PortfolioMapSection() {
  return (
    <section
      aria-labelledby="portfolio-map-title"
      className="motion-section gold-thread-section mx-auto max-w-[var(--layout-page-max)] border-b border-[var(--border-subtle)] py-20"
    >
      <SectionHeader
        copy="The homepage now works as a connected index into the complete proof system: graph, case files, timeline, credentials, future tracks, resume, and documents."
        eyebrow="Portfolio map"
        id="portfolio-map-title"
        title="One path, seven connected surfaces."
      />

      <div className="motion-list mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {portfolioSurfaces.map(({ Icon, ...surface }) => (
          <Link
            className="motion-card group flex min-h-[228px] flex-col rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition duration-[var(--duration-state)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:bg-[var(--surface-panel-hover)]"
            href={surface.href}
            key={surface.href}
          >
            <span className="flex items-start justify-between gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
                {surface.label}
              </span>
            </span>
            <strong className="mt-5 block font-[var(--font-display)] text-xl font-semibold leading-[var(--leading-heading)] text-[var(--color-ivory)]">
              {surface.title}
            </strong>
            <span className="mt-3 block text-sm leading-6 text-[var(--color-warm-silver)]">
              {surface.description}
            </span>
            <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm font-semibold text-[var(--color-ivory-soft)]">
              {surface.stat}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProjectsSection() {
  return (
    <section
      aria-labelledby="featured-projects-title"
      className="motion-section gold-thread-section mx-auto max-w-[var(--layout-page-max)] border-b border-[var(--border-subtle)] py-20"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
        <SectionHeader
          copy="The default homepage path now points into the same three case files that anchor the full project index."
          eyebrow="Featured work"
          id="featured-projects-title"
          title="Core proof before supporting signal."
        />
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <HomeCta href="/projects" label="View all case files" />
          <HomeCta href="/proof" label="Open proof graph" variant="quiet" />
        </div>
      </div>

      <div className="motion-list mt-10 grid gap-4 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <article
            className="motion-card flex min-h-[360px] flex-col rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5"
            key={project.slug}
          >
            <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
              {project.status} / {project.dates}
            </p>
            <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold leading-[var(--leading-heading)] text-[var(--color-ivory)]">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
              {project.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.slice(0, 5).map((item) => (
                <span
                  className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-xs text-[var(--color-ivory-muted)]"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
            <Link
              className="motion-cta mt-auto inline-flex min-h-10 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-semibold text-[var(--color-ivory-soft)] transition hover:border-[var(--border-gold)]"
              href={`/projects/${project.slug}`}
            >
              Open case file
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidencePreviewSection() {
  return (
    <section
      aria-labelledby="evidence-preview-title"
      className="motion-section gold-thread-section mx-auto max-w-[var(--layout-page-max)] border-b border-[var(--border-subtle)] py-20"
    >
      <SectionHeader
        copy="Supporting previews keep the portfolio moving from claims into chronology and credential evidence."
        eyebrow="Evidence previews"
        id="evidence-preview-title"
        title="Proof, timeline, and credentials stay adjacent."
      />

      <div className="motion-list mt-10 grid gap-4 lg:grid-cols-3">
        <PreviewPanel
          actionHref="/proof"
          actionLabel="Open proof graph"
          eyebrow="Proof graph"
          title="Evidence-backed skill clusters"
        >
          <ul className="grid gap-3">
            {skillClusters.slice(0, 3).map((skill) => (
              <li
                className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
                key={skill.id}
              >
                <strong className="block text-sm font-semibold text-[var(--color-ivory-soft)]">
                  {skill.title}
                </strong>
                <span className="mt-1 block text-xs leading-5 text-[var(--color-warm-silver)]">
                  {skill.proofPoints.slice(0, 2).join(" / ")}
                </span>
              </li>
            ))}
          </ul>
        </PreviewPanel>

        <PreviewPanel
          actionHref="/timeline"
          actionLabel="Explore timeline"
          eyebrow="Timeline"
          title="Career momentum"
        >
          <ol className="grid gap-3">
            {timelineHighlights.map((event) => (
              <li
                className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
                key={event.id}
              >
                <span className="font-mono text-xs text-[var(--color-antique-gold)]">
                  {timelineDateLabel(event)}
                </span>
                <strong className="mt-1 block text-sm font-semibold leading-5 text-[var(--color-ivory-soft)]">
                  {event.title}
                </strong>
              </li>
            ))}
          </ol>
        </PreviewPanel>

        <PreviewPanel
          actionHref="/certifications"
          actionLabel="Inspect credentials"
          eyebrow="Credentials"
          title="Certification console"
        >
          <ul className="grid gap-3">
            {credentialHighlights.map((credential) => (
              <li
                className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3"
                key={credential.slug}
              >
                <strong className="block text-sm font-semibold leading-5 text-[var(--color-ivory-soft)]">
                  {credential.title}
                </strong>
                <span className="mt-1 block text-xs leading-5 text-[var(--color-warm-silver)]">
                  {credential.issuer} /{" "}
                  {credential.verificationStatus.replaceAll("-", " ")}
                </span>
              </li>
            ))}
          </ul>
        </PreviewPanel>
      </div>
    </section>
  );
}

function FutureDocumentsSection() {
  return (
    <section
      aria-labelledby="future-documents-title"
      className="motion-section gold-thread-section mx-auto max-w-[var(--layout-page-max)] py-20"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <SectionHeader
          copy="The closing homepage path now sends visitors to the future observatory, resume lens, or document hub depending on what they need next."
          eyebrow="Next proof path"
          id="future-documents-title"
          title="Ambition, resume, and packets are wired in."
        />

        <div className="grid gap-4">
          {futureProject ? (
            <Link
              className="motion-card group rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition hover:border-[var(--border-gold)]"
              href="/future-projects"
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-antique-gold)]">
                <Rocket aria-hidden="true" className="h-4 w-4" />
                Currently exploring
              </span>
              <strong className="mt-3 block font-[var(--font-display)] text-2xl font-semibold text-[var(--color-ivory)]">
                {futureProject.title}
              </strong>
              <span className="mt-3 block text-sm leading-6 text-[var(--color-warm-silver)]">
                {futureProject.targetOutcome}
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ivory-soft)]">
                Open observatory
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              className="motion-card group rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition hover:border-[var(--border-gold)]"
              href="/resume"
            >
              <Sparkles aria-hidden="true" className="h-5 w-5 text-[var(--color-champagne)]" />
              <strong className="mt-4 block font-[var(--font-display)] text-xl font-semibold text-[var(--color-ivory)]">
                Resume lens
              </strong>
              <span className="mt-2 block text-sm leading-6 text-[var(--color-warm-silver)]">
                Recruiter-first download with the master resume nearby.
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ivory-soft)]">
                Open resume
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>

            <Link
              className="motion-card group rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition hover:border-[var(--border-gold)]"
              href="/documents"
            >
              <FileText aria-hidden="true" className="h-5 w-5 text-[var(--color-champagne)]" />
              <strong className="mt-4 block font-[var(--font-display)] text-xl font-semibold text-[var(--color-ivory)]">
                Documents
              </strong>
              <span className="mt-2 block text-sm leading-6 text-[var(--color-warm-silver)]">
                Reserved home for proof packets, exports, and document flows.
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ivory-soft)]">
                Open hub
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  id: string;
  title: string;
  copy: string;
};

function SectionHeader({ copy, eyebrow, id, title }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
        {eyebrow}
      </p>
      <h2
        className="mt-3 font-[var(--font-display)] text-3xl font-semibold leading-[var(--leading-heading)] text-[var(--color-ivory)] sm:text-4xl"
        id={id}
      >
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)]">
        {copy}
      </p>
    </div>
  );
}

type HomeCtaProps = {
  href: PlannedRouteHref;
  label: string;
  variant?: "solid" | "quiet";
};

function HomeCta({ href, label, variant = "solid" }: HomeCtaProps) {
  return (
    <Link
      className={`motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm font-semibold transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        variant === "solid"
          ? "border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_16%,transparent)] text-[var(--color-ivory)]"
          : "border-[var(--border-subtle)] text-[var(--color-ivory-soft)] hover:border-[var(--border-gold)]"
      }`}
      href={href}
    >
      {label}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

type PreviewPanelProps = {
  actionHref: PlannedRouteHref;
  actionLabel: string;
  children: React.ReactNode;
  eyebrow: string;
  title: string;
};

function PreviewPanel({
  actionHref,
  actionLabel,
  children,
  eyebrow,
  title
}: PreviewPanelProps) {
  return (
    <article className="motion-card flex min-h-[430px] flex-col rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5">
      <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-[var(--font-display)] text-2xl font-semibold leading-[var(--leading-heading)] text-[var(--color-ivory)]">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
      <Link
        className="motion-cta mt-auto inline-flex min-h-10 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-semibold text-[var(--color-ivory-soft)] transition hover:border-[var(--border-gold)]"
        href={actionHref}
      >
        {actionLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </article>
  );
}

function routeDescription(href: PlannedRouteHref) {
  return routeDescriptionByHref.get(href) ?? "";
}

function timelineDateLabel(event: TimelineEvent) {
  if (event.startDate && event.endDate && event.startDate !== event.endDate) {
    return `${event.startDate} - ${event.endDate}`;
  }

  return event.endDate ?? event.startDate ?? "Current";
}

function isDefined<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}
