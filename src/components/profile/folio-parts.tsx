"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode
} from "react";
import { useStableReducedMotion } from "./use-stable-reduced-motion";
import styles from "./folio-parts.module.css";

const quietEase = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Magnetic                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Wraps a control so it leans toward the pointer while hovered and springs
 * back when released. The wrapper carries an invisible margin so the pull
 * begins just before the pointer reaches the control itself.
 */
export function Magnetic({
  children,
  className,
  strength = 0.26
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const prefersReducedMotion = useStableReducedMotion();
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const x = useSpring(offsetX, { stiffness: 260, damping: 20, mass: 0.5 });
  const y = useSpring(offsetY, { stiffness: 260, damping: 20, mass: 0.5 });

  function handlePointerMove(event: PointerEvent<HTMLSpanElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    offsetX.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    offsetY.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  }

  function reset() {
    offsetX.set(0);
    offsetY.set(0);
  }

  return (
    <motion.span
      className={`${styles.magnetic}${className ? ` ${className}` : ""}`}
      onPointerCancel={reset}
      onPointerLeave={reset}
      onPointerMove={handlePointerMove}
      style={prefersReducedMotion ? undefined : { x, y }}
    >
      {children}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Metrics                                                                    */
/* -------------------------------------------------------------------------- */

type FolioMetric = {
  label: string;
  hint: string;
  href: string;
  values: readonly number[];
  format: (values: number[]) => string;
};

const folioMetrics: readonly FolioMetric[] = [
  {
    label: "source systems",
    hint: "Fabric migration PoC",
    href: "/projects/telecom-fabric-migration-poc",
    values: [3],
    format: ([count]) => `${count}`
  },
  {
    label: "daily source tables",
    hint: "Incremental loads",
    href: "/projects/telecom-fabric-migration-poc",
    values: [18, 24],
    format: ([low, high]) => `${low}–${high}`
  },
  {
    label: "reports validated",
    hint: "MicroStrategy to Fabric",
    href: "/projects/bi-migration-validation-analytics",
    values: [15],
    format: ([count]) => `${count}+`
  },
  {
    label: "fewer discrepancies",
    hint: "SQL reconciliation",
    href: "/projects/bi-migration-validation-analytics",
    values: [90],
    format: ([percent]) => `${percent}%`
  }
];

function MetricValue({
  metric,
  delay,
  live
}: {
  metric: FolioMetric;
  delay: number;
  live: boolean;
}) {
  const progress = useMotionValue(live ? 0 : 1);
  const text = useTransform(progress, (value) =>
    metric.format(metric.values.map((target) => Math.round(target * value)))
  );

  useEffect(() => {
    if (!live) {
      progress.set(1);
      return;
    }

    const controls = animate(progress, 1, {
      delay,
      duration: 1.5,
      ease: quietEase
    });
    return () => controls.stop();
  }, [delay, live, progress]);

  return <motion.strong className={styles.metricValue}>{text}</motion.strong>;
}

/**
 * Four headline numbers. Each counts up as the back of the card settles,
 * and each is a doorway into the case study behind it.
 */
export function FolioMetrics() {
  const prefersReducedMotion = useStableReducedMotion();

  return (
    <ul aria-label="Headline outcomes" className={styles.metrics}>
      {folioMetrics.map((metric, index) => (
        <li key={metric.label}>
          <Link
            aria-label={`${metric.format([...metric.values])} ${metric.label}. Open the related case study`}
            className={styles.metric}
            href={metric.href}
          >
            <MetricValue
              delay={0.82 + index * 0.08}
              live={!prefersReducedMotion}
              metric={metric}
            />
            <span className={styles.metricLabel}>{metric.label}</span>
            <span aria-hidden="true" className={styles.metricHint}>
              {metric.hint}
              <ArrowUpRight strokeWidth={1.6} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scroll frame                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The scrolling body of the folio with edge fades that appear only when
 * there is more to read in that direction, a hairline progress track on the
 * right, and a small cue at the foot until the reader has scrolled.
 */
export function ScrollFrame({
  children,
  ...regionProps
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const scroller = scrollRef.current;
    if (!frame || !scroller) return;

    let rafId = 0;

    function measure() {
      rafId = 0;
      if (!frame || !scroller) return;
      const range = scroller.scrollHeight - scroller.clientHeight;
      const top = scroller.scrollTop;
      const progress = range > 2 ? top / range : 1;

      frame.dataset.atTop = top <= 2 ? "true" : "false";
      frame.dataset.atEnd = range - top <= 2 ? "true" : "false";
      frame.dataset.scrollable = range > 2 ? "true" : "false";
      frame.style.setProperty("--folio-scroll", progress.toFixed(4));
      frame.style.setProperty(
        "--folio-thumb",
        range > 2 ? `${Math.max(0.12, scroller.clientHeight / scroller.scrollHeight).toFixed(4)}` : "1"
      );
    }

    function schedule() {
      if (rafId === 0) rafId = window.requestAnimationFrame(measure);
    }

    measure();
    scroller.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(scroller);
    for (const child of Array.from(scroller.children)) observer.observe(child);

    return () => {
      scroller.removeEventListener("scroll", schedule);
      observer.disconnect();
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles.scrollFrame} ref={frameRef}>
      <div {...regionProps} className={styles.scroll} ref={scrollRef}>
        {children}
      </div>
      <span aria-hidden="true" className={`${styles.fade} ${styles.fadeTop}`} />
      <span aria-hidden="true" className={`${styles.fade} ${styles.fadeBottom}`} />
      <span aria-hidden="true" className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span aria-hidden="true" className={styles.scrollCue}>
        <ArrowDown strokeWidth={1.6} />
        <span>Scroll</span>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Signature panel                                                            */
/* -------------------------------------------------------------------------- */

/** The signature strip on the back of a card, with the serial beneath. */
export function FolioSignature() {
  return (
    <div aria-hidden="true" className={styles.signature}>
      <span className={styles.signatureInk}>Nirmal Kumar</span>
      <span className={styles.signatureSerial}>NK · 13.0827 N · 80.2707 E</span>
    </div>
  );
}
