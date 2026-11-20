"use client";

import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { certifications } from "@/data/certifications";
import { brickbuilderRecognition as recognition } from "@/data/recognition";
import { SealMark } from "./recognition-seal";
import styles from "./highlights-rail.module.css";

type Highlight = {
  id: string;
  tone: "lacquer" | "paper";
  href: string;
  linkLabel: string;
  /** The large figure or mark at the top of the card. */
  figure: "seal" | string;
  title: string;
  detail: string;
};

/* Every figure here is stated in src/data: the BI case study (15+ reports,
   90% fewer discrepancies), the certification list, and the recognition. */
const highlights: readonly Highlight[] = [
  {
    id: "brickbuilder",
    tone: "lacquer",
    href: `/projects/${recognition.projectSlug}`,
    linkLabel: "Read the iCORE case study",
    figure: "seal",
    title: recognition.title,
    detail: `${recognition.productName}. ${recognition.line} ${recognition.role}`
  },
  {
    id: "discrepancies",
    tone: "paper",
    href: "/projects/bi-migration-validation-analytics",
    linkLabel: "See how it was measured",
    figure: "90%",
    title: "Fewer validation discrepancies.",
    detail: "SQL reconciliation and report-level parity checks across BI migrations."
  },
  {
    id: "reports",
    tone: "paper",
    href: "/projects/bi-migration-validation-analytics",
    linkLabel: "Read the case study",
    figure: "15+",
    title: "Migrated reports, validated.",
    detail: "MicroStrategy to Fabric, checked against the original until every number agreed."
  },
  {
    id: "credentials",
    tone: "paper",
    href: "/certifications",
    linkLabel: "View the credentials",
    figure: String(certifications.length),
    title: "Professional credentials.",
    detail: "Microsoft Fabric and Databricks, with Google, Oracle and GitHub alongside."
  }
];

const DRAG_THRESHOLD = 6;

/**
 * A row of proof cards on the home page, just before Credentials: swipe on touch,
 * drag or use the arrows with a mouse, Tab through with a keyboard. Native
 * horizontal scrolling with snap points, so it never fights the page scroll.
 */
export function HighlightsRail() {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean; id: number } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-card]");
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  /* Mouse drag-to-scroll. Touch and pen keep native swiping. */
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !trackRef.current) return;
    drag.current = {
      x: event.clientX,
      scroll: trackRef.current.scrollLeft,
      moved: false,
      id: event.pointerId
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const track = trackRef.current;
    if (!state || !track) return;
    const delta = event.clientX - state.x;
    if (!state.moved && Math.abs(delta) > DRAG_THRESHOLD) {
      state.moved = true;
      track.setPointerCapture(state.id);
      track.dataset.dragging = "true";
    }
    if (state.moved) {
      track.scrollLeft = state.scroll - delta;
    }
  };

  const endDrag = () => {
    const track = trackRef.current;
    const state = drag.current;
    drag.current = null;
    if (!track || !state?.moved) return;
    if (track.hasPointerCapture(state.id)) track.releasePointerCapture(state.id);
    delete track.dataset.dragging;
    // Let snapping settle on the nearest card after a drag.
    const card = track.querySelector<HTMLElement>("[data-card]");
    if (card) {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const unit = card.offsetWidth + gap;
      track.scrollTo({
        left: Math.round(track.scrollLeft / unit) * unit,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }
    // Swallow the click that ends a drag so a card isn't opened by accident.
    const swallow = (click: MouseEvent) => {
      click.preventDefault();
      click.stopPropagation();
    };
    track.addEventListener("click", swallow, { capture: true, once: true });
    window.setTimeout(() => track.removeEventListener("click", swallow, { capture: true }), 0);
  };

  return (
    <section aria-labelledby="highlights-title" className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title} id="highlights-title">
          Highlights. <span className={styles.tail}>The short version of the work.</span>
        </h2>
      </div>

      <div
        className={styles.track}
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerLeave={endDrag}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        ref={trackRef}
      >
        {highlights.map((highlight, index) => (
          <motion.div
            className={styles.cardSlot}
            data-card
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            key={highlight.id}
            transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Link
              className={clsx(styles.card, highlight.tone === "lacquer" && styles.cardLacquer)}
              draggable={false}
              href={highlight.href}
            >
              <span className={styles.figure}>
                {highlight.figure === "seal" ? (
                  <SealMark className={styles.figureSeal} />
                ) : (
                  highlight.figure
                )}
              </span>
              <span className={styles.copy}>
                <span className={styles.cardTitle}>{highlight.title}</span>
                <span className={styles.cardDetail}>{highlight.detail}</span>
              </span>
              <span className={styles.cardLink}>
                {highlight.linkLabel} <span aria-hidden="true">›</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          aria-label="Previous highlight"
          className={styles.control}
          disabled={edges.start}
          onClick={() => step(-1)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M14.5 6.5 9 12l5.5 5.5" />
          </svg>
        </button>
        <button
          aria-label="Next highlight"
          className={styles.control}
          disabled={edges.end}
          onClick={() => step(1)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9.5 6.5 15 12l-5.5 5.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
