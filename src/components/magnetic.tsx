"use client";

import { useRef, useState, type ReactElement } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import React from "react";

export function Magnetic({ children, strength = 0.5 }: { children: ReactElement, strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || prefersReducedMotion) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    x.set(middleX * strength);
    y.set(middleY * strength);
  };

  const reset = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  if (prefersReducedMotion) {
    return children;
  }

  return (
    <motion.div
      style={{ position: "relative", x, y, display: "inline-block" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
