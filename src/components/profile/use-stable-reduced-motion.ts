"use client";

import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Hydration-safe `prefers-reduced-motion` reader. Returns `false` on the
 * server and during the first client render, then the real preference.
 */
export function useStableReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}
