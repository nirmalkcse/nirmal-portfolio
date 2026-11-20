"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Segment = { text: string; highlight?: boolean };

type Testimonial = {
  id: string;
  index: string;
  name: string;
  role: string;
  href: string;
  initials: string;
  paragraphs: Segment[][];
};

const testimonials: Testimonial[] = [
  {
    id: "mohammed-fowzan",
    index: "01",
    name: "Mohammed Fowzan",
    role: "Engineering colleague",
    href: "https://www.linkedin.com/in/mohamed-fowzan-16b3ab162/",
    initials: "MF",
    paragraphs: [
      [
        { text: "Nirmal is honestly " },
        { text: "one of my favourite people to work with", highlight: true },
        {
          text: ". If any task is assigned to him, there's never any doubt it'll be handled well."
        }
      ],
      [
        { text: "He " },
        { text: "learns insanely fast", highlight: true },
        { text: ", " },
        { text: "takes complete ownership", highlight: true },
        {
          text: ", and is someone you can always count on. Having someone that dependable on the team is rare. Working with him has always made things so much easier."
        }
      ],
      [
        { text: "Looking forward to seeing all the amazing things you'll achieve!" }
      ]
    ]
  },
  {
    id: "nikola-ilic",
    index: "02",
    name: "Nikola Ilic",
    role: "Data Mozart · A1 Telekom engagement",
    href: "https://www.linkedin.com/in/nikola-ilic-data-mozart/",
    initials: "NI",
    paragraphs: [
      [
        { text: "Working with Nirmal on the A1 Telekom engagement, I found him to be " },
        { text: "technically sharp and reliable", highlight: true },
        {
          text: ". He didn't wait to be told what to do — he identified what needed to happen and moved on it. The kind of person you want on a project "
        },
        { text: "when the work actually matters", highlight: true },
        { text: "." }
      ]
    ]
  }
];

const marqueePhrases = [
  "Takes complete ownership",
  "Learns insanely fast",
  "Technically sharp",
  "Never any doubt",
  "Someone you can count on",
  "Moves on what matters",
  "Reliable"
];

const AUTO_ADVANCE_MS = 9000;

function HighlightedParagraph({
  segments,
  delay
}: {
  segments: Segment[];
  delay: number;
}) {
  return (
    <p>
      {segments.map((segment, index) =>
        segment.highlight ? (
          <span className="relative" key={index}>
            <motion.span
              aria-hidden="true"
              className="absolute -inset-x-[0.16em] bottom-[0.04em] top-[0.14em] origin-left -rotate-[0.3deg] rounded-[0.3em] bg-[#e2ae79]/[0.32]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
            />
            <span className="relative text-[#211c18]">{segment.text}</span>
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </p>
  );
}

export function OnTheRecord() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = testimonials[activeIndex];
  const autoAdvance = !isPaused && !reducedMotion && testimonials.length > 1;

  // Quiet rotation: move to the next note after a long beat, hold still
  // whenever the reader's cursor is anywhere near the words.
  useEffect(() => {
    if (!autoAdvance) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [autoAdvance, activeIndex]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf8f2] pb-28 pt-36 sm:pt-40">
      {/* Ambient warmth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] top-[6%] h-[52vw] w-[52vw] rounded-full bg-gradient-to-br from-[#f0e6d8] to-[#e6d5c0] opacity-60 blur-[110px]" />
        <div className="absolute -right-[14%] bottom-[4%] h-[56vw] w-[56vw] rounded-full bg-gradient-to-tr from-[#f4ece3] to-[#dfcbb3] opacity-50 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        {/* Header */}
        <motion.header
          className="text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 flex items-center justify-center gap-3 font-mono text-[8px] font-semibold uppercase tracking-[0.28em] text-[#8d7c6d] sm:text-[10px]">
            <span>04</span>
            <span aria-hidden="true" className="h-px w-8 bg-[#9b7357]/60" />
            <span>Working references</span>
          </div>

          <h1 className="editorial-title editorial-title--display">
            On the
            <br />
            <em>Record</em>
            <span className="editorial-accent">.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-[#655a51] sm:text-base">
            Testimony from people I&apos;ve shipped with — names attached.
          </p>
        </motion.header>

        {/* Pull-quote marquee */}
        <motion.div
          aria-hidden="true"
          className="relative mt-14 overflow-hidden border-y border-[#8d7968]/[0.16] py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
        >
          <style>{`
            @keyframes on-record-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            .on-record-track { animation: on-record-marquee 36s linear infinite; }
            .on-record-track:hover { animation-play-state: paused; }
            @media (prefers-reduced-motion: reduce) { .on-record-track { animation: none; } }
          `}</style>
          <div className="on-record-track flex w-max items-center gap-8 pr-8">
            {[...marqueePhrases, ...marqueePhrases].map((phrase, index) => (
              <span
                className="flex items-center gap-8 whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-[#8a6c53] sm:text-[10px]"
                key={index}
              >
                {phrase}
                <span className="text-[#9a5637]/60">◆</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* The record: index on the left, the open spread on the right */}
        <motion.section
          aria-label="Testimonials"
          className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-[0.34fr_1px_0.66fr] lg:gap-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
        >
          {/* Index */}
          <nav aria-label="People" className="lg:sticky lg:top-36 lg:self-start">
            <p className="mb-5 font-mono text-[8px] font-semibold uppercase tracking-[0.26em] text-[#8d7c6d] sm:text-[9px]">
              Index — {testimonials.length.toString().padStart(2, "0")} entries
            </p>
            <ul className="flex gap-2 max-lg:flex-wrap lg:flex-col lg:gap-1.5">
              {testimonials.map((testimonial, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={testimonial.id}>
                    <button
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative w-full overflow-hidden rounded-xl px-4 py-3 text-left transition-colors duration-300 max-lg:border max-lg:border-[#8d7968]/20 ${
                        isActive
                          ? "bg-[#fffdf9]/80 shadow-[0_14px_30px_-22px_rgba(74,56,38,0.45)] max-lg:border-[#9b7357]/40"
                          : "hover:bg-[#fffdf9]/50"
                      }`}
                      onClick={() => setActiveIndex(index)}
                      type="button"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-[9px] font-semibold tracking-[0.14em] transition-colors duration-300 ${
                            isActive ? "text-[#9a5637]" : "text-[#a2917f]"
                          }`}
                        >
                          {testimonial.index}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block truncate text-[15px] transition-colors duration-300 sm:text-base ${
                              isActive ? "text-[#211c18]" : "text-[#7d6f61] group-hover:text-[#4a4139]"
                            }`}
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {testimonial.name}
                          </span>
                          <span className="mt-0.5 hidden font-mono text-[7px] uppercase tracking-[0.18em] text-[#93816f] lg:block">
                            {testimonial.role}
                          </span>
                        </span>
                      </span>

                      {/* Reading progress toward the next note */}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-[#8d7968]/[0.18]"
                        >
                          {autoAdvance && (
                            <motion.span
                              animate={{ scaleX: 1 }}
                              className="absolute inset-0 origin-left bg-[#9a5637]/60"
                              initial={{ scaleX: 0 }}
                              key={`${activeIndex}-progress`}
                              transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                            />
                          )}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Column rule */}
          <div aria-hidden="true" className="hidden bg-[#8d7968]/[0.18] lg:block" />

          {/* The open spread */}
          <div className="relative min-h-[380px] sm:min-h-[360px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-12 left-0 select-none text-[9rem] font-light leading-none text-[#9a5637]/[0.09] sm:-left-2 sm:text-[11rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;
            </span>

            <AnimatePresence mode="wait">
              <motion.blockquote
                animate={{ opacity: 1, y: 0 }}
                className="relative"
                exit={{ opacity: 0, y: -14, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
                initial={{ opacity: 0, y: 22 }}
                key={active.id}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="space-y-6 pt-8 text-lg font-normal leading-[1.7] tracking-[-0.012em] text-[#43392f] sm:text-xl md:text-[22px]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {active.paragraphs.map((segments, index) => (
                    <HighlightedParagraph
                      delay={0.55 + index * 0.12}
                      key={`${active.id}-${index}`}
                      segments={segments}
                    />
                  ))}
                </div>

                <footer className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-[#8d7968]/[0.18] pt-6">
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-11 place-items-center rounded-full border border-[#9b7357]/30 bg-[#fdf6ea] font-mono text-[11px] font-semibold tracking-[0.08em] text-[#9a5637] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]"
                    >
                      {active.initials}
                    </span>
                    <div>
                      <p
                        className="text-xl text-[#211c18] sm:text-2xl"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          letterSpacing: "-0.02em"
                        }}
                      >
                        {active.name}
                      </p>
                      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#85766a] sm:text-[9px]">
                        {active.role}
                      </p>
                    </div>
                  </div>

                  <a
                    className="flex items-center gap-1.5 rounded-full border border-[#9b7357]/25 px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a6c53] transition-colors duration-200 hover:border-[#9b7357]/50 hover:text-[#5f4632] sm:text-[10px]"
                    href={active.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Verified · LinkedIn
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                  </a>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Invitation slot */}
        <motion.a
          className="group mx-auto mt-20 flex w-full max-w-[560px] flex-col items-center gap-3 rounded-[2rem] border border-dashed border-[#9b7357]/35 px-8 py-10 text-center transition-colors duration-300 hover:border-[#9b7357]/60 hover:bg-[#fffdf9]/60 sm:mt-24"
          href="https://www.linkedin.com/in/nirmalkumar6/"
          rel="noreferrer"
          target="_blank"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.26em] text-[#8d7c6d] sm:text-[9px]">
            03 — Reserved for yours
          </span>
          <span
            className="text-2xl font-semibold tracking-[-0.022em] text-[#211c18] sm:text-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Worked together? Put it on record<span className="text-[#9a5637]">.</span>
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-xs font-light text-[#85766a] transition-colors duration-300 group-hover:text-[#5f4632] sm:text-sm">
            Send a note on LinkedIn
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
          </span>
        </motion.a>
      </div>
    </main>
  );
}
