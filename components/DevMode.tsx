"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { labProjects } from "@/content/data";
import { Section } from "./ui";

type Ctx = { enabled: boolean; setEnabled: (v: boolean) => void };
const DevCtx = createContext<Ctx>({ enabled: false, setEnabled: () => {} });
export const useDevMode = () => useContext(DevCtx);

const SECRET = "letsgo";

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    document.documentElement.dataset.devmode = String(v);
    try { localStorage.setItem("devmode", String(v)); } catch {}
    setToast(v ? "DEVELOPER MODE ENABLED — let's go." : "Developer mode disabled.");
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem("devmode") === "true") { setEnabledState(true); document.documentElement.dataset.devmode = "true"; }
    } catch {}
    console.log(
      "%c MT %c Looking under the hood? Type `letsgo` anywhere on the page.",
      "background:linear-gradient(135deg,#00D4FF,#7B61FF);color:#000;font-weight:700;padding:4px 6px;border-radius:4px",
      "color:#A1A1AA",
    );
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable='true']")) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) { buffer = ""; setEnabled(document.documentElement.dataset.devmode !== "true"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setEnabled]);

  return (
    <DevCtx.Provider value={{ enabled, setEnabled }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="glass fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-xl px-4 py-3 font-mono text-xs text-ok">{toast}</motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {enabled && (
          <>
            <motion.div key="flash" aria-hidden className="pointer-events-none fixed inset-0 z-[95] bg-ok/10" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} />
            <StatsHUD key="hud" onExit={() => setEnabled(false)} />
          </>
        )}
      </AnimatePresence>
    </DevCtx.Provider>
  );
}

function StatsHUD({ onExit }: { onExit: () => void }) {
  const [fps, setFps] = useState(0);
  const [nodes, setNodes] = useState(0);
  useEffect(() => {
    let frames = 0, last = performance.now(), raf = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last >= 1000) { setFps(frames); frames = 0; last = t; setNodes(document.getElementsByTagName("*").length); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const rows: [string, string | number][] = [["fps", fps], ["dom nodes", nodes], ["build", process.env.NEXT_PUBLIC_BUILD_SHA ?? "local"], ["render", "SSG + RSC"], ["particles", "three.js · CPU morph"]];
  return (
    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      aria-label="Developer statistics" className="glass fixed right-4 bottom-4 z-[80] w-60 rounded-xl p-4 font-mono text-[11px]">
      <p className="mb-2 text-ok">● dev mode</p>
      <dl className="space-y-1">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt className="text-dim">{k}</dt><dd className="text-fg">{v}</dd></div>)}</dl>
      <button onClick={onExit} className="mt-3 w-full rounded-md border border-line py-1 text-muted hover:text-fg">exit</button>
    </motion.aside>
  );
}

const sequence = ["Browser", "Next.js Edge", "API", "Service", "PostgreSQL"];

export function DevLab() {
  const { enabled } = useDevMode();
  if (!enabled) return null;
  return (
    <Section id="lab" component="DevLab" eyebrow="∞ / Developer Mode" title={<>The <span className="text-gradient">lab.</span></>}
      intro="Experimental projects, deeper diagrams and the architecture of this site.">
      <div className="grid gap-5 md:grid-cols-3">
        {labProjects.map((p) => (
          <div key={p.name} className="card border-glow p-6">
            <p className="font-mono text-[11px] text-ok">{p.tag}</p>
            <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
            <p className="mt-2 text-sm text-muted">{p.desc}</p>
          </div>
        ))}
      </div>
      <div className="card mt-6 overflow-x-auto p-6">
        <p className="eyebrow">Sequence · GET /api/policy/:id</p>
        <div className="mt-6 grid min-w-[640px] grid-cols-5 gap-2 text-center font-mono text-xs">
          {sequence.map((s) => <div key={s} className="rounded-md border border-line bg-bg py-2 text-muted">{s}</div>)}
        </div>
        <ol className="relative mt-4 min-w-[640px] space-y-3 font-mono text-[11px]">
          {[["0", "1", "request"], ["1", "2", "forward + auth"], ["2", "3", "validate & map"], ["3", "4", "SELECT … WHERE id=$1"], ["4", "0", "200 OK · 42ms"]].map(([a, b, label], i) => {
            const from = Number(a), to = Number(b);
            const left = Math.min(from, to) * 20 + 10, width = Math.abs(to - from) * 20;
            return (
              <li key={i} className="relative h-6">
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.25, duration: 0.4 }}
                  className={`absolute top-3 h-px ${to < from ? "origin-right bg-violet" : "origin-left bg-ok"}`} style={{ left: `${left}%`, width: `${width}%` }} />
                <span className="absolute top-0 text-dim" style={{ left: `${left + 1}%` }}>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
