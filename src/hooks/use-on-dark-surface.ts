"use client";

import { useEffect, useState, type RefObject } from "react";

type Rgba = { r: number; g: number; b: number; a: number };

function parseColor(value: string): Rgba | null {
  const rgb = value.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/
  );
  if (rgb) {
    let a = 1;
    if (rgb[4] !== undefined) {
      a = rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
    }
    return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a };
  }
  const hex = value.match(/#([0-9a-f]{6})\b/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  return null;
}

function relativeLuminance({ r, g, b }: Rgba) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Watches the page surface behind a fixed element (e.g. the social dock) and
 * reports whether it is currently dark. Samples on scroll (rAF-throttled) and
 * on a slow interval, so route transitions and animated backgrounds are
 * picked up too. Works by walking the element stack under a probe point and
 * reading the first meaningfully opaque background color — including the
 * first color stop of a gradient background, which solid-color parsing would
 * miss.
 */
export function useOnDarkSurface(ref: RefObject<HTMLElement | null>) {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let raf = 0;

    const sample = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      // Probe just left of the dock so we read the page, not the dock itself.
      const x = Math.max(1, rect.left - 24);
      const y = Math.min(
        window.innerHeight - 1,
        Math.max(1, rect.top + rect.height / 2)
      );

      for (const node of document.elementsFromPoint(x, y)) {
        if (el.contains(node) || !(node instanceof HTMLElement)) continue;
        const style = getComputedStyle(node);
        let rgba = parseColor(style.backgroundColor);
        if ((!rgba || rgba.a < 0.5) && style.backgroundImage !== "none") {
          rgba = parseColor(style.backgroundImage);
          if (rgba) rgba.a = 1;
        }
        if (rgba && rgba.a >= 0.5) {
          setOnDark(relativeLuminance(rgba) < 0.45);
          return;
        }
      }
      setOnDark(false);
    };

    const requestSample = () => {
      if (!raf) raf = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", requestSample, { passive: true });
    window.addEventListener("resize", requestSample);
    const interval = window.setInterval(sample, 800);

    return () => {
      window.removeEventListener("scroll", requestSample);
      window.removeEventListener("resize", requestSample);
      window.clearInterval(interval);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return onDark;
}
