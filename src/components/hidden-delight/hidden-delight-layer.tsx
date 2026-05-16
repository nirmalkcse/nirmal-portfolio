"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type {
  HiddenDelightMode,
  HiddenDelightStampPayload
} from "./hidden-delight-panel";
import styles from "./hidden-delight-shell.module.css";

type Stamp = HiddenDelightStampPayload & {
  instanceId: string;
};

const HiddenDelightPanel = lazy(() =>
  import("./hidden-delight-panel").then((module) => ({
    default: module.HiddenDelightPanel
  }))
);

export function HiddenDelightLayer() {
  const issuedStampIds = useRef<Set<string>>(new Set());
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const timeouts = useRef<number[]>([]);
  const sequence = useRef("");
  const [mode, setMode] = useState<HiddenDelightMode>("commands");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [goldThreadUnlocked, setGoldThreadUnlocked] = useState(false);
  const [stamps, setStamps] = useState<Stamp[]>([]);

  const rememberFocusOrigin = useCallback(() => {
    const activeElement = document.activeElement;

    if (
      !previousFocusRef.current &&
      activeElement instanceof HTMLElement &&
      activeElement !== document.body
    ) {
      previousFocusRef.current = activeElement;
    }
  }, []);

  const emitStamp = useCallback((stamp: HiddenDelightStampPayload) => {
    if (stamp.unique && issuedStampIds.current.has(stamp.id)) {
      return;
    }

    if (stamp.unique) {
      issuedStampIds.current.add(stamp.id);
    }

    const instanceId = `${stamp.id}-${Date.now()}`;
    setStamps((current) => [...current, { ...stamp, instanceId }].slice(-3));

    const timeout = window.setTimeout(() => {
      setStamps((current) =>
        current.filter((activeStamp) => activeStamp.instanceId !== instanceId)
      );
    }, 4200);

    timeouts.current.push(timeout);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    setMode("commands");
    const returnTarget = previousFocusRef.current;
    previousFocusRef.current = null;

    window.setTimeout(() => {
      if (returnTarget?.isConnected) {
        returnTarget.focus();
      }
    }, 0);
  }, []);

  const openPalette = useCallback(() => {
    rememberFocusOrigin();
    setMode("commands");
    setPaletteOpen(true);
    emitStamp({
      id: "command-layer",
      title: "Command Layer",
      detail: "Hidden route controls are available.",
      unique: true
    });
  }, [emitStamp, rememberFocusOrigin]);

  const openPanel = useCallback(
    (nextMode: Exclude<HiddenDelightMode, "commands">) => {
      rememberFocusOrigin();
      setMode(nextMode);
      setPaletteOpen(true);
      emitStamp({
        id: nextMode === "vault" ? "vault-opened" : "notes-opened",
        title: nextMode === "vault" ? "Dossier Vault" : "Build Notes",
        detail:
          nextMode === "vault"
            ? "Private proof cues are now visible."
            : "Design and engineering notes are now visible.",
        unique: true
      });
    },
    [emitStamp, rememberFocusOrigin]
  );

  const unlockGoldThread = useCallback(() => {
    setGoldThreadUnlocked(true);
    emitStamp({
      id: "gold-thread",
      title: "Gold Thread",
      detail: "Threadline completion is unlocked for this visit.",
      unique: true
    });
  }, [emitStamp]);

  useEffect(() => {
    const activeTimeouts = timeouts.current;

    return () => {
      activeTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("gold-thread-unlocked", goldThreadUnlocked);

    return () => {
      document.body.classList.remove("gold-thread-unlocked");
    };
  }, [goldThreadUnlocked]);

  useEffect(() => {
    if (!goldThreadUnlocked) {
      return;
    }

    const footer = document.querySelector("footer");

    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          emitStamp({
            id: "footer-thread-complete",
            title: "Thread Complete",
            detail: "The footer mark has picked up the Gold Thread.",
            unique: true
          });
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, [emitStamp, goldThreadUnlocked]);

  useEffect(() => {
    function handleWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (isEditableElement(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        openPalette();
        return;
      }

      if (event.altKey && event.shiftKey && key === "v") {
        event.preventDefault();
        openPanel("vault");
        return;
      }

      if (!event.metaKey && !event.ctrlKey && !event.altKey && key.length === 1) {
        sequence.current = `${sequence.current}${key}`.slice(-12);

        if (sequence.current.endsWith("vault")) {
          openPanel("vault");
        }
      }
    }

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [openPalette, openPanel]);

  return (
    <>
      <div
        aria-hidden="true"
        className={styles.goldTrace}
        data-active={goldThreadUnlocked ? "true" : "false"}
      />

      {paletteOpen ? (
        <Suspense fallback={null}>
          <HiddenDelightPanel
            mode={mode}
            onClose={closePalette}
            onGoldThread={unlockGoldThread}
            onModeChange={setMode}
            onStamp={emitStamp}
          />
        </Suspense>
      ) : null}

      <AchievementStamps stamps={stamps} />
    </>
  );
}

function AchievementStamps({ stamps }: { stamps: readonly Stamp[] }) {
  return (
    <div aria-live="polite" className={styles.stampStack}>
      {stamps.map((stamp) => (
        <div className={styles.stamp} key={stamp.instanceId} role="status">
          <p className={styles.stampTitle}>{stamp.title}</p>
          <p className={styles.stampDetail}>{stamp.detail}</p>
        </div>
      ))}
    </div>
  );
}

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}
