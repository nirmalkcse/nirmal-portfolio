"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ease } from "@/components/story";
import styles from "./flagship-stage.module.css";

/* ─── Explainers ─────────────────────────────────────────────────────────
   One small diagram per flagship, in three steps, showing what the system
   actually does. The data in them is illustrative and labelled as such;
   the projects' real data is confidential. */

export const DIAGRAM_W = 760;
export const DIAGRAM_H = 520;

const move = { duration: 0.9, ease };

/* ─── iCORE: three versions of one person become one golden record ───── */

type Person = { source: string; name: string; email: string; city: string };
type Field = "name" | "email" | "city";

const people: readonly Person[] = [
  { source: "CRM", name: "Priya Raman", email: "priya.raman@mail.com", city: "Chennai" },
  { source: "Billing", name: "P. Raman", email: "priya.raman@mail.com", city: "Chennai, TN" },
  { source: "Support desk", name: "Priya Raman", email: "priya.r@work.io", city: "Chennai" }
];

/** Which values agree with the other records — what the match is built on. */
const agrees: readonly Record<Field, boolean>[] = [
  { name: true, email: true, city: true },
  { name: false, email: true, city: true },
  { name: true, email: false, city: true }
];

/** The surviving value for each field, and where it came from. */
const golden: readonly { field: Field; label: string; value: string; from: string }[] = [
  { field: "name", label: "Name", value: "Priya Raman", from: "CRM" },
  { field: "email", label: "Email", value: "priya.raman@mail.com", from: "CRM · Billing" },
  { field: "city", label: "City", value: "Chennai, TN", from: "Billing" }
];

const fieldLabels: Record<Field, string> = { name: "Name", email: "Email", city: "City" };

const recordAt = [
  { x: 24, y: 72, r: -3 },
  { x: 262, y: 190, r: 1.5 },
  { x: 500, y: 92, r: 3 }
];

export function GoldenRecordDiagram({ beat }: { beat: number }) {
  const merged = beat >= 2;

  return (
    <div className={styles.diagram}>
      {people.map((person, index) => {
        const at = recordAt[index];
        return (
          <motion.div
            key={person.source}
            className={styles.record}
            initial={false}
            animate={
              merged
                ? { x: 262, y: 176, rotate: 0, scale: 0.9, opacity: 0 }
                : { x: at.x, y: at.y, rotate: at.r, scale: 1, opacity: 1 }
            }
            transition={{ ...move, delay: merged ? index * 0.06 : 0 }}
          >
            <p className={styles.recordSource}>
              <span className={styles.recordDot} aria-hidden />
              {person.source}
            </p>
            <dl className={styles.recordFields}>
              {(["name", "email", "city"] as const).map((field) => (
                <div
                  key={field}
                  className={clsx(styles.recordRow, beat >= 1 && agrees[index][field] && styles.recordRowAgree)}
                >
                  <dt>{fieldLabels[field]}</dt>
                  <dd>{person[field]}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        );
      })}

      <motion.div
        className={styles.goldenRecord}
        initial={false}
        animate={merged ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, scale: 0.92, y: 16, filter: "blur(8px)" }}
        transition={{ ...move, delay: merged ? 0.25 : 0 }}
      >
        <p className={styles.goldenHead}>
          <span className={styles.goldenMark} aria-hidden />
          Golden record
        </p>
        <dl className={styles.goldenFields}>
          {golden.map((row) => (
            <div key={row.field} className={styles.goldenRow}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
              <span className={styles.goldenFrom}>{row.from}</span>
            </div>
          ))}
        </dl>
      </motion.div>

      <p className={styles.diagramNote}>Illustrative records</p>
    </div>
  );
}

/* ─── Telecom: sources refined through Bronze, Silver and Gold ───────── */

const sourceY = [176, 248, 320];
const laneY = [214, 262, 310];
const columns = [
  { x: 196, title: "Bronze", sub: "Landed raw" },
  { x: 356, title: "Silver", sub: "Cleaned, versioned" },
  { x: 516, title: "Gold", sub: "Ready to report" }
];

function Flow({ d, on, index }: { d: string; on: boolean; index: number }) {
  const reduce = useReducedMotion();
  return (
    <g className={clsx(styles.flow, on && styles.flowOn)}>
      <path d={d} className={styles.flowPath} />
      {on && !reduce ? (
        <circle r="3.2" className={styles.flowDot}>
          <animateMotion dur="2.4s" repeatCount="indefinite" begin={`-${index * 0.8}s`} path={d} />
        </circle>
      ) : null}
    </g>
  );
}

export function MedallionDiagram({ beat }: { beat: number }) {
  const inflows = sourceY.map((y, i) => `M 122 ${y} C 160 ${y}, 160 ${laneY[i]}, 196 ${laneY[i]}`);
  const toSilver = laneY.map((y) => `M 316 ${y} L 356 ${y}`);
  const toGold = laneY.map((y) => `M 476 ${y} L 516 ${y}`);
  const toReport = "M 636 262 L 664 262";

  return (
    <div className={styles.diagram}>
      <svg viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`} className={styles.diagramSvg} aria-hidden>
        <text x="26" y="146" className={styles.svgLabel}>Teradata</text>
        {sourceY.map((y, i) => (
          <g key={y} className={clsx(styles.stagePart, styles.stagePartOn)}>
            <rect x="26" y={y - 22} width="96" height="44" rx="12" className={styles.svgBox} />
            <text x="74" y={y + 4} textAnchor="middle" className={styles.svgSmall}>
              Source {i + 1}
            </text>
          </g>
        ))}

        {inflows.map((d, i) => (
          <Flow key={d} d={d} on index={i} />
        ))}
        {toSilver.map((d, i) => (
          <Flow key={d} d={d} on={beat >= 1} index={i} />
        ))}
        {toGold.map((d, i) => (
          <Flow key={d} d={d} on={beat >= 2} index={i} />
        ))}
        <Flow d={toReport} on={beat >= 2} index={0} />

        {columns.map((column, index) => {
          const on = beat >= index;
          return (
            <g key={column.title} className={clsx(styles.stagePart, on && styles.stagePartOn)}>
              <rect
                x={column.x}
                y="110"
                width="120"
                height="300"
                rx="28"
                className={clsx(styles.svgColumn, index === 2 && styles.svgColumnGold)}
              />
              <text x={column.x + 60} y="148" textAnchor="middle" className={styles.svgTitle}>
                {column.title}
              </text>
              <text x={column.x + 60} y="168" textAnchor="middle" className={styles.svgSmall}>
                {column.sub}
              </text>
              {laneY.map((y) => (
                <line
                  key={y}
                  x1={column.x + 34}
                  x2={column.x + 86}
                  y1={y}
                  y2={y}
                  className={clsx(styles.svgRow, index === 2 && styles.svgRowGold)}
                />
              ))}
            </g>
          );
        })}

        {/* Silver keeps history: a row's old version closes, the new one is current. */}
        <g className={clsx(styles.stagePart, styles.history, beat >= 1 && styles.stagePartOn)}>
          <rect x="370" y="340" width="92" height="22" rx="7" className={styles.historyOld} />
          <text x="416" y="355" textAnchor="middle" className={styles.historyText}>v1 · closed</text>
          <rect x="370" y="368" width="92" height="22" rx="7" className={styles.historyNew} />
          <text x="416" y="383" textAnchor="middle" className={styles.historyTextNew}>v2 · current</text>
        </g>

        <g className={clsx(styles.stagePart, beat >= 2 && styles.stagePartOn)}>
          <rect x="664" y="212" width="72" height="100" rx="14" className={styles.svgBox} />
          {[30, 52, 40, 64].map((h, i) => (
            <rect key={i} x={676 + i * 13} y={296 - h} width="8" height={h} rx="2" className={styles.svgBar} />
          ))}
          <text x="700" y="336" textAnchor="middle" className={styles.svgSmall}>Reports</text>
        </g>
      </svg>
      <p className={styles.diagramNote}>Illustrative flow</p>
    </div>
  );
}

/* ─── BI: a migrated report checked against the original ─────────────── */

type ReportRow = { label: string; original: string; migrated: string };

const reportRows: readonly ReportRow[] = [
  { label: "Revenue", original: "4.82M", migrated: "4.79M" },
  { label: "Orders", original: "12,940", migrated: "12,940" },
  { label: "Active customers", original: "3,118", migrated: "3,140" },
  { label: "Average order", original: "372.4", migrated: "372.4" },
  { label: "Return rate", original: "1.8%", migrated: "2.1%" }
];

const mismatches = reportRows.filter((row) => row.original !== row.migrated).length;

export function ReconcileDiagram({ beat }: { beat: number }) {
  const fixed = beat >= 2;

  return (
    <div className={styles.diagram}>
      {(["original", "migrated"] as const).map((side) => (
        <div key={side} className={clsx(styles.report, side === "migrated" && styles.reportMigrated)}>
          <p className={styles.reportHead}>
            {side === "original" ? "Original" : "Migrated"}
            <span>{side === "original" ? "MicroStrategy" : "Fabric"}</span>
          </p>
          <dl className={styles.reportRows}>
            {reportRows.map((row) => {
              const differs = row.original !== row.migrated;
              const flagged = beat === 1 && differs;
              const value = side === "original" || fixed ? row.original : row.migrated;
              return (
                <div
                  key={row.label}
                  className={clsx(
                    styles.reportRow,
                    flagged && styles.reportRowFlagged,
                    fixed && differs && side === "migrated" && styles.reportRowFixed
                  )}
                >
                  <dt>{row.label}</dt>
                  <dd>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={value}
                        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, ease }}
                      >
                        {value}
                      </motion.span>
                    </AnimatePresence>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}

      <div className={styles.verdicts} aria-hidden>
        {reportRows.map((row) => {
          const differs = row.original !== row.migrated;
          const state = beat === 0 ? "idle" : differs && !fixed ? "differs" : "agrees";
          return (
            <span key={row.label} className={clsx(styles.verdict, styles[`verdict_${state}`])}>
              {state === "differs" ? "≠" : state === "agrees" ? "=" : ""}
            </span>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={beat}
          className={clsx(styles.reportStatus, fixed && styles.reportStatusDone)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease }}
        >
          {beat === 0
            ? "Comparing every value"
            : fixed
              ? `All ${reportRows.length} values agree`
              : `${mismatches} of ${reportRows.length} values differ`}
        </motion.p>
      </AnimatePresence>

      <p className={styles.diagramNote}>Illustrative report</p>
    </div>
  );
}
