"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue
} from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import {
  ChevronLink,
  ease,
  pad,
  useCinematic,
  useMediaQuery,
  useScrollTo
} from "@/components/story";
import {
  getLensSummary,
  getOrderedProjects,
  lensOptions,
  type LensId
} from "@/components/project-case-file/project-case-file-model";
import { featuredProjectSlugs, projects, type Project } from "@/data";
import { FlagshipStage, flagshipTarget } from "./flagship-stage";
import { ResolveField } from "./resolve-field";
import { ProjectMotif } from "./work-motifs";
import styles from "./work-showcase.module.css";

const projectCatalog: readonly Project[] = projects;
const featured: readonly string[] = featuredProjectSlugs;

function projectFor(slug: string) {
  const project = projectCatalog.find((candidate) => candidate.slug === slug);
  if (!project) throw new Error(`Project "${slug}" is missing from src/data/projects.ts`);
  return project;
}

function shortType(project: Project) {
  return project.type.split("/")[0].trim();
}

function shortDates(project: Project) {
  return /\d{4}/.test(project.dates) ? project.dates.replace(/\s-\s/, " – ") : "—";
}

const lensLabels: Record<LensId, string> = {
  balanced: "Everyone",
  recruiter: "Recruiters",
  engineer: "Engineers",
  leader: "Leaders",
  explorer: "Explorers"
};

/* ─── Index: every case file, with a preview that follows the cursor ─── */

function LensSwitch({ lens, onChange }: { lens: LensId; onChange: (lens: LensId) => void }) {
  return (
    <div className={styles.lens}>
      <span className={styles.lensLabel} id="work-lens-label">Ordered for</span>
      <div className={styles.lensTrack} role="radiogroup" aria-labelledby="work-lens-label">
        {lensOptions.map((option) => {
          const selected = option.id === lens;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={clsx(styles.lensOption, selected && styles.lensOptionActive)}
              onClick={() => onChange(option.id)}
            >
              {selected ? (
                <motion.span
                  layoutId="work-lens-pill"
                  className={styles.lensPill}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span className={styles.lensText}>{lensLabels[option.id]}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.lensNote} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={lens}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease }}
          >
            {getLensSummary(lens)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Preview({
  slug,
  x,
  y
}: {
  slug: string | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const velocity = useVelocity(x);
  const rotate = useTransform(velocity, [-1800, 0, 1800], [-9, 0, 9], { clamp: true });
  const smoothRotate = useSpring(rotate, { stiffness: 180, damping: 22 });
  const project = slug ? projectFor(slug) : null;

  return (
    <motion.div className={styles.preview} style={{ x, y, rotate: smoothRotate }} aria-hidden>
      <AnimatePresence>
        {project ? (
          <motion.div
            key={project.slug}
            className={styles.previewCard}
            initial={{ opacity: 0, scale: 0.86, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease }}
          >
            <div className={styles.previewArt}>
              <ProjectMotif slug={project.slug} active />
            </div>
            <p className={styles.previewSummary}>{project.summary}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function CaseIndex() {
  const [lens, setLens] = useState<LensId>("balanced");
  const [hovered, setHovered] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const followY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const ordered = getOrderedProjects(lens);
  const caseFileCount = ordered.filter((project) => project.status !== "observed").length;
  const reviewCount = ordered.length - caseFileCount;

  const track = (event: PointerEvent<HTMLDivElement>) => {
    const box = listRef.current?.getBoundingClientRect();
    if (!box) return;
    x.set(event.clientX - box.left);
    y.set(event.clientY - box.top);
  };

  return (
    <section className={styles.index} aria-labelledby="work-index-title">
      <motion.div
        className={styles.indexHead}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        <span className={styles.label}>Index</span>
        <h2 id="work-index-title" className={styles.sectionTitle}>
          Every case file.{" "}
          <span className={styles.tail}>
            {caseFileCount} studies{reviewCount ? `, and ${reviewCount} under review` : ""}.
          </span>
        </h2>
        <LensSwitch lens={lens} onChange={setLens} />
      </motion.div>

      <div
        ref={listRef}
        className={styles.indexList}
        onPointerMove={finePointer ? track : undefined}
        onPointerLeave={() => setHovered(null)}
      >
        <LayoutGroup>
          <ol className={styles.rows}>
            {ordered.map((project, index) => {
              const isFeatured = featured.includes(project.slug);
              const underReview = project.status === "observed";

              return (
                <motion.li
                  key={project.slug}
                  layout={reduce ? false : "position"}
                  transition={{ layout: { duration: 0.7, ease } }}
                  className={clsx(styles.rowItem, underReview && styles.rowMuted)}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className={clsx(styles.row, hovered && hovered !== project.slug && styles.rowDimmed)}
                    onPointerEnter={() => setHovered(project.slug)}
                    onFocus={() => setHovered(project.slug)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className={styles.rowIndex}>{pad(index + 1)}</span>
                    <span className={styles.rowTitle}>
                      {project.title}
                      {isFeatured ? <span className={styles.rowTag}>Featured</span> : null}
                      {underReview ? <span className={styles.rowTag}>Under review</span> : null}
                    </span>
                    <span className={styles.rowType}>{shortType(project)}</span>
                    <span className={styles.rowDate}>{shortDates(project)}</span>
                    <span className={styles.rowArrow} aria-hidden>
                      <ArrowUpRight />
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ol>
        </LayoutGroup>

        {finePointer && !reduce ? <Preview slug={hovered} x={followX} y={followY} /> : null}
      </div>
    </section>
  );
}

/* ─── Close ──────────────────────────────────────────────────────────── */

function Close() {
  return (
    <section className={styles.close} aria-labelledby="work-close-title">
      <motion.h2
        id="work-close-title"
        className={styles.closeTitle}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease }}
      >
        Have a system that needs clarity?{" "}
        <span className={styles.tail}>Let&rsquo;s build it properly.</span>
      </motion.h2>
      <motion.div
        className={styles.closeActions}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
      >
        <motion.span whileTap={{ scale: 0.97 }} className={styles.pillWrap}>
          <Link href="/profile" className={styles.pill}>
            Get in touch
            <ArrowRight aria-hidden />
          </Link>
        </motion.span>
        <ChevronLink href="/timeline">See the timeline</ChevronLink>
      </motion.div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export function WorkShowcase({ className }: { className?: string }) {
  const cinematic = useCinematic();
  const router = useRouter();
  const scrollTo = useScrollTo();

  /* Flagships scroll to their explainer; the rest open their case file. */
  const openEntity = (slug: string) => {
    if (cinematic) {
      const target = flagshipTarget(slug);
      if (target !== null) {
        scrollTo(target);
        return;
      }
    }
    const card = document.getElementById(`record-${slug}`);
    if (!card) {
      router.push(`/projects/${slug}`);
      return;
    }
    const headerOffset =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-offset")) || 74;
    scrollTo(card.getBoundingClientRect().top + window.scrollY - headerOffset - 12);
  };

  return (
    <main id="main-content" className={clsx(styles.work, className)}>
      <ResolveField featured={featured} cinematic={cinematic} onSelect={openEntity} />
      <FlagshipStage cinematic={cinematic} />
      <CaseIndex />
      <Close />
    </main>
  );
}
