"use client";

import "@/lib/motion/scroll-timeline-guard";
import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        wheelMultiplier: 1.1,
        smoothWheel: true,
        // In-page #links glide on the same curve as wheel scrolling instead
        // of jumping (or fighting Lenis with native smooth scroll).
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
