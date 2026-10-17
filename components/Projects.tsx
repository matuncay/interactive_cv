"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/data";
import { trackSpotlight } from "@/lib/motion";
import Counter from "./Counter";
import { Section } from "./ui";

function MiniArch({ nodes, large }: { nodes: string[]; large?: boolean }) {
  return (
    <div className={`flex items-center ${large ? "gap-2" : "gap-1"}`} aria-label={`Architecture: ${nodes.join(" to ")}`}>
      {nodes.map((n, i) => (
        <div key={n} className="flex items-center gap-1">
          <span className={`rounded-md border border-line bg-bg/80 font-mono text-muted ${large ? "px-3 py-2 text-xs" : "px-1.5 py-1 text-[10px]"}`}>{n}</span>
          {i < nodes.length - 1 && (
            <span aria-hidden className="relative h-px w-4 overflow-hidden bg-line">
              <motion.span className="absolute inset-y-0 w-2 bg-accent" animate={{ x: [-8, 16] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function TiltCard({ p, i, onOpen }: { p: Project; i: number; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    trackSpotlight(e);
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <div style={{ perspective: 1000 }}>
      <motion.button layoutId={`card-${p.id}`} onClick={onOpen} onPointerMove={onMove} onPointerLeave={() => { rx.set(0); ry.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        aria-label={`Open case study: ${p.name}`} className="card border-glow group flex h-full w-full flex-col p-6 text-left">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-ok"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />LIVE</span>
          <span className="text-dim">{p.code}</span>
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.name}</h3>
        <p className="mt-1 font-mono text-xs text-muted">{p.industry}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{p.impact}</p>
        <div className="mt-6 overflow-hidden"><MiniArch nodes={p.arch} /></div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map((s) => <span key={s} className="rounded-md bg-raised px-2 py-1 font-mono text-[10px] text-muted">{s}</span>)}
        </div>
        <span className="mt-auto pt-6 font-mono text-xs text-accent opacity-70 transition-opacity group-hover:opacity-100">open case study →</span>
      </motion.button>
    </div>
  );
}

function CaseStudy({ p, onClose }: { p: Project; onClose: () => void }) {
  const [tab, setTab] = useState<"context" | "architecture" | "stack" | "results">("context");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div layoutId={`card-${p.id}`} role="dialog" aria-modal="true" aria-labelledby={`cs-${p.id}`} onClick={(e) => e.stopPropagation()}
        className="card max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-b-none !bg-card p-6 md:rounded-2xl md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted"><span className="text-ok">● LIVE</span> · {p.code} · {p.industry}</p>
            <h3 id={`cs-${p.id}`} className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{p.name}</h3>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close case study" className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted hover:text-fg">esc</button>
        </div>

        <div role="tablist" className="mt-8 flex gap-1 border-b border-line">
          {(["context", "architecture", "stack", "results"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative px-3 pb-3 font-mono text-xs capitalize text-muted aria-selected:text-fg">
              {t}
              {tab === t && <motion.span layoutId="cs-tab" className="absolute inset-x-0 -bottom-px h-px bg-accent" />}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="min-h-[180px] pt-6">
          {tab === "context" && <p className="leading-relaxed text-fg/85">{p.context}</p>}
          {tab === "architecture" && <div className="overflow-x-auto py-6"><MiniArch nodes={p.arch} large /></div>}
          {tab === "stack" && (
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 font-mono text-xs text-fg">{s}</motion.span>
              ))}
            </div>
          )}
          {tab === "results" && (
            <dl className="grid gap-4 sm:grid-cols-3">
              {p.results.map((r) => (
                <div key={r.label} className="rounded-xl border border-line bg-bg p-4">
                  <dd className="font-mono text-3xl font-semibold"><Counter value={r.value} suffix={r.suffix} /></dd>
                  <dt className="mt-1 text-xs text-muted">{r.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  return (
    <Section id="projects" component="Projects" eyebrow="04 / Build" title={<>Mission control for <span className="text-gradient">delivered work.</span></>}
      intro="Selected enterprise engagements. Client names are anonymised; outcomes are what matter.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <TiltCard key={p.id} p={p} i={i} onOpen={() => setOpen(p)} />)}
      </div>
      <AnimatePresence>{open && <CaseStudy p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Section>
  );
}
