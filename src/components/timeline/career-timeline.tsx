"use client";

import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Code2,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers3,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import { useRoleLens } from "@/context/role-lens-context";
import {
  certifications,
  futureProjects,
  projects,
  timelineEvents,
  type Certification,
  type FutureProject,
  type Importance,
  type Priority,
  type Project,
  type TimelineEvent,
  type Viewer,
  type ViewerPriority
} from "@/data";

type TimelineLens = Viewer | "balanced";
type TimelineTrackId =
  | "education"
  | "work"
  | "certifications"
  | "projects"
  | "exploring";
type TimelineSource = "timeline" | "certification" | "future";

type TimelineItem = {
  id: string;
  title: string;
  track: TimelineTrackId;
  source: TimelineSource;
  typeLabel: string;
  dateLabel: string;
  startValue: number;
  endValue: number;
  description: string;
  importance: Importance;
  viewerPriority: ViewerPriority;
  proofLinks: readonly { label: string; url: string | null; status: string }[];
  relatedProjects: readonly string[];
  relatedCertifications: readonly string[];
  href?: string;
  metadata: readonly string[];
};

type IconComponent = ComponentType<{
  "aria-hidden"?: boolean;
  className?: string;
}>;

const TIMELINE_DETAIL_PANEL_ID = "timeline-detail-panel";

const CURRENT_VALUE = 2026 + 4.5 / 12;
const EXPLORING_VALUE = 2026 + 7 / 12;
const TIMELINE_MIN = 2023 + 10 / 12;
const TIMELINE_MAX = 2026 + 8 / 12;

const priorityScore = {
  high: 3,
  medium: 2,
  low: 1
} satisfies Record<Priority, number>;

const importanceScore = {
  "very-high": 4,
  high: 3,
  medium: 2,
  low: 1
} satisfies Record<Importance, number>;

const lensLabels = {
  balanced: "Balanced",
  recruiter: "Recruiter",
  engineer: "Engineer",
  leader: "Leader",
  explorer: "Explorer"
} satisfies Record<TimelineLens, string>;

const lensOptions = [
  { id: "balanced", label: "Balanced", Icon: Network },
  { id: "recruiter", label: "Recruiter", Icon: Users },
  { id: "engineer", label: "Engineer", Icon: Code2 },
  { id: "leader", label: "Leader", Icon: ShieldCheck },
  { id: "explorer", label: "Explorer", Icon: Compass }
] satisfies readonly {
  id: TimelineLens;
  label: string;
  Icon: IconComponent;
}[];

const trackMeta = {
  education: {
    label: "Education",
    shortLabel: "Education",
    Icon: GraduationCap,
    tone:
      "border-[color-mix(in_srgb,var(--color-signal-blue)_48%,transparent)] text-[var(--color-signal-blue)]",
    fill: "bg-[color-mix(in_srgb,var(--color-signal-blue)_14%,transparent)]"
  },
  work: {
    label: "Work",
    shortLabel: "Work",
    Icon: Briefcase,
    tone:
      "border-[color-mix(in_srgb,var(--color-success)_48%,transparent)] text-[var(--color-success)]",
    fill: "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]"
  },
  certifications: {
    label: "Certifications",
    shortLabel: "Certs",
    Icon: Award,
    tone:
      "border-[color-mix(in_srgb,var(--color-champagne)_54%,transparent)] text-[var(--color-champagne)]",
    fill:
      "bg-[color-mix(in_srgb,var(--color-antique-gold)_14%,transparent)]"
  },
  projects: {
    label: "Projects",
    shortLabel: "Projects",
    Icon: Layers3,
    tone:
      "border-[color-mix(in_srgb,var(--color-antique-gold)_58%,transparent)] text-[var(--color-ivory-soft)]",
    fill:
      "bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)]"
  },
  exploring: {
    label: "Currently Exploring",
    shortLabel: "Exploring",
    Icon: Rocket,
    tone:
      "border-[color-mix(in_srgb,var(--color-deep-emerald)_80%,transparent)] text-[var(--color-success)]",
    fill:
      "bg-[color-mix(in_srgb,var(--color-deep-emerald)_40%,transparent)]"
  }
} satisfies Record<
  TimelineTrackId,
  {
    label: string;
    shortLabel: string;
    Icon: IconComponent;
    tone: string;
    fill: string;
  }
>;

const trackOrder = [
  "education",
  "work",
  "certifications",
  "projects",
  "exploring"
] as const satisfies readonly TimelineTrackId[];

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const timelineEventCatalog: readonly TimelineEvent[] = timelineEvents;
const projectCatalog: readonly Project[] = projects;
const certificationCatalog: readonly Certification[] = certifications;
const futureProjectCatalog: readonly FutureProject[] = futureProjects;

function parseDateValue(date: string | null, fallback: number) {
  if (!date) {
    return fallback;
  }

  if (date === "Present") {
    return CURRENT_VALUE;
  }

  const yearMonthMatch = /^(\d{4})-(\d{2})$/.exec(date);

  if (yearMonthMatch) {
    const [, year, month] = yearMonthMatch;

    return Number(year) + (Number(month) - 1) / 12;
  }

  if (/^\d{4}$/.test(date)) {
    return Number(date) + 0.42;
  }

  return fallback;
}

function formatDate(date: string | null) {
  if (!date) {
    return "Date pending";
  }

  if (date === "Present") {
    return "Present";
  }

  const yearMonthMatch = /^(\d{4})-(\d{2})$/.exec(date);

  if (yearMonthMatch) {
    const [, year, month] = yearMonthMatch;

    return `${monthLabels[Number(month) - 1]} ${year}`;
  }

  return date;
}

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (startDate && endDate && startDate !== endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  return formatDate(endDate ?? startDate);
}

function clampTimelineValue(value: number) {
  return Math.min(Math.max(value, TIMELINE_MIN), TIMELINE_MAX);
}

function toTimelinePct(value: number) {
  const clamped = clampTimelineValue(value);

  return ((clamped - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100;
}

function trackForEvent(category: TimelineEvent["category"]): TimelineTrackId {
  switch (category) {
    case "education":
      return "education";
    case "work":
    case "recognition":
      return "work";
    case "demo":
    case "project":
    case "publication":
      return "projects";
  }
}

function projectBySlug(slug: string) {
  return projectCatalog.find((project) => project.slug === slug);
}

function certificationBySlug(slug: string) {
  return certificationCatalog.find((credential) => credential.slug === slug);
}

function projectHref(slugs: readonly string[]) {
  const project = slugs.map(projectBySlug).find(Boolean);

  return project ? `/projects/${project.slug}` : undefined;
}

function eventToTimelineItem(event: TimelineEvent): TimelineItem {
  const endFallback = event.startDate ? parseDateValue(event.startDate, 2024) : 2024;
  const endValue = parseDateValue(event.endDate, endFallback + 0.16);
  const startValue = parseDateValue(
    event.startDate,
    event.endDate ? Math.max(endValue - 0.22, TIMELINE_MIN) : endValue
  );
  const href = projectHref(event.relatedProjects);

  return {
    id: event.id,
    title: event.title,
    track: trackForEvent(event.category),
    source: "timeline",
    typeLabel: event.category.replace("-", " "),
    dateLabel: formatDateRange(event.startDate, event.endDate),
    startValue,
    endValue: Math.max(endValue, startValue + 0.16),
    description: event.description,
    importance: event.importance,
    viewerPriority: event.viewerPriority,
    proofLinks: event.proofLinks,
    relatedProjects: event.relatedProjects,
    relatedCertifications: event.relatedCertifications,
    href,
    metadata: [
      `${event.relatedProjects.length} project links`,
      `${event.relatedCertifications.length} credential links`,
      `${event.proofLinks.filter((link) => link.status === "verified").length} verified public links`
    ]
  };
}

function anchorValueForCertification(credential: Certification, index: number) {
  const linkedEvents = timelineEventCatalog
    .filter((event) => event.relatedCertifications.includes(credential.slug))
    .map((event) => {
      const startFallback = parseDateValue(event.endDate, 2025);

      return parseDateValue(event.startDate, startFallback);
    })
    .sort((a, b) => b - a);

  return linkedEvents[0] ?? 2025 + index / 10;
}

function certificationToTimelineItem(
  credential: Certification,
  index: number
): TimelineItem {
  const startValue = anchorValueForCertification(credential, index) + 0.04;
  const isVerified = credential.verificationStatus === "verified";

  return {
    id: `cert-${credential.slug}`,
    title: credential.title,
    track: "certifications",
    source: "certification",
    typeLabel: credential.issuer,
    dateLabel: credential.date ? formatDate(credential.date) : "Verification date pending",
    startValue,
    endValue: startValue + 0.18,
    description:
      credential.note ??
      `${credential.category} credential connected to the project evidence graph.`,
    importance: isVerified ? "high" : "medium",
    viewerPriority: {
      recruiter: "high",
      engineer: credential.category.toLowerCase().includes("engineering")
        ? "high"
        : "medium",
      leader: credential.category.toLowerCase().includes("governance")
        ? "high"
        : "medium",
      explorer: "medium"
    },
    proofLinks: credential.credentialUrl
      ? [
          {
            label: "Credential proof",
            url: credential.credentialUrl,
            status: credential.verificationStatus
          }
        ]
      : [],
    relatedProjects: credential.relatedProjects,
    relatedCertifications: [credential.slug],
    href: "/certifications",
    metadata: [
      credential.group,
      credential.category,
      credential.verificationStatus.replaceAll("-", " ")
    ]
  };
}

function futureProjectToTimelineItem(
  futureProject: FutureProject,
  index: number
): TimelineItem {
  const startValue = EXPLORING_VALUE + index * 0.04;

  return {
    id: `future-${futureProject.slug}`,
    title: futureProject.title,
    track: "exploring",
    source: "future",
    typeLabel: futureProject.status,
    dateLabel: "Next proof horizon",
    startValue,
    endValue: startValue + 0.16,
    description: futureProject.whyItMatters,
    importance: "medium",
    viewerPriority: {
      explorer: "high",
      engineer: "medium",
      leader: "medium",
      recruiter: "low"
    },
    proofLinks: [],
    relatedProjects: futureProject.sourceBasis.filter((source) =>
      projectCatalog.some((project) => project.slug === source)
    ),
    relatedCertifications: [],
    metadata: [
      futureProject.targetOutcome,
      `${futureProject.plannedStack.length} planned stack items`,
      `${futureProject.plannedProof.length} planned proof assets`
    ]
  };
}

function buildTimelineItems() {
  return [
    ...timelineEventCatalog.map(eventToTimelineItem),
    ...certificationCatalog.map(certificationToTimelineItem),
    ...futureProjectCatalog.map(futureProjectToTimelineItem)
  ].sort((a, b) => {
    const startDelta = a.startValue - b.startValue;

    if (startDelta !== 0) {
      return startDelta;
    }

    return trackOrder.indexOf(a.track) - trackOrder.indexOf(b.track);
  });
}

function priorityForLens(
  viewerPriority: ViewerPriority,
  importance: Importance,
  lens: TimelineLens
): Priority {
  if (lens === "balanced") {
    return importanceScore[importance] >= 3 ? "high" : importance === "medium" ? "medium" : "low";
  }

  return viewerPriority[lens] ?? "low";
}

function scoreForLens(item: TimelineItem, lens: TimelineLens) {
  return priorityScore[priorityForLens(item.viewerPriority, item.importance, lens)];
}

function getTrackItems(items: readonly TimelineItem[], track: TimelineTrackId) {
  return items.filter((item) => item.track === track);
}

function getTrackLayout(items: readonly TimelineItem[]) {
  const laneEnds: number[] = [];

  return items
    .map((item) => {
      const startPct = toTimelinePct(item.startValue);
      const minimumSpan = item.track === "certifications" ? 14 : 12;
      const endPct = Math.max(
        toTimelinePct(item.endValue),
        Math.min(startPct + minimumSpan, 100)
      );
      let lane = laneEnds.findIndex((laneEnd) => laneEnd + 1.5 < startPct);

      if (lane === -1) {
        lane = laneEnds.length;
      }

      laneEnds[lane] = endPct;

      return {
        ...item,
        startPct,
        endPct,
        lane
      };
    })
    .sort((a, b) => a.lane - b.lane || a.startValue - b.startValue);
}

function compactItemLabel(item: TimelineItem) {
  if (item.id === "education-cse-degree") {
    return "B.E. CSE";
  }

  if (item.id === "ilink-role-start") {
    return "iLink role";
  }

  if (item.id === "performance-rating-growth") {
    return "Rating 4.8";
  }

  if (item.id.includes("ieee")) {
    return "IEEE";
  }

  if (item.id.includes("bi-validation")) {
    return "BI validation";
  }

  if (item.id.includes("fabcon")) {
    return "FabCon25";
  }

  if (item.id.includes("telecom")) {
    return "Telecom Fabric";
  }

  if (item.id.includes("icore")) {
    return "iCORE";
  }

  if (item.id.includes("dp-700") || item.id.includes("data-engineer-associate")) {
    return item.title.includes("Microsoft") ? "DP-700" : "DBX DE";
  }

  if (item.id.includes("dp-600") || item.id.includes("analytics-engineer")) {
    return "DP-600";
  }

  if (item.id.includes("uc-upgrade")) {
    return "UC Upgrade";
  }

  if (item.id.includes("fundamentals")) {
    return "DBX Fund.";
  }

  if (item.id.includes("copilot")) {
    return "Copilot";
  }

  if (item.id.includes("google")) {
    return "Google DA";
  }

  if (item.id.includes("oracle")) {
    return "OCI";
  }

  if (item.id.includes("lakehouse")) {
    return "Lakehouse";
  }

  if (item.id.includes("entity-resolution")) {
    return "Entity demo";
  }

  if (item.id.includes("analytics-agent")) {
    return "Agent lab";
  }

  return item.title;
}

function topItemsForLens(items: readonly TimelineItem[], lens: TimelineLens) {
  return [...items]
    .sort((a, b) => {
      const scoreDelta = scoreForLens(b, lens) - scoreForLens(a, lens);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return importanceScore[b.importance] - importanceScore[a.importance];
    })
    .slice(0, 3);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange() {
      setPrefersReducedMotion(mediaQuery.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function Badge({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-[0.6875rem] uppercase leading-none ${className}`}
    >
      {children}
    </span>
  );
}

function LensButton({
  active,
  option,
  onSelect
}: {
  active: boolean;
  option: (typeof lensOptions)[number];
  onSelect: () => void;
}) {
  const Icon = option.Icon;

  return (
    <button
      aria-controls={TIMELINE_DETAIL_PANEL_ID}
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
      {option.label}
    </button>
  );
}

function TrackBadge({ item }: { item: TimelineItem }) {
  const track = trackMeta[item.track];
  const Icon = track.Icon;

  return (
    <Badge className={track.tone}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {track.shortLabel}
    </Badge>
  );
}

function TimelineMetrics({
  activeLens,
  items
}: {
  activeLens: TimelineLens;
  items: readonly TimelineItem[];
}) {
  const highFit = items.filter(
    (item) =>
      priorityForLens(item.viewerPriority, item.importance, activeLens) === "high"
  ).length;
  const activeWork = items.filter(
    (item) => item.dateLabel.includes("Present") || item.track === "exploring"
  ).length;
  const verifiedLinks = items.reduce(
    (total, item) =>
      total + item.proofLinks.filter((link) => link.status === "verified").length,
    0
  );

  return (
    <dl className="motion-list grid grid-cols-2 gap-3">
      {[
        ["Milestones", items.length.toString(), "Events and derived proof"],
        ["Tracks", trackOrder.length.toString(), "Career evidence lanes"],
        ["High fit", highFit.toString(), lensLabels[activeLens]],
        ["Live edges", activeWork.toString(), "Current and next work"]
      ].map(([label, value, detail]) => (
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
          <dd className="mt-1 text-xs text-[var(--color-warm-silver)]">
            {label === "Milestones"
              ? `${verifiedLinks} verified public link${verifiedLinks === 1 ? "" : "s"}`
              : detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function LensPanel({
  activeLens,
  items,
  onLensSelect
}: {
  activeLens: TimelineLens;
  items: readonly TimelineItem[];
  onLensSelect: (lens: TimelineLens) => void;
}) {
  const topItems = topItemsForLens(items, activeLens);

  return (
    <section
      aria-label="Timeline role lens"
      className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] p-4 shadow-[var(--shadow-surface)]"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Role emphasis
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group">
            {lensOptions.map((option) => (
              <LensButton
                active={activeLens === option.id}
                key={option.id}
                onSelect={() => onLensSelect(option.id)}
                option={option}
              />
            ))}
          </div>
        </div>

        <div className="motion-list grid gap-2">
          {topItems.map((item) => (
            <div
              className="grid gap-1 border-l border-[var(--border-gold)] pl-3"
              key={item.id}
            >
              <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                {priorityForLens(item.viewerPriority, item.importance, activeLens)} fit
              </p>
              <p className="text-sm font-medium leading-5 text-[var(--color-ivory-soft)]">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopTimelineBoard({
  activeItemId,
  activeLens,
  items,
  onSelect
}: {
  activeItemId: string;
  activeLens: TimelineLens;
  items: readonly TimelineItem[];
  onSelect: (itemId: string) => void;
}) {
  const activeItem = items.find((item) => item.id === activeItemId) ?? items[0];
  const activePct = toTimelinePct(activeItem.startValue);

  return (
    <section className="hidden xl:block">
      <div className="motion-panel-enter rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] shadow-[var(--shadow-surface)]">
        <div className="border-b border-[var(--border-subtle)] px-5 py-5">
          <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
            Career timeline
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
            {activeItem.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
            {activeItem.description}
          </p>
        </div>

        <div className="relative px-5 py-5">
          <div className="mb-4 ml-[132px] grid grid-cols-4 font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            {["2024", "2025", "2026", "Next"].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-5 top-[72px] w-px bg-[var(--color-champagne)] opacity-70 shadow-[0_0_18px_color-mix(in_srgb,var(--color-antique-gold)_40%,transparent)]"
            style={{ left: `calc(132px + ${activePct}% * (100% - 132px - 20px) / 100)` }}
          />

          <div className="grid gap-3">
            {trackOrder.map((trackId) => (
              <TrackRow
                activeItemId={activeItemId}
                activeLens={activeLens}
                items={getTrackItems(items, trackId)}
                key={trackId}
                onSelect={onSelect}
                trackId={trackId}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] px-5 py-4">
          <ActiveSummary activeLens={activeLens} item={activeItem} />
        </div>
      </div>
    </section>
  );
}

function TrackRow({
  activeItemId,
  activeLens,
  items,
  onSelect,
  trackId
}: {
  activeItemId: string;
  activeLens: TimelineLens;
  items: readonly TimelineItem[];
  onSelect: (itemId: string) => void;
  trackId: TimelineTrackId;
}) {
  const track = trackMeta[trackId];
  const Icon = track.Icon;
  const layoutItems = getTrackLayout(items);
  const laneCount = Math.max(1, ...layoutItems.map((item) => item.lane + 1));
  const rowHeight = 46 + laneCount * 36;

  return (
    <div
      className="grid grid-cols-[116px_minmax(0,1fr)] gap-4 rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] p-3"
      style={{ minHeight: rowHeight }}
    >
      <div className="flex items-start gap-2 pt-1">
        <Icon aria-hidden="true" className="h-4 w-4 text-[var(--color-champagne)]" />
        <div>
          <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
            {track.label}
          </p>
          <p className="mt-1 text-xs text-[var(--color-warm-silver)]">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-4 h-px bg-[linear-gradient(90deg,var(--border-subtle),var(--border-gold),var(--border-subtle))]"
        />
        {layoutItems.map((item) => {
          const priority = priorityForLens(
            item.viewerPriority,
            item.importance,
            activeLens
          );
          const width = Math.max(item.endPct - item.startPct, 12);
          const isActive = item.id === activeItemId;

          return (
            <button
              aria-controls={TIMELINE_DETAIL_PANEL_ID}
              aria-label={`${item.title}. ${item.dateLabel}. ${track.label}. ${priority} fit.`}
              aria-pressed={isActive}
              className={`motion-timeline-item absolute flex h-8 items-center overflow-hidden rounded-[var(--radius-control)] border px-2 text-left text-xs transition duration-[var(--duration-feedback)] hover:-translate-y-[var(--motion-distance-xs)] ${
                isActive
                  ? "border-[var(--border-gold)] bg-[var(--button-primary-bg)] text-[var(--color-ivory)] shadow-[var(--shadow-gold-trace)]"
                  : priority === "high"
                    ? `border-[var(--border-cool)] ${track.fill} text-[var(--color-ivory-soft)]`
                    : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_82%,transparent)] text-[var(--color-warm-silver)] opacity-80 hover:opacity-100"
              }`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                left: `${item.startPct}%`,
                top: `${30 + item.lane * 36}px`,
                width: `${width}%`
              }}
              title={item.title}
              type="button"
            >
              <span className="truncate">{compactItemLabel(item)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActiveSummary({
  activeLens,
  item
}: {
  activeLens: TimelineLens;
  item: TimelineItem;
}) {
  const priority = priorityForLens(item.viewerPriority, item.importance, activeLens);

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_150px]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <TrackBadge item={item} />
          <Badge className="border-[var(--border-subtle)] text-[var(--color-warm-silver)]">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {item.dateLabel}
          </Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--console-muted)]">
          {item.metadata[0]}
        </p>
      </div>
      <div className="border-l border-[var(--border-subtle)] pl-4">
        <p className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
          {lensLabels[activeLens]} fit
        </p>
        <p className="mt-2 text-2xl font-semibold capitalize text-[var(--color-ivory)]">
          {priority}
        </p>
      </div>
    </div>
  );
}

function DesktopScrollCards({
  activeItemId,
  activeLens,
  items,
  registerItem,
  onSelect
}: {
  activeItemId: string;
  activeLens: TimelineLens;
  items: readonly TimelineItem[];
  registerItem: (itemId: string, node: HTMLElement | null) => void;
  onSelect: (itemId: string) => void;
}) {
  return (
    <div className="motion-list hidden gap-4 xl:grid">
      {items.map((item) => (
        <TimelineScrollCard
          activeLens={activeLens}
          isActive={activeItemId === item.id}
          item={item}
          key={item.id}
          onSelect={() => onSelect(item.id)}
          registerItem={registerItem}
        />
      ))}
    </div>
  );
}

function TimelineScrollCard({
  activeLens,
  isActive,
  item,
  onSelect,
  registerItem
}: {
  activeLens: TimelineLens;
  isActive: boolean;
  item: TimelineItem;
  onSelect: () => void;
  registerItem: (itemId: string, node: HTMLElement | null) => void;
}) {
  const priority = priorityForLens(item.viewerPriority, item.importance, activeLens);

  return (
    <article
      className={`motion-card scroll-mt-10 rounded-[var(--radius-card)] border bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-hairline-inset)] transition duration-[var(--duration-state)] ${
        isActive
          ? "border-[var(--border-gold)] shadow-[var(--shadow-surface)]"
          : "border-[var(--card-border)]"
      }`}
      aria-controls={TIMELINE_DETAIL_PANEL_ID}
      aria-label={`${item.title}. ${item.dateLabel}. ${priority} fit.`}
      aria-pressed={isActive}
      data-timeline-id={item.id}
      onClick={onSelect}
      ref={(node) => registerItem(item.id, node)}
      role="button"
      tabIndex={0}
      onFocus={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <TrackBadge item={item} />
        <Badge className="border-[var(--border-subtle)] text-[var(--color-warm-silver)]">
          {item.dateLabel}
        </Badge>
        <Badge
          className={
            priority === "high"
              ? "border-[var(--border-cool)] text-[var(--color-signal-blue)]"
              : "border-[var(--border-subtle)] text-[var(--color-steel)]"
          }
        >
          {priority} fit
        </Badge>
      </div>

      <h3 className="mt-4 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--color-warm-silver)]">
        {item.description}
      </p>

      <div className="mt-5 grid gap-3 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-3">
        {item.metadata.slice(0, 3).map((detail, index) => (
          <p
            className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] px-3 py-2 text-xs leading-5 text-[var(--color-ivory-soft)]"
            key={`${detail}-${index}`}
          >
            {detail}
          </p>
        ))}
      </div>
    </article>
  );
}

function DetailPanel({
  activeLens,
  item
}: {
  activeLens: TimelineLens;
  item: TimelineItem;
}) {
  const track = trackMeta[item.track];
  const TrackIcon = track.Icon;
  const priority = priorityForLens(item.viewerPriority, item.importance, activeLens);
  const linkedProjects = item.relatedProjects
    .map(projectBySlug)
    .filter((project): project is Project => Boolean(project));
  const linkedCertifications = item.relatedCertifications
    .map(certificationBySlug)
    .filter((credential): credential is Certification => Boolean(credential));
  const externalProofLinks = item.proofLinks.filter((link) => Boolean(link.url));
  const pendingProofLinks = item.proofLinks.filter((link) => !link.url);

  return (
    <aside
      aria-labelledby={`${TIMELINE_DETAIL_PANEL_ID}-title`}
      aria-live="polite"
      className="motion-detail-swap rounded-[var(--radius-panel)] border border-[var(--console-border)] bg-[var(--surface-console)] shadow-[var(--shadow-surface)] xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:overflow-y-auto"
      id={TIMELINE_DETAIL_PANEL_ID}
      role="region"
    >
      <div className={`border-b ${track.tone} px-5 py-5`}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={track.tone}>
            <TrackIcon aria-hidden="true" className="h-3.5 w-3.5" />
            {track.label}
          </Badge>
          <Badge className="border-[var(--border-subtle)] text-[var(--color-warm-silver)]">
            {item.dateLabel}
          </Badge>
        </div>
        <h2
          className="mt-4 text-2xl font-semibold leading-[1.16] text-[var(--color-ivory)]"
          id={`${TIMELINE_DETAIL_PANEL_ID}-title`}
        >
          {item.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--console-muted)]">
          {item.description}
        </p>
      </div>

      <div className="space-y-6 px-5 py-5">
        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Lens fit", priority],
            ["Importance", item.importance],
            ["Type", item.typeLabel],
            ["Source", item.source]
          ].map(([label, value]) => (
            <div
              className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_58%,transparent)] p-3"
              key={label}
            >
              <dt className="font-mono text-[0.6875rem] uppercase text-[var(--color-steel)]">
                {label}
              </dt>
              <dd className="mt-1 text-sm capitalize leading-5 text-[var(--color-ivory-soft)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {item.href ? (
          <Link
            aria-label={`Open related proof for ${item.title}`}
            className="motion-cta inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-gold)] bg-[var(--button-primary-bg)] px-3 text-sm font-medium text-[var(--button-primary-text)] transition duration-[var(--duration-feedback)] hover:border-[var(--color-champagne)]"
            href={item.href}
          >
            Open related proof
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}

        <DetailSection title="Project links">
          {linkedProjects.length > 0 ? (
            <div className="grid gap-2">
              {linkedProjects.map((project) => (
                <Link
                  className="motion-cta rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-2 text-sm leading-5 text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                  href={`/projects/${project.slug}`}
                  key={project.slug}
                >
                  {project.title}
                </Link>
              ))}
            </div>
          ) : (
            <EmptyDetail>Project proof is not attached yet.</EmptyDetail>
          )}
        </DetailSection>

        <DetailSection title="Credential links">
          {linkedCertifications.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {linkedCertifications.map((credential) => (
                <Link
                  className="motion-cta rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                  href="/certifications"
                  key={credential.slug}
                >
                  {credential.title}
                </Link>
              ))}
            </div>
          ) : (
            <EmptyDetail>No credential is attached to this item.</EmptyDetail>
          )}
        </DetailSection>

        <DetailSection title="Proof state">
          <div className="grid gap-2">
            {externalProofLinks.map((link) => (
              <a
                aria-label={`${link.label} for ${item.title}. Opens in a new tab.`}
                className="motion-cta flex min-h-10 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)] transition duration-[var(--duration-feedback)] hover:border-[var(--border-gold)] hover:text-[var(--color-ivory)]"
                href={link.url ?? undefined}
                key={`${link.label}-${link.url}`}
                rel="noreferrer"
                target="_blank"
              >
                <span>{link.label}</span>
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
            {pendingProofLinks.map((link) => (
              <p
                className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-warm-silver)_8%,transparent)] px-3 py-2 text-sm leading-5 text-[var(--color-warm-silver)]"
                key={link.label}
              >
                {link.label}: {link.status.replaceAll("-", " ")}
              </p>
            ))}
            {item.proofLinks.length === 0 ? (
              <EmptyDetail>Proof assets are queued through related records.</EmptyDetail>
            ) : null}
          </div>
        </DetailSection>
      </div>
    </aside>
  );
}

function DetailSection({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <h3 className="font-mono text-xs uppercase text-[var(--color-champagne)]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyDetail({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 py-2 text-sm leading-6 text-[var(--color-warm-silver)]">
      {children}
    </p>
  );
}

function MobileTimelineFallback({
  activeItemId,
  activeLens,
  items,
  onSelect
}: {
  activeItemId: string;
  activeLens: TimelineLens;
  items: readonly TimelineItem[];
  onSelect: (itemId: string) => void;
}) {
  return (
    <section className="motion-list grid gap-4 xl:hidden">
      {trackOrder.map((trackId) => {
        const track = trackMeta[trackId];
        const TrackIcon = track.Icon;
        const trackItems = getTrackItems(items, trackId);

        return (
          <div
            className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-4"
            key={trackId}
          >
            <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--color-champagne)]">
              <TrackIcon aria-hidden="true" className="h-4 w-4" />
              {track.label}
            </div>
            <div className="mt-4 grid gap-3">
              {trackItems.map((item) => {
                const priority = priorityForLens(
                  item.viewerPriority,
                  item.importance,
                  activeLens
                );

                return (
                  <button
                    aria-controls={TIMELINE_DETAIL_PANEL_ID}
                    aria-label={`${item.title}. ${item.dateLabel}. ${priority} fit.`}
                    aria-pressed={activeItemId === item.id}
                    className={`motion-card motion-timeline-item w-full rounded-[var(--radius-card)] border p-4 text-left transition duration-[var(--duration-feedback)] ${
                      activeItemId === item.id
                        ? "border-[var(--border-gold)] bg-[var(--surface-panel-hover)]"
                        : "border-[var(--card-border)] bg-[var(--surface-panel)]"
                    }`}
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    type="button"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={track.tone}>{item.dateLabel}</Badge>
                      <Badge className="border-[var(--border-subtle)] text-[var(--color-warm-silver)]">
                        {priority} fit
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold leading-[1.18] text-[var(--color-ivory)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-warm-silver)]">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function CareerTimeline() {
  const { clearRole, role, setRole } = useRoleLens();
  const prefersReducedMotion = usePrefersReducedMotion();
  const items = useMemo(() => buildTimelineItems(), []);
  const [activeItemId, setActiveItemId] = useState(items[0]?.id ?? "");
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeLens: TimelineLens = role ?? "balanced";
  const activeItem =
    items.find((item) => item.id === activeItemId) ?? items[0];

  function handleLensSelect(nextLens: TimelineLens) {
    if (nextLens === "balanced") {
      clearRole();
      return;
    }

    setRole(nextLens);
  }

  function registerItem(itemId: string, node: HTMLElement | null) {
    itemRefs.current[itemId] = node;
  }

  function handleSelectItem(itemId: string) {
    setActiveItemId(itemId);
    itemRefs.current[itemId]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center"
    });
  }

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const itemId = visibleEntry.target.getAttribute("data-timeline-id");

        if (itemId) {
          setActiveItemId(itemId);
        }
      },
      {
        rootMargin: "-32% 0px -48% 0px",
        threshold: [0.25, 0.45, 0.65, 0.85]
      }
    );

    Object.values(itemRefs.current).forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [items, prefersReducedMotion]);

  return (
    <main className="min-h-screen px-[var(--layout-gutter)] py-10">
      <section className="motion-section gold-thread-section mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-8">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase text-[var(--console-prompt)]">
              Career timeline
            </p>
            <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--color-ivory)] sm:text-6xl">
              The thread from study to shipped data systems.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-warm-silver)] sm:text-lg">
              Education, work, credentials, projects, and current exploration
              sit on the same evidence rail, with each role lens changing which
              milestones carry the most weight.
            </p>
          </div>

          <TimelineMetrics activeLens={activeLens} items={items} />
        </header>

        <LensPanel
          activeLens={activeLens}
          items={items}
          onLensSelect={handleLensSelect}
        />

        {activeItem ? (
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="xl:sticky xl:top-[var(--site-header-offset)] xl:max-h-[var(--sticky-panel-max-height)] xl:self-start xl:overflow-y-auto">
              <DesktopTimelineBoard
                activeItemId={activeItem.id}
                activeLens={activeLens}
                items={items}
                onSelect={handleSelectItem}
              />
              <div className="xl:hidden">
                <DetailPanel
                  activeLens={activeLens}
                  item={activeItem}
                  key={`mobile-${activeItem.id}`}
                />
              </div>
            </div>

            <div className="grid gap-6">
              <div className="hidden xl:block">
                <DetailPanel
                  activeLens={activeLens}
                  item={activeItem}
                  key={`desktop-${activeItem.id}`}
                />
              </div>
              <DesktopScrollCards
                activeItemId={activeItem.id}
                activeLens={activeLens}
                items={items}
                onSelect={handleSelectItem}
                registerItem={registerItem}
              />
              <MobileTimelineFallback
                activeItemId={activeItem.id}
                activeLens={activeLens}
                items={items}
                onSelect={handleSelectItem}
              />
            </div>
          </section>
        ) : null}

        <section className="motion-section gold-thread-section rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--color-carbon)_70%,transparent)] p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase text-[var(--console-prompt)]">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                Continuity checks
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ivory)]">
                Every track is anchored to canonical portfolio data.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-warm-silver)]">
                The base milestones come from `src/data/timeline.ts`; credential
                and exploration rails are derived from their source modules and
                linked back into timeline events, projects, and proof records.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {[
                "Education and work chronology",
                "Project and publication evidence",
                "Credential proof queue"
              ].map((item) => (
                <div
                  className="flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-subtle)] px-3 text-sm text-[var(--color-ivory-soft)]"
                  key={item}
                >
                  <BadgeCheck
                    aria-hidden="true"
                    className="h-4 w-4 text-[var(--color-success)]"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
