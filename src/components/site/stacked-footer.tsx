"use client";

import { Logo } from "@/components/brand/logo";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/links";
import { plannedRoutes } from "@/lib/constants/routes";
import clsx from "clsx";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent
} from "react";
import { createPortal } from "react-dom";
import styles from "./stacked-footer.module.css";

const footerRoutes = plannedRoutes.filter(
  (route) => route.showInPrimaryNav && route.href !== "/profile"
);

const elsewhereLinks = socialLinks.filter((link) =>
  ["LinkedIn", "GitHub"].includes(link.label)
);

const currentRole = profile.roles[0];

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

/**
 * The contact link. Plain text like every other link here; the only thing it
 * does differently is hold the page for a beat and bloom into /profile.
 */
function ContactLink({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const router = useRouter();
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState<{ x: number; y: number } | null>(null);
  const portalReady = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );

  useEffect(() => {
    router.prefetch("/profile");

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    };
  }, [router]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      prefersReducedMotion ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    if (isNavigating) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    setTransitionOrigin({
      x: event.clientX || bounds.left + bounds.width / 2,
      y: event.clientY || bounds.top + bounds.height / 2
    });
    setIsNavigating(true);

    navigationTimer.current = setTimeout(() => {
      router.push("/profile");
    }, 620);
  };

  return (
    <>
      <Link href="/profile" onClick={handleClick} prefetch={false}>
        Contact
      </Link>

      {portalReady &&
        createPortal(
          <AnimatePresence>
            {transitionOrigin && (
              <motion.span
                animate={{ opacity: 1, scale: 42 }}
                aria-hidden="true"
                className={styles.contactBloom}
                initial={{ opacity: 0.82, scale: 0.2 }}
                style={{ left: transitionOrigin.x, top: transitionOrigin.y }}
                transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export function SiteFooter({
  className,
  seamless = false
}: {
  className?: string;
  seamless?: boolean;
}) {
  const footerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isInView = useInView(footerRef, { amount: 0.18, once: true });
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const isRevealed = hasMounted && (prefersReducedMotion || isInView);

  return (
    <footer
      className={clsx(styles.stackedFooter, className)}
      data-revealed={isRevealed ? "true" : "false"}
      data-seamless={seamless ? "true" : "false"}
      id="site-footer"
      ref={footerRef}
    >
      <div className={styles.surface}>
        <div className={styles.top}>
          {/* The name is the only thing set large. It is the one piece of
              copy here that is unarguably true. */}
          <div className={styles.identity}>
            <h2>{profile.displayName}</h2>
            <p>
              {currentRole.title}, {currentRole.organization}
            </p>
          </div>

          <div className={styles.index}>
            <nav aria-label="Footer portfolio routes">
              {footerRoutes.map((route) => (
                <Link href={route.href} key={route.href} prefetch={false}>
                  {route.shortLabel}
                </Link>
              ))}
            </nav>

            <nav aria-label="Footer contact and profile links">
              <ContactLink prefersReducedMotion={prefersReducedMotion} />
              <Link href="/resume" prefetch={false}>
                Résumé
              </Link>
              {elsewhereLinks.map((link) => (
                <a href={link.url} key={link.url} rel="noreferrer noopener" target="_blank">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <span aria-hidden="true" className={styles.rule} />

        <div className={styles.baseline}>
          <Link
            aria-label="Nirmal Kumar home"
            className={clsx("hidden-delight-footer-mark", styles.footerBrand)}
            href="/"
            prefetch={false}
          >
            <Logo className={styles.footerMonogram} isMonogram={true} />
          </Link>

          <p>{profile.location}</p>
        </div>
      </div>

      <span aria-hidden="true" className={styles.completionSentinel} data-footer-complete />
    </footer>
  );
}
