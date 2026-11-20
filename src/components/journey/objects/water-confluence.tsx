"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import o from "./objects.module.css";

/* ─── Water: three sources, one river ────────────────────────────────
   Three streams run in from the left. Open a source and its stream
   lights and flows; the river takes its width and runs on through
   Bronze, Silver and Gold to the warehouse. Open all three and the
   river carries eighteen to twenty-four tables a day. */

const VIEW_W = 560;
const VIEW_H = 440;
const SOURCE_X = 158;
const MERGE_X = 334;
const TRUNK_Y = 214;
const TRUNK_END = 498;
const STREAM = 16;

type Source = {
  id: string;
  code: string;
  label: string;
  sub: string;
  y: number;
  tint: string;
};

const sources: readonly Source[] = [
  { id: "teradata", code: "SRC 01", label: "Teradata", sub: "Legacy warehouse", y: 118, tint: "#1f5a63" },
  { id: "bteq", code: "SRC 02", label: "BTEQ exports", sub: "Scripted extracts", y: 214, tint: "#2f7e88" },
  { id: "mixed", code: "SRC 03", label: "Mixed formats", sub: "Files and feeds", y: 310, tint: "#4f9ba2" }
];

const stages = [
  { name: "Bronze", sub: "raw, landed", x: 362, needs: 1 },
  { name: "Silver", sub: "validated, SCD2", x: 416, needs: 2 },
  { name: "Gold", sub: "served", x: 470, needs: 3 }
] as const;

/* Light pulses with uneven spacing and pace, so the river never reads as
   a dotted line. */
function pulseTiming(index: number, total: number, base: number) {
  const jitter = ((index * 7919) % 97) / 97;
  return {
    begin: -((index + jitter * 0.8) / total) * base,
    duration: base * (0.82 + jitter * 0.4),
    radius: 1.1 + ((index * 31) % 5) * 0.28,
    opacity: 0.45 + ((index * 17) % 4) * 0.1
  };
}

const tablesByCount = ["0", "6–8", "12–16", "18–24"] as const;

/* A band between two centrelines with a thickness at each end. */
function band(x0: number, y0: number, t0: number, x1: number, y1: number, t1: number) {
  const mx = (x0 + x1) / 2;
  const a = y0 - t0 / 2;
  const b = y0 + t0 / 2;
  const c = y1 - t1 / 2;
  const d = y1 + t1 / 2;
  return `M ${x0} ${a} C ${mx} ${a}, ${mx} ${c}, ${x1} ${c} L ${x1} ${d} C ${mx} ${d}, ${mx} ${b}, ${x0} ${b} Z`;
}

function centre(x0: number, y0: number, x1: number, y1: number) {
  const mx = (x0 + x1) / 2;
  return `M ${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
}

const spring = { type: "spring" as const, stiffness: 120, damping: 22 };

export function WaterConfluence({ tone = "light" }: { tone?: "light" | "dark" }) {
  const id = useId().replace(/:/g, "");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const openSources = sources.filter((source) => open[source.id]);
  const count = openSources.length;
  const trunkWidth = Math.max(2.5, count * STREAM);

  /* Each open stream takes its own lane in the river, in source order. */
  const lanes: Record<string, number> = {};
  let offset = TRUNK_Y - trunkWidth / 2;
  for (const source of openSources) {
    lanes[source.id] = offset + STREAM / 2;
    offset += STREAM;
  }

  const toggle = (sourceId: string) => setOpen((current) => ({ ...current, [sourceId]: !current[sourceId] }));

  return (
    <div className={o.object} data-tone={tone}>
      <div className={o.objectHead}>
        <span className={o.objectTitle}>Confluence</span>
        <span className={o.objectHint}>Open each source</span>
      </div>

      <div className={o.objectBody}>
        <div className={o.waterStage}>
          <svg
            className={o.riverSvg}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Three streams merging into one river that runs through Bronze, Silver and Gold to a warehouse"
          >
            <defs>
              {sources.map((source) => (
                <linearGradient key={source.id} id={`${id}-${source.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={source.tint} stopOpacity="0.95" />
                  <stop offset="50%" stopColor={source.tint} stopOpacity="0.72" />
                  <stop offset="100%" stopColor={source.tint} stopOpacity="0.95" />
                </linearGradient>
              ))}
              <linearGradient id={`${id}-trunk`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1f5a63" />
                <stop offset="62%" stopColor="#2f7e88" />
                <stop offset="100%" stopColor="#b98a50" />
              </linearGradient>
              <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id={`${id}-glow`} x="-20%" y="-80%" width="140%" height="260%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id={`${id}-soft`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
            </defs>

            {/* a quiet baseline for the whole system, with the stages as a legend */}
            <line x1="24" y1={VIEW_H - 46} x2={VIEW_W - 24} y2={VIEW_H - 46} stroke="rgba(31,90,99,0.14)" strokeWidth="0.8" />
            <text x="24" y={VIEW_H - 32} className={o.surveyCode}>
              {stages.map((stage, index) => (
                <tspan key={stage.name} opacity={count >= stage.needs ? 1 : 0.45}>
                  {index > 0 ? "   ·   " : ""}
                  {stage.name} {stage.sub}
                </tspan>
              ))}
            </text>

            {/* streams */}
            {sources.map((source) => {
              const isOpen = Boolean(open[source.id]);
              const laneY = lanes[source.id] ?? TRUNK_Y;
              const shape = band(SOURCE_X, source.y, isOpen ? STREAM : 2, MERGE_X + 3, laneY, isOpen ? STREAM : 2);
              const line = centre(SOURCE_X, source.y, MERGE_X + 3, laneY);
              return (
                <g key={source.id}>
                  {isOpen ? (
                    <motion.path d={shape} fill={source.tint} opacity="0.35" filter={`url(#${id}-glow)`} initial={false} animate={{ d: shape }} transition={spring} />
                  ) : null}
                  <motion.path
                    initial={false}
                    animate={{ d: shape, opacity: isOpen ? 1 : 0.22 }}
                    transition={spring}
                    fill={isOpen ? `url(#${id}-${source.id})` : "#1f5a63"}
                  />
                  {isOpen ? (
                    <motion.path initial={false} animate={{ d: shape }} transition={spring} fill={`url(#${id}-sheen)`} opacity="0.9" />
                  ) : null}
                  <path id={`${id}-line-${source.id}`} d={line} fill="none" stroke="none" />
                  {isOpen ? (
                    <g key={`${source.id}-${laneY}`}>
                      {Array.from({ length: 4 }, (_, index) => {
                        const timing = pulseTiming(index + sources.indexOf(source) * 4, 4, 3.6);
                        return (
                          <circle key={index} r={timing.radius} fill="#ffffff" opacity={timing.opacity + 0.2} filter={`url(#${id}-soft)`}>
                            <animateMotion dur={`${timing.duration.toFixed(2)}s`} repeatCount="indefinite" begin={`${timing.begin.toFixed(2)}s`}>
                              <mpath href={`#${id}-line-${source.id}`} />
                            </animateMotion>
                          </circle>
                        );
                      })}
                    </g>
                  ) : null}
                </g>
              );
            })}

            {/* the river */}
            {count > 0 ? (
              <motion.rect
                initial={false}
                animate={{ y: TRUNK_Y - trunkWidth / 2, height: trunkWidth }}
                transition={spring}
                x={MERGE_X}
                width={TRUNK_END - MERGE_X}
                fill="#2f7e88"
                opacity="0.35"
                filter={`url(#${id}-glow)`}
              />
            ) : null}
            <motion.rect
              initial={false}
              animate={{ y: TRUNK_Y - trunkWidth / 2, height: trunkWidth, opacity: count > 0 ? 1 : 0.22 }}
              transition={spring}
              x={MERGE_X}
              width={TRUNK_END - MERGE_X}
              rx="1"
              fill={`url(#${id}-trunk)`}
            />
            <motion.rect
              initial={false}
              animate={{ y: TRUNK_Y - trunkWidth / 2, height: trunkWidth, opacity: count > 0 ? 0.9 : 0 }}
              transition={spring}
              x={MERGE_X}
              width={TRUNK_END - MERGE_X}
              fill={`url(#${id}-sheen)`}
            />
            <path id={`${id}-trunkline`} d={`M ${MERGE_X} ${TRUNK_Y} L ${TRUNK_END} ${TRUNK_Y}`} fill="none" stroke="none" />
            {count > 0 ? (
              <g key={`trunk-${count}`}>
                {Array.from({ length: 3 + count * 2 }, (_, index) => {
                  const total = 3 + count * 2;
                  const timing = pulseTiming(index + 20, total, 3.4 - count * 0.35);
                  const lane = TRUNK_Y - trunkWidth / 2 + ((index * 53) % 100) / 100 * trunkWidth;
                  return (
                    <circle key={index} r={timing.radius} fill="#ffffff" opacity={timing.opacity} filter={`url(#${id}-soft)`}>
                      <animateMotion dur={`${timing.duration.toFixed(2)}s`} repeatCount="indefinite" begin={`${timing.begin.toFixed(2)}s`} path={`M ${MERGE_X} ${lane.toFixed(1)} L ${TRUNK_END} ${lane.toFixed(1)}`} />
                    </circle>
                  );
                })}
              </g>
            ) : null}

            {/* stage gauges */}
            {stages.map((stage) => {
              const lit = count >= stage.needs;
              const gold = stage.name === "Gold";
              const accent = gold ? "#b98a50" : "#1f5a63";
              const half = trunkWidth / 2 + 12;
              return (
                <g key={stage.name} transform={`translate(${stage.x} ${TRUNK_Y})`}>
                  <motion.line initial={false} animate={{ y1: -half, y2: half }} transition={spring} x1="0" x2="0" stroke={accent} strokeWidth="0.9" opacity={lit ? 0.9 : 0.3} style={{ transition: "opacity 0.6s" }} />
                  <motion.g initial={false} animate={{ y: -half - 8 }} transition={spring}>
                    {lit ? <circle r="9" fill={gold ? "rgba(217,178,111,0.6)" : "rgba(159,211,214,0.75)"} filter={`url(#${id}-soft)`} /> : null}
                    <circle r="3.2" fill={lit ? "#ffffff" : "rgba(255,255,255,0.4)"} stroke={accent} strokeWidth="1" style={{ transition: "fill 0.6s" }} />
                    <circle r="1.3" fill={lit ? accent : "transparent"} style={{ transition: "fill 0.6s" }} />
                    <text x="0" y="-12" textAnchor="middle" className={o.surveyStage} data-lit={lit ? "true" : "false"} data-gold={gold ? "true" : "false"}>
                      {stage.name}
                    </text>
                  </motion.g>
                </g>
              );
            })}

            {/* the terminal */}
            <g transform={`translate(${TRUNK_END + 2} ${TRUNK_Y})`}>
              <rect x="0" y="-19" width="46" height="38" rx="5" fill="rgba(255,255,255,0.6)" stroke={count === 3 ? "#b98a50" : "#1f5a63"} strokeWidth="0.9" opacity={count === 3 ? 1 : 0.5} style={{ transition: "all 0.6s" }} />
              <rect x="8" y="-9" width="30" height="4" rx="1" fill={count === 3 ? "#b98a50" : "#1f5a63"} opacity="0.5" />
              <rect x="8" y="-2" width="30" height="4" rx="1" fill={count === 3 ? "#b98a50" : "#1f5a63"} opacity="0.5" />
              <rect x="8" y="5" width="30" height="4" rx="1" fill={count === 3 ? "#b98a50" : "#1f5a63"} opacity="0.5" />
              <text x="23" y="34" textAnchor="middle" className={o.surveyCode}>
                Warehouse
              </text>
            </g>
          </svg>

          {/* the valves */}
          {sources.map((source) => {
            const isOpen = Boolean(open[source.id]);
            return (
              <button
                key={source.id}
                type="button"
                className={o.valve}
                data-open={isOpen ? "true" : "false"}
                style={{ left: `${(24 / VIEW_W) * 100}%`, top: `${(source.y / VIEW_H) * 100}%`, "--tint": source.tint } as React.CSSProperties}
                aria-pressed={isOpen}
                aria-label={`${isOpen ? "Close" : "Open"} ${source.label}`}
                onClick={() => toggle(source.id)}
              >
                <span className={o.valveRing} aria-hidden="true">
                  <i />
                </span>
                <span className={o.valveText}>
                  <small>{source.code}</small>
                  <strong>{source.label}</strong>
                  <em>{source.sub}</em>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={o.footRow}>
        <div className={o.readout}>
          <span className={o.readoutLabel}>Tables per day</span>
          <span className={o.readoutValue}>{tablesByCount[count]}</span>
        </div>
        <div className={o.readout}>
          <span className={o.readoutLabel}>Sources joined</span>
          <span className={o.readoutValue}>
            {count}
            <small>/ {sources.length}</small>
          </span>
        </div>
        <button
          type="button"
          className={o.textButton}
          onClick={() => {
            if (count === sources.length) setOpen({});
            else setOpen(Object.fromEntries(sources.map((source) => [source.id, true])));
          }}
        >
          {count === sources.length ? "Reset" : "Open all"}
        </button>
      </div>
    </div>
  );
}
