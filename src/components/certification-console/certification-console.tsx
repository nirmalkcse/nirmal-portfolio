"use client";

import { RecognitionPanel } from "@/components/signature/recognition-seal";
import { IssuerMark, normalizeIssuer as brandIssuer } from "@/components/brand/brand-logos";
import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  certificationGroups,
  certifications,
  databricksCredentialUrl,
  microsoftCredentialCandidateUrls,
  projects
} from "@/data";
import type { Certification } from "@/data";

// Issuer marks come from @/components/brand/brand-logos (official vectors).

type EvidenceState =
  | "verified"
  | "verified-expired"
  | "indirectly-supported"
  | "link-captured"
  | "resume-claimed";

type EvidenceTone = "success" | "warning" | "info" | "muted";

type EvidenceProfile = {
  state: EvidenceState;
  label: string;
  shortLabel: string;
  tone: EvidenceTone;
  issueDate: string;
  expiry: string;
  proofUrl: string | null;
  proofLabel: string;
  drawerSummary: string;
  metadata: readonly string[];
};

type StatusFilter = "all" | "verified" | "needs-proof";

type CredentialView = Certification & {
  evidence: EvidenceProfile;
  proofUrls: readonly string[];
  relatedProjectTitles: readonly string[];
};

const CREDENTIAL_DETAIL_PANEL_ID = "credential-detail-panel";

const allGroups = ["All", ...certificationGroups] as const;

const defaultEvidenceBySlug: Record<string, EvidenceProfile> = {
  "fabric-data-engineer-associate": {
    state: "verified-expired",
    label: "Expired",
    shortLabel: "Expired",
    tone: "warning",
    issueDate: "Apr 30, 2025",
    expiry: "May 1, 2026",
    proofUrl: microsoftCredentialCandidateUrls[0],
    proofLabel: "Microsoft Learn",
    drawerSummary:
      "Public Microsoft Learn verification is available, but the credential expired on May 1, 2026. Keep it historical until a renewed page is available.",
    metadata: [
      "Credential page manually checked on May 16, 2026",
      "Public profile name captured from Microsoft Learn",
      "Credential ID kept out of the card for cleaner public scanning"
    ]
  },
  "fabric-analytics-engineer-associate": {
    state: "verified",
    label: "Verified",
    shortLabel: "Verified",
    tone: "success",
    issueDate: "Jun 22, 2024",
    expiry: "Jun 23, 2026",
    proofUrl: microsoftCredentialCandidateUrls[1],
    proofLabel: "Microsoft Learn",
    drawerSummary:
      "Direct Microsoft Learn verification is available and current through Jun 23, 2026.",
    metadata: [
      "Credential page manually checked on May 16, 2026",
      "Public profile name captured from Microsoft Learn",
      "Current public link is available"
    ]
  },
  "databricks-data-engineer-associate": {
    state: "indirectly-supported",
    label: "Supporting link",
    shortLabel: "Supporting",
    tone: "info",
    issueDate: "Date not shown",
    expiry: "Date not shown",
    proofUrl: databricksCredentialUrl,
    proofLabel: "Supporting Databricks reference",
    drawerSummary:
      "A direct public Data Engineer Associate credential link should be attached before this item is promoted. The Databricks reference remains useful as supporting context, but it should not be presented as the standalone credential link.",
    metadata: [
      "Direct public credential URL to add",
      "Supporting Databricks credential is verified",
      "Do not present as a direct standalone public credential yet"
    ]
  },
  "databricks-uc-upgrade-delivery-specialization": {
    state: "verified",
    label: "Verified",
    shortLabel: "Verified",
    tone: "success",
    issueDate: "Feb 18, 2026",
    expiry: "Feb 18, 2028",
    proofUrl: databricksCredentialUrl,
    proofLabel: "Databricks credential",
    drawerSummary:
      "Direct Databricks credential verification is available and current through Feb 18, 2028.",
    metadata: [
      "Accredible credential URL captured",
      "Owner verified as Nirmal Kumar Pukazhenthi",
      "Certificate reference is hidden from card-level UI"
    ]
  },
  "databricks-fundamentals": {
    state: "resume-claimed",
    label: "Public link to add",
    shortLabel: "Link to add",
    tone: "muted",
    issueDate: "Date not shown",
    expiry: "Date not shown",
    proofUrl: null,
    proofLabel: "Verification link to add",
    drawerSummary:
      "This credential is listed on the resume; a public verification link should be attached before it is promoted.",
    metadata: [
      "Public credential URL to add",
      "Issue and expiry dates not shown",
      "Keep as a lower-emphasis credential until a public link is added"
    ]
  },
  "github-copilot": {
    state: "resume-claimed",
    label: "Public link to add",
    shortLabel: "Link to add",
    tone: "muted",
    issueDate: "Date not shown",
    expiry: "Date not shown",
    proofUrl: null,
    proofLabel: "Verification link to add",
    drawerSummary:
      "This credential is listed on the resume; a public verification link should be attached before it is promoted.",
    metadata: [
      "Public credential URL to add",
      "Issue and expiry dates not shown",
      "Use as a supporting developer-productivity indicator"
    ]
  },
  "google-data-analytics-professional": {
    state: "resume-claimed",
    label: "Public link to add",
    shortLabel: "Link to add",
    tone: "muted",
    issueDate: "Date not shown",
    expiry: "Date not shown",
    proofUrl: null,
    proofLabel: "Verification link to add",
    drawerSummary:
      "This credential is listed on the resume; a public verification link should be attached before it is promoted.",
    metadata: [
      "Public credential URL to add",
      "Issue and expiry dates not shown",
      "Best used as supporting analytics context"
    ]
  },
  "oracle-cloud-infrastructure-foundations": {
    state: "resume-claimed",
    label: "Public link to add",
    shortLabel: "Link to add",
    tone: "muted",
    issueDate: "Date not shown",
    expiry: "Date not shown",
    proofUrl: null,
    proofLabel: "Verification link to add",
    drawerSummary:
      "This credential is listed on the resume; a public verification link should be attached before it is promoted.",
    metadata: [
      "Public credential URL to add",
      "Issue and expiry dates not shown",
      "Keep in the cloud fundamentals support layer"
    ]
  }
};

const fallbackEvidence: EvidenceProfile = {
  state: "link-captured",
  label: "Link captured",
  shortLabel: "Captured",
  tone: "warning",
  issueDate: "Date not shown",
  expiry: "Date not shown",
  proofUrl: null,
  proofLabel: "Public link",
  drawerSummary:
    "A credential path exists in the data layer, but the public page should be checked before metadata is promoted.",
  metadata: ["Public page check to complete"]
};

const statusFilters: readonly { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All credentials" },
  { id: "verified", label: "Verification links" },
  { id: "needs-proof", label: "Public link to add" }
];

const credentialRelevanceSignals = [
  "Fabric migration",
  "Databricks engineering",
  "BI semantic modeling",
  "governance"
] as const;

const stateOrder: Record<EvidenceState, number> = {
  verified: 0,
  "verified-expired": 1,
  "indirectly-supported": 2,
  "link-captured": 3,
  "resume-claimed": 4
};

// Royal theme color palette mapping
const toneClasses: Record<EvidenceTone, { badge: string; dot: string; text: string }> = {
  success: {
    badge: "border-[#476a53]/20 bg-[#476a53]/5 text-[#476a53]",
    dot: "bg-[#476a53]",
    text: "text-[#476a53]"
  },
  warning: {
    badge: "border-[#b98a50]/20 bg-[#b98a50]/5 text-[#b98a50]",
    dot: "bg-[#b98a50]",
    text: "text-[#b98a50]"
  },
  info: {
    badge: "border-[#8c5b36]/20 bg-[#8c5b36]/5 text-[#8c5b36]",
    dot: "bg-[#8c5b36]",
    text: "text-[#8c5b36]"
  },
  muted: {
    badge: "border-[#74685a]/20 bg-[#74685a]/5 text-[#74685a]",
    dot: "bg-[#74685a]",
    text: "text-[#74685a]"
  }
};

function uniqueValues(values: readonly string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function normalizeIssuer(issuer: string) {
  if (issuer.includes("Microsoft")) return "Microsoft";
  if (issuer.includes("Databricks")) return "Databricks";
  if (issuer.includes("Google")) return "Google";
  if (issuer.includes("Oracle")) return "Oracle";
  if (issuer.includes("GitHub")) return "GitHub";
  return issuer;
}

function getIssuerLogo(issuer: string) {
  return brandIssuer(issuer) ? <IssuerMark issuer={issuer} size={34} /> : null;
}

function toCredentialView(credential: Certification): CredentialView {
  const evidence = defaultEvidenceBySlug[credential.slug] ?? {
    ...fallbackEvidence,
    proofUrl: credential.credentialUrl
  };
  const proofUrls = uniqueValues(
    [
      evidence.proofUrl,
      credential.credentialUrl,
      ...(credential.candidateCredentialUrls ?? [])
    ].filter((url): url is string => Boolean(url))
  );
  const relatedProjectTitles = credential.relatedProjects.map((slug) => {
    return projects.find((project) => project.slug === slug)?.title ?? slug;
  });

  return { ...credential, evidence, proofUrls, relatedProjectTitles };
}

function matchesStatusFilter(credential: CredentialView, statusFilter: StatusFilter) {
  if (statusFilter === "all") return true;
  if (statusFilter === "verified") {
    return ["verified", "verified-expired", "indirectly-supported"].includes(credential.evidence.state);
  }
  return ["link-captured", "resume-claimed"].includes(credential.evidence.state);
}

function ExternalLink({ ariaLabel, children, className, href }: { ariaLabel?: string; children: ReactNode; className: string; href: string; }) {
  return (
    <a aria-label={ariaLabel ? `${ariaLabel}. Opens in a new tab.` : undefined} className={className} href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}

function EmptyReferenceButton() {
  return (
    <span aria-disabled="true" className="inline-flex min-h-10 shrink-0 items-center justify-center border-b border-[#74685a]/30 px-2 text-sm font-medium text-[#74685a] opacity-60">
      Link to add
    </span>
  );
}

function StatusBadge({ evidence }: { evidence: EvidenceProfile }) {
  const tone = toneClasses[evidence.tone];
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-widest ${tone.badge}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {evidence.label}
    </span>
  );
}

// Ultra Luxury Miniature Certificate Card
function CredentialCard({
  credential,
  isSelected,
  onSelect
}: {
  credential: CredentialView;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const tone = toneClasses[credential.evidence.tone];
  const primaryProofUrl = credential.evidence.proofUrl ?? credential.proofUrls[0];
  const issuerLogo = getIssuerLogo(credential.issuer);
  const normalizedIssuer = normalizeIssuer(credential.issuer);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)", transition: { duration: 0.3, ease: "easeInOut" } }}
      transition={{
        layout: { type: "spring", bounce: 0.25, duration: 0.9 },
        opacity: { duration: 0.5 },
        default: { type: "spring", bounce: 0.25, duration: 0.9 }
      }}
      className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-2xl transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(36,27,19,0.12)] ${
        isSelected
          ? "bg-[linear-gradient(135deg,#ffffff_0%,#fdfbf7_100%)] border border-[#cba871]/60 shadow-[0_30px_60px_-15px_rgba(203,168,113,0.25)] ring-1 ring-[#cba871]/30"
          : "bg-[linear-gradient(135deg,#ffffff_0%,#fcfaf6_100%)] border border-[#1a1511]/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
      }`}
    >
      {/* High-End Vector Seal */}
      <div className="absolute right-6 top-6 z-10 h-[4.5rem] w-[4.5rem] transition-transform duration-1000 group-hover:rotate-180">
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-sm">
          <defs>
            <path id="circlePath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cba871" />
              <stop offset="100%" stopColor="#8c5b36" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#goldGradient)" strokeWidth="0.5" opacity="0.3" />
          <path d="M 50 38 L 52.5 45.5 L 60 45.5 L 54 50 L 56 57.5 L 50 53 L 44 57.5 L 46 50 L 40 45.5 L 47.5 45.5 Z" fill="url(#goldGradient)" opacity="0.9" />
          <text fill="url(#goldGradient)" fontSize="11" fontWeight="700" letterSpacing="0.22em" className="font-mono uppercase">
            <textPath href="#circlePath" startOffset="0%">
              • OFFICIAL • CERTIFIED 
            </textPath>
          </text>
        </svg>
      </div>

      <button
        aria-controls={CREDENTIAL_DETAIL_PANEL_ID}
        aria-pressed={isSelected}
        className="relative z-10 flex w-full flex-1 flex-col items-start px-8 pt-8 text-left outline-none"
        onClick={onSelect}
        type="button"
      >
        <div className="mb-8 flex h-12 items-center justify-start opacity-90 transition-opacity duration-500 group-hover:opacity-100">
          {issuerLogo ? (
            <div className="flex h-12 items-center gap-3">
              {issuerLogo}
              <span className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-[#1a1511]">
                {normalizedIssuer}
              </span>
            </div>
          ) : (
            <span className="font-mono text-xs uppercase tracking-widest text-[#74685a]">
              {normalizedIssuer}
            </span>
          )}
        </div>

        <div className="pr-14">
          <h2 className="font-[var(--font-editorial)] text-3xl font-medium leading-[1.15] tracking-tight text-[#1a1511] transition-colors duration-500 group-hover:text-[#cba871]">
            {credential.title}
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#74685a]">
            {credential.category}
          </p>
        </div>

        <dl className="mb-8 mt-auto grid w-full grid-cols-2 gap-6 pt-10">
          <div>
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-[#a3998b]">
              Issued
            </dt>
            <dd className="mt-2 text-sm font-medium text-[#241b13]">
              {credential.evidence.issueDate}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-[#a3998b]">
              Expiry
            </dt>
            <dd className="mt-2 text-sm font-medium text-[#241b13]">
              {credential.evidence.expiry}
            </dd>
          </div>
        </dl>
      </button>

      <div className="relative z-10 flex min-h-[80px] w-full flex-wrap items-center justify-end border-t border-[#1a1511]/5 bg-white/30 px-8 py-5 backdrop-blur-md">
        {primaryProofUrl ? (
          <ExternalLink
            ariaLabel={`Verify ${credential.title}`}
            className="group/link flex items-center gap-2 border-b border-transparent pb-0.5 text-sm font-semibold tracking-wide text-[#1a1511] transition-all duration-300 hover:border-[#cba871] hover:text-[#cba871]"
            href={primaryProofUrl}
          >
            Verify <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </ExternalLink>
        ) : (
          <EmptyReferenceButton />
        )}
      </div>
    </motion.article>
  );
}

// Editorial Detail Dossier
function DetailShell({ credential }: { credential: CredentialView }) {
  const tone = toneClasses[credential.evidence.tone];

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, filter: "blur(12px)", x: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
      exit={{ opacity: 0, filter: "blur(12px)", x: 10, transition: { duration: 0.3 } }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby={`${CREDENTIAL_DETAIL_PANEL_ID}-title`}
      aria-live="polite"
      className="xl:sticky xl:top-[120px] xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]"
      id={CREDENTIAL_DETAIL_PANEL_ID}
      role="region"
    >
      <div className="relative mb-12 flex flex-col items-start pb-10">
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-[#cba871]/40 to-transparent" />
        
        <span className="mb-6 rounded-full border border-[#cba871]/30 px-4 py-1.5 font-serif text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#cba871] shadow-[0_2px_10px_rgba(203,168,113,0.1)]">
          Official Dossier
        </span>
        
        <h2
          className="font-[var(--font-editorial)] text-5xl font-medium leading-[1.05] tracking-tight text-[#1a1511] lg:text-6xl drop-shadow-sm"
          id={`${CREDENTIAL_DETAIL_PANEL_ID}-title`}
        >
          {credential.title}
        </h2>
        <p className="mt-8 max-w-lg font-serif text-lg leading-relaxed text-[#74685a]">
          {credential.evidence.drawerSummary}
        </p>
      </div>

      <div className="space-y-14 pr-4">
        <section>
          <h3 className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-widest text-[#cba871]">
            <span className="h-px flex-1 bg-[#cba871]/20"></span>
            Specifications
            <span className="h-px flex-1 bg-[#cba871]/20"></span>
          </h3>
          <dl className="grid grid-cols-2 gap-y-10">
            {[
              ["Issuer", credential.issuer],
              ["Category", credential.category],
              ["Issued", credential.evidence.issueDate],
              ["Expiry", credential.evidence.expiry]
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col border-l-[0.5px] border-[#cba871]/30 pl-5">
                <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-[#a3998b]">
                  {label}
                </dt>
                <dd className="mt-3 font-serif text-sm font-medium tracking-wide text-[#1a1511]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h3 className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-widest text-[#cba871]">
            <span className="h-px flex-1 bg-[#cba871]/20"></span>
            Public Links
            <span className="h-px flex-1 bg-[#cba871]/20"></span>
          </h3>
          <div className="flex flex-col gap-4">
            {credential.proofUrls.length > 0 ? (
              credential.proofUrls.map((url, index) => (
                <ExternalLink
                  ariaLabel={`Link to ${credential.title}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[#cba871]/20 bg-[#fdfbf7] p-5 shadow-[0_4px_20px_-10px_rgba(203,168,113,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-[#cba871]/60 hover:shadow-[0_8px_30px_-10px_rgba(203,168,113,0.25)]"
                  href={url}
                  key={url}
                >
                  <span className="font-serif text-sm font-medium text-[#1a1511] transition-transform duration-500 group-hover:translate-x-2">
                    {index === 0 ? credential.evidence.proofLabel : `Captured reference ${index + 1}`}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cba871]/10 text-[#cba871] transition-colors duration-500 group-hover:bg-[#cba871] group-hover:text-white">
                    →
                  </span>
                </ExternalLink>
              ))
            ) : (
              <p className="font-serif text-sm leading-relaxed text-[#74685a]">
                Public verification link to add. This credential stays lower emphasis until the link is attached.
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-widest text-[#cba871]">
            <span className="h-px flex-1 bg-[#cba871]/20"></span>
            Status Notes
            <span className="h-px flex-1 bg-[#cba871]/20"></span>
          </h3>
          <ul className="space-y-4">
            {credential.evidence.metadata.map((item) => (
              <li className="flex items-start gap-4 font-serif text-sm leading-relaxed text-[#44372a]" key={item}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#cba871]/60"></span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {credential.relatedSkills.length > 0 && (
          <section>
            <h3 className="mb-8 flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-widest text-[#cba871]">
              <span className="h-px flex-1 bg-[#cba871]/20"></span>
              Related Elements
              <span className="h-px flex-1 bg-[#cba871]/20"></span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {credential.relatedSkills.map((skill) => (
                <span className="rounded-full border border-[#cba871]/20 bg-[#fdfbf7] px-4 py-2 font-serif text-xs font-medium tracking-wide text-[#1a1511]" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            {credential.relatedProjectTitles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {credential.relatedProjectTitles.map((project) => (
                  <span className="rounded-full bg-[#cba871]/10 px-4 py-2 font-serif text-xs font-medium tracking-wide text-[#1a1511]" key={project}>
                    {project}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </motion.aside>
  );
}

export function CertificationConsole() {
  const [activeGroup, setActiveGroup] = useState<(typeof allGroups)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSlug, setSelectedSlug] = useState("");

  const credentialViews = useMemo(
    () =>
      certifications
        .map(toCredentialView)
        .sort((a, b) => {
          return (
            stateOrder[a.evidence.state] - stateOrder[b.evidence.state] ||
            a.group.localeCompare(b.group) ||
            a.title.localeCompare(b.title)
          );
        }),
    []
  );

  const filteredCredentials = credentialViews.filter((credential) => {
    const groupMatches = activeGroup === "All" || credential.group === activeGroup;
    return groupMatches && matchesStatusFilter(credential, statusFilter);
  });

  const selectedCredential =
    filteredCredentials.find((credential) => credential.slug === selectedSlug) ??
    filteredCredentials[0];

  return (
    <main
      className="relative min-h-screen bg-[var(--color-porcelain)] px-[var(--layout-gutter)] pb-24 pt-[calc(var(--site-header-offset)+var(--space-8))]"
      id="main-content"
      tabIndex={-1}
    >
      {/* Subtle luxury noise/gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(203,168,113,0.05),transparent_50%)]" />

      <div className="relative mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-16">
        
        {/* Ultra Premium Header */}
      <header className="mb-20">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
          
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-5">
              <span className="h-[1px] w-12 bg-gradient-to-r from-[#cba871] to-transparent"></span>
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#a3998b]">
                Official Credentials
              </span>
            </div>
            
            <h1 className="editorial-title editorial-title--display">
              Credentials<span className="editorial-accent">.</span>
            </h1>
            
          </div>
          
          <div className="flex items-end gap-6 mt-12 md:mt-0">
            <div className="flex flex-col items-end text-right pb-2">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.4em] text-[#1a1511]">
                Verified Records
              </span>
              <span className="font-serif text-[0.75rem] text-[#a3998b] mt-1.5">
                Lifetime Achievements
              </span>
            </div>
            
            {/* Ultra minimal typographic metric */}
            <div className="flex items-start">
              <span className="font-mono text-[0.55rem] tracking-widest text-[#cba871] leading-none pt-[0.6rem] mr-1">NO.</span>
              <span className="font-[var(--font-editorial)] text-6xl text-[#1a1511] tracking-tighter leading-none">
                {credentialViews.length < 10 ? `0${credentialViews.length}` : credentialViews.length}
              </span>
            </div>
          </div>
          
        </div>

        <div className="mt-16 h-[1px] w-full bg-gradient-to-r from-[#cba871]/40 via-[#1a1511]/10 to-transparent" />

        <RecognitionPanel className="mt-12" showCaseLink showScope />

        <div className="my-20 flex w-full flex-col items-center gap-16 relative">
          
          {/* Status Filter tucked away elegantly */}
          <div className="absolute right-0 top-[-80px] hidden md:flex items-center gap-3">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#a3998b]">
              View
            </span>
            <select
              className="cursor-pointer appearance-none bg-transparent pr-4 font-serif text-sm italic text-[#cba871] outline-none transition-colors duration-300 hover:text-[#1a1511]"
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              value={statusFilter}
              style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a3998b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right center", backgroundSize: "0.8em" }}
            >
              {statusFilters.map((filter) => (
                <option key={filter.id} value={filter.id} className="text-[#1a1511] not-italic">{filter.label}</option>
              ))}
            </select>
          </div>

          {/* Optical Focus Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
            {allGroups.map((group) => {
              const isActive = activeGroup === group;
              return (
                <motion.button
                  layout
                  className="group relative flex flex-col items-center outline-none"
                  key={group}
                  onClick={() => setActiveGroup(group as any)}
                >
                  <motion.span
                    layout
                    className={`relative block transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "font-[var(--font-editorial)] text-4xl tracking-tight text-[#1a1511] blur-none opacity-100"
                        : "font-serif text-xl tracking-wide text-[#a3998b] blur-[1px] opacity-50 group-hover:text-[#1a1511] group-hover:opacity-100 group-hover:blur-none"
                    }`}
                  >
                    {group}
                    
                    {/* Delicate hover underline to indicate clickability */}
                    {!isActive && (
                      <span className="absolute -bottom-1 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-[#cba871]/40 transition-all duration-500 ease-out group-hover:w-full" />
                    )}
                  </motion.span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </header>
        {/* Main Layout Grid */}
        <section className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-20">
          <motion.div layout className="grid auto-rows-max grid-cols-1 gap-8 md:grid-cols-2">
            <AnimatePresence>
              {filteredCredentials.length > 0 ? (
                filteredCredentials.map((credential) => (
                  <CredentialCard
                    credential={credential}
                    isSelected={credential.slug === selectedCredential?.slug}
                    key={credential.slug}
                    onSelect={() => setSelectedSlug(credential.slug)}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-1 py-20 text-center md:col-span-2"
                >
                  <p className="font-[var(--font-editorial)] text-4xl text-[#1a1511]">No credentials found.</p>
                  <p className="mt-4 text-[#74685a]">Adjust your filters to see more results.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedCredential && (
              <DetailShell credential={selectedCredential} key={selectedCredential.slug} />
            )}
          </AnimatePresence>
        </section>

      </div>
    </main>
  );
}
