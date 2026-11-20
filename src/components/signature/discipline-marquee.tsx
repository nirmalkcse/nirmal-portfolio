"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from "framer-motion";
import { useRef } from "react";
import styles from "./discipline-marquee.module.css";

/* Each pair is set two-tone, ink then warm grey, so the ribbon reads as one
   long sentence of what the work actually is. */
const DISCIPLINES = [
  ["Data", "engineering"],
  ["Entity", "resolution"],
  ["Lakehouse", "architecture"],
  ["Validation-led", "migration"],
  ["Governed", "data products"],
  ["Analytics", "you can trust"]
] as const;

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function Run() {
  return (
    <span className={styles.run}>
      {DISCIPLINES.map(([upright, italic]) => (
        <span className={styles.phrase} key={upright}>
          <span>{upright}</span> <em>{italic}</em>
          <span aria-hidden="true" className={styles.mark} />
        </span>
      ))}
    </span>
  );
}

/**
 * A slow editorial ribbon between chapters on the home page. At rest it
 * drifts left; scrolling pushes it faster, and scrolling back up turns it
 * around. Paused off-screen, static under reduced motion.
 */
export function DisciplineMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "20% 0px 20% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  // Four identical runs; each is a quarter of the track, so wrapping between
  // -25% and -50% is seamless.
  const x = useTransform(baseX, (value) => `${wrap(-25, -50, value)}%`);

  useAnimationFrame((_, delta) => {
    if (!inView || prefersReducedMotion) {
      return;
    }

    const factor = velocityFactor.get();

    if (factor < 0) {
      direction.current = -1;
    } else if (factor > 0) {
      direction.current = 1;
    }

    const step = -1.4 * (delta / 1000);
    baseX.set(baseX.get() + direction.current * (step + step * Math.abs(factor)));
  });

  return (
    <section aria-label="Disciplines" className={styles.marquee} ref={sectionRef}>
      <p className={styles.srOnly}>
        {DISCIPLINES.map(([upright, italic]) => `${upright} ${italic}`).join(", ")}.
      </p>
      <div aria-hidden="true" className={styles.viewport}>
        <motion.div className={styles.track} style={{ x }}>
          <Run />
          <Run />
          <Run />
          <Run />
        </motion.div>
      </div>
      <span aria-hidden="true" className={styles.rule} />
    </section>
  );
}
