"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "./ui";
import { profile } from "@/content/data";

const stack = ["Node.js", "TypeScript", "React", "Angular", "PostgreSQL", "Docker", "Kubernetes", "REST APIs", "Python", "Java", "Jenkins", "Scrum · SAFe"];

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 800], [0, 240]);
  const textY = useTransform(scrollY, [0, 800], [0, -100]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const words = profile.headline.split(" ");

  return (
    <section id="top" data-component="Hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
      <motion.div aria-hidden style={reduce ? undefined : { y: gridY }} className="absolute inset-0"><div className="hero-grid" /></motion.div>
      <div aria-hidden className="aurora absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-accent/15 blur-[120px]" />
      <div aria-hidden className="aurora-2 absolute -right-20 bottom-0 h-[520px] w-[520px] rounded-full bg-violet/20 blur-[140px]" />

      <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs text-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" /><span className="relative h-2 w-2 rounded-full bg-ok" /></span>
          {profile.name} · {profile.location}
        </motion.p>

        <h1 className="mt-8 max-w-4xl text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className={`inline-block ${w.startsWith("production") ? "text-gradient" : ""}`}
                initial={{ y: "110%", rotate: 4 }} animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 max-w-2xl font-mono text-sm text-muted md:text-base">
          {profile.tagline}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3">
          <MagneticButton href="#journey">Explore My Journey <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></MagneticButton>
          <MagneticButton href="#projects" variant="secondary">View Projects</MagneticButton>
          <MagneticButton href="#contact" variant="ghost">Contact Me <span aria-hidden>↗</span></MagneticButton>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="mt-14 hidden items-center gap-2 font-mono text-[11px] text-dim md:flex">
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>↓</motion.span>
          scroll — the particles follow the lifecycle · move your cursor through them
        </motion.p>
      </motion.div>

      <div aria-hidden className="absolute inset-x-0 bottom-8 overflow-hidden opacity-40 [mask-image:linear-gradient(90deg,transparent,#000_20%,#000_80%,transparent)]">
        <div className="marquee flex w-max gap-10 font-mono text-xs uppercase tracking-widest text-muted">
          {[...stack, ...stack].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>
      <span className="sr-only">Tech stack: {stack.join(", ")}</span>
    </section>
  );
}
