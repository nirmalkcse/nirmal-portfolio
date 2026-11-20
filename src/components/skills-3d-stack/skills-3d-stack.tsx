"use client";

import { useScroll, useSpring, useTransform, motion, useReducedMotion, useMotionValueEvent, MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { skillClusters } from "@/data/skills";
import type { SkillCluster } from "@/data/types";
import styles from "./skills-3d-stack.module.css";

function Skill3DCard({
  cluster,
  index,
  progress,
  total,
  activeIndex
}: {
  cluster: SkillCluster;
  index: number;
  progress: MotionValue<number>;
  total: number;
  activeIndex: number;
}) {
  const cardIndexProgress = useTransform(progress, (latest) => {
    return latest * (total - 1) - index;
  });

  const isActive = activeIndex === index;

  // The card comes from the back, grows into focus, then pushes up and out
  const z = useTransform(cardIndexProgress, [-1, 0, 1], [-800, 0, 400]);
  const y = useTransform(cardIndexProgress, [-1, 0, 1], ["40%", "0%", "-40%"]);
  const rotateX = useTransform(cardIndexProgress, [-1, 0, 1], [15, 0, -10]);
  const opacity = useTransform(cardIndexProgress, [-1, -0.5, 0, 0.5, 1], [0, 0.5, 1, 0.5, 0]);
  const scale = useTransform(cardIndexProgress, [-1, 0, 1], [0.8, 1, 1.1]);
  
  // Custom blur filter (safari requires webkit-filter)
  const blurValue = useTransform(cardIndexProgress, [-1, 0, 1], [12, 0, 24]);

  return (
    <motion.article
      aria-hidden={!isActive}
      className={styles.skillCard}
      style={{
        z,
        y,
        rotateX,
        opacity,
        scale,
        filter: useTransform(blurValue, (b) => `blur(${b}px)`)
      }}
    >
      <div className={styles.cardGlow} aria-hidden="true" />
      <div className={styles.cardHeader}>
        <div className={styles.iconFrame}>
          <div className={styles.iconCore} />
        </div>
        <p className={styles.cardTitle}>{cluster.title}</p>
        <p className={styles.cardRole}>{cluster.portfolioRole}</p>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.publicFraming}>{cluster.publicFraming}</p>
        
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <strong>{cluster.evidenceProjects.length}</strong>
            <span>Case files</span>
          </div>
          <div className={styles.metric}>
            <strong>{cluster.relatedCredentials.length}</strong>
            <span>Credentials</span>
          </div>
          <div className={styles.metric}>
            <strong>{cluster.proofPoints.length}</strong>
            <span>Proof points</span>
          </div>
        </div>

        <div className={styles.tagsArea}>
          {cluster.canonicalSkills.slice(0, 6).map((skill) => (
            <span key={skill} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>

        <ul className={styles.proofList}>
          {cluster.proofPoints.slice(0, 3).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <Link className={styles.cta} href="/proof">
          Review proof map
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export function Skills3DStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 74,
    damping: 26,
    restDelta: 0.0006
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const rawIndex = latest * (skillClusters.length - 1);
    const index = Math.min(
      Math.max(Math.round(rawIndex), 0),
      skillClusters.length - 1
    );
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const railProgress = useTransform(smoothProgress, [0, 1], [0.06, 1]);

  if (prefersReducedMotion) {
    return (
      <section className={styles.reducedMotionSection}>
        <div className={styles.reducedMotionHeader}>
          <h2 className={styles.sectionTitle}>Capability Proof Room</h2>
          <p className={styles.sectionDesc}>Core competencies backed by evidence.</p>
        </div>
        <div className={styles.reducedGrid}>
          {skillClusters.map((cluster) => (
            <div key={cluster.id} className={styles.fallbackCard}>
              <h3>{cluster.title}</h3>
              <p>{cluster.publicFraming}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={styles.immersiveSection}>
      <div className={styles.stickyContainer}>
        
        <div className={styles.textColumn}>
          <p className={styles.eyebrow}>Capability proof room</p>
          <h2 className={styles.sectionTitle}>
            Measurable depth across the data stack.
          </h2>
          <p className={styles.sectionDesc}>
            A complete map of core competencies, each backed by deployed systems, 
            verifiable code, and direct business impact.
          </p>

          <div className={styles.progressRail} aria-hidden="true">
            <motion.div className={styles.progressFill} style={{ scaleY: railProgress }} />
          </div>
          <div className={styles.pathIndicator}>
            <em>Path {String(activeIndex + 1).padStart(2, "0")} / {String(skillClusters.length).padStart(2, "0")}</em>
          </div>
        </div>

        <div className={styles.stackColumn}>
          <div className={styles.perspectiveStage}>
            {skillClusters.map((cluster, index) => (
              <Skill3DCard
                activeIndex={activeIndex}
                cluster={cluster}
                index={index}
                key={cluster.id}
                progress={smoothProgress}
                total={skillClusters.length}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
