"use client";

import { motion } from "framer-motion";
import { useId, useState, type KeyboardEvent } from "react";
import o from "./objects.module.css";

/* ─── Ether: a constellation of records ──────────────────────────────
   Scattered records from different systems. Tap one and its cluster
   resolves: matched records draw toward a golden record, a near miss is
   held for steward review, and a look-alike is kept apart. Three outcomes,
   the same three iCORE writes: auto match, possible match, no match. */

const VIEW_W = 560;
const VIEW_H = 440;
const RING = 60;

type ClusterId = "person" | "org";

type StarRecord = {
  id: string;
  label: string;
  source: string;
  x: number;
  y: number;
  cluster: ClusterId | "possible" | "none";
};

const records: readonly StarRecord[] = [
  { id: "p1", label: "Nirmal Kumar P", source: "CRM", x: 96, y: 120, cluster: "person" },
  { id: "p2", label: "N. Kumar", source: "Billing", x: 212, y: 64, cluster: "person" },
  { id: "p3", label: "NIRMAL KUMAR P.", source: "HR", x: 72, y: 236, cluster: "person" },
  { id: "o1", label: "iLink Systems", source: "CRM", x: 392, y: 104, cluster: "org" },
  { id: "o2", label: "ILINK SYS.", source: "Billing", x: 486, y: 196, cluster: "org" },
  { id: "o3", label: "iLink Systems Pvt. Ltd", source: "Procurement", x: 330, y: 206, cluster: "org" },
  { id: "q1", label: "Nirmal Kumar", source: "Support", x: 236, y: 326, cluster: "possible" },
  { id: "n1", label: "Nirmala Kumari", source: "Marketing", x: 468, y: 346, cluster: "none" }
];

const possible = records[6];
const noMatch = records[7];

const golden: Record<ClusterId, { x: number; y: number; value: string; score: string }> = {
  person: { x: 160, y: 168, value: "Nirmal Kumar P", score: "auto match · 0.96" },
  org: { x: 410, y: 180, value: "iLink Systems", score: "auto match · 0.93" }
};

/* The background field: tiny fixed stars, so the sky has depth before any
   record is touched. Integer arithmetic only, so the server and every
   browser place them on exactly the same pixel. */
function mulberry(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const dust = (() => {
  const next = mulberry(1309);
  return Array.from({ length: 70 }, () => ({
    x: Math.round(next() * VIEW_W * 10) / 10,
    y: Math.round(next() * VIEW_H * 10) / 10,
    r: Math.round((0.4 + next() * 1.1) * 100) / 100
  }));
})();

type Placement = { x: number; y: number; angle: number | null };

/** Members settle on a ring with no one straight above the golden record,
    so its name has room to sit there. */
function ringPlacement(index: number, count: number, centre: { x: number; y: number }): Placement {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2 + Math.PI / count;
  return { x: centre.x + Math.cos(angle) * RING, y: centre.y + Math.sin(angle) * RING, angle };
}

function labelAnchor(angle: number | null) {
  if (angle === null) return { x: 0, y: 22, anchor: "middle" as const };
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  if (Math.abs(dx) < 0.35) return { x: 0, y: dy > 0 ? 24 : -14, anchor: "middle" as const };
  return { x: dx > 0 ? 14 : -14, y: dy * 10 + 4, anchor: dx > 0 ? ("start" as const) : ("end" as const) };
}

const GLINT = "M 0 -11 Q 1.2 -1.2 11 0 Q 1.2 1.2 0 11 Q -1.2 1.2 -11 0 Q -1.2 -1.2 0 -11 Z";

export function EtherConstellation({ tone = "dark" }: { tone?: "light" | "dark" }) {
  const id = useId().replace(/:/g, "");
  const [resolved, setResolved] = useState<Record<ClusterId, boolean>>({ person: false, org: false });

  const resolve = (cluster: StarRecord["cluster"]) => {
    if (cluster === "person" || cluster === "org") {
      setResolved((current) => ({ ...current, [cluster]: true }));
    } else if (cluster === "possible") {
      setResolved((current) => ({ ...current, person: true }));
    }
  };

  const handleKey = (record: StarRecord) => (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      resolve(record.cluster);
    }
  };

  const allResolved = resolved.person && resolved.org;
  const resolvedCount = Number(resolved.person) + Number(resolved.org);

  const placementFor = (record: StarRecord): Placement => {
    if ((record.cluster === "person" || record.cluster === "org") && resolved[record.cluster]) {
      const members = records.filter((candidate) => candidate.cluster === record.cluster);
      const index = members.findIndex((candidate) => candidate.id === record.id);
      return ringPlacement(index, members.length, golden[record.cluster]);
    }
    return { x: record.x, y: record.y, angle: null };
  };

  return (
    <div className={o.object} data-tone={tone}>
      <div className={o.objectHead}>
        <span className={o.objectTitle}>Constellation</span>
        <span className={o.objectHint}>Tap a record</span>
      </div>

      <div className={o.objectBody}>
        <div className={o.skyDark}>
          <svg
            className={o.starSvg}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Eight scattered records resolving into two golden records"
          >
            <defs>
              <filter id={`${id}-nebula`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="4" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.40  0 0 0 0 0.30  0 0 0 0 0.65  0 0 0 0.6 0" />
                <feGaussianBlur stdDeviation="10" />
              </filter>
              <filter id={`${id}-soft`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <filter id={`${id}-bloom`} x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <radialGradient id={`${id}-haze`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(90, 70, 140, 0.45)" />
                <stop offset="100%" stopColor="rgba(90, 70, 140, 0)" />
              </radialGradient>
            </defs>

            {/* nebula and dust */}
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} filter={`url(#${id}-nebula)`} opacity="0.55" />
            <ellipse cx="380" cy="120" rx="220" ry="120" fill={`url(#${id}-haze)`} />
            {dust.map((grain, index) => (
              <circle key={index} cx={grain.x} cy={grain.y} r={grain.r} fill="rgba(255,255,255,0.55)" />
            ))}

            {/* match lines */}
            {(["person", "org"] as const).map((cluster) =>
              resolved[cluster]
                ? records
                    .filter((record) => record.cluster === cluster)
                    .map((record) => {
                      const target = placementFor(record);
                      const d = `M ${target.x} ${target.y} L ${golden[cluster].x} ${golden[cluster].y}`;
                      return (
                        <g key={`${cluster}-${record.id}`}>
                          <motion.path
                            className={o.matchLineGlow}
                            d={d}
                            filter={`url(#${id}-soft)`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                          <motion.path
                            className={o.matchLine}
                            d={d}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </g>
                      );
                    })
                : null
            )}

            {resolved.person ? (
              <g>
                <motion.path
                  className={`${o.matchLine} ${o.matchLinePossible}`}
                  d={`M ${possible.x} ${possible.y} L ${golden.person.x} ${golden.person.y}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.text
                  className={o.scoreLabel}
                  x={possible.x - 14}
                  y={possible.y - 10}
                  textAnchor="end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  0.72 · possible · steward review
                </motion.text>
              </g>
            ) : null}

            {allResolved ? (
              <motion.text
                className={o.scoreLabel}
                x={noMatch.x}
                y={noMatch.y + 48}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                0.18 · no match · kept apart
              </motion.text>
            ) : null}

            {/* golden records */}
            {(["person", "org"] as const).map((cluster) =>
              resolved[cluster] ? (
                <g key={cluster} transform={`translate(${golden[cluster].x} ${golden[cluster].y})`}>
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.6, 1], opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <circle r="22" fill="rgba(241, 208, 143, 0.5)" filter={`url(#${id}-bloom)`} />
                    <circle r="10" fill="rgba(251, 228, 173, 0.8)" filter={`url(#${id}-soft)`} />
                    <path d={GLINT} fill="rgba(251, 228, 173, 0.85)" transform="scale(1.9)" />
                    <circle className={o.golden} r="5" />
                    <circle r="2" fill="#ffffff" />
                  </motion.g>
                  <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}>
                    <text className={o.goldenLabel} x="0" y={-RING - 30} textAnchor="middle">
                      Golden record · {golden[cluster].score}
                    </text>
                    <text className={o.goldenValue} x="0" y={-RING - 13} textAnchor="middle">
                      {golden[cluster].value}
                    </text>
                  </motion.g>
                </g>
              ) : null
            )}

            {/* records */}
            {records.map((record, index) => {
              const target = placementFor(record);
              const isResolved =
                (record.cluster === "person" || record.cluster === "org") && resolved[record.cluster];
              const label = labelAnchor(target.angle);
              return (
                <motion.g
                  key={record.id}
                  className={o.star}
                  data-resolved={isResolved ? "true" : "false"}
                  initial={false}
                  animate={{ x: target.x, y: target.y }}
                  transition={{ type: "spring", stiffness: 42, damping: 16, delay: isResolved ? 0.1 : 0 }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${record.label}, from ${record.source}. ${isResolved ? "Resolved." : "Resolve this record."}`}
                  onClick={() => resolve(record.cluster)}
                  onKeyDown={handleKey(record)}
                >
                  <circle r="18" fill="transparent" />
                  <circle
                    className={o.starHalo}
                    r="9"
                    filter={`url(#${id}-soft)`}
                    style={{ animationDelay: `${(index * 0.47) % 3}s`, transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  <path className={o.starGlint} d={GLINT} transform={`scale(${isResolved ? 0.7 : 0.85})`} />
                  <circle className={o.starCore} r={isResolved ? 2.2 : 2.6} />
                  <text className={o.starLabel} x={label.x} y={label.y} textAnchor={label.anchor}>
                    {record.label}
                  </text>
                  {!isResolved ? (
                    <text className={o.starSource} x="0" y="34" textAnchor="middle">
                      {record.source}
                    </text>
                  ) : null}
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className={o.footRow}>
        <div className={o.legend} aria-hidden="true">
          <span className={o.legendItem}>
            <span className={o.legendDot} style={{ background: "#f1d08f", boxShadow: "0 0 8px #f1d08f" }} /> Auto match
          </span>
          <span className={o.legendItem}>
            <span className={o.legendDot} style={{ background: "#e2a57e" }} /> Possible
          </span>
          <span className={o.legendItem}>
            <span className={o.legendDot} style={{ background: "rgba(244,241,236,0.35)" }} /> No match
          </span>
        </div>
        <div className={o.readout}>
          <span className={o.readoutLabel}>Golden records</span>
          <span className={o.readoutValue}>
            {resolvedCount}
            <small>/ 2</small>
          </span>
        </div>
        <button
          type="button"
          className={o.textButton}
          onClick={() =>
            setResolved(allResolved ? { person: false, org: false } : { person: true, org: true })
          }
        >
          {allResolved ? "Scatter again" : "Resolve all"}
        </button>
      </div>
    </div>
  );
}
