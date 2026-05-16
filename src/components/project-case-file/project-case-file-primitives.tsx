import { ExternalLink, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "@/data";
import {
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
      className={`inline-flex min-h-7 items-center gap-2 rounded-[var(--radius-control)] border px-2.5 font-mono text-[0.6875rem] uppercase leading-none ${toneClass(tone, "badge")}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${toneClass(tone, "dot")}`}
      />
      {getProjectStatusLabel(status)}
    </span>
  );
}

export function PublicSafetyNote({ project }: { project: Project }) {
  return (
    <div className="motion-card rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_72%,transparent)] p-4">
      <div className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase text-[var(--color-champagne)]">
        <ShieldCheck aria-hidden="true" className="h-4 w-4" />
        Public safety
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
        {project.publicSensitivity}
      </p>
    </div>
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
      <span className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-warm-silver)]">
        Stack review pending
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleStack.map((item) => (
        <span
          className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_64%,transparent)] px-2.5 py-1 text-xs text-[var(--color-ivory-soft)]"
          key={item}
        >
          {item}
        </span>
      ))}
      {overflow > 0 ? (
        <span className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-warm-silver)]">
          +{overflow} more
        </span>
      ) : null}
    </div>
  );
}

export function ProofStatLine({ project }: { project: Project }) {
  const stats = getProjectProofStats(project);

  return (
    <dl className="grid grid-cols-3 gap-2">
      <StatItem label="Links" value={stats.verifiedLinks.toString()} />
      <StatItem label="Media" value={stats.mediaCount.toString()} />
      <StatItem label="Skills" value={stats.skillCount.toString()} />
    </dl>
  );
}

export function SectionShell({
  children,
  eyebrow,
  title
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="motion-section gold-thread-section border-t border-[var(--border-subtle)] py-10">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase text-[var(--color-antique-gold)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-[1.18] text-[var(--color-ivory)] sm:text-3xl">
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
      className="motion-cta inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium text-[var(--button-primary-text)] transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] hover:border-[var(--color-champagne)]"
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
    <div>
      <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--color-ivory)]">
        {value}
      </dd>
    </div>
  );
}
