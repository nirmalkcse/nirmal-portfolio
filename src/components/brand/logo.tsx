import type { ReactElement } from "react";

export function Logo({ className = "", isMonogram = true }: { className?: string, isMonogram?: boolean }): ReactElement {
  return (
    <div className={`font-[var(--font-display)] font-bold text-[var(--color-ivory)] ${className}`}>
      {isMonogram ? (
        <span className="text-2xl tracking-[0.08em]">NK<span className="text-[var(--color-antique-gold)]">.</span></span>
      ) : (
        <span className="text-4xl sm:text-6xl">Nirmal Kumar<span className="text-[var(--color-antique-gold)]">.</span></span>
      )}
    </div>
  );
}
