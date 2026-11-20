"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Download, LoaderCircle } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from "react";

type DownloadPhase = "idle" | "preparing" | "complete";

type DownloadLinkProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  download: string;
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const completeDelay = 640;
const resetDelay = 1900;

export function DownloadLink({
  ariaLabel,
  children,
  className,
  download,
  href,
  onClick
}: DownloadLinkProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<DownloadPhase>("idle");
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
      }

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
    }

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    setPhase("preparing");
    completeTimerRef.current = setTimeout(() => {
      setPhase("complete");
    }, completeDelay);
    resetTimerRef.current = setTimeout(() => {
      setPhase("idle");
    }, resetDelay);
  }

  const Icon =
    phase === "complete" ? CheckCircle2 : phase === "preparing" ? LoaderCircle : Download;
  const status =
    phase === "preparing"
      ? "Preparing download"
      : phase === "complete"
        ? "Download started"
        : "";

  return (
    <a
      aria-label={ariaLabel}
      className={clsx("download-link", className)}
      data-download-phase={phase}
      download={download}
      href={href}
      onClick={handleClick}
    >
      <span aria-hidden="true" className="download-link__icon">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="download-link__icon-glyph"
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: -4 }
            }
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, scale: 0.9, y: 4 }
            }
            key={phase}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.18,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <Icon
              aria-hidden="true"
              className={clsx(
                "h-4 w-4",
                phase === "preparing" && "download-link__spinner"
              )}
            />
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="download-link__label">{children}</span>
      <span aria-hidden="true" className="download-link__progress" />
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
    </a>
  );
}
