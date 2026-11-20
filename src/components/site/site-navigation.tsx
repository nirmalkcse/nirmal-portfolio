"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, FileDown, Menu, X } from "lucide-react";
import clsx from "clsx";
import { plannedRoutes } from "@/lib/constants/routes";
import { Logo } from "@/components/brand/logo";
import { useHeroReveal } from "@/context/hero-reveal-context";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  animate
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent
} from "react";
import styles from "./site-navigation.module.css";

const primaryRoutes = plannedRoutes.filter((route) => route.showInPrimaryNav);

const NAV_HIDE_AFTER_Y = 132;
const NAV_SCROLL_DELTA = 8;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavDropletTarget = {
  center: number;
  height: number;
  href: string;
  left: number;
  top: number;
  type: "home" | "nav";
  width: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getClosestDropletTarget(targets: NavDropletTarget[], center: number) {
  return targets.reduce((closest, target) => {
    const closestDistance = Math.abs(closest.center - center);
    const targetDistance = Math.abs(target.center - center);

    return targetDistance < closestDistance ? target : closest;
  });
}

export function SiteHeader() {
  const pathname = usePathname();
  const { isRevealed } = useHeroReveal();
  const router = useRouter();
  const { scrollY } = useScroll();
  const shellRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navLinkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const dropletDragStart = useRef<{
    activeTarget: NavDropletTarget;
    offset: number;
    x: number;
  } | null>(null);
  const dropletPointerId = useRef<number | null>(null);
  const dropletXAnimation = useRef<{ stop: () => void } | null>(null);
  const dropletX = useMotionValue(0);
  const dropletLeft = useMotionValue(0);
  const dropletTop = useMotionValue(0);
  const dropletWidth = useMotionValue(0);
  const dropletHeight = useMotionValue(0);
  const previewLeft = useMotionValue(0);
  const previewTop = useMotionValue(0);
  const previewWidth = useMotionValue(0);
  const previewHeight = useMotionValue(0);
  const dropletXVelocity = useVelocity(dropletX);
  const dropletTranslateX = useTransform(() => {
    return dropletLeft.get() + dropletX.get();
  });
  const flowVelocity = useTransform(() => {
    return dropletXVelocity.get();
  });
  const dropletScaleXRaw = useTransform(flowVelocity, [-1000, 0, 1000], [1.045, 1, 1.045]);
  const dropletScaleYRaw = useTransform(flowVelocity, [-1000, 0, 1000], [0.985, 1, 0.985]);
  const dropletSkewXRaw = useTransform(flowVelocity, [-1000, 0, 1000], [1.4, 0, -1.4]);
  const plushTransformSpring = { stiffness: 180, damping: 24, mass: 1.0 };
  const dropletScaleX = useSpring(dropletScaleXRaw, plushTransformSpring);
  const dropletScaleY = useSpring(dropletScaleYRaw, plushTransformSpring);
  const dropletSkewX = useSpring(dropletSkewXRaw, plushTransformSpring);
  const [hidden, setHidden] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isDraggingDroplet, setIsDraggingDroplet] = useState(false);
  const [dropletDragConstraints, setDropletDragConstraints] = useState({
    left: 0,
    right: 0
  });
  const [dropletTargets, setDropletTargets] = useState<NavDropletTarget[]>([]);
  const [activeDroplet, setActiveDroplet] = useState<NavDropletTarget | null>(null);
  const [previewDroplet, setPreviewDroplet] = useState<NavDropletTarget | null>(null);
  const [dragIntentHref, setDragIntentHref] = useState<string | null>(null);
  const [homeArrivalPulse, setHomeArrivalPulse] = useState(false);
  const dragIntentHrefRef = useRef<string | null>(null);
  const previewHrefRef = useRef<string | null>(null);
  const hiddenRef = useRef(false);
  const hasScrollSampleRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const routePushFrame = useRef<number | null>(null);
  const homeArrivalTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedDroplet = useRef(false);

  const shouldShowPreviewDroplet =
    !isDraggingDroplet &&
    previewDroplet !== null &&
    activeDroplet !== null &&
    previewDroplet.href !== activeDroplet.href;
  const isHomeMagnetActive =
    isDraggingDroplet && dragIntentHref === "/" && activeDroplet?.href !== "/";
  const isHomeArrivalActive = homeArrivalPulse && activeDroplet?.href === "/";

  const updateDragIntentHref = useCallback((nextHref: string | null) => {
    if (dragIntentHrefRef.current === nextHref) {
      return;
    }

    dragIntentHrefRef.current = nextHref;
    setDragIntentHref(nextHref);
  }, []);

  const setPreviewTarget = useCallback((nextTarget: NavDropletTarget | null) => {
    const nextHref = nextTarget?.href ?? null;

    if (previewHrefRef.current === nextHref) {
      return;
    }

    previewHrefRef.current = nextHref;
    setPreviewDroplet(nextTarget);
  }, []);

  const activateDropletTarget = useCallback(
    (href: string) => {
      const nextTarget = dropletTargets.find((target) => target.href === href);

      if (!nextTarget) {
        return;
      }

      setActiveDroplet(nextTarget);
      setPreviewTarget(null);
      dropletXAnimation.current?.stop();
      dropletXAnimation.current = animate(dropletX, 0, {
        type: "spring",
        stiffness: 220,
        damping: 26,
        mass: 1.0,
        restDelta: 0.001,
        restSpeed: 0.1
      });
    },
    [dropletTargets, dropletX, setPreviewTarget]
  );

  const handleRouteClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        isActiveRoute(pathname, href)
      ) {
        return;
      }

      event.preventDefault();
      activateDropletTarget(href);
      router.prefetch(href);

      if (routePushFrame.current !== null) {
        window.cancelAnimationFrame(routePushFrame.current);
      }

      routePushFrame.current = window.requestAnimationFrame(() => {
        routePushFrame.current = null;
        router.push(href);
      });
    },
    [activateDropletTarget, pathname, router]
  );

  const measureDropletTargets = useCallback(() => {
    const nextTargets: NavDropletTarget[] = [];
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const shellBounds = shell.getBoundingClientRect();
    const readTarget = (
      element: HTMLElement | null | undefined,
      href: string,
      type: NavDropletTarget["type"]
    ) => {
      // Remove offsetParent === null check. getBoundingClientRect() works correctly 
      // regardless, and Framer Motion's initial animation states often cause offsetParent 
      // to be null on the first render, which was making the droplet invisible at startup.
      if (!element || element.offsetWidth === 0) {
        return;
      }

      const bounds = element.getBoundingClientRect();
      // The droplet is absolutely positioned inside the shell's border, so
      // measure from the padding edge (clientLeft/Top = border width), not
      // the outer edge; otherwise it sits a border's width off centre.
      const originLeft = shellBounds.left + shell.clientLeft;
      const originTop = shellBounds.top + shell.clientTop;

      nextTargets.push({
        center: bounds.left - originLeft + bounds.width / 2,
        height: bounds.height,
        href,
        left: bounds.left - originLeft,
        top: bounds.top - originTop,
        type,
        width: bounds.width
      });
    };

    readTarget(brandRef.current, "/", "home");

    primaryRoutes.forEach((route) => {
      readTarget(navLinkRefs.current.get(route.href), route.href, "nav");
    });

    const activeTarget =
      nextTargets.find((target) => isActiveRoute(pathname, target.href)) ?? null;
    const minTargetLeft = nextTargets.length
      ? Math.min(...nextTargets.map((target) => target.left))
      : 0;
    const maxTargetRight = nextTargets.length
      ? Math.max(...nextTargets.map((target) => target.left + target.width))
      : 0;

    setDropletTargets(nextTargets);
    setActiveDroplet(activeTarget);
    
    if (activeTarget && !hasInitializedDroplet.current) {
      dropletLeft.set(activeTarget.left);
      dropletTop.set(activeTarget.top);
      dropletWidth.set(activeTarget.width);
      dropletHeight.set(activeTarget.height);
      hasInitializedDroplet.current = true;
    }
    
    setPreviewDroplet((currentPreview) => {
      if (!currentPreview) {
        previewHrefRef.current = null;
        return null;
      }

      const nextPreview =
        nextTargets.find((target) => target.href === currentPreview.href) ?? null;
      previewHrefRef.current = nextPreview?.href ?? null;

      return nextPreview;
    });
    setDropletDragConstraints(
      activeTarget
        ? {
            left: minTargetLeft - activeTarget.left,
            right: maxTargetRight - activeTarget.left - activeTarget.width
          }
        : { left: 0, right: 0 }
    );
    dropletX.set(0);
  }, [dropletX, pathname, dropletLeft, dropletTop, dropletWidth, dropletHeight]);

  useEffect(() => {
    if (!activeDroplet) {
      return;
    }

    const spring = {
      type: "spring" as const,
      stiffness: 220,
      damping: 26,
      mass: 1.0,
      restDelta: 0.001,
      restSpeed: 0.1
    };

    const leftControls = animate(dropletLeft, activeDroplet.left, spring);
    const topControls = animate(dropletTop, activeDroplet.top, {
      ...spring,
      damping: spring.damping + 5
    });
    const widthControls = animate(dropletWidth, activeDroplet.width, {
      ...spring,
      damping: spring.damping + 7
    });
    const heightControls = animate(dropletHeight, activeDroplet.height, {
      ...spring,
      damping: spring.damping + 7
    });

    return () => {
      leftControls.stop();
      topControls.stop();
      widthControls.stop();
      heightControls.stop();
    };
  }, [activeDroplet, dropletHeight, dropletLeft, dropletTop, dropletWidth]);

  useEffect(() => {
    if (!shouldShowPreviewDroplet || !previewDroplet) {
      return;
    }

    const spring = {
      type: "spring" as const,
      stiffness: 220,
      damping: 26,
      mass: 1.0,
      restDelta: 0.001,
      restSpeed: 0.1
    };

    const leftControls = animate(previewLeft, previewDroplet.left, spring);
    const topControls = animate(previewTop, previewDroplet.top, {
      ...spring,
      damping: spring.damping + 6
    });
    const widthControls = animate(previewWidth, previewDroplet.width, {
      ...spring,
      damping: spring.damping + 6
    });
    const heightControls = animate(previewHeight, previewDroplet.height, {
      ...spring,
      damping: spring.damping + 6
    });

    return () => {
      leftControls.stop();
      topControls.stop();
      widthControls.stop();
      heightControls.stop();
    };
  }, [
    previewDroplet,
    previewHeight,
    previewLeft,
    previewTop,
    previewWidth,
    shouldShowPreviewDroplet
  ]);

  const revealHeader = useCallback(() => {
    if (!hiddenRef.current) {
      return;
    }

    hiddenRef.current = false;
    setHidden(false);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!hasScrollSampleRef.current) {
      hasScrollSampleRef.current = true;
      lastScrollYRef.current = latest;
      return;
    }

    const previous = lastScrollYRef.current;
    const delta = latest - previous;
    lastScrollYRef.current = latest;

    if (
      isMobileExpanded ||
      isDraggingDroplet ||
      latest < NAV_HIDE_AFTER_Y ||
      Math.abs(delta) < NAV_SCROLL_DELTA
    ) {
      if (latest < NAV_HIDE_AFTER_Y || isMobileExpanded || isDraggingDroplet) {
        revealHeader();
      }

      return;
    }

    const shouldHide = delta > 0;

    if (hiddenRef.current === shouldHide) {
      return;
    }

    hiddenRef.current = shouldHide;
    setHidden(shouldHide);
  });

  useEffect(() => {
    hasScrollSampleRef.current = true;
    lastScrollYRef.current = window.scrollY;
    revealHeader();
  }, [pathname, revealHeader]);

  useEffect(() => {
    revealHeader();
  }, [isDraggingDroplet, isMobileExpanded, revealHeader]);

  useEffect(() => {
    measureDropletTargets();

    const nav = navRef.current;
    const shell = shellRef.current;
    const brand = brandRef.current;

    if (!nav || !shell) {
      return;
    }

    const resizeObserver = new ResizeObserver(measureDropletTargets);
    resizeObserver.observe(shell);
    resizeObserver.observe(nav);

    if (brand) {
      resizeObserver.observe(brand);
    }

    navLinkRefs.current.forEach((link) => {
      resizeObserver.observe(link);
    });

    window.addEventListener("resize", measureDropletTargets);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureDropletTargets);
    };
    // isRevealed matters: on "/" the header renders null until the hero is
    // revealed, so the first run of this effect finds no shell to measure.
    // Re-running on reveal is what makes the droplet exist on first load.
  }, [measureDropletTargets, isRevealed]);

  useEffect(() => {
    const warmRoutes = ["/", ...primaryRoutes.map((route) => route.href), "/resume"];
    const warmupTimer = window.setTimeout(() => {
      warmRoutes.forEach((href) => router.prefetch(href));
    }, 700);

    return () => {
      window.clearTimeout(warmupTimer);

      if (routePushFrame.current !== null) {
        window.cancelAnimationFrame(routePushFrame.current);
        routePushFrame.current = null;
      }
    };
  }, [router]);

  const moveDropletDrag = useCallback(
    (clientX: number) => {
      const dragStart = dropletDragStart.current;

      if (!dragStart) {
        return;
      }

      const dragOffset = clamp(
        dragStart.offset + clientX - dragStart.x,
        dropletDragConstraints.left,
        dropletDragConstraints.right
      );
      const releaseCenter = dragStart.activeTarget.center + dragOffset;

      dropletX.set(dragOffset);

      if (dropletTargets.length > 0) {
        updateDragIntentHref(
          getClosestDropletTarget(dropletTargets, releaseCenter).href
        );
      }
    },
    [
      dropletDragConstraints.left,
      dropletDragConstraints.right,
      dropletTargets,
      dropletX,
      updateDragIntentHref
    ]
  );

  const commitDropletDrag = useCallback(
    (clientX: number) => {
      const dragStart = dropletDragStart.current;

      if (!dragStart || dropletTargets.length === 0) {
        return;
      }

      const dragOffset = clamp(
        dragStart.offset + clientX - dragStart.x,
        dropletDragConstraints.left,
        dropletDragConstraints.right
      );
      const releaseCenter = dragStart.activeTarget.center + dragOffset;
      const closestTarget = getClosestDropletTarget(dropletTargets, releaseCenter);

      dropletDragStart.current = null;
      dropletPointerId.current = null;
      setActiveDroplet(closestTarget);
      setPreviewDroplet(null);
      updateDragIntentHref(null);
      if (closestTarget.href === "/") {
        setHomeArrivalPulse(true);

        if (homeArrivalTimeout.current) {
          clearTimeout(homeArrivalTimeout.current);
        }

        homeArrivalTimeout.current = setTimeout(() => {
          setHomeArrivalPulse(false);
        }, 820);
      }
      dropletXAnimation.current?.stop();
      dropletXAnimation.current = animate(dropletX, 0, {
        type: "spring",
        stiffness: 220,
        damping: 26,
        mass: 1.0,
        restDelta: 0.001,
        restSpeed: 0.1
      });
      setIsDraggingDroplet(false);

      if (closestTarget.href !== dragStart.activeTarget.href) {
        window.requestAnimationFrame(() => router.push(closestTarget.href));
        setIsMobileExpanded(false);
      }
    },
    [
      dropletDragConstraints.left,
      dropletDragConstraints.right,
      dropletTargets,
      dropletX,
      router,
      updateDragIntentHref
    ]
  );

  useEffect(() => {
    return () => {
      if (homeArrivalTimeout.current) {
        clearTimeout(homeArrivalTimeout.current);
      }
    };
  }, []);

  const startDropletDrag = useCallback(
    (clientX: number) => {
      if (!activeDroplet) {
        return;
      }

      dropletXAnimation.current?.stop();
      dropletXAnimation.current = null;
      dropletDragStart.current = {
        activeTarget: activeDroplet,
        offset: dropletX.get(),
        x: clientX
      };
      setPreviewDroplet(null);
      updateDragIntentHref(activeDroplet.href);
      setIsDraggingDroplet(true);
    },
    [activeDroplet, dropletX, updateDragIntentHref]
  );

  const handleDropletPointerCancel = useCallback(() => {
    dropletDragStart.current = null;
    dropletPointerId.current = null;
    updateDragIntentHref(null);
    dropletXAnimation.current?.stop();
    dropletXAnimation.current = animate(dropletX, 0, {
      type: "spring",
      stiffness: 220,
      damping: 26,
      mass: 1.0,
      restDelta: 0.001,
      restSpeed: 0.1
    });
    setIsDraggingDroplet(false);
  }, [dropletX, updateDragIntentHref]);

  useEffect(() => {
    if (!isDraggingDroplet) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (dropletPointerId.current !== null && event.pointerId !== dropletPointerId.current) {
        return;
      }

      moveDropletDrag(event.clientX);
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (dropletPointerId.current !== null && event.pointerId !== dropletPointerId.current) {
        return;
      }

      commitDropletDrag(event.clientX);
    };
    const handlePointerCancel = (event: PointerEvent) => {
      if (dropletPointerId.current !== null && event.pointerId !== dropletPointerId.current) {
        return;
      }

      handleDropletPointerCancel();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [commitDropletDrag, handleDropletPointerCancel, isDraggingDroplet, moveDropletDrag]);

  const handleDropletPointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!activeDroplet) {
      return;
    }

    event.preventDefault();
    dropletPointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    startDropletDrag(event.clientX);
  };

  const handleDropletPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (dropletPointerId.current !== null && event.pointerId !== dropletPointerId.current) {
      return;
    }

    moveDropletDrag(event.clientX);
  };

  const handleDropletPointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (dropletPointerId.current !== null && event.pointerId !== dropletPointerId.current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    commitDropletDrag(event.clientX);
  };

  if (pathname === "/" && !isRevealed) {
    return null;
  }

  return (
    <motion.header
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: "-118%" }
      }}
      initial={pathname === "/" ? "hidden" : false}
      animate={hidden ? "hidden" : "visible"}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: pathname === "/" && !hidden ? 1.0 : 0 
      }}
      className={styles.header}
    >
      <div
        className={styles.shell}
        data-active-droplet={activeDroplet?.type}
        data-dragging={isDraggingDroplet ? "true" : undefined}
        data-home-magnet={isHomeMagnetActive ? "true" : undefined}
        onPointerLeave={() => setPreviewTarget(null)}
        ref={shellRef}
      >
        <span aria-hidden="true" className={styles.shellBreath} />
        {isHomeMagnetActive || isHomeArrivalActive ? (
          <span
            aria-hidden="true"
            className={styles.homeMagnetField}
            data-arrival={isHomeArrivalActive ? "true" : undefined}
          >
            <span className={styles.homeMagnetRing} />
            <span className={styles.homeMagnetRing} />
            <span className={styles.homeMagnetBeam} />
            <span className={styles.homeMagnetSpark} />
            <span className={styles.homeMagnetSpark} />
            <span className={styles.homeMagnetSpark} />
          </span>
        ) : null}

        {activeDroplet ? (
          <motion.span
            aria-hidden="true"
            animate={{ opacity: 1 }}
            className={styles.activePill}
            draggable={false}
            onPointerCancel={handleDropletPointerCancel}
            onPointerDown={handleDropletPointerDown}
            onPointerMove={handleDropletPointerMove}
            onPointerUp={handleDropletPointerUp}
            style={{
              height: dropletHeight,
              x: dropletTranslateX,
              y: dropletTop,
              width: dropletWidth,
              scaleX: dropletScaleX,
              scaleY: dropletScaleY,
              skewX: dropletSkewX
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 26,
              mass: 1.0
            }}
          >
            {!isDraggingDroplet && <div className={styles.navRipple} />}
          </motion.span>
        ) : null}



        <Link
          aria-label="Nirmal Kumar home"
          className={styles.brandMark}
          data-active={activeDroplet?.href === "/" ? "true" : undefined}
          data-home-arrival={isHomeArrivalActive ? "true" : undefined}
          data-home-magnet={isHomeMagnetActive ? "true" : undefined}
          href="/"
          onBlur={() => setPreviewTarget(null)}
          onClick={(event) => handleRouteClick(event, "/")}
          onFocus={() => {
            const nextTarget = dropletTargets.find((target) => target.href === "/");
            setPreviewTarget(nextTarget ?? null);
          }}
          onPointerEnter={() => {
            const nextTarget = dropletTargets.find((target) => target.href === "/");
            setPreviewTarget(nextTarget ?? null);
          }}
          prefetch={false}
          ref={brandRef}
        >
          <span aria-hidden="true" className={styles.brandPulse} />
          <Logo className={styles.logoType} isMonogram={true} />
        </Link>

        <nav
          aria-label="Primary portfolio navigation"
          className={styles.primaryNav}
          data-dragging={isDraggingDroplet ? "true" : undefined}
          data-previewing={
            previewDroplet && activeDroplet && previewDroplet.href !== activeDroplet.href
              ? "true"
              : undefined
          }
          ref={navRef}
        >
          {primaryRoutes.map((route) => {
            const isActive = isActiveRoute(pathname, route.href);
            const hideOnMobile = ["/future-projects", "/resume", "/documents"].includes(
              route.href
            );
            const collapseOnNarrow = ["/timeline", "/profile", "/journey"].includes(route.href);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  styles.navLink,
                  hideOnMobile && styles.hideOnCompact,
                  collapseOnNarrow && styles.collapseOnNarrow,
                  isActive && styles.navLinkActive
                )}
                href={route.href}
                key={route.href}
                prefetch={false}
                ref={(node) => {
                  if (node) {
                    navLinkRefs.current.set(route.href, node);
                  } else {
                    navLinkRefs.current.delete(route.href);
                  }
                }}
                onFocus={() => {
                  const nextTarget = dropletTargets.find(
                    (target) => target.href === route.href
                  );
                  setPreviewTarget(nextTarget ?? null);
                }}
                onBlur={() => setPreviewTarget(null)}
                onClick={(event) => handleRouteClick(event, route.href)}
                onPointerEnter={() => {
                  const nextTarget = dropletTargets.find(
                    (target) => target.href === route.href
                  );
                  setPreviewTarget(nextTarget ?? null);
                  router.prefetch(route.href);
                }}
              >
                <span aria-hidden="true" className={styles.navLinkSweep} />
                <span className={styles.navLabel}>{route.shortLabel}</span>
              </Link>
            );
          })}

          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileExpanded}
          >
            <span aria-hidden="true" className={styles.mobileTogglePulse} />
            <span aria-hidden="true" className={styles.mobileToggleSweep} />
            {isMobileExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        <div className={styles.actionRail}>
          <Link
            className={styles.resumeButton}
            href="/resume"
            prefetch={false}
          >
            <span aria-hidden="true" className={styles.resumeSpark} />
            <FileDown aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Resume</span>
          </Link>
        </div>
      </div>

      {isMobileExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={styles.mobileDropdown}
        >
          <span aria-hidden="true" className={styles.mobileDropdownGlow} />
          <span aria-hidden="true" className={styles.mobileDropdownScan} />
          {primaryRoutes.map((route) => {
            const isActive = isActiveRoute(pathname, route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  styles.mobileDropdownLink,
                  isActive && styles.mobileDropdownLinkActive
                )}
                onClick={() => setIsMobileExpanded(false)}
              >
                <span aria-hidden="true" className={styles.mobileDropdownCurrent} />
                <span className={styles.mobileDropdownText}>
                  <span>{route.shortLabel}</span>
                  <small>{route.description}</small>
                </span>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className={styles.mobileDropdownActiveIndicator}
                  />
                ) : (
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                )}
              </Link>
            );
          })}

          <div className={styles.mobileDropdownDivider} />

          <Link
            className={styles.mobileDropdownResume}
            href="/resume"
            onClick={() => setIsMobileExpanded(false)}
          >
            <span aria-hidden="true" className={styles.resumeSpark} />
            <FileDown aria-hidden="true" className="h-4 w-4" />
            <span>
              <strong>Download Resume</strong>
              <small>One-page PDF and master resume routes.</small>
            </span>
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
