"use client";

import Link from "next/link";
import clsx from "clsx";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
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
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
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
import styles from "./career-timeline.module.css";

type TimelineLens = Viewer | "balanced";
type TimelineTrackId =
  | "education"
  | "work"
  | "certifications"
  | "projects"
  | "exploring";
type TimelineSource = "timeline" | "certification" | "future";
type TimelineTrackFilter = TimelineTrackId | "all";
type TimelineYearFilter = 2024 | 2025 | 2026 | "all";
type TimelineCursorTone = "default" | "filter" | "read" | "open" | "step";

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
const TIMELINE_CURSOR_SELECTOR = "[data-cursor-label]";

const CURRENT_VALUE = 2026 + 4.5 / 12;
const EXPLORING_VALUE = 2026 + 7 / 12;
const TIMELINE_MIN = 2023 + 10 / 12;

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

const narrativeSpine = [
  {
    detail: "B.E. CSE foundations, publication path, and core systems vocabulary.",
    label: "Foundation",
    period: "2024"
  },
  {
    detail: "Reporting validation, Power BI migration, and measurable delivery habits.",
    label: "BI validation",
    period: "2025"
  },
  {
    detail: "Fabric lakehouse, CDC/SCD choices, validation matrices, and BI serving.",
    label: "Fabric delivery",
    period: "2025"
  },
  {
    detail: "Databricks-hosted MDM/entity-resolution product work with governed review.",
    label: "Data products",
    period: "2026"
  },
  {
    detail: "Public-safe demos, credential routes, and future proof packets.",
    label: "Public proof",
    period: "Now"
  }
] as const;

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

const timelineYears = [2024, 2025, 2026] as const;

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
    return "Date not shown";
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
    dateLabel: credential.date ? formatDate(credential.date) : "Date not shown",
    startValue,
    endValue: startValue + 0.18,
    description:
      credential.note ??
      `${credential.category} credential connected to the skill map.`,
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
            label: "Credential reference",
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
    dateLabel: "Roadmap item",
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
      `${futureProject.plannedStack.length} implementation themes`,
      `${futureProject.plannedProof.length} public deliverables`
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

function publicPriorityLabel(priority: Priority) {
  switch (priority) {
    case "high":
      return "Core";
    case "medium":
      return "Supporting";
    case "low":
      return "Background";
  }
}

function scoreForLens(item: TimelineItem, lens: TimelineLens) {
  return priorityScore[priorityForLens(item.viewerPriority, item.importance, lens)];
}

function getTrackItems(items: readonly TimelineItem[], track: TimelineTrackId) {
  return items.filter((item) => item.track === track);
}

function yearForItem(item: TimelineItem) {
  return Math.floor(item.startValue);
}

function matchesTimelineScope(
  item: TimelineItem,
  trackFilter: TimelineTrackFilter,
  yearFilter: TimelineYearFilter
) {
  return (
    (trackFilter === "all" || item.track === trackFilter) &&
    (yearFilter === "all" || yearForItem(item) === yearFilter)
  );
}

function itemsForScope(
  items: readonly TimelineItem[],
  trackFilter: TimelineTrackFilter,
  yearFilter: TimelineYearFilter
) {
  return items.filter((item) =>
    matchesTimelineScope(item, trackFilter, yearFilter)
  );
}

function evidenceCountForItems(items: readonly TimelineItem[]) {
  return items.reduce(
    (total, item) =>
      total +
      item.relatedProjects.length +
      item.relatedCertifications.length +
      item.proofLinks.length,
    0
  );
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
      className={clsx(styles.lensChoice, active && styles.lensChoiceActive)}
      data-cursor-label="Lens"
      data-cursor-tone="filter"
      onClick={onSelect}
      type="button"
    >
      <span aria-hidden="true" className={styles.lensChoiceGlow} />
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span>{option.label}</span>
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

function TimelineCursor({
  prefersReducedMotion
}: {
  prefersReducedMotion: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const cursorX = useMotionValue(-120);
  const cursorY = useMotionValue(-120);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorState, setCursorState] = useState<{
    active: boolean;
    label: string;
    tone: TimelineCursorTone;
  }>({
    active: false,
    label: "",
    tone: "default"
  });
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 540]);
  const apertureScale = useSpring(cursorState.active ? 1 : 0.64, {
    damping: 26,
    mass: 0.36,
    stiffness: 360
  });
  const cursorKeyRef = useRef("idle");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    function handleMediaChange() {
      setEnabled(mediaQuery.matches && !prefersReducedMotion);
    }

    const frame = window.requestAnimationFrame(handleMediaChange);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.cancelAnimationFrame(frame);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) {
      delete document.documentElement.dataset.timelineCursor;
      return;
    }

    document.documentElement.dataset.timelineCursor = "true";
    const scope = document.querySelector<HTMLElement>(
      "[data-timeline-cursor-scope='true']"
    );

    function handlePointerMove(event: PointerEvent) {
      const target = event.target;

      if (!scope || !(target instanceof Node) || !scope.contains(target)) {
        setVisible(false);
        return;
      }

      const cursorTarget =
        target instanceof Element
          ? target.closest<HTMLElement>(TIMELINE_CURSOR_SELECTOR)
          : null;
      const nextLabel = cursorTarget?.dataset.cursorLabel ?? "";
      const nextTone =
        (cursorTarget?.dataset.cursorTone as TimelineCursorTone | undefined) ??
        "default";

      cursorX.set(event.clientX);
      cursorY.set(event.clientY);

      setVisible(true);

      const nextKey = `${nextLabel}:${nextTone}`;

      if (cursorKeyRef.current !== nextKey) {
        cursorKeyRef.current = nextKey;
        setCursorState({
          active: Boolean(nextLabel),
          label: nextLabel,
          tone: nextTone
        });
      }
    }

    function handlePointerLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      delete document.documentElement.dataset.timelineCursor;
    };
  }, [cursorX, cursorY, enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className={styles.timelineCursor}
      style={{ opacity: visible ? 1 : 0, x: cursorX, y: cursorY }}
    >
      <motion.span
        className={clsx(
          styles.timelineCursorAura,
          cursorState.active && styles.timelineCursorAuraActive,
          cursorState.tone === "filter" && styles.timelineCursorFilter,
          cursorState.tone === "read" && styles.timelineCursorRead,
          cursorState.tone === "open" && styles.timelineCursorOpen,
          cursorState.tone === "step" && styles.timelineCursorStep
        )}
        style={{ scale: apertureScale }}
      />
      <motion.span
        className={styles.timelineCursorOrbit}
        style={{ rotate: orbitRotate, scale: apertureScale }}
      />
      <span
        className={clsx(
          styles.timelineCursorCore,
          cursorState.active && styles.timelineCursorCoreActive,
          cursorState.tone === "filter" && styles.timelineCursorFilter,
          cursorState.tone === "read" && styles.timelineCursorRead,
          cursorState.tone === "open" && styles.timelineCursorOpen,
          cursorState.tone === "step" && styles.timelineCursorStep
        )}
      >
        <span className={styles.timelineCursorDot} />
        <span className={styles.timelineCursorLabel}>
          {cursorState.label || "Atlas"}
        </span>
      </span>
    </motion.div>
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
    <dl className={styles.metricStrip}>
      {[
        ["Milestones", items.length.toString(), `${verifiedLinks} verified links`],
        ["Tracks", trackOrder.length.toString(), "Timeline lanes"],
        ["Core matches", highFit.toString(), lensLabels[activeLens]],
        ["Live edges", activeWork.toString(), "Current and next"]
      ].map(([label, value, detail]) => (
        <div className={styles.metricTile} key={label}>
          <span aria-hidden="true" className={styles.timelineMetricPulse} />
          <dt>{label}</dt>
          <dd>{value}</dd>
          <dd>{detail}</dd>
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
    <section aria-label="Timeline review focus" className={styles.lensPanel}>
      <div className={styles.panelEyebrow}>
        <Sparkles aria-hidden="true" className="h-4 w-4" />
        Role emphasis
      </div>

      <div className={styles.lensPanelGrid}>
        <div>
          <h2 className={styles.lensTitle}>Choose the most useful review path.</h2>
          <p className={styles.lensCopy}>
            The map reprioritizes milestones without hiding the full chronology.
          </p>
          <div className={styles.lensChoices} role="group">
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

          <div className={styles.lensShortlist}>
          {topItems.map((item, index) => (
            <div className={styles.lensShortlistItem} key={item.id}>
              <span aria-hidden="true" className={styles.timelineCurrentSweep} />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>
                  {publicPriorityLabel(
                    priorityForLens(item.viewerPriority, item.importance, activeLens)
                  )}
                </p>
                <strong>{compactItemLabel(item)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineNarrativeSpine() {
  return (
    <section aria-label="Timeline narrative spine" className={styles.narrativeSpine}>
      <div className={styles.narrativeHeader}>
        <div>
          <div className={styles.panelEyebrow}>
            <Rocket aria-hidden="true" className="h-4 w-4" />
            Reading spine
          </div>
          <h2>Read the path as one arc, then inspect the evidence.</h2>
        </div>
        <p>
          The chronology is arranged so the eye can move from foundation to
          delivery to public proof before opening individual milestones.
        </p>
      </div>

      <ol className={styles.narrativeSteps}>
        {narrativeSpine.map((step, index) => (
          <li key={step.label}>
            <i aria-hidden="true" className={styles.narrativeSignal} />
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{step.period}</p>
              <strong>{step.label}</strong>
              <em>{step.detail}</em>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TimelineDetailPanel({
  activeLens,
  item,
  nextItem,
  onSelectItem,
  previousItem,
  scrollHalo
}: {
  activeLens: TimelineLens;
  item: TimelineItem;
  nextItem?: TimelineItem;
  onSelectItem: (itemId: string) => void;
  previousItem?: TimelineItem;
  scrollHalo?: ReactNode;
}) {
  const priority = priorityForLens(item.viewerPriority, item.importance, activeLens);

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={styles.detailPanel}
      id={TIMELINE_DETAIL_PANEL_ID}
      initial={{ opacity: 0, y: 12 }}
      key={item.id}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {scrollHalo}
      <div className={styles.detailChrome} aria-hidden="true" />
      <span aria-hidden="true" className={styles.detailHeartbeat} />
      <span aria-hidden="true" className={styles.detailScan} />

      <div className={styles.detailTopline}>
        <div className={styles.detailBadges}>
          <TrackBadge item={item} />
          <span>{item.dateLabel}</span>
        </div>
        <span className={styles.priorityBadge}>
          {publicPriorityLabel(priority)}
        </span>
      </div>

      <p className={styles.detailKicker}>Active milestone</p>
      <h3 className={styles.detailTitle}>
        {item.title}
      </h3>

      <p className={styles.detailCopy}>
        {item.description}
      </p>

      <TimelineMilestoneReceipt
        activeLens={activeLens}
        item={item}
        priority={priority}
      />

      {item.metadata.length > 0 ? (
        <div className={styles.detailMetadata}>
          {item.metadata.map((meta, metaIndex) => (
            <span
              key={`${item.id}-${metaIndex}-${meta}`}
            >
              {meta}
            </span>
          ))}
        </div>
      ) : null}

      <div className={styles.detailActions}>
        {item.href ? (
          <Link
            className={styles.primaryAction}
            data-cursor-label="Open"
            data-cursor-tone="open"
            href={item.href}
          >
            <span aria-hidden="true" className={styles.timelineCurrentSweep} />
            Open related page
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}

        {item.proofLinks.map((link) =>
          link.url ? (
            <Link
              className={styles.secondaryAction}
              data-cursor-label="Proof"
              data-cursor-tone="open"
              href={link.url}
              key={link.url}
            >
              <span aria-hidden="true" className={styles.timelineCurrentSweep} />
              {link.label}
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <span
              className={styles.secondaryAction}
              data-cursor-label="Proof"
              data-cursor-tone="open"
              key={`${item.id}-${link.label}`}
            >
              <span aria-hidden="true" className={styles.timelineCurrentSweep} />
              {link.label}
            </span>
          )
        )}
      </div>

      <div className={styles.detailStepper}>
        <button
          aria-label={
            previousItem
              ? `Previous milestone: ${previousItem.title}`
              : "No previous milestone"
          }
          disabled={!previousItem}
          data-cursor-label={previousItem ? "Prev" : undefined}
          data-cursor-tone="step"
          onClick={() => {
            if (previousItem) {
              onSelectItem(previousItem.id);
            }
          }}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span>{previousItem ? compactItemLabel(previousItem) : "Start"}</span>
        </button>
        <button
          aria-label={
            nextItem ? `Next milestone: ${nextItem.title}` : "No next milestone"
          }
          disabled={!nextItem}
          data-cursor-label={nextItem ? "Next" : undefined}
          data-cursor-tone="step"
          onClick={() => {
            if (nextItem) {
              onSelectItem(nextItem.id);
            }
          }}
          type="button"
        >
          <span>{nextItem ? compactItemLabel(nextItem) : "End"}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}

function TimelineMilestoneReceipt({
  activeLens,
  item,
  priority
}: {
  activeLens: TimelineLens;
  item: TimelineItem;
  priority: Priority;
}) {
  const track = trackMeta[item.track];
  const proofTotal =
    item.relatedProjects.length +
    item.relatedCertifications.length +
    item.proofLinks.length;
  const receiptItems = [
    {
      detail: "Timeline window",
      label: "Date",
      value: item.dateLabel
    },
    {
      detail: "Chapter lane",
      label: "Track",
      value: track.label
    },
    {
      detail: `${lensLabels[activeLens]} lens`,
      label: "Fit",
      value: publicPriorityLabel(priority)
    },
    {
      detail: `${item.relatedProjects.length} projects / ${item.relatedCertifications.length} credentials / ${item.proofLinks.length} links`,
      label: "Proof",
      value: `${proofTotal} refs`
    }
  ] as const;

  return (
    <dl className={styles.detailReceipt} aria-label="Selected milestone receipt">
      {receiptItems.map((receipt) => (
        <div key={receipt.label}>
          <span aria-hidden="true" className={styles.timelineMetricPulse} />
          <dt>{receipt.label}</dt>
          <dd>{receipt.value}</dd>
          <dd>{receipt.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function TimelineAtlas({
  activeItemId,
  activeLens,
  activeTrackFilter,
  activeYearFilter,
  items,
  onActiveItemChange,
  onClearScope,
  onRegisterItem,
  onTrackFilterSelect,
  onYearFilterSelect
}: {
  activeItemId: string;
  activeLens: TimelineLens;
  activeTrackFilter: TimelineTrackFilter;
  activeYearFilter: TimelineYearFilter;
  items: readonly TimelineItem[];
  onActiveItemChange: (itemId: string) => void;
  onClearScope: (focusFirstItem?: boolean) => void;
  onRegisterItem: (itemId: string, node: HTMLElement | null) => void;
  onTrackFilterSelect: (trackId: TimelineTrackId) => void;
  onYearFilterSelect: (year: TimelineYearFilter) => void;
}) {
  const atlasRef = useRef<HTMLElement | null>(null);
  const scopeActive =
    activeTrackFilter !== "all" || activeYearFilter !== "all";
  const scopedItems = itemsForScope(
    items,
    activeTrackFilter,
    activeYearFilter
  );
  const activeItem =
    items.find((item) => item.id === activeItemId) ?? items[0];
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeItem?.id)
  );
  const scopedActiveIndex = Math.max(
    0,
    scopedItems.findIndex((item) => item.id === activeItem?.id)
  );
  const previousItem =
    scopedActiveIndex > 0 ? scopedItems[scopedActiveIndex - 1] : undefined;
  const nextItem =
    scopedActiveIndex >= 0 && scopedActiveIndex < scopedItems.length - 1
      ? scopedItems[scopedActiveIndex + 1]
      : undefined;
  const topItems = topItemsForLens(scopedItems.length > 0 ? scopedItems : items, activeLens);
  const yearChapters = timelineYears.map((year) => ({
    year,
    items: items.filter((item) => yearForItem(item) === year)
  }));
  const scopeEvidenceCount = evidenceCountForItems(scopedItems);
  const scopeHighFitCount = scopedItems.filter(
    (item) =>
      priorityForLens(item.viewerPriority, item.importance, activeLens) === "high"
  ).length;
  const scopeYearCount = new Set(scopedItems.map(yearForItem)).size;
  const scopeTrackLabel =
    activeTrackFilter === "all"
      ? "All tracks"
      : trackMeta[activeTrackFilter].label;
  const scopeYearLabel =
    activeYearFilter === "all" ? "All years" : String(activeYearFilter);
  const { scrollYProgress } = useScroll({
    target: atlasRef,
    offset: ["start 78%", "end 34%"]
  });
  const haloProgress = useSpring(scrollYProgress, {
    damping: 28,
    mass: 0.78,
    stiffness: 90
  });
  const haloHeight = useTransform(haloProgress, [0, 1], ["0%", "100%"]);
  const haloOpacity = useTransform(
    haloProgress,
    [0, 0.12, 0.88, 1],
    [0.24, 1, 1, 0.42]
  );
  const haloY = useTransform(haloProgress, [0, 1], ["-6%", "74%"]);
  const haloScale = useTransform(haloProgress, [0, 0.5, 1], [0.96, 1.06, 0.98]);
  const haloRotate = useTransform(haloProgress, [0, 1], [-7, 8]);
  const ambientOpacity = useTransform(
    haloProgress,
    [0, 0.18, 0.86, 1],
    [0.08, 0.92, 0.86, 0.32]
  );
  const inspectorGlowY = useTransform(haloProgress, [0, 1], ["-18%", "68%"]);

  function handleMilestoneSelect(item: TimelineItem, isInScope: boolean) {
    if (scopeActive && !isInScope) {
      onClearScope(false);
    }

    onActiveItemChange(item.id);
  }

  return (
    <section
      aria-labelledby="timeline-atlas-title"
      className={styles.atlasSection}
      id="timeline-path"
      ref={atlasRef}
    >
      <motion.div
        aria-hidden="true"
        className={styles.atlasSpine}
        style={{ opacity: haloOpacity }}
      >
        <motion.div
          className={styles.atlasSpineGlow}
          style={{ height: haloHeight }}
        />
        <motion.div
          className={styles.atlasSpineFill}
          style={{ height: haloHeight }}
        />
      </motion.div>

      <div className={styles.atlasHeader}>
        <div>
          <div className={styles.panelEyebrow}>
            <Network aria-hidden="true" className="h-4 w-4" />
            Timeline atlas
          </div>
          <h2
            className={styles.atlasTitle}
            id="timeline-atlas-title"
          >
            Career milestones, curated by chapter.
          </h2>
          <p className={styles.atlasCopy}>
            Jump by track, scan the chronology, and step through each selected
            milestone without decoding a chart.
          </p>
        </div>

        <div className={styles.activeSummary}>
          <span aria-hidden="true" className={styles.timelineCurrentSweep} />
          <span aria-hidden="true" className={styles.activeSummaryPulse} />
          <p>
            Active milestone
          </p>
          <strong>
            {activeItem ? compactItemLabel(activeItem) : "Timeline"}
          </strong>
          <span>
            {activeIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      <div className={styles.atlasGrid}>
        <div className={styles.navigatorShell}>
          <motion.div
            aria-hidden="true"
            className={styles.scrollHalo}
            style={{
              opacity: ambientOpacity,
              rotate: haloRotate,
              scale: haloScale,
              y: haloY
            }}
          />
          <motion.div
            aria-hidden="true"
            className={styles.scrollScanline}
            style={{ opacity: haloOpacity, y: haloY }}
          />

          <div className={styles.navigatorHeader}>
            <div>
              <p>
                Milestone navigator
              </p>
              <strong>Choose the chapter, then read the milestone.</strong>
            </div>
            <div className={styles.yearJumpNav} aria-label="Filter by year">
              <button
                aria-pressed={activeYearFilter === "all"}
                className={clsx(
                  activeYearFilter === "all" && styles.yearJumpButtonActive
                )}
                data-cursor-label="Years"
                data-cursor-tone="filter"
                onClick={() => onYearFilterSelect("all")}
                type="button"
              >
                <span aria-hidden="true" className={styles.timelineCurrentSweep} />
                <span>All</span>
                <em>{itemsForScope(items, activeTrackFilter, "all").length}</em>
              </button>

              {yearChapters.map((chapter) => {
                const scopedYearItems = itemsForScope(
                  chapter.items,
                  activeTrackFilter,
                  "all"
                );

                return (
                  <button
                    aria-pressed={activeYearFilter === chapter.year}
                    className={clsx(
                      activeYearFilter === chapter.year &&
                        styles.yearJumpButtonActive
                    )}
                    disabled={scopedYearItems.length === 0}
                    data-cursor-label={
                      scopedYearItems.length > 0 ? "Year" : undefined
                    }
                    data-cursor-tone="filter"
                    key={chapter.year}
                    onClick={() => onYearFilterSelect(chapter.year)}
                    type="button"
                  >
                    <span aria-hidden="true" className={styles.timelineCurrentSweep} />
                    <span>{chapter.year}</span>
                    <em>{scopedYearItems.length}</em>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.scopeSummary}>
            <div>
              <p>Current scope</p>
              <strong>
                {scopeTrackLabel} / {scopeYearLabel}
              </strong>
            </div>
            <dl className={styles.scopeStats}>
              <div>
                <span aria-hidden="true" className={styles.timelineMetricPulse} />
                <dt>Milestones</dt>
                <dd>{scopedItems.length}</dd>
              </div>
              <div>
                <span aria-hidden="true" className={styles.timelineMetricPulse} />
                <dt>Core matches</dt>
                <dd>{scopeHighFitCount}</dd>
              </div>
              <div>
                <span aria-hidden="true" className={styles.timelineMetricPulse} />
                <dt>Links</dt>
                <dd>{scopeEvidenceCount}</dd>
              </div>
              <div>
                <span aria-hidden="true" className={styles.timelineMetricPulse} />
                <dt>Years</dt>
                <dd>{scopeYearCount}</dd>
              </div>
            </dl>
            {scopeActive ? (
              <button
                className={styles.scopeClear}
                data-cursor-label="Clear"
                data-cursor-tone="filter"
                onClick={() => onClearScope()}
                type="button"
              >
                <span aria-hidden="true" className={styles.timelineCurrentSweep} />
                Clear
              </button>
            ) : null}
          </div>

          <div className={styles.navigatorLayout}>
            <nav aria-label="Timeline tracks" className={styles.trackRail}>
              {trackOrder.map((trackId) => {
                const trackItems = getTrackItems(items, trackId);
                const scopedTrackItems = itemsForScope(
                  trackItems,
                  "all",
                  activeYearFilter
                );
                const track = trackMeta[trackId];
                const Icon = track.Icon;
                const isActiveTrack = activeTrackFilter === trackId;

                return (
                  <button
                    aria-pressed={isActiveTrack}
                    className={clsx(
                      styles.trackRailButton,
                      isActiveTrack && styles.trackRailButtonActive
                    )}
                    disabled={scopedTrackItems.length === 0}
                    data-cursor-label={
                      scopedTrackItems.length > 0 ? "Filter" : undefined
                    }
                    data-cursor-tone="filter"
                    key={trackId}
                    onClick={() => onTrackFilterSelect(trackId)}
                    type="button"
                  >
                    <span aria-hidden="true" className={styles.timelineCurrentSweep} />
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    <span>{track.shortLabel}</span>
                    <em>{scopedTrackItems.length}</em>
                  </button>
                );
              })}
            </nav>

            <div className={styles.chronicle}>
              {yearChapters.map((chapter) => {
                const scopedChapterItems = chapter.items.filter((item) =>
                  matchesTimelineScope(
                    item,
                    activeTrackFilter,
                    activeYearFilter
                  )
                );

                return (
                  <section className={styles.yearChapter} key={chapter.year}>
                    <header className={styles.yearChapterHeader}>
                      <span>{chapter.year}</span>
                      <em>
                        {scopeActive
                          ? `${scopedChapterItems.length} shown / ${chapter.items.length}`
                          : `${chapter.items.length} milestone${
                              chapter.items.length === 1 ? "" : "s"
                            }`}
                      </em>
                    </header>

                    <div className={styles.chapterRows}>
                      {chapter.items.map((item) => {
                      const isActive = item.id === activeItemId;
                      const isInScope = matchesTimelineScope(
                        item,
                        activeTrackFilter,
                        activeYearFilter
                      );
                      const priority = priorityForLens(
                        item.viewerPriority,
                        item.importance,
                        activeLens
                      );
                      const evidenceCount =
                        item.relatedProjects.length +
                        item.relatedCertifications.length +
                        item.proofLinks.length;
                      const itemIndex = items.findIndex(
                        (timelineItem) => timelineItem.id === item.id
                      );
                      const track = trackMeta[item.track];
                      const Icon = track.Icon;

                      return (
                        <button
                          aria-controls={TIMELINE_DETAIL_PANEL_ID}
                          aria-label={`${item.title}, ${item.dateLabel}`}
                          aria-pressed={isActive}
                          className={clsx(
                            styles.milestoneRow,
                            scopeActive &&
                              isInScope &&
                              styles.milestoneRowInScope,
                            scopeActive &&
                              !isInScope &&
                              styles.milestoneRowMuted,
                            isActive && styles.milestoneRowActive
                          )}
                          data-active={isActive ? "true" : undefined}
                          data-cursor-label="Read"
                          data-cursor-tone="read"
                          data-timeline-scope={isInScope ? "true" : "false"}
                          data-timeline-id={item.id}
                          key={item.id}
                          onClick={() => handleMilestoneSelect(item, isInScope)}
                          ref={(node) => onRegisterItem(item.id, node)}
                          type="button"
                        >
                          <span aria-hidden="true" className={styles.milestoneLens} />
                          <span aria-hidden="true" className={styles.timelineCurrentSweep} />
                          <span aria-hidden="true" className={styles.milestonePulse} />
                          <span className={styles.milestoneIndex}>
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.milestoneBody}>
                            <span className={styles.milestoneMeta}>
                              <span>
                                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                                {track.shortLabel}
                              </span>
                              <span>{item.dateLabel}</span>
                              <span>{publicPriorityLabel(priority)}</span>
                            </span>
                            <strong>{compactItemLabel(item)}</strong>
                            <span>{item.description}</span>
                          </span>
                          <span className={styles.milestoneEvidence}>
                            <span aria-hidden="true" className={styles.timelineMetricPulse} />
                            <strong>{evidenceCount}</strong>
                            <span>refs</span>
                          </span>
                        </button>
                      );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <div className={styles.shortlistPanel}>
            <p>
              {lensLabels[activeLens]} shortlist
            </p>
            <div className={styles.shortlistGrid}>
              {topItems.map((item) => {
                const track = trackMeta[item.track];
                const Icon = track.Icon;

                return (
                  <button
                    aria-controls={TIMELINE_DETAIL_PANEL_ID}
                    className={clsx(
                      styles.shortlistItem,
                      item.id === activeItemId && styles.shortlistItemActive
                    )}
                    data-cursor-label="Focus"
                    data-cursor-tone="read"
                    key={item.id}
                    onClick={() => onActiveItemChange(item.id)}
                    type="button"
                  >
                    <span>
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                      {publicPriorityLabel(
                        priorityForLens(item.viewerPriority, item.importance, activeLens)
                      )}
                    </span>
                    <strong>{compactItemLabel(item)}</strong>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeItem ? (
          <TimelineDetailPanel
            activeLens={activeLens}
            item={activeItem}
            nextItem={nextItem}
            onSelectItem={onActiveItemChange}
            previousItem={previousItem}
            scrollHalo={
              <motion.div
                aria-hidden="true"
                className={styles.detailScrollHalo}
                style={{ opacity: ambientOpacity, y: inspectorGlowY }}
              />
            }
          />
        ) : null}
      </div>
    </section>
  );
}

function TimelineHero({ items }: { items: readonly TimelineItem[] }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const heroMilestones = [
    "ilink-role-start",
    "telecom-fabric-migration-poc",
    "icore-mdm-entity-resolution"
  ]
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is TimelineItem => Boolean(item));
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    mass: 0.8,
    stiffness: 70
  });
  const contentY = useTransform(smoothProgress, [0, 0.75], [0, -56]);
  const backgroundY = useTransform(smoothProgress, [0, 1], [0, 200]);
  const threadHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const threadOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      aria-labelledby="timeline-hero-title"
      className={styles.previousHero}
      ref={containerRef}
    >
      <div className={styles.previousHeroSticky}>
        <motion.div
          aria-hidden="true"
          className={styles.previousHeroField}
          style={{ y: backgroundY }}
        />

        <motion.div
          className={styles.previousHeroContent}
          style={{ y: contentY }}
        >
          <motion.div
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          >
            <Badge className={styles.previousHeroBadge}>
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
              Professional Timeline
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className={styles.previousHeroTitle}
            id="timeline-hero-title"
          >
            Data systems, <br className="hidden sm:block" /> mapped in motion.
          </motion.h1>

          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className={styles.previousHeroLead}
          >
            A compact career atlas from academic foundations to shipped BI,
            Fabric, Databricks, and AI/data-agent work.
          </motion.p>

          <motion.p
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.48, ease: "easeOut", delay: 0.12 }}
            className={styles.previousHeroArc}
          >
            Education - BI validation - Fabric migration - Databricks data products
          </motion.p>

          <motion.ol
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.48, ease: "easeOut", delay: 0.14 }}
            className={styles.previousHeroMilestones}
            aria-label="Key career milestones"
          >
            {heroMilestones.map((item) => (
              <li key={item.id}>
                <span>{item.dateLabel}</span>
                <strong>{compactItemLabel(item)}</strong>
                <em>{trackMeta[item.track].shortLabel}</em>
              </li>
            ))}
          </motion.ol>

          <motion.nav
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.16 }}
            aria-label="Timeline shortcuts"
            className={styles.previousHeroActions}
          >
            <a
              className={clsx("timeline-enter-link motion-cta", styles.previousHeroPrimary)}
              data-cursor-label="Open"
              data-cursor-tone="open"
              href="#timeline-path"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
                <span>Jump to work timeline</span>
              </span>
            </a>
            <span className={styles.previousHeroCount}>
              {items.length} milestones
            </span>
          </motion.nav>
        </motion.div>

        <motion.div
          className={styles.previousHeroThread}
          style={{ opacity: threadOpacity }}
        >
          <motion.div
            className={styles.previousHeroThreadFill}
            style={{ height: threadHeight }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function TimelineWayfinder({
  activeItemId,
  activeLens,
  activeTrackFilter,
  activeYearFilter,
  items,
  onTrackFilterSelect
}: {
  activeItemId: string;
  activeLens: TimelineLens;
  activeTrackFilter: TimelineTrackFilter;
  activeYearFilter: TimelineYearFilter;
  items: readonly TimelineItem[];
  onTrackFilterSelect: (trackId: TimelineTrackId) => void;
}) {
  const activeItem = items.find((item) => item.id === activeItemId) ?? items[0];

  return (
    <section
      aria-label="Timeline wayfinder"
      className={styles.wayfinder}
      id="timeline-wayfinder"
    >
      <div className={styles.wayfinderInner}>
        <div className={styles.wayfinderStatus}>
          <span>
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p>
              {lensLabels[activeLens]} lens
            </p>
            <strong>
              {activeItem ? compactItemLabel(activeItem) : "Timeline"}
              {activeItem ? (
                <span>
                  {" "}
                  / {activeItem.dateLabel}
                </span>
              ) : null}
            </strong>
          </div>
        </div>

        <div
          aria-label="Timeline track filters"
          className={styles.trackNav}
          role="group"
        >
          {trackOrder.map((trackId) => {
            const trackItems = getTrackItems(items, trackId);
            const scopedTrackItems = itemsForScope(
              trackItems,
              "all",
              activeYearFilter
            );
            const track = trackMeta[trackId];
            const Icon = track.Icon;
            const isActiveTrack = activeTrackFilter === trackId;

            return (
              <button
                aria-pressed={isActiveTrack}
                className={clsx(
                  styles.trackButton,
                  isActiveTrack && styles.trackButtonActive
                )}
                disabled={scopedTrackItems.length === 0}
                data-cursor-label={
                  scopedTrackItems.length > 0 ? "Filter" : undefined
                }
                data-cursor-tone="filter"
                key={trackId}
                onClick={() => onTrackFilterSelect(trackId)}
                type="button"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{track.shortLabel}</span>
                <em>{scopedTrackItems.length}</em>
              </button>
            );
          })}
        </div>

        <nav aria-label="Timeline section jumps" className={styles.wayfinderLinks}>
          <a data-cursor-label="Jump" data-cursor-tone="step" href="#timeline-lens">
            Lens
          </a>
          <a data-cursor-label="Jump" data-cursor-tone="step" href="#timeline-path">
            Navigator
          </a>
        </nav>
      </div>
    </section>
  );
}

export function CareerTimeline() {
  const { clearRole, role, setRole } = useRoleLens();
  const prefersReducedMotion = usePrefersReducedMotion();
  const items = useMemo(() => buildTimelineItems(), []);
  const [activeItemId, setActiveItemId] = useState(items[0]?.id ?? "");
  const [activeTrackFilter, setActiveTrackFilter] =
    useState<TimelineTrackFilter>("all");
  const [activeYearFilter, setActiveYearFilter] =
    useState<TimelineYearFilter>("all");
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeLens: TimelineLens = role ?? "balanced";

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
    (
      itemRefs.current[itemId] ?? document.getElementById("timeline-path")
    )?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }

  function focusFirstScopedItem(
    nextTrackFilter: TimelineTrackFilter,
    nextYearFilter: TimelineYearFilter
  ) {
    const nextScopedItems = itemsForScope(items, nextTrackFilter, nextYearFilter);
    const preferredItem =
      nextScopedItems.find((item) => item.id === activeItemId) ??
      nextScopedItems[0];

    if (preferredItem) {
      handleSelectItem(preferredItem.id);
    }
  }

  function handleTrackFilterSelect(trackId: TimelineTrackId) {
    const nextTrackFilter =
      activeTrackFilter === trackId ? "all" : trackId;

    setActiveTrackFilter(nextTrackFilter);
    focusFirstScopedItem(nextTrackFilter, activeYearFilter);
  }

  function handleYearFilterSelect(year: TimelineYearFilter) {
    const nextYearFilter =
      activeYearFilter === year && year !== "all" ? "all" : year;

    setActiveYearFilter(nextYearFilter);
    focusFirstScopedItem(activeTrackFilter, nextYearFilter);
  }

  function handleClearScope(focusFirstItem = true) {
    setActiveTrackFilter("all");
    setActiveYearFilter("all");

    if (focusFirstItem) {
      focusFirstScopedItem("all", "all");
    }
  }

  useEffect(() => {
    const visibleRows = new Map<string, number>();
    let animationFrame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = (entry.target as HTMLElement).dataset.timelineId;

          if (!itemId) {
            return;
          }

          if (entry.isIntersecting) {
            visibleRows.set(itemId, entry.intersectionRatio);
          } else {
            visibleRows.delete(itemId);
          }
        });

        cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(() => {
          const readingLine = window.innerHeight * 0.46;
          let bestItemId = "";
          let bestScore = Number.NEGATIVE_INFINITY;

          visibleRows.forEach((intersectionRatio, itemId) => {
            const node = itemRefs.current[itemId];

            if (!node || node.dataset.timelineScope === "false") {
              return;
            }

            const rect = node.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            const distance = Math.abs(midpoint - readingLine);
            const score = intersectionRatio * 1000 - distance;

            if (score > bestScore) {
              bestScore = score;
              bestItemId = itemId;
            }
          });

          if (bestItemId) {
            setActiveItemId((currentItemId) =>
              currentItemId === bestItemId ? currentItemId : bestItemId
            );
          }
        });
      },
      {
        rootMargin: "-30% 0px -42% 0px",
        threshold: [0, 0.15, 0.35, 0.65, 1]
      }
    );

    items.forEach((item) => {
      const node = itemRefs.current[item.id];

      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [items]);

  return (
    <main
      className={styles.page}
      data-timeline-cursor-scope="true"
      id="main-content"
      tabIndex={-1}
    >
      <TimelineCursor prefersReducedMotion={prefersReducedMotion} />
      <TimelineHero items={items} />
      <TimelineWayfinder
        activeItemId={activeItemId}
        activeLens={activeLens}
        activeTrackFilter={activeTrackFilter}
        activeYearFilter={activeYearFilter}
        items={items}
        onTrackFilterSelect={handleTrackFilterSelect}
      />

      <section className={styles.commandDeck} id="timeline-explorer">
        <div className={styles.commandGrid}>
          <div id="timeline-lens">
            <LensPanel
              activeLens={activeLens}
              items={items}
              onLensSelect={handleLensSelect}
            />
          </div>
          <TimelineMetrics activeLens={activeLens} items={items} />
        </div>
        <TimelineNarrativeSpine />
      </section>

      {items.length > 0 ? (
        <TimelineAtlas
          activeItemId={activeItemId}
          activeLens={activeLens}
          activeTrackFilter={activeTrackFilter}
          activeYearFilter={activeYearFilter}
          items={items}
          onActiveItemChange={handleSelectItem}
          onClearScope={handleClearScope}
          onRegisterItem={registerItem}
          onTrackFilterSelect={handleTrackFilterSelect}
          onYearFilterSelect={handleYearFilterSelect}
        />
      ) : null}

      <section className={styles.integritySection}>
        <div className={styles.integrityGrid}>
          <div>
            <div className={styles.panelEyebrow}>
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Portfolio integrity
            </div>
            <h2>
              Every track connects back to real education, work, projects, and
              credentials.
            </h2>
            <p>
              The atlas keeps the complete path visible while the inspector
              explains why each point matters.
            </p>
          </div>
          <div className={styles.integrityChecks}>
            {[
              "Education and work chronology",
              "Project and publication references",
              "Credential verification paths"
            ].map((item) => (
              <div key={item}>
                <span aria-hidden="true" className={styles.timelineCurrentSweep} />
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
    </main>
  );
}
