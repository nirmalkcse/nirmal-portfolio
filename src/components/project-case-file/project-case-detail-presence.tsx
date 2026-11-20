"use client";

import { useCallback, type CSSProperties, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type CaseDetailHeroShellProps = {
  children: ReactNode;
  railClassName: string;
};

const resetHeroPresence = (target: HTMLElement) => {
  target.style.setProperty("--case-detail-x", "68%");
  target.style.setProperty("--case-detail-y", "34%");
  target.style.setProperty("--case-detail-tilt-x", "0deg");
  target.style.setProperty("--case-detail-tilt-y", "0deg");
};

export function CaseDetailHeroShell({
  children,
  railClassName
}: CaseDetailHeroShellProps) {
  const prefersReducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tiltX = (50 - pointerY) * 0.018;
      const tiltY = (pointerX - 50) * 0.014;

      event.currentTarget.style.setProperty("--case-detail-x", `${pointerX.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--case-detail-y", `${pointerY.toFixed(2)}%`);
      event.currentTarget.style.setProperty("--case-detail-tilt-x", `${tiltX.toFixed(3)}deg`);
      event.currentTarget.style.setProperty("--case-detail-tilt-y", `${tiltY.toFixed(3)}deg`);
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    resetHeroPresence(event.currentTarget);
  }, []);

  const handleFocus = useCallback((event: FocusEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--case-detail-x", "38%");
    event.currentTarget.style.setProperty("--case-detail-y", "28%");
  }, []);

  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    resetHeroPresence(event.currentTarget);
  }, []);

  return (
    <header
      className="motion-section gold-thread-section case-detail-hero-shell relative overflow-hidden rounded-[var(--radius-case-file)] border border-[var(--border-gold)] bg-[var(--surface-case-file)] shadow-[var(--shadow-surface)]"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={
        {
          "--case-detail-x": "68%",
          "--case-detail-y": "34%",
          "--case-detail-tilt-x": "0deg",
          "--case-detail-tilt-y": "0deg"
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="case-detail-hero-mesh" />
      <span aria-hidden="true" className="case-detail-hero-lens" />
      <span aria-hidden="true" className="case-detail-proof-stream" />
      <span aria-hidden="true" className="case-detail-hero-orbit case-detail-hero-orbit--one" />
      <span aria-hidden="true" className="case-detail-hero-orbit case-detail-hero-orbit--two" />
      <div
        aria-hidden="true"
        className={`motion-thread-rail case-detail-hero-rail absolute inset-y-0 left-0 w-[var(--case-file-rail-width)] ${railClassName}`}
      />
      {children}
    </header>
  );
}
