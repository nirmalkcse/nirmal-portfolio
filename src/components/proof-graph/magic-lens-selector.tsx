"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type ExpertiseDomain } from "./proof-data";

export function MagicLensSelector({
  domains,
  activeIndex,
  onChange,
}: {
  domains: readonly ExpertiseDomain[];
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const activeDomain = domains[activeIndex];

  const handleOpen = () => {
    setIsOpen(true);
    setIsClickable(false);
    setTimeout(() => setIsClickable(true), 400); // Prevent instant accidental clicks
  };

  const handleSelect = (index: number) => {
    if (!isClickable) return;
    onChange(index);
    setIsOpen(false);
  };

  return (
    <>
      {/* The Minimalist Active Title (Acts as the trigger) */}
      <div className="flex flex-col items-center justify-center text-center pb-8 mt-12 sm:mt-16 w-full">
        <button
          onClick={handleOpen}
          className="group relative flex flex-col items-center outline-none"
        >
          <span className="mb-6 flex items-center justify-center gap-2 font-mono text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] text-[var(--color-obsidian)]/40 transition-colors duration-300 group-hover:text-[var(--color-antique-gold)]">
            <span className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-[var(--color-obsidian)]/40 group-hover:to-[var(--color-antique-gold)] transition-colors duration-300" />
            Select Domain
            <span className="h-px w-6 sm:w-8 bg-gradient-to-l from-transparent to-[var(--color-obsidian)]/40 group-hover:to-[var(--color-antique-gold)] transition-colors duration-300" />
          </span>

          <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-[var(--color-obsidian)] leading-[1.05] transition-transform duration-500 ease-out group-hover:scale-[1.02]">
            {activeDomain.title}
          </h2>

          <div className="mt-8 flex items-center gap-2 text-[var(--color-obsidian)]/30 group-hover:text-[var(--color-antique-gold)] transition-colors duration-300">
            <span className="text-xs uppercase tracking-widest font-medium">Explore</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
      </div>

      {/* The Magic Glass Lens (Full Screen Expansion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-porcelain)]/80 p-6 sm:p-12"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 sm:top-12 sm:right-12 p-4 text-[var(--color-obsidian)]/50 hover:text-[var(--color-obsidian)] transition-colors outline-none"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* The Immersive Domain List */}
            <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 w-full max-w-5xl">
              {domains.map((domain, index) => {
                const isActive = index === activeIndex;
                
                return (
                  <motion.button
                    key={domain.id}
                    onClick={() => handleSelect(index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex flex-col items-center text-center outline-none"
                  >
                    <span className={`font-mono text-xs uppercase tracking-[0.2em] mb-3 transition-colors duration-300 ${isActive ? 'text-[var(--color-antique-gold)]' : 'text-[var(--color-obsidian)]/30 group-hover:text-[var(--color-antique-gold)]'}`}>
                      {domain.shortTitle}
                    </span>
                    <h3 className={`text-4xl sm:text-6xl font-medium tracking-tight transition-all duration-500 ease-out ${isActive ? 'text-[var(--color-obsidian)] scale-105' : 'text-[var(--color-obsidian)]/40 group-hover:text-[var(--color-obsidian)] group-hover:scale-105'}`}>
                      {domain.title}
                    </h3>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
