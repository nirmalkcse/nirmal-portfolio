"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type PointerEvent,
  type RefObject
} from "react";
import { profile } from "@/data";
import { useStableReducedMotion } from "./use-stable-reduced-motion";
import styles from "./identity-card.module.css";

const currentRole = profile.roles[0];

/** Where the ambient key light rests when nobody is touching the card. */
const IDLE_LIGHT = { x: 0.3, y: 0.22 } as const;

const LIGHT_SPRING = { stiffness: 150, damping: 22, mass: 0.6 } as const;
const PRESENCE_SPRING = { stiffness: 110, damping: 20, mass: 0.8 } as const;

/** Maximum tilt in degrees while the pointer is on the card. */
const TILT_X = 15;
const TILT_Y = 21;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/* -------------------------------------------------------------------------- */
/*  Key light                                                                  */
/* -------------------------------------------------------------------------- */

type Stoppable = { stop: () => void };

/**
 * One key light shared by everything on a metal surface. Writes four custom
 * properties onto `ref` (`--card-lx/ly` position, `--card-ex/ey` direction,
 * `--card-glare` presence) so the material, chip and relief type all react
 * to the same source. With `drift`, the light wanders slowly while idle so
 * the metal never looks frozen.
 */
export function useKeyLight(
  ref: RefObject<HTMLElement | null>,
  { drift = false }: { drift?: boolean } = {}
) {
  const prefersReducedMotion = useStableReducedMotion();

  const pointerX = useMotionValue<number>(IDLE_LIGHT.x);
  const pointerY = useMotionValue<number>(IDLE_LIGHT.y);
  const engagement = useMotionValue(0);

  const lightX = useSpring(pointerX, LIGHT_SPRING);
  const lightY = useSpring(pointerY, LIGHT_SPRING);
  const presence = useSpring(engagement, PRESENCE_SPRING);

  const driftRef = useRef<Stoppable[]>([]);

  const stopDrift = useCallback(() => {
    for (const control of driftRef.current) control.stop();
    driftRef.current = [];
  }, []);

  const startDrift = useCallback(() => {
    if (!drift || prefersReducedMotion) return;
    stopDrift();
    driftRef.current = [
      animate(
        pointerX,
        [IDLE_LIGHT.x, IDLE_LIGHT.x + 0.11, IDLE_LIGHT.x - 0.05, IDLE_LIGHT.x],
        { duration: 13, ease: "easeInOut", repeat: Infinity }
      ),
      animate(
        pointerY,
        [IDLE_LIGHT.y, IDLE_LIGHT.y + 0.14, IDLE_LIGHT.y + 0.04, IDLE_LIGHT.y],
        { duration: 17, ease: "easeInOut", repeat: Infinity }
      )
    ];
  }, [drift, pointerX, pointerY, prefersReducedMotion, stopDrift]);

  useEffect(() => {
    startDrift();
    return stopDrift;
  }, [startDrift, stopDrift]);

  const writeX = useCallback(
    (value: number) => {
      const element = ref.current;
      if (!element) return;
      element.style.setProperty("--card-lx", `${(value * 100).toFixed(2)}%`);
      element.style.setProperty("--card-ex", (value * 2 - 1).toFixed(3));
    },
    [ref]
  );
  const writeY = useCallback(
    (value: number) => {
      const element = ref.current;
      if (!element) return;
      element.style.setProperty("--card-ly", `${(value * 100).toFixed(2)}%`);
      element.style.setProperty("--card-ey", (value * 2 - 1).toFixed(3));
    },
    [ref]
  );
  const writeGlare = useCallback(
    (value: number) => {
      ref.current?.style.setProperty("--card-glare", value.toFixed(3));
    },
    [ref]
  );

  useMotionValueEvent(lightX, "change", writeX);
  useMotionValueEvent(lightY, "change", writeY);
  useMotionValueEvent(presence, "change", writeGlare);

  // Springs only report changes, so seed the properties once on mount.
  useEffect(() => {
    writeX(lightX.get());
    writeY(lightY.get());
    writeGlare(presence.get());
  }, [lightX, lightY, presence, writeGlare, writeX, writeY]);

  /** Place the light explicitly (pointer, gyroscope) and hold it there. */
  const holdLight = useCallback(
    (x: number, y: number, strength: number) => {
      stopDrift();
      pointerX.set(clamp01(x));
      pointerY.set(clamp01(y));
      engagement.set(strength);
    },
    [engagement, pointerX, pointerY, stopDrift]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion || event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      holdLight(
        (event.clientX - bounds.left) / bounds.width,
        (event.clientY - bounds.top) / bounds.height,
        1
      );
    },
    [holdLight, prefersReducedMotion]
  );

  /** Let go: the light settles back to its resting place and drifts. */
  const release = useCallback(() => {
    engagement.set(0);
    pointerX.set(IDLE_LIGHT.x);
    pointerY.set(IDLE_LIGHT.y);
    startDrift();
  }, [engagement, pointerX, pointerY, startDrift]);

  return {
    lightX,
    lightY,
    presence,
    holdLight,
    onPointerMove,
    release,
    prefersReducedMotion
  };
}

/* -------------------------------------------------------------------------- */
/*  Physical details                                                           */
/* -------------------------------------------------------------------------- */

function EmvChip({ id }: { id: string }) {
  const gold = `${id}-gold`;
  const bevel = `${id}-bevel`;

  return (
    <svg
      aria-hidden="true"
      className={styles.chipArt}
      focusable="false"
      viewBox="0 0 60 46"
    >
      <defs>
        <linearGradient id={gold} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f8e8b8" />
          <stop offset="0.26" stopColor="#d7b062" />
          <stop offset="0.5" stopColor="#f1d99d" />
          <stop offset="0.76" stopColor="#b9873c" />
          <stop offset="1" stopColor="#e6c57f" />
        </linearGradient>
        <linearGradient id={bevel} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff7d9" stopOpacity="0.95" />
          <stop offset="1" stopColor="#5f4116" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Body */}
      <rect
        fill={`url(#${gold})`}
        height="44.5"
        rx="7"
        stroke={`url(#${bevel})`}
        strokeWidth="1.5"
        width="58.5"
        x="0.75"
        y="0.75"
      />

      {/* Engraved contact grooves: light pass sits a hair below the dark pass */}
      <g
        fill="none"
        stroke="rgba(255, 246, 214, 0.55)"
        strokeLinecap="round"
        strokeWidth="0.9"
        transform="translate(0.55 0.65)"
      >
        <rect height="19" rx="5" width="21" x="19.5" y="13.5" />
        <path d="M0.75 15.5H19.5M40.5 15.5H59.25M0.75 30.5H19.5M40.5 30.5H59.25M30 0.75V13.5M30 32.5V45.25" />
      </g>
      <g
        fill="none"
        stroke="rgba(72, 47, 14, 0.62)"
        strokeLinecap="round"
        strokeWidth="1.05"
      >
        <rect height="19" rx="5" width="21" x="19.5" y="13.5" />
        <path d="M0.75 15.5H19.5M40.5 15.5H59.25M0.75 30.5H19.5M40.5 30.5H59.25M30 0.75V13.5M30 32.5V45.25" />
      </g>

      {/* Inner bevel */}
      <rect
        fill="none"
        height="42.5"
        rx="6.2"
        stroke="rgba(255, 248, 222, 0.42)"
        strokeWidth="0.75"
        width="56.5"
        x="1.75"
        y="1.75"
      />
    </svg>
  );
}

function ContactlessMark() {
  return (
    <svg
      aria-hidden="true"
      className={styles.contactless}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.55"
      viewBox="0 0 24 24"
    >
      <path d="M6.6 9.4a4.1 4.1 0 0 1 0 5.2" />
      <path d="M9.7 7.1a7.4 7.4 0 0 1 0 9.8" />
      <path d="M12.8 4.9a10.6 10.6 0 0 1 0 14.2" />
      <path d="M15.9 2.7a13.9 13.9 0 0 1 0 18.6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Material                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The clipped stack of layers that makes a surface read as brushed titanium.
 * `finish="matte"` is the quieter version used behind long-form text.
 */
export function CardMaterial({
  finish = "polished",
  secretActive = false
}: {
  finish?: "polished" | "matte";
  secretActive?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={styles.shell}
      data-finish={finish}
      data-secret={secretActive ? "true" : undefined}
    >
      <span className={styles.base} />
      <span className={styles.brush} />
      <span className={styles.grain} />
      <span className={styles.shade} />
      <span className={styles.specular} />
      <span className={styles.sweep} data-card-sweep="" />
      <span className={styles.rim} />
    </span>
  );
}

/**
 * Slices stacked behind the face so the tilt reveals a real edge with rounded
 * corners. Tone peaks mid-depth: a polished rim with darker seams.
 */
const bodyLayers = Array.from({ length: 8 }, (_, index) => {
  const position = (index + 1) / 8;
  const brightness = 1 - Math.abs(position * 2 - 1);
  return {
    key: index,
    style: {
      background: `color-mix(in srgb, #f6f2ea ${Math.round(30 + brightness * 70)}%, #645b52)`,
      transform: `translateZ(calc(var(--card-depth) * -${position.toFixed(3)}))`
    }
  };
});

function CardBody({ secretActive }: { secretActive: boolean }) {
  return (
    <span aria-hidden="true" className={styles.body} data-secret={secretActive ? "true" : undefined}>
      {bodyLayers.map((layer) => (
        <span className={styles.bodyLayer} key={layer.key} style={layer.style} />
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Face                                                                       */
/* -------------------------------------------------------------------------- */

export function CardFace({
  interactive,
  secretActive
}: {
  interactive: boolean;
  secretActive: boolean;
}) {
  const chipId = useId();
  const secret = secretActive ? "true" : undefined;

  const credentialControl = interactive ? (
    <Link
      aria-label="View credentials"
      className={styles.chip}
      href="/certifications"
    >
      <EmvChip id={chipId} />
      <span aria-hidden="true" className={styles.chipGlare} />
      <span className={styles.controlLabel}>Credentials</span>
    </Link>
  ) : (
    <span aria-hidden="true" className={styles.chip}>
      <EmvChip id={chipId} />
      <span className={styles.chipGlare} />
    </span>
  );

  const workControl = interactive ? (
    <Link
      aria-label="View selected work"
      className={styles.open}
      href="/projects"
    >
      <ArrowUpRight aria-hidden="true" strokeWidth={1.6} />
      <span className={styles.controlLabel}>Selected work</span>
    </Link>
  ) : (
    <span aria-hidden="true" className={styles.open}>
      <ArrowUpRight aria-hidden="true" strokeWidth={1.6} />
    </span>
  );

  return (
    <>
      <CardMaterial secretActive={secretActive} />

      {/* Print & relief: floats a few millimetres above the metal */}
      <div className={styles.content} data-secret={secret}>
        <div className={styles.topline}>
          <span className={styles.eyebrow}>
            <span>{secretActive ? "After hours" : "Professional profile"}</span>
            <span aria-hidden="true" className={styles.eyebrowDot} />
            <span>{secretActive ? "13° N · 80° E" : "Edition 01"}</span>
          </span>
          <span aria-hidden="true" className={styles.seal}>
            <span>NK.</span>
          </span>
        </div>

        <div className={styles.chipRow}>
          {credentialControl}
          <ContactlessMark />
        </div>

        <div className={styles.identity}>
          <strong className={styles.name}>Nirmal Kumar</strong>
          <span className={styles.role}>Data Engineer</span>
        </div>

        <div className={styles.bottomline}>
          <span className={styles.meta}>
            <span>{currentRole.organization}</span>
            <span aria-hidden="true" className={styles.metaDot} />
            <span>Chennai · India</span>
          </span>
          {workControl}
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Interactive card                                                           */
/* -------------------------------------------------------------------------- */

export function CardIdentity({
  onExpand,
  secretActive,
  triggerRef
}: {
  onExpand: () => void;
  secretActive: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    lightX,
    lightY,
    presence,
    holdLight,
    onPointerMove,
    release,
    prefersReducedMotion
  } = useKeyLight(cardRef, { drift: true });

  // The card leans toward the pointer; it lies flat again when released.
  const rotateX = useTransform(
    [lightY, presence],
    (values: number[]) => (0.5 - values[0]) * TILT_X * values[1]
  );
  const rotateY = useTransform(
    [lightX, presence],
    (values: number[]) => (values[0] - 0.5) * TILT_Y * values[1]
  );
  const lift = useTransform(presence, [0, 1], [0, -7]);

  // Ground shadow slides opposite to the tilt and softens as the card lifts.
  const shadowX = useTransform(rotateY, (value) => value * -1.15);
  const shadowY = useTransform(
    [rotateX, presence],
    (values: number[]) => 10 + values[0] * 1.15 + values[1] * 14
  );
  const shadowScale = useTransform(presence, [0, 1], [1, 1.06]);
  const shadowOpacity = useTransform(presence, [0, 1], [0.58, 0.42]);

  // On phones there is no hover, so let the device's own tilt light the card.
  // iOS requires an explicit permission prompt for this, which we never show.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const OrientationEvent = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<string>;
        })
      | undefined;
    if (!OrientationEvent || typeof OrientationEvent.requestPermission === "function") {
      return;
    }

    let restingBeta: number | null = null;

    function handleOrientation(event: DeviceOrientationEvent) {
      if (event.beta === null || event.gamma === null) return;
      if (restingBeta === null) restingBeta = event.beta;

      holdLight(
        0.5 + event.gamma / 48,
        0.5 + (event.beta - restingBeta) / 48,
        0.65
      );
    }

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [holdLight, prefersReducedMotion]);

  const motionStyle = prefersReducedMotion
    ? undefined
    : { rotateX, rotateY, y: lift };

  return (
    <div className={styles.frame}>
      <motion.span
        aria-hidden="true"
        className={styles.shadow}
        style={
          prefersReducedMotion
            ? undefined
            : {
                x: shadowX,
                y: shadowY,
                scale: shadowScale,
                opacity: shadowOpacity
              }
        }
      />

      <motion.div
        className={styles.card}
        data-secret={secretActive ? "true" : undefined}
        layoutId="profile-card-shell"
        onPointerCancel={release}
        onPointerLeave={release}
        onPointerMove={onPointerMove}
        ref={cardRef}
        style={motionStyle}
        transition={{
          scale: { type: "spring", stiffness: 480, damping: 30, mass: 0.6 }
        }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.982 }}
      >
        <CardBody secretActive={secretActive} />
        <CardFace interactive secretActive={secretActive} />
        <button
          aria-haspopup="dialog"
          aria-label="Open Nirmal Kumar's expanded profile folio"
          className={styles.expand}
          onClick={onExpand}
          ref={triggerRef}
          type="button"
        />
      </motion.div>
    </div>
  );
}
