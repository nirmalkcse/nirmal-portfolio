import Link from "next/link";
import clsx from "clsx";
import { brickbuilderRecognition as recognition } from "@/data/recognition";
import styles from "./recognition-seal.module.css";

/* A scalloped seal with a check, drawn once at module load: twenty-four
   alternating points smoothed by a round line join. Deliberately generic, so
   it reads as "accredited" without borrowing anyone's logo. */
const SEAL_PATH = (() => {
  const points: string[] = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const radius = i % 2 === 0 ? 11 : 9.6;
    points.push(`${(12 + Math.cos(angle) * radius).toFixed(2)} ${(12 + Math.sin(angle) * radius).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
})();

export function SealMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={clsx(styles.mark, className)} viewBox="0 0 24 24">
      <path className={styles.markFill} d={SEAL_PATH} />
      <path className={styles.markCheck} d="M8.1 12.3l2.6 2.6 5.2-5.6" />
    </svg>
  );
}

type Tone = "light" | "dark";

/**
 * One line: the seal, the accreditation, and the fact of who built it.
 * Used wherever iCORE is introduced.
 */
export function RecognitionSeal({
  tone = "light",
  className
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <p className={clsx(styles.seal, className)} data-tone={tone}>
      <SealMark />
      <span className={styles.sealName}>{recognition.name}</span>
      <span aria-hidden="true" className={styles.sealDot} />
      <span className={styles.sealRole}>Built end to end</span>
    </p>
  );
}

/**
 * The full statement, for the iCORE case study and the Credentials page.
 */
export function RecognitionPanel({
  tone = "light",
  showCaseLink = false,
  showScope = false,
  className
}: {
  tone?: Tone;
  showCaseLink?: boolean;
  showScope?: boolean;
  className?: string;
}) {
  return (
    <section
      aria-label={recognition.title}
      className={clsx(styles.panel, className)}
      data-tone={tone}
    >
      <SealMark className={styles.panelMark} />
      <div className={styles.panelCopy}>
        <p className={styles.panelEyebrow}>Product recognition</p>
        <h2 className={styles.panelTitle}>{recognition.title}</h2>
        <p className={styles.panelLine}>
          {recognition.productName}. {recognition.line} {recognition.role}
        </p>
        {showScope ? <p className={styles.panelScope}>{recognition.scope}</p> : null}
      </div>
      {showCaseLink ? (
        <Link className={styles.panelLink} href={`/projects/${recognition.projectSlug}`}>
          Read the iCORE case study <span aria-hidden="true">›</span>
        </Link>
      ) : null}
    </section>
  );
}
