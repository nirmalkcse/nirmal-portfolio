"use client";

import styles from "./noise-overlay.module.css";

export function NoiseOverlay() {
  return (
    <div className={styles.noiseWrapper}>
      {/* No viewBox on purpose. A square viewBox on a full-viewport <svg> is fitted
          with the default "xMidYMid meet", so the grain only ever painted a
          centred square and its two vertical edges showed as a rectangle over
          the page. Without one, user units are CSS pixels and the rect fills the
          viewport exactly; baseFrequency is retuned to keep the same grain size,
          which is now constant instead of scaling with viewport height. */}
      <svg className={styles.noiseSvg} xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
