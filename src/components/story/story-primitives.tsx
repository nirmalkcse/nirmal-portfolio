"use client";

import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { animate, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type RefObject
} from "react";
import styles from "./story-primitives.module.css";

/* Shared parts for the scroll-story pages (timeline, work). */

export const ease = [0.16, 1, 0.3, 1] as const;

export const pad = (value: number) => String(value).padStart(2, "0");

/* ─── Hooks ──────────────────────────────────────────────────────────── */

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Scroll progress through one section, kept on the JS path. Framer would
 * otherwise hand range-mapped values to the native ViewTimeline, which
 * misreads these sticky sections and drifts out of sync with the page.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, offset: ScrollOffset) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useTransform(scrollYProgress, (value) => value);
}

/** Pinned scrollytelling only where there is room for it and motion is welcome. */
export function useCinematic() {
  const reduce = useReducedMotion();
  const roomy = useMediaQuery("(min-width: 900px) and (min-height: 620px)");
  return roomy && !reduce;
}

export function useScrollTo() {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  return useCallback(
    (top: number) => {
      if (lenis && !reduce) {
        lenis.scrollTo(top, { duration: 1.4 });
        return;
      }
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    },
    [lenis, reduce]
  );
}

/* ─── Parts ──────────────────────────────────────────────────────────── */

/** A number on rolling digit wheels. Rolls up from zero on first paint. */
export function Odometer({
  value,
  className,
  minDigits = 1
}: {
  value: number;
  className?: string;
  minDigits?: number;
}) {
  const [ready, setReady] = useState(false);
  const digits = String(value).padStart(minDigits, "0").split("").map(Number);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <span className={clsx(styles.odometer, className)} aria-label={String(value)} role="img">
      {digits.map((digit, index) => (
        <span key={index} className={styles.odometerWindow} aria-hidden>
          <span
            className={styles.odometerStrip}
            style={
              {
                "--digit": ready ? digit : 0,
                "--delay": `${index * 90}ms`
              } as CSSProperties
            }
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;

    const controls = animate(0, value, {
      duration: 1.6,
      ease,
      delay: 0.25,
      onUpdate: (latest) => {
        node.textContent = latest.toFixed(decimals);
      }
    });
    return () => controls.stop();
  }, [inView, value, decimals, reduce]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}

export function ChevronLink({
  href,
  children,
  external = false,
  tone = "light",
  className
}: {
  href: string;
  children: string;
  external?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const classes = clsx(styles.chevronLink, tone === "dark" && styles.chevronLinkDark, className);
  const Icon = external ? ArrowUpRight : ArrowRight;

  if (external) {
    return (
      <a className={clsx(classes, styles.chevronLinkOut)} href={href} target="_blank" rel="noreferrer">
        {children}
        <Icon aria-hidden />
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
      <Icon aria-hidden />
    </Link>
  );
}
