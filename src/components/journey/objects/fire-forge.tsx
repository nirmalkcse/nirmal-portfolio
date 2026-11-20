"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import o from "./objects.module.css";

/* ─── Fire: the forge ────────────────────────────────────────────────
   Every strike validates a report. Discrepancies burn down from 100%
   toward 10%; the last six strikes re-forge Tableau into Power BI. Hold
   the anvil to keep striking. */

const TOTAL_REPORTS = 15;
const TABLEAU_REPORTS = 6;
const GAUGE_R = 54;
const GAUGE_C = 2 * Math.PI * GAUGE_R;

type Spark = { id: number; dx: number; dy: number; angle: number; delay: number };

function discrepancyAfter(strikes: number) {
  const remaining = 1 - Math.min(1, strikes / TOTAL_REPORTS);
  return 10 + 90 * Math.pow(remaining, 1.7);
}

export function FireForge({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const id = useId().replace(/:/g, "");
  const [strikes, setStrikes] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [hot, setHot] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const hotTimer = useRef<number | null>(null);
  const sparkId = useRef(0);

  const strike = useCallback(() => {
    setStrikes((current) => {
      if (current >= TOTAL_REPORTS) return current;
      return current + 1;
    });
    const burst: Spark[] = Array.from({ length: 12 }, (_, index) => {
      const angle = -Math.PI * (0.1 + Math.random() * 0.8);
      const distance = 50 + Math.random() * 90;
      return {
        id: sparkId.current++,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        angle: (angle * 180) / Math.PI,
        delay: index * 10
      };
    });
    setSparks((current) => [...current.slice(-36), ...burst]);
    window.setTimeout(() => {
      setSparks((current) => current.filter((spark) => !burst.some((b) => b.id === spark.id)));
    }, 850);
    setHot(true);
    if (hotTimer.current) window.clearTimeout(hotTimer.current);
    hotTimer.current = window.setTimeout(() => setHot(false), 180);
  }, []);

  const stopHold = useCallback(() => {
    if (holdTimer.current) {
      window.clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const startHold = () => {
    strike();
    stopHold();
    holdTimer.current = window.setInterval(strike, 240);
  };

  useEffect(() => stopHold, [stopHold]);
  useEffect(() => {
    if (strikes >= TOTAL_REPORTS) stopHold();
  }, [strikes, stopHold]);

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
      event.preventDefault();
      strike();
    }
  };

  const done = strikes >= TOTAL_REPORTS;
  const discrepancy = discrepancyAfter(strikes);
  const migrated = Math.max(0, Math.min(TABLEAU_REPORTS, strikes - (TOTAL_REPORTS - TABLEAU_REPORTS)));
  const gaugeOffset = GAUGE_C * (1 - (100 - discrepancy) / 100);
  const glow = done ? 0.55 : hot ? 1 : 0.75;

  return (
    <div className={o.object} data-tone={tone}>
      <div className={o.objectHead}>
        <span className={o.objectTitle}>The forge</span>
        <span className={o.objectHint}>Strike, or hold</span>
      </div>

      <div className={o.forgeStage} data-hot={hot ? "true" : "false"}>
        <button
          type="button"
          className={o.anvilButton}
          aria-label={done ? "All reports validated" : "Strike the forge to validate a report"}
          aria-describedby={`${id}-progress`}
          aria-disabled={done}
          onPointerDown={(event) => {
            if (done) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            startHold();
          }}
          onPointerUp={stopHold}
          onPointerCancel={stopHold}
          onPointerLeave={stopHold}
          onKeyDown={done ? undefined : handleKey}
          onContextMenu={(event) => event.preventDefault()}
        >
          <svg className={o.anvilSvg} viewBox="0 0 340 250" aria-hidden="true">
            <defs>
              <linearGradient id={`${id}-ingot`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={done ? "#fbe7b6" : hot ? "#fff6e3" : "#ffd08a"} />
                <stop offset="45%" stopColor={done ? "#e2bd7a" : hot ? "#ffb257" : "#ff8a3a"} />
                <stop offset="100%" stopColor={done ? "#b98a50" : hot ? "#ff7a2e" : "#b53a1a"} />
              </linearGradient>
              <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5c524b" />
                <stop offset="18%" stopColor="#2e2622" />
                <stop offset="100%" stopColor="#120d0b" />
              </linearGradient>
              <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3a302b" />
                <stop offset="35%" stopColor="#6a5f57" />
                <stop offset="60%" stopColor="#4a403a" />
                <stop offset="100%" stopColor="#2a221e" />
              </linearGradient>
              <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9a6a3e" />
                <stop offset="55%" stopColor="#6e4628" />
                <stop offset="100%" stopColor="#4a2e18" />
              </linearGradient>
              <linearGradient id={`${id}-head`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8d847c" />
                <stop offset="40%" stopColor="#4e4640" />
                <stop offset="100%" stopColor="#1f1a17" />
              </linearGradient>
              <radialGradient id={`${id}-pool`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,150,70,0.9)" />
                <stop offset="50%" stopColor="rgba(255,110,40,0.35)" />
                <stop offset="100%" stopColor="rgba(255,110,40,0)" />
              </radialGradient>
              <pattern id={`${id}-brush`} width="4" height="3" patternUnits="userSpaceOnUse">
                <rect width="4" height="1" fill="rgba(255,255,255,0.05)" />
              </pattern>
              <filter id={`${id}-blur-s`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id={`${id}-blur-l`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
              <filter id={`${id}-haze`} x="-20%" y="-40%" width="140%" height="180%">
                <feTurbulence type="fractalNoise" baseFrequency="0.018 0.06" numOctaves="2" seed="3" result="noise">
                  <animate attributeName="baseFrequency" dur="3.2s" values="0.018 0.06;0.024 0.075;0.018 0.06" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* light pooled on the floor */}
            <ellipse cx="170" cy="188" rx="150" ry="46" fill={`url(#${id}-pool)`} opacity={glow} />

            {/* heat rising */}
            <g filter={`url(#${id}-haze)`} opacity={glow}>
              <ellipse cx="170" cy="120" rx="70" ry="34" fill="rgba(255,150,70,0.55)" filter={`url(#${id}-blur-l)`} />
              <ellipse cx="170" cy="112" rx="46" ry="20" fill="rgba(255,205,140,0.7)" filter={`url(#${id}-blur-s)`} />
            </g>

            {/* anvil: body, horn, face */}
            <path d="M 70 158 L 270 158 L 246 178 L 206 178 L 216 214 L 124 214 L 134 178 L 94 178 Z" fill={`url(#${id}-steel)`} />
            <path d="M 70 158 L 270 158 L 246 178 L 206 178 L 216 214 L 124 214 L 134 178 L 94 178 Z" fill={`url(#${id}-brush)`} />
            <path d="M 70 158 L 50 140 L 82 134 L 258 134 L 290 142 L 270 158 Z" fill={`url(#${id}-top)`} />
            <rect x="50" y="130" width="240" height="5" rx="2.5" fill="#7a6d63" />
            <rect x="50" y="130" width="240" height="2" rx="1" fill="rgba(255,255,255,0.35)" />
            <path d="M 50 140 L 82 134 L 82 138 L 54 144 Z" fill="rgba(255,255,255,0.12)" />

            {/* the ingot, with its own light */}
            <motion.g animate={{ scaleY: hot ? 0.9 : 1, y: hot ? 5 : 0 }} transition={{ duration: 0.18 }} style={{ transformOrigin: "170px 130px" }}>
              <rect x="120" y="96" width="100" height="34" rx="8" fill={`url(#${id}-ingot)`} opacity="0.8" filter={`url(#${id}-blur-s)`} />
              <rect x="120" y="96" width="100" height="34" rx="8" fill={`url(#${id}-ingot)`} />
              <rect x="128" y="102" width="84" height="5" rx="2.5" fill="rgba(255,255,255,0.45)" />
              <rect x="120" y="122" width="100" height="8" rx="4" fill="rgba(80,20,5,0.35)" />
            </motion.g>

            {/* impact: a ring of light where the head lands */}
            <motion.circle
              cx="170"
              cy="100"
              r="26"
              fill="none"
              stroke="rgba(255,220,160,0.9)"
              strokeWidth="2"
              initial={false}
              animate={hot ? { scale: [0.2, 1.4], opacity: [0.9, 0] } : { scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ transformOrigin: "170px 100px" }}
            />

            {/* the hammer: held at the upper right, swung down onto the ingot */}
            <motion.g
              initial={false}
              animate={{ rotate: hot ? -18 : 38 }}
              transition={hot ? { type: "spring", stiffness: 900, damping: 30 } : { type: "spring", stiffness: 140, damping: 18 }}
              style={{ transformOrigin: "298px 58px" }}
            >
              <g transform="translate(298 58)">
                {/* handle: from the grip, out to the head */}
                <rect x="-146" y="-4" width="150" height="8" rx="4" fill={`url(#${id}-wood)`} />
                <rect x="-146" y="-4" width="150" height="3" rx="1.5" fill="rgba(255,255,255,0.18)" />
                <rect x="-30" y="-5" width="34" height="10" rx="5" fill="#2a211c" />
                <rect x="-28" y="-5" width="2" height="10" fill="rgba(255,255,255,0.12)" />
                <rect x="-22" y="-5" width="2" height="10" fill="rgba(255,255,255,0.12)" />
                <rect x="-16" y="-5" width="2" height="10" fill="rgba(255,255,255,0.12)" />
                {/* head: a steel block, face down toward the ingot */}
                <rect x="-164" y="-14" width="40" height="30" rx="4" fill={`url(#${id}-head)`} />
                <rect x="-164" y="-14" width="40" height="7" rx="3" fill="rgba(255,255,255,0.22)" />
                <rect x="-164" y="10" width="40" height="6" rx="2" fill="rgba(0,0,0,0.35)" />
                <rect x="-160" y="-16" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
              </g>
            </motion.g>
          </svg>

          {sparks.map((spark) => (
            <span
              key={spark.id}
              className={o.spark}
              aria-hidden="true"
              style={
                {
                  "--dx": `${spark.dx}px`,
                  "--dy": `${spark.dy}px`,
                  "--angle": `${spark.angle}deg`,
                  animationDelay: `${spark.delay}ms`
                } as CSSProperties
              }
            />
          ))}
        </button>

        <div className={o.forgePanel} id={`${id}-progress`}>
          <div className={o.gauge}>
            <svg className={o.gaugeSvg} viewBox="0 0 140 140" aria-hidden="true">
              <circle className={o.gaugeTrack} cx="70" cy="70" r={GAUGE_R} />
              <circle
                className={o.gaugeFill}
                data-done={done ? "true" : "false"}
                cx="70"
                cy="70"
                r={GAUGE_R}
                strokeDasharray={GAUGE_C}
                strokeDashoffset={gaugeOffset}
                transform="rotate(-90 70 70)"
              />
              {Array.from({ length: TOTAL_REPORTS }, (_, index) => {
                const angle = (index / TOTAL_REPORTS) * Math.PI * 2 - Math.PI / 2;
                const inner = GAUGE_R - 12;
                const outer = GAUGE_R - 8;
                return (
                  <line
                    key={index}
                    className={o.gaugeTick}
                    data-lit={index < strikes ? "true" : "false"}
                    x1={70 + Math.cos(angle) * inner}
                    y1={70 + Math.sin(angle) * inner}
                    x2={70 + Math.cos(angle) * outer}
                    y2={70 + Math.sin(angle) * outer}
                  />
                );
              })}
            </svg>
            <div className={o.gaugeCentre}>
              <span className={o.readoutLabel}>Discrepancies</span>
              <span className={o.gaugeValue}>
                {Math.round(discrepancy)}
                <small>%</small>
              </span>
            </div>
          </div>

          <div className={o.forgeStats}>
            <div className={o.forgeStat}>
              <span>Reports validated</span>
              <span>
                {String(Math.min(strikes, TOTAL_REPORTS)).padStart(2, "0")} / {TOTAL_REPORTS}+
              </span>
            </div>
            <div className={o.forgeStat}>
              <span>Tableau → Power BI</span>
              <span>
                {migrated} / {TABLEAU_REPORTS}
              </span>
            </div>
          </div>

          {done ? (
            <>
              <span className={o.seal}>
                <span aria-hidden="true">●</span> Validated · 90% fewer discrepancies
              </span>
              <button type="button" className={o.textButton} onClick={() => setStrikes(0)}>
                Forge again
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
