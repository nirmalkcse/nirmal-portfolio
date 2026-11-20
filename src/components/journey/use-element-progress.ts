"use client";

import { useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, type RefObject } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Quintic ease: zero velocity at both ends, so a segue lands without a bump. */
const smoother = (p: number) => p * p * p * (p * (p * 6 - 15) + 10);

/**
 * Continuous element progress, 0 (earth) → 4 (ether).
 *
 * Each segue section owns one unit of travel. Inside a chapter the value is
 * an integer, so the field holds its pure element while the chapter plays;
 * across a segue it eases to the next integer while nothing else competes.
 */
export function useElementProgress(
  segueRefs: readonly RefObject<HTMLElement | null>[],
  enabled: boolean
) {
  const element = useMotionValue(0);
  const { scrollY } = useScroll();
  const metrics = useRef<{ top: number; travel: number }[]>([]);

  const compute = useCallback(
    (y: number) => {
      let total = 0;
      for (const metric of metrics.current) {
        total += smoother(clamp01((y - metric.top) / metric.travel));
      }
      element.set(total);
    },
    [element]
  );

  const measure = useCallback(() => {
    const viewport = window.innerHeight;
    metrics.current = segueRefs.map((ref) => {
      const node = ref.current;
      if (!node) return { top: 0, travel: 1 };
      const rect = node.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        travel: Math.max(1, node.offsetHeight - viewport)
      };
    });
    compute(window.scrollY);
  }, [compute, segueRefs]);

  useEffect(() => {
    if (!enabled) return;
    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled, measure]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!enabled) return;
    compute(latest);
  });

  return element;
}
