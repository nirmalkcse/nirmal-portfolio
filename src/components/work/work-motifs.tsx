"use client";

import clsx from "clsx";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/components/story";
import styles from "./work-showcase.module.css";

/* ─── Motifs ─────────────────────────────────────────────────────────────
   One hairline drawing per project, standing in for screenshots that are
   not yet approved for public use. Each one says what the system does:
   records converging, layers refining, bars reconciling. */

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (order: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease, delay: 0.1 + order * 0.07 },
      opacity: { duration: 0.25, delay: 0.1 + order * 0.07 }
    }
  })
};

const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  shown: (order: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.9, ease, delay: 0.2 + order * 0.06 }
  })
};

/** Trig output, rounded so server and browser render identical markup. */
const at = (value: number) => Math.round(value * 100) / 100;

const fade: Variants = {
  hidden: { opacity: 0 },
  shown: (order: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, ease, delay: 0.3 + order * 0.06 }
  })
};

function Frame({ active, children, className }: { active: boolean; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className={clsx(styles.motif, className)}
      initial={reduce ? "shown" : "hidden"}
      animate={active || reduce ? "shown" : "hidden"}
      aria-hidden
      focusable="false"
    >
      {children}
    </motion.svg>
  );
}

/* iCORE — many records converge into one golden record. */
function GoldenRecord({ active }: { active: boolean }) {
  const records = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2 + (index % 3) * 0.11;
    const radius = index % 2 === 0 ? 176 : 128;
    return {
      x: at(200 + Math.cos(angle) * radius),
      y: at(200 + Math.sin(angle) * radius)
    };
  });

  return (
    <Frame active={active}>
      {[70, 128, 176].map((r, index) => (
        <motion.circle key={r} cx="200" cy="200" r={r} className={styles.faint} variants={draw} custom={index} />
      ))}
      <g className={styles.orbit}>
        {records.map((point, index) => (
          <motion.line
            key={`l-${index}`}
            x1={point.x}
            y1={point.y}
            x2="200"
            y2="200"
            className={styles.thin}
            variants={draw}
            custom={3 + index * 0.45}
          />
        ))}
        {records.map((point, index) => (
          <motion.circle
            key={`c-${index}`}
            cx={point.x}
            cy={point.y}
            r="4.5"
            className={styles.node}
            variants={pop}
            custom={index * 0.5}
          />
        ))}
      </g>
      <motion.circle cx="200" cy="200" r="32" className={styles.accentLine} variants={draw} custom={12} />
      <motion.circle cx="200" cy="200" r="13" className={styles.accentFill} variants={pop} custom={16} />
    </Frame>
  );
}

/* Telecom — three sources refined through Bronze, Silver and Gold. */
function Medallion({ active }: { active: boolean }) {
  const sources = [110, 200, 290];
  const columns = [
    { x: 146, label: "BRONZE" },
    { x: 236, label: "SILVER" },
    { x: 326, label: "GOLD" }
  ];
  const lanes = [140, 200, 260];

  const flows = sources.map(
    (sy, index) => `M 66 ${sy} C 110 ${sy}, 104 ${lanes[index]}, 146 ${lanes[index]}`
  );
  const links = columns.slice(0, -1).flatMap((column) =>
    lanes.map((ly) => `M ${column.x + 52} ${ly} L ${column.x + 90} ${ly}`)
  );

  return (
    <Frame active={active}>
      {sources.map((sy, index) => (
        <motion.rect
          key={sy}
          x="40"
          y={sy - 13}
          width="26"
          height="26"
          rx="6"
          className={styles.line}
          variants={draw}
          custom={index}
        />
      ))}
      {flows.map((d, index) => (
        <motion.path key={d} d={d} className={styles.thin} variants={draw} custom={3 + index} />
      ))}
      {[...flows, ...links].map((d, index) => (
        <motion.path key={`dash-${d}`} d={d} className={styles.flow} variants={fade} custom={14 + index * 0.2} />
      ))}
      {links.map((d, index) => (
        <motion.path key={d} d={d} className={styles.thin} variants={draw} custom={8 + index * 0.4} />
      ))}
      {columns.map((column, index) => {
        const gold = index === columns.length - 1;
        return (
          <g key={column.label}>
            <motion.rect
              x={column.x}
              y="78"
              width="52"
              height="244"
              rx="26"
              className={gold ? styles.accentLine : styles.line}
              variants={draw}
              custom={5 + index * 1.5}
            />
            {Array.from({ length: 6 }, (_, row) => (
              <motion.line
                key={row}
                x1={column.x + 16}
                x2={column.x + 36}
                y1={112 + row * 36}
                y2={112 + row * 36}
                className={gold ? styles.accentLine : styles.thin}
                variants={draw}
                custom={9 + index * 1.5 + row * 0.3}
              />
            ))}
            <motion.text
              x={column.x + 26}
              y="350"
              textAnchor="middle"
              className={styles.caption}
              variants={fade}
              custom={10 + index}
            >
              {column.label}
            </motion.text>
          </g>
        );
      })}
    </Frame>
  );
}

/* BI — target bars settle until they match the source. */
function Reconcile({ active }: { active: boolean }) {
  const heights = [74, 124, 92, 156, 108, 138];
  const drift = [34, -42, 28, -38, 24, -30];
  const base = 300;

  return (
    <Frame active={active}>
      <motion.line x1="36" x2="364" y1={base} y2={base} className={styles.line} variants={draw} custom={0} />
      <motion.line x1="200" x2="200" y1="86" y2={base} className={styles.dashed} variants={fade} custom={1} />
      {heights.map((h, index) => (
        <motion.rect
          key={`s-${index}`}
          x={50 + index * 23}
          width="12"
          rx="2"
          className={styles.bar}
          variants={{
            hidden: { height: 0, y: base, opacity: 0 },
            shown: {
              height: h,
              y: base - h,
              opacity: 1,
              transition: { duration: 1.1, ease, delay: 0.2 + index * 0.06 }
            }
          }}
        />
      ))}
      {heights.map((h, index) => (
        <motion.rect
          key={`t-${index}`}
          x={226 + index * 23}
          width="12"
          rx="2"
          className={styles.barAccent}
          variants={{
            hidden: { height: h + drift[index], y: base - h - drift[index], opacity: 0 },
            shown: {
              height: [h + drift[index], h + drift[index], h],
              y: [base - h - drift[index], base - h - drift[index], base - h],
              opacity: [0, 1, 1],
              transition: { duration: 2.2, ease, times: [0, 0.35, 1], delay: 0.5 + index * 0.08 }
            }
          }}
        />
      ))}
      {heights.map((h, index) => (
        <motion.line
          key={`g-${index}`}
          x1={56 + index * 23}
          x2={232 + index * 23}
          y1={base - h}
          y2={base - h}
          className={styles.guide}
          variants={fade}
          custom={30 + index}
        />
      ))}
      <motion.circle cx="322" cy="84" r="19" className={styles.accentLine} variants={draw} custom={26} />
      <motion.path d="M 313 84 L 320 91 L 332 77" className={styles.accentLine} variants={draw} custom={30} />
      <motion.text x="118" y="326" textAnchor="middle" className={styles.caption} variants={fade} custom={4}>
        SOURCE
      </motion.text>
      <motion.text x="294" y="326" textAnchor="middle" className={styles.caption} variants={fade} custom={5}>
        TARGET
      </motion.text>
    </Frame>
  );
}

/* IEEE — a semiconductor die. */
function Chip({ active }: { active: boolean }) {
  const pins = Array.from({ length: 7 }, (_, index) => 134 + index * 22);

  return (
    <Frame active={active}>
      <motion.rect x="110" y="110" width="180" height="180" rx="12" className={styles.line} variants={draw} custom={0} />
      <motion.rect x="140" y="140" width="120" height="120" rx="6" className={styles.thin} variants={draw} custom={2} />
      {[170, 200, 230].map((v, index) => (
        <g key={v}>
          <motion.line x1={v} x2={v} y1="140" y2="260" className={styles.faint} variants={draw} custom={4 + index} />
          <motion.line x1="140" x2="260" y1={v} y2={v} className={styles.faint} variants={draw} custom={4 + index} />
        </g>
      ))}
      <motion.rect x="200" y="170" width="30" height="30" className={styles.accentFill} variants={pop} custom={12} />
      {pins.map((p, index) => (
        <g key={p}>
          <motion.line x1={p} x2={p} y1="84" y2="110" className={styles.thin} variants={draw} custom={6 + index * 0.3} />
          <motion.line x1={p} x2={p} y1="290" y2="316" className={styles.thin} variants={draw} custom={6 + index * 0.3} />
          <motion.line x1="84" x2="110" y1={p} y2={p} className={styles.thin} variants={draw} custom={6 + index * 0.3} />
          <motion.line x1="290" x2="316" y1={p} y2={p} className={styles.thin} variants={draw} custom={6 + index * 0.3} />
        </g>
      ))}
    </Frame>
  );
}

/* FabCon — a question asked of the data, answered in a voice. */
function Conversation({ active }: { active: boolean }) {
  const bars = [18, 34, 54, 40, 70, 48, 86, 60, 44, 72, 38, 56, 30, 22, 14];

  return (
    <Frame active={active}>
      <motion.path
        d="M 96 110 H 304 A 26 26 0 0 1 330 136 V 244 A 26 26 0 0 1 304 270 H 150 L 112 304 L 118 270 H 96 A 26 26 0 0 1 70 244 V 136 A 26 26 0 0 1 96 110 Z"
        className={styles.line}
        variants={draw}
        custom={0}
      />
      {bars.map((h, index) => (
        <motion.line
          key={index}
          x1={109 + index * 13}
          x2={109 + index * 13}
          y1={190 - h / 2}
          y2={190 + h / 2}
          className={clsx(styles.wave, index === 6 && styles.waveAccent)}
          style={{ animationDelay: `${index * 90}ms` }}
          variants={draw}
          custom={3 + index * 0.25}
        />
      ))}
      <motion.path
        d="M 330 72 L 335 89 L 352 94 L 335 99 L 330 116 L 325 99 L 308 94 L 325 89 Z"
        className={styles.accentFill}
        variants={pop}
        custom={14}
      />
    </Frame>
  );
}

/* Insurance — a star-schema semantic model. */
function StarSchema({ active }: { active: boolean }) {
  const dims = Array.from({ length: 6 }, (_, index) => {
    const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: at(200 + Math.cos(angle) * 128), y: at(200 + Math.sin(angle) * 128) };
  });

  return (
    <Frame active={active}>
      {dims.map((d, index) => (
        <motion.line key={`l-${index}`} x1="200" y1="200" x2={d.x} y2={d.y} className={styles.thin} variants={draw} custom={2 + index * 0.4} />
      ))}
      {dims.map((d, index) => (
        <motion.rect
          key={`r-${index}`}
          x={d.x - 32}
          y={d.y - 20}
          width="64"
          height="40"
          rx="9"
          className={index === 1 ? styles.accentLine : styles.nodeRect}
          variants={draw}
          custom={4 + index * 0.4}
        />
      ))}
      <motion.rect x="156" y="170" width="88" height="60" rx="12" className={styles.accentSolid} variants={pop} custom={8} />
    </Frame>
  );
}

/* VITAC — TAM, SAM, SOM. */
function MarketSizing({ active }: { active: boolean }) {
  const rings = [
    { r: 150, cy: 186, label: "TAM" },
    { r: 100, cy: 236, label: "SAM" },
    { r: 50, cy: 286, label: "SOM" }
  ];

  return (
    <Frame active={active}>
      {rings.map((ring, index) => (
        <g key={ring.label}>
          <motion.circle
            cx="200"
            cy={ring.cy}
            r={ring.r}
            className={index === 2 ? styles.accentSoft : styles.line}
            variants={draw}
            custom={index * 2}
          />
          <motion.text x="200" y={ring.cy - ring.r + 22} textAnchor="middle" className={styles.caption} variants={fade} custom={4 + index}>
            {ring.label}
          </motion.text>
        </g>
      ))}
    </Frame>
  );
}

/* Align — branches from one trunk. */
function Branches({ active }: { active: boolean }) {
  const commits = [
    [160, 80], [160, 150], [160, 220], [160, 300], [240, 190], [240, 238], [300, 262]
  ] as const;

  return (
    <Frame active={active}>
      <motion.line x1="160" x2="160" y1="56" y2="344" className={styles.line} variants={draw} custom={0} />
      <motion.path d="M 160 118 C 160 160, 240 150, 240 190 V 238 C 240 270, 160 260, 160 300" className={styles.thin} variants={draw} custom={3} />
      <motion.path d="M 160 200 C 160 236, 300 222, 300 262 V 320" className={styles.accentLine} variants={draw} custom={5} />
      {commits.map(([x, y], index) => (
        <motion.circle key={`${x}-${y}`} cx={x} cy={y} r="7" className={index === 6 ? styles.accentFill : styles.node} variants={pop} custom={6 + index * 0.6} />
      ))}
    </Frame>
  );
}

const motifs: Record<string, (props: { active: boolean }) => ReactNode> = {
  "icore-enterprise-mdm-entity-resolution": GoldenRecord,
  "telecom-fabric-migration-poc": Medallion,
  "bi-migration-validation-analytics": Reconcile,
  "ieee-semiconductor-chip-analysis-medallion": Chip,
  "fabcon25-talk-to-your-data-demo": Conversation,
  "insurance-analytics-copilot-data-agent-poc": StarSchema,
  "vitac-skincare-market-analysis": MarketSizing,
  align: Branches
};

export function ProjectMotif({ slug, active }: { slug: string; active: boolean }) {
  const Motif = motifs[slug] ?? StarSchema;
  return <Motif active={active} />;
}
