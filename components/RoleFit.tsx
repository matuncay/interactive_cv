"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fitPresets, fitProfile, profile, type FitItem } from "@/content/data";
import { Section } from "./ui";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function detect(text: string): string[] {
  const t = ` ${text.toLowerCase()} `;
  return fitProfile.filter((f) => f.aliases.some((a) => new RegExp(`(^|[^a-z0-9])${esc(a)}(?=[^a-z0-9]|$)`).test(t))).map((f) => f.id);
}

function verdict(score: number) {
  if (score >= 80) return { label: "Strong fit", color: "#22C55E" };
  if (score >= 60) return { label: "Good fit", color: "#00D4FF" };
  if (score >= 40) return { label: "Stretch role", color: "#F59E0B" };
  return { label: "Growth opportunity", color: "#A1A1AA" };
}

function Ring({ score }: { score: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const c = animate(shown, score, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);
  const R = 70, C = 2 * Math.PI * R, v = verdict(score);
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <defs><linearGradient id="ring"><stop offset="0" stopColor="#00D4FF" /><stop offset="1" stopColor="#7B61FF" /></linearGradient></defs>
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle cx="90" cy="90" r={R} fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - score / 100) }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-mono text-4xl font-semibold">{shown}<span className="text-lg text-muted">%</span></p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider" style={{ color: v.color }}>{v.label}</p>
        </div>
      </div>
    </div>
  );
}

export default function RoleFit() {
  const [selected, setSelected] = useState<string[]>(fitPresets[0].ids);
  const [text, setText] = useState("");
  const [detected, setDetected] = useState<number | null>(null);

  const items = useMemo(() => fitProfile.filter((f) => selected.includes(f.id)), [selected]);
  const score = items.length ? Math.round((items.reduce((s, f) => s + Math.min(f.level, 5), 0) / (items.length * 5)) * 100) : 0;
  const groups: [string, FitItem[], string][] = [
    ["Core strengths", items.filter((f) => f.level >= 4), "text-ok"],
    ["Solid experience", items.filter((f) => f.level === 3), "text-accent"],
    ["Growing into", items.filter((f) => f.level <= 2), "text-warn"],
  ];

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const analyze = () => { const ids = detect(text); setDetected(ids.length); if (ids.length) setSelected(ids); };

  const mail = `mailto:${profile.email}?subject=${encodeURIComponent(`Role fit ${score}% — let's talk`)}&body=${encodeURIComponent(
    `Hi Mustafa,\n\nI ran your role-fit check (${score}%) for a role needing:\n${items.map((i) => `- ${i.label}`).join("\n")}\n\nLet's talk.\n`)}`;

  return (
    <Section id="fit" component="RoleFit" eyebrow="∴ / Fit check" title={<>Don&apos;t read my CV. <span className="text-gradient">Query it.</span></>}
      intro="Pick what your role needs — or paste a job description — and see an honest match, including where I'm still growing.">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            {fitPresets.map((p) => (
              <button key={p.label} onClick={() => { setSelected(p.ids); setDetected(null); }}
                className="rounded-lg border border-line bg-bg/60 px-3 py-1.5 font-mono text-[11px] text-muted hover:border-accent/50 hover:text-fg">
                preset: {p.label}
              </button>
            ))}
            <button onClick={() => setSelected([])} className="rounded-lg px-3 py-1.5 font-mono text-[11px] text-dim hover:text-fg">clear</button>
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-dim">Requirements ({selected.length})</p>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Role requirements">
            {fitProfile.map((f) => {
              const on = selected.includes(f.id);
              return (
                <motion.button key={f.id} layout onClick={() => toggle(f.id)} aria-pressed={on}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${on ? "border-accent/60 bg-accent/10 text-fg" : "border-line text-muted hover:text-fg"}`}>
                  {on && <span aria-hidden className="mr-1 text-accent">✓</span>}{f.label}
                </motion.button>
              );
            })}
          </div>

          <label htmlFor="jd" className="mt-8 block font-mono text-[11px] uppercase tracking-wider text-dim">…or paste a job description</label>
          <textarea id="jd" value={text} onChange={(e) => setText(e.target.value)} rows={4}
            placeholder="e.g. We're looking for a Senior Full Stack Engineer with Node.js, TypeScript, PostgreSQL, Docker and Scrum experience…"
            className="mt-3 w-full resize-none rounded-xl border border-line bg-bg/70 p-4 text-sm text-fg placeholder:text-dim focus:border-accent/60 focus:outline-none" />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={analyze} disabled={!text.trim()}
              className="rounded-[10px] bg-fg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-30">Analyze →</button>
            <AnimatePresence>
              {detected !== null && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="font-mono text-xs text-muted" aria-live="polite">
                  {detected ? `${detected} requirements detected` : "no known requirements detected"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8" aria-live="polite">
          {items.length ? (
            <>
              <Ring score={score} />
              <div className="mt-8 space-y-5">
                {groups.map(([title, list, color]) => list.length > 0 && (
                  <div key={title}>
                    <p className={`font-mono text-[11px] uppercase tracking-wider ${color}`}>{title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {list.map((f) => (
                        <motion.li key={f.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between gap-3 text-sm">
                          <span>{f.label}</span>
                          <span className="flex items-center gap-2">
                            <span className="hidden text-xs text-dim sm:inline">{f.note}</span>
                            <span className="flex gap-0.5" aria-label={`${f.level} of 5`}>
                              {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1.5 w-2.5 rounded-sm ${n <= f.level ? "bg-accent" : "bg-raised"}`} />)}
                            </span>
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <a href={mail} className="mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] border border-accent/40 bg-accent/10 py-3 text-sm text-fg transition-colors hover:bg-accent/20">
                Discuss this role <span aria-hidden>→</span>
              </a>
              <p className="mt-3 text-center font-mono text-[10px] text-dim">self-assessment · verify it in an interview</p>
            </>
          ) : <p className="py-20 text-center text-sm text-muted">Select requirements to calculate a match.</p>}
        </div>
      </div>
    </Section>
  );
}
