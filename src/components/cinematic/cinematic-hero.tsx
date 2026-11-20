"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Database,
  Command,
  Activity,
  Layers
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useHeroReveal } from "@/context/hero-reveal-context";
import { CinematicBackground } from "./cinematic-background";
import styles from "./cinematic-hero.module.css";
import { profile } from "@/data";

// The entrance signature: a rising music-box bloom (C4→G4→C5→E5) in the same
// voice as the scroll chimes — the opening of the phrase the footer's arrival
// cadence resolves — under a faint breath of air. One sonic identity across
// the whole site.
function playEntranceSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Rising music-box bloom, low-passed so it stays felt-soft
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;
    filter.Q.value = 0.3;
    filter.connect(ctx.destination);

    const bloom: Array<[number, number, number]> = [
      // [frequency, start offset, peak gain]
      [261.63, 0, 0.014],
      [392.0, 0.12, 0.014],
      [523.25, 0.24, 0.016],
      [659.25, 0.36, 0.018],
    ];
    for (const [freq, offset, peak] of bloom) {
      const start = now + offset;
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, start);
      noteGain.gain.linearRampToValueAtTime(peak, start + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.3);
      noteGain.connect(filter);
      const partials: Array<[number, number]> = [
        [freq, 1],
        [freq * 2, 0.2],
      ];
      for (const [frequency, amplitude] of partials) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, start);
        const partialGain = ctx.createGain();
        partialGain.gain.value = amplitude;
        osc.connect(partialGain);
        partialGain.connect(noteGain);
        osc.start(start);
        osc.stop(start + 1.4);
      }
    }

    // 3) A barely-there breath of air swelling under the bloom
    const noiseLength = Math.floor(ctx.sampleRate * 1.4);
    const buffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < noiseLength; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 750;
    noiseFilter.Q.value = 0.9;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.012, now + 0.5);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.4);
  } catch {
    // Ignore audio errors
  }
}

export function CinematicHero() {
  const { isRevealed, isReturnVisit, setRevealed } = useHeroReveal();
  // A first entrance is staged behind the gate; a return visit just settles.
  const lead = isReturnVisit ? 0.15 : 1.0;
  const router = useRouter();
  const lenis = useLenis();
  // Scroll to Selected work on Lenis' own curve (native smooth scrolling
  // under Lenis stutters as the two fight over the position).
  const scrollToWork = () => {
    const target = document.getElementById("projects");
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  const heroRef = useRef<HTMLDivElement>(null);
  // Where the click-shockwave radiates from (the button's centre, in viewport px)
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

  // Scroll-linked parallax: track how far the hero has been scrolled past
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const copyY = useTransform(heroScroll, [0, 1], ["0%", "-80%"]);
  const copyOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const cardY = useTransform(heroScroll, [0, 1], ["0%", "-150%"]);
  const cardZ = useTransform(heroScroll, [0, 1], [0, -300]);
  const cardScale = useTransform(heroScroll, [0, 1], [1, 0.75]);
  const cardRotateX = useTransform(heroScroll, [0, 1], [0, 20]); // tilts back as if falling away
  const cardOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const cueOpacity = useTransform(heroScroll, [0, 0.12], [1, 0]);

  const handleReveal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    playEntranceSound();
    setRevealed(true);
    // Prefetch the portfolio route while they look at the complex hero
    router.prefetch("/projects");
  };

  useEffect(() => {
    if (!isRevealed) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isRevealed]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage for smoother gradient tracking
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    e.currentTarget.style.setProperty("--mouse-x-pct", `${xPercent}%`);
    e.currentTarget.style.setProperty("--mouse-y-pct", `${yPercent}%`);
  };

  const [firstName, lastName] = profile.displayName.split(" ");

  return (
    <div ref={heroRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <section className={styles.hero} id="home" onMouseMove={handleSectionMouseMove} style={{ pointerEvents: 'auto' }}>
      <CinematicBackground />
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div 
            key="minimal-layout"
            className={styles.innerMinimal}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <h1 className={styles.titleMinimal}>
              <motion.span 
                layoutId="hero-title-first"
                className={styles.titleWord}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              >
                {firstName}
              </motion.span>
              <motion.span 
                layoutId="hero-title-last"
                className={styles.titleWord}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              >
                {lastName}
              </motion.span>
            </h1>
            
            <motion.button 
              layoutId="hero-cta"
              onClick={handleReveal}
              onMouseMove={handleMouseMove}
              className={styles.ctaMinimal}
              aria-label="View portfolio"
              transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            >
              View portfolio
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="complex-layout"
            className={styles.inner}
          >
            
            {/* LEFT COLUMN: Copy & Actions */}
            <motion.div className={styles.copy} style={{ y: copyY, opacity: copyOpacity }}>
              <h1 className={styles.title}>
                <motion.span 
                  layoutId={isReturnVisit ? undefined : "hero-title-first"}
                  className={styles.titleWord}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                >
                  {firstName}
                </motion.span>
                <motion.span 
                  layoutId={isReturnVisit ? undefined : "hero-title-last"}
                  className={styles.titleWord}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                >
                  {lastName}
                </motion.span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: lead }}
                className={styles.role}
              >
                Data Engineer · Product Engineer
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: lead }}
                className={styles.summary}
              >
                Building Microsoft Fabric, Databricks, SQL, PySpark, and Power BI systems for migration, validation, and reporting trust.
              </motion.p>
              
              <div className={styles.actions}>
                <motion.div 
                  layoutId={isReturnVisit ? undefined : "hero-cta"}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Link 
                    href="#projects"
                    className={styles.ctaPrimary}
                    aria-label="View selected work"
                    onMouseMove={handleMouseMove}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToWork();
                    }}
                  >
                    View selected work
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: lead }}
                >
                  <Link 
                    href="/resume"
                    className={styles.ctaSecondary}
                    aria-label="View resume"
                  >
                    Resume
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: lead }}
                >
                  <Link 
                    href="/profile"
                    className={styles.ctaSecondary}
                    aria-label="Contact"
                  >
                    Contact
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.visual}
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95, y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: lead, type: "spring", stiffness: 50, damping: 20 }}
              style={{ y: cardY, z: cardZ, scale: cardScale, opacity: cardOpacity, rotateX: cardRotateX, transformPerspective: 1200 }}
            >
              <div className={styles.mapCard}>
                
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    <Command size={14} strokeWidth={1.5} />
                    BLUEPRINT
                  </div>
                  <div>01</div>
                </div>

                <div className={styles.cardTitleSection}>
                  <span className={styles.cardTitleEyebrow}>VISION</span>
                  <h2 className={styles.cardTitle}>
                    Unified intelligence.
                  </h2>
                </div>

                <ul className={styles.cardList}>
                  <li>
                    <Link className={styles.cardItem} href="/projects/icore-enterprise-mdm-entity-resolution">
                      <div className={styles.itemIconWrapper}>
                        <Layers size={16} strokeWidth={2} />
                      </div>
                      <div className={styles.itemCopy}>
                        <span className={styles.itemTitle}>Architecture</span>
                        <span className={styles.itemDesc}>Entity resolution & governance.</span>
                      </div>
                      <ArrowRight size={14} strokeWidth={1.5} className={styles.itemArrow} aria-hidden="true" />
                    </Link>
                  </li>

                  <li>
                    <Link className={styles.cardItem} href="/projects/telecom-fabric-migration-poc">
                      <div className={styles.itemIconWrapper}>
                        <Database size={16} strokeWidth={2} />
                      </div>
                      <div className={styles.itemCopy}>
                        <span className={styles.itemTitle}>Fabric</span>
                        <span className={styles.itemDesc}>Medallion scale deployment.</span>
                      </div>
                      <ArrowRight size={14} strokeWidth={1.5} className={styles.itemArrow} aria-hidden="true" />
                    </Link>
                  </li>

                  <li>
                    <Link className={styles.cardItem} href="/projects/bi-migration-validation-analytics">
                      <div className={styles.itemIconWrapper}>
                        <Activity size={16} strokeWidth={2} />
                      </div>
                      <div className={styles.itemCopy}>
                        <span className={styles.itemTitle}>Assurance</span>
                        <span className={styles.itemDesc}>Uncompromising data trust.</span>
                      </div>
                      <ArrowRight size={14} strokeWidth={1.5} className={styles.itemArrow} aria-hidden="true" />
                    </Link>
                  </li>
                </ul>

                <div className={styles.cardFooter}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>IMPACT</span>
                    <strong className={styles.statValue}>90%</strong>
                    <span className={styles.statDesc}>fewer discrepancies</span>
                  </div>
                  
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>SCALE</span>
                    <strong className={styles.statValue}>3</strong>
                    <span className={styles.statDesc}>source systems</span>
                  </div>
                  
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>TRUST</span>
                    <strong className={styles.statValue}>8</strong>
                    <span className={styles.statDesc}>credentials</span>
                  </div>
                </div>

              </div>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll cue: a brass bead travelling down a hairline, gone as soon
          as the visitor starts scrolling. */}
      {isRevealed && (
        <motion.div className={styles.scrollCue} style={{ opacity: cueOpacity }}>
          <motion.a
            aria-label="Scroll to selected work"
            className={styles.scrollCueLink}
            href="#projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: isReturnVisit ? 0.6 : 1.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => {
              event.preventDefault();
              scrollToWork();
            }}
          >
            <span className={styles.scrollCueLabel}>Scroll</span>
            <span aria-hidden="true" className={styles.scrollCueTrack}>
              <span className={styles.scrollCueBead} />
            </span>
          </motion.a>
        </motion.div>
      )}
      </section>

      {/* Click shockwave — a warm light bloom radiates from the button, two
          bronze rings ripple after it, timed to the rising notes of the
          entrance sound. Renders once per reveal, then cleans itself up. */}
      {burst && (
        <div
          aria-hidden="true"
          style={{ position: "fixed", left: burst.x, top: burst.y, zIndex: 9999, pointerEvents: "none" }}
        >
          <motion.span
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute", left: "50%", top: "50%",
              width: "90vmax", height: "90vmax", marginLeft: "-45vmax", marginTop: "-45vmax",
              borderRadius: "9999px",
              background: "radial-gradient(circle, rgba(255,248,238,0.95) 0%, rgba(214,187,158,0.35) 32%, transparent 68%)",
            }}
          />
          {[0, 0.16].map((delay, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.04, opacity: 0.55 - i * 0.2 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1.3 + i * 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={i === 1 ? () => setBurst(null) : undefined}
              style={{
                position: "absolute", left: "50%", top: "50%",
                width: "150vmax", height: "150vmax", marginLeft: "-75vmax", marginTop: "-75vmax",
                borderRadius: "9999px",
                border: "1.5px solid rgba(154,86,55,0.55)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
