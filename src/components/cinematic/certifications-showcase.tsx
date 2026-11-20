"use client";

import { useRef } from "react";
import { IssuerMark } from "@/components/brand/brand-logos";
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from "framer-motion";
import { certifications } from "@/data/certifications";

const HolographicCard = ({ cert }: { cert: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  
  const rotateX = useTransform(springY, [-1, 1], [15, -15]);
  const rotateY = useTransform(springX, [-1, 1], [-15, 15]);
  
  const sheenX = useTransform(springX, [-1, 1], ["100%", "0%"]);
  const sheenY = useTransform(springY, [-1, 1], ["100%", "0%"]);
  const sheenBackground = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.8) 0%, transparent 60%)`;
  
  // Holographic color shift based on mouse position
  const hue = useTransform(springX, [-1, 1], [0, 60]);
  const colorBackground = useMotionTemplate`linear-gradient(135deg, hsla(${hue}, 80%, 90%, 0.4), hsla(${hue}, 40%, 80%, 0.1))`;


  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-sm aspect-[4/3] flex items-center justify-center cursor-crosshair group perspective-1500"
      style={{ perspective: 1500 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative w-full h-full rounded-2xl border border-white/60 shadow-[0_30px_60px_rgba(150,140,125,0.2)] overflow-hidden flex flex-col p-8 bg-white/40 backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_40px_80px_rgba(150,140,125,0.3)]"
      >
        <motion.div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay" style={{ background: sheenBackground }} />
        <motion.div className="absolute inset-0 z-0 pointer-events-none mix-blend-color-burn opacity-50" style={{ background: colorBackground }} />
        
        <div className="relative z-20 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <IssuerMark issuer={cert.issuer} size={26} />
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#8e7f70] bg-white/50 px-3 py-1 rounded-full">
              {cert.category}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.015em] text-[#1f1a17] leading-snug mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              {cert.title}
            </h3>
            <p className="text-sm text-[#655a50] opacity-80 font-light">
              Issued by {cert.issuer}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function CertificationsShowcase() {
  // Grab top tier certs
  const topCerts = certifications.filter(c => 
    c.slug.includes("fabric-data-engineer") || 
    c.slug.includes("fabric-analytics") || 
    c.slug.includes("databricks-data-engineer") ||
    c.slug.includes("databricks-uc")
  ).slice(0, 4);

  return (
    <section className="relative w-full py-32 bg-[#f4eee5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <div className="editorial-eyebrow mb-6 justify-center">
            <span className="editorial-eyebrow-rule" aria-hidden="true" />
            <span>Validated expertise</span>
            <span className="editorial-eyebrow-rule" aria-hidden="true" />
          </div>
          <h2 className="editorial-title editorial-title--section">
            Credentials<span className="editorial-accent">.</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 justify-items-center">
          {topCerts.map(cert => (
            <HolographicCard key={cert.slug} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}

