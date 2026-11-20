"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode
} from "react";

/** Set once the visitor has stepped past the home gate in this tab. */
export const PORTFOLIO_ENTERED_KEY = "nk-portfolio-entered";

/*
 * Runs in <head> before first paint: marks <html> for a returning visit so
 * the gate is never painted, even for the frames before hydration.
 */
export const portfolioEnteredScript = `try{if(sessionStorage.getItem("${PORTFOLIO_ENTERED_KEY}")==="1")document.documentElement.dataset.entered="1"}catch(e){}`;

type HeroRevealContextType = {
  isRevealed: boolean;
  /** True when the visitor already entered earlier in this tab's session. */
  isReturnVisit: boolean;
  setRevealed: (revealed: boolean) => void;
};

const HeroRevealContext = createContext<HeroRevealContextType | undefined>(undefined);

export function HeroRevealProvider({ children }: { children: ReactNode }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isReturnVisit, setIsReturnVisit] = useState(false);

  // Before paint on the client: a reload mid-visit opens straight onto the
  // revealed home instead of asking the visitor to enter again.
  useLayoutEffect(() => {
    try {
      if (window.sessionStorage.getItem(PORTFOLIO_ENTERED_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsReturnVisit(true);
        setIsRevealed(true);
      }
    } catch {
      // Storage can be unavailable (private mode); the gate simply shows.
    }
  }, []);

  const setRevealed = useCallback((revealed: boolean) => {
    setIsRevealed(revealed);

    if (revealed) {
      try {
        // Only storage here: the <html> flag is for the next load. Setting
        // it now would hide the gate mid-exit instead of letting it fade.
        window.sessionStorage.setItem(PORTFOLIO_ENTERED_KEY, "1");
      } catch {
        // Remembering the entry is a convenience only.
      }
    }
  }, []);

  return (
    <HeroRevealContext.Provider value={{ isRevealed, isReturnVisit, setRevealed }}>
      {children}
    </HeroRevealContext.Provider>
  );
}

export function useHeroReveal() {
  const context = useContext(HeroRevealContext);
  if (context === undefined) {
    throw new Error("useHeroReveal must be used within a HeroRevealProvider");
  }
  return context;
}
