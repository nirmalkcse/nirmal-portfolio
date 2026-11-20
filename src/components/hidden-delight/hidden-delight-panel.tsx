"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Boxes,
  ClipboardCheck,
  Compass,
  FileText,
  Layers3,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject
} from "react";
import {
  certifications,
  featuredProjectSlugs,
  futureProjects,
  profile,
  projects,
  skillClusters
} from "@/data";
import styles from "./hidden-delight.module.css";

export type HiddenDelightMode = "commands" | "vault" | "notes";

export type HiddenDelightStampPayload = {
  id: string;
  title: string;
  detail: string;
  unique?: boolean;
};

type HiddenCommand = {
  id:
    | "show-proof"
    | "verify-credentials"
    | "open-vault"
    | "build-notes"
    | "gold-thread"
    | "timeline-focus"
    | "resume-path";
  label: string;
  detail: string;
  keywords: readonly string[];
  Icon: LucideIcon;
};

type HiddenDelightPanelProps = {
  mode: HiddenDelightMode;
  onClose: () => void;
  onGoldThread: () => void;
  onModeChange: (mode: HiddenDelightMode) => void;
  onStamp: (stamp: HiddenDelightStampPayload) => void;
};

const featuredProjects = featuredProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter(isDefined);

const vaultSignals = [
  {
    title: "Case-study path",
    detail: featuredProjects.map((project) => project.title).join(" / "),
    Icon: Layers3
  },
  {
    title: "Work density",
    detail: `${skillClusters.length} skill clusters, ${certifications.length} credentials, ${profile.achievements.length} quantified outcomes.`,
    Icon: Network
  },
  {
    title: "Learning tracks",
    detail: `${futureProjects.length} current learning tracks, all grounded in existing work instead of broad future language.`,
    Icon: Compass
  },
  {
    title: "Public sharing gate",
    detail:
      "Client names, private screenshots, internal URLs, and sensitive project details stay gated until explicitly approved.",
    Icon: ShieldCheck
  }
] as const;

const buildNotes = [
  {
    title: "Work before spectacle",
    detail:
      "The portfolio is structured around one consistent story: review focus, skill map, case studies, credentials, timeline, resume, and documents all point at the same work."
  },
  {
    title: "Gold stays scarce",
    detail:
      "Gold appears as thread, stamp, edge, or verification cue. Large decorative fills are avoided so the interface keeps its professional weight."
  },
  {
    title: "Hidden means optional",
    detail:
      "This layer never interrupts the public path. Recruiters can still reach the resume and contact routes without touching any hidden interaction."
  },
  {
    title: "Motion has a floor",
    detail:
      "The delight layer uses the shared motion tokens and collapses movement in reduced-motion mode while preserving state visibility."
  }
] as const;

const commandCatalog = [
  {
    id: "show-proof",
    label: "Show skill map",
    detail: "Open the skill map that connects skills, projects, and credentials.",
    keywords: ["proof", "graph", "evidence", "skills"],
    Icon: Network
  },
  {
    id: "verify-credentials",
    label: "Verify credentials",
    detail: "Jump to the credential console and public verification state.",
    keywords: ["certifications", "credentials", "verify", "microsoft", "databricks"],
    Icon: BadgeCheck
  },
  {
    id: "open-vault",
    label: "Open Review Vault",
    detail: "Reveal a compact private index of review signals and public-sharing boundaries.",
    keywords: ["vault", "dossier", "signals", "private"],
    Icon: LockKeyhole
  },
  {
    id: "build-notes",
    label: "Read hidden build notes",
    detail: "Show a restrained note on how the portfolio was designed and engineered.",
    keywords: ["notes", "build", "craft", "design", "engineering"],
    Icon: BookOpenCheck
  },
  {
    id: "gold-thread",
    label: "Trace Gold Thread",
    detail: "Unlock the quiet footer thread and completion stamp.",
    keywords: ["gold", "thread", "unlock", "nk", "footer"],
    Icon: Sparkles
  },
  {
    id: "timeline-focus",
    label: "Timeline focus",
    detail: "Move directly to career, education, project, and recognition momentum.",
    keywords: ["timeline", "career", "history", "momentum"],
    Icon: Compass
  },
  {
    id: "resume-path",
    label: "Open resume path",
    detail: "Keep the recruiter-safe resume download one command away.",
    keywords: ["resume", "download", "recruiter", "contact"],
    Icon: FileText
  }
] as const satisfies readonly HiddenCommand[];

export function HiddenDelightPanel({
  mode,
  onClose,
  onGoldThread,
  onModeChange,
  onStamp
}: HiddenDelightPanelProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleCommands = useMemo(() => {
    const queryTokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (queryTokens.length === 0) {
      return commandCatalog;
    }

    return commandCatalog.filter((command) => {
      const haystack = [command.label, command.detail, ...command.keywords]
        .join(" ")
        .toLowerCase();

      return queryTokens.every((token) => haystack.includes(token));
    });
  }, [query]);

  const activeCommandIndex = Math.min(
    activeIndex,
    Math.max(visibleCommands.length - 1, 0)
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const target =
        mode === "commands"
          ? inputRef.current
          : getFocusableElements(dialogRef.current)[0];

      target?.focus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [mode]);

  function openPanel(nextMode: Exclude<HiddenDelightMode, "commands">) {
    setQuery("");
    setActiveIndex(0);
    onModeChange(nextMode);
    onStamp({
      id: nextMode === "vault" ? "vault-opened" : "notes-opened",
      title: nextMode === "vault" ? "Review Vault" : "Build Notes",
      detail:
        nextMode === "vault"
          ? "Private review cues are now visible."
          : "Design and engineering notes are now visible.",
      unique: true
    });
  }

  function navigate(href: string) {
    onClose();
    router.push(href);
  }

  function runCommand(command: HiddenCommand) {
    switch (command.id) {
      case "show-proof":
        navigate("/proof");
        break;
      case "verify-credentials":
        navigate("/certifications");
        break;
      case "open-vault":
        openPanel("vault");
        break;
      case "build-notes":
        openPanel("notes");
        break;
      case "gold-thread":
        onGoldThread();
        onClose();
        break;
      case "timeline-focus":
        navigate("/timeline");
        break;
      case "resume-path":
        navigate("/resume");
        break;
    }
  }

  function handlePaletteKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Tab") {
      trapDialogFocus(event);
      return;
    }

    if (mode !== "commands") {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        visibleCommands.length === 0
          ? 0
          : Math.min(current + 1, visibleCommands.length - 1)
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const activeCommand = visibleCommands[activeCommandIndex];

      if (activeCommand) {
        event.preventDefault();
        runCommand(activeCommand);
      }
    }
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="hidden-delight-title"
        aria-modal="true"
        className={styles.dialog}
        onKeyDown={handlePaletteKeyDown}
        ref={dialogRef}
        role="dialog"
      >
        <header className={styles.topbar}>
          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}>Hidden layer</p>
            <h2 className={styles.title} id="hidden-delight-title">
              {mode === "commands"
                ? "Command palette"
                : mode === "vault"
                  ? "Review Vault"
                  : "Build notes"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {mode !== "commands" ? (
              <button
                className={styles.backButton}
                onClick={() => {
                  setQuery("");
                  setActiveIndex(0);
                  onModeChange("commands");
                }}
                type="button"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Commands
              </button>
            ) : null}
            <button
              aria-label="Close hidden command layer"
              className={styles.closeButton}
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {mode === "commands" ? (
            <CommandPalette
              activeIndex={activeCommandIndex}
              commands={visibleCommands}
              inputRef={inputRef}
              onQueryChange={(value) => {
                setQuery(value);
                setActiveIndex(0);
              }}
              onRun={runCommand}
              query={query}
            />
          ) : null}

          {mode === "vault" ? (
            <DossierVault
              onBuildNotes={() => openPanel("notes")}
              onClose={onClose}
              onGoldThread={onGoldThread}
            />
          ) : null}

          {mode === "notes" ? <BuildNotes onClose={onClose} /> : null}
        </div>
      </section>
    </div>
  );
}

function CommandPalette({
  activeIndex,
  commands,
  inputRef,
  onQueryChange,
  onRun,
  query
}: {
  activeIndex: number;
  commands: readonly HiddenCommand[];
  inputRef: RefObject<HTMLInputElement | null>;
  onQueryChange: (value: string) => void;
  onRun: (command: HiddenCommand) => void;
  query: string;
}) {
  return (
    <>
      <label className={styles.searchRow}>
        <Search aria-hidden="true" className={styles.searchIcon} />
        <span className="sr-only">Search hidden commands</span>
        <input
          aria-activedescendant={commands[activeIndex]?.id}
          aria-controls="hidden-command-list"
          className={styles.searchInput}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Type a command: show skill map, open vault, trace gold thread..."
          ref={inputRef}
          type="search"
          value={query}
        />
        <kbd className={styles.shortcut}>Esc</kbd>
      </label>

      <div
        className={styles.commandList}
        id="hidden-command-list"
        role="listbox"
      >
        {commands.length > 0 ? (
          commands.map((command, index) => {
            const Icon = command.Icon;

            return (
              <button
                aria-selected={index === activeIndex}
                className={styles.commandButton}
                data-active={index === activeIndex ? "true" : "false"}
                id={command.id}
                key={command.id}
                onClick={() => onRun(command)}
                role="option"
                type="button"
              >
                <span className={styles.commandIcon}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className={styles.commandLabel}>{command.label}</span>
                  <span className={styles.commandDetail}>{command.detail}</span>
                </span>
                <ArrowRight aria-hidden="true" className={styles.commandArrow} />
              </button>
            );
          })
        ) : (
          <p className={styles.emptyState}>
            No hidden command matches that phrase. The public route map is still
            available through the main navigation.
          </p>
        )}
      </div>
    </>
  );
}

function DossierVault({
  onClose,
  onBuildNotes,
  onGoldThread
}: {
  onClose: () => void;
  onBuildNotes: () => void;
  onGoldThread: () => void;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelIntro}>
        <p className={styles.eyebrow}>Private index</p>
        <h3 className={styles.panelTitle}>Review signals, quietly indexed.</h3>
        <p className={styles.panelCopy}>
          The vault is a hidden overview for the portfolio system. It summarizes
          the strongest review paths and public-sharing boundaries without
          creating another visible page for recruiters to parse.
        </p>
      </div>

      <div className={styles.vaultGrid}>
        {vaultSignals.map((signal) => {
          const Icon = signal.Icon;

          return (
            <article className={styles.vaultCard} key={signal.title}>
              <span className={styles.vaultCardIcon}>
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h4 className={styles.cardTitle}>{signal.title}</h4>
                <p className={styles.cardCopy}>{signal.detail}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.panelActions}>
        <Link className={styles.panelAction} href="/projects" onClick={onClose}>
          Open case studies
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link
          className={styles.panelAction}
          href="/future-projects"
          onClick={onClose}
        >
          Open explorations
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <button className={styles.panelAction} onClick={onBuildNotes} type="button">
          Read build notes
          <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
        </button>
        <button className={styles.panelAction} onClick={onGoldThread} type="button">
          Trace Gold Thread
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function BuildNotes({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelIntro}>
        <p className={styles.eyebrow}>Hidden build notes</p>
        <h3 className={styles.panelTitle}>Designed to reward attention.</h3>
        <p className={styles.panelCopy}>
          These notes are deliberately behind a command layer. They add craft
          context for curious visitors while leaving the primary portfolio path
          focused on work, resume, and contact.
        </p>
      </div>

      <div className={styles.noteGrid}>
        {buildNotes.map((note) => (
          <article className={styles.noteCard} key={note.title}>
            <div className="flex items-start gap-3">
              <span className={styles.vaultCardIcon}>
                <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h4 className={styles.cardTitle}>{note.title}</h4>
                <p className={styles.cardCopy}>{note.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.panelActions}>
        <Link className={styles.panelAction} href="/resume" onClick={onClose}>
          Resume remains first-class
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link className={styles.panelAction} href="/documents" onClick={onClose}>
          Open document hub
          <Boxes aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",")
    )
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.offsetParent !== null
  );
}

function trapDialogFocus(event: KeyboardEvent<HTMLDivElement>) {
  const focusableElements = getFocusableElements(event.currentTarget);

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (!(activeElement instanceof HTMLElement)) {
    event.preventDefault();
    firstElement.focus();
    return;
  }

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function isDefined<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}
