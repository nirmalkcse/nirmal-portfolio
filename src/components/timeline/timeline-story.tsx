"use client";

import Link from "next/link";
import { RecognitionSeal } from "@/components/signature/recognition-seal";
import clsx from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLink,
  CountUp,
  Odometer,
  ease,
  pad,
  useCinematic,
  useScrollTo,
  useSectionProgress
} from "@/components/story";
import {
  certifications,
  futureProjects,
  profile,
  projects,
  timelineEvents,
  type Certification,
  type TimelineEvent
} from "@/data";
import styles from "./timeline-story.module.css";

/* ─── Story model ────────────────────────────────────────────────────────
   Facts come from src/data. This layer only decides the order, the year
   each moment lands in, and a short two-tone headline for it. */

type Figure = {
  /** Numbers count up; strings ("→", "–") render as written. */
  parts: readonly (number | string)[];
  decimals?: number;
  suffix?: string;
  label: string;
};

type Moment = {
  id: string;
  year: number;
  kicker: string;
  headline: string;
  tail: string;
  figures?: readonly Figure[];
  /** Shows the Databricks Brickbuilder seal with this moment. */
  recognition?: boolean;
};

const moments: readonly Moment[] = [
  {
    id: "education-cse-degree",
    year: 2024,
    kicker: "Education",
    headline: "Graduated in Computer Science.",
    tail: `${profile.education.institution}.`,
    figures: [{ parts: [9.11], decimals: 2, suffix: "/10", label: "CGPA" }]
  },
  {
    id: "ieee-semiconductor-publication",
    year: 2024,
    kicker: "Publication",
    headline: "Research on IEEE Xplore.",
    tail: "Semiconductor chip analysis, built on Fabric."
  },
  {
    id: "ilink-role-start",
    year: 2024,
    kicker: "First role",
    headline: `Joined ${profile.roles[0].organization}.`,
    tail: "Data engineering and product development."
  },
  {
    id: "bi-validation-migration-workstream",
    year: 2025,
    kicker: "BI migration",
    headline: "Reports, reconciled.",
    tail: "MicroStrategy to Fabric. Tableau to Power BI.",
    figures: [
      { parts: [15], suffix: "+", label: "Reports validated" },
      { parts: [90], suffix: "%", label: "Fewer discrepancies" },
      { parts: [6], label: "Tableau reports migrated" }
    ]
  },
  {
    id: "performance-rating-growth",
    year: 2025,
    kicker: "Recognition",
    headline: "A rating on the rise.",
    tail: "With Outstanding ratings on record.",
    figures: [
      { parts: [4.4, "→", 4.8], decimals: 1, suffix: "/5", label: "Performance rating" }
    ]
  },
  {
    id: "fabcon25-talk-to-your-data-demo",
    year: 2025,
    kicker: "FabCon25 Europe",
    headline: "Talk to Your Data.",
    tail: "A Fabric demo with Copilot and Data Agents."
  },
  {
    id: "telecom-fabric-migration-poc",
    year: 2025,
    kicker: "Migration",
    headline: "Teradata to Fabric.",
    tail: "For a tier-1 European telecom.",
    figures: [
      { parts: [3], label: "Source systems" },
      { parts: [18, "–", 24], label: "Daily incremental tables" }
    ]
  },
  {
    id: "icore-mdm-entity-resolution",
    year: 2026,
    kicker: "Product",
    headline: "iCORE, end to end.",
    tail: "Owning an enterprise MDM product on Databricks.",
    recognition: true
  }
];

const STATEMENT =
  "Nirmal Kumar builds data systems that bring clarity to migration, reporting, and validation. This is how the work took shape, one moment at a time.";

const numberWords = [
  "Zero", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"
];

const shortMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const verificationLabels: Record<Certification["verificationStatus"], string> = {
  verified: "Verified",
  "link-captured": "Link on file",
  "resume-claimed": "On résumé"
};

const eventCatalog: readonly TimelineEvent[] = timelineEvents;
const credentialCatalog: readonly Certification[] = certifications;

function eventFor(id: string) {
  const event = eventCatalog.find((candidate) => candidate.id === id);
  if (!event) throw new Error(`Timeline event "${id}" is missing from src/data/timeline.ts`);
  return event;
}

function formatDate(date: string | null) {
  if (!date) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(date);
  return match ? `${shortMonths[Number(match[2]) - 1]} ${match[1]}` : date;
}

function formatPeriod(event: TimelineEvent) {
  const { startDate, endDate } = event;
  if (!startDate || startDate === endDate) return formatDate(endDate ?? startDate);
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

function caseFileFor(event: TimelineEvent) {
  if (!["project", "demo", "publication"].includes(event.category)) return undefined;
  return projects.find((project) => event.relatedProjects.includes(project.slug));
}

function credentialTitle(title: string) {
  return title.replace(/^Microsoft Certified:\s*/, "");
}

/* ─── Small parts ────────────────────────────────────────────────────── */

function FigureValue({ figure }: { figure: Figure }) {
  const arrowAt = figure.parts.indexOf("→");

  return (
    <span className={styles.figureValue}>
      {figure.parts.map((part, index) => {
        if (typeof part === "number") {
          return (
            <span key={index} className={arrowAt > index ? styles.figureBefore : undefined}>
              <CountUp value={part} decimals={figure.decimals} />
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

function Figures({ figures }: { figures: readonly Figure[] }) {
  return (
    <dl className={styles.figures}>
      {figures.map((figure) => (
        <div key={figure.label} className={styles.figure}>
          <dt className={styles.figureLabel}>{figure.label}</dt>
          <dd>
            <FigureValue figure={figure} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ─── Moment ─────────────────────────────────────────────────────────── */

const momentVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 56 : -56,
    filter: "blur(14px)"
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease, staggerChildren: 0.07 }
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -56 : 56,
    filter: "blur(14px)",
    transition: { duration: 0.45, ease }
  })
};

const partVariants: Variants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  exit: { opacity: 0 }
};

function MomentBody({ moment, index }: { moment: Moment; index: number }) {
  const event = eventFor(moment.id);
  const caseFile = caseFileFor(event);
  const verified = event.proofLinks.filter(
    (link): link is typeof link & { url: string } =>
      link.status === "verified" && Boolean(link.url)
  );

  return (
    <>
      <motion.p variants={partVariants} className={styles.momentMeta}>
        <span className={styles.momentIndex}>
          {pad(index + 1)}
          <span> / {pad(moments.length)}</span>
        </span>
        <span>{moment.kicker}</span>
        <span>{formatPeriod(event)}</span>
      </motion.p>

      <motion.h3 variants={partVariants} className={styles.momentHeadline}>
        {moment.headline} <span className={styles.tail}>{moment.tail}</span>
      </motion.h3>

      <motion.div
        variants={partVariants}
        className={clsx(styles.momentFoot, !moment.figures && styles.momentFootSolo)}
      >
        {moment.figures ? <Figures figures={moment.figures} /> : null}
        <div className={styles.momentDetail}>
          {moment.recognition ? <RecognitionSeal className={styles.momentSeal} /> : null}
          <p className={styles.momentDescription}>{event.description}</p>
          {caseFile || verified.length > 0 ? (
            <div className={styles.momentLinks}>
              {caseFile ? (
                <ChevronLink href={`/projects/${caseFile.slug}`}>Read the case file</ChevronLink>
              ) : null}
              {verified.map((link) => (
                <ChevronLink key={link.url} href={link.url} external>
                  {link.label}
                </ChevronLink>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────── */

function Hero({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [0, reduce ? 0 : -120]);
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);
  const blur = useTransform(progress, [0, 0.8], ["blur(0px)", reduce ? "blur(0px)" : "blur(10px)"]);
  const cueOpacity = useTransform(progress, [0, 0.2], [1, 0]);

  const lineOne = "From first principles".split(" ");
  const lineTwo = "to production.".split(" ");

  const word = (text: string, index: number) => (
    <motion.span
      key={`${text}-${index}`}
      className={styles.heroWord}
      initial={reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(12px)" }}
      animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
      transition={{ duration: 1.2, ease, delay: 0.5 + index * 0.08 }}
    >
      {text}
    </motion.span>
  );

  return (
    <header className={styles.hero}>
      <motion.div className={styles.heroTop} style={{ opacity }}>
        <span className={styles.label}>Timeline</span>
        <span className={styles.label}>2024 — Present</span>
      </motion.div>

      <motion.div className={styles.heroCopy} style={{ y, opacity, filter: blur }}>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLine}>{lineOne.map((text, i) => word(text, i))}</span>
          <span className={clsx(styles.heroLine, styles.tail)}>
            {lineTwo.map((text, i) => word(text, lineOne.length + i))}
          </span>
        </h1>
        <motion.p
          className={styles.heroSub}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.1 }}
        >
          A data engineer&rsquo;s story, in {numberWords[moments.length]?.toLowerCase() ?? moments.length} moments.
        </motion.p>
      </motion.div>

      <motion.div
        className={styles.scrollCue}
        style={{ opacity: cueOpacity }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <span className={styles.label}>Scroll</span>
        <span className={styles.scrollLine} aria-hidden />
      </motion.div>
    </header>
  );
}

/* ─── Statement: words fill in as you read ───────────────────────────── */

function StatementWord({
  word,
  index,
  total,
  progress
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.78 + 0.06;
  const opacity = useTransform(progress, [start, start + 0.9 / total + 0.04], [0.14, 1]);

  return (
    <motion.span className={styles.statementWord} style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

function StatementStatic() {
  return (
    <section className={styles.statementStatic} aria-label="Introduction">
      <motion.p
        className={styles.statementText}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        {STATEMENT}
      </motion.p>
    </section>
  );
}

function StatementPinned() {
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"]);
  const words = STATEMENT.split(" ");
  const exit = useTransform(scrollYProgress, [0.88, 1], [1, 0]);

  return (
    <section ref={ref} className={styles.statement} aria-label="Introduction">
      <div className={styles.statementStage}>
        <motion.p className={styles.statementText} style={{ opacity: exit }}>
          {words.map((word, index) => (
            <StatementWord
              key={`${word}-${index}`}
              word={word}
              index={index}
              total={words.length}
              progress={scrollYProgress}
            />
          ))}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Journey: one moment at a time ──────────────────────────────────── */

const yearGroups = moments.reduce<{ year: number; first: number }[]>((groups, moment, index) => {
  if (groups.at(-1)?.year !== moment.year) groups.push({ year: moment.year, first: index });
  return groups;
}, []);

function Axis({
  active,
  fill,
  onSelect
}: {
  active: number;
  fill: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  const last = moments.length - 1;

  return (
    <nav className={styles.axis} aria-label="Timeline moments">
      <div className={styles.axisInner}>
        <div className={styles.axisTrack}>
          <motion.span className={styles.axisFill} style={{ scaleX: fill }} />
        </div>
        {yearGroups.map((group) => (
          <span
            key={group.year}
            className={styles.axisYear}
            style={{ left: `${(group.first / last) * 100}%` }}
          >
            {group.year}
          </span>
        ))}
        <ol className={styles.axisNodes}>
          {moments.map((moment, index) => (
            <li key={moment.id} style={{ left: `${(index / last) * 100}%` }}>
              <button
                type="button"
                className={clsx(
                  styles.axisNode,
                  index === active && styles.axisNodeActive,
                  index < active && styles.axisNodePast
                )}
                aria-label={`${pad(index + 1)}. ${moment.headline}`}
                aria-current={index === active ? "step" : undefined}
                onClick={() => onSelect(index)}
              >
                <span className={styles.axisDot} aria-hidden />
                <span className={styles.axisTip} aria-hidden>
                  {moment.kicker}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function JourneyPinned({ onYear }: { onYear: (year: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = moments.length;

  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"]);
  const fillTarget = useTransform(scrollYProgress, (p) =>
    Math.min(1, Math.max(0, (p * count - 0.5) / (count - 1)))
  );
  const fill = useSpring(fillTarget, { stiffness: 140, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
    setActive((current) => {
      if (current !== next) setDirection(next > current ? 1 : -1);
      return next;
    });
  });

  useEffect(() => {
    onYear(moments[active].year);
  }, [active, onYear]);

  const select = (index: number) => {
    const section = ref.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    scrollTo(top + ((index + 0.5) / count) * travel);
  };

  return (
    <section
      ref={ref}
      className={styles.journey}
      style={{ height: `${count * 85 + 100}vh` }}
      aria-label="Career moments"
    >
      <div className={styles.journeyStage}>
        <div className={styles.momentFrame} aria-live="polite">
          <AnimatePresence initial={false} custom={direction}>
            <motion.article
              key={moments[active].id}
              className={styles.moment}
              custom={direction}
              variants={momentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <MomentBody moment={moments[active]} index={active} />
            </motion.article>
          </AnimatePresence>
        </div>
        <Axis active={active} fill={fill} onSelect={select} />
      </div>
    </section>
  );
}

function JourneyList() {
  return (
    <section className={styles.journeyList} aria-label="Career moments">
      {moments.map((moment, index) => (
        <motion.article
          key={moment.id}
          className={styles.momentCard}
          initial="enter"
          whileInView="center"
          viewport={{ once: true, amount: 0.25 }}
          custom={1}
          variants={momentVariants}
        >
          <span className={styles.momentCardYear}>{moment.year}</span>
          <MomentBody moment={moment} index={index} />
        </motion.article>
      ))}
    </section>
  );
}

/* ─── Storyline: hero → statement → journey, under one rolling year ──── */

function Storyline({ cinematic }: { cinematic: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState(moments[0].year);
  const heroProgress = useSectionProgress(heroRef, ["start start", "end start"]);

  const dockScale = useTransform(heroProgress, [0, 1], [1, cinematic ? 0.26 : 1]);
  const dockOpacity = useTransform(heroProgress, [0, 0.6], [1, cinematic ? 1 : 0]);

  return (
    <div className={styles.storyline}>
      <div className={styles.dockRail} aria-hidden>
        <div className={styles.dock}>
          <motion.div
            className={styles.dockInner}
            style={{ scale: dockScale, opacity: dockOpacity }}
          >
            <Odometer value={year} className={styles.year} />
          </motion.div>
        </div>
      </div>

      <div ref={heroRef}>
        <Hero progress={heroProgress} />
      </div>
      {cinematic ? <StatementPinned /> : <StatementStatic />}
      {cinematic ? <JourneyPinned onYear={setYear} /> : <JourneyList />}
    </div>
  );
}

/* ─── Credentials: a dark card that opens into the room ──────────────── */

function CredentialRow({
  credential,
  index,
  progress
}: {
  credential: Certification;
  index: number;
  progress: MotionValue<number> | null;
}) {
  const settled = useMotionValue(1);
  const start = 0.3 + index * 0.035;
  const opacity = useTransform(progress ?? settled, [start, start + 0.08], [0, 1]);
  const y = useTransform(progress ?? settled, [start, start + 0.08], [24, 0]);
  const code = /\((DP-\d+)\)/.exec(credential.title)?.[1];

  const content = (
    <>
      <span className={styles.credIndex}>{pad(index + 1)}</span>
      <span className={styles.credMain}>
        <span className={styles.credTitle}>
          {credentialTitle(credential.title).replace(/\s*\(DP-\d+\)$/, "")}
        </span>
        <span className={styles.credMeta}>
          {credential.issuer}
          {code ? ` · ${code}` : ""}
        </span>
      </span>
      <span className={styles.credStatus}>
        {credential.credentialUrl ? (
          <>
            Verify <ArrowUpRight aria-hidden />
          </>
        ) : (
          verificationLabels[credential.verificationStatus]
        )}
      </span>
    </>
  );

  return (
    <motion.li style={progress ? { opacity, y } : undefined}>
      {credential.credentialUrl ? (
        <a
          className={clsx(styles.credRow, styles.credRowLink)}
          href={credential.credentialUrl}
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      ) : (
        <div className={styles.credRow}>{content}</div>
      )}
    </motion.li>
  );
}

function CredentialsContent({ progress }: { progress: MotionValue<number> | null }) {
  const count = credentialCatalog.length;

  return (
    <div className={styles.credContent}>
      <div className={styles.credHead}>
        <span className={clsx(styles.label, styles.labelDark)}>Credentials</span>
        <h2 className={styles.credTitleBig}>
          {numberWords[count] ?? count} credentials.{" "}
          <span className={styles.tailDark}>Each one earned, not assumed.</span>
        </h2>
      </div>
      <ol className={styles.credList}>
        {credentialCatalog.map((credential, index) => (
          <CredentialRow
            key={credential.slug}
            credential={credential}
            index={index}
            progress={progress}
          />
        ))}
      </ol>
      <div className={styles.credFoot}>
        <ChevronLink href="/certifications" tone="dark">
          See every credential
        </ChevronLink>
      </div>
    </div>
  );
}

function CredentialsPinned() {
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useSectionProgress(ref, ["start start", "end end"]);

  const clipPath = useTransform(scrollYProgress, (p) => {
    const open = Math.min(1, p / 0.26);
    const close = Math.max(0, (p - 0.9) / 0.1);
    const eased = 1 - Math.pow(1 - open, 3);
    const vertical = 14 * (1 - eased);
    const horizontal = 20 * (1 - eased) + 3 * close;
    const bottom = vertical + 7 * close;
    const radius = 40 * (1 - eased) + 36 * close;
    return `inset(${vertical}% ${horizontal}% ${bottom}% ${horizontal}% round ${radius}px)`;
  });
  const teaserOpacity = useTransform(scrollYProgress, [0.04, 0.18], [1, 0]);
  const teaserScale = useTransform(scrollYProgress, [0, 0.22], [1, 1.25]);
  const contentOpacity = useTransform(scrollYProgress, [0.18, 0.3], [0, 1]);

  return (
    <section ref={ref} className={styles.credPinned} aria-label="Credentials">
      <div className={styles.credStage}>
        <motion.div className={styles.credPanel} style={{ clipPath }}>
          <motion.div
            className={styles.credTeaser}
            style={{ opacity: teaserOpacity, scale: teaserScale }}
            aria-hidden
          >
            <span className={styles.credTeaserCount}>{pad(credentialCatalog.length)}</span>
            <span className={clsx(styles.label, styles.labelDark)}>Credentials</span>
          </motion.div>
          <motion.div style={{ opacity: contentOpacity }} className={styles.credContentWrap}>
            <CredentialsContent progress={scrollYProgress} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CredentialsStatic() {
  return (
    <section className={styles.credStatic} aria-label="Credentials">
      <motion.div
        className={styles.credPanelStatic}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease }}
      >
        <CredentialsContent progress={null} />
      </motion.div>
    </section>
  );
}

/* ─── What's next ────────────────────────────────────────────────────── */

function Next() {
  return (
    <section className={styles.next} aria-labelledby="timeline-next-title">
      <motion.div
        className={styles.nextHead}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease }}
      >
        <span className={styles.label}>What&rsquo;s next</span>
        <h2 id="timeline-next-title" className={styles.sectionTitle}>
          Currently exploring.{" "}
          <span className={styles.tail}>Studies shared openly, while they take shape.</span>
        </h2>
      </motion.div>

      <ol className={styles.nextList}>
        {futureProjects.map((project, index) => (
          <motion.li
            key={project.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease, delay: index * 0.1 }}
          >
            <Link href="/future-projects" className={styles.nextItem}>
              <span className={styles.nextTop}>
                <span className={styles.nextIndex}>{pad(index + 1)}</span>
                <span className={styles.nextStatus}>
                  <span className={styles.pulse} aria-hidden />
                  Exploring
                </span>
              </span>
              <span className={styles.nextTitle}>{project.title}</span>
              <span className={styles.nextConcept}>{project.concept}</span>
              <span className={styles.nextStack}>
                {project.plannedStack.slice(0, 3).join(" · ")}
              </span>
              <span className={styles.nextMore}>
                Follow the study <ArrowRight aria-hidden />
              </span>
            </Link>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ─── Outro ──────────────────────────────────────────────────────────── */

function Outro() {
  return (
    <section className={styles.outro} aria-labelledby="timeline-outro-title">
      <motion.h2
        id="timeline-outro-title"
        className={styles.outroTitle}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease }}
      >
        The next moment is unwritten.{" "}
        <span className={styles.tail}>Let&rsquo;s write it together.</span>
      </motion.h2>
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
        <ChevronLink href="/projects">View the case files</ChevronLink>
      </motion.div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export function TimelineStory({ className }: { className?: string }) {
  const cinematic = useCinematic();

  return (
    <main id="main-content" className={clsx(styles.story, className)}>
      <Storyline cinematic={cinematic} />
      {cinematic ? <CredentialsPinned /> : <CredentialsStatic />}
      <Next />
      <Outro />
    </main>
  );
}
