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
  FileArchive,
  FileText,
  Layers3,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  type LucideIcon
} from "lucide-react";
import {
  useCallback,
  useMemo,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import { useReducedMotion } from "framer-motion";
import { DownloadLink } from "@/components/ui/download-link";
import { getProjectStatusLabel } from "@/components/project-case-file/project-case-file-model";
import { useRoleLens } from "@/context/role-lens-context";
import { certifications, projects, type Project, type Viewer } from "@/data";
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

type PacketLink = {
  label: string;
  href: string;
  kind: "Download" | "Route" | "Reference" | "Pending";
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
      "Expanded master resume for technical review, leadership context, and role-specific tailoring.",
    bestFor: "Technical deep dives, leadership context, interview prep",
    Icon: FileArchive
  }
] as const satisfies readonly ResumeAsset[];

const resumeAssetById = Object.fromEntries(
  resumeAssets.map((asset) => [asset.id, asset])
) as Record<ResumeAssetId, ResumeAsset>;

const documentPackets = [
  {
    id: "recruiter-packet",
    title: "Recruiter handoff",
    eyebrow: "Ready now",
    status: "available",
    statusLabel: "PDF ready",
    summary:
      "The clean first-pass route: one-page PDF first, then credential and case-study proof if the screen needs depth.",
    primaryLabel: "Download one-page PDF",
    primaryHref: resumeAssetById["one-page"].href,
    primaryDownload: resumeAssetById["one-page"].fileName,
    secondaryLabel: "Open credentials",
    secondaryHref: "/certifications",
    assetId: "one-page",
    contents: [
      "One-page resume PDF",
      "Editable DOCX copy",
      "Credential review route",
      "Selected professional case studies"
    ],
    links: [
      {
        label: "One-page PDF",
        href: resumeAssetById["one-page"].href,
        kind: "Download"
      },
      { label: "Credential console", href: "/certifications", kind: "Route" },
      { label: "Project case studies", href: "/projects", kind: "Route" }
    ],
    note:
      "Use this first for most outreach, referrals, recruiter screens, and quick fit checks.",
    Icon: BriefcaseBusiness
  },
  {
    id: "proof-packet",
    title: "Technical review path",
    eyebrow: "Ready now",
    status: "guided",
    statusLabel: "PDF ready",
    summary:
      "A deeper route for implementation detail: master resume, skill map, architecture-heavy case studies, and credentials.",
    primaryLabel: "Download master PDF",
    primaryHref: resumeAssetById.master.href,
    primaryDownload: resumeAssetById.master.fileName,
    secondaryLabel: "Open skill map",
    secondaryHref: "/proof",
    assetId: "master",
    contents: [
      "Master resume PDF",
      "Editable DOCX copy",
      "Skill map route",
      "Implementation-heavy case studies"
    ],
    links: [
      {
        label: "Master PDF",
        href: resumeAssetById.master.href,
        kind: "Download"
      },
      { label: "Skill map", href: "/proof", kind: "Route" },
      { label: "Case studies", href: "/projects", kind: "Route" }
    ],
    note:
      "Use this when the conversation needs architecture, governance, SQL/Spark detail, or delivery depth.",
    Icon: Layers3
  },
  {
    id: "credential-packet",
    title: "Credential verification path",
    eyebrow: "Live proof route",
    status: "concept",
    statusLabel: "Live route",
    summary:
      "Use the credential page to verify Databricks, Fabric, BI, and governance signals with public links where available.",
    primaryLabel: "Open credentials",
    primaryHref: "/certifications",
    secondaryLabel: "Open skill map",
    secondaryHref: "/proof",
    contents: [
      "Active credential records",
      "Public verification links",
      "Artifact gaps clearly labeled",
      "Related skills and case studies"
    ],
    links: [
      { label: "Credentials", href: "/certifications", kind: "Route" },
      { label: "Skill proof map", href: "/proof", kind: "Route" },
      { label: "Credential evidence summary", href: "#credential-packet", kind: "Reference" }
    ],
    note:
      "No dedicated credential PDF is advertised yet; the live page is the current reference point.",
    Icon: ShieldCheck
  },
  {
    id: "case-study-exports",
    title: "Case-study follow-up",
    eyebrow: "Live proof route",
    status: "placeholder",
    statusLabel: "Live route",
    summary:
      "Use the case studies for sanitized delivery narratives around Fabric, Databricks, BI validation, and governance.",
    primaryLabel: "Open case studies",
    primaryHref: "/projects",
    secondaryLabel: "Open strongest case study",
    secondaryHref: "/projects/icore-enterprise-mdm-entity-resolution",
    contents: [
      "Live case-study routes",
      "Client details anonymized",
      "Proof links and media status",
      "Outcome and stack context"
    ],
    links: [
      { label: "All case studies", href: "/projects", kind: "Route" },
      {
        label: "iCORE case study",
        href: "/projects/icore-enterprise-mdm-entity-resolution",
        kind: "Route"
      },
      {
        label: "One-page roadmap",
        href: "#project-export-placeholders",
        kind: "Reference"
      }
    ],
    note:
      "No separate case-study PDFs are advertised yet; the live case studies carry the approved public story.",
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
    eyebrow: "Default document route",
    summary:
      "Start with the one-page PDF because it is the clearest first pass, then open proof routes only when the review needs depth.",
    why: [
      "It keeps the first pass focused on Data Engineer fit.",
      "It makes the strongest quantified outcomes easy to find.",
      "It keeps credentials and case studies one step away."
    ],
    followUpLabel: "Open resume",
    followUpHref: "/resume",
    Icon: Sparkles
  },
  recruiter: {
    packetId: "recruiter-packet",
    label: "Recruiter",
    eyebrow: "Fast screen route",
    summary:
      "Use the one-page resume first, then verify credentials and review the strongest case studies only if the screen needs deeper context.",
    why: [
      "The one-page PDF is the primary recruiter artifact.",
      "The route keeps the current role, stack, credentials, and metrics close together.",
      "Follow-up project context stays available without slowing the first pass."
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
      "Use the master resume and skill map when the reviewer needs architecture, implementation detail, and system tradeoffs.",
    why: [
      "The master PDF carries richer technical context.",
      "Project case studies explain Databricks, Fabric, validation, and governance decisions.",
      "The skill map connects resume statements to projects, metrics, and credentials."
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
      "Use the case-study path for impact, governance, validation quality, and delivery maturity.",
    why: [
      "Leadership review needs outcomes, governance, validation quality, and delivery shape.",
      "The live case studies avoid over-sharing client-specific details.",
      "One-pagers should be added only after approved assets are ready."
    ],
    followUpLabel: "Review impact",
    followUpHref: "/projects/bi-migration-validation-analytics",
    Icon: ShieldCheck
  },
  explorer: {
    packetId: "proof-packet",
    label: "Explorer",
    eyebrow: "Full arc route",
    summary:
      "Use the master resume for depth, then follow timeline, projects, research, and credentials for the wider story.",
    why: [
      "The broader arc benefits from the expanded master resume.",
      "Research and demo work belongs beside built systems, not above them.",
      "Additional files stay contained until they are ready to publish."
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

const documentReviewSteps = [
  {
    step: "01",
    label: "PDF first",
    detail: "One-page resume for the clean scan"
  },
  {
    step: "02",
    label: "Role packet",
    detail: "Recommended route adapts by audience"
  },
  {
    step: "03",
    label: "Proof depth",
    detail: "Credentials and case studies after fit"
  }
] as const;

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

function resetDocumentSurfacePresence(target: HTMLElement) {
  target.style.setProperty("--documents-surface-x", "58%");
  target.style.setProperty("--documents-surface-y", "34%");
  target.style.setProperty("--documents-surface-tilt", "0deg");
  target.style.removeProperty("transform");
}

function useDocumentSurfacePresence({
  focusX = "70%",
  focusY = "30%",
  tiltScale = 0.012
}: {
  focusX?: string;
  focusY?: string;
  tiltScale?: number;
} = {}) {
  const prefersReducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tilt = (pointerX - 50) * tiltScale;

      event.currentTarget.style.setProperty(
        "--documents-surface-x",
        `${pointerX.toFixed(2)}%`
      );
      event.currentTarget.style.setProperty(
        "--documents-surface-y",
        `${pointerY.toFixed(2)}%`
      );
      event.currentTarget.style.setProperty(
        "--documents-surface-tilt",
        `${tilt.toFixed(3)}deg`
      );
      event.currentTarget.style.setProperty(
        "transform",
        `translateY(-2px) rotate(${tilt.toFixed(3)}deg)`,
        "important"
      );
    },
    [prefersReducedMotion, tiltScale]
  );

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    resetDocumentSurfacePresence(event.currentTarget);
  }, []);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      event.currentTarget.style.setProperty("--documents-surface-x", focusX);
      event.currentTarget.style.setProperty("--documents-surface-y", focusY);

      if (!prefersReducedMotion) {
        event.currentTarget.style.setProperty(
          "transform",
          "translateY(-2px) rotate(0.12deg)",
          "important"
        );
      }
    },
    [focusX, focusY, prefersReducedMotion]
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    resetDocumentSurfacePresence(event.currentTarget);
  }, []);

  return {
    handleBlur,
    handleFocus,
    handlePointerLeave,
    handlePointerMove,
    style: {
      "--documents-surface-x": "58%",
      "--documents-surface-y": "34%",
      "--documents-surface-tilt": "0deg"
    } as CSSProperties
  };
}

function DocumentSurfaceEffects() {
  return (
    <>
      <span aria-hidden="true" className="documents-packet-lens absolute" />
      <span aria-hidden="true" className="documents-packet-scan absolute" />
      <span aria-hidden="true" className="documents-packet-orbit absolute rounded-full" />
      <span
        aria-hidden="true"
        className="documents-packet-corner documents-packet-corner--top absolute"
      />
      <span
        aria-hidden="true"
        className="documents-packet-corner documents-packet-corner--bottom absolute"
      />
    </>
  );
}

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
  const className = `motion-cta documents-action-link inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-control)] border px-4 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
    primary
      ? "primary-action-link border-[var(--border-gold)] bg-[var(--button-primary-bg)] hover:border-[var(--color-champagne)]"
      : "border-[var(--border-subtle)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory)]"
  }`;
  const textLabel = typeof children === "string" ? children : undefined;
  const downloadFormat = download?.toLowerCase().endsWith(".pdf")
    ? "PDF"
    : download?.toLowerCase().endsWith(".docx")
      ? "DOCX"
      : "document";
  const accessibleLabel = download
    ? `${textLabel ?? "Download document"}. ${downloadFormat} file: ${download}`
    : href.startsWith("#") && textLabel
      ? `${textLabel}. Same-page section.`
      : undefined;

  if (download) {
    return (
      <DownloadLink
        ariaLabel={accessibleLabel}
        className={className}
        download={download}
        href={href}
      >
        <span aria-hidden="true" className="documents-action-spark" />
        {children}
      </DownloadLink>
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
        <span aria-hidden="true" className="documents-action-spark" />
        {children}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link aria-label={accessibleLabel} className={className} href={href}>
      <span aria-hidden="true" className="documents-action-spark" />
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

function DocumentReviewProtocol() {
  return (
    <ol
      aria-label="Document review order"
      className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-3"
    >
      {documentReviewSteps.map((item) => (
        <li
          className="documents-protocol-step relative overflow-hidden rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-panel)_68%,transparent)] px-3 py-2.5 shadow-[var(--shadow-hairline-inset)]"
          key={item.step}
        >
          <span
            aria-hidden="true"
            className="documents-protocol-bead absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
          />
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
  role: DocumentRole;
  onSelect: () => void;
}) {
  const { Icon, label } = roleMeta[role];

  return (
    <button
      aria-controls={DOCUMENT_RECOMMENDATION_PANEL_ID}
      aria-pressed={active}
      className={`motion-lens-choice documents-role-button relative inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-[var(--radius-control)] border px-3 text-sm transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        active
          ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
          : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
      }`}
      data-active={active ? "true" : undefined}
      onClick={onSelect}
      type="button"
    >
      <span aria-hidden="true" className="documents-role-glow absolute inset-0 rounded-[inherit]" />
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

function StatusBadge({ packet }: { packet: DocumentPacket }) {
  const isReady = packet.status === "available" || packet.status === "guided";

  return (
    <span
      className={`documents-status-badge inline-flex items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none ${statusStyles[packet.status]}`}
      data-active={isReady ? "true" : undefined}
      data-status={packet.status}
    >
      <span
        aria-hidden="true"
        className="documents-status-dot h-1.5 w-1.5 rounded-full bg-current"
      />
      {packet.statusLabel}
    </span>
  );
}

function PacketCard({ packet }: { packet: DocumentPacket }) {
  const Icon = packet.Icon;
  const asset = packet.assetId ? resumeAssetById[packet.assetId] : null;
  const surfacePresence = useDocumentSurfacePresence({
    focusX: "72%",
    focusY: "28%"
  });

  return (
    <article
      className="motion-card documents-packet-card group relative flex min-h-[430px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:bg-[var(--card-bg-hover)]"
      onBlur={surfacePresence.handleBlur}
      onFocus={surfacePresence.handleFocus}
      onPointerLeave={surfacePresence.handlePointerLeave}
      onPointerMove={surfacePresence.handlePointerMove}
      style={surfacePresence.style}
    >
      <DocumentSurfaceEffects />
      <div className="flex items-start justify-between gap-4">
        <span className="documents-packet-icon relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
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
        <div className="documents-file-receipt relative mt-5 overflow-hidden rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_62%,transparent)] p-3">
          <span aria-hidden="true" className="documents-receipt-current absolute inset-0" />
          <div className="flex items-center gap-3">
            <asset.Icon
              aria-hidden="true"
              className="h-4 w-4 text-[var(--color-champagne)]"
            />
            <div>
              <p className="text-sm font-medium text-[var(--color-ivory)]">
                {asset.label} PDF
              </p>
              <p className="mt-1 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                {asset.size} / editable DOCX {asset.docxSize} / updated {asset.updated}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <ul className="mt-5 grid gap-2">
        {packet.contents.map((item) => (
          <li
            className="documents-content-row relative flex gap-3 overflow-hidden rounded-[var(--radius-control)] text-sm leading-6 text-[var(--color-ivory-soft)]"
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
      className="motion-detail-swap documents-detail-panel relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={DOCUMENT_RECOMMENDATION_PANEL_ID}
      role="region"
    >
      <span aria-hidden="true" className="documents-detail-ambient absolute rounded-full" />
      <span aria-hidden="true" className="documents-detail-scan absolute" />
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
        <span className="documents-recommendation-icon relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-signal-blue)]">
          <RecommendationIcon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
        {recommendation.summary}
      </p>

      <div className="documents-route-summary relative mt-5 overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] p-4">
        <span aria-hidden="true" className="documents-route-current absolute inset-0" />
        <div className="flex items-center gap-3">
          <PacketIcon
            aria-hidden="true"
            className="h-5 w-5 text-[var(--color-champagne)]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-[var(--color-ivory)]">
                {recommendation.label} route
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
          Why this route
        </h3>
        <ul className="mt-3 space-y-2">
          {recommendation.why.map((item) => (
            <li
              className="documents-reason-row relative flex gap-3 overflow-hidden rounded-[var(--radius-control)] text-sm leading-6 text-[var(--console-muted)]"
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
  const surfacePresence = useDocumentSurfacePresence({
    focusX: "64%",
    focusY: "32%",
    tiltScale: 0.01
  });

  return (
    <article
      className="motion-card documents-packet-card documents-asset-card relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)]"
      onBlur={surfacePresence.handleBlur}
      onFocus={surfacePresence.handleFocus}
      onPointerLeave={surfacePresence.handlePointerLeave}
      onPointerMove={surfacePresence.handlePointerMove}
      style={surfacePresence.style}
    >
      <DocumentSurfaceEffects />
      <div className="flex items-start gap-4">
        <span className="documents-packet-icon relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]">
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
          ["Primary file", `${asset.format} / ${asset.size}`],
          ["Editable copy", `DOCX / ${asset.docxSize}`],
          ["Updated", asset.updated],
          ["Best for", asset.bestFor]
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
        <PacketAction download={asset.fileName} href={asset.href} primary>
          Download PDF
        </PacketAction>
        <PacketAction download={asset.docxFileName} href={asset.docxHref}>
          Download DOCX
        </PacketAction>
      </div>
    </article>
  );
}

function PacketLinkMatrix() {
  return (
    <section className="documents-matrix-panel gold-thread-section relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
      <span aria-hidden="true" className="documents-detail-ambient absolute rounded-full" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Available routes
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
            Downloads and proof routes stay explicit.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
            The primary downloads are PDFs. Editable DOCX copies remain
            available, and additional bundles stay out of the main review flow
            until they exist.
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
    "motion-cta documents-route-link relative flex min-h-12 items-center justify-between gap-3 overflow-hidden rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]";
  const content = (
    <>
      <span aria-hidden="true" className="documents-route-current absolute inset-0" />
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

function ProjectExportCard({ project }: { project: Project }) {
  const pendingMedia = project.media.filter(
    (asset) => asset.status === "pending"
  ).length;
  const verifiedLinks = project.links.filter(
    (link) => link.status === "verified"
  ).length;
  const surfacePresence = useDocumentSurfacePresence({
    focusX: "62%",
    focusY: "26%",
    tiltScale: 0.009
  });

  return (
    <article
      className="motion-card documents-packet-card documents-export-card relative flex min-h-[310px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow-hairline-inset)]"
      onBlur={surfacePresence.handleBlur}
      onFocus={surfacePresence.handleFocus}
      onPointerLeave={surfacePresence.handlePointerLeave}
      onPointerMove={surfacePresence.handlePointerMove}
      style={surfacePresence.style}
    >
      <DocumentSurfaceEffects />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-steel)]">
            {project.dates} / {getProjectStatusLabel(project.status)}
          </p>
          <h3 className="mt-2 text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
            {project.title}
          </h3>
        </div>
        <span className="documents-roadmap-badge inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[0.6875rem] uppercase text-[var(--color-warm-silver)]">
          <span aria-hidden="true" className="documents-status-dot h-1.5 w-1.5 rounded-full bg-current" />
          Roadmap
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--color-warm-silver)]">
        {project.impact}
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-4">
        {[
          ["Visuals to add", pendingMedia.toString()],
          ["Proof links", verifiedLinks.toString()],
          ["Skill ties", project.relatedSkills.length.toString()]
        ].map(([label, value]) => (
          <div className="documents-export-stat relative" key={label}>
            <span aria-hidden="true" className="documents-metric-dot absolute" />
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
          className="motion-cta documents-action-link inline-flex min-h-10 w-full items-center justify-between gap-3 overflow-hidden rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
          href={`/projects/${project.slug}`}
        >
          <span aria-hidden="true" className="documents-action-spark" />
          Open live case study
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
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
            Case-study one-page roadmap
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            Add one-pagers after public-proof review is complete.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
            Each one-pager should stay connected to a live case study. PDF
            links belong here only after screenshots, diagrams, and summaries
            are approved for public use.
          </p>
        </div>
        <Link
          className="motion-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
          href="/projects"
        >
          Open all case studies
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {exportProjects.map((project) => (
          <ProjectExportCard key={project.slug} project={project} />
        ))}
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
      className="documents-credential-panel gold-thread-section relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-5 shadow-[var(--shadow-surface)]"
      id="credential-packet"
      tabIndex={-1}
    >
      <span aria-hidden="true" className="documents-detail-ambient absolute rounded-full" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Credential evidence summary
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            The credential page comes first; a summary comes later.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
            A dedicated evidence summary should collect public links,
            certificate images, related skills, and project mappings once those
            assets are approved. Today the clearest public route is the
            credential page.
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
            <PacketAction href="/proof">Open skill map</PacketAction>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Credentials", certifications.length.toString()],
            ["Public references", credentialsWithProof.toString()],
            ["Artifact gaps", pendingCredentials.toString()],
            ["Summary files", "0"]
          ].map(([label, value]) => (
            <div
              className="documents-metric-card relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_62%,transparent)] p-4"
              key={label}
            >
              <span aria-hidden="true" className="documents-metric-dot absolute" />
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
  const primaryDownloads = resumeAssets.length;
  const editableCopies = resumeAssets.length;
  const proofRoutes = documentPackets.flatMap((packet) =>
    packet.links.filter((link) => link.kind === "Route")
  ).length;

  return (
    <dl className="grid grid-cols-2 gap-3">
      {[
        {
          label: "Primary PDFs",
          value: primaryDownloads.toString(),
          detail: "ready downloads"
        },
        {
          label: "Editable DOCX",
          value: editableCopies.toString(),
          detail: "available copies"
        },
        {
          label: "Proof routes",
          value: proofRoutes.toString(),
          detail: "live links"
        },
        {
          label: "Review paths",
          value: documentPackets.length.toString(),
          detail: "by audience"
        }
      ].map((metric) => (
        <div
          className="motion-card documents-metric-card relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
          key={metric.label}
        >
          <span aria-hidden="true" className="documents-metric-dot absolute" />
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
    <main
      className="documents-hub-page min-h-screen overflow-hidden px-[var(--layout-gutter)] pb-10 pt-[calc(var(--site-header-offset)+var(--space-5))]"
      id="main-content"
      tabIndex={-1}
    >
      <section className="motion-section documents-stage gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="documents-hero-shell relative grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <span aria-hidden="true" className="documents-hero-ambient absolute rounded-full" />
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
              Interview documents
            </p>
            <h1 className="editorial-title editorial-title--section editorial-title--ivory mt-4 max-w-4xl">
              Public resume files and proof routes for a clean first pass.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              Download the PDF resumes first. Editable DOCX copies and
              role-specific proof routes stay available without crowding the
              review.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PacketAction
                download={resumeAssetById["one-page"].fileName}
                href={resumeAssetById["one-page"].href}
                primary
              >
                Download one-page PDF
              </PacketAction>
              <PacketAction href="/resume">Open resume</PacketAction>
            </div>
            <DocumentReviewProtocol />
          </div>

          <HubMetrics />
        </header>

        <section
          aria-label="Document recommendation focus"
          className="motion-panel-enter documents-focus-panel relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <span aria-hidden="true" className="documents-route-current absolute inset-0" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,540px)] lg:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Review focus
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
                Focus updates the recommended download and follow-up route.
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

        <section className="documents-rule-panel gold-thread-section relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
          <span aria-hidden="true" className="documents-detail-ambient absolute rounded-full" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Publishing rule
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                Current files first, generated summaries later.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                The hub intentionally ships with stable public PDFs, editable
                DOCX copies, and role-aware proof routes. Credential summaries
                and case-study one-pagers should be added only after their
                content and confidentiality review are complete.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
              {[
                { label: "One-page PDF", Icon: FileText },
                { label: "Master PDF", Icon: FileArchive },
                { label: "Credential evidence summary", Icon: BadgeCheck },
                { label: "Case-study one-pager roadmap", Icon: Clock3 }
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <span
                    className="documents-publish-chip inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)]"
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
