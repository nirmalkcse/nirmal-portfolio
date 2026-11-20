"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { EntityResolutionObject } from "./entity-resolution-object";

// Standard cubic-bezier solver, so scroll-linked ranges can be eased the same
// way a CSS transition would be. framer-motion ships one but does not export it
// through its public types.
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    return ((ay * t + by) * t + cy) * t;
  };
}

// The three scenes ride one continuous belt that never stops: a slow linear
// drift while a scene is readable, a faster glide between scenes. GLIDE's
// endpoints have a small non-zero slope (unlike a standard ease-in-out, which
// stops dead at both ends), so it hands off to the neighbouring drift segments
// without the velocity ever hitting zero — no plateau, no perceived pause.
const GLIDE = bezier(0.55, 0.05, 0.25, 0.95);
const LINEAR = (t: number) => t;
// Content settling inside a scene decelerates into place.
const SETTLE = bezier(0.16, 1, 0.3, 1);

// Belt position (in % of panel height) over section progress. Panels sit
// 112% apart, so a scene is centred when the belt is at -112 * its index.
// Reads happen mid-drift (the belt keeps creeping ~16% during them), which is
// what makes the whole section feel like one uninterrupted stretch of scroll.
const BELT_INPUT = [0, 0.3, 0.44, 0.7, 0.84, 1];
const BELT_OUTPUT = [0, -16, -98, -128, -210, -224];
const BELT_EASE = [LINEAR, GLIDE, LINEAR, GLIDE, LINEAR];

type SceneProps = {
  scrollProgress: MotionValue<number>;
  beltY: MotionValue<number>;
};

// --- Scrollytelling Components ---

// 1. Data Migration (readable ~0 to 0.30) - Features PySpark Code
const FluidArchitecture = ({ scrollProgress, beltY }: SceneProps) => {
  const sceneY = useTransform(beltY, (v) => `${v}%`);
  const textScale = useTransform(scrollProgress, [0, 0.08, 0.3, 0.44], [0.985, 1, 1, 1.015], { ease: [SETTLE, LINEAR, GLIDE] });
  const textY = useTransform(scrollProgress, [0, 0.08, 0.3, 0.44], [18, 0, 0, -12], { ease: [SETTLE, LINEAR, GLIDE] });

  // The code window arrives through weight and position only—never opacity.
  const codeY = useTransform(scrollProgress, [0, 0.09, 0.3, 0.44], [56, 0, 0, -18], { ease: [SETTLE, LINEAR, GLIDE] });
  const codeScale = useTransform(scrollProgress, [0, 0.09, 0.3, 0.44], [0.965, 1, 1, 0.99], { ease: [SETTLE, LINEAR, GLIDE] });

  return (
    <motion.div
      style={{ y: sceneY, pointerEvents: 'auto', willChange: 'transform' }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 z-10 overflow-hidden"
    >
      <motion.div style={{ y: textY, scale: textScale }} className="relative z-10 text-center max-w-6xl flex flex-col items-center w-full">
        <div className="mb-5 flex items-center justify-center gap-3 font-mono text-[8px] font-semibold uppercase tracking-[0.28em] text-[#8d7c6d] sm:mb-7 sm:text-[10px]">
          <span>01</span>
          <span className="h-px w-8 bg-[#9b7357]/60" aria-hidden="true" />
          <span>Lakehouse engineering</span>
        </div>

        <h2 className="editorial-title editorial-title--display">
          Data<br/>
          <em>Migration</em><span className="editorial-accent">.</span>
        </h2>

        <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-[#655a51] sm:text-base md:mt-6">
          Twenty-four daily feeds. One governed Delta Lake.
        </p>

        {/* The Code Window (Show, Don't Tell) */}
        <motion.div
          style={{ y: codeY, scale: codeScale }}
          className="mt-9 w-full max-w-3xl md:mt-12"
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#23201c] text-left shadow-[0_30px_70px_-30px_rgba(58,42,29,0.5)]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-white/[0.13]" />
                <span className="size-2 rounded-full bg-white/[0.13]" />
                <span className="size-2 rounded-full bg-white/[0.13]" />
              </div>
              <div className="flex items-center gap-4">
                <p className="font-mono text-[9px] tracking-[0.16em] text-[#8f857b] sm:text-[10px]">migration_pipeline.py</p>
                <button
                  type="button"
                  onClick={() => (window as typeof window & { migrate?: () => string }).migrate?.()}
                  className="cursor-pointer rounded-md border border-[#c99a6e]/25 bg-[#c99a6e]/[0.06] px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-[#c99a6e] transition-[transform,background-color] duration-150 ease-out hover:bg-[#c99a6e]/[0.14] active:scale-[0.96] sm:text-[10px]"
                  aria-label="Run the migration"
                >
                  ▶ run
                </button>
              </div>
            </div>

            <div className="relative">
              <style>{`
                @keyframes mig-exec-line { from { transform: translateY(0); } to { transform: translateY(24em); } }
                @media (prefers-reduced-motion: reduce) { .mig-exec-line { animation: none !important; opacity: 0; } }
              `}</style>
              {/* Executing-line highlight stepping through the code like a debugger */}
              <div
                className="mig-exec-line pointer-events-none absolute inset-x-0 top-6 h-[2em] border-l-2 border-[#c99a6e]/40 bg-white/[0.03] font-mono text-[9px] sm:text-[13px] md:text-sm"
                style={{ animation: "mig-exec-line 14.4s steps(12) infinite" }}
                aria-hidden="true"
              />

              <pre className="overflow-x-hidden px-5 pb-7 pt-6 font-mono text-[9px] leading-[2] text-[#c9c1b8] sm:overflow-x-auto sm:px-7 sm:text-[13px] md:px-9 md:text-sm">
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">1</span><span className="text-[#c99a6e]">from</span> pyspark.sql.functions <span className="text-[#c99a6e]">import</span> *<br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">2</span><span className="text-[#c99a6e]">from</span> legacy.warehouse <span className="text-[#c99a6e]">import</span> everything  <span className="text-[#787067]"># RIP, old friend</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">3</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">4</span><span className="text-[#787067]"># Migration season — 24 tables flying south to the lakehouse</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">5</span><span className="text-[#c99a6e]">def</span> <span className="text-[#e8d9c3]">migrate_south</span>(flock, lakehouse):<br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">6</span>{'    '}flock.<span className="text-[#e8d9c3]">pack</span>(bags=<span className="text-[#a8b89a]">&quot;parquet&quot;</span>, regrets=<span className="text-[#c99a6e]">None</span>)<br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">7</span>{'    '}flock.<span className="text-[#e8d9c3]">leave_behind</span>(<span className="text-[#a8b89a]">&quot;nulls&quot;</span>, <span className="text-[#a8b89a]">&quot;dupes&quot;</span>, <span className="text-[#a8b89a]">&quot;vendor_lock_in&quot;</span>)<br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">8</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">9</span>{'    '}<span className="text-[#c99a6e]">for</span> table <span className="text-[#c99a6e]">in</span> flock:  <span className="text-[#787067]"># single file, please</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">10</span>{'        '}lakehouse.<span className="text-[#e8d9c3]">merge</span>(table)  <span className="text-[#787067]"># honk if you love ACID</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">11</span><br/>
                <span className="mr-4 inline-block w-5 select-none text-right text-[#4a443c]">12</span>{'    '}<span className="text-[#c99a6e]">return</span> <span className="text-[#a8b89a]">&quot;24/24 landed · zero rows harmed&quot;</span><br/>
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// 2. Entity Resolution (readable ~0.44 to 0.70) - Scroll-assembled identity object
const UnifiedEcosystems = ({ scrollProgress, beltY }: SceneProps) => {
  // All panels derive from the same belt, offset 112% apart, so they travel
  // as one continuous strip rather than three loosely-synced moves.
  const sceneY = useTransform(beltY, (v) => `${v + 112}%`);
  const textY = useTransform(scrollProgress, [0.33, 0.5], [52, 0], { ease: SETTLE });
  const objectY = useTransform(scrollProgress, [0.33, 0.51], [54, 0], { ease: SETTLE });
  const objectRotate = useTransform(scrollProgress, [0.33, 0.51], [1.8, 0], { ease: SETTLE });

  return (
    <motion.div
      style={{ y: sceneY, pointerEvents: 'auto', willChange: 'transform' }}
      className="absolute inset-0 z-20 overflow-hidden px-5 pb-8 pt-24 sm:px-8 lg:px-14 lg:pb-12 lg:pt-28 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -inset-x-[18%] top-[14%] h-[72%] bg-[radial-gradient(ellipse_at_69%_50%,rgba(214,187,158,0.26)_0%,rgba(238,225,209,0.12)_35%,transparent_72%)] blur-2xl" />
        <div className="absolute left-[30%] right-[-12%] top-1/2 h-40 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(184,123,87,0.075)_34%,rgba(255,255,255,0.42)_58%,transparent)] blur-3xl" />
      </div>

      <div className="relative mx-auto h-full w-full max-w-[1700px]">
        <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-1 lg:grid-cols-[0.64fr_1.36fr] lg:grid-rows-1 lg:items-center lg:gap-0">
          <motion.header style={{ y: textY }} className="relative z-20 max-w-[560px] lg:pr-8">
            <div className="mb-3 flex items-center gap-3 font-mono text-[8px] font-semibold uppercase tracking-[0.28em] text-[#8d7c6d] sm:mb-5 sm:text-[10px]">
              <span>02</span>
              <span className="h-px w-8 bg-[#9b7357]/70" aria-hidden="true" />
              <span>Master data management</span>
            </div>

            <h2 className="editorial-title editorial-title--section">
              Entity<br/>Resolution<span className="editorial-accent">.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-[#655a51] sm:mt-7 sm:text-base lg:text-[17px]">
              Three source records become one trusted customer identity.
            </p>

            <div className="mt-6 flex max-w-md items-center justify-between border-t border-[#8d7968]/25 pt-3 font-mono text-[7px] uppercase tracking-[0.18em] text-[#85766a] sm:mt-8 sm:text-[9px]">
              <span>Databricks MDM</span>
              <span>Unity Catalog</span>
            </div>
          </motion.header>

          <motion.section
            style={{ y: objectY, rotateX: objectRotate, transformPerspective: 1200 }}
            className="relative z-10 min-h-0 self-stretch lg:ml-0 lg:-mr-[4vw]"
            aria-label="Interactive entity resolution model"
          >
            <EntityResolutionObject
              className="h-full min-h-[390px] sm:min-h-[460px] lg:min-h-0"
              progress={scrollProgress}
            />
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

// 3. Reporting Trust (readable ~0.84 to 1.0) - Features the Impact Counter
const IntelligentSynthesis = ({ scrollProgress, beltY }: SceneProps) => {
  const sceneY = useTransform(beltY, (v) => `${v + 224}%`);

  // Lens and card ride in on the same window as the scene itself and settle a
  // beat after it, so the composition lands as one object instead of three
  // parts catching up with each other.
  const textScale = useTransform(scrollProgress, [0.7, 0.88], [0.94, 1], { ease: SETTLE });

  // The Glass Lens Physics — shorter travel and a gentler scale delta, because a
  // 1200px element being re-rasterised at a new size every frame is what turns
  // a smooth scroll into a stepped one.
  const lensScale = useTransform(scrollProgress, [0.7, 0.96], [0.78, 1.05], { ease: SETTLE });
  const lensY = useTransform(scrollProgress, [0.7, 0.96], [200, 0], { ease: SETTLE });

  // The Dramatic Impact Counter — eased so the number decelerates into 90
  // rather than ticking at a flat rate and stopping dead.
  const countRaw = useTransform(scrollProgress, [0.8, 0.96], [0, 90], { ease: SETTLE });
  const countText = useTransform(countRaw, (latest) => `${Math.round(latest)}%`);

  return (
    <motion.div 
      style={{ y: sceneY, willChange: "transform" }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 z-30 overflow-hidden"
    >
      {/* The Glass Lens Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          style={{ scale: lensScale, y: lensY, willChange: "transform" }}
          className="relative w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] rounded-full border-[1px] border-white/50 shadow-[inset_0_20px_60px_rgba(255,255,255,0.7)] bg-gradient-to-tr from-white/25 via-white/[0.08] to-transparent flex items-center justify-center overflow-hidden"
        >
          {/* Internal specular light sweep */}
          <motion.div 
             animate={{ x: ["-150%", "250%"] }} 
             transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
             style={{ willChange: "transform" }}
             className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-30deg]"
          />
          {/* Inner core focus glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.4)_0%,_transparent_60%)]" />
        </motion.div>
      </div>

      <motion.div 
        style={{ scale: textScale, willChange: "transform" }}
        className="relative z-10 border border-white/60 bg-[linear-gradient(158deg,rgba(255,255,255,0.74),rgba(255,255,255,0.52)_55%,rgba(255,255,255,0.66))] p-10 md:p-20 rounded-[3rem] shadow-[0_40px_100px_rgba(150,140,125,0.15),_inset_0_2px_20px_rgba(255,255,255,0.7)] text-center w-full max-w-5xl"
      >
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-[#8e7f70] mb-4">
          Power BI & Analytics Engineering
        </p>
        
        {/* Cinematic Impact Counter */}
        <div className="flex flex-col items-center justify-center mb-8">
          <motion.h2 className="text-[15vw] sm:text-[10rem] md:text-[14rem] font-semibold tracking-[-0.045em] text-[#1f1a17] drop-shadow-sm leading-none tabular-nums" style={{ fontFamily: 'var(--font-serif)' }}>
            {countText}
          </motion.h2>
          <p className="text-sm md:text-xl font-medium uppercase tracking-[0.4em] text-[#d97706] mt-4">
            Discrepancy Reduction
          </p>
        </div>

        <p className="text-lg md:text-2xl text-[#655a50] leading-relaxed font-light max-w-2xl mx-auto">
          Building data systems that make reporting easier to trust. Validated 15+ complex reports and seamlessly migrated enterprise analytics to Power BI.
        </p>
      </motion.div>
    </motion.div>
  );
};

// Console easter egg: a one-time hint, and a global migrate() that runs a
// live "migration job" — a small box appears on screen, a duck flies 24
// tables south along a real progress bar, lands, and the box fades away.
function useMigrationEasterEgg() {
  useEffect(() => {
    const w = window as typeof window & { migrate?: () => string };
    if (w.migrate) return;

    const mono = "font-family:ui-monospace,monospace;";
    console.log("%c🦆 migration season is open — type migrate() and watch the corner of your screen", `${mono}color:#9a5637;`);

    w.migrate = () => {
      if (document.getElementById("migration-job")) return "a flock is already in the air 🦆";

      const total = 24;
      const box = document.createElement("div");
      box.id = "migration-job";
      box.style.cssText = [
        "position:fixed", "right:20px", "bottom:20px", "z-index:9999", "width:280px",
        "background:#23201c", "border:1px solid rgba(255,255,255,0.09)", "border-radius:14px",
        "box-shadow:0 30px 70px -30px rgba(58,42,29,0.6)", "padding:14px 16px",
        "font-family:ui-monospace,monospace", "color:#c9c1b8", "font-size:11px", "line-height:1.5",
        "transform:translateY(14px)", "opacity:0",
        "transition:transform .45s cubic-bezier(0.23,1,0.32,1),opacity .45s ease",
        "pointer-events:none",
      ].join(";");
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
          <span style="color:#8f857b;letter-spacing:0.12em;">migration_job.log</span>
          <span data-mig="count" style="color:#c99a6e;">0/24</span>
        </div>
        <div style="position:relative;height:20px;margin-bottom:8px;">
          <span data-mig="duck" style="position:absolute;left:0%;top:0;font-size:14px;transition:left .3s linear;">🦆</span>
        </div>
        <div style="height:4px;border-radius:99px;background:rgba(255,255,255,0.08);overflow:hidden;">
          <div data-mig="bar" style="height:100%;width:0%;background:linear-gradient(90deg,#9a5637,#c99a6e);transition:width .3s ease;"></div>
        </div>
        <div data-mig="status" style="margin-top:10px;color:#787067;">packing parquet…</div>`;
      document.body.appendChild(box);
      setTimeout(() => { box.style.transform = "translateY(0)"; box.style.opacity = "1"; }, 30);

      const el = (name: string) => box.querySelector(`[data-mig="${name}"]`) as HTMLElement;
      const statuses = ["packing parquet…", "leaving nulls behind…", "single file, please…", "honking politely…", "merging into the lake…"];

      let landed = 0;
      const timer = setInterval(() => {
        landed = Math.min(total, landed + 1 + Math.floor(Math.random() * 3));
        const pct = Math.round((landed / total) * 100);
        el("bar").style.width = `${pct}%`;
        el("duck").style.left = `${Math.min(pct, 92)}%`;
        el("count").textContent = `${landed}/24`;
        el("status").textContent = statuses[Math.min(statuses.length - 1, Math.floor((landed / total) * statuses.length))];
        if (landed >= total) {
          clearInterval(timer);
          const status = el("status");
          status.textContent = "24/24 landed · zero rows harmed 🌊";
          status.style.color = "#a8b89a";
          console.log("%c24/24 landed · zero rows harmed · welcome to the lakehouse 🌊", `${mono}color:#7f9a6e;`);
          setTimeout(() => {
            box.style.transform = "translateY(14px)";
            box.style.opacity = "0";
            setTimeout(() => box.remove(), 500);
          }, 2800);
        }
      }, 260);

      return "migrating 24 tables south… 🦆";
    };
  }, []);
}

export function CreativeShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  useMigrationEasterEgg();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Still over-damped (no overshoot), but roughly 3x faster to settle — the old
  // values sat on top of Lenis's own lerp and the two lags compounded into that
  // "sliding behind you" feel.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 32,
    mass: 0.55,
    restDelta: 0.0005
  });

  // The single shared belt every panel derives its position from.
  const beltY = useTransform(smoothProgress, BELT_INPUT, BELT_OUTPUT, { ease: BELT_EASE });

  // Luxury ambient background orbs mapped to scroll
  const orb1Y = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const orb1X = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);

  const orb2Y = useTransform(smoothProgress, [0, 1], ["100%", "0%"]);
  const orb2X = useTransform(smoothProgress, [0, 1], ["100%", "50%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#fbf8f2]"
      style={{ height: "380vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Luxury Dynamic Mesh Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ x: orb1X, y: orb1Y, willChange: "transform" }}
            className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#f0e6d8] to-[#e6d5c0] blur-[100px] opacity-60"
          />
          <motion.div 
            style={{ x: orb2X, y: orb2Y, willChange: "transform" }}
            className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-[#f4ece3] to-[#dfcbb3] blur-[120px] opacity-50"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#fbf8f2_80%)]" />
        </div>

        <FluidArchitecture scrollProgress={smoothProgress} beltY={beltY} />
        <UnifiedEcosystems scrollProgress={smoothProgress} beltY={beltY} />
        <IntelligentSynthesis scrollProgress={smoothProgress} beltY={beltY} />
      </div>
    </section>
  );
}

