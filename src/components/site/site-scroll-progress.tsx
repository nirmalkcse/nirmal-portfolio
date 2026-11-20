"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function SiteScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 32,
    mass: 0.22,
    stiffness: 150
  });

  return (
    <div aria-hidden="true" className="site-scroll-progress">
      <motion.span
        className="site-scroll-progress__fill"
        style={{ scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress }}
      />
    </div>
  );
}
