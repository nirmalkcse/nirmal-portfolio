"use client";

import { GripHorizontal } from "lucide-react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import o from "./objects.module.css";

/* ─── Earth: a core sample through three strata ──────────────────────
   A cylinder of ground, cut clean. Drag the drill down and each layer it
   passes is excavated: the muted sediment turns vivid and gives up the
   fact buried in it. Deepest is oldest, as it is in the ground. */

const VIEW_W = 420;
const VIEW_H = 520;
const SURFACE = 58;
const CX = 210;
const RX = 122;
const RY = 22;

type Layer = {
  id: string;
  name: string;
  stage: string;
  fact: string;
  top: number;
  fill: readonly [string, string, string];
  muted: readonly [string, string];
  swatch: string;
};

const layers: readonly Layer[] = [
  {
    id: "gold",
    name: "Gold",
    stage: "Served",
    fact: "Medallion architecture on Fabric and Power BI",
    top: SURFACE,
    fill: ["#f3dfae", "#d9b26f", "#b98a50"],
    muted: ["#ece5d6", "#e2d9c6"],
    swatch: "#d9b26f"
  },
  {
    id: "silver",
    name: "Silver",
    stage: "Refined",
    fact: "IEEE Xplore publication, 2024",
    top: 206,
    fill: ["#e6e1d8", "#c4bcb0", "#a39b90"],
    muted: ["#e6dfd1", "#dbd2c2"],
    swatch: "#b8b0a5"
  },
  {
    id: "bronze",
    name: "Bronze",
    stage: "Raw",
    fact: "B.E. Computer Science, 9.11/10 CGPA",
    top: 352,
    fill: ["#c98a5c", "#9a5637", "#6d3d22"],
    muted: ["#dfd3c1", "#d3c5b0"],
    swatch: "#9a5637"
  }
];

type Fossil = { x: number; y: number; kind: "ring" | "diamond" | "dot" };

const fossils: readonly Fossil[] = [
  { x: 140, y: 132, kind: "ring" },
  { x: 292, y: 168, kind: "dot" },
  { x: 236, y: 276, kind: "diamond" },
  { x: 160, y: 310, kind: "ring" },
  { x: 176, y: 428, kind: "diamond" },
  { x: 278, y: 456, kind: "dot" }
];

/* A layer body: the front face of the cylinder below an elliptical seam. */
function layerPath(top: number) {
  return `M ${CX - RX} ${top} A ${RX} ${RY} 0 0 0 ${CX + RX} ${top} L ${CX + RX} ${VIEW_H} L ${CX - RX} ${VIEW_H} Z`;
}

function seamPath(top: number) {
  return `M ${CX - RX} ${top} A ${RX} ${RY} 0 0 0 ${CX + RX} ${top}`;
}

function FossilGlyph({ fossil, lit }: { fossil: Fossil; lit: boolean }) {
  const stroke = lit ? "rgba(42, 33, 26, 0.72)" : "rgba(42, 33, 26, 0.14)";
  if (fossil.kind === "ring") {
    return <circle cx={fossil.x} cy={fossil.y} r={7} fill="none" stroke={stroke} strokeWidth={1.2} />;
  }
  if (fossil.kind === "diamond") {
    return (
      <path
        d={`M ${fossil.x} ${fossil.y - 7} L ${fossil.x + 7} ${fossil.y} L ${fossil.x} ${fossil.y + 7} L ${fossil.x - 7} ${fossil.y} Z`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.2}
      />
    );
  }
  return <circle cx={fossil.x} cy={fossil.y} r={3} fill={stroke} />;
}

function Cylinder({ id, vivid }: { id: string; vivid: boolean }) {
  return (
    <g>
      {layers.map((layer) => (
        <path key={layer.id} d={layerPath(layer.top)} fill={`url(#${id}-${vivid ? "v" : "m"}-${layer.id})`} />
      ))}
      {/* seams, darker on the vivid core */}
      {layers.slice(1).map((layer) => (
        <path
          key={`${layer.id}-seam`}
          d={seamPath(layer.top)}
          fill="none"
          stroke={vivid ? "rgba(42, 33, 26, 0.35)" : "rgba(42, 33, 26, 0.1)"}
          strokeWidth="1.2"
        />
      ))}
      {/* grain */}
      <rect x={CX - RX} y={SURFACE} width={RX * 2} height={VIEW_H - SURFACE} fill={`url(#${id}-grain)`} opacity={vivid ? 1 : 0.6} />
      {/* cylindrical shading: dark edges, a soft highlight a third of the way in */}
      <rect x={CX - RX} y={SURFACE} width={RX * 2} height={VIEW_H - SURFACE} fill={`url(#${id}-round)`} />
      {fossils.map((fossil, index) => (
        <FossilGlyph key={index} fossil={fossil} lit={vivid} />
      ))}
    </g>
  );
}

export function EarthStrata({ tone = "light" }: { tone?: "light" | "dark" }) {
  const id = useId().replace(/:/g, "");
  const trackRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const bitRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGEllipseElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [trackHeight, setTrackHeight] = useState(240);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const y = useMotionValue(0);
  const depth = useTransform(y, (value) => Math.min(1, Math.max(0, value / Math.max(1, trackHeight))));
  const railScale = useTransform(depth, (value) => value);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setTrackHeight(Math.max(1, track.clientHeight - 36 - 36));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(depth, "change", (value) => {
    const svgDepth = SURFACE + value * (VIEW_H - SURFACE);
    clipRef.current?.setAttribute("height", String(Math.max(0, svgDepth + RY)));
    bitRef.current?.setAttribute("transform", `translate(0 ${svgDepth.toFixed(1)})`);
    ringRef.current?.setAttribute("cy", String(Math.min(VIEW_H - RY, svgDepth)));
    if (readoutRef.current) readoutRef.current.textContent = (value * 12).toFixed(1);
    setRevealed((current) => {
      let changed = false;
      const next = { ...current };
      for (const layer of layers) {
        const isRevealed = svgDepth > layer.top + 30;
        if (Boolean(current[layer.id]) !== isRevealed) {
          next[layer.id] = isRevealed;
          changed = true;
        }
      }
      return changed ? next : current;
    });
  });

  const drillTo = (fraction: number) => {
    animate(y, Math.min(1, Math.max(0, fraction)) * trackHeight, {
      type: "spring",
      stiffness: 120,
      damping: 22
    });
  };

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = depth.get();
    const step = 0.08;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      drillTo(current + step);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      drillTo(current - step);
    } else if (event.key === "Home") {
      event.preventDefault();
      drillTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      drillTo(1);
    }
  };

  const revealedCount = layers.filter((layer) => revealed[layer.id]).length;

  return (
    <div className={o.object} data-tone={tone}>
      <div className={o.objectHead}>
        <span className={o.objectTitle}>Core sample</span>
        <span className={o.objectHint}>Drag the drill down</span>
      </div>

      <div className={o.earthGrid}>
        <div ref={trackRef} className={o.drillTrack}>
          <span className={o.drillRail} aria-hidden="true">
            <motion.span className={o.drillRailFill} style={{ scaleY: railScale, height: trackHeight }} />
          </span>
          <motion.div
            className={o.drillKnob}
            drag="y"
            dragConstraints={{ top: 0, bottom: trackHeight }}
            dragElastic={0}
            dragMomentum={false}
            style={{ y, marginTop: 18 }}
            role="slider"
            tabIndex={0}
            aria-label="Drill depth"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(depth.get() * 100)}
            aria-valuetext={`${revealedCount} of ${layers.length} layers revealed`}
            onKeyDown={handleKey}
            whileDrag={{ scale: 1.08 }}
          >
            <GripHorizontal aria-hidden="true" />
          </motion.div>
        </div>

        <svg
          className={o.strataSvg}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="A cylindrical core sample with three sediment layers: gold, silver, and bronze, read from the surface down"
        >
          <defs>
            {layers.map((layer) => (
              <linearGradient key={`v-${layer.id}`} id={`${id}-v-${layer.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={layer.fill[0]} />
                <stop offset="55%" stopColor={layer.fill[1]} />
                <stop offset="100%" stopColor={layer.fill[2]} />
              </linearGradient>
            ))}
            {layers.map((layer) => (
              <linearGradient key={`m-${layer.id}`} id={`${id}-m-${layer.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={layer.muted[0]} />
                <stop offset="100%" stopColor={layer.muted[1]} />
              </linearGradient>
            ))}
            <linearGradient id={`${id}-round`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(40, 25, 10, 0.5)" />
              <stop offset="14%" stopColor="rgba(40, 25, 10, 0.08)" />
              <stop offset="30%" stopColor="rgba(255, 255, 255, 0.34)" />
              <stop offset="48%" stopColor="rgba(255, 255, 255, 0.04)" />
              <stop offset="78%" stopColor="rgba(40, 25, 10, 0.14)" />
              <stop offset="100%" stopColor="rgba(40, 25, 10, 0.58)" />
            </linearGradient>
            <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbf3df" />
              <stop offset="100%" stopColor="#e4d2a8" />
            </linearGradient>
            <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6c6259" />
              <stop offset="40%" stopColor="#f2ede6" />
              <stop offset="60%" stopColor="#c9c0b5" />
              <stop offset="100%" stopColor="#5a504a" />
            </linearGradient>
            <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(40, 25, 10, 0.35)" />
              <stop offset="100%" stopColor="rgba(40, 25, 10, 0)" />
            </radialGradient>
            <pattern id={`${id}-grain`} width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="4" r="0.8" fill="rgba(42,33,26,0.14)" />
              <circle cx="10" cy="11" r="0.6" fill="rgba(42,33,26,0.1)" />
              <circle cx="7" cy="8" r="0.5" fill="rgba(255,255,255,0.35)" />
            </pattern>
            <clipPath id={`${id}-clip`}>
              <rect ref={clipRef} x="0" y="0" width={VIEW_W} height={SURFACE + RY} />
            </clipPath>
            <filter id={`${id}-glow`} x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* ground shadow */}
          <ellipse cx={CX} cy={VIEW_H - 14} rx={RX + 30} ry={22} fill={`url(#${id}-shadow)`} />

          {/* the core, before the drill reaches it */}
          <Cylinder id={id} vivid={false} />

          {/* the excavated core: vivid, labelled, remembered */}
          <g clipPath={`url(#${id}-clip)`}>
            <Cylinder id={id} vivid />
          </g>

          {/* the cap: the surface, seen from slightly above */}
          <ellipse cx={CX} cy={SURFACE} rx={RX} ry={RY} fill={`url(#${id}-cap)`} stroke="rgba(42, 33, 26, 0.28)" strokeWidth="1" />
          <ellipse cx={CX - 20} cy={SURFACE - 4} rx={60} ry={8} fill="rgba(255,255,255,0.45)" />

          {/* the drill, down the core's axis */}
          <g ref={bitRef} transform={`translate(0 ${SURFACE})`}>
            <rect x={CX - 3.5} y={-VIEW_H} width="7" height={VIEW_H} fill={`url(#${id}-steel)`} opacity="0.9" />
            <path d={`M ${CX - 9} -6 L ${CX} 10 L ${CX + 9} -6 Z`} fill="#3b312b" />
            <path d={`M ${CX - 9} -6 L ${CX} 10 L ${CX - 1} -6 Z`} fill="#8c8178" />
          </g>

          {/* the scan ring at the current depth */}
          <ellipse ref={ringRef} cx={CX} cy={SURFACE} rx={RX} ry={RY} fill="none" stroke="#d9b26f" strokeWidth="3" opacity="0.5" filter={`url(#${id}-glow)`} />
          <ellipse cx={CX} cy={SURFACE} rx={RX} ry={RY} fill="none" stroke="rgba(154, 86, 55, 0.0)" />

          {/* the inscriptions, over the rod, with a halo of the ground itself */}
          <g clipPath={`url(#${id}-clip)`} style={{ paintOrder: "stroke" }}>
            {layers.map((layer, index) => (
              <g key={layer.id} stroke="rgba(250, 243, 228, 0.75)" strokeWidth="3.5" strokeLinejoin="round">
                <text x={CX - RX + 24} y={layer.top + 54} className={o.strataLabel}>
                  {String(index + 1).padStart(2, "0")} · {layer.name} · {layer.stage}
                </text>
                <text x={CX - RX + 24} y={layer.top + 76} className={o.strataFact}>
                  {layer.fact}
                </text>
              </g>
            ))}
          </g>
        </svg>

        <ol className={o.strataLegend} aria-label="Layers">
          {layers.map((layer, index) => (
            <li key={layer.id}>
              <button
                type="button"
                className={o.strataItem}
                data-revealed={revealed[layer.id] ? "true" : "false"}
                onClick={() => drillTo((layer.top + 96 - SURFACE) / (VIEW_H - SURFACE))}
                aria-label={`Drill to the ${layer.name} layer`}
              >
                <span className={o.strataItemHead}>
                  <span className={o.strataSwatch} style={{ background: layer.swatch }} aria-hidden="true" />
                  <span className={o.strataName}>{layer.name}</span>
                  <span className={o.strataStage}>
                    {String(index + 1).padStart(2, "0")} · {layer.stage}
                  </span>
                </span>
                <span className={o.strataFactText}>{layer.fact}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={o.footRow}>
        <div className={o.readout}>
          <span className={o.readoutLabel}>Depth</span>
          <span className={o.readoutValue}>
            <span ref={readoutRef}>0.0</span>
            <small>m</small>
          </span>
        </div>
        <div className={o.readout}>
          <span className={o.readoutLabel}>Layers read</span>
          <span className={o.readoutValue}>
            {revealedCount}
            <small>/ {layers.length}</small>
          </span>
        </div>
      </div>
    </div>
  );
}
