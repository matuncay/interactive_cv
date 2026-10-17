"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { architectureLayers } from "@/content/data";
import { Section } from "./ui";

type Layer = { id: string; name: string; tech: string; decision: string };

const modes: Record<string, { label: string; layers: readonly Layer[]; latency: string[]; ack: boolean }> = {
  request: { label: "Request flow", layers: architectureLayers, latency: ["8ms", "3ms", "12ms", "—"], ack: true },
  event: {
    label: "Event flow", ack: false, latency: ["async", "queued", "async", "—"],
    layers: [
      { id: "src", name: "Producer", tech: "Frontend / partner system", decision: "Producers never wait — the user gets a fast acknowledgement." },
      { id: "gw", name: "API Gateway", tech: "Node.js · Validation", decision: "Validate early, reject fast; only clean events enter the system." },
      { id: "q", name: "Queue / Transfer", tech: "Messaging · SFTP jobs", decision: "Decouples systems so a slow consumer can't block the platform." },
      { id: "wk", name: "Workers", tech: "Python · Node.js", decision: "Idempotent workers make retries safe." },
      { id: "st", name: "Store", tech: "PostgreSQL", decision: "Persist the outcome and an audit trail for compliance." },
    ],
  },
  deploy: {
    label: "Deploy flow", ack: false, latency: ["push", "build", "image", "rollout"],
    layers: [
      { id: "git", name: "Git", tech: "GitHub · Pull requests", decision: "Small reviewed changes reduce release risk." },
      { id: "ci", name: "CI Pipeline", tech: "Jenkins · Tests · Lint", decision: "Quality gates are automated, not optional." },
      { id: "img", name: "Container", tech: "Docker image", decision: "Build once, promote the same artifact through all stages." },
      { id: "k8s", name: "Kubernetes", tech: "Rolling deployment", decision: "Zero-downtime rollouts with health checks." },
      { id: "ops", name: "Operate", tech: "Monitoring · Change mgmt", decision: "Incidents feed back into the backlog — the loop closes." },
    ],
  },
};

export default function ArchitectureFlow() {
  const [mode, setMode] = useState<string>("request");
  const [active, setActive] = useState<string>(architectureLayers[0].id);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const m = modes[mode];
  const activeLayer = m.layers.find((l) => l.id === active) ?? m.layers[0];

  return (
    <Section id="architecture" component="ArchitectureFlow" eyebrow="03 / Design" title={<>Architecture is a <span className="text-gradient">series of decisions.</span></>}
      intro="Every layer exists for a reason. Watch the data move — then select a layer to see the trade-off behind it.">
      <div role="tablist" aria-label="Flow type" className="mb-8 inline-flex rounded-xl border border-line bg-card/70 p-1 backdrop-blur">
        {Object.entries(modes).map(([k, v]) => (
          <button key={k} role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setActive(modes[k].layers[0].id); }}
            className="relative rounded-lg px-4 py-2 font-mono text-xs text-muted aria-selected:text-fg">
            {mode === k && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-lg bg-raised" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
            <span className="relative">{v.label}</span>
          </button>
        ))}
      </div>

      <div ref={ref} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ol className="relative mx-auto w-full max-w-xl">
          {m.layers.map((l, i) => (
            <li key={`${mode}-${l.id}`}>
              <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.5 }}
                onClick={() => setActive(l.id)} aria-pressed={active === l.id} data-active={active === l.id}
                className="card border-glow flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-dim">L{i + 1}</span>
                  <span className="font-medium">{l.name}</span>
                </span>
                <span className="font-mono text-xs text-muted">{l.tech}</span>
              </motion.button>
              {i < m.layers.length - 1 && (
                <div aria-hidden className="relative mx-auto flex h-12 w-px items-center justify-center bg-line">
                  {inView && !reduce && (
                    <>
                      <motion.span className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_#00D4FF]"
                        animate={{ top: ["-4px", "44px"], opacity: [0, 1, 0] }} transition={{ duration: 0.4, delay: i * 0.4, repeat: Infinity, repeatDelay: 2 }} />
                      {m.ack && (
                        <motion.span className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-violet shadow-[0_0_10px_#7B61FF]"
                          animate={{ top: ["44px", "-4px"], opacity: [0, 1, 0] }} transition={{ duration: 0.4, delay: 1.6 + (m.layers.length - 2 - i) * 0.25, repeat: Infinity, repeatDelay: 2 }} />
                      )}
                    </>
                  )}
                  <span className="absolute left-4 font-mono text-[10px] text-dim">{m.latency[i]}</span>
                </div>
              )}
            </li>
          ))}
        </ol>

        <aside aria-live="polite" className="glass h-fit rounded-2xl p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Design decision</p>
          <AnimatePresence mode="wait">
            <motion.div key={`${mode}-${activeLayer.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <h3 className="mt-3 text-xl font-semibold">{activeLayer.name}</h3>
              <p className="mt-1 font-mono text-xs text-muted">{activeLayer.tech}</p>
              <p className="mt-4 text-sm leading-relaxed text-fg/85">{activeLayer.decision}</p>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </Section>
  );
}
