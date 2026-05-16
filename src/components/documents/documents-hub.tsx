"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  Compass,
  Download,
  FileArchive,
  FileText,
  Layers3,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  type LucideIcon
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { useRoleLens } from "@/context/role-lens-context";
import { certifications, profile, projects, type Project, type Viewer } from "@/data";
import { roleOrder } from "@/lib/role-lens";

type DocumentRole = Viewer | "balanced";
type ResumeAssetId = "one-page" | "master";
type PacketId =
  | "recruiter-packet"
  | "proof-packet"
  | "credential-packet"
  | "case-study-exports";
type PacketStatus = "available" | "guided" | "concept" | "placeholder";

type ResumeAsset = {
  id: ResumeAssetId;
  label: string;
  href: string;
  fileName: string;
  size: string;
  updated: string;
  summary: string;
  Icon: LucideIcon;
};

type PacketLink = {
  label: string;
  href: string;
  kind: "Download" | "Route" | "Proof" | "Pending";
};

type DocumentPacket = {
  id: PacketId;
  title: string;
  eyebrow: string;
  status: PacketStatus;
  statusLabel: string;
  summary: string;
  primaryLabel: string;
  primaryHref: string;
  primaryDownload?: string;
  secondaryLabel: string;
  secondaryHref: string;
  assetId?: ResumeAssetId;
  contents: readonly string[];
  links: readonly PacketLink[];
  note: string;
  Icon: LucideIcon;
};

const DOCUMENT_RECOMMENDATION_PANEL_ID = "document-recommendation-panel";

type PacketRecommendation = {
  packetId: PacketId;
  label: string;
  eyebrow: string;
  summary: string;
  why: readonly string[];
  followUpLabel: string;
  followUpHref: string;
  Icon: LucideIcon;
};

const resumeAssets = [
  {
    id: "one-page",
    label: "One-page resume",
    href: "/resume/nirmal-kumar-data-engineer-one-page-resume.docx",
    fileName: "nirmal-kumar-data-engineer-one-page-resume.docx",
    size: "29 KB",
    updated: "May 11, 2026",
    summary:
      "Fast Data Engineer scan with stack, outcomes, credentials, education, and current role context.",
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
      "Expanded source resume for implementation detail, proof review, interview prep, and future generated packets.",
    Icon: FileArchive
  }
] as const satisfies readonly ResumeAsset[];

const resumeAssetById = Object.fromEntries(
  resumeAssets.map((asset) => [asset.id, asset])
) as Record<ResumeAssetId, ResumeAsset>;

const documentPackets = [
  {
    id: "recruiter-packet",
    title: "Recruiter packet",
    eyebrow: "Available guided packet",
    status: "available",
    statusLabel: "DOCX ready",
    summary:
      "The fastest public-safe handoff: one-page resume first, then credential and case-file routes for verification.",
    primaryLabel: "Download one-page resume",
    primaryHref: resumeAssetById["one-page"].href,
    primaryDownload: resumeAssetById["one-page"].fileName,
    secondaryLabel: "Open credentials",
    secondaryHref: "/certifications",
    assetId: "one-page",
    contents: [
      "One-page resume DOCX",
      "Credential verification route",
      "Top professional case files",
      "Profile and contact route"
    ],
    links: [
      {
        label: "One-page resume",
        href: resumeAssetById["one-page"].href,
        kind: "Download"
      },
      { label: "Credential console", href: "/certifications", kind: "Route" },
      { label: "Project case files", href: "/projects", kind: "Route" }
    ],
    note:
      "This is not a bundled PDF or ZIP yet. The current packet is a real DOCX download plus the web proof path.",
    Icon: BriefcaseBusiness
  },
  {
    id: "proof-packet",
    title: "Master resume / proof packet",
    eyebrow: "Available source packet",
    status: "guided",
    statusLabel: "Guided proof",
    summary:
      "A deeper review path centered on the master resume, proof graph, case files, and credential evidence.",
    primaryLabel: "Download master resume",
    primaryHref: resumeAssetById.master.href,
    primaryDownload: resumeAssetById.master.fileName,
    secondaryLabel: "Open proof graph",
    secondaryHref: "/proof",
    assetId: "master",
    contents: [
      "Master resume DOCX",
      "Proof graph route",
      "Implementation-heavy project case files",
      "Credential evidence route"
    ],
    links: [
      {
        label: "Master resume",
        href: resumeAssetById.master.href,
        kind: "Download"
      },
      { label: "Proof graph", href: "/proof", kind: "Route" },
      { label: "Case files", href: "/projects", kind: "Route" }
    ],
    note:
      "The master resume is downloadable now. A combined proof-packet PDF has not been generated yet.",
    Icon: Layers3
  },
  {
    id: "credential-packet",
    title: "Credential packet concept",
    eyebrow: "Concept, not a PDF",
    status: "concept",
    statusLabel: "Concept only",
    summary:
      "A future packet collecting certificates, verification links, related skills, and related projects in one export.",
    primaryLabel: "Open certification console",
    primaryHref: "/certifications",
    secondaryLabel: "Open proof graph",
    secondaryHref: "/proof",
    contents: [
      "Verified and captured credential links",
      "Resume-claimed credential queue",
      "Related skills and project mapping",
      "Future certificate thumbnails"
    ],
    links: [
      { label: "Certification console", href: "/certifications", kind: "Route" },
      { label: "Verification queue", href: "/certifications", kind: "Proof" },
      { label: "Bundled credential PDF", href: "#credential-packet", kind: "Pending" }
    ],
    note:
      "No credential packet download is exposed because certificate thumbnails and several public verification URLs are still pending.",
    Icon: ShieldCheck
  },
  {
    id: "case-study-exports",
    title: "Project case-study exports",
    eyebrow: "Export placeholders",
    status: "placeholder",
    statusLabel: "Not generated",
    summary:
      "Project one-pagers are mapped as export candidates, but the current public experience remains the case-file pages.",
    primaryLabel: "Open case files",
    primaryHref: "/projects",
    secondaryLabel: "Open strongest proof",
    secondaryHref: "/projects/icore-enterprise-mdm-entity-resolution",
    contents: [
      "Case-file page routes",
      "Future one-page PDF candidates",
      "Public-safety boundaries",
      "Pending screenshot and diagram queues"
    ],
    links: [
      { label: "All case files", href: "/projects", kind: "Route" },
      {
        label: "PDF one-pagers",
        href: "#project-export-placeholders",
        kind: "Pending"
      },
      {
        label: "Public-safe media queue",
        href: "#project-export-placeholders",
        kind: "Pending"
      }
    ],
    note:
      "No case-study PDFs are linked yet. Each placeholder routes to the live case file until exports are generated and reviewed.",
    Icon: FileText
  }
] as const satisfies readonly DocumentPacket[];

const packetById = documentPackets.reduce(
  (packetMap, packet) => ({
    ...packetMap,
    [packet.id]: packet
  }),
  {} as Record<PacketId, DocumentPacket>
);

const recommendations = {
  balanced: {
    packetId: "recruiter-packet",
    label: "Balanced",
    eyebrow: "Default document path",
    summary:
      "Start with the recruiter packet because it is the clearest available handoff, then open proof routes as needed.",
    why: [
      "It uses the real one-page resume download.",
      "It keeps credential and case-file proof one step away.",
      "It avoids pretending that bundled PDFs already exist."
    ],
    followUpLabel: "Open resume lens",
    followUpHref: "/resume",
    Icon: Sparkles
  },
  recruiter: {
    packetId: "recruiter-packet",
    label: "Recruiter",
    eyebrow: "Fast screen route",
    summary:
      "Use the one-page resume first, then verify credentials and review the strongest case files only if the screen needs deeper proof.",
    why: [
      "The one-page DOCX is the primary recruiter artifact.",
      "The packet keeps the current role, stack, credentials, and metrics close together.",
      "Follow-up proof stays available without slowing the first pass."
    ],
    followUpLabel: "Verify credentials",
    followUpHref: "/certifications",
    Icon: Users
  },
  engineer: {
    packetId: "proof-packet",
    label: "Engineer",
    eyebrow: "Technical review route",
    summary:
      "Use the master resume and proof graph when the reviewer needs architecture, implementation detail, and system tradeoffs.",
    why: [
      "The master resume carries richer technical context.",
      "Project case files explain Databricks, Fabric, validation, and governance decisions.",
      "The proof graph connects resume claims to inspectable evidence."
    ],
    followUpLabel: "Inspect architecture",
    followUpHref: "/projects/icore-enterprise-mdm-entity-resolution",
    Icon: Code2
  },
  leader: {
    packetId: "case-study-exports",
    label: "Leader",
    eyebrow: "Impact review route",
    summary:
      "Use the case-file path for impact and delivery maturity now; wait on PDF exports until sanitized one-pagers exist.",
    why: [
      "Leadership review needs outcomes, governance, validation quality, and delivery shape.",
      "The live case files are more honest than linking empty export files.",
      "Future PDFs can be generated from this queue after public-safe assets are approved."
    ],
    followUpLabel: "Review impact proof",
    followUpHref: "/projects/bi-migration-validation-analytics",
    Icon: ShieldCheck
  },
  explorer: {
    packetId: "proof-packet",
    label: "Explorer",
    eyebrow: "Full arc route",
    summary:
      "Use the master resume as the source packet, then follow timeline, projects, research, and credentials for the wider story.",
    why: [
      "The broader arc benefits from the expanded source resume.",
      "Research and demo proof belong beside built systems, not above them.",
      "Document sprawl stays contained until generated packets are real."
    ],
    followUpLabel: "Explore timeline",
    followUpHref: "/timeline",
    Icon: Compass
  }
} as const satisfies Record<DocumentRole, PacketRecommendation>;

const roleMeta = {
  balanced: { label: "Balanced", Icon: Sparkles },
  recruiter: { label: "Recruiter", Icon: Users },
  engineer: { label: "Engineer", Icon: Code2 },
  leader: { label: "Leader", Icon: ShieldCheck },
  explorer: { label: "Explorer", Icon: Compass }
} satisfies Record<DocumentRole, { label: string; Icon: LucideIcon }>;

const statusStyles = {
  available:
    "border-[color-mix(in_srgb,var(--color-success)_58%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
  guided:
    "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-signal-blue)]",
  concept:
    "border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]",
  placeholder:
    "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)] text-[var(--color-warm-silver)]"
} satisfies Record<PacketStatus, string>;

const priorityScore = {
  high: 3,
  medium: 2,
  low: 1
} as const;

const projectCatalog: readonly Project[] = projects;

function PacketAction({
  children,
  download,
  href,
  primary = false
}: {
  children: ReactNode;
  download?: string;
  href: string;
  primary?: boolean;
}) {
  const className = `motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
    primary
      ? "border-[var(--border-gold)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:border-[var(--color-champagne)]"
      : "border-[var(--border-subtle)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory)]"
  }`;
  const textLabel = typeof children === "string" ? children : undefined;
  const accessibleLabel = download
    ? `${textLabel ?? "Download document"}. DOCX file: ${download}`
    : href.startsWith("#") && textLabel
      ? `${textLabel}. Same-page section.`
      : undefined;

  if (download) {
    return (
      <a
        aria-label={accessibleLabel}
        className={className}
        download={download}
        href={href}
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a
        aria-label={accessibleLabel}
        className={className}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          focusHashTarget(href);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            focusHashTarget(href);
          }
        }}
      >
        {children}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link aria-label={accessibleLabel} className={className} href={href}>
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

function RoleButton({
  active,
  role,
  onSelect
}: {
  active: boolean;
  role: DocumentRole;
  onSelect: () => void;
}) {
  const { Icon, label } = roleMeta[role];

  return (
    <button
      aria-controls={DOCUMENT_RECOMMENDATION_PANEL_ID}
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

function StatusBadge({ packet }: { packet: DocumentPacket }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none ${statusStyles[packet.status]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {packet.statusLabel}
    </span>
  );
}

function PacketCard({ packet }: { packet: DocumentPacket }) {
  const Icon = packet.Icon;
  const asset = packet.assetId ? resumeAssetById[packet.assetId] : null;

  return (
    <article className="motion-card group flex min-h-[430px] flex-col rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:bg-[var(--card-bg-hover)]">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <StatusBadge packet={packet} />
      </div>

      <div className="mt-5">
        <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
          {packet.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
          {packet.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
          {packet.summary}
        </p>
      </div>

      {asset ? (
        <div className="mt-5 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_62%,transparent)] p-3">
          <div className="flex items-center gap-3">
            <asset.Icon
              aria-hidden="true"
              className="h-4 w-4 text-[var(--color-champagne)]"
            />
            <div>
              <p className="text-sm font-medium text-[var(--color-ivory)]">
                {asset.fileName}
              </p>
              <p className="mt-1 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                {asset.size} / updated {asset.updated}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <ul className="mt-5 grid gap-2">
        {packet.contents.map((item) => (
          <li
            className="flex gap-3 text-sm leading-6 text-[var(--color-ivory-soft)]"
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

      <p className="mt-5 border-t border-[var(--border-subtle)] pt-4 text-xs leading-5 text-[var(--color-warm-silver)]">
        {packet.note}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <PacketAction
          download={packet.primaryDownload}
          href={packet.primaryHref}
          primary
        >
          {packet.primaryLabel}
        </PacketAction>
        <PacketAction href={packet.secondaryHref}>
          {packet.secondaryLabel}
        </PacketAction>
      </div>
    </article>
  );
}

function RecommendationPanel({
  packet,
  recommendation
}: {
  packet: DocumentPacket;
  recommendation: PacketRecommendation;
}) {
  const RecommendationIcon = recommendation.Icon;
  const PacketIcon = packet.Icon;

  return (
    <aside
      aria-labelledby={`${DOCUMENT_RECOMMENDATION_PANEL_ID}-title`}
      aria-live="polite"
      className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={DOCUMENT_RECOMMENDATION_PANEL_ID}
      role="region"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            {recommendation.eyebrow}
          </p>
          <h2
            className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]"
            id={`${DOCUMENT_RECOMMENDATION_PANEL_ID}-title`}
          >
            {packet.title}
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
          <PacketIcon
            aria-hidden="true"
            className="h-5 w-5 text-[var(--color-champagne)]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-[var(--color-ivory)]">
                {recommendation.label} recommendation
              </p>
              <StatusBadge packet={packet} />
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--console-muted)]">
              {packet.note}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <PacketAction
            download={packet.primaryDownload}
            href={packet.primaryHref}
            primary
          >
            {packet.primaryLabel}
          </PacketAction>
          <PacketAction href={recommendation.followUpHref}>
            {recommendation.followUpLabel}
          </PacketAction>
        </div>
      </div>

      <section className="mt-5">
        <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
          Why this packet
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
    </aside>
  );
}

function ResumeAssetCard({ asset }: { asset: ResumeAsset }) {
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
          ["File", asset.fileName],
          ["Status", `${asset.size} / ${asset.updated}`]
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
      <div className="mt-5">
        <PacketAction download={asset.fileName} href={asset.href} primary>
          {`Download ${asset.label}`}
        </PacketAction>
      </div>
    </article>
  );
}

function PacketLinkMatrix() {
  return (
    <section className="motion-section gold-thread-section rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Packet truth table
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
            Real downloads are separated from future exports.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
            The hub can recommend a path by role, but only the two public DOCX
            resume files are exposed as downloads today.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[520px]">
          {documentPackets.flatMap((packet) =>
            packet.links.map((link) => (
              <MatrixLink
                key={`${packet.id}-${link.label}`}
                link={link}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function MatrixLink({ link }: { link: PacketLink }) {
  const className =
    "motion-cta flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]";
  const content = (
    <>
      <span>
        <span className="block font-medium">{link.label}</span>
        <span className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
          {link.kind}
        </span>
      </span>
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </>
  );

  if (link.href.startsWith("#")) {
    return (
      <a
        aria-label={`${link.label}. ${link.kind} same-page section.`}
        className={className}
        href={link.href}
        onClick={(event) => {
          event.preventDefault();
          focusHashTarget(link.href);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            focusHashTarget(link.href);
          }
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={link.href}>
      {content}
    </Link>
  );
}

function compareProjectsForRole(a: Project, b: Project, role: DocumentRole) {
  if (role === "balanced") {
    return projectCatalog.indexOf(a) - projectCatalog.indexOf(b);
  }

  const aPriority = a.viewerPriority[role];
  const bPriority = b.viewerPriority[role];
  const scoreDelta =
    (bPriority ? priorityScore[bPriority] : 0) -
    (aPriority ? priorityScore[aPriority] : 0);

  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  return projectCatalog.indexOf(a) - projectCatalog.indexOf(b);
}

function ProjectExportPlaceholders({ activeRole }: { activeRole: DocumentRole }) {
  const exportProjects = useMemo(
    () =>
      [...projectCatalog]
        .filter((project) => project.status !== "observed")
        .sort((a, b) => compareProjectsForRole(a, b, activeRole)),
    [activeRole]
  );

  return (
    <section
      className="grid gap-5"
      id="project-export-placeholders"
      tabIndex={-1}
    >
      <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Project export placeholders
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            One-pagers are mapped, not generated.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
            Each export candidate stays connected to a live case file. PDF
            links should be added only after public-safe screenshots, diagrams,
            and summaries are approved.
          </p>
        </div>
        <Link
          className="motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
          href="/projects"
        >
          Open all case files
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {exportProjects.map((project) => {
          const pendingMedia = project.media.filter(
            (asset) => asset.status === "pending"
          ).length;
          const verifiedLinks = project.links.filter(
            (link) => link.status === "verified"
          ).length;

          return (
            <article
              className="motion-card flex min-h-[310px] flex-col rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)]"
              key={project.slug}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase text-[var(--color-steel)]">
                    {project.dates} / {project.status}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
                    {project.title}
                  </h3>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase text-[var(--color-warm-silver)]">
                  Not generated
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
                {project.impact}
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-4">
                {[
                  ["Media queue", pendingMedia.toString()],
                  ["Verified links", verifiedLinks.toString()],
                  ["Skills", project.relatedSkills.length.toString()]
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[0.64rem] uppercase leading-4 text-[var(--color-steel)]">
                      {label}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-[var(--color-ivory)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto pt-5">
                <Link
                  className="motion-cta inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                  href={`/projects/${project.slug}`}
                >
                  Open live case file
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CredentialPacketConcept() {
  const credentialsWithProof = certifications.filter(
    (credential) =>
      credential.credentialUrl || (credential.candidateCredentialUrls?.length ?? 0) > 0
  ).length;
  const pendingCredentials = certifications.length - credentialsWithProof;
  const credentialGroups = Array.from(
    new Set(certifications.map((credential) => credential.group))
  );

  return (
    <section
      className="motion-section gold-thread-section rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)]"
      id="credential-packet"
      tabIndex={-1}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Credential packet concept
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            A packet shape exists; the export waits on proof assets.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
            The future credential packet should collect verification links,
            certificate images, related skills, and project mappings. Today the
            honest route is the certification console, because several public
            URLs and thumbnails are still pending.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {credentialGroups.map((group) => (
              <span
                className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-ivory-soft)]"
                key={group}
              >
                {group}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <PacketAction href="/certifications" primary>
              Open certification console
            </PacketAction>
            <PacketAction href="/proof">Open proof graph</PacketAction>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Credentials", certifications.length.toString()],
            ["Proof paths", credentialsWithProof.toString()],
            ["Pending URLs", pendingCredentials.toString()],
            ["Packet file", "0"]
          ].map(([label, value]) => (
            <div
              className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_62%,transparent)] p-4"
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
      </div>
    </section>
  );
}

function HubMetrics() {
  const availableDownloads = resumeAssets.length;
  const proofRoutes = documentPackets.flatMap((packet) =>
    packet.links.filter((link) => link.kind !== "Pending")
  ).length;
  const pendingExports = documentPackets.flatMap((packet) =>
    packet.links.filter((link) => link.kind === "Pending")
  ).length;

  return (
    <dl className="grid grid-cols-2 gap-3">
      {[
        {
          label: "Downloads",
          value: availableDownloads.toString(),
          detail: "public DOCX files"
        },
        {
          label: "Packets",
          value: documentPackets.length.toString(),
          detail: "mapped paths"
        },
        {
          label: "Proof routes",
          value: proofRoutes.toString(),
          detail: "live links"
        },
        {
          label: "Pending exports",
          value: pendingExports.toString(),
          detail: "future files"
        }
      ].map((metric) => (
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
          <dd className="mt-1 text-xs text-[var(--color-warm-silver)]">
            {metric.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DocumentsHub() {
  const { clearRole, role, setRole } = useRoleLens();
  const activeRole: DocumentRole = role ?? "balanced";
  const recommendation = recommendations[activeRole];
  const recommendedPacket = packetById[recommendation.packetId];

  function handleRoleSelect(nextRole: DocumentRole) {
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
              Personalized documents
            </p>
            <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              Role-aware packets, with the future files clearly marked.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              A document hub for {profile.displayName}: recruiter handoff,
              master proof source, credential packet concept, and project
              export queue. Real downloads stay real; planned exports stay
              labeled until generated.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PacketAction
                download={resumeAssetById["one-page"].fileName}
                href={resumeAssetById["one-page"].href}
                primary
              >
                Download one-page resume
              </PacketAction>
              <PacketAction href="/resume">Open resume lens</PacketAction>
            </div>
          </div>

          <HubMetrics />
        </header>

        <section
          aria-label="Document recommendation lens"
          className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,540px)] lg:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Document lens
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
                Change the lens to update the recommended packet and project
                export ordering.
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
            <section className="motion-list grid gap-4 lg:grid-cols-2">
              {documentPackets.map((packet) => (
                <PacketCard key={packet.id} packet={packet} />
              ))}
            </section>

            <section className="motion-list grid gap-4 lg:grid-cols-2">
              {resumeAssets.map((asset) => (
                <ResumeAssetCard asset={asset} key={asset.id} />
              ))}
            </section>
          </div>

          <RecommendationPanel
            key={activeRole}
            packet={recommendedPacket}
            recommendation={recommendation}
          />
        </section>

        <CredentialPacketConcept />
        <ProjectExportPlaceholders activeRole={activeRole} />
        <PacketLinkMatrix />

        <section className="motion-section gold-thread-section rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                V1 decision
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                Static downloads now, dynamic exports later.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                The hub intentionally ships with stable public resume assets and
                role-aware recommendations. Generated PDFs, credential bundles,
                contact cards, and case-study exports should be added only after
                their content and public-safety review are complete.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
              {[
                { label: "One-page resume", Icon: FileText },
                { label: "Master resume", Icon: FileArchive },
                { label: "Credential packet pending", Icon: BadgeCheck },
                { label: "Case-study PDFs pending", Icon: Clock3 }
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <span
                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)]"
                    key={item.label}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 text-[var(--color-champagne)]"
                    />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function focusHashTarget(href: string) {
  const targetId = href.slice(1);
  const target = document.getElementById(targetId);

  window.history.pushState(null, "", href);
  target?.scrollIntoView({ block: "start" });

  window.setTimeout(() => {
    target?.focus({ preventScroll: true });
  }, 0);
}
