"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue
} from "framer-motion";
import {
  createRef,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject
} from "react";
import { ChevronLink, CountUp, ease, pad, useCinematic, useScrollTo, useSectionProgress } from "@/components/story";
import {
  ELEMENT_ORDER,
  ELEMENT_PALETTE,
  chapters,
  credentialList,
  hero,
  outro,
  segues,
  type Chapter,
  type ElementKey,
  type Figure,
  type Segue
} from "./journey-model";
import { EarthStrata } from "./objects/earth-strata";
import { WaterConfluence } from "./objects/water-confluence";
import { FireForge } from "./objects/fire-forge";
import { AirUpdraft } from "./objects/air-updraft";
import { EtherConstellation } from "./objects/ether-constellation";
import { useElementProgress } from "./use-element-progress";
import { useElementalSound } from "./use-elemental-sound";
import styles from "./journey-story.module.css";

const ElementalWorld = dynamic(
  () => import("./elemental-world").then((module) => module.ElementalWorld),
  { ssr: false }
);

const objects: Record<ElementKey, (props: { tone?: "light" | "dark" }) => ReactNode> = {
  earth: EarthStrata,
  water: WaterConfluence,
  fire: FireForge,
  air: AirUpdraft,
  ether: EtherConstellation
};

const CHAPTER_HEIGHT = 330;
const SEGUE_HEIGHT = 180;

/* ─── Small parts ────────────────────────────────────────────────────── */

/** A number that rises with the scroll, so the figure lands as the chapter does. */
function ScrubNumber({
  progress,
  value,
  decimals = 0
}: {
  progress: MotionValue<number>;
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const scrubbed = useTransform(progress, [0.06, 0.26], [0, value]);

  useMotionValueEvent(scrubbed, "change", (latest) => {
    if (ref.current) ref.current.textContent = latest.toFixed(decimals);
  });

  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = scrubbed.get().toFixed(decimals);
  }, [scrubbed, decimals]);

  return <span ref={ref}>{(0).toFixed(decimals)}</span>;
}

function FigureValue({ figure, progress }: { figure: Figure; progress: MotionValue<number> | null }) {
  const arrowAt = figure.parts.indexOf("→");

  return (
    <span className={styles.figureValue}>
      {figure.parts.map((part, index) => {
        if (typeof part === "number") {
          return (
            <span key={index} className={arrowAt > index ? styles.figureBefore : undefined}>
              {progress ? (
                <ScrubNumber progress={progress} value={part} decimals={figure.decimals} />
              ) : (
                <CountUp value={part} decimals={figure.decimals} />
              )}
            </span>
          );
        }
        return (
          <span key={index} className={styles.figureJoin} aria-label={part === "–" ? "to" : undefined}>
            {part}
          </span>
        );
      })}
      {figure.suffix ? <span className={styles.figureSuffix}>{figure.suffix}</span> : null}
    </span>
  );
}

function Figures({ figures, progress }: { figures: readonly Figure[]; progress: MotionValue<number> | null }) {
  return (
    <dl className={styles.figures}>
      {figures.map((figure) => (
        <div key={figure.label} className={styles.figure}>
          <dt className={styles.figureLabel}>{figure.label}</dt>
          <dd>
            <FigureValue figure={figure} progress={progress} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** One part of a chapter, arriving a beat after the one before it. */
function Reveal({
  progress,
  order,
  className,
  children,
  scale = false
}: {
  progress: MotionValue<number>;
  order: number;
  className?: string;
  children: ReactNode;
  scale?: boolean;
}) {
  const start = 0.02 + order * 0.022;
  const opacity = useTransform(progress, [start, start + 0.12, 0.84, 0.97], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.12, 0.84, 0.97], [36, 0, 0, -36]);
  const blurAmount = useTransform(progress, [start, start + 0.12, 0.84, 0.97], [12, 0, 0, 12]);
  const filter = useMotionTemplate`blur(${blurAmount}px)`;
  const scaleValue = useTransform(progress, [start, start + 0.12, 0.84, 0.97], [0.96, 1, 1, 0.98]);

  return (
    <motion.div className={className} style={{ opacity, y, filter, scale: scale ? scaleValue : 1 }}>
      {children}
    </motion.div>
  );
}

function ElementName({ chapter }: { chapter: Chapter }) {
  return (
    <h2 className={styles.elementName}>
      {chapter.name}
      <span className={styles.accent}>.</span>{" "}
      <em>{chapter.landform}</em>
    </h2>
  );
}

/** A chapter part: scroll-revealed when pinned, in-view revealed when stacked. */
function Part({
  progress,
  order,
  className,
  children
}: {
  progress: MotionValue<number> | null;
  order: number;
  className?: string;
  children: ReactNode;
}) {
  if (progress) {
    return (
      <Reveal progress={progress} order={order} className={className}>
        {children}
      </Reveal>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay: order * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

/* The dossier: what was built, with what, proven how. */
function Dossier({ chapter }: { chapter: Chapter }) {
  const { dossier } = chapter;
  const tone = chapter.tone === "dark" ? "dark" : "light";
  return (
    <div className={styles.dossier}>
      <div className={styles.dossierMain}>
        <span className={styles.dossierLabel}>Built</span>
        <ul className={styles.dossierList}>
          {dossier.built.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={styles.dossierSide}>
        <span className={styles.dossierLabel}>Stack</span>
        <ul className={styles.chips} aria-label="Stack">
          {dossier.stack.slice(0, 9).map((item) => (
            <li key={item} className={styles.chip}>
              {item}
            </li>
          ))}
        </ul>
        <span className={styles.dossierLabel}>Proof</span>
        <ul className={styles.proofList}>
          {dossier.proof.map((proof) => (
            <li key={proof.label} className={styles.proofItem}>
              <span className={styles.proofMark} aria-hidden="true" />
              <span className={styles.proofText}>
                {proof.href ? (
                  proof.href.startsWith("/") ? (
                    <Link href={proof.href} className={styles.proofLink}>
                      {proof.label}
                    </Link>
                  ) : (
                    <a href={proof.href} target="_blank" rel="noreferrer" className={styles.proofLink}>
                      {proof.label}
                      <span className={styles.proofVerify}> · verify</span>
                    </a>
                  )
                ) : (
                  <span>{proof.label}</span>
                )}
                <small>{proof.detail}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">Tone {tone}</span>
    </div>
  );
}

function ChapterMeta({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <p className={styles.meta}>
      <span className={styles.metaIndex}>
        {pad(index + 1)}
        <span> / {pad(chapters.length)}</span>
      </span>
      <span>{chapter.kicker}</span>
      <span className={styles.metaPeriod}>{chapter.dossier.period}</span>
      <span className={styles.metaStatus}>{chapter.dossier.status}</span>
    </p>
  );
}

function ChapterLinks({ chapter }: { chapter: Chapter }) {
  return (
    <div className={styles.links}>
      {chapter.links.map((link) => (
        <ChevronLink
          key={link.href}
          href={link.href}
          external={link.external}
          tone={chapter.tone === "dark" ? "dark" : "light"}
        >
          {link.label}
        </ChevronLink>
      ))}
    </div>
  );
}

/* Two beats in one slot: the story, then the dossier in its place. */
function ChapterBeats({ chapter, progress }: { chapter: Chapter; progress: MotionValue<number> }) {
  const [active, setActive] = useState<"story" | "dossier">("story");
  const storyOpacity = useTransform(progress, [0.02, 0.12, 0.44, 0.52], [0, 1, 1, 0]);
  const storyY = useTransform(progress, [0.44, 0.52], [0, -16]);
  const storyBlur = useTransform(progress, [0.44, 0.52], [0, 8]);
  const storyFilter = useMotionTemplate`blur(${storyBlur}px)`;
  const dossierOpacity = useTransform(progress, [0.5, 0.6, 0.86, 0.95], [0, 1, 1, 0]);
  const dossierY = useTransform(progress, [0.5, 0.6], [18, 0]);
  const dossierBlur = useTransform(progress, [0.5, 0.6], [8, 0]);
  const dossierFilter = useMotionTemplate`blur(${dossierBlur}px)`;

  useMotionValueEvent(progress, "change", (latest) => {
    const next = latest >= 0.48 ? "dossier" : "story";
    setActive((current) => (current === next ? current : next));
  });

  return (
    <div className={styles.beats} data-active={active}>
      <motion.div className={styles.beat} data-beat="story" style={{ opacity: storyOpacity, y: storyY, filter: storyFilter }}>
        <p className={styles.description}>{chapter.description}</p>
        <Figures figures={chapter.figures} progress={progress} />
      </motion.div>
      <motion.div className={styles.beat} data-beat="dossier" style={{ opacity: dossierOpacity, y: dossierY, filter: dossierFilter }}>
        <p className={styles.dossierContext}>{chapter.dossier.context}</p>
        <Dossier chapter={chapter} />
      </motion.div>
      <span className={styles.beatIndex} aria-hidden="true">
        <i data-on={active === "story"} />
        <i data-on={active === "dossier"} />
      </span>
    </div>
  );
}

function ChapterCopy({
  chapter,
  index,
  progress
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number> | null;
}) {
  return (
    <div className={styles.copy}>
      <Part progress={progress} order={0}>
        <ChapterMeta chapter={chapter} index={index} />
      </Part>
      <Part progress={progress} order={1}>
        <ElementName chapter={chapter} />
      </Part>
      <Part progress={progress} order={2}>
        <h3 className={styles.headline}>
          {chapter.headline} <span className={styles.tail}>{chapter.tail}</span>
        </h3>
      </Part>
      {progress ? (
        <Part progress={progress} order={3}>
          <ChapterBeats chapter={chapter} progress={progress} />
        </Part>
      ) : (
        <>
          <Part progress={null} order={3}>
            <p className={styles.description}>{chapter.description}</p>
          </Part>
          <Part progress={null} order={4}>
            <Figures figures={chapter.figures} progress={null} />
          </Part>
          <Part progress={null} order={5}>
            <p className={styles.dossierContext}>{chapter.dossier.context}</p>
            <Dossier chapter={chapter} />
          </Part>
        </>
      )}
      <Part progress={progress} order={progress ? 4 : 6}>
        <ChapterLinks chapter={chapter} />
      </Part>
    </div>
  );
}

function ChapterObject({ chapter }: { chapter: Chapter }) {
  const ObjectComponent = objects[chapter.key];
  return (
    <div className={styles.objectWrap}>
      <ObjectComponent tone={chapter.tone} />
      <p className="sr-only">
        {chapter.objectTitle}. {chapter.objectHint}
      </p>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────── */

/* The pinned hero binds scroll-linked styles; the stacked hero (the one the
   server renders) binds none, so the hydrated markup matches exactly. */
function Hero({ progress }: { progress: MotionValue<number> | null }) {
  const reduce = useReducedMotion();
  const fallback = useMotionValue(0);
  const source = progress ?? fallback;
  const live = Boolean(progress) && !reduce;
  const y = useTransform(source, [0, 1], [0, live ? -120 : 0]);
  const opacity = useTransform(source, [0, 0.7], [1, progress ? 0 : 1]);
  const blurAmount = useTransform(source, [0, 0.8], [0, live ? 10 : 0]);
  const filter = useMotionTemplate`blur(${blurAmount}px)`;
  const cueOpacity = useTransform(source, [0, 0.2], [1, progress ? 0 : 1]);

  const lineOne = hero.lineOne.split(" ");
  const lineTwo = hero.lineTwo.split(" ");
  const goldWord = lineOne.length - 1;

  const word = (text: string, index: number, gold = false) => (
    <motion.span
      key={`${text}-${index}`}
      className={clsx(styles.heroWord, gold && styles.heroGold)}
      initial={reduce ? false : { opacity: 0, y: "0.4em", filter: "blur(14px)" }}
      animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease, delay: 1.1 + index * 0.1 }}
    >
      {text}
    </motion.span>
  );

  return (
    <header className={clsx(styles.section, styles.hero)}>
      <motion.div
        className={styles.heroTop}
        style={progress ? { opacity } : undefined}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        <span className={styles.label}>{hero.eyebrow}</span>
        <span className={styles.label}>{hero.coordinates}</span>
      </motion.div>

      <motion.div className={styles.heroCopy} style={progress ? { y, opacity, filter } : undefined}>
        <motion.p
          className={styles.heroKicker}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.span
            className={styles.heroRule}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.9 }}
          />
          <span className={styles.label}>{hero.span}</span>
        </motion.p>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLine}>{lineOne.map((text, i) => word(text, i, i === goldWord))}</span>
          <span className={clsx(styles.heroLine, styles.heroLineTail)}>
            {lineTwo.map((text, i) => word(text, lineOne.length + i))}
          </span>
        </h1>
        <motion.p
          className={styles.heroSub}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 2.0 }}
        >
          {hero.sub}
        </motion.p>
        <motion.div
          className={styles.heroElements}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.4 }}
          aria-hidden="true"
        >
          {chapters.map((chapter, index) => (
            <span
              key={chapter.key}
              className={styles.heroElement}
              style={{ "--el": ELEMENT_PALETTE[chapter.key].accent } as CSSProperties}
            >
              <i />
              <span className={styles.heroElementIndex}>{pad(index + 1)}</span>
              {chapter.name}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.scrollCue}
        style={progress ? { opacity: cueOpacity } : undefined}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.8 }}
      >
        <span className={styles.label}>Scroll</span>
        <span className={styles.scrollLine} aria-hidden />
      </motion.div>
    </header>
  );
}

/* ─── Element rail ───────────────────────────────────────────────────── */

function ElementRail({
  element,
  active,
  onSelect
}: {
  element: MotionValue<number>;
  active: number;
  onSelect: (index: number) => void;
}) {
  const fill = useTransform(element, [0, chapters.length - 1], [0, 1]);

  return (
    <div className={styles.railDock}>
      <div className={styles.railSticky}>
        <nav className={styles.rail} aria-label="Elements">
          <span className={styles.railTrack} aria-hidden="true">
            <motion.span className={styles.railFill} style={{ scaleX: fill }} />
          </span>
          {chapters.map((chapter, index) => (
            <button
              key={chapter.key}
              type="button"
              className={clsx(styles.railItem, index === active && styles.railItemActive)}
              aria-current={index === active ? "step" : undefined}
              onClick={() => onSelect(index)}
            >
              {index === active ? (
                <motion.span layoutId="journey-rail-pill" className={styles.railPill} transition={{ type: "spring", stiffness: 260, damping: 28 }} />
              ) : null}
              <span className={styles.railIndex}>{pad(index + 1)}</span>
              {chapter.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ─── Chapter and segue, pinned ──────────────────────────────────────── */

const ChapterPinned = memo(function ChapterPinned({
  chapter,
  index,
  sectionRef
}: {
  chapter: Chapter;
  index: number;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const progress = useSectionProgress(sectionRef, ["start start", "end end"]);
  /* The light pool behind the copy only exists while the stage is pinned,
     so it never scrolls into view as a shape of its own. */
  const scrimOpacity = useTransform(progress, [0, 0.07, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className={clsx(styles.section, styles.chapter)}
      data-element={chapter.key}
      style={{ height: `${CHAPTER_HEIGHT}vh` }}
      aria-labelledby={`journey-${chapter.key}`}
    >
      <div className={styles.stage}>
        <motion.div className={styles.scrim} style={{ opacity: scrimOpacity }} aria-hidden="true" />
        <div id={`journey-${chapter.key}`} className="sr-only">
          {chapter.name}: {chapter.headline}
        </div>
        <ChapterCopy chapter={chapter} index={index} progress={progress} />
        <Reveal progress={progress} order={2} scale>
          <ChapterObject chapter={chapter} />
        </Reveal>
      </div>
    </section>
  );
});

function SegueWords({ text, progress, from, to }: { text: string; progress: MotionValue<number>; from: number; to: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <SegueWord key={`${word}-${index}`} word={word} index={index} total={words.length} progress={progress} from={from} to={to} />
      ))}
    </>
  );
}

function SegueWord({
  word,
  index,
  total,
  progress,
  from,
  to
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) {
  const span = to - from;
  const start = from + (index / total) * span * 0.7;
  const end = start + span * 0.3;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const blurAmount = useTransform(progress, [start, end], [10, 0]);
  const filter = useMotionTemplate`blur(${blurAmount}px)`;
  return (
    <motion.span className={styles.segueWord} style={{ opacity, y, filter }}>
      {word}
    </motion.span>
  );
}

const SeguePinned = memo(function SeguePinned({
  segue,
  sectionRef
}: {
  segue: Segue;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const progress = useSectionProgress(sectionRef, ["start start", "end end"]);
  const exit = useTransform(progress, [0.76, 0.95], [1, 0]);
  const exitY = useTransform(progress, [0.76, 0.95], [0, -40]);
  const fromOpacity = useTransform(progress, [0.06, 0.18], [0, 1]);
  const milestoneOpacity = useTransform(progress, [0.46, 0.6], [0, 1]);
  const milestoneY = useTransform(progress, [0.46, 0.6], [12, 0]);
  const fromChapter = chapters.find((chapter) => chapter.key === segue.from)!;
  const toChapter = chapters.find((chapter) => chapter.key === segue.to)!;

  return (
    <section
      ref={sectionRef}
      className={clsx(styles.section, styles.segue)}
      style={{ height: `${SEGUE_HEIGHT}vh` }}
      aria-label={`${fromChapter.name} to ${toChapter.name}`}
    >
      <motion.div className={styles.segueStage} style={{ opacity: exit, y: exitY }}>
        <motion.span className={styles.segueFrom} style={{ opacity: fromOpacity }}>
          <span className={styles.label}>{fromChapter.name}</span>
          <span className={styles.segueArrow} aria-hidden="true">
            →
          </span>
          <span className={styles.label}>{toChapter.name}</span>
        </motion.span>
        <h2 className={styles.segueLine}>
          <SegueWords text={segue.line} progress={progress} from={0.1} to={0.4} />
        </h2>
        <p className={styles.segueTail}>
          <SegueWords text={segue.tail} progress={progress} from={0.3} to={0.52} />
        </p>
        <motion.p className={styles.milestone} style={{ opacity: milestoneOpacity, y: milestoneY }}>
          <span className={styles.milestoneWhen}>{segue.milestone.when}</span>
          <span className={styles.milestoneWhat}>{segue.milestone.what}</span>
        </motion.p>
      </motion.div>
    </section>
  );
});

/* ─── Outro ──────────────────────────────────────────────────────────── */

function Outro() {
  return (
    <section className={clsx(styles.section, styles.outro)} aria-labelledby="journey-outro-title">
      <motion.div
        className={styles.outroHead}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        <span className={styles.label}>{outro.kicker}</span>
        <h2 id="journey-outro-title" className={styles.outroTitle}>
          {outro.headline} <span className={styles.tail}>{outro.tail}</span>
        </h2>
      </motion.div>

      <ol className={styles.outroGrid}>
        {outro.summaries.map((summary, index) => {
          const chapter = chapters.find((candidate) => candidate.key === summary.key)!;
          const figure = chapter.figures[0];
          return (
            <motion.li
              key={summary.key}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease, delay: index * 0.08 }}
            >
              <Link
                href={chapter.links[0].href}
                className={styles.outroCard}
                style={{ "--el": ELEMENT_PALETTE[summary.key].accent } as CSSProperties}
              >
                <span className={styles.outroCardTop}>
                  <span className={styles.label}>{pad(index + 1)}</span>
                  <span className={styles.outroDot} style={{ background: ELEMENT_PALETTE[summary.key].accent }} aria-hidden="true" />
                </span>
                <span className={styles.outroCardName}>{chapter.name}</span>
                <span className={styles.outroCardFigure}>
                  {figure.parts.map((part, partIndex) => (
                    <span key={partIndex}>{typeof part === "number" ? part.toFixed(figure.decimals ?? 0) : part}</span>
                  ))}
                  {figure.suffix ? <small>{figure.suffix}</small> : null}
                  <small> {figure.label.toLowerCase()}</small>
                </span>
                <span className={styles.outroCardLine}>{summary.line}</span>
              </Link>
            </motion.li>
          );
        })}
      </ol>

      <motion.div
        className={styles.credentials}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease }}
      >
        <div className={styles.credentialsHead}>
          <span className={styles.label}>Credentials behind the work</span>
          <ChevronLink href="/certifications" tone="dark">
            See every credential
          </ChevronLink>
        </div>
        <ol className={styles.credentialList}>
          {credentialList.map((cert, index) => {
            const body = (
              <>
                <span className={styles.credentialIndex}>{pad(index + 1)}</span>
                <span className={styles.credentialMain}>
                  <span className={styles.credentialTitle}>{cert.label}</span>
                  <span className={styles.credentialMeta}>
                    {cert.issuer}
                    {cert.code ? ` · ${cert.code}` : ""}
                  </span>
                </span>
                <span className={styles.credentialStatus}>{cert.href ? "Verify ↗" : cert.status}</span>
              </>
            );
            return (
              <li key={cert.slug}>
                {cert.href ? (
                  <a className={clsx(styles.credentialRow, styles.credentialRowLink)} href={cert.href} target="_blank" rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  <div className={styles.credentialRow}>{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </motion.div>

      <motion.div
        className={styles.outroActions}
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
        <ChevronLink href="/projects" tone="dark">
          View the case files
        </ChevronLink>
      </motion.div>
    </section>
  );
}

/* ─── The two layouts ────────────────────────────────────────────────── */

function JourneyCinematic({ className }: { className?: string }) {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  /* One ref per section, created once: the sections register themselves and
     the progress hook measures them. */
  const [chapterRefs] = useState(() => chapters.map(() => createRef<HTMLElement>()));
  const [segueRefs] = useState(() => segues.map(() => createRef<HTMLElement>()));
  const reduce = Boolean(useReducedMotion());
  const scrollTo = useScrollTo();
  const [active, setActive] = useState(0);

  const element = useElementProgress(segueRefs, true);
  const heroProgress = useSectionProgress(heroRef, ["start start", "end start"]);

  useElementalSound(ELEMENT_ORDER[active], true);

  useMotionValueEvent(element, "change", (t) => {
    const index = Math.min(chapters.length - 1, Math.max(0, Math.round(t)));
    setActive((current) => (current === index ? current : index));

    const main = mainRef.current;
    if (!main) return;
    const lower = Math.floor(t);
    const upper = Math.min(chapters.length - 1, lower + 1);
    const mix = t - lower;
    const from = ELEMENT_PALETTE[ELEMENT_ORDER[lower]];
    const to = ELEMENT_PALETTE[ELEMENT_ORDER[upper]];
    /* Light ink survives a half-dark field better than dark ink survives a
       half-light one, so the switch leans dark slightly early. */
    const dark = (from.tone === "dark" ? 1 - mix : 0) + (to.tone === "dark" ? mix : 0);
    const tone = dark > 0.45 ? "dark" : "light";
    if (main.dataset.tone !== tone) main.dataset.tone = tone;
    const key = ELEMENT_ORDER[index];
    if (main.dataset.element !== key) main.dataset.element = key;
    const rgb = from.baseRgb.map((channel, i) => Math.round(channel + (to.baseRgb[i] - channel) * mix));
    main.style.backgroundColor = `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
  });

  const select = useCallback(
    (index: number) => {
      const section = chapterRefs[index]?.current;
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      scrollTo(top + travel * 0.3);
    },
    [chapterRefs, scrollTo]
  );

  return (
    <main
      id="main-content"
      ref={mainRef}
      className={clsx(styles.story, className)}
      data-tone="light"
      data-element="earth"
    >
      <div className={styles.canvasRail} aria-hidden="true">
        <div className={styles.canvasDock}>
          <ElementalWorld element={element} reduced={reduce} className={styles.canvas} />
        </div>
      </div>

      <ElementRail element={element} active={active} onSelect={select} />

      <div ref={heroRef}>
        <Hero progress={heroProgress} />
      </div>

      {chapters.map((chapter, index) => (
        <div key={chapter.key} style={{ display: "contents" }}>
          <ChapterPinned chapter={chapter} index={index} sectionRef={chapterRefs[index]} />
          {segues[index] ? <SeguePinned segue={segues[index]} sectionRef={segueRefs[index]} /> : null}
        </div>
      ))}

      <Outro />
    </main>
  );
}

function JourneyStatic({ className }: { className?: string }) {
  return (
    <main id="main-content" className={clsx(styles.story, className)} data-tone="light" data-element="earth">
      <Hero progress={null} />
      {chapters.map((chapter, index) => (
        <div key={chapter.key} style={{ display: "contents" }}>
          <section
            className={clsx(styles.section, styles.staticChapter)}
            data-element={chapter.key}
            data-tone={chapter.tone}
            style={{ color: chapter.tone === "dark" ? "#f4f1ec" : "#1d1a17" }}
            aria-labelledby={`journey-${chapter.key}`}
          >
            <div className={styles.staticInner} data-tone={chapter.tone}>
              <div id={`journey-${chapter.key}`} className="sr-only">
                {chapter.name}: {chapter.headline}
              </div>
              <ChapterCopy chapter={chapter} index={index} progress={null} />
              <ChapterObject chapter={chapter} />
            </div>
          </section>
          {segues[index] ? (
            <section className={clsx(styles.section, styles.staticSegue)} aria-hidden="true">
              <h2 className={styles.segueLine}>{segues[index].line}</h2>
              <p className={styles.segueTail}>{segues[index].tail}</p>
            </section>
          ) : null}
        </div>
      ))}
      <div data-tone="dark" style={{ background: "#070a14", color: "#f4f1ec" }}>
        <Outro />
      </div>
    </main>
  );
}

export function JourneyStory({ className }: { className?: string }) {
  const cinematic = useCinematic();
  return cinematic ? <JourneyCinematic className={className} /> : <JourneyStatic className={className} />;
}
