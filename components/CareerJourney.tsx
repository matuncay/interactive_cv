"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { journey } from "@/content/data";
import { Section } from "./ui";

export default function CareerJourney() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 85%", "end 45%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [lit, setLit] = useState(0);
  const [open, setOpen] = useState<string>("senior");

  useMotionValueEvent(scrollYProgress, "change", (v) => setLit(Math.round(v * (journey.length - 1))));

  const current = journey.find((m) => m.id === open)!;
  const pct = Math.round(((lit + 1) / journey.length) * 100);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : -1;
    if (next < 0 || next >= journey.length) return;
    e.preventDefault();
    setOpen(journey[next].id);
    document.getElementById(`ms-${journey[next].id}`)?.focus();
  };

  return (
    <Section id="journey" component="CareerJourney" eyebrow="01 / Discover" title={<>From first commit to <span className="text-gradient">enterprise scale.</span></>}
      intro="A career built like a product — iteratively, with every release adding capability. Select a milestone to expand it.">
      <div ref={track} className="relative">
        <div aria-hidden className="absolute left-[11px] top-2 bottom-2 w-px bg-line md:left-0 md:right-0 md:top-[11px] md:bottom-auto md:h-px md:w-auto" />
        <motion.div aria-hidden style={{ scaleY: progress }} className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent to-violet md:hidden" />
        <motion.div aria-hidden style={{ scaleX: progress }} className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-gradient-to-r from-accent to-violet shadow-[0_0_12px_#00D4FF] md:block" />

        <ol role="tablist" aria-label="Career milestones" className="relative flex flex-col gap-8 md:flex-row md:justify-between md:gap-0">
          {journey.map((m, i) => {
            const isLit = i <= lit;
            const isOpen = open === m.id;
            return (
              <li key={m.id} className="md:flex-1">
                <button id={`ms-${m.id}`} role="tab" aria-selected={isOpen} aria-controls="milestone-panel" tabIndex={isOpen ? 0 : -1}
                  onClick={() => setOpen(m.id)} onKeyDown={(e) => onKey(e, i)}
                  className="group flex items-center gap-4 text-left md:flex-col md:items-start md:gap-4">
                  <span className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full border bg-bg transition-all duration-500 ${
                    m.future ? "border-dashed" : ""} ${isLit ? "border-accent shadow-[0_0_20px_rgba(0,212,255,0.5)]" : "border-dim"}`}>
                    <span className={`h-2 w-2 rounded-full transition-colors ${isLit ? "bg-accent" : "bg-dim"}`} />
                    {isOpen && <motion.span layoutId="ms-ring" className="absolute -inset-1.5 rounded-full border border-accent/60" />}
                  </span>
                  <span>
                    <span className={`block font-mono text-[11px] uppercase tracking-wider ${isLit ? "text-accent" : "text-dim"}`}>{m.period}</span>
                    <span className={`block text-lg font-medium transition-colors ${isOpen ? "text-fg" : "text-muted group-hover:text-fg"}`}>{m.title}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-8 font-mono text-xs text-dim" aria-live="polite">career.progress = <span className="text-accent">{pct}%</span></p>

        <AnimatePresence mode="wait">
          <motion.article key={current.id} id="milestone-panel" role="tabpanel" aria-labelledby={`ms-${current.id}`}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="card border-glow mt-6 grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8" data-active="true">
            <div>
              <p className="font-mono text-xs text-muted">{current.org}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{current.title}</h3>
              <p className="mt-3 text-muted">{current.summary}</p>
            </div>
            <ul className="space-y-2.5">
              {current.highlights.map((h, i) => (
                <motion.li key={h} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex gap-3 text-sm text-fg/90"><span aria-hidden className="text-accent">▹</span>{h}</motion.li>
              ))}
            </ul>
          </motion.article>
        </AnimatePresence>
      </div>
    </Section>
  );
}
