"use client";

import { motion } from "framer-motion";
import { kindMeta, type SkillItem, type RoleFilter, priorityForRole, type ExpertiseLevel } from "./proof-data";

// Luxurious, easily distinguishable styles for each level without relying on icons
const levelStyles: Record<ExpertiseLevel, string> = {
  mastered: "bg-[var(--color-antique-gold)] text-white border-transparent shadow-sm",
  advanced: "bg-white/40 text-[var(--color-obsidian)] border border-black/5 backdrop-blur-md",
  proficient: "bg-white/20 text-[var(--color-obsidian)] border border-white/40 backdrop-blur-sm",
  learning: "bg-transparent text-[var(--color-obsidian)]/60 border border-dashed border-[var(--color-obsidian)]/20",
};

export function BentoCard({
  skill,
  activeRole,
  className = "",
}: {
  skill: SkillItem;
  activeRole: RoleFilter;
  className?: string;
}) {
  const priority = priorityForRole(skill.viewerPriority, activeRole);
  const meta = kindMeta[skill.kind];

  const opacityClass = priority === "low" ? "opacity-40 grayscale-[50%]" : "opacity-100";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ WebkitFontSmoothing: "antialiased", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      className={`group relative flex flex-col justify-start overflow-hidden rounded-[2rem] 
        bg-white/50 backdrop-blur-3xl
        border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]
        transition-all duration-500 ease-out 
        hover:shadow-[0_20px_40px_rgb(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] 
        hover:border-white/80
        hover:bg-white/70
        p-8 sm:p-10 ${opacityClass} ${className}`}
    >
      {/* Ultra-Luxury Frosted Noise Texture Layer */}

      {/* Subtle Glow on Hover */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--color-antique-gold)]/0 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      {/* Top Section: Kind Label & Level Badge */}
      <div className="relative z-10 flex items-start justify-between mb-8">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-obsidian)]/50 font-medium">
          {meta.label}
        </span>
        
        {skill.level && (
          <span className={`px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest rounded-full ${levelStyles[skill.level]}`}>
            {skill.level}
          </span>
        )}
      </div>

      {/* Main Content Section (Flawless Flow, No Auto Margins) */}
      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-obsidian)] leading-[1.2]">
          {skill.label}
        </h3>
        
        {skill.summary && (
          <p className="text-[0.95rem] font-light text-[var(--color-obsidian)]/80 leading-relaxed max-w-[95%]">
            {skill.summary}
          </p>
        )}

        {skill.detail && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[var(--color-obsidian)]/[0.03] border border-[var(--color-obsidian)]/5 text-[0.7rem] sm:text-xs font-mono text-[var(--color-obsidian)]/60 uppercase tracking-wider backdrop-blur-md">
              {skill.detail}
            </span>
          </div>
        )}
      </div>
      
      {/* Subtle Link Indicator */}
      {skill.href && (
        <a 
          href={skill.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-20 outline-none"
          aria-label={`View details for ${skill.label}`}
        >
          <div className="absolute bottom-8 right-8 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 bg-white/80 p-2 rounded-full shadow-sm backdrop-blur-md border border-white/50">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-antique-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <line x1="5" y1="12" x2="19" y2="12"></line>
               <polyline points="12 5 19 12 12 19"></polyline>
             </svg>
          </div>
        </a>
      )}
    </motion.div>
  );
}
