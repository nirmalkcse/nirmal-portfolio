"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { projects, featuredProjectSlugs } from "@/data/projects";
import styles from "./sticky-scroll-projects.module.css";
import Link from "next/link";
import { DatabricksMark } from "@/components/brand/brand-logos";

const ArchitectureBackground = () => {
  const connections = [
    // Sources to Ingest
    [150, 90, 200, 150], [150, 150, 200, 150], [150, 210, 200, 210], [150, 270, 200, 270], [150, 330, 200, 270],
    // Ingest to Bronze
    [310, 150, 375, 140], [310, 210, 375, 140], [310, 270, 375, 140],
    // Gold to Serving
    [485, 280, 550, 120], [485, 280, 550, 180], [485, 280, 550, 240], [485, 280, 550, 300],
    // Serving to Consumption
    [660, 120, 710, 90], [660, 120, 710, 150], [660, 180, 710, 150], [660, 180, 710, 210], 
    [660, 240, 710, 210], [660, 240, 710, 270], [660, 300, 710, 330], [660, 300, 710, 270]
  ];

  const nodes = [
    { x: 40, y: 72, label: "REST APIs" }, { x: 40, y: 132, label: "RDBMS / ERP" }, { x: 40, y: 192, label: "CDC Streams" }, { x: 40, y: 252, label: "SaaS / CRMs" }, { x: 40, y: 312, label: "IoT / Logs" },
    { x: 200, y: 132, label: "Batch Ingest" }, { x: 200, y: 192, label: "Event Hub" }, { x: 200, y: 252, label: "Stream Pipes" },
    { x: 375, y: 122, label: "Bronze (Raw)", stroke: "rgba(140,91,54,0.6)", fill: "rgba(140,91,54,0.15)", text: "rgba(140,91,54,0.9)" },
    { x: 375, y: 192, label: "Silver (Curated)", stroke: "rgba(168,148,120,0.6)", fill: "rgba(168,148,120,0.15)", text: "rgba(168,148,120,0.9)" },
    { x: 375, y: 262, label: "Gold (Business)", stroke: "rgba(203,168,113,0.8)", fill: "rgba(203,168,113,0.2)", text: "rgba(203,168,113,1)" },
    { x: 550, y: 102, label: "Data Warehouse" }, { x: 550, y: 162, label: "Semantic Layer" }, { x: 550, y: 222, label: "Feature Store" }, { x: 550, y: 282, label: "Vector DB" },
    { x: 710, y: 72, label: "BI Dashboards" }, { x: 710, y: 132, label: "Web Apps" }, { x: 710, y: 192, label: "ML Ops" }, { x: 710, y: 252, label: "Data APIs" }, { x: 710, y: 312, label: "LLM Agents" },
  ];

  return (
    <div className={styles.liveBg} style={{ background: 'linear-gradient(145deg, #0a0e1a 0%, #0d1117 30%, #111827 60%, #0a0e1a 100%)' }}>
      {/* Warm golden accent glow */}
      <div style={{ position: 'absolute', top: '30%', left: '40%', width: '60%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(203, 168, 113, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: '50%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.06) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div className={styles.meshGradientBg} style={{ 
        '--aurora-1': 'rgba(203, 168, 113, 0.12)', 
        '--aurora-2': 'rgba(185, 138, 80, 0.08)', 
        '--aurora-3': 'rgba(14, 165, 233, 0.06)',
        animationDuration: '25s'
      } as React.CSSProperties} />
      
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem' }}
        >
          <svg viewBox="0 -40 860 520" style={{ width: '100%', maxWidth: '860px', height: '100%', maxHeight: '80%', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(203,168,113,0.15)" />
                <stop offset="100%" stopColor="rgba(203,168,113,0.02)" />
              </linearGradient>
              <linearGradient id="medallionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(203,168,113,0.05)" />
                <stop offset="100%" stopColor="rgba(203,168,113,0.01)" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Bezier Connections */}
            {connections.map((c, i) => (
              <path 
                key={`conn-${i}`} 
                d={`M ${c[0]} ${c[1]} C ${c[0] + 45} ${c[1]}, ${c[2] - 45} ${c[3]}, ${c[2]} ${c[3]}`} 
                stroke="rgba(203,168,113,0.25)" 
                strokeWidth="1.5" 
                fill="none" 
              />
            ))}

            {/* Medallion Lakehouse Background Box */}
            <rect x="350" y="90" width="160" height="240" rx="12" fill="url(#medallionGrad)" stroke="rgba(203,168,113,0.2)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Medallion Internal Connections */}
            <path d="M 430 158 L 430 192" stroke="rgba(203,168,113,0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="430,192 426,186 434,186" fill="rgba(203,168,113,0.6)" />
            <path d="M 430 228 L 430 262" stroke="rgba(203,168,113,0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="430,262 426,256 434,256" fill="rgba(203,168,113,0.6)" />

            {/* Top Bar - Governance */}
            <rect x="40" y="15" width="780" height="36" rx="8" fill="url(#boxGrad)" stroke="rgba(203,168,113,0.3)" strokeWidth="1" filter="url(#glow)" />
            <text x="430" y="38" textAnchor="middle" fill="rgba(203,168,113,0.8)" fontSize="12" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="3">ENTERPRISE GOVERNANCE & CATALOG</text>

            {/* Bottom Bar - Orchestration */}
            <rect x="40" y="380" width="780" height="36" rx="8" fill="url(#boxGrad)" stroke="rgba(203,168,113,0.3)" strokeWidth="1" filter="url(#glow)" />
            <text x="430" y="403" textAnchor="middle" fill="rgba(203,168,113,0.8)" fontSize="12" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="3">ORCHESTRATION & OBSERVABILITY</text>

            {/* Column Headers */}
            <text x="95" y="62" textAnchor="middle" fill="rgba(203,168,113,0.5)" fontSize="10" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="1">SOURCES</text>
            <text x="255" y="122" textAnchor="middle" fill="rgba(203,168,113,0.5)" fontSize="10" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="1">INGESTION</text>
            <text x="430" y="112" textAnchor="middle" fill="rgba(203,168,113,0.5)" fontSize="10" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="1">LAKEHOUSE</text>
            <text x="605" y="92" textAnchor="middle" fill="rgba(203,168,113,0.5)" fontSize="10" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="1">SERVING</text>
            <text x="765" y="62" textAnchor="middle" fill="rgba(203,168,113,0.5)" fontSize="10" fontFamily="-apple-system, sans-serif" fontWeight="600" letterSpacing="1">CONSUMERS</text>

            {/* Render Nodes */}
            {nodes.map((n, i) => (
              <g key={`node-${i}`}>
                <rect 
                  x={n.x} y={n.y} width="110" height="36" rx="8" 
                  fill={n.fill || "url(#boxGrad)"} 
                  stroke={n.stroke || "rgba(203,168,113,0.4)"} 
                  strokeWidth="1.5" 
                  filter="url(#glow)" 
                />
                <text 
                  x={n.x + 55} y={n.y + 22} 
                  textAnchor="middle" 
                  fill={n.text || "rgba(230,213,184,0.9)"} 
                  fontSize="11" 
                  fontFamily="-apple-system, sans-serif" 
                  fontWeight="500"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
      
      {/* Subtle vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none', zIndex: 5 }} />
    </div>
  );
};

const MDMBackground = () => (
  <div className={styles.liveBg} style={{ background: 'linear-gradient(145deg, #1a0a0a 0%, #1c0f0f 30%, #22111a 60%, #140a0a 100%)' }}>
    {/* Deep crimson ambient glow */}
    <div style={{ position: 'absolute', top: '25%', left: '35%', width: '60%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.1) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '30%', left: '20%', width: '40%', height: '40%', background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
    <div className={styles.meshGradientBg} style={{ 
      '--aurora-1': 'rgba(185, 28, 28, 0.1)', 
      '--aurora-2': 'rgba(239, 68, 68, 0.06)', 
      '--aurora-3': 'rgba(203, 168, 113, 0.04)',
      animationDuration: '28s'
    } as React.CSSProperties} />
    
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <img src="/icore-logo.png" alt="iCORE Logo" style={{ width: '140px', height: 'auto', objectFit: 'contain', opacity: 0.92, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
      >
        <span style={{ display: 'block', filter: 'drop-shadow(0 4px 20px rgba(255,54,33,0.4))' }}>
          <DatabricksMark size={96} />
        </span>
      </motion.div>
    </div>
    
    {/* Vignette */}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none', zIndex: 5 }} />
  </div>
);

const FabricBackground = () => (
  <div className={styles.liveBg} style={{ background: 'linear-gradient(145deg, #080d1a 0%, #0c1225 30%, #111a33 60%, #080d1a 100%)' }}>
    {/* Sapphire ambient glow */}
    <div style={{ position: 'absolute', top: '30%', left: '40%', width: '50%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '25%', right: '35%', width: '45%', height: '45%', background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
    <div className={styles.meshGradientBg} style={{ 
      '--aurora-1': 'rgba(59, 130, 246, 0.1)', 
      '--aurora-2': 'rgba(14, 165, 233, 0.06)', 
      '--aurora-3': 'rgba(203, 168, 113, 0.04)',
      animationDuration: '26s'
    } as React.CSSProperties} />
    
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <svg viewBox="0 0 48 48" width="90" height="90" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))', opacity: 0.92 }}>
          <rect x="4" y="4" width="18" height="18" fill="#F25022" />
          <rect x="26" y="4" width="18" height="18" fill="#7FBA00" />
          <rect x="4" y="26" width="18" height="18" fill="#00A4EF" />
          <rect x="26" y="26" width="18" height="18" fill="#FFB900" />
        </svg>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
      >
        <img src="/fabric-logo.png" alt="Microsoft Fabric Logo" style={{ width: '130px', height: 'auto', objectFit: 'contain', opacity: 0.92, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }} />
      </motion.div>
    </div>
    
    {/* Vignette */}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none', zIndex: 5 }} />
  </div>
);

const BIBackground = () => (
  <div className={styles.liveBg} style={{ background: 'linear-gradient(145deg, #12100a 0%, #181208 30%, #1a1510 60%, #0f0d08 100%)' }}>
    {/* Amber / bronze ambient glow */}
    <div style={{ position: 'absolute', top: '30%', left: '35%', width: '55%', height: '55%', background: 'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '25%', right: '40%', width: '40%', height: '40%', background: 'radial-gradient(ellipse at center, rgba(202, 138, 4, 0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
    <div className={styles.meshGradientBg} style={{ 
      '--aurora-1': 'rgba(234, 179, 8, 0.1)', 
      '--aurora-2': 'rgba(185, 138, 80, 0.06)', 
      '--aurora-3': 'rgba(203, 168, 113, 0.08)',
      animationDuration: '27s'
    } as React.CSSProperties} />
    
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <svg viewBox="0 0 48 48" width="140" height="140" style={{ filter: 'drop-shadow(0 4px 30px rgba(234, 179, 8, 0.15))', opacity: 0.95 }}>
          <rect x="26" y="10" width="12" height="34" rx="2" fill="#E6AD10" />
          <rect x="14" y="20" width="12" height="24" rx="2" fill="#F2C811" />
          <rect x="2" y="30" width="12" height="14" rx="2" fill="#C88300" />
        </svg>
      </motion.div>
    </div>
    
    {/* Vignette */}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none', zIndex: 5 }} />
  </div>
);

export function StickyScrollProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track entry progress to animate the curtain reveal (if kept)
  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // Track exit progress to animate the bottom curtain
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"]
  });

  // -- Asymmetric curtain clip-path (Top) --
  const p0 = useTransform(entryProgress, [0, 1], [32, 0]);
  const p1 = useTransform(entryProgress, [0, 1], [18, 0]);
  const p2 = useTransform(entryProgress, [0, 1], [9, 0]);
  const p3 = useTransform(entryProgress, [0, 1], [3, 0]);
  const p4 = useTransform(entryProgress, [0, 1], [0, 0]);

  // -- Asymmetric curtain clip-path (Bottom) --
  // 0 -> 0.40: Right side goes up, left side lags (mirroring the top slant)
  // 0.40 -> 0.80: Left side catches up (flattens out at 32vh)
  const e0 = useTransform(exitProgress, [0, 0.4, 0.8], [0, 0, 32]);  // left (lags)
  const e1 = useTransform(exitProgress, [0, 0.4, 0.8], [0, 3, 32]);
  const e2 = useTransform(exitProgress, [0, 0.4, 0.8], [0, 9, 32]);
  const e3 = useTransform(exitProgress, [0, 0.4, 0.8], [0, 18, 32]);
  const e4 = useTransform(exitProgress, [0, 0.4, 0.8], [0, 32, 32]); // right (goes up first)

  const clipPath = useMotionTemplate`polygon(
    0% ${p0}vh, 25% ${p1}vh, 50% ${p2}vh, 75% ${p3}vh, 100% ${p4}vh, 
    100% calc(100% - ${e4}vh), 75% calc(100% - ${e3}vh), 50% calc(100% - ${e2}vh), 25% calc(100% - ${e1}vh), 0% calc(100% - ${e0}vh)
  )`;

  // Grab only the featured projects for the home page showcase
  const showcaseProjects = featuredProjectSlugs.map(
    slug => projects.find(p => p.slug === slug)!
  ).filter(Boolean);

  // -- Swipe Up Animation --
  // The container is 460vh. We wait for 20vh of scrolling (header hides) before moving.
  // We want the TV track to finish moving exactly at the 3rd project (which is centered at 320vh of scrolling).
  // Total scrollable distance = 460vh - 100vh = 360vh.
  // 20 / 360 = ~0.0555
  // 320 / 360 = ~0.8888
  const tvTrackY = useTransform(
    scrollYProgress, 
    [0, 20/360, 320/360, 1], 
    ["0vh", "0vh", "-300vh", "-300vh"]
  );

  return (
    <motion.section 
      id="projects"
      ref={containerRef}
      className={styles.track}
      style={{ 
        clipPath 
      }}
    >
      <div className={styles.backgroundPanels}>
        <div className={styles.bgPanel} style={{ backgroundColor: "#0f0c0a" }} />
        <div className={styles.bgPanel} style={{ backgroundColor: "#110a0a" }} />
        <div className={styles.bgPanel} style={{ backgroundColor: "#0a0d14" }} />
        <div className={styles.bgPanel} style={{ backgroundColor: "#100e08" }} />
      </div>
      
      <div className={styles.contentWrapper}>
        
        {/* LEFT COLUMN: Scrolling Context */}
        <div className={styles.leftColumn}>
          
          {/* Section 0: Intro */}
          <div className={styles.textSection}>
            <p className={styles.sectionEyebrow}>Selected Work</p>
            <h2 className={styles.sectionTitle}>
              Engineering<br />
              data products<br />
              that scale.
            </h2>
            <p className={styles.sectionSummary}>
              A showcase of enterprise data engineering, modern BI, and master data management architectures.
            </p>
          </div>

          {/* Sections 1-3: Projects */}
          {showcaseProjects.map((project, index) => (
            <div key={project.slug} className={styles.textSection}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={styles.projectEyebrow}>{project.type}</p>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectSummary}>{project.summary}</p>
                
                {project.stack && (
                  <div className={styles.projectStack}>
                    {project.stack.slice(0, 5).map(tech => (
                      <span key={tech} className={styles.stackBadge}>
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 5 && (
                      <span className={styles.stackBadge}>+{project.stack.length - 5} more</span>
                    )}
                  </div>
                )}

                <Link
                  className={styles.caseLink}
                  href={`/projects/${project.slug}`}
                >
                  <span className={styles.caseLinkIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.caseLinkLabel}>Read the case study</span>
                  <span aria-hidden="true" className={styles.caseLinkArrow}>›</span>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Sticky Monitor */}
        <div className={styles.rightColumn}>
          <div className={styles.tvBezel}>
            <div className={styles.tvGlass} />
            <div className={styles.tvScreen}>
              <motion.div 
                className={styles.tvContentTrack}
                style={{ y: tvTrackY }}
              >
                {/* Intro Image (Matches the 100vh top padding block on the left) */}
                <div className={styles.sceneImage} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <ArchitectureBackground />
                  <div style={{ position: 'absolute', top: '0', left: '0', right: '0', padding: '4rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500 }}>
                        Enterprise Architecture
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project 1 */}
                <div className={styles.sceneImage} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <MDMBackground />
                  <div style={{ position: 'absolute', top: '0', left: '0', right: '0', padding: '4rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500 }}>
                        MDM Platform
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Project 2 */}
                <div className={styles.sceneImage} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <FabricBackground />
                  <div style={{ position: 'absolute', top: '0', left: '0', right: '0', padding: '4rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500 }}>
                        Fabric Migration
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project 3 */}
                <div className={styles.sceneImage} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <BIBackground />
                  <div style={{ position: 'absolute', top: '0', left: '0', right: '0', padding: '4rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500 }}>
                        BI Modernization
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
