"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface VariableTextProps {
  text: string;
  className?: string;
}

export function VariableText({ text, className = "" }: VariableTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  // Track scroll position relative to this element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to font weight (e.g. 100 to 900)
  // And font stretch if the font supports it, otherwise just weight is fine.
  const fontWeight = useTransform(scrollYProgress, [0, 0.5, 1], [200, 800, 200]);

  return (
    <motion.h2
      ref={containerRef}
      className={className}
      style={{
        fontWeight,
        // If we have variable font axes defined in CSS like --font-weight, we could also use custom properties,
        // but Framer Motion supports animating standard CSS properties directly.
        fontVariationSettings: useTransform(fontWeight, (weight) => `"wght" ${weight}`),
      }}
    >
      {text}
    </motion.h2>
  );
}
