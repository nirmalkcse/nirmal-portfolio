"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./route-curtain.module.css";

type Arrival = { key: number; title: string; summary: string };

/* One calm line per destination, written for the card rather than reused
   from the route registry (whose descriptions are notes to ourselves). */
const OPENERS: Record<string, Omit<Arrival, "key">> = {
  "/proof": { title: "Skills", summary: "The tools, and the work that proves each one." },
  "/projects": {
    title: "Work",
    summary: "Selected case studies across Fabric, Databricks and BI validation."
  },
  "/certifications": {
    title: "Credentials",
    summary: "Microsoft, Databricks and cloud credentials, grouped by platform."
  },
  "/timeline": { title: "Timeline", summary: "Education, roles, projects and credentials in one arc." },
  "/journey": { title: "Journey", summary: "The work told through five elements, bedrock to night sky." },
  "/profile": { title: "Contact", summary: "LinkedIn first, with a one-page résumé close at hand." },
  "/testimonials": { title: "Reviews", summary: "What colleagues say, with their names attached." },
  "/future-projects": {
    title: "Learning",
    summary: "Demos in progress, promoted only once there is public proof."
  },
  "/resume": { title: "Résumé", summary: "One page for a first read; the master copy for depth." },
  "/documents": { title: "Documents", summary: "Résumé files and the proof routes behind them." }
};

function describeRoute(pathname: string): Omit<Arrival, "key"> {
  if (pathname.startsWith("/projects/")) {
    return {
      title: "Case study",
      summary: "The problem, the system that answered it, and the decisions in between."
    };
  }

  return (
    OPENERS[pathname] ?? {
      title: "Not in the index",
      summary: "The page you asked for isn’t here; the work still is."
    }
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The arrival title card, set like a chapter opener: the destination's name
 * in the display serif, ranged left on the page gutter, a hairline, and the
 * route's own one-line description beneath it. It is in place on the first
 * painted frame of the new route and lifts away under the header, so the
 * nav's sliding pill and the title read as one gesture. Never on first load,
 * never on the way back to home, never under reduced motion.
 */
export function RouteCurtain() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const previousPath = useRef(pathname);
  const [arrival, setArrival] = useState<Arrival | null>(null);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) {
      return;
    }

    previousPath.current = pathname;

    // Home has its own entrance (the splash and hero), so it arrives bare.
    if (prefersReducedMotion || pathname === "/") {
      return;
    }

    // Layout effect: the sheet is committed before the browser paints the
    // new route, so there is never a frame of the page without its cover.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArrival({ key: Date.now(), ...describeRoute(pathname) });
  }, [pathname, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {arrival ? (
        <motion.div
          aria-hidden="true"
          className={styles.curtain}
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          exit={{ opacity: 0 }}
          key={arrival.key}
          onAnimationComplete={() => setArrival(null)}
          transition={{ duration: 0.8, delay: 0.52, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className={styles.opener}>
            <span className={styles.titleMask}>
              <motion.span
                animate={{ y: "0%" }}
                className={styles.title}
                initial={{ y: "102%" }}
                transition={{ duration: 0.6, ease }}
              >
                {arrival.title}
              </motion.span>
            </span>
            <motion.span
              animate={{ scaleX: 1 }}
              className={styles.rule}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
            />
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className={styles.summary}
              initial={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.5, delay: 0.18, ease }}
            >
              {arrival.summary}
            </motion.p>
          </div>
          <span className={styles.edge} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
