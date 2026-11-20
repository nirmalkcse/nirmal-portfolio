"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Project } from "@/data";
import { certifications } from "@/data/certifications";
import { brickbuilderRecognition } from "@/data/recognition";
import { RecognitionSeal } from "@/components/signature/recognition-seal";
import { ProjectMotif } from "@/components/work/work-motifs";
import {
  getAdjacentProjects,
  getArchitectureStages,
  getEvidenceConfidenceLabel,
  getEvidenceStatusLabel,
  getEvidenceTypeLabel,
  getOrderedProjects,
  getProjectHeroStats,
  getProjectStatusLabel
} from "@/components/project-case-file/project-case-file-model";
import { getCaseTheme } from "./case-themes";
import styles from "./case-study.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

/* Projects list related credentials by slug; show the certificate's name. */
const credentialTitle = (reference: string) =>
  certifications.find((credential) => credential.slug === reference)?.title ??
  reference.replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
const pad = (value: number) => String(value).padStart(2, "0");

type Chapter = { id: string; label: string };

function chaptersFor(project: Project): Chapter[] {
  const chapters: Chapter[] = [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How it works" },
    { id: "decisions", label: "Decisions" },
    { id: "proof", label: "Proof" },
    { id: "context", label: "Context" }
  ];
  if (project.relatedSkills.length || project.relatedCredentials.length) {
    chapters.push({ id: "related", label: "Related" });
  }
  return chapters;
}

/* ─── Small pieces ─────────────────────────────────────────────────────── */

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      transition={{ duration: 0.8, delay, ease }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

function ChapterHead({ index, title, tail }: { index: number; title: string; tail?: string }) {
  return (
    <Reveal className={styles.chapterHead}>
      <span className={styles.chapterIndex}>{pad(index)}</span>
      <h2 className={styles.chapterTitle}>
        {title} {tail ? <span className={styles.tail}>{tail}</span> : null}
      </h2>
    </Reveal>
  );
}

function Visual({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div className={styles.visual} ref={ref}>
      <div className={styles.visualArt}>
        <ProjectMotif active={inView} slug={slug} />
      </div>
    </div>
  );
}

/** "On this page": a quiet sticky index that follows the reader. */
function ChapterIndex({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav aria-label="On this page" className={styles.index}>
      <p className={styles.indexLabel}>On this page</p>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a aria-current={active === chapter.id ? "true" : undefined} className={styles.indexLink} href={`#${chapter.id}`}>
              <span className={styles.indexNumber}>{pad(index + 1)}</span>
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export function CaseStudy({ project }: { project: Project }) {
  const theme = getCaseTheme(project.slug);
  const ordered = getOrderedProjects("balanced");
  const position = ordered.findIndex((candidate) => candidate.slug === project.slug);
  const stages = getArchitectureStages(project);
  const facts = getProjectHeroStats(project);
  const { next, previous } = getAdjacentProjects(project.slug);
  const nextTheme = next ? getCaseTheme(next.slug) : null;
  const chapters = chaptersFor(project);
  const reduce = useReducedMotion();
  const isICore = project.slug === brickbuilderRecognition.projectSlug;

  const style = {
    "--case-accent": theme.accent,
    "--case-wash": theme.wash,
    // The hairline drawings read these.
    "--ink": "#1d1a17",
    "--motif-accent": theme.accent,
    "--motif-fill": "#fffdf9"
  } as CSSProperties;

  return (
    <main className={styles.page} id="main-content" style={style} tabIndex={-1}>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <Link className={styles.back} href="/projects">
            <span aria-hidden="true">‹</span> All work
          </Link>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className={styles.meta}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, ease }}
          >
            <span>
              Case study {pad(position + 1)} of {pad(ordered.length)}
            </span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{getProjectStatusLabel(project.status)}</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span>{project.dates.replace(" - ", " – ")}</span>
          </motion.p>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className={styles.kicker}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
          >
            {project.title}
          </motion.p>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className={styles.title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            {theme.name}. <span className={styles.tail}>{theme.tail}</span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className={styles.summary}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            transition={{ duration: 0.9, delay: 0.18, ease }}
          >
            {project.summary}
          </motion.p>

          {isICore ? (
            <motion.div
              animate={{ opacity: 1 }}
              initial={reduce ? false : { opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease }}
            >
              <RecognitionSeal className={styles.seal} />
            </motion.div>
          ) : null}
        </div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className={styles.heroVisual}
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.1, delay: 0.12, ease }}
        >
          <Visual slug={project.slug} />
        </motion.div>
      </header>

      {/* ─── Facts ────────────────────────────────────────────────────── */}
      <section aria-label="At a glance" className={styles.facts}>
        <dl>
          {facts.map((fact, index) => (
            <Reveal className={styles.fact} delay={index * 0.06} key={fact.label}>
              <dt>{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
              <dd className={styles.factDetail}>{fact.detail}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <div className={styles.body}>
        <aside className={styles.indexRail}>
          <ChapterIndex chapters={chapters} />
        </aside>

        <div className={styles.chapters}>
          {/* 01 Overview */}
          <section className={styles.chapter} id="overview">
            <ChapterHead index={1} tail="What it took, and what it changed." title="The brief." />
            <div className={styles.brief}>
              {[
                ["Problem", project.problem],
                ["System", project.architecture],
                ["Impact", project.impact]
              ].map(([label, text], index) => (
                <Reveal className={styles.briefItem} delay={index * 0.08} key={label}>
                  <h3>{label}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 02 How it works */}
          <section className={styles.chapter} id="how-it-works">
            <ChapterHead index={2} tail={`In ${stages.length} stages.`} title="How it works." />
            <ol className={styles.stages}>
              {stages.map((stage, index) => (
                <Reveal className={styles.stage} delay={index * 0.07} key={stage.label}>
                  <span className={styles.stageNumber}>{pad(index + 1)}</span>
                  <div>
                    <h3 className={styles.stageTitle}>{stage.label}</h3>
                    <p className={styles.stageDetail}>{stage.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </section>

          {/* 03 Decisions */}
          <section className={styles.chapter} id="decisions">
            <ChapterHead index={3} tail="And what it runs on." title="What shaped the build." />
            <div className={styles.decisions}>
              <ul className={styles.decisionList}>
                {project.decisions.map((decision, index) => (
                  <Reveal className={styles.decision} delay={index * 0.06} key={decision}>
                    <span aria-hidden="true" className={styles.decisionMark} />
                    <p>{decision}</p>
                  </Reveal>
                ))}
              </ul>
              <Reveal className={styles.stack} delay={0.1}>
                <h3 className={styles.smallHead}>Built with</h3>
                <ul>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* 04 Proof */}
          <section className={styles.chapter} id="proof">
            <ChapterHead index={4} tail="What's public, and what's on its way." title="Proof." />
            <div className={styles.proof}>
              <Reveal className={styles.proofGroup}>
                <h3 className={styles.smallHead}>References</h3>
                <ul>
                  {project.links.map((link) => (
                    <li className={styles.proofRow} key={link.label}>
                      <span className={styles.proofText}>
                        <span className={styles.proofName}>{link.label}</span>
                        <span className={styles.proofNote}>
                          {link.note ?? (link.url ? "Public reference." : "Reference to add after public review.")}
                        </span>
                      </span>
                      {link.url ? (
                        <a className={styles.proofLink} href={link.url} rel="noreferrer noopener" target="_blank">
                          Open <span aria-hidden="true">↗</span>
                          <span className={styles.srOnly}> {link.label} (opens in a new tab)</span>
                        </a>
                      ) : (
                        <span className={styles.pill} data-state="pending">
                          Pending
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className={styles.proofGroup} delay={0.08}>
                <h3 className={styles.smallHead}>Visual artifacts</h3>
                {project.media.length ? (
                  <ul>
                    {project.media.map((asset) => (
                      <li className={styles.proofRow} key={`${asset.label}-${asset.type}`}>
                        <span className={styles.proofText}>
                          <span className={styles.proofName}>{asset.label}</span>
                          <span className={styles.proofNote}>{asset.type.replace("-", " ")}</span>
                        </span>
                        <span className={styles.pill} data-state={asset.status === "available" ? "live" : "pending"}>
                          {asset.status === "available" ? "Available" : "To approve"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.proofNote}>Visual artifacts to add after public review.</p>
                )}
              </Reveal>
            </div>

            {project.evidenceNotes?.length ? (
              <div className={styles.notes}>
                {project.evidenceNotes.map((note, index) => (
                  <Reveal className={styles.note} delay={index * 0.07} key={note.claim}>
                    <p className={styles.noteMeta}>
                      <span className={styles.pill} data-state="accent">
                        {getEvidenceStatusLabel(note.publicStatus)}
                      </span>
                      <span>{getEvidenceTypeLabel(note.evidenceType)}</span>
                    </p>
                    <h3 className={styles.noteClaim}>{note.claim}</h3>
                    <dl className={styles.noteFacts}>
                      <div>
                        <dt>Source</dt>
                        <dd>{note.source}</dd>
                      </div>
                      <div>
                        <dt>Confidence</dt>
                        <dd>{getEvidenceConfidenceLabel(note.confidence)}</dd>
                      </div>
                      <div>
                        <dt>Public note</dt>
                        <dd>{note.confidentialityBoundary}</dd>
                      </div>
                    </dl>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </section>

          {/* 05 Context */}
          <section className={styles.chapter} id="context">
            <ChapterHead index={5} tail="And what stays private." title="Tradeoffs." />
            <div className={styles.context}>
              <Reveal className={styles.contextItem}>
                <h3 className={styles.smallHead}>The tradeoff</h3>
                <p>{project.tradeoffs}</p>
              </Reveal>
              <Reveal className={styles.contextItem} delay={0.08}>
                <h3 className={styles.smallHead}>Kept anonymous</h3>
                <p>{project.publicSensitivity}</p>
              </Reveal>
            </div>
          </section>

          {/* 06 Related */}
          {project.relatedSkills.length || project.relatedCredentials.length ? (
            <section className={styles.chapter} id="related">
              <ChapterHead index={6} tail="Behind this work." title="Skills and credentials." />
              <div className={styles.related}>
                {project.relatedSkills.length ? (
                  <Reveal className={styles.relatedGroup}>
                    <h3 className={styles.smallHead}>Skills</h3>
                    <ul className={styles.chips}>
                      {project.relatedSkills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}
                {project.relatedCredentials.length ? (
                  <Reveal className={styles.relatedGroup} delay={0.08}>
                    <h3 className={styles.smallHead}>Credentials</h3>
                    <ul className={styles.chips}>
                      {project.relatedCredentials.map((credential) => (
                        <li key={credential}>{credentialTitle(credential)}</li>
                      ))}
                    </ul>
                    <Link className={styles.inlineLink} href="/certifications">
                      View all credentials <span aria-hidden="true">›</span>
                    </Link>
                  </Reveal>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {/* ─── Next ─────────────────────────────────────────────────────── */}
      {next && nextTheme ? (
        <section aria-label="Next case study" className={styles.next}>
          <Link
            className={styles.nextCard}
            href={`/projects/${next.slug}`}
            style={
              {
                "--next-accent": nextTheme.accent,
                "--next-wash": nextTheme.wash,
                "--motif-accent": nextTheme.accent
              } as CSSProperties
            }
          >
            <span className={styles.nextCopy}>
              <span className={styles.nextLabel}>Next case study</span>
              <span className={styles.nextTitle}>
                {nextTheme.name}. <span className={styles.tail}>{nextTheme.tail}</span>
              </span>
              <span className={styles.nextCta}>
                Read it <span aria-hidden="true">›</span>
              </span>
            </span>
            <span aria-hidden="true" className={styles.nextArt}>
              <ProjectMotif active slug={next.slug} />
            </span>
          </Link>

          <nav aria-label="More from the work" className={styles.moreLinks}>
            {previous ? (
              <Link href={`/projects/${previous.slug}`}>
                <span aria-hidden="true">‹</span> {getCaseTheme(previous.slug).name}
              </Link>
            ) : null}
            <Link href="/projects">All work</Link>
            <Link href="/proof">Skills</Link>
            <Link href="/resume">Résumé</Link>
          </nav>
        </section>
      ) : null}
    </main>
  );
}
