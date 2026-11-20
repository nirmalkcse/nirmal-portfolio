"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { timelineEvents } from "@/data/timeline";

export function TimelineShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20
  });

  // Height of the glowing line
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // We want to sort events roughly chronologically (using their importance/dates as a proxy here for display)
  // For the showcase, we'll manually pick the top 5 pivotal moments to display elegantly.
  const pivotalEvents = [
    timelineEvents.find(e => e.id === "education-cse-degree"),
    timelineEvents.find(e => e.id === "ieee-semiconductor-publication"),
    timelineEvents.find(e => e.id === "ilink-role-start"),
    timelineEvents.find(e => e.id === "telecom-fabric-migration-poc"),
    timelineEvents.find(e => e.id === "icore-mdm-entity-resolution")
  ].filter(Boolean);

  return (
    <section ref={containerRef} className="relative w-full py-40 bg-[#fbf8f2] overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 relative">
        <div className="text-center mb-32">
          <div className="editorial-eyebrow mb-6 justify-center">
            <span className="editorial-eyebrow-rule" aria-hidden="true" />
            <span>The journey so far</span>
            <span className="editorial-eyebrow-rule" aria-hidden="true" />
          </div>
          <h2 className="editorial-title editorial-title--section">
            Trajectory<span className="editorial-accent">.</span>
          </h2>
        </div>

        {/* The Timeline Track */}
        <div className="absolute left-12 md:left-1/2 top-[300px] bottom-0 w-px bg-black/5 -translate-x-1/2" />
        
        {/* The Glowing Line */}
        <motion.div 
          className="absolute left-12 md:left-1/2 top-[300px] w-px bg-gradient-to-b from-[#8e7f70] to-[#1f1a17] shadow-[0_0_15px_#8e7f70] -translate-x-1/2 origin-top"
          style={{ height: lineHeight }}
        />

        <div className="relative z-10 flex flex-col gap-24">
          {pivotalEvents.map((event, index) => {
            if (!event) return null;
            const isEven = index % 2 === 0;

            return (
              <TimelineItem 
                key={event.id} 
                event={event} 
                isEven={isEven} 
                index={index} 
                total={pivotalEvents.length} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

const TimelineItem = ({ event, isEven, index, total }: { event: any, isEven: boolean, index: number, total: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 80%", "center center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const y = useTransform(smoothProgress, [0, 1], [50, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.1, 1]);
  const glow = useTransform(smoothProgress, [0, 1], ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 30px rgba(150,140,125,0.4)"]);

  return (
    <div ref={itemRef} className={`relative flex items-center justify-between w-full md:w-auto ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}>
      
      {/* Node / Dot */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
        <motion.div 
          style={{ scale, boxShadow: glow, opacity }}
          className="w-4 h-4 rounded-full bg-[#1f1a17] border-[4px] border-[#fbf8f2] z-20"
        />
      </div>

      {/* Empty space for alternating layout on desktop */}
      <div className="hidden md:block w-[45%]" />

      {/* Content Card */}
      <motion.div 
        style={{ opacity, y }}
        className="w-[calc(100%-3rem)] ml-12 md:ml-0 md:w-[45%] bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_20px_40px_rgba(150,140,125,0.1)] hover:bg-white/60 transition-colors duration-500"
      >
        <div className="text-[10px] uppercase tracking-widest font-bold text-[#8e7f70] mb-3">
          {event.startDate ? `${event.startDate} - ${event.endDate}` : event.endDate}
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1f1a17] leading-snug mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          {event.title}
        </h3>
        <p className="text-sm text-[#655a50] leading-relaxed font-light">
          {event.description}
        </p>
      </motion.div>
    </div>
  );
};
