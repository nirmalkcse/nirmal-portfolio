"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./route-transition-layer.module.css";

type TransitionPhase = "idle" | "depart" | "arrive";

const TRANSITION_EASE = [0.16, 1, 0.3, 1] as const;
const TRANSITION_INTENT_KEY = "nk-route-transition-intent";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function getTransitionAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLAnchorElement>("a[href]");
}

function getLocalRouteDestination(anchor: HTMLAnchorElement, pathname: string) {
  if (anchor.target && anchor.target !== "_self") {
    return null;
  }

  if (anchor.hasAttribute("download")) {
    return null;
  }

  const destination = new URL(anchor.href, window.location.href);

  if (destination.origin !== window.location.origin) {
    return null;
  }

  if (destination.pathname === pathname && destination.hash) {
    return null;
  }

  return destination.pathname !== pathname ? destination : null;
}

function rememberTransitionIntent(destinationPathname: string) {
  try {
    window.sessionStorage.setItem(
      TRANSITION_INTENT_KEY,
      JSON.stringify({ pathname: destinationPathname, at: Date.now() })
    );
  } catch {
    // Session storage is a progressive enhancement for preserving the arrival phase.
  }
}

function consumeTransitionIntent(pathname: string) {
  try {
    const storedIntent = window.sessionStorage.getItem(TRANSITION_INTENT_KEY);

    if (!storedIntent) {
      return false;
    }

    const parsedIntent = JSON.parse(storedIntent) as {
      pathname?: unknown;
      at?: unknown;
    };
    const isRecent =
      typeof parsedIntent.at === "number" && Date.now() - parsedIntent.at < 2600;
    const matchesPathname = parsedIntent.pathname === pathname;

    if (!isRecent || matchesPathname) {
      window.sessionStorage.removeItem(TRANSITION_INTENT_KEY);
    }

    return isRecent && matchesPathname;
  } catch {
    return false;
  }
}

export function RouteTransitionLayer() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    function clearActiveTimer() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function handleRouteIntent(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const anchor = getTransitionAnchor(event.target);
      const destination = anchor ? getLocalRouteDestination(anchor, pathname) : null;

      if (!destination) {
        return;
      }

      clearActiveTimer();
      rememberTransitionIntent(destination.pathname);
      setPhase("depart");
      timeoutRef.current = window.setTimeout(() => {
        setPhase("idle");
      }, 250);
    }

    document.addEventListener("click", handleRouteIntent, true);

    return () => {
      document.removeEventListener("click", handleRouteIntent, true);
      clearActiveTimer();
    };
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      previousPathname.current = pathname;
      return;
    }

    const pathnameChanged = previousPathname.current !== pathname;
    const hasRecentTransitionIntent = consumeTransitionIntent(pathname);

    if (!pathnameChanged && !hasRecentTransitionIntent) {
      return;
    }

    previousPathname.current = pathname;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setPhase("arrive");
    timeoutRef.current = window.setTimeout(() => {
      setPhase("idle");
    }, 250);
  }, [pathname, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {phase !== "idle" ? (
        <motion.div
          aria-hidden="true"
          className={styles.layer}
          data-phase={phase}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01 }}
        >
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "depart" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "depart" ? 0.15 : 0.25, ease: TRANSITION_EASE }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
