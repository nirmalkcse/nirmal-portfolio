"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import o from "./objects.module.css";

/* ─── Air: the updraft ───────────────────────────────────────────────
   Questions drift on the wind. Catch one and it lifts, opening into the
   chain that answered it on stage at FabCon25: semantic model, Copilot,
   Data Agent root-cause analysis, JIRA context. The wind follows the
   pointer; the clouds lean with it. */

// Illustrative prompts in the spirit of the Talk to Your Data demo. They are
// examples of the pattern, not transcripts of a client's data.
const prompts = [
  {
    id: "churn",
    question: "Why did churn rise last quarter?",
    answer:
      "Root cause traced to a billing migration incident in two regions, with the linked incident attached for context.",
    left: 14,
    top: 24,
    delay: 0
  },
  {
    id: "sla",
    question: "Which region missed its SLA?",
    answer:
      "One region, over three days, tied back to a delayed pipeline run, and surfaced with the owning ticket.",
    left: 48,
    top: 58,
    delay: -2.1
  },
  {
    id: "revenue",
    question: "What changed in yesterday's revenue?",
    answer:
      "A late-arriving file shifted a slice of bookings into today's load. The answer stayed grounded in the semantic model.",
    left: 30,
    top: 42,
    delay: -4.2
  }
] as const;

const chain = ["Semantic model", "Copilot", "Data Agent RCA", "JIRA context"] as const;

type Streak = { x: number; y: number; length: number; speed: number; alpha: number; width: number };

function useWind(canvasRef: RefObject<HTMLCanvasElement | null>, gustRef: RefObject<number>, reduced: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const streaks: Streak[] = [];

    const seed = () => {
      streaks.length = 0;
      for (let i = 0; i < 34; i++) {
        streaks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: 40 + Math.random() * 120,
          speed: 0.6 + Math.random() * 1.4,
          alpha: 0.12 + Math.random() * 0.22,
          width: 0.6 + Math.random() * 0.8
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seed();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const gust = gustRef.current;
      gustRef.current *= 0.94;
      context.lineCap = "round";
      for (const streak of streaks) {
        const velocity = streak.speed * (1 + gust * 3);
        streak.x += velocity;
        if (streak.x - streak.length > width) {
          streak.x = -streak.length - Math.random() * 60;
          streak.y = Math.random() * height;
        }
        const gradient = context.createLinearGradient(streak.x - streak.length, streak.y, streak.x, streak.y);
        gradient.addColorStop(0, "rgba(91,122,148,0)");
        gradient.addColorStop(1, `rgba(91,122,148,${Math.min(0.8, streak.alpha * 1.8 * (1 + gust))})`);
        context.strokeStyle = gradient;
        context.lineWidth = streak.width;
        context.beginPath();
        context.moveTo(streak.x - streak.length, streak.y);
        context.lineTo(streak.x, streak.y);
        context.stroke();
      }
      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    draw();

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [canvasRef, gustRef, reduced]);
}

/* A cumulus: stacked ellipses, shaded underneath, edges torn by noise. */
function Cloud({ cx, cy, scale, opacity, fillId }: { cx: number; cy: number; scale: number; opacity: number; fillId: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="0" cy="4" rx="78" ry="22" fill={`url(#${fillId})`} />
      <ellipse cx="-34" cy="-8" rx="40" ry="26" fill={`url(#${fillId})`} />
      <ellipse cx="18" cy="-16" rx="48" ry="32" fill={`url(#${fillId})`} />
      <ellipse cx="56" cy="0" rx="32" ry="20" fill={`url(#${fillId})`} />
      <ellipse cx="10" cy="-30" rx="26" ry="16" fill="rgba(255,255,255,0.9)" />
    </g>
  );
}

export function AirUpdraft({ tone = "light" }: { tone?: "light" | "dark" }) {
  const id = useId().replace(/:/g, "");
  const reduced = Boolean(useReducedMotion());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gustRef = useRef(0);
  const lastPointer = useRef<{ x: number; y: number; at: number } | null>(null);
  const [lifted, setLifted] = useState<string | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const leanX = useSpring(pointerX, { stiffness: 40, damping: 18 });
  const leanY = useSpring(pointerY, { stiffness: 40, damping: 18 });
  const farX = useTransform(leanX, (value) => value * -6);
  const farY = useTransform(leanY, (value) => value * -4);
  const nearX = useTransform(leanX, (value) => value * -16);
  const nearY = useTransform(leanY, (value) => value * -10);

  useWind(canvasRef, gustRef, reduced);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    const now = performance.now();
    const previous = lastPointer.current;
    if (previous) {
      const dt = Math.max(16, now - previous.at);
      const speed = Math.hypot(event.clientX - previous.x, event.clientY - previous.y) / dt;
      gustRef.current = Math.min(1.4, gustRef.current + speed * 0.12);
    }
    lastPointer.current = { x: event.clientX, y: event.clientY, at: now };
  };

  const active = prompts.find((prompt) => prompt.id === lifted) ?? null;

  const defs = (
    <defs>
      <linearGradient id={`${id}-cloud`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#f3f7fb" />
        <stop offset="100%" stopColor="#cdd9e5" />
      </linearGradient>
      <filter id={`${id}-torn`} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="4" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
      <linearGradient id={`${id}-far`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(120,146,170,0.42)" />
        <stop offset="100%" stopColor="rgba(120,146,170,0.2)" />
      </linearGradient>
      <linearGradient id={`${id}-mid`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(95,122,148,0.7)" />
        <stop offset="100%" stopColor="rgba(95,122,148,0.5)" />
      </linearGradient>
      <linearGradient id={`${id}-near`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6b8198" />
        <stop offset="100%" stopColor="#4a5f74" />
      </linearGradient>
      <linearGradient id={`${id}-snow`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
  );

  return (
    <div className={o.object} data-tone={tone}>
      <div className={o.objectHead}>
        <span className={o.objectTitle}>Updraft</span>
        <span className={o.objectHint}>Catch a question</span>
      </div>

      <div className={o.objectBody}>
        <div className={o.skyStage} onPointerMove={handlePointerMove}>
          <span className={o.sunGlow} aria-hidden="true" />

          <motion.div className={o.cloudLayer} style={{ x: farX, y: farY }} aria-hidden="true">
            <svg viewBox="0 0 560 440" preserveAspectRatio="xMidYMid slice">
              {defs}
              <g filter={`url(#${id}-torn)`}>
                <Cloud cx={110} cy={130} scale={0.85} opacity={0.75} fillId={`${id}-cloud`} />
                <Cloud cx={440} cy={100} scale={1.05} opacity={0.7} fillId={`${id}-cloud`} />
                <Cloud cx={300} cy={330} scale={0.7} opacity={0.5} fillId={`${id}-cloud`} />
              </g>
            </svg>
          </motion.div>

          <canvas ref={canvasRef} className={o.windCanvas} aria-hidden="true" />

          <motion.div className={o.cloudLayer} style={{ x: nearX, y: nearY }} aria-hidden="true">
            <svg viewBox="0 0 560 440" preserveAspectRatio="xMidYMid slice">
              <g filter={`url(#${id}-torn)`}>
                <Cloud cx={480} cy={372} scale={1.35} opacity={0.96} fillId={`${id}-cloud`} />
                <Cloud cx={40} cy={410} scale={1.15} opacity={0.92} fillId={`${id}-cloud`} />
              </g>
            </svg>
          </motion.div>

          <svg className={o.summit} viewBox="0 0 560 140" preserveAspectRatio="none" aria-hidden="true">
            {/* far range, lost in haze */}
            <path d="M 0 140 L 0 96 L 60 70 L 110 84 L 170 40 L 220 66 L 280 28 L 330 58 L 400 36 L 450 72 L 510 52 L 560 78 L 560 140 Z" fill={`url(#${id}-far)`} />
            {/* mid range */}
            <path d="M 0 140 L 0 108 L 70 78 L 130 96 L 200 54 L 250 82 L 320 44 L 380 80 L 440 60 L 500 92 L 560 72 L 560 140 Z" fill={`url(#${id}-mid)`} />
            <path d="M 200 54 L 214 66 L 186 68 Z M 320 44 L 336 58 L 306 60 Z M 440 60 L 454 72 L 426 74 Z" fill={`url(#${id}-snow)`} />
            {/* near range, sun on its western faces */}
            <path d="M 0 140 L 0 118 L 50 100 L 120 112 L 190 86 L 250 104 L 330 80 L 400 100 L 460 88 L 520 106 L 560 98 L 560 140 Z" fill={`url(#${id}-near)`} />
            <path d="M 50 100 L 120 112 L 92 116 Z M 190 86 L 250 104 L 214 108 Z M 330 80 L 400 100 L 362 104 Z M 460 88 L 520 106 L 486 110 Z" fill="rgba(255,255,255,0.22)" />
            <path d="M 190 86 L 202 96 L 176 98 Z M 330 80 L 344 92 L 314 94 Z" fill="#ffffff" opacity="0.9" />
          </svg>

          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              className={o.chip}
              data-lifted={lifted === prompt.id ? "true" : "false"}
              data-dimmed={lifted !== null && lifted !== prompt.id ? "true" : "false"}
              style={
                {
                  "--left": `${prompt.left}%`,
                  "--top": `${prompt.top}%`,
                  animationDelay: `${prompt.delay}s`
                } as CSSProperties
              }
              onClick={() => setLifted(prompt.id)}
              aria-expanded={lifted === prompt.id}
            >
              <span className={o.chipDot} aria-hidden="true" />
              {prompt.question}
            </button>
          ))}

          <AnimatePresence>
            {active ? (
              <motion.div
                key={active.id}
                className={o.answer}
                role="dialog"
                aria-label={active.question}
                initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -60, scale: 0.96, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={o.answerQuestion}>{active.question}</span>
                <ol className={o.chain} aria-label="How the answer was built">
                  {chain.map((step, index) => (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + index * 0.14, duration: 0.5 }}
                    >
                      {step}
                    </motion.li>
                  ))}
                </ol>
                <motion.p
                  className={o.answerText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.6 }}
                >
                  {active.answer}
                </motion.p>
                <button type="button" className={`${o.textButton} ${o.answerClose}`} onClick={() => setLifted(null)}>
                  Let it go
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <span className={o.illustrative}>Illustrative prompts</span>
        </div>
      </div>
    </div>
  );
}
