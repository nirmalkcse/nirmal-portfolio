"use client";

import { useHeroReveal } from "@/context/hero-reveal-context";
import { StickyScrollProjects } from "@/components/cinematic/sticky-scroll-projects";
import { CreativeShowcase } from "@/components/cinematic/creative-showcase";
import { CertificationsShowcase } from "@/components/cinematic/certifications-showcase";
import { TimelineShowcase } from "@/components/cinematic/timeline-showcase";
import { TechStackScroll } from "@/components/cinematic/tech-stack-scroll";
import { ClosingBridge } from "@/components/cinematic/closing-bridge";
import { DisciplineMarquee } from "@/components/signature/discipline-marquee";
import { HighlightsRail } from "@/components/signature/highlights-rail";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollVelocityTransform } from "@/hooks/use-scroll-velocity-transform";
import { useScrollSFX } from "@/hooks/use-scroll-sfx";

export function ClientScrollContent() {
  const { isRevealed, isReturnVisit } = useHeroReveal();
  const { skewY } = useScrollVelocityTransform(1.5, 0.99);
  useScrollSFX();
  
  return (
    <AnimatePresence>
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: isReturnVisit ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ skewY }}
        >
          <StickyScrollProjects />
          <CreativeShowcase />
          <DisciplineMarquee />
          <HighlightsRail />
          <CertificationsShowcase />
          <TimelineShowcase />
          <TechStackScroll />
          <ClosingBridge />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
