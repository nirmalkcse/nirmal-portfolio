"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  certificationGroups,
  certifications,
  databricksCredentialUrl,
  microsoftCredentialCandidateUrls,
  projects
} from "@/data";
import type { Certification } from "@/data";

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
    label: "Verified, expired",
    shortLabel: "Expired",
    tone: "warning",
    issueDate: "Apr 30, 2025",
    expiry: "May 1, 2026",
    proofUrl: microsoftCredentialCandidateUrls[0],
    proofLabel: "Microsoft Learn",
    drawerSummary:
      "Public Microsoft Learn verification was captured, but the credential expired on May 1, 2026. Keep the card truthful until a renewed page is available.",
    metadata: [
      "Credential page manually checked on May 16, 2026",
      "Public profile name captured from Microsoft Learn",
      "Credential IDs intentionally hidden from card-level UI"
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
      "Direct Microsoft Learn verification is captured and current through Jun 23, 2026.",
    metadata: [
      "Credential page manually checked on May 16, 2026",
      "Public profile name captured from Microsoft Learn",
      "Current public verification path is available"
    ]
  },
  "databricks-data-engineer-associate": {
    state: "indirectly-supported",
    label: "Indirectly supported",
    shortLabel: "Supported",
    tone: "info",
    issueDate: "Pending",
    expiry: "Pending",
    proofUrl: databricksCredentialUrl,
    proofLabel: "Supporting Databricks proof",
    drawerSummary:
      "The direct Data Engineer Associate credential URL is still pending. The verified Databricks UC Upgrade credential supports the claim because it is granted to Databricks Certified Data Engineer Associates in the partner community.",
    metadata: [
      "Direct public credential URL still needed",
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
      "Direct Databricks credential verification is captured and current through Feb 18, 2028.",
    metadata: [
      "Accredible credential URL captured",
      "Owner verified as Nirmal Kumar Pukazhenthi",
      "Certificate reference is hidden from card-level UI"
    ]
  },
  "databricks-fundamentals": {
    state: "resume-claimed",
    label: "Resume claimed",
    shortLabel: "Pending",
    tone: "muted",
    issueDate: "Pending",
    expiry: "Pending",
    proofUrl: null,
    proofLabel: "Verification pending",
    drawerSummary:
      "The credential appears in source resume content, but no public verification URL has been captured yet.",
    metadata: [
      "Public credential URL needed",
      "Issue and expiry metadata pending",
      "Keep as a lower-emphasis pending credential"
    ]
  },
  "github-copilot": {
    state: "resume-claimed",
    label: "Resume claimed",
    shortLabel: "Pending",
    tone: "muted",
    issueDate: "Pending",
    expiry: "Pending",
    proofUrl: null,
    proofLabel: "Verification pending",
    drawerSummary:
      "The credential appears in source resume content, but no public verification URL has been captured yet.",
    metadata: [
      "Public credential URL needed",
      "Issue and expiry metadata pending",
      "Use as a supporting developer-productivity signal"
    ]
  },
  "google-data-analytics-professional": {
    state: "resume-claimed",
    label: "Resume claimed",
    shortLabel: "Pending",
    tone: "muted",
    issueDate: "Pending",
    expiry: "Pending",
    proofUrl: null,
    proofLabel: "Verification pending",
    drawerSummary:
      "The credential appears in source resume content, but no public verification URL has been captured yet.",
    metadata: [
      "Public credential URL needed",
      "Issue and expiry metadata pending",
      "Best used as supporting analytics context"
    ]
  },
  "oracle-cloud-infrastructure-foundations": {
    state: "resume-claimed",
    label: "Resume claimed",
    shortLabel: "Pending",
    tone: "muted",
    issueDate: "Pending",
    expiry: "Pending",
    proofUrl: null,
    proofLabel: "Verification pending",
    drawerSummary:
      "The credential appears in source resume content, but no public verification URL has been captured yet.",
    metadata: [
      "Public credential URL needed",
      "Issue and expiry metadata pending",
      "Keep in the cloud fundamentals support layer"
    ]
  }
};

const fallbackEvidence: EvidenceProfile = {
  state: "link-captured",
  label: "Link captured",
  shortLabel: "Captured",
  tone: "warning",
  issueDate: "Pending",
  expiry: "Pending",
  proofUrl: null,
  proofLabel: "Captured link",
  drawerSummary:
    "A credential path exists in the data layer, but the public page still needs manual rendered verification before metadata is promoted.",
  metadata: ["Rendered-page verification still needed"]
};

const statusFilters: readonly { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All states" },
  { id: "verified", label: "Verified paths" },
  { id: "needs-proof", label: "Needs proof" }
];

const stateOrder: Record<EvidenceState, number> = {
  verified: 0,
  "verified-expired": 1,
  "indirectly-supported": 2,
  "link-captured": 3,
  "resume-claimed": 4
};

const toneClasses: Record<
  EvidenceTone,
  { badge: string; dot: string; panel: string; border: string }
> = {
  success: {
    badge:
      "border-[color-mix(in_srgb,var(--color-success)_58%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
    dot: "bg-[var(--color-success)]",
    panel:
      "bg-[color-mix(in_srgb,var(--color-deep-emerald)_30%,transparent)]",
    border: "border-[color-mix(in_srgb,var(--color-success)_48%,transparent)]"
  },
  warning: {
    badge:
      "border-[color-mix(in_srgb,var(--color-warning)_58%,transparent)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-[var(--color-champagne)]",
    dot: "bg-[var(--color-warning)]",
    panel:
      "bg-[color-mix(in_srgb,var(--color-antique-gold)_16%,transparent)]",
    border: "border-[color-mix(in_srgb,var(--color-warning)_48%,transparent)]"
  },
  info: {
    badge:
      "border-[color-mix(in_srgb,var(--color-signal-blue)_58%,transparent)] bg-[color-mix(in_srgb,var(--color-signal-blue)_12%,transparent)] text-[var(--color-signal-blue)]",
    dot: "bg-[var(--color-signal-blue)]",
    panel:
      "bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)]",
    border: "border-[color-mix(in_srgb,var(--color-signal-blue)_48%,transparent)]"
  },
  muted: {
    badge:
      "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)] text-[var(--color-warm-silver)]",
    dot: "bg-[var(--color-warm-silver)]",
    panel: "bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)]",
    border: "border-[var(--border-subtle)]"
  }
};

function uniqueValues(values: readonly string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function normalizeIssuer(issuer: string) {
  if (issuer.includes("Microsoft")) {
    return "Microsoft";
  }

  if (issuer.includes("Databricks")) {
    return "Databricks";
  }

  return issuer;
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

  return {
    ...credential,
    evidence,
    proofUrls,
    relatedProjectTitles
  };
}

function matchesStatusFilter(
  credential: CredentialView,
  statusFilter: StatusFilter
) {
  if (statusFilter === "all") {
    return true;
  }

  if (statusFilter === "verified") {
    return [
      "verified",
      "verified-expired",
      "indirectly-supported"
    ].includes(credential.evidence.state);
  }

  return ["link-captured", "resume-claimed"].includes(
    credential.evidence.state
  );
}

function ExternalLink({
  ariaLabel,
  children,
  className,
  href
}: {
  ariaLabel?: string;
  children: ReactNode;
  className: string;
  href: string;
}) {
  return (
    <a
      aria-label={ariaLabel ? `${ariaLabel}. Opens in a new tab.` : undefined}
      className={className}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function EmptyProofButton() {
  return (
    <span
      aria-disabled="true"
      className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm font-medium text-[var(--color-warm-silver)] opacity-[var(--button-disabled-opacity)]"
    >
      Proof pending
    </span>
  );
}

function StatusBadge({ evidence }: { evidence: EvidenceProfile }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none ${toneClasses[evidence.tone].badge}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${toneClasses[evidence.tone].dot}`}
      />
      {evidence.label}
    </span>
  );
}

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

  return (
    <article
      className={`motion-card motion-lens-choice group relative overflow-hidden rounded-[var(--radius-card)] border bg-[var(--card-bg)] shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] ease-[var(--ease-standard)] hover:-translate-y-[var(--motion-distance-xs)] hover:bg-[var(--card-bg-hover)] ${
        isSelected
          ? "border-[var(--border-gold)] shadow-[var(--shadow-gold-trace)]"
          : "border-[var(--card-border)]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${tone.panel}`}
      />
      <button
        aria-controls={CREDENTIAL_DETAIL_PANEL_ID}
        aria-pressed={isSelected}
        className="flex min-h-[210px] w-full flex-col items-start gap-5 px-5 pb-5 pt-6 text-left"
        onClick={onSelect}
        type="button"
      >
        <div className="flex w-full items-start justify-between gap-3">
          <span className="font-mono text-xs uppercase text-[var(--color-warm-silver)]">
            {credential.issuer}
          </span>
          <StatusBadge evidence={credential.evidence} />
        </div>

        <div>
          <h2 className="text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
            {credential.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
            {credential.category}
          </p>
        </div>

        <dl className="mt-auto grid w-full grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-4">
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
              Issued
            </dt>
            <dd className="mt-1 text-sm text-[var(--color-ivory-soft)]">
              {credential.evidence.issueDate}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
              Expiry
            </dt>
            <dd className="mt-1 text-sm text-[var(--color-ivory-soft)]">
              {credential.evidence.expiry}
            </dd>
          </div>
        </dl>
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] px-5 py-4">
        <span className="font-mono text-xs text-[var(--color-warm-silver)]">
          {credential.relatedSkills.length} skills /{" "}
          {credential.relatedProjects.length} projects
        </span>
        {primaryProofUrl ? (
          <ExternalLink
            ariaLabel={`Verify ${credential.title}`}
            className="motion-cta inline-flex min-h-10 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium text-[var(--button-primary-text)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--color-champagne)]"
            href={primaryProofUrl}
          >
            Verify
          </ExternalLink>
        ) : (
          <EmptyProofButton />
        )}
      </div>
    </article>
  );
}

function FilterButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`motion-lens-choice min-h-10 rounded-[var(--radius-control)] border px-3 text-sm transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
        active
          ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
          : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function DetailShell({ credential }: { credential: CredentialView }) {
  const tone = toneClasses[credential.evidence.tone];

  return (
    <aside
      aria-labelledby={`${CREDENTIAL_DETAIL_PANEL_ID}-title`}
      aria-live="polite"
      className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--console-bg)] shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={CREDENTIAL_DETAIL_PANEL_ID}
      role="region"
    >
      <div className={`border-b ${tone.border} px-5 py-5`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Detail shell
          </span>
          <StatusBadge evidence={credential.evidence} />
        </div>
        <h2
          className="mt-4 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]"
          id={`${CREDENTIAL_DETAIL_PANEL_ID}-title`}
        >
          {credential.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--console-muted)]">
          {credential.evidence.drawerSummary}
        </p>
      </div>

      <div className="space-y-6 px-5 py-5">
        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Issuer", credential.issuer],
            ["Category", credential.category],
            ["Issued", credential.evidence.issueDate],
            ["Expiry", credential.evidence.expiry]
          ].map(([label, value]) => (
            <div
              className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] p-3"
              key={label}
            >
              <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                {label}
              </dt>
              <dd className="mt-1 text-sm leading-5 text-[var(--color-ivory-soft)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <section>
          <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Verification actions
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {credential.proofUrls.length > 0 ? (
              credential.proofUrls.map((url, index) => (
                <ExternalLink
                  ariaLabel={`${
                    index === 0
                      ? credential.evidence.proofLabel
                      : `Captured proof ${index + 1}`
                  } for ${credential.title}`}
                  className="motion-cta flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] px-3 text-sm text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                  href={url}
                  key={url}
                >
                  <span>
                    {index === 0
                      ? credential.evidence.proofLabel
                      : `Captured proof ${index + 1}`}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-[var(--console-prompt)]"
                  >
                    OPEN
                  </span>
                </ExternalLink>
              ))
            ) : (
              <p className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)] px-3 py-3 text-sm leading-6 text-[var(--color-warm-silver)]">
                No public verification link is captured yet. This credential
                stays visible as a pending proof item.
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Evidence notes
          </h3>
          <ul className="mt-3 space-y-2">
            {credential.evidence.metadata.map((item) => (
              <li
                className="flex gap-3 text-sm leading-6 text-[var(--console-muted)]"
                key={item}
              >
                <span
                  aria-hidden="true"
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Related skill tags
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {credential.relatedSkills.map((skill) => (
              <span
                className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-ivory-soft)]"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
            Project evidence
          </h3>
          {credential.relatedProjectTitles.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {credential.relatedProjectTitles.map((project) => (
                <li
                  className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--color-ivory-soft)]"
                  key={project}
                >
                  {project}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--color-warm-silver)]">
              No project evidence has been attached yet.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}

function ConsoleMetrics({ credentials }: { credentials: readonly CredentialView[] }) {
  const verified = credentials.filter((credential) =>
    ["verified", "verified-expired", "indirectly-supported"].includes(
      credential.evidence.state
    )
  ).length;
  const directLinks = credentials.filter(
    (credential) => credential.evidence.proofUrl
  ).length;
  const pending = credentials.length - verified;

  return (
    <dl className="motion-list grid grid-cols-2 gap-3">
      {[
        ["Credentials", credentials.length.toString()],
        ["Public proof paths", verified.toString()],
        ["Pending URLs", pending.toString()],
        ["External CTAs", directLinks.toString()]
      ].map(([label, value]) => (
        <div
          className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4"
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
  );
}

export function CertificationConsole() {
  const [activeGroup, setActiveGroup] =
    useState<(typeof allGroups)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [providerFilter, setProviderFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedSlug, setSelectedSlug] = useState(certifications[0]?.slug ?? "");

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

  const categories = useMemo(
    () => ["All", ...uniqueValues(credentialViews.map((item) => item.category))],
    [credentialViews]
  );

  const providers = useMemo(
    () => [
      "All",
      ...uniqueValues(credentialViews.map((item) => normalizeIssuer(item.issuer)))
    ],
    [credentialViews]
  );

  const filteredCredentials = credentialViews.filter((credential) => {
    const groupMatches =
      activeGroup === "All" || credential.group === activeGroup;
    const providerMatches =
      providerFilter === "All" ||
      normalizeIssuer(credential.issuer) === providerFilter;
    const categoryMatches =
      categoryFilter === "All" || credential.category === categoryFilter;

    return (
      groupMatches &&
      providerMatches &&
      categoryMatches &&
      matchesStatusFilter(credential, statusFilter)
    );
  });

  const selectedCredential =
    filteredCredentials.find((credential) => credential.slug === selectedSlug) ??
    filteredCredentials[0];

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
              Certification console
            </p>
            <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              Credential verification, without the hand-waving.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              A compact proof dashboard for Fabric, Databricks, analytics, and
              cloud credentials, with direct verification actions separated
              from resume-claimed items.
            </p>
          </div>
          <ConsoleMetrics credentials={credentialViews} />
        </header>

        <section
          aria-label="Credential filters"
          className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
            <div>
              <p className="mb-3 font-mono text-xs uppercase text-[var(--color-champagne)]">
                Provider groups
              </p>
              <div className="flex flex-wrap gap-2">
                {allGroups.map((group) => (
                  <FilterButton
                    active={activeGroup === group}
                    key={group}
                    onClick={() => setActiveGroup(group)}
                  >
                    {group}
                  </FilterButton>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <label className="block">
                <span className="mb-2 block font-mono text-xs uppercase text-[var(--color-champagne)]">
                  Verification state
                </span>
                <select
                  className="min-h-10 w-full rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--color-carbon)] px-3 text-sm text-[var(--color-ivory-soft)]"
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  value={statusFilter}
                >
                  {statusFilters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-xs uppercase text-[var(--color-champagne)]">
                  Category
                </span>
                <select
                  className="min-h-10 w-full rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--color-carbon)] px-3 text-sm text-[var(--color-ivory-soft)]"
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  value={categoryFilter}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-4">
            <span className="font-mono text-xs uppercase text-[var(--color-steel)]">
              Providers
            </span>
            {providers.map((provider) => (
              <button
                aria-pressed={providerFilter === provider}
                className={`motion-lens-choice min-h-9 rounded-[var(--radius-control)] border px-2.5 text-xs transition duration-[var(--duration-feedback)] ${
                  providerFilter === provider
                    ? "border-[var(--border-cool)] bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)] text-[var(--color-ivory)]"
                    : "border-[var(--border-subtle)] text-[var(--color-warm-silver)] hover:border-[var(--border-strong)] hover:text-[var(--color-ivory-soft)]"
                }`}
                key={provider}
                onClick={() => setProviderFilter(provider)}
                type="button"
              >
                {provider}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="motion-list grid content-start gap-4 sm:grid-cols-2">
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
              <div className="sm:col-span-2 rounded-[var(--radius-panel)] border border-dashed border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_56%,transparent)] p-8">
                <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                  Empty state
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ivory)]">
                  No credentials match this filter set.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-warm-silver)]">
                  Clear a group, category, or verification filter to return to
                  the full credential evidence queue.
                </p>
              </div>
            )}
          </div>

          {selectedCredential ? (
            <DetailShell
              credential={selectedCredential}
              key={selectedCredential.slug}
            />
          ) : null}
        </section>

        <section className="motion-section gold-thread-section rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
                Future verification queue
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                Metadata still waiting on public-safe proof.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                The console intentionally keeps unverified credentials visible
                but lower-emphasis, so future proof collection has a clear
                landing place.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[420px]">
              {[
                "Direct Databricks Data Engineer Associate URL",
                "Databricks Fundamentals verification",
                "Google, Oracle, and Copilot public pages",
                "Renewed DP-700 page after May 1, 2026"
              ].map((item) => (
                <span
                  className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--color-ivory-soft)]"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
