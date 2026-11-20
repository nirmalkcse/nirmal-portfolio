"use client";

import { useHeroReveal } from "@/context/hero-reveal-context";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site";
import { AnimatePresence, motion } from "framer-motion";

export function ConditionalFooter() {
  const { isRevealed } = useHeroReveal();
  const pathname = usePathname();
  
  // The contact route closes with its own full-width invitation.
  const shouldShow = pathname !== "/profile" && (pathname !== "/" || isRevealed);
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={pathname === "/" ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SiteFooter
            key={pathname}
            seamless={pathname === "/"}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
