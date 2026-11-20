"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  SiApachespark, 
  SiDatabricks
} from "react-icons/si";
import { FaDatabase, FaServer } from "react-icons/fa";
import type { IconType } from "react-icons";

type TechStackItem =
  | {
      type: "icon";
      name: string;
      icon: IconType;
      tone: string;
      glow: string;
    }
  | {
      type: "image";
      name: string;
      image: string;
      tone: string;
      glow: string;
    }
  | {
      type: "custom";
      name: string;
      render: () => ReactNode;
      tone: string;
      glow: string;
    };

function MicrosoftLogo() {
  return (
    <span className="grid h-10 w-10 grid-cols-2 gap-1 md:h-12 md:w-12" aria-hidden="true">
      <span className="bg-[#f25022]" />
      <span className="bg-[#7fba00]" />
      <span className="bg-[#00a4ef]" />
      <span className="bg-[#ffb900]" />
    </span>
  );
}

function SqlServerLogo() {
  return (
    <Image
      src="/assets/tech-logos/sql-server-mark.png"
      alt=""
      width={88}
      height={88}
      className="h-[4.15rem] w-[4.15rem] object-contain md:h-[5.3rem] md:w-[5.3rem]"
      style={{ filter: "drop-shadow(0 4px 14px rgba(190, 35, 38, 0.36))" }}
    />
  );
}

function PythonLogo() {
  return (
    <Image
      src="/assets/tech-logos/python-logo.png"
      alt=""
      width={88}
      height={88}
      className="h-[4.05rem] w-[4.05rem] object-contain md:h-[5.15rem] md:w-[5.15rem]"
      style={{ filter: "drop-shadow(0 4px 14px rgba(55, 118, 171, 0.28))" }}
    />
  );
}

function EtlPipelineSvg() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="h-10 w-10 transition-transform duration-500 group-hover:scale-110 md:h-14 md:w-14"
      style={{
        color: "var(--tech-tone)",
        filter: "drop-shadow(0 4px 12px var(--tech-glow))"
      }}
      aria-hidden="true"
    >
      {/* Source Data Node */}
      <rect x="2" y="9" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.2" />
      {/* Target Data Nodes */}
      <rect x="16" y="3" width="6" height="6" rx="1.5" />
      <rect x="16" y="15" width="6" height="6" rx="1.5" />
      {/* Pipeline routing paths with smooth curves */}
      <path d="M8 12h3.5a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h.5" />
      <path d="M8 12h3.5a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h.5" />
      {/* Data packet indicators (moving along the pipe) */}
      <circle cx="11.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const TECH_STACK: TechStackItem[] = [
  { type: "custom", name: "MS SQL Server", tone: "#d62f35", glow: "rgba(214, 47, 53, 0.42)", render: SqlServerLogo },
  { type: "custom", name: "Python", tone: "#3776ab", glow: "rgba(55, 118, 171, 0.42)", render: PythonLogo },
  { type: "icon", name: "Apache Spark", icon: SiApachespark, tone: "#e25a1c", glow: "rgba(226, 90, 28, 0.48)" },
  { type: "icon", name: "Databricks", icon: SiDatabricks, tone: "#ff3621", glow: "rgba(255, 54, 33, 0.48)" },
  { type: "image", name: "Fabric", image: "/fabric-logo.png", tone: "#7ff2d2", glow: "rgba(127, 242, 210, 0.48)" },
  { type: "custom", name: "Microsoft", tone: "#00a4ef", glow: "rgba(0, 164, 239, 0.42)", render: MicrosoftLogo },
  { type: "icon", name: "Data Architecture", icon: FaServer, tone: "#d9b16f", glow: "rgba(217, 177, 111, 0.42)" },
  { type: "icon", name: "Lakehouse", icon: FaDatabase, tone: "#87bfff", glow: "rgba(135, 191, 255, 0.44)" },
  { type: "custom", name: "ETL Pipelines", tone: "#06b6d4", glow: "rgba(6, 182, 212, 0.45)", render: EtlPipelineSvg }
];

// We duplicate the array to ensure the infinite scroll loops seamlessly without a gap
const DUPLICATED_STACK = [...TECH_STACK, ...TECH_STACK];

export function TechStackScroll() {
  return (
    // The arsenal reads as a channel carved into the cream surface shared by the neighbouring sections
    <section className="relative w-full overflow-hidden bg-[#fbf8f2]">
      <div className="relative flex w-full flex-col justify-center overflow-hidden border-y border-[#b39a78]/50 bg-[linear-gradient(180deg,#d8c4a7_0%,#eee1cb_52%,#d8c4a7_100%)] py-24">

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 h-[24vh] w-[100vw] -translate-x-1/2 -translate-y-1/2 bg-[#b88a54] opacity-15 blur-[90px] pointer-events-none" />

      {/* Deep recess shading along the top and bottom lips */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-[linear-gradient(180deg,rgba(80,60,40,0.32),rgba(80,60,40,0.12)_45%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-[linear-gradient(0deg,rgba(80,60,40,0.3),rgba(80,60,40,0.11)_45%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[#7d6244]/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-[#7d6244]/40" />

      {/* Side fades mirror the channel gradient so tiles dissolve into the walls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-[linear-gradient(180deg,#d8c4a7_0%,#eee1cb_52%,#d8c4a7_100%)] [mask-image:linear-gradient(90deg,black_20%,transparent)] md:w-44" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-[linear-gradient(180deg,#d8c4a7_0%,#eee1cb_52%,#d8c4a7_100%)] [mask-image:linear-gradient(270deg,black_20%,transparent)] md:w-44" />

      <h3 className="text-center text-[#8b765d] uppercase tracking-[0.4em] text-xs md:text-sm font-semibold mb-12 relative z-20">
        The Arsenal
      </h3>

      <div className="flex w-fit">
        {/* The Carousel Track: Animates infinitely from 0% to -50% of its total width */}
        <motion.div 
          className="flex gap-8 px-6 md:gap-14 md:px-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 48 // Smooth, slow automatic play
          }}
        >
          {DUPLICATED_STACK.map((tech, index) => {
            const tileStyle = {
              "--tech-tone": tech.tone,
              "--tech-glow": tech.glow
            } as CSSProperties;

            return (
              <div 
                key={index}
                className="group relative flex h-32 w-24 shrink-0 items-start justify-center md:h-44 md:w-32"
                style={tileStyle}
                aria-label={tech.name}
                aria-hidden={index >= TECH_STACK.length}
                title={tech.name}
              >
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/60 bg-gradient-to-br from-white/80 to-white/20 shadow-[0_20px_40px_-20px_var(--tech-glow),0_10px_20px_-15px_rgba(67,45,24,0.3),inset_0_2px_10px_rgba(255,255,255,1),inset_0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.015] group-hover:border-white/80 group-hover:bg-gradient-to-br group-hover:from-white/95 group-hover:to-white/30 group-hover:shadow-[0_30px_60px_-20px_var(--tech-glow),0_20px_40px_-15px_rgba(67,45,24,0.25),inset_0_6px_20px_rgba(255,255,255,1)] md:h-32 md:w-32 md:rounded-[2.15rem]">
                  {/* Subsurface soft glow behind the icon that gently blooms on hover */}
                  <span
                    className="absolute -inset-8 opacity-40 blur-2xl transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80 group-hover:blur-3xl group-hover:scale-105"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, var(--tech-glow), transparent 60%)"
                    }}
                  />

                  {/* 3D Beveled edge highlight */}
                  <span className="absolute inset-[1px] rounded-[1.7rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(255,255,255,0.1)_50%,rgba(134,104,65,0.05))] md:rounded-[2.08rem]" />

                  {/* Crisp top light reflection */}
                  <span className="absolute left-3 right-3 top-2 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-100" />

                  {/* Bottom shading for physical volume */}
                  <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#9b7a52]/20 to-transparent mix-blend-multiply" />

                  {/* Inner Icon Container - Logos rendered directly on the main card */}
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
                    {tech.type === "icon" ? (
                      <tech.icon
                        className="h-12 w-12 transition-transform duration-500 group-hover:scale-110 md:h-16 md:w-16"
                        style={{
                          color: "var(--tech-tone)",
                          filter: "drop-shadow(0 4px 12px var(--tech-glow))"
                        }}
                      />
                    ) : tech.type === "custom" ? (
                      <span className="transition-transform duration-500 group-hover:scale-110">
                        <tech.render />
                      </span>
                    ) : (
                      <Image
                        src={tech.image}
                        alt=""
                        width={64}
                        height={64}
                        className="h-14 w-14 object-contain transition-transform duration-500 group-hover:scale-110 md:h-18 md:w-18"
                        style={{ filter: "drop-shadow(0 4px 12px var(--tech-glow))" }}
                      />
                    )}
                  </span>
                </div>

                {/* Gallery-style nameplate, kept outside the glass object. */}
                <span className="pointer-events-none absolute left-1/2 top-[6.75rem] z-30 -translate-x-1/2 translate-y-2 scale-95 whitespace-nowrap rounded-full border border-white/70 bg-[rgba(255,250,242,0.72)] px-3.5 py-1.5 text-[0.56rem] font-black uppercase tracking-[0.26em] text-[#5d4b34]/80 opacity-0 shadow-[0_18px_45px_-30px_rgba(67,45,24,0.95),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 md:top-[8.95rem] md:px-4 md:py-2 md:text-[0.6rem]">
                  <span className="relative">{tech.name}</span>
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
      </div>
    </section>
  );
}

