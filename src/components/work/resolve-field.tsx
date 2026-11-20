"use client";

import clsx from "clsx";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ease, pad, useMediaQuery, useSectionProgress } from "@/components/story";
import { projects, type Project } from "@/data";
import styles from "./resolve-field.module.css";

/* ─── The record field ───────────────────────────────────────────────────
   Every term the case files are made of, scattered as loose records.
   The cursor finds which ones belong together; scrolling resolves the
   whole field into one entity per case file. */

type Cluster = {
  slug: string;
  short: string;
  flagship: boolean;
  x: number;
  y: number;
  size: number;
};

type Fragment = {
  text: string;
  cluster: number;
  delay: number;
  angle: number;
  orbit: number;
  speed: number;
  phase: number;
};

const shortNames: Record<string, string> = {
  "icore-enterprise-mdm-entity-resolution": "iCORE",
  "telecom-fabric-migration-poc": "Telecom migration",
  "bi-migration-validation-analytics": "BI migration",
  "ieee-semiconductor-chip-analysis-medallion": "IEEE research",
  "fabcon25-talk-to-your-data-demo": "FabCon demo",
  "insurance-analytics-copilot-data-agent-poc": "Insurance PoC",
  "vitac-skincare-market-analysis": "VITAC analysis"
};

/* Terms lifted from each project's summary and impact, beyond its stack. */
const extraTerms: Record<string, readonly string[]> = {
  "icore-enterprise-mdm-entity-resolution": ["Golden records", "Match review", "RBAC", "Audit logging", "Master Entity", "Explainability"],
  "telecom-fabric-migration-poc": ["Teradata", "3 source systems", "18–24 daily tables", "CDC", "SCD Type 2", "Bronze · Silver · Gold"],
  "bi-migration-validation-analytics": ["15+ reports", "90% fewer discrepancies", "6 Tableau reports", "Semantic models", "Validation"],
  "ieee-semiconductor-chip-analysis-medallion": ["IEEE Xplore", "Semiconductor chips", "Research"],
  "fabcon25-talk-to-your-data-demo": ["FabCon25 Europe", "Talk to Your Data", "Data Agent RCA"],
  "insurance-analytics-copilot-data-agent-poc": ["Synthetic data", "Prompt library", "Verified responses"],
  "vitac-skincare-market-analysis": ["TAM · SAM · SOM", "SCQA", "Pyramid Principle"]
};

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildField(featured: readonly string[]) {
  const catalog: readonly Project[] = projects;
  const included = catalog.filter((project) => project.status !== "observed");
  const random = seeded(20260107);

  const clusters: Cluster[] = included.map((project) => ({
    slug: project.slug,
    short: shortNames[project.slug] ?? project.title,
    flagship: featured.includes(project.slug),
    x: 0,
    y: 0,
    size: 0
  }));

  const fragments: Fragment[] = [];
  included.forEach((project, clusterIndex) => {
    const terms = [...new Set([...project.stack, ...(extraTerms[project.slug] ?? [])])];
    clusters[clusterIndex].size = terms.length;
    terms.forEach((text, termIndex) => {
      fragments.push({
        text,
        cluster: clusterIndex,
        delay: random(),
        angle: (termIndex / terms.length) * Math.PI * 2 + random() * 0.4,
        orbit: 10 + random() * 26,
        speed: 0.25 + random() * 0.35,
        phase: random() * Math.PI * 2
      });
    });
  });

  return { clusters, fragments };
}

/** Entity positions: a gentle wave across wide screens, a column on phones. */
function layoutClusters(clusters: readonly Cluster[], narrow: boolean): Cluster[] {
  const last = Math.max(1, clusters.length - 1);
  return clusters.map((cluster, index) =>
    narrow
      ? { ...cluster, x: 0.18, y: 0.24 + (index / last) * 0.46 }
      : { ...cluster, x: 0.09 + (index / last) * 0.78, y: 0.47 + (index % 2 === 0 ? -0.035 : 0.035) }
  );
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─── Canvas ─────────────────────────────────────────────────────────── */

function useFieldCanvas({
  canvasRef,
  stageRef,
  progress,
  auto,
  still,
  field,
  layout,
  hovered
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  auto: boolean;
  still: boolean;
  field: ReturnType<typeof buildField>;
  layout: readonly Cluster[];
  hovered: RefObject<number | null>;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !stage || !context) return;

    const { fragments } = field;
    const clusters = layout;
    const computed = getComputedStyle(stage);
    const mono = computed.getPropertyValue("--mono").trim() || "ui-monospace, monospace";
    const ink = computed.getPropertyValue("--field-ink").trim() || "29, 26, 23";
    const accent = computed.getPropertyValue("--field-accent").trim() || "154, 86, 55";

    let width = 0;
    let height = 0;
    let running = false;
    let raf = 0;
    let autoStart = 0;
    const pointer = { x: 0, y: 0, active: false, last: 0 };
    const positions = fragments.map(() => ({ x: 0, y: 0, t: 0, near: 0 }));
    const home = fragments.map(() => ({ x: 0, y: 0 }));

    /* Scatter the loose records without letting any two collide, and keep
       the headline corner and the stats line clear. Seeded, so the field
       looks the same on every visit. */
    const place = () => {
      const narrowField = width < 760;
      context.font = `500 ${narrowField ? 10 : 11}px ${mono}`;
      const random = seeded(9001);
      const top = narrowField ? 120 : Math.min(130, height * 0.16);
      /* Keep the centred headline clear. */
      const zones = narrowField
        ? [
            { x0: 0, y0: height * 0.34, x1: width, y1: height * 0.66 },
            { x0: 0, y0: height * 0.88, x1: width, y1: height }
          ]
        : [
            { x0: width * 0.17, y0: height * 0.34, x1: width * 0.83, y1: height * 0.66 },
            { x0: width * 0.3, y0: height * 0.86, x1: width * 0.7, y1: height }
          ];
      const boxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
      const overlap = (
        a: { x0: number; y0: number; x1: number; y1: number },
        b: { x0: number; y0: number; x1: number; y1: number }
      ) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
      const order = fragments
        .map((fragment, index) => ({ index, w: context.measureText(fragment.text).width }))
        .sort((a, b) => b.w - a.w);

      for (const { index, w } of order) {
        let chosen = { x: 0, y: 0 };
        let chosenBox = { x0: 0, y0: 0, x1: 0, y1: 0 };
        let least = Infinity;
        for (let attempt = 0; attempt < 120; attempt += 1) {
          /* The right edge stays clear of the social dock. */
          const x = 16 + random() * Math.max(1, width - w - (narrowField ? 32 : 110));
          const y = top + random() * Math.max(1, height - top - 40);
          const pad = narrowField ? 6 : 18;
          const box = { x0: x - pad, y0: y - pad, x1: x + w + pad, y1: y + pad };
          let cost = 0;
          for (const other of boxes) cost += overlap(box, other);
          for (const zone of zones) cost += overlap(box, zone) * 4;
          if (cost < least) {
            least = cost;
            chosen = { x, y };
            chosenBox = box;
          }
          if (cost === 0) break;
        }
        boxes.push(chosenBox);
        home[index] = chosen;
      }
    };

    const resize = () => {
      const box = stage.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      place();
    };

    const onMove = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.active = event.pointerType === "mouse";
      pointer.last = performance.now();
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const frame = (now: number) => {
      const time = still ? 0 : now / 1000;
      let p: number;
      if (still) {
        p = 1;
      } else if (auto) {
        if (!autoStart) autoStart = now;
        p = smooth(0, 1, (now - autoStart - 1600) / 5200) * 0.98 + 0.02;
      } else {
        p = progress.get();
      }

      context.clearRect(0, 0, width, height);
      const matching = 1 - smooth(0.1, 0.26, p);
      const idle = !pointer.active || now - pointer.last > 2600;
      const cx = idle ? width * (0.5 + 0.3 * Math.sin(time * 0.31)) : pointer.x;
      const cy = idle ? height * (0.44 + 0.2 * Math.sin(time * 0.47 + 1.3)) : pointer.y;
      const compact = width < 760;
      const radius = compact ? width * 0.3 : Math.min(230, width * 0.18);
      let tag: { label: string; x: number; y: number } | null = null;
      const focus = hovered.current;

      /* Positions. */
      fragments.forEach((fragment, index) => {
        const cluster = clusters[fragment.cluster];
        const t = smooth(0, 1, (p - 0.14 - fragment.delay * 0.22) / 0.4);
        const sx = home[index].x + Math.sin(time * fragment.speed + fragment.phase) * 12;
        const sy = home[index].y + Math.cos(time * fragment.speed * 0.8 + fragment.phase) * 8;
        const centerX = cluster.x * width;
        const centerY = cluster.y * height;
        const ring = (14 + Math.sqrt(cluster.size) * 4.5 + fragment.orbit * 0.9) * (compact ? 0.55 : 1);
        const angle = fragment.angle + time * (fragment.cluster % 2 ? -0.22 : 0.22);
        const tx = centerX + Math.cos(angle) * ring;
        const ty = centerY + Math.sin(angle) * ring * 0.86;
        const position = positions[index];
        position.x = lerp(sx, tx, t);
        position.y = lerp(sy, ty, t);
        position.t = t;
        const distance = Math.hypot(position.x - cx, position.y - cy);
        position.near = Math.max(0, 1 - distance / radius) * matching;
      });

      /* Links forming mid-flight, from each record to its entity. */
      context.lineWidth = 0.6;
      fragments.forEach((fragment, index) => {
        const position = positions[index];
        const flight = position.t * (1 - position.t) * 4;
        if (flight < 0.02) return;
        const cluster = clusters[fragment.cluster];
        context.strokeStyle = `rgba(${accent}, ${0.14 * flight})`;
        context.beginPath();
        context.moveTo(position.x, position.y);
        context.lineTo(cluster.x * width, cluster.y * height);
        context.stroke();
      });

      /* Matches under the cursor: records of the same project, linked. */
      if (matching > 0.01) {
        const groups = new Map<number, number[]>();
        positions.forEach((position, index) => {
          if (position.near < 0.12) return;
          const key = fragments[index].cluster;
          const list = groups.get(key) ?? [];
          list.push(index);
          groups.set(key, list);
        });

        let best = -1;
        let bestScore = 0;
        groups.forEach((members, key) => {
          if (members.length < 2) return;
          const score = members.reduce((sum, member) => sum + positions[member].near, 0);
          if (score > bestScore) {
            bestScore = score;
            best = key;
          }
        });

        /* The strongest entity under the cursor gets the full web; any
           others nearby are only hinted at. */
        groups.forEach((members, key) => {
          if (members.length < 2) return;
          const weight = key === best ? 0.95 : 0.16;
          members.sort(
            (a, b) =>
              Math.atan2(positions[a].y - cy, positions[a].x - cx) -
              Math.atan2(positions[b].y - cy, positions[b].x - cx)
          );
          context.lineWidth = key === best ? 1.1 : 0.7;
          for (let i = 0; i < members.length; i += 1) {
            if (members.length === 2 && i === 1) break;
            const a = positions[members[i]];
            const b = positions[members[(i + 1) % members.length]];
            context.strokeStyle = `rgba(${accent}, ${Math.min(a.near, b.near) * weight})`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        });

        if (best >= 0) tag = { label: `↳ ${clusters[best].short}`, x: cx, y: cy };
      }

      /* Records: text while loose, a point once resolved. Matches under
         the cursor are set a size up, so the eye lands on them. */
      context.textBaseline = "middle";
      for (const lifted of [false, true]) {
        const base = width < 760 ? 10 : 11;
        context.font = `500 ${lifted ? base + 1.5 : base}px ${mono}`;
        fragments.forEach((fragment, index) => {
          const position = positions[index];
          if ((position.near > 0.35) !== lifted) return;
          const textAlpha = (0.26 + position.near * 0.74) * (1 - smooth(0.45, 0.8, position.t));
          if (textAlpha <= 0.01) return;
          context.fillStyle = `rgba(${ink}, ${textAlpha})`;
          context.fillText(fragment.text, position.x, position.y);
        });
      }
      fragments.forEach((fragment, index) => {
        const position = positions[index];
        const dotAlpha = smooth(0.35, 0.85, position.t);
        if (dotAlpha > 0.01) {
          const lit = focus === fragment.cluster ? 1 : 0.62;
          context.fillStyle = `rgba(${ink}, ${dotAlpha * lit})`;
          context.beginPath();
          context.arc(position.x, position.y, focus === fragment.cluster ? 2.2 : 1.7, 0, Math.PI * 2);
          context.fill();
        }
      });

      /* Entities. */
      const formed = smooth(0.5, 0.78, p);
      if (formed > 0.01) {
        clusters.forEach((cluster, index) => {
          const x = cluster.x * width;
          const y = cluster.y * height;
          const r = (5 + Math.sqrt(cluster.size) * 1.8) * formed * (focus === index ? 1.25 : 1);
          context.fillStyle = cluster.flagship ? `rgba(${accent}, ${formed})` : `rgba(${ink}, ${formed * 0.9})`;
          context.beginPath();
          context.arc(x, y, r, 0, Math.PI * 2);
          context.fill();
          context.strokeStyle = `rgba(${cluster.flagship ? accent : ink}, ${formed * (focus === index ? 0.5 : 0.18)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(x, y, r + 7 + (focus === index ? 4 : 0), 0, Math.PI * 2);
          context.stroke();
        });
      }

      if (tag) {
        context.font = `500 11px ${mono}`;
        const labelWidth = context.measureText(tag.label).width;
        const lx = Math.min(width - labelWidth - 28, tag.x + 20);
        const ly = Math.max(24, tag.y - 26);
        context.globalAlpha = matching;
        context.fillStyle = "rgba(255, 253, 249, 0.97)";
        context.beginPath();
        context.roundRect(lx - 11, ly - 14, labelWidth + 22, 26, 13);
        context.fill();
        context.strokeStyle = `rgba(${accent}, 0.5)`;
        context.lineWidth = 1;
        context.stroke();
        context.fillStyle = `rgb(${accent})`;
        context.fillText(tag.label, lx, ly);
        context.globalAlpha = 1;
      }


      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (still) {
        frame(performance.now());
        return;
      }
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(stage);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      place();
      if (still) frame(performance.now());
    });
    if (still) frame(performance.now());

    return () => {
      cancelled = true;
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [canvasRef, stageRef, progress, auto, still, field, layout, hovered]);
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function ResolveField({
  featured,
  cinematic,
  onSelect
}: {
  featured: readonly string[];
  cinematic: boolean;
  onSelect: (slug: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hovered = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const [field] = useState(() => buildField(featured));
  const narrow = useMediaQuery("(max-width: 760px)");
  const layout = useMemo(() => layoutClusters(field.clusters, narrow), [field.clusters, narrow]);
  const [pastLabels, setPastLabels] = useState(false);
  const labelsLive = !cinematic || pastLabels;

  const progress = useSectionProgress(sectionRef, ["start start", "end end"]);
  useFieldCanvas({
    canvasRef,
    stageRef,
    progress,
    auto: !cinematic && !reduce,
    still: Boolean(reduce),
    field,
    layout,
    hovered
  });

  useMotionValueEvent(progress, "change", (p) => {
    setPastLabels(p > 0.7);
  });

  const introOpacity = useTransform(progress, [0, 0.1, 0.18], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.18], [0, -40]);
  const introBlur = useTransform(progress, [0.06, 0.18], ["blur(0px)", "blur(10px)"]);
  const outroOpacity = useTransform(progress, [0.66, 0.76], [0, 1]);
  const labelsOpacity = useTransform(progress, [0.66, 0.78], [0, 1]);

  /* Without pinning, the field resolves on its own clock; the copy and the
     entity labels follow the same clock in CSS. */
  const autoplay = !cinematic && !reduce;

  return (
    <section
      ref={sectionRef}
      className={clsx(styles.resolve, cinematic && styles.resolvePinned)}
      aria-labelledby="work-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />

        <div className={styles.introSlot}>
          <motion.div
            className={clsx(styles.intro, autoplay && styles.introAuto)}
            style={cinematic ? { opacity: introOpacity, y: introY, filter: introBlur } : undefined}
          >
            <motion.h1
              id="work-title"
              className={styles.title}
              initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.3, ease, delay: 0.25 }}
            >
              Selected work.
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease, delay: 0.55 }}
            >
              The tools, methods and results behind seven projects.{" "}
              <span className={styles.tail}>
                {cinematic ? "Hover to see what belongs together, then scroll." : "Watch them sort themselves."}
              </span>
            </motion.p>
          </motion.div>
        </div>

        <motion.p
          className={clsx(styles.outro, autoplay && styles.outroAuto)}
          style={cinematic ? { opacity: outroOpacity } : undefined}
        >
          Seven projects. <span className={styles.tail}>Choose one, or scroll for the three flagships.</span>
        </motion.p>

        <motion.ol
          className={clsx(
            styles.entities,
            labelsLive && styles.entitiesLive,
            narrow && styles.entitiesNarrow,
            autoplay && styles.entitiesAuto
          )}
          style={cinematic ? { opacity: labelsOpacity } : undefined}
          aria-label="Case files"
        >
          {layout.map((cluster, index) => (
            <li
              key={cluster.slug}
              style={{ left: `${cluster.x * 100}%`, top: `${cluster.y * 100}%` }}
            >
              <button
                type="button"
                className={clsx(styles.entity, cluster.flagship && styles.entityFlagship)}
                tabIndex={labelsLive ? 0 : -1}
                onPointerEnter={() => {
                  hovered.current = index;
                }}
                onPointerLeave={() => {
                  hovered.current = null;
                }}
                onFocus={() => {
                  hovered.current = index;
                }}
                onBlur={() => {
                  hovered.current = null;
                }}
                onClick={() => onSelect(cluster.slug)}
              >
                <span className={styles.entityIndex}>{pad(index + 1)}</span>
                <span className={styles.entityName}>{cluster.short}</span>
              </button>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
