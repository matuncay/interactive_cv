"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { phases } from "@/content/data";
import { useDevMode } from "./DevMode";

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const [active, setActive] = useState(-1);
  const { enabled } = useDevMode();

  useEffect(() => {
    const els = phases.map((p) => document.getElementById(p.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(phases.findIndex((p) => p.id === e.target.id)); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="glass fixed inset-x-0 top-0 z-50 border-x-0 border-t-0">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-accent to-violet text-[11px] text-black">MT</span>
          <span className="hidden sm:inline">mustafa.tuncay</span>
          {enabled && <span className="rounded bg-ok/15 px-1.5 py-0.5 text-[10px] text-ok">DEV</span>}
        </a>

        <ol className="hidden items-center gap-1 lg:flex">
          {phases.map((p, i) => {
            const state = i < active ? "done" : i === active ? "active" : "todo";
            return (
              <li key={p.id} className="relative">
                <a href={`#${p.id}`} aria-current={state === "active" ? "step" : undefined}
                  className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    state === "active" ? "text-fg" : state === "done" ? "text-muted hover:text-fg" : "text-dim hover:text-muted"}`}>
                  {state === "active" && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-md bg-raised" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                  <span aria-hidden className={`relative ${state === "done" ? "text-ok" : state === "active" ? "text-accent" : ""}`}>
                    {state === "done" ? "✓" : state === "active" ? "●" : "○"}
                  </span>
                  <span className="relative">{p.label}</span>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-2">
          <a href="#fit" className="hidden rounded-[10px] px-3 py-2 font-mono text-xs text-muted transition-colors hover:text-fg md:inline">fit.check()</a>
          <a href="#contact" className="rounded-[10px] border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-accent/60">Contact</a>
        </div>
      </nav>
      <motion.div aria-hidden style={{ scaleX: width }} className="h-[2px] origin-left bg-gradient-to-r from-accent to-violet" />
    </header>
  );
}
