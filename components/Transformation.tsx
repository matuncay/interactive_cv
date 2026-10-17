"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { transformation } from "@/content/data";
import { Reveal, Section } from "./ui";

export default function Transformation() {
  const [pos, setPos] = useState(50);
  return (
    <Section id="transformation" component="Transformation" eyebrow="05 / Deploy" title={<>From legacy process to <span className="text-gradient">modern solution.</span></>}
      intro="Drag the handle to compare. Transformation isn't new technology for its own sake — it's measurable business value.">
      <Reveal>
        <div className="card relative h-[420px] select-none md:h-[360px]">
          <div className="absolute inset-0 p-6 md:p-10">
            <p className="font-mono text-xs uppercase tracking-wider text-warn">Legacy process</p>
            <ul className="mt-6 space-y-3">
              {transformation.legacy.map((l) => <li key={l} className="flex items-center gap-3 text-muted"><span className="font-mono text-warn">✗</span>{l}</li>)}
            </ul>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,212,255,0.1),rgba(123,97,255,0.1))] p-6 backdrop-blur-sm md:p-10" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
            <div className="ml-auto w-fit text-right">
              <p className="font-mono text-xs uppercase tracking-wider text-accent">Modern solution</p>
              <ul className="mt-6 space-y-3">
                {transformation.modern.map((l) => <li key={l} className="flex items-center justify-end gap-3 text-fg">{l}<span className="font-mono text-ok">✓</span></li>)}
              </ul>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-accent shadow-[0_0_16px_#00D4FF]" style={{ left: `${pos}%` }}>
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="glass absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-xs text-accent">⇆</motion.div>
          </div>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Compare legacy and modern" aria-valuetext={`${pos}% legacy shown`} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
        </div>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {transformation.value.map((v, i) => (
          <Reveal key={v.label} delay={i * 0.08}>
            <div className="card p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-dim">Business value</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-fg">{v.value}</p>
              <p className="mt-1 text-sm text-muted">{v.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
