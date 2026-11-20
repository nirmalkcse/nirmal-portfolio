"use client";

import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type RefObject
} from "react";
import { ChevronLink, CountUp, ease, pad, useScrollTo, useSectionProgress } from "@/components/story";
import { getProjectStatusLabel } from "@/components/project-case-file/project-case-file-model";
import { projects, type Project } from "@/data";
import {
  DIAGRAM_H,
  DIAGRAM_W,
  GoldenRecordDiagram,
  MedallionDiagram,
  ReconcileDiagram
} from "./flagship-diagrams";
import { flagships, type Flagship, type Highlight } from "./flagships";
import { RecognitionSeal } from "@/components/signature/recognition-seal";
import { brickbuilderRecognition } from "@/data/recognition";
import styles from "./flagship-stage.module.css";

/* ─── How each flagship works, in three steps ────────────────────────── */

type Story = {
  steps: readonly [string, string, string];
  Diagram: ComponentType<{ beat: number }>;
};

const stories: Record<string, Story> = {
  "icore-enterprise-mdm-entity-resolution": {
    steps: [
      "Different systems hold different versions of the same person.",
      "iCORE matches the details they agree on.",
      "They merge into one golden record, every value traced to its source."
    ],
    Diagram: GoldenRecordDiagram
  },
  "telecom-fabric-migration-poc": {
    steps: [
      "Three source systems land in the lakehouse, raw, every day.",
      "Changes are captured and history is kept, with CDC and SCD Type 2.",
      "Gold tables come out ready for reporting."
    ],
    Diagram: MedallionDiagram
  },
  "bi-migration-validation-analytics": {
    steps: [
      "Every migrated report is checked against the original.",
      "Values that differ are flagged and traced to their cause.",
      "Fixed until every number agrees."
    ],
    Diagram: ReconcileDiagram
  }
};

const COUNT = flagships.length;
const BEATS = 3;

export const FLAGSHIP_STAGE_ID = "work-flagships";

function projectFor(slug: string) {
  const catalog: readonly Project[] = projects;
  const project = catalog.find((candidate) => candidate.slug === slug);
  if (!project) throw new Error(`Project "${slug}" is missing from src/data/projects.ts`);
  return project;
}

function shortDates(project: Project) {
  return project.dates.replace(/\s-\s/, " – ");
}

/** Scroll offset for a flagship's step, so the stepper and hero can jump. */
export function flagshipTarget(slug: string, beat = 0) {
  const section = document.getElementById(FLAGSHIP_STAGE_ID);
  const index = flagships.findIndex((flagship) => flagship.slug === slug);
  if (!section || index === -1) return null;
  const top = section.getBoundingClientRect().top + window.scrollY;
  const travel = section.offsetHeight - window.innerHeight;
  return top + ((index + (beat + 0.5) / BEATS) / COUNT) * travel;
}

function useFit(ref: RefObject<HTMLElement | null>) {
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const box = node.getBoundingClientRect();
      setFit(Math.min(1.45, box.width / DIAGRAM_W, box.height / DIAGRAM_H));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return fit;
}

/* ─── Parts ──────────────────────────────────────────────────────────── */

function HighlightValue({ highlight }: { highlight: Highlight }) {
  if (highlight.kind === "text") return <span className={styles.outcomeText}>{highlight.value}</span>;
  if (highlight.kind === "range") {
    return (
      <span className={styles.outcomeNumber}>
        <CountUp value={highlight.from} />
        <span className={styles.outcomeSoft} aria-label="to">–</span>
        <CountUp value={highlight.to} />
      </span>
    );
  }
  return (
    <span className={styles.outcomeNumber}>
      <CountUp value={highlight.value} />
      {highlight.suffix ? <span className={styles.outcomeSoft}>{highlight.suffix}</span> : null}
    </span>
  );
}

function Copy({
  flagship,
  index,
  beat,
  onStep
}: {
  flagship: Flagship;
  index: number;
  beat: number;
  onStep?: (beat: number) => void;
}) {
  const project = projectFor(flagship.slug);
  const story = stories[flagship.slug];

  return (
    <div className={styles.copy}>
      <p className={styles.meta}>
        <span>
          {pad(index + 1)} / {pad(COUNT)}
        </span>
        <span>{getProjectStatusLabel(project.status)}</span>
        <span>{shortDates(project)}</span>
      </p>
      <h3 className={clsx(styles.name, flagship.name.length > 12 && styles.nameLong)}>{flagship.name}</h3>
      <p className={styles.lede}>{flagship.lede}</p>
      {flagship.slug === brickbuilderRecognition.projectSlug ? (
        <RecognitionSeal className={styles.seal} />
      ) : null}

      <ol className={styles.steps}>
        {story.steps.map((step, stepIndex) => {
          const state = stepIndex === beat ? "current" : stepIndex < beat ? "done" : "next";
          const content = (
            <>
              <span className={styles.stepNumber}>{stepIndex + 1}</span>
              <span className={styles.stepText}>{step}</span>
            </>
          );
          return (
            <li key={step} className={clsx(styles.step, styles[`step_${state}`])}>
              {onStep ? (
                <button type="button" className={styles.stepButton} onClick={() => onStep(stepIndex)}>
                  {content}
                </button>
              ) : (
                <span className={styles.stepButton}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>

      <dl className={styles.outcomes}>
        {flagship.highlights.map((highlight) => (
          <div key={highlight.label} className={styles.outcome}>
            <dt>{highlight.label}</dt>
            <dd>
              <HighlightValue highlight={highlight} />
            </dd>
          </div>
        ))}
      </dl>

      <ChevronLink href={`/projects/${project.slug}`}>Read the case study</ChevronLink>
    </div>
  );
}

function Visual({ slug, beat, fitRef }: { slug: string; beat: number; fitRef: RefObject<HTMLDivElement | null> }) {
  const fit = useFit(fitRef);
  const { Diagram } = stories[slug];
  return (
    <div ref={fitRef} className={styles.visual}>
      <div className={styles.canvas} style={{ "--fit": fit } as CSSProperties}>
        <Diagram beat={beat} />
      </div>
    </div>
  );
}

function StepperItem({
  flagship,
  index,
  current,
  progress,
  onSelect
}: {
  flagship: Flagship;
  index: number;
  current: boolean;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const fill = useTransform(progress, (p) => Math.min(1, Math.max(0, p * COUNT - index)));
  return (
    <button
      type="button"
      className={clsx(styles.tab, current && styles.tabCurrent)}
      aria-current={current ? "step" : undefined}
      onClick={onSelect}
    >
      {flagship.name}
      <span className={styles.tabTrack} aria-hidden>
        <motion.span className={styles.tabFill} style={{ scaleX: fill }} />
      </span>
    </button>
  );
}

/* ─── Pinned ─────────────────────────────────────────────────────────── */

function FlagshipStagePinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();
  const progress = useSectionProgress(sectionRef, ["start start", "end end"]);
  const [state, setState] = useState({ project: 0, beat: 0 });

  useMotionValueEvent(progress, "change", (p) => {
    const scaled = Math.min(COUNT - 0.0001, Math.max(0, p * COUNT));
    const project = Math.floor(scaled);
    const beat = Math.min(BEATS - 1, Math.floor((scaled - project) * BEATS));
    setState((current) => (current.project === project && current.beat === beat ? current : { project, beat }));
  });

  const flagship = flagships[state.project];
  const jump = (index: number, beat = 0) => {
    const target = flagshipTarget(flagships[index].slug, beat);
    if (target !== null) scrollTo(target);
  };

  return (
    <section
      ref={sectionRef}
      id={FLAGSHIP_STAGE_ID}
      className={styles.pinned}
      style={{ height: `${COUNT * 170 + 100}vh` }}
      aria-labelledby="flagships-title"
    >
      <div className={styles.stage}>
        <h2 id="flagships-title" className={styles.srOnly}>
          Flagship case studies
        </h2>
        <nav className={styles.tabs} aria-label="Flagship case studies">
          {flagships.map((item, index) => (
            <StepperItem
              key={item.slug}
              flagship={item}
              index={index}
              current={index === state.project}
              progress={progress}
              onSelect={() => jump(index)}
            />
          ))}
        </nav>

        <div className={styles.body}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={flagship.slug}
              className={styles.copySlot}
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease }}
            >
              <Copy
                flagship={flagship}
                index={state.project}
                beat={state.beat}
                onStep={(beat) => jump(state.project, beat)}
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={flagship.slug}
              className={styles.visualSlot}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease }}
            >
              <Visual slug={flagship.slug} beat={state.beat} fitRef={fitRef} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─── Static: small screens and reduced motion ───────────────────────── */

function StaticItem({ flagship, index }: { flagship: Flagship; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(reduce ? BEATS - 1 : 0);

  /* Steps play on their own while the item is on screen. */
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setBeat((current) => (current + 1) % BEATS), 2600);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return (
    <motion.div
      ref={ref}
      id={`record-${flagship.slug}`}
      className={styles.staticItem}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease }}
    >
      <div className={styles.staticVisual}>
        <Visual slug={flagship.slug} beat={reduce ? BEATS - 1 : beat} fitRef={fitRef} />
      </div>
      <Copy flagship={flagship} index={index} beat={reduce ? BEATS - 1 : beat} />
    </motion.div>
  );
}

function FlagshipStageStatic() {
  return (
    <section id={FLAGSHIP_STAGE_ID} className={styles.static} aria-labelledby="flagships-title">
      <h2 id="flagships-title" className={styles.staticTitle}>
        Three flagships. <span className={styles.tail}>How each one works.</span>
      </h2>
      {flagships.map((flagship, index) => (
        <StaticItem key={flagship.slug} flagship={flagship} index={index} />
      ))}
    </section>
  );
}

export function FlagshipStage({ cinematic }: { cinematic: boolean }) {
  return cinematic ? <FlagshipStagePinned /> : <FlagshipStageStatic />;
}
