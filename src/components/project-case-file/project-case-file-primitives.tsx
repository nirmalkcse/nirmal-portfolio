import { ExternalLink, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { EvidenceNote, Project } from "@/data";
import {
  getEvidenceConfidenceLabel,
  getEvidenceStatusLabel,
  getEvidenceTypeLabel,
  getProjectProofStats,
  getProjectStatusLabel,
  getProjectStatusTone
} from "./project-case-file-model";

type Tone = "gold" | "emerald" | "blue" | "silver";

const toneClasses = {
  gold: {
    badge:
      "border-[color-mix(in_srgb,var(--color-antique-gold)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] text-[var(--color-champagne)]",
    dot: "bg-[var(--color-antique-gold)]",
    line: "bg-[var(--color-antique-gold)]",
    border: "border-[color-mix(in_srgb,var(--color-antique-gold)_52%,transparent)]"
  },
  emerald: {
    badge:
      "border-[color-mix(in_srgb,var(--color-success)_58%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-[var(--color-success)]",
    dot: "bg-[var(--color-success)]",
    line: "bg-[var(--color-success)]",
    border: "border-[color-mix(in_srgb,var(--color-success)_42%,transparent)]"
  },
  blue: {
    badge:
      "border-[color-mix(in_srgb,var(--color-signal-blue)_58%,transparent)] bg-[color-mix(in_srgb,var(--color-signal-blue)_12%,transparent)] text-[var(--color-signal-blue)]",
    dot: "bg-[var(--color-signal-blue)]",
    line: "bg-[var(--color-signal-blue)]",
    border: "border-[color-mix(in_srgb,var(--color-signal-blue)_42%,transparent)]"
  },
  silver: {
    badge:
      "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)] text-[var(--color-warm-silver)]",
    dot: "bg-[var(--color-warm-silver)]",
    line: "bg-[var(--color-warm-silver)]",
    border: "border-[var(--border-subtle)]"
  }
} satisfies Record<Tone, Record<"badge" | "dot" | "line" | "border", string>>;

export function toneClass(tone: Tone, part: keyof (typeof toneClasses)[Tone]) {
  return toneClasses[tone][part];
}

export function StatusBadge({ status }: { status: Project["status"] }) {
  const tone = getProjectStatusTone(status);

  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-[var(--radius-control)] border px-3 font-mono text-[0.6875rem] uppercase leading-none tracking-wider shadow-sm backdrop-blur-md transition-all duration-300 hover:brightness-95 ${toneClass(tone, "badge")}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor] ${toneClass(tone, "dot")}`}
      />
      {getProjectStatusLabel(status)}
    </span>
  );
}

export function PublicSafetyNote({ project }: { project: Project }) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-panel)] border border-[color-mix(in_srgb,var(--border-subtle)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-antique-gold)_5%,transparent)] p-4">
      <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[var(--color-antique-gold)] shrink-0 mt-0.5" />
      <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
        <strong className="font-mono text-[0.625rem] font-semibold uppercase tracking-widest text-[var(--color-antique-gold)] block mb-1">Client details anonymized</strong>
        {project.publicSensitivity}
      </p>
    </div>
  );
}

export function EvidenceNoteCard({
  compact = false,
  note
}: {
  compact?: boolean;
  note: EvidenceNote;
}) {
  return (
    <article className="rounded-[var(--radius-panel)] border border-[color-mix(in_srgb,var(--color-antique-gold)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-antique-gold)_8%,transparent)] p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-[var(--radius-control)] border border-[color-mix(in_srgb,var(--color-antique-gold)_32%,transparent)] px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-antique-gold)]">
          {getEvidenceStatusLabel(note.publicStatus)}
        </span>
        <span className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-ink-muted)]">
          {getEvidenceTypeLabel(note.evidenceType)}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-6 text-[var(--color-ink-strong)]">
        {note.claim}
      </h3>

      <dl className="mt-3 grid gap-2 text-xs leading-5 text-[var(--color-ink-base)]">
        <div>
          <dt className="font-mono uppercase tracking-widest text-[var(--color-ink-muted)]">
            Source
          </dt>
          <dd className="mt-1">{note.source}</dd>
        </div>

        {!compact ? (
          <>
            <div>
              <dt className="font-mono uppercase tracking-widest text-[var(--color-ink-muted)]">
                Confidence
              </dt>
              <dd className="mt-1">{getEvidenceConfidenceLabel(note.confidence)}</dd>
            </div>
            <div>
              <dt className="font-mono uppercase tracking-widest text-[var(--color-ink-muted)]">
                Public note
              </dt>
              <dd className="mt-1">{note.confidentialityBoundary}</dd>
            </div>
          </>
        ) : null}
      </dl>
    </article>
  );
}

export function StackTags({
  limit,
  project
}: {
  limit?: number;
  project: Project;
}) {
  const visibleStack = limit ? project.stack.slice(0, limit) : project.stack;
  const overflow = limit ? project.stack.length - visibleStack.length : 0;

  if (visibleStack.length === 0) {
    return (
      <span className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-ink-muted)]">
        Stack to review
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleStack.map((item) => (
        <span
          className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface-page)_80%,transparent)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-ink-muted)] transition-all hover:border-[var(--color-antique-gold)] hover:bg-[color-mix(in_srgb,var(--color-antique-gold)_5%,transparent)] hover:text-[var(--color-antique-gold)]"
          key={item}
        >
          {item}
        </span>
      ))}
      {overflow > 0 ? (
        <span className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-stone)_40%,transparent)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-ink-muted)]">
          +{overflow} more
        </span>
      ) : null}
    </div>
  );
}

export function ProofStatLine({ project }: { project: Project }) {
  const stats = getProjectProofStats(project);

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatItem label="Proof links" value={stats.verifiedLinks.toString()} />
      <StatItem label="Visuals" value={stats.mediaCount.toString()} />
      <StatItem label="Skill ties" value={stats.skillCount.toString()} />
      <StatItem label="Notes" value={stats.evidenceNoteCount.toString()} />
    </dl>
  );
}

export function SectionShell({
  children,
  eyebrow,
  id,
  title
}: {
  children: ReactNode;
  eyebrow: string;
  id?: string;
  title: string;
}) {
  return (
    <section
      className="motion-section gold-thread-section border-t border-[var(--border-subtle)] py-10"
      id={id}
    >
      <div className="mb-6">
        <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-[1.18] text-[var(--color-ink-strong)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function ExternalProjectLink({
  ariaLabel,
  children,
  href
}: {
  ariaLabel?: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      aria-label={ariaLabel}
      className="primary-action-link motion-cta inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--color-champagne)]"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
      <ExternalLink aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="group/stat flex flex-col items-center justify-center gap-1 rounded-[var(--radius-panel)] border border-[color-mix(in_srgb,var(--border-subtle)_50%,transparent)] bg-[color-mix(in_srgb,var(--surface-page)_70%,transparent)] p-3 shadow-sm transition-colors duration-300 hover:border-[var(--color-antique-gold)] hover:bg-[color-mix(in_srgb,var(--color-antique-gold)_5%,transparent)]">
      <dt className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-ink-muted)] group-hover/stat:text-[var(--color-antique-gold)] transition-colors">
        {label}
      </dt>
      <dd className="text-xl font-[var(--font-display)] font-medium text-[var(--color-ink-strong)] group-hover/stat:text-[var(--color-antique-gold)] transition-colors">
        {value}
      </dd>
    </div>
  );
}
