"use client";

import Link from "next/link";
import {
  ArrowRight,
  Database,
  FileText,
  Layers,
  SlidersHorizontal,
  Workflow
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  type Variants
} from "framer-motion";
import { useRoleLens } from "@/context/role-lens-context";
import type { Project } from "@/data";
import {
  getCaseFileMetrics,
  getFeaturedRank,
  getLensSummary,
  getOrderedProjects,
  getPriorityLabel,
  getProjectProofStats,
  lensOptions,
  type LensId
} from "./project-case-file-model";
import {
  EvidenceNoteCard,
  PublicSafetyNote,
  StackTags,
  StatusBadge
} from "./project-case-file-primitives";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

type NavDropletTarget = {
  center: number;
  id: string;
  left: number;
  top: number;
  width: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function ProjectCaseFilesIndex() {
  const { clearRole, role, setRole } = useRoleLens();
  const [hoveredLens, setHoveredLens] = useState<LensId | null>(null);
  const activeLens: LensId = role ?? "balanced";
  const orderedProjects = useMemo(
    () => getOrderedProjects(activeLens),
    [activeLens]
  );
  const metrics = getCaseFileMetrics(orderedProjects);
  const primaryProjects = orderedProjects.filter(
    (project) => project.status !== "observed"
  );
  const observedProjects = orderedProjects.filter(
    (project) => project.status === "observed"
  );

  const handleLensChange = useCallback((lens: LensId) => {
    if (lens === "balanced") {
      clearRole();
      return;
    }
    setRole(lens);
  }, [clearRole, setRole]);

  // Drag state and refs
  const navRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef(new Map<string, HTMLButtonElement>());
  const dropletDragStart = useRef<{
    activeTarget: NavDropletTarget;
    x: number;
  } | null>(null);
  const dropletX = useMotionValue(0);
  const [isDraggingDroplet, setIsDraggingDroplet] = useState(false);
  const [dropletDragConstraints, setDropletDragConstraints] = useState({
    left: 0,
    right: 0
  });
  const [dropletTargets, setDropletTargets] = useState<NavDropletTarget[]>([]);
  const [activeDroplet, setActiveDroplet] = useState<NavDropletTarget | null>(null);

  const measureDropletTargets = useCallback(() => {
    const nextTargets: NavDropletTarget[] = [];
    lensOptions.forEach((option) => {
      const button = navLinkRefs.current.get(option.id);
      if (!button || button.offsetParent === null || button.offsetWidth === 0) return;
      nextTargets.push({
        center: button.offsetLeft + button.offsetWidth / 2,
        id: option.id,
        left: button.offsetLeft,
        top: button.offsetTop,
        width: button.offsetWidth
      });
    });

    const activeTarget = nextTargets.find((target) => target.id === activeLens) ?? null;
    const navWidth = navRef.current?.scrollWidth ?? (activeTarget ? activeTarget.left + activeTarget.width : 0);

    setDropletTargets(nextTargets);
    setActiveDroplet(activeTarget);
    setDropletDragConstraints(
      activeTarget
        ? {
            left: -activeTarget.left,
            right: navWidth - activeTarget.left - activeTarget.width
          }
        : { left: 0, right: 0 }
    );
    dropletX.set(0);
  }, [dropletX, activeLens]);

  useEffect(() => {
    measureDropletTargets();
    const nav = navRef.current;
    if (!nav) return;
    const resizeObserver = new ResizeObserver(measureDropletTargets);
    resizeObserver.observe(nav);
    navLinkRefs.current.forEach((button) => resizeObserver.observe(button));
    window.addEventListener("resize", measureDropletTargets);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureDropletTargets);
    };
  }, [measureDropletTargets]);

  const moveDropletDrag = useCallback(
    (clientX: number) => {
      const dragStart = dropletDragStart.current;
      if (!dragStart) return;
      dropletX.set(clamp(clientX - dragStart.x, dropletDragConstraints.left, dropletDragConstraints.right));
    },
    [dropletDragConstraints, dropletX]
  );

  const commitDropletDrag = useCallback(
    (clientX: number) => {
      const dragStart = dropletDragStart.current;
      if (!dragStart || dropletTargets.length === 0) return;
      const dragOffset = clamp(clientX - dragStart.x, dropletDragConstraints.left, dropletDragConstraints.right);
      const releaseCenter = dragStart.activeTarget.center + dragOffset;
      const closestTarget = dropletTargets.reduce((closest, target) => {
        const closestDistance = Math.abs(closest.center - releaseCenter);
        const targetDistance = Math.abs(target.center - releaseCenter);
        return targetDistance < closestDistance ? target : closest;
      });

      dropletDragStart.current = null;
      dropletX.set(0);
      setIsDraggingDroplet(false);

      if (closestTarget.id !== dragStart.activeTarget.id) {
        handleLensChange(closestTarget.id as LensId);
      }
    },
    [dropletDragConstraints, dropletTargets, dropletX, handleLensChange]
  );

  const startDropletDrag = useCallback(
    (clientX: number) => {
      if (!activeDroplet) return;
      dropletDragStart.current = { activeTarget: activeDroplet, x: clientX };
      setIsDraggingDroplet(true);
    },
    [activeDroplet]
  );

  useEffect(() => {
    if (!isDraggingDroplet) return;
    const handleMouseMove = (e: MouseEvent) => moveDropletDrag(e.clientX);
    const handleMouseUp = (e: MouseEvent) => commitDropletDrag(e.clientX);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [commitDropletDrag, isDraggingDroplet, moveDropletDrag]);

  const handleDropletPointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!activeDroplet) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    startDropletDrag(event.clientX);
  };
  const handleDropletPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => moveDropletDrag(event.clientX);
  const handleDropletPointerUp = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    commitDropletDrag(event.clientX);
  };
  const handleDropletPointerCancel = () => {
    dropletDragStart.current = null;
    dropletX.set(0);
    setIsDraggingDroplet(false);
  };
  const handleDropletMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    startDropletDrag(event.clientX);
  };

  return (
    <main
      className="min-h-screen overflow-hidden px-[var(--layout-gutter)] pb-10 pt-[calc(var(--site-header-offset)+var(--space-5))]"
      id="main-content"
      tabIndex={-1}
    >
      <motion.section
        variants={containerVariants}
        initial={false}
        animate="show"
        className="mx-auto flex max-w-[var(--layout-wide-max)] flex-col gap-10 relative"
      >
        <motion.header variants={itemVariants} className="relative grid gap-8 border-b border-[var(--border-subtle)] pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border-gold)] to-transparent opacity-80" />

          <div className="max-w-4xl relative z-10">
            <p className="font-mono text-[0.8rem] uppercase tracking-[0.15em] text-[var(--color-antique-gold)]">
              Project case studies
            </p>
            <h1 className="editorial-title editorial-title--section mt-5 max-w-3xl">
              Work explained through <br />
              <em>systems, decisions, and outcomes</em><span className="editorial-accent">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Each study explains the problem, build approach, decisions,
              outcome, and what can be shared publicly.
            </p>
          </div>

          <ProjectMetrics metrics={metrics} />
        </motion.header>

        <motion.section
          variants={itemVariants}
          aria-label="Project ordering focus"
          className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-luxury)] bg-[var(--surface-luxury-paper)] p-5 shadow-[var(--shadow-luxury-float)] backdrop-blur-md"
        >
          {/* Subtle noise/gradient background for the lens container */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-antique-gold)]/10 via-transparent to-[var(--color-signal-blue)]/5 opacity-40 pointer-events-none" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] lg:items-center relative z-10">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--color-antique-gold)] mb-4">
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Reviewer view
              </div>
              <div
                className="group relative flex flex-wrap gap-2 rounded-[var(--radius-control)] bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)] p-1.5"
                role="group"
                ref={navRef}
                data-dragging={isDraggingDroplet ? "true" : undefined}
              >
                {activeDroplet ? (
                  <motion.span
                    aria-hidden="true"
                    animate={{
                      left: activeDroplet.left,
                      top: activeDroplet.top,
                      opacity: 1,
                      width: activeDroplet.width
                    }}
                    className="absolute z-0 h-9 cursor-grab rounded-[var(--radius-control)] border border-[var(--border-luxury)] bg-[var(--color-paper)] shadow-sm active:cursor-grabbing"
                    draggable={false}
                    onMouseDown={handleDropletMouseDown}
                    onPointerCancel={handleDropletPointerCancel}
                    onPointerDown={handleDropletPointerDown}
                    onPointerMove={handleDropletPointerMove}
                    onPointerUp={handleDropletPointerUp}
                    style={{ x: dropletX }}
                    transition={{ type: "spring", bounce: 0.22, duration: 0.55 }}
                  />
                ) : null}

                {lensOptions.map((option) => {
                  const isActive = activeLens === option.id;
                  const isHovered = hoveredLens === option.id;
                  return (
                    <button
                      key={option.id}
                      aria-pressed={isActive}
                      onClick={() => handleLensChange(option.id)}
                      onPointerEnter={() => setHoveredLens(option.id)}
                      onPointerLeave={() => setHoveredLens(null)}
                      className={`group-data-[dragging=true]:pointer-events-none relative min-h-9 rounded-[var(--radius-control)] px-4 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-[var(--color-ink-strong)]"
                          : isHovered
                          ? "text-[var(--color-ink-strong)]"
                          : "text-[var(--color-ink-muted)]"
                      }`}
                      type="button"
                      ref={(node) => {
                        if (node) {
                          navLinkRefs.current.set(option.id, node);
                        } else {
                          navLinkRefs.current.delete(option.id);
                        }
                      }}
                    >
                      {!isActive && isHovered && (
                        <motion.div
                          layoutId="hoverLensBackground"
                          className="absolute inset-0 rounded-[var(--radius-control)] bg-[var(--surface-panel-hover)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="rounded-[var(--radius-panel)] border border-[color-mix(in_srgb,var(--color-antique-gold)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-antique-gold)_10%,transparent)] px-5 py-4 text-sm leading-relaxed text-[var(--color-ink-base)] shadow-inner">
              {getLensSummary(activeLens)}
            </p>
          </div>
        </motion.section>

        <motion.section
          className="grid gap-6 xl:grid-cols-3"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {primaryProjects.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="h-full"
              >
                <ProjectCard activeLens={activeLens} project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {observedProjects.length > 0 ? (
          <motion.section variants={itemVariants} className="border-t border-[var(--border-subtle)] pt-10">
            <div className="mb-6 grid gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                <FileText aria-hidden="true" className="h-4 w-4" />
                Under review
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Repository notes stay separate from finished case studies until the README,
                screenshots, architecture, and portfolio angle are strong enough for public review.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <AnimatePresence initial={false} mode="popLayout">
                {observedProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="h-full"
                  >
                    <ProjectCard activeLens={activeLens} project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        ) : null}
      </motion.section>
    </main>
  );
}

function ProjectMetrics({ metrics }: { metrics: readonly { label: string; value: string; detail: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 relative z-10">
      {metrics.map((metric) => (
        <motion.div
          whileHover={{ y: -2 }}
          className="group relative overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-luxury)] bg-[var(--surface-luxury-paper)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md transition-colors hover:border-[var(--color-antique-gold)] hover:bg-[color-mix(in_srgb,var(--color-antique-gold)_10%,transparent)] hover:shadow-[var(--shadow-float)]"
          key={metric.label}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-antique-gold)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
          <dt className="font-mono text-[0.6875rem] uppercase tracking-wider text-[var(--color-ink-muted)] group-hover:text-[var(--color-antique-gold)] transition-colors">
            {metric.label}
          </dt>
          <dd className="mt-3 text-3xl font-semibold tracking-[0] text-[var(--color-ink-strong)]">
            {metric.value}
          </dd>
          <dd className="mt-2 text-xs text-[var(--color-ink-muted)] leading-relaxed">
            {metric.detail}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}

function ProjectCard({
  activeLens,
  project
}: {
  activeLens: LensId;
  project: Project;
}) {
  const featuredRank = getFeaturedRank(project);
  const primaryEvidenceNote = project.evidenceNotes?.[0] ?? null;
  const isUnderReview = project.status === "observed";
  const proofStats = getProjectProofStats(project);
  const prefersReducedMotion = useReducedMotion();
  const readyMedia = project.media.length - proofStats.pendingMedia;

  const handleCardPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tiltX = (50 - pointerY) * 0.035;
      const tiltY = (pointerX - 50) * 0.028;

      event.currentTarget.style.setProperty("--case-card-x", `${pointerX.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--case-card-y", `${pointerY.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--case-card-tilt-x", `${tiltX.toFixed(3)}deg`);
      event.currentTarget.style.setProperty("--case-card-tilt-y", `${tiltY.toFixed(3)}deg`);
    },
    [prefersReducedMotion]
  );

  const resetCardPresence = useCallback((target: HTMLElement) => {
    target.style.setProperty("--case-card-x", "50%");
    target.style.setProperty("--case-card-y", "38%");
    target.style.setProperty("--case-card-tilt-x", "0deg");
    target.style.setProperty("--case-card-tilt-y", "0deg");
  }, []);

  const handleCardPointerLeave = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      resetCardPresence(event.currentTarget);
    },
    [resetCardPresence]
  );

  const handleCardFocus = useCallback((event: React.FocusEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--case-card-x", "72%");
    event.currentTarget.style.setProperty("--case-card-y", "31%");
  }, []);

  const handleCardBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      resetCardPresence(event.currentTarget);
    },
    [resetCardPresence]
  );

  return (
    <article
      className="motion-case-card case-file-card group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-case-file)] border border-[var(--border-luxury)] bg-[var(--surface-case-file)] shadow-[var(--shadow-surface)] transition-all duration-[400ms] ease-out hover:border-[var(--color-antique-gold)] hover:shadow-[var(--shadow-luxury-float)] hover:-translate-y-1"
      onBlur={handleCardBlur}
      onFocus={handleCardFocus}
      onPointerLeave={handleCardPointerLeave}
      onPointerMove={handleCardPointerMove}
      style={
        {
          "--case-card-x": "50%",
          "--case-card-y": "38%",
          "--case-card-tilt-x": "0deg",
          "--case-card-tilt-y": "0deg"
        } as React.CSSProperties
      }
    >
      {/* Top subtle inner glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brass)] to-transparent opacity-30 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Dynamic Glow Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--color-antique-gold)]/10 via-transparent to-[var(--color-champagne)]/10 opacity-30 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      <span aria-hidden="true" className="case-file-inspection-lens" />
      <span aria-hidden="true" className="case-file-depth-field" />
      <span aria-hidden="true" className="case-file-active-rail" />
      <span aria-hidden="true" className="case-file-corner-glint case-file-corner-glint--top" />
      <span aria-hidden="true" className="case-file-corner-glint case-file-corner-glint--bottom" />

      <div aria-hidden="true" className="case-file-status-stack">
        <span
          className="case-file-status-bead"
          data-state={proofStats.verifiedLinks > 0 ? "live" : "quiet"}
          style={{ "--case-bead-delay": "0ms" } as React.CSSProperties}
        />
        <span
          className="case-file-status-bead"
          data-state={readyMedia > 0 ? "live" : "quiet"}
          style={{ "--case-bead-delay": "160ms" } as React.CSSProperties}
        />
        <span
          className="case-file-status-bead"
          data-state={project.relatedCredentials.length > 0 ? "live" : "quiet"}
          style={{ "--case-bead-delay": "320ms" } as React.CSSProperties}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-6 p-6 pl-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-[var(--color-ink-muted)] group-hover:text-[var(--color-antique-gold)] transition-colors duration-300">
              {getPriorityLabel(project, activeLens)}
            </p>
            {featuredRank ? (
              <p className="mt-1 text-xs text-[var(--color-antique-gold)] font-medium">
                Featured case study {featuredRank}
              </p>
            ) : null}
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-widest text-[var(--color-ink-muted)]">
            {project.dates} <span className="mx-1.5 opacity-50">/</span> {project.type}
          </p>
          <h2 className="mt-3 text-[1.4rem] font-[var(--font-display)] font-semibold leading-snug tracking-[0] text-[var(--color-ink-strong)] group-hover:text-[var(--color-antique-gold)] transition-colors duration-500">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-base)]">
            {project.summary}
          </p>
        </div>

        <CaseEvidenceProfile
          isUnderReview={isUnderReview}
          proofStats={proofStats}
          project={project}
        />

        <div className="grid gap-5 mt-auto">
          <StoryRow icon={<Database aria-hidden="true" className="h-3.5 w-3.5" />} label="Problem">
            {project.problem}
          </StoryRow>
          <StoryRow icon={<Workflow aria-hidden="true" className="h-3.5 w-3.5" />} label="System">
            {project.architecture}
          </StoryRow>
          <StoryRow icon={<Layers aria-hidden="true" className="h-3.5 w-3.5" />} label="Impact">
            {project.impact}
          </StoryRow>
        </div>

        <StackTags limit={4} project={project} />
      </div>

      <div className="relative z-10 flex flex-col gap-6 border-t border-[var(--border-luxury)] bg-[color-mix(in_srgb,var(--surface-page)_60%,transparent)] p-6 pl-7 backdrop-blur-sm">
        {primaryEvidenceNote ? (
          <EvidenceNoteCard compact note={primaryEvidenceNote} />
        ) : null}
        <PublicSafetyNote project={project} />
        <Link
          className="case-file-handoff-link group/link mt-2 inline-flex w-full items-center justify-center gap-3 rounded-[var(--radius-control)] border border-[var(--border-luxury)] bg-[color-mix(in_srgb,var(--color-antique-gold)_8%,transparent)] px-6 py-3 text-sm font-semibold text-[var(--color-ink-strong)] transition-all duration-300 hover:border-[var(--color-antique-gold)] hover:bg-[color-mix(in_srgb,var(--color-antique-gold)_15%,transparent)] hover:shadow-[var(--shadow-gold-trace)]"
          href={`/projects/${project.slug}`}
        >
          <span aria-hidden="true" className="case-file-handoff-spark" />
          <span className="relative z-10">{isUnderReview ? "Open review note" : "Open case study"}</span>
          <ArrowRight
            aria-hidden="true"
            className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

function CaseEvidenceProfile({
  isUnderReview,
  proofStats,
  project
}: {
  isUnderReview: boolean;
  proofStats: ReturnType<typeof getProjectProofStats>;
  project: Project;
}) {
  const readyMedia = project.media.length - proofStats.pendingMedia;
  const mediaValue =
    readyMedia > 0
      ? `${readyMedia} ready`
      : project.media.length > 0
      ? `${proofStats.pendingMedia} queued`
      : "None";
  const linkDetail =
    proofStats.pendingLinks > 0
      ? `${proofStats.pendingLinks} pending`
      : proofStats.verifiedLinks > 0
      ? "verified"
      : "approval gate";
  const profileSignals = [
    {
      detail: isUnderReview ? "curation queue" : "open file",
      label: "Route",
      value: isUnderReview ? "Review" : "Case"
    },
    {
      detail: linkDetail,
      label: "Public links",
      value: `${proofStats.verifiedLinks} live`
    },
    {
      detail: `${project.media.length} planned assets`,
      label: "Visual proof",
      value: mediaValue
    },
    {
      detail: `${project.relatedCredentials.length} credentials / ${proofStats.evidenceNoteCount} notes`,
      label: "Depth",
      value: `${project.relatedSkills.length} skills`
    }
  ] as const;

  return (
    <dl className="case-file-evidence-grid grid grid-cols-2 overflow-hidden rounded-[var(--radius-control)] border border-[var(--border-luxury)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-antique-gold)_15%,transparent),color-mix(in_srgb,var(--surface-panel)_72%,transparent)_42%,color-mix(in_srgb,var(--color-signal-blue)_10%,transparent))] shadow-inner">
      {profileSignals.map((signal, index) => (
        <div
          className="case-file-signal-cell relative min-h-[5.25rem] border-r border-t border-[color-mix(in_srgb,var(--color-antique-gold)_15%,transparent)] px-3 py-3 first:border-t-0 odd:border-r even:border-r-0 [&:nth-child(2)]:border-t-0"
          key={signal.label}
        >
          <span aria-hidden="true" className="case-file-cell-ping" />
          <span
            aria-hidden="true"
            className={`absolute inset-x-3 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-antique-gold)_40%,transparent),transparent)] ${
              index < 2 ? "opacity-0" : "opacity-70"
            }`}
          />
          <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-[var(--color-ink-muted)]">
            {signal.label}
          </dt>
          <dd className="mt-2 text-[1.02rem] font-semibold leading-tight text-[var(--color-ink-strong)]">
            {signal.value}
          </dd>
          <dd className="mt-1 text-[0.65rem] leading-4 text-[var(--color-ink-base)]">
            {signal.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StoryRow({
  children,
  icon,
  label
}: {
  children: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="group/row flex flex-col items-start gap-1">
      <div className="inline-flex items-center gap-1.5 rounded-md bg-[color-mix(in_srgb,var(--color-antique-gold)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-antique-gold)_25%,transparent)] px-2 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-widest text-[var(--color-antique-gold)] transition-colors duration-300 group-hover/row:bg-[color-mix(in_srgb,var(--color-antique-gold)_20%,transparent)] group-hover/row:border-[color-mix(in_srgb,var(--color-antique-gold)_45%,transparent)]">
        {icon}
        {label}
      </div>
      <p className="text-[0.85rem] leading-relaxed text-[var(--color-ink-base)] pl-1">
        {children}
      </p>
    </div>
  );
}
