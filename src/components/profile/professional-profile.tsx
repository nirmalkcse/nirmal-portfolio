"use client";

import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  FileText,
  GraduationCap,
  Layers3,
  MapPin,
  Maximize2,
  X
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
  type RefObject
} from "react";
import { DownloadLink } from "@/components/ui/download-link";
import { profile, type SocialLink } from "@/data";
import styles from "./professional-profile.module.css";

const onePageResume = {
  href: "/resume/nirmal-kumar-data-engineer-one-page-resume.pdf",
  fileName: "nirmal-kumar-data-engineer-one-page-resume.pdf"
} as const;

const masterResume = {
  href: "/resume/nirmal-kumar-data-engineer-master-resume.pdf",
  fileName: "nirmal-kumar-data-engineer-master-resume.pdf"
} as const;

const currentRole = profile.roles[0];
const contactHeadline =
  "Data Engineer shaping Microsoft Fabric, Databricks, SQL, PySpark, and Power BI systems for migration, validation, and modern reporting.";
const folioSummary =
  "Nirmal Kumar builds data systems that bring clarity to migration, reporting, and validation. His strongest work spans telecom migration assets for 3 source systems and 18–24 daily incremental tables, BI validation that reduced report discrepancies by 90%, Tableau-to-Power BI migrations, and a Databricks-hosted MDM/entity-resolution product with governed orchestration, reviewable decisions, and role-based controls.";
const primaryContact =
  profile.socialLinks.find((link) => link.label === "LinkedIn") ??
  profile.socialLinks[0];
const github =
  profile.socialLinks.find((link) => link.label === "GitHub") ??
  profile.socialLinks[1];
const quietEase = [0.16, 1, 0.3, 1] as const;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useStableReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

const outcomes = [
  {
    value: "90%",
    numericValue: 90,
    suffix: "%",
    label: "fewer validation discrepancies",
    detail: "SQL reconciliation across migrated BI reporting.",
    href: "/projects/bi-migration-validation-analytics"
  },
  {
    value: "15+",
    numericValue: 15,
    suffix: "+",
    label: "reports brought through validation",
    detail: "MicroStrategy-to-Fabric and related migration work.",
    href: "/projects/bi-migration-validation-analytics"
  },
  {
    value: "3",
    numericValue: 3,
    suffix: "",
    label: "source systems shaped for migration",
    detail: "Alongside 18–24 daily incremental source tables.",
    href: "/projects/telecom-fabric-migration-poc"
  }
] as const;

const presenceLinks = profile.socialLinks.filter(
  (link) => link.label !== "LinkedIn" && link.label !== "GitHub"
);

const folioMetrics = [
  { value: "3", label: "source systems" },
  { value: "18–24", label: "daily source tables" },
  { value: "15+", label: "reports validated" },
  { value: "90%", label: "fewer discrepancies" }
] as const;

const folioDisciplines = [
  {
    label: "Data systems",
    value: "Microsoft Fabric · Databricks · Delta Lake · PySpark · SQL"
  },
  {
    label: "Analytics",
    value: "Power BI · DAX · Power Query · semantic models"
  },
  {
    label: "Governance",
    value: "Unity Catalog · RBAC · audit logging · orchestration"
  }
] as const;

const folioWork = [
  {
    href: "/projects/telecom-fabric-migration-poc",
    label: "Fabric migration",
    detail: "3 source systems · 18–24 incremental tables"
  },
  {
    href: "/projects/bi-migration-validation-analytics",
    label: "BI validation",
    detail: "15+ reports · 90% fewer discrepancies"
  },
  {
    href: "/projects/icore-enterprise-mdm-entity-resolution",
    label: "Governed MDM product",
    detail: "Entity resolution · reviewable decisions · role controls"
  }
] as const;

const folioContentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.74,
      staggerChildren: 0.055
    }
  }
} as const;

const folioItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: quietEase }
  }
} as const;

function PlatformIcon({ label }: { label: string }) {
  const iconProps = {
    "aria-hidden": true,
    strokeWidth: 1.7
  } as const;

  switch (label) {
    case "LinkedIn":
      return <FaLinkedinIn aria-hidden="true" />;
    case "GitHub":
      return <FaGithub aria-hidden="true" />;
    case "IEEE":
      return <BookOpen {...iconProps} />;
    case "LeetCode":
      return <Code2 {...iconProps} />;
    default:
      return <ArrowUpRight {...iconProps} />;
  }
}

function SectionSweep({
  progress,
  reduced
}: {
  progress?: MotionValue<number>;
  reduced: boolean;
}) {
  if (progress) {
    return (
      <motion.span
        aria-hidden="true"
        className={styles.sectionSweep}
        style={{ opacity: 1, scaleX: reduced ? 1 : progress }}
      />
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className={styles.sectionSweep}
      initial={reduced ? false : { opacity: 0, scaleX: 0 }}
      transition={{ duration: 0.9, ease: quietEase }}
      viewport={{ once: true, amount: 0.4 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
    />
  );
}

function CardFace({
  interactive,
  secretActive
}: {
  interactive: boolean;
  secretActive: boolean;
}) {
  const credentialControl = interactive ? (
    <Link
      aria-label="View credentials"
      className={styles.cardChip}
      href="/certifications"
    >
      <span className={styles.cardControlLabel}>Credentials</span>
    </Link>
  ) : (
    <span aria-hidden="true" className={styles.cardChip} />
  );
  const workControl = interactive ? (
    <Link
      aria-label="View selected work"
      className={styles.cardOpenIcon}
      href="/projects"
    >
      <ArrowUpRight aria-hidden="true" strokeWidth={1.6} />
      <span className={styles.cardControlLabel}>Selected work</span>
    </Link>
  ) : (
    <span aria-hidden="true" className={styles.cardOpenIcon}>
      <ArrowUpRight aria-hidden="true" strokeWidth={1.6} />
    </span>
  );

  return (
    <>
      <span aria-hidden="true" className={styles.cardPearl} />
      <span aria-hidden="true" className={styles.cardTexture} />
      <span aria-hidden="true" className={styles.cardFoilSweep} />

      <span className={styles.cardTopline}>
        {credentialControl}
        <span className={styles.cardEdition}>
          <span>
            {secretActive ? "After hours · Chennai" : "Professional profile"}
          </span>
          <span>{secretActive ? "13° N · 80° E" : "Edition 01"}</span>
        </span>
      </span>

      <span className={styles.cardCenter}>
        <strong>Nirmal Kumar</strong>
        <span className={styles.cardRole}>Data Engineer</span>
      </span>

      <span className={styles.cardBottomline}>
        <span>
          <span className={styles.cardMicroLabel}>Current chapter</span>
          <span>{currentRole.organization}</span>
        </span>
        <span>
          <span className={styles.cardMicroLabel}>Base</span>
          <span>Chennai · India</span>
        </span>
        {workControl}
      </span>
    </>
  );
}

function CardIdentity({
  onExpand,
  secretActive,
  triggerRef
}: {
  onExpand: () => void;
  secretActive: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const prefersReducedMotion = useStableReducedMotion();
  const rotateXSource = useMotionValue(0);
  const rotateYSource = useMotionValue(0);
  const rotateX = useSpring(rotateXSource, {
    stiffness: 170,
    damping: 24,
    mass: 0.7
  });
  const rotateY = useSpring(rotateYSource, {
    stiffness: 170,
    damping: 24,
    mass: 0.7
  });
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    rotateXSource.set((0.5 - y) * 2.4);
    rotateYSource.set((x - 0.5) * 2.8);
    event.currentTarget.style.setProperty("--card-light-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--card-light-y", `${y * 100}%`);
  }

  function resetCard(event: PointerEvent<HTMLDivElement>) {
    rotateXSource.set(0);
    rotateYSource.set(0);
    event.currentTarget.style.removeProperty("--card-light-x");
    event.currentTarget.style.removeProperty("--card-light-y");
  }

  return (
    <motion.div
      className={styles.identityCard}
      data-secret={secretActive ? "true" : undefined}
      layoutId="profile-card-shell"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCard}
      onPointerCancel={resetCard}
      style={
        prefersReducedMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1500 }
      }
    >
      <CardFace interactive secretActive={secretActive} />
      <button
        aria-haspopup="dialog"
        aria-label="Open Nirmal Kumar's expanded profile folio"
        className={styles.cardExpandButton}
        onClick={onExpand}
        ref={triggerRef}
        type="button"
      />
    </motion.div>
  );
}

function ProfileFolio({
  onClose,
  secretActive
}: {
  onClose: () => void;
  secretActive: boolean;
}) {
  const prefersReducedMotion = useStableReducedMotion();
  const [closing, setClosing] = useState(false);
  const [settled, setSettled] = useState(Boolean(prefersReducedMotion));
  const closeTimerRef = useRef<number | null>(null);
  const closingRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleClose = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;
    setClosing(true);
    setSettled(false);

    if (prefersReducedMotion) {
      window.requestAnimationFrame(onClose);
      return;
    }

    closeTimerRef.current = window.setTimeout(onClose, 880);
  }, [onClose, prefersReducedMotion]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const focusTimer = window.setTimeout(
      () => closeRef.current?.focus({ preventScroll: true }),
      prefersReducedMotion ? 30 : 780
    );

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("hidden"));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (
        activeElement === dialogRef.current ||
        !dialogRef.current.contains(activeElement)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [handleClose, prefersReducedMotion]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-describedby="profile-folio-summary"
      aria-labelledby="profile-folio-title"
      aria-modal="true"
      className={styles.folioOverlay}
      data-motion={settled ? "settled" : "flipping"}
      data-lenis-prevent=""
      data-lenis-prevent-touch=""
      data-lenis-prevent-wheel=""
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : closing
            ? { opacity: [1, 1, 0.9, 0] }
            : { opacity: 0 }
      }
      initial={{ opacity: 0 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
      transition={{
        duration: prefersReducedMotion ? 0.01 : closing ? 0.72 : 0.34,
        ease: quietEase,
        times: closing ? [0, 0.48, 0.78, 1] : undefined
      }}
    >
      <span aria-hidden="true" className={styles.folioHalo} />
      <motion.div
        className={styles.folioCard}
        data-closing={closing ? "true" : undefined}
        data-settled={settled ? "true" : undefined}
        layoutId="profile-card-shell"
        onClick={(event) => event.stopPropagation()}
        transition={
          prefersReducedMotion
            ? { duration: 0.01 }
            : closing
              ? {
                  layout: {
                    delay: 0,
                    duration: 0.58,
                    ease: quietEase
                  }
                }
              : {
                  layout: {
                    delay: 0.5,
                    duration: 0.68,
                    ease: quietEase
                  }
                }
        }
      >
        <motion.span
          animate={
            prefersReducedMotion
              ? { opacity: 0.38, scaleX: 0.9, scaleY: 1, y: 0 }
              : {
                  opacity: [0.42, 0.6, 0.34, 0.2, 0.48, 0.52],
                  scaleX: [0.82, 1.01, 0.58, 0.24, 0.86, 0.92],
                  scaleY: [0.9, 1, 1.12, 1.28, 0.98, 0.94],
                  y: [4, 7, 13, 18, 4, 2]
                }
          }
          aria-hidden="true"
          className={styles.folioGroundShadow}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  opacity: [0.52, 0.48, 0.2, 0.34, 0.42, 0.38],
                  scaleX: [0.92, 0.86, 0.24, 0.58, 0.78, 0.76],
                  scaleY: [0.94, 0.98, 1.28, 1.12, 0.98, 0.96],
                  y: [2, 4, 18, 13, 6, 4]
                }
          }
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0.42, scaleX: 0.82, scaleY: 0.9, y: 4 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : closing
                ? {
                    duration: 0.72,
                    ease: "linear",
                    times: [0, 0.12, 0.42, 0.57, 0.9, 1]
                  }
                : {
                    delay: 0.03,
                    duration: 1.2,
                    ease: "linear",
                    times: [0, 0.1, 0.43, 0.58, 0.88, 1]
                  }
          }
        />

        <span aria-hidden="true" className={styles.folioEdgeSpine} />

        <div
          className={styles.folioRotator}
          onAnimationEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              !closingRef.current
            ) {
              setSettled(true);
            }
          }}
        >
          <span
            aria-hidden="true"
            className={`${styles.folioEdge} ${styles.folioEdgeLeft}`}
          />
          <span
            aria-hidden="true"
            className={`${styles.folioEdge} ${styles.folioEdgeRight}`}
          />
          <span
            aria-hidden="true"
            className={`${styles.folioEdge} ${styles.folioEdgeTop}`}
          />
          <span
            aria-hidden="true"
            className={`${styles.folioEdge} ${styles.folioEdgeBottom}`}
          />

          <span
            aria-hidden="true"
            className={`${styles.folioFlipPlane} ${styles.folioFlipPlaneFront}`}
          >
            <motion.span
              animate={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: [0, 0.46, 0, 0],
                      x: ["-210%", "260%", "650%", "650%"]
                    }
              }
              className={styles.folioFlipGlint}
              exit={{ opacity: 0 }}
              transition={{
                delay: 0.03,
                duration: prefersReducedMotion ? 0.01 : 1.08,
                ease: "linear",
                times: [0, 0.34, 0.58, 1]
              }}
            />
          </span>

          <div
            aria-hidden="true"
            className={`${styles.folioFace} ${styles.folioFront}`}
            data-secret={secretActive ? "true" : undefined}
          >
            <CardFace interactive={false} secretActive={secretActive} />
          </div>

          <div className={`${styles.folioFace} ${styles.folioBack}`}>
          <span aria-hidden="true" className={styles.folioBackPearl} />
          <span aria-hidden="true" className={styles.folioBackTexture} />

          <motion.div
            animate="visible"
            className={styles.folioBackInner}
            initial={prefersReducedMotion ? false : "hidden"}
            variants={folioContentVariants}
          >
            <motion.header className={styles.folioHeader} variants={folioItemVariants}>
              <div>
                <p>Private profile folio · reverse side</p>
                <h2 id="profile-folio-title">Nirmal Kumar</h2>
                <span>
                  Data Engineer · {currentRole.organization} · Chennai
                </span>
              </div>
              <button
                aria-label="Close expanded profile folio"
                className={styles.folioClose}
                onClick={handleClose}
                ref={closeRef}
                type="button"
              >
                <X aria-hidden="true" strokeWidth={1.5} />
                <span>Close</span>
              </button>
            </motion.header>

            <div
              aria-label="Profile folio details"
              className={styles.folioScroll}
              data-lenis-prevent=""
              data-lenis-prevent-touch=""
              data-lenis-prevent-wheel=""
              role="region"
              tabIndex={0}
            >
              <motion.section className={styles.folioIntroduction} variants={folioItemVariants}>
                <p className={styles.folioSectionLabel}>Profile / 01</p>
                <p className={styles.folioBio} id="profile-folio-summary">
                  {folioSummary}
                </p>
              </motion.section>

              <motion.dl className={styles.folioMetrics} variants={folioItemVariants}>
                {folioMetrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </motion.dl>

              <div className={styles.folioDetails}>
                <motion.div className={styles.folioPrimaryColumn} variants={folioItemVariants}>
                  <section className={styles.folioSection}>
                    <div className={styles.folioSectionHeading}>
                      <span>02</span>
                      <h3>Experience</h3>
                    </div>
                    <div className={styles.folioRoleRow}>
                      <div>
                        <strong>{currentRole.title}</strong>
                        <span>{currentRole.organization}</span>
                      </div>
                      <span>Sep 2024 — Present</span>
                    </div>
                    <p className={styles.folioDiscipline}>{currentRole.discipline}</p>
                    <ul className={styles.folioAchievementList}>
                      {profile.achievements.slice(0, 4).map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.folioSection}>
                    <div className={styles.folioSectionHeading}>
                      <span>03</span>
                      <h3>Selected work</h3>
                    </div>
                    <div className={styles.folioWorkList}>
                      {folioWork.map((work, index) => (
                        <Link href={work.href} key={work.href}>
                          <span>0{index + 1}</span>
                          <strong>{work.label}</strong>
                          <small>{work.detail}</small>
                          <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                        </Link>
                      ))}
                    </div>
                  </section>
                </motion.div>

                <motion.aside className={styles.folioSecondaryColumn} variants={folioItemVariants}>
                  <section className={styles.folioSection}>
                    <div className={styles.folioSectionHeading}>
                      <span>04</span>
                      <h3>Education</h3>
                    </div>
                    <strong className={styles.folioEducationDegree}>
                      {profile.education.degree}
                    </strong>
                    <p>{profile.education.institution}</p>
                    <div className={styles.folioEducationMeta}>
                      <span>{profile.education.completionYear}</span>
                      <span>{profile.education.cgpa} CGPA</span>
                    </div>
                  </section>

                  <section className={styles.folioSection}>
                    <div className={styles.folioSectionHeading}>
                      <span>05</span>
                      <h3>Practice</h3>
                    </div>
                    <dl className={styles.folioDisciplineList}>
                      {folioDisciplines.map((discipline) => (
                        <div key={discipline.label}>
                          <dt>{discipline.label}</dt>
                          <dd>{discipline.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                </motion.aside>
              </div>
            </div>

            <motion.footer className={styles.folioFooter} variants={folioItemVariants}>
              <span className={styles.folioSerial}>NK · 13.0827 N · 80.2707 E</span>
              <div>
                <Link className={styles.folioQuietAction} href="/projects">
                  Selected work
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                </Link>
                <a
                  aria-label="Open Nirmal Kumar's LinkedIn profile in a new tab"
                  className={styles.folioQuietAction}
                  href={primaryContact.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FaLinkedinIn aria-hidden="true" />
                  LinkedIn
                </a>
                <DownloadLink
                  ariaLabel="Download Nirmal Kumar's master resume"
                  className={styles.folioResumeAction}
                  download={masterResume.fileName}
                  href={masterResume.href}
                >
                  <FileText aria-hidden="true" strokeWidth={1.55} />
                  Master résumé
                  <ArrowDownToLine aria-hidden="true" strokeWidth={1.55} />
                </DownloadLink>
              </div>
            </motion.footer>
          </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChannelContent({
  description,
  icon,
  index,
  meta,
  title,
  trailing
}: {
  description: string;
  icon: ReactNode;
  index: string;
  meta: string;
  title: string;
  trailing: ReactNode;
}) {
  return (
    <>
      <span className={styles.channelIndex}>{index}</span>
      <span className={styles.channelTitle}>
        <span className={styles.channelIcon}>{icon}</span>
        <span>
          <strong>{title}</strong>
          <small>{meta}</small>
        </span>
      </span>
      <span className={styles.channelDescription}>{description}</span>
      <span className={styles.channelTrailing}>{trailing}</span>
    </>
  );
}

function ExternalChannel({
  description,
  index,
  link,
  meta
}: {
  description: string;
  index: string;
  link: SocialLink;
  meta: string;
}) {
  return (
    <a
      aria-label={`${link.label}. ${description} Opens in a new tab.`}
      className={styles.channel}
      href={link.url}
      rel="noreferrer"
      target="_blank"
    >
      <ChannelContent
        description={description}
        icon={<PlatformIcon label={link.label} />}
        index={index}
        meta={meta}
        title={link.label}
        trailing={<ArrowUpRight aria-hidden="true" strokeWidth={1.6} />}
      />
    </a>
  );
}

function StoryOutcome({
  index,
  outcome,
  progress,
  reduced
}: {
  index: number;
  outcome: (typeof outcomes)[number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const enterStart = 0.018 + index * 0.03;
  const enterEnd = enterStart + 0.072;
  const opacity = useTransform(
    progress,
    [enterStart, enterEnd, 0.34, 0.415],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [enterStart, enterEnd, 0.34, 0.415],
    [42, 0, 0, -24]
  );
  const scale = useTransform(
    progress,
    [enterStart, enterEnd, 0.34, 0.415],
    [0.985, 1, 1, 0.992]
  );

  return (
    <motion.div
      className={styles.outcomeCell}
      style={reduced ? undefined : { opacity, scale, y }}
    >
      <Link href={outcome.href}>
        <StoryMetric
          index={index}
          outcome={outcome}
          progress={progress}
          reduced={reduced}
        />
        <strong>{outcome.label}</strong>
        <span>{outcome.detail}</span>
        <ArrowRight aria-hidden="true" strokeWidth={1.5} />
      </Link>
    </motion.div>
  );
}

function StoryMetric({
  index,
  outcome,
  progress,
  reduced
}: {
  index: number;
  outcome: (typeof outcomes)[number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);
  const renderedValueRef = useRef<number | null>(null);
  const trigger = 0.018 + index * 0.03;
  const formatValue = useCallback(
    (latest: number) => {
      const rounded = Math.round(latest);
      const suffix =
        rounded === 0 && outcome.suffix === "+" ? "" : outcome.suffix;
      return `${rounded}${suffix}`;
    },
    [outcome.suffix]
  );
  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  const renderValue = useCallback(
    (latest: number) => {
      const rounded = Math.round(latest);

      if (renderedValueRef.current === rounded || !valueRef.current) {
        return;
      }

      renderedValueRef.current = rounded;
      valueRef.current.textContent = formatValue(rounded);
    },
    [formatValue]
  );
  const playCounter = useCallback(() => {
    if (hasPlayedRef.current || !valueRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    cancelAnimation();
    const duration = 1120 - index * 90;
    let startedAt: number | null = null;

    const tick = (timestamp: number) => {
      startedAt ??= timestamp;
      const elapsed = timestamp - startedAt;
      const position = Math.min(1, elapsed / duration);
      const eased =
        position < 0.5
          ? 4 * position * position * position
          : 1 - Math.pow(-2 * position + 2, 3) / 2;

      renderValue(outcome.numericValue * eased);

      if (position < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, [cancelAnimation, index, outcome.numericValue, renderValue]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduced) {
      return;
    }

    if (latest <= 0.002) {
      cancelAnimation();
      hasPlayedRef.current = false;
      renderValue(0);
      return;
    }

    if (latest >= trigger) {
      playCounter();
    }
  });

  useEffect(() => {
    cancelAnimation();
    hasPlayedRef.current = false;

    if (reduced) {
      renderValue(outcome.numericValue);
      return cancelAnimation;
    }

    renderValue(0);
    if (progress.get() >= trigger) {
      playCounter();
    }

    return cancelAnimation;
  }, [
    cancelAnimation,
    outcome.numericValue,
    playCounter,
    progress,
    reduced,
    renderValue,
    trigger
  ]);

  return (
    <span className={styles.outcomeValue}>
      <span aria-hidden="true" ref={valueRef}>
        {reduced ? outcome.value : formatValue(0)}
      </span>
      <span className={styles.srOnly}>{outcome.value}</span>
    </span>
  );
}

function WatermarkLetter({
  index,
  letter,
  line,
  progress,
  reduced
}: {
  index: number;
  letter: string;
  line: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const enterStart = 0.725 + index * 0.013;
  const enterEnd = enterStart + 0.075;
  const x = useTransform(
    progress,
    [enterStart, enterEnd],
    [line === 0 ? 24 : -20, 0]
  );
  const y = useTransform(
    progress,
    [enterStart, enterEnd],
    [line === 0 ? 34 : 42, 0]
  );
  const opacity = useTransform(
    progress,
    [enterStart, enterStart + 0.014],
    [0, 1]
  );
  const rotate = useTransform(
    progress,
    [enterStart, enterEnd],
    [line === 0 ? 2.2 : -2.2, 0]
  );
  const scaleY = useTransform(progress, [enterStart, enterEnd], [0.94, 1]);

  return (
    <span className={styles.finalWatermarkGlyph}>
      <motion.span
        className={styles.finalWatermarkGlyphInner}
        style={reduced ? undefined : { opacity, rotate, scaleY, x, y }}
      >
        {letter}
      </motion.span>
    </span>
  );
}

function StoryWatermark({
  progress,
  reduced
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const lines = [
    { offset: 0, word: "Nirmal" },
    { offset: 6, word: "Kumar" }
  ] as const;

  return (
    <span aria-hidden="true" className={styles.finalWatermark}>
      {lines.map(({ offset, word }, line) => (
        <span className={styles.finalWatermarkLine} key={word}>
          {Array.from(word).map((letter, index) => (
            <WatermarkLetter
              index={offset + index}
              key={`${word}-${letter}-${index}`}
              letter={letter}
              line={line}
              progress={progress}
              reduced={reduced}
            />
          ))}
        </span>
      ))}
    </span>
  );
}

function StoryChannel({
  children,
  index,
  progress,
  reduced
}: {
  children: ReactNode;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const enterStart = 0.39 + index * 0.055;
  const enterEnd = enterStart + 0.075;
  const opacity = useTransform(
    progress,
    [enterStart, enterEnd, 0.71, 0.79],
    [0, 1, 1, 0]
  );
  const x = useTransform(
    progress,
    [enterStart, enterEnd, 0.71, 0.79],
    [34, 0, 0, -18]
  );
  const scale = useTransform(
    progress,
    [enterStart, enterEnd, 0.71, 0.79],
    [0.99, 1, 1, 0.995]
  );

  return (
    <motion.div
      className={styles.storyChannel}
      style={reduced ? undefined : { opacity, scale, x }}
    >
      {children}
    </motion.div>
  );
}

export function ProfessionalProfile() {
  const prefersReducedMotion = useStableReducedMotion();
  const [editionPresses, setEditionPresses] = useState(0);
  const [folioOpen, setFolioOpen] = useState(false);
  const [storyMode, setStoryMode] = useState(false);
  const [activeStoryChapter, setActiveStoryChapter] = useState<0 | 1 | 2>(0);
  const [secretActive, setSecretActive] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const folioCaptionRef = useRef<HTMLButtonElement>(null);
  const folioOpenerRef = useRef<"card" | "caption" | null>(null);
  const folioTriggerRef = useRef<HTMLButtonElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const activeStoryChapterRef = useRef<0 | 1 | 2>(0);
  const { scrollYProgress: storyRawProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });
  const { scrollYProgress: storyEntryProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "start start"]
  });
  const cardY = useTransform(storyEntryProgress, [0, 1], [0, -12]);
  const cardScale = useTransform(storyEntryProgress, [0, 1], [1, 0.988]);
  const cardOpacity = useTransform(
    storyEntryProgress,
    [0, 0.58, 0.9, 1],
    [1, 1, 0.5, 0]
  );
  const copyY = useTransform(storyEntryProgress, [0, 0.58, 1], [0, -8, -38]);
  const copyOpacity = useTransform(
    storyEntryProgress,
    [0, 0.52, 0.88, 1],
    [1, 1, 0.42, 0]
  );
  const storyProgress = storyRawProgress;
  const surfaceY = useTransform(
    storyEntryProgress,
    [0, 0.24, 0.88, 1],
    [18, 0, 0, -44]
  );
  const rimOpacity = useTransform(
    storyEntryProgress,
    [0, 0.08, 0.56, 0.9, 1],
    [0, 0.65, 1, 0.24, 0]
  );
  const rimGlintX = useTransform(
    storyEntryProgress,
    [0.1, 0.76],
    ["-36vw", "112vw"]
  );
  const rimGlintOpacity = useTransform(
    storyEntryProgress,
    [0.08, 0.22, 0.58, 0.82],
    [0, 1, 0.55, 0]
  );
  const nameEtchOpacity = useTransform(
    storyEntryProgress,
    [0.46, 0.62, 0.8],
    [0, 0.78, 0]
  );
  const nameEtchX = useTransform(
    storyEntryProgress,
    [0.46, 0.8],
    [12, -12]
  );
  const outcomesLabelOpacity = useTransform(
    storyEntryProgress,
    [0.3, 0.56, 0.78],
    [0, 0.82, 1]
  );
  const outcomesLabelY = useTransform(
    storyEntryProgress,
    [0.3, 0.62, 0.78],
    [14, 0, 0]
  );
  const outcomesHeadingOpacity = useTransform(
    storyEntryProgress,
    [0.42, 0.72, 0.96],
    [0, 0.84, 1]
  );
  const outcomesHeadingY = useTransform(
    storyEntryProgress,
    [0.42, 0.76, 0.96],
    [28, 5, 0]
  );
  const outcomesOpacity = useTransform(
    storyProgress,
    [0, 0.34, 0.425],
    [1, 1, 0]
  );
  const outcomesY = useTransform(
    storyProgress,
    [0, 0.34, 0.425],
    [0, 0, -58]
  );
  const outcomesScale = useTransform(
    storyProgress,
    [0, 0.34, 0.425],
    [1, 1, 0.992]
  );
  const contactOpacity = useTransform(
    storyProgress,
    [0.32, 0.42, 0.71, 0.805],
    [0, 1, 1, 0]
  );
  const contactY = useTransform(
    storyProgress,
    [0.32, 0.42, 0.71, 0.805],
    [58, 0, 0, -46]
  );
  const contactScale = useTransform(
    storyProgress,
    [0.32, 0.42, 0.71, 0.805],
    [0.985, 1, 1, 0.994]
  );
  const finalOpacity = useTransform(
    storyProgress,
    [0.72, 0.84, 1],
    [0, 1, 1]
  );
  const finalY = useTransform(
    storyProgress,
    [0.72, 0.84, 1],
    [64, 0, 0]
  );
  const finalScale = useTransform(
    storyProgress,
    [0.72, 0.84, 1],
    [0.985, 1, 1]
  );
  const outcomesSweep = useTransform(storyProgress, [0, 0.08], [0, 1]);
  const contactSweep = useTransform(storyProgress, [0.34, 0.49], [0, 1]);
  const finalSweep = useTransform(storyProgress, [0.74, 0.88], [0, 1]);
  const ledgerOpacity = useTransform(
    storyProgress,
    [0.11, 0.19, 0.34, 0.405],
    [0, 1, 1, 0]
  );
  const ledgerY = useTransform(
    storyProgress,
    [0.11, 0.19, 0.34, 0.405],
    [24, 0, 0, -16]
  );
  const contactIntroX = useTransform(
    storyProgress,
    [0.34, 0.44, 0.71, 0.79],
    [-26, 0, 0, -18]
  );
  const contactRailProgress = useTransform(
    storyProgress,
    [0.4, 0.68],
    [0, 1]
  );
  const storyGlowOpacity = useTransform(
    storyProgress,
    [0, 0.1, 0.35, 0.72, 1],
    [0, 0.24, 0.54, 0.42, 0.28]
  );
  const editionEtchOpacity = useTransform(
    storyProgress,
    [0.11, 0.17, 0.26],
    [0, 0.62, 0]
  );
  const editionEtchY = useTransform(storyProgress, [0.11, 0.26], [8, -6]);

  useMotionValueEvent(storyProgress, "change", (latest) => {
    const nextChapter: 0 | 1 | 2 = latest < 0.38 ? 0 : latest < 0.76 ? 1 : 2;
    if (activeStoryChapterRef.current !== nextChapter) {
      activeStoryChapterRef.current = nextChapter;
      setActiveStoryChapter(nextChapter);
    }
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1181px) and (min-height: 620px)");
    const updateStoryMode = () =>
      setStoryMode(query.matches && !Boolean(prefersReducedMotion));

    updateStoryMode();
    query.addEventListener("change", updateStoryMode);

    return () => query.removeEventListener("change", updateStoryMode);
  }, [prefersReducedMotion]);
  const openFolio = useCallback((opener: "card" | "caption") => {
    folioOpenerRef.current = opener;
    setFolioOpen(true);
  }, []);
  const closeFolio = useCallback(() => setFolioOpen(false), []);
  const handleFolioExitComplete = useCallback(() => {
    const focusTarget =
      folioOpenerRef.current === "caption"
        ? folioCaptionRef.current
        : folioTriggerRef.current;

    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
    }

    folioOpenerRef.current = null;
  }, []);

  function handleEditionPress() {
    const nextPresses = editionPresses + 1;

    if (nextPresses >= 3) {
      setSecretActive((current) => !current);
      setEditionPresses(0);
      return;
    }

    setEditionPresses(nextPresses);
  }

  return (
    <main
      className={styles.page}
      data-folio-open={folioOpen ? "true" : undefined}
      id="main-content"
      tabIndex={-1}
    >
      <LayoutGroup id="profile-card-expansion">
      <section
        aria-hidden={folioOpen ? "true" : undefined}
        className={styles.hero}
        inert={folioOpen}
      >
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroCopy}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            style={
              !storyMode || prefersReducedMotion
                ? undefined
                : { opacity: copyOpacity, y: copyY }
            }
            transition={{ duration: 0.72, ease: quietEase }}
          >
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              Nirmal Kumar · Chennai, India
            </p>
            <h1 className={styles.heroTitle}>
              Let&apos;s make complex work feel <em>inevitable.</em>
            </h1>
            <p className={styles.heroLead}>{contactHeadline}</p>

            <div className={styles.heroActions}>
              <a
                aria-label="Open Nirmal Kumar's LinkedIn profile in a new tab"
                className={styles.primaryAction}
                href={primaryContact.url}
                rel="noreferrer"
                target="_blank"
              >
                <FaLinkedinIn aria-hidden="true" />
                Connect on LinkedIn
                <ArrowUpRight aria-hidden="true" strokeWidth={1.7} />
              </a>
              <DownloadLink
                ariaLabel="Download Nirmal Kumar's one-page resume"
                className={styles.secondaryAction}
                download={onePageResume.fileName}
                href={onePageResume.href}
              >
                One-page résumé
              </DownloadLink>
            </div>

            <div className={styles.availability}>
              <span aria-hidden="true" className={styles.availabilityMark} />
              <span>Available for thoughtful roles and ambitious technical work.</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.cardStage}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, scale: 0.975, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={
              !storyMode || prefersReducedMotion
                ? undefined
                : { opacity: cardOpacity, scale: cardScale, y: cardY }
            }
            transition={{ duration: 0.9, delay: 0.12, ease: quietEase }}
          >
            <div className={styles.cardSlot}>
              {!folioOpen ? (
                <CardIdentity
                  onExpand={() => openFolio("card")}
                  secretActive={secretActive}
                  triggerRef={folioTriggerRef}
                />
              ) : null}
            </div>
            <div className={styles.cardCaption}>
              <button
                aria-label="Identity edition detail"
                className={styles.editionTrigger}
                onClick={handleEditionPress}
                title="Edition detail"
                type="button"
              >
                01 / Personal identity
              </button>
              <button
                className={styles.openFolioCaption}
                onClick={() => openFolio("caption")}
                ref={folioCaptionRef}
                type="button"
              >
                Open folio
                <Maximize2 aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>
            <AnimatePresence>
              {secretActive ? (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.atelierNote}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -4 }
                  }
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 6 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.36,
                    ease: quietEase
                  }}
                >
                  Built in Chennai · refined one quiet decision at a time.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <div className={styles.storyTrack} ref={storyRef}>
        <div className={styles.storySticky}>
          <motion.div
            aria-hidden="true"
            className={styles.storySurface}
            style={
              !storyMode || prefersReducedMotion
                ? undefined
                : { y: surfaceY }
            }
          >
            <motion.span
              className={styles.storyRim}
              style={
                !storyMode || prefersReducedMotion
                  ? undefined
                  : { opacity: rimOpacity }
              }
            >
              <motion.span
                className={styles.storyRimGlint}
                style={
                  !storyMode || prefersReducedMotion
                    ? undefined
                    : { opacity: rimGlintOpacity, x: rimGlintX }
                }
              />
            </motion.span>
            <motion.span
              className={styles.storyNameEtch}
              style={
                !storyMode || prefersReducedMotion
                  ? undefined
                  : { opacity: nameEtchOpacity, x: nameEtchX }
              }
            >
              Nirmal Kumar
            </motion.span>
            <motion.span
              className={styles.storyEditionEtch}
              style={
                !storyMode || prefersReducedMotion
                  ? undefined
                  : { opacity: editionEtchOpacity, y: editionEtchY }
              }
            >
              NK / Edition 01
            </motion.span>
          </motion.div>

          <div aria-hidden="true" className={styles.storyAtmosphere}>
            <motion.span
              className={styles.storyGlow}
              style={
                !storyMode || prefersReducedMotion
                  ? undefined
                  : { opacity: storyGlowOpacity }
              }
            />
          </div>

          <motion.section
            aria-hidden={
              folioOpen || (storyMode && activeStoryChapter !== 0)
                ? "true"
                : undefined
            }
            className={`${styles.outcomesSection} ${styles.storyChapter}`}
            data-active={
              !storyMode || activeStoryChapter === 0 ? "true" : undefined
            }
            inert={folioOpen || (storyMode && activeStoryChapter !== 0)}
            style={
              !storyMode || prefersReducedMotion
                ? undefined
                : {
                    opacity: outcomesOpacity,
                    scale: outcomesScale,
                    y: outcomesY
                  }
            }
          >
            <SectionSweep
              progress={storyMode ? outcomesSweep : undefined}
              reduced={Boolean(prefersReducedMotion)}
            />
            <div className={styles.sectionInner}>
              <header className={styles.sectionHeader}>
                <motion.p
                  className={styles.eyebrow}
                  style={
                    !storyMode || prefersReducedMotion
                      ? undefined
                      : {
                          opacity: outcomesLabelOpacity,
                          y: outcomesLabelY
                        }
                  }
                >
                  <span aria-hidden="true" />
                  Selected outcomes
                </motion.p>
                <motion.div
                  style={
                    !storyMode || prefersReducedMotion
                      ? undefined
                      : {
                          opacity: outcomesHeadingOpacity,
                          y: outcomesHeadingY
                        }
                  }
                >
                  <h2>A quiet measure of the work.</h2>
                  <p>
                    Systems are only useful when they hold their shape at scale,
                    through change, and under close review.
                  </p>
                </motion.div>
              </header>

              <div className={styles.outcomeGrid}>
                {outcomes.map((outcome, index) => (
                  <StoryOutcome
                    index={index}
                    key={outcome.value}
                    outcome={outcome}
                    progress={storyProgress}
                    reduced={!storyMode || Boolean(prefersReducedMotion)}
                  />
                ))}
              </div>

              <motion.div
                className={styles.profileLedger}
                style={
                  !storyMode || prefersReducedMotion
                    ? undefined
                    : { opacity: ledgerOpacity, y: ledgerY }
                }
              >
                <div>
                  <BriefcaseBusiness aria-hidden="true" strokeWidth={1.55} />
                  <span>
                    <small>Now</small>
                    <strong>{currentRole.title}</strong>
                    <span>{currentRole.organization}</span>
                  </span>
                </div>
                <div>
                  <GraduationCap aria-hidden="true" strokeWidth={1.55} />
                  <span>
                    <small>Study</small>
                    <strong>B.E. Computer Science</strong>
                    <span>{profile.education.cgpa} CGPA</span>
                  </span>
                </div>
                <div>
                  <Layers3 aria-hidden="true" strokeWidth={1.55} />
                  <span>
                    <small>Practice</small>
                    <strong>Fabric · Databricks</strong>
                    <span>SQL · PySpark · Power BI</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            aria-hidden={
              folioOpen || (storyMode && activeStoryChapter !== 1)
                ? "true"
                : undefined
            }
            className={`${styles.contactSection} ${styles.storyChapter}`}
            data-active={
              !storyMode || activeStoryChapter === 1 ? "true" : undefined
            }
            inert={folioOpen || (storyMode && activeStoryChapter !== 1)}
            style={
              !storyMode || prefersReducedMotion
                ? undefined
                : {
                    opacity: contactOpacity,
                    scale: contactScale,
                    y: contactY
                  }
            }
          >
            <SectionSweep
              progress={storyMode ? contactSweep : undefined}
              reduced={Boolean(prefersReducedMotion)}
            />
            <div className={styles.contactInner}>
              <motion.header
                className={styles.contactIntro}
                style={
                  !storyMode || prefersReducedMotion
                    ? undefined
                    : { x: contactIntroX }
                }
              >
                <p className={styles.eyebrow}>
                  <span aria-hidden="true" />
                  Contact
                </p>
                <h2>Choose the channel that fits the conversation.</h2>
                <p>
                  Professional outreach begins on LinkedIn. Code, selected work,
                  and a concise résumé remain close at hand.
                </p>
                <button
                  aria-label="Reveal Chennai coordinates"
                  aria-pressed={showCoordinates}
                  className={styles.locationLine}
                  onClick={() => setShowCoordinates((current) => !current)}
                  type="button"
                >
                  <MapPin aria-hidden="true" strokeWidth={1.6} />
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -4 }
                      }
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 4 }
                      }
                      key={showCoordinates ? "coordinates" : "location"}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.24,
                        ease: quietEase
                      }}
                    >
                      {showCoordinates
                        ? "13.0827° N · 80.2707° E"
                        : "Chennai · India · GMT +5:30"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </motion.header>

              <div className={styles.channels}>
                <span aria-hidden="true" className={styles.contactRail}>
                  <motion.span
                    style={{
                      scaleY:
                        !storyMode || prefersReducedMotion
                          ? 1
                          : contactRailProgress
                    }}
                  />
                </span>

                <StoryChannel
                  index={0}
                  progress={storyProgress}
                  reduced={!storyMode || Boolean(prefersReducedMotion)}
                >
                  <ExternalChannel
                    description="For roles, collaborations, and a considered first conversation."
                    index="01"
                    link={primaryContact}
                    meta="Primary professional channel"
                  />
                </StoryChannel>

                <StoryChannel
                  index={1}
                  progress={storyProgress}
                  reduced={!storyMode || Boolean(prefersReducedMotion)}
                >
                  <ExternalChannel
                    description="Repositories and selected engineering work in their native context."
                    index="02"
                    link={github}
                    meta="Engineering profile"
                  />
                </StoryChannel>

                <StoryChannel
                  index={2}
                  progress={storyProgress}
                  reduced={!storyMode || Boolean(prefersReducedMotion)}
                >
                  <DownloadLink
                    ariaLabel="Download Nirmal Kumar's one-page resume"
                    className={`${styles.channel} ${styles.downloadChannel}`}
                    download={onePageResume.fileName}
                    href={onePageResume.href}
                  >
                    <ChannelContent
                      description="A concise overview of current work, platforms, and experience."
                      icon={<ArrowDownToLine aria-hidden="true" strokeWidth={1.7} />}
                      index="03"
                      meta="PDF · one page"
                      title="Résumé"
                      trailing={
                        <ArrowDownToLine aria-hidden="true" strokeWidth={1.6} />
                      }
                    />
                  </DownloadLink>
                </StoryChannel>

                <StoryChannel
                  index={3}
                  progress={storyProgress}
                  reduced={!storyMode || Boolean(prefersReducedMotion)}
                >
                  <div className={styles.elsewhere}>
                    <span>Elsewhere</span>
                    {presenceLinks.map((link) => (
                      <a
                        aria-label={`Open ${link.label} in a new tab`}
                        href={link.url}
                        key={link.label}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <PlatformIcon label={link.label} />
                        {link.label}
                        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                      </a>
                    ))}
                  </div>
                </StoryChannel>
              </div>
            </div>
          </motion.section>

          <motion.section
            aria-hidden={
              folioOpen || (storyMode && activeStoryChapter !== 2)
                ? "true"
                : undefined
            }
            className={`${styles.finalSection} ${styles.storyChapter}`}
            data-active={
              !storyMode || activeStoryChapter === 2 ? "true" : undefined
            }
            inert={folioOpen || (storyMode && activeStoryChapter !== 2)}
            style={
              !storyMode || prefersReducedMotion
                ? undefined
                : {
                    opacity: finalOpacity,
                    scale: finalScale,
                    y: finalY
                  }
            }
          >
            <StoryWatermark
              progress={storyProgress}
              reduced={!storyMode || Boolean(prefersReducedMotion)}
            />
            <SectionSweep
              progress={storyMode ? finalSweep : undefined}
              reduced={Boolean(prefersReducedMotion)}
            />
            <div className={styles.finalInner}>
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                The next chapter
              </p>
              <h2>Start with the work. Continue with a conversation.</h2>
              <div className={styles.finalActions}>
                <a
                  aria-label="Open Nirmal Kumar's LinkedIn profile in a new tab"
                  className={styles.primaryAction}
                  href={primaryContact.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Begin on LinkedIn
                  <ArrowUpRight aria-hidden="true" strokeWidth={1.7} />
                </a>
                <Link className={styles.textAction} href="/projects">
                  Explore selected work
                  <ArrowRight aria-hidden="true" strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
      <AnimatePresence
        initial={false}
        onExitComplete={handleFolioExitComplete}
      >
        {folioOpen ? (
          <ProfileFolio
            key="profile-folio"
            onClose={closeFolio}
            secretActive={secretActive}
          />
        ) : null}
      </AnimatePresence>
      </LayoutGroup>
    </main>
  );
}
