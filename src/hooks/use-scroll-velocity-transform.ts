"use client";

import { useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function useScrollVelocityTransform(
  maxSkew: number = 2,
  maxScale: number = 0.98
) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const [windowHeight, setWindowHeight] = useState(1000);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dead zone: scrolling below ~2 viewport-heights per second produces no tilt
  // at all, so reading-pace scrolling stays perfectly level. The skew only
  // engages on rapid flicks and reaches full tilt around 4.5 viewports/second.
  const threshold = windowHeight * 2;
  const fullTilt = windowHeight * 4.5;

  const skewY = useTransform(
    smoothVelocity,
    [-fullTilt, -threshold, threshold, fullTilt],
    [-maxSkew, 0, 0, maxSkew]
  );
  const scale = useTransform(
    smoothVelocity,
    [-fullTilt, -threshold, threshold, fullTilt],
    [maxScale, 1, 1, maxScale]
  );

  return { skewY, scale };
}
