"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagicLensSelector } from "./magic-lens-selector";
import { BentoGallery } from "./bento-gallery";
import { buildSkillCatalog, expertiseDomains } from "./proof-data";

export function ProofGraph() {
  const skillCatalog = useMemo(() => buildSkillCatalog(), []);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const activeDomain = expertiseDomains[activeIndex];

  return (
    <div className="relative min-h-screen bg-[var(--color-porcelain)] selection:bg-[var(--color-antique-gold)]/20 font-sans overflow-hidden">
      
      {/* Deep, immersive ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--color-porcelain)]">
        
        {/* Massive, soft luxury lighting orbs to bounce off the glassmorphism */}
        <div className="absolute left-[-20%] top-[-10%] h-[90vh] w-[90vw] rounded-full bg-white/80 blur-[140px] opacity-70" />
        <div className="absolute right-[-20%] bottom-[-10%] h-[80vh] w-[80vw] rounded-full bg-[var(--color-champagne)]/40 blur-[150px]" />
        <div className="absolute left-[30%] top-[30%] h-[60vh] w-[60vw] rounded-full bg-[var(--color-antique-gold)]/5 blur-[160px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen pt-12 sm:pt-24 pb-12 flex flex-col">
        
        {/* The Magic Lens OS-Level Selector */}
        <MagicLensSelector 
          domains={expertiseDomains}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />

        {/* The Clean, Frustration-Free Segue Container */}
        <div className="w-full flex-1 mt-4 sm:mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDomain.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              {/* Note: BentoGallery now has its own domain header removed previously, so we just render the grid */}
              <BentoGallery
                domain={activeDomain}
                skillCatalog={skillCatalog}
                activeRole="balanced" 
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
