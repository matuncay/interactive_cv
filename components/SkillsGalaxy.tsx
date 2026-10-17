"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { categoryColor, skills, type Skill, type SkillCategory } from "@/content/data";
import { Section } from "./ui";

const W = 1000, H = 640, CX = W / 2, CY = H / 2;
const categories = Object.keys(categoryColor) as SkillCategory[];

function layout() {
  const pos: Record<string, { x: number; y: number; r: number }> = {};
  categories.forEach((cat, ci) => {
    const a = (ci / categories.length) * Math.PI * 2 - Math.PI / 2;
    const cx = CX + Math.cos(a) * 330, cy = CY + Math.sin(a) * 215;
    const list = skills.filter((s) => s.category === cat);
    list.forEach((s, si) => {
      const b = a + (si - (list.length - 1) / 2) * 0.9;
      const d = list.length === 1 ? 0 : 62;
      pos[s.id] = { x: cx + Math.cos(b + Math.PI / 2) * d, y: cy + Math.sin(b + Math.PI / 2) * d * 0.8, r: 8 + s.level * 3.5 };
    });
  });
  return pos;
}

export default function SkillsGalaxy() {
  const reduce = useReducedMotion();
  const pos = useMemo(layout, []);
  const [filter, setFilter] = useState<SkillCategory | "All">("All");
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<Skill | null>(skills.find((s) => s.id === "node") ?? null);

  const focusId = hover ?? selected?.id ?? null;
  const focus = skills.find((s) => s.id === focusId);
  const edges = useMemo(() => {
    const set = new Set<string>(); const out: [string, string][] = [];
    skills.forEach((s) => s.related.forEach((r) => {
      const k = [s.id, r].sort().join("-");
      if (!set.has(k) && pos[r]) { set.add(k); out.push([s.id, r]); }
    }));
    return out;
  }, [pos]);

  const dimmed = (s: Skill) => filter !== "All" && s.category !== filter;

  return (
    <Section id="skills" component="SkillsGalaxy" eyebrow="02 / Analyze" title={<>A <span className="text-gradient">skills galaxy</span>, not a keyword list.</>}
      intro="Planet size reflects depth of experience. Hover to see connections, select to inspect.">
      <div role="toolbar" aria-label="Filter skills by category" className="mb-6 flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((c) => (
          <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs backdrop-blur transition-colors ${filter === c ? "border-accent/60 bg-accent/10 text-fg" : "border-line bg-card/40 text-muted hover:text-fg"}`}>
            {c !== "All" && <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: categoryColor[c] }} />}
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card aspect-[1000/640] w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="group" aria-label="Interactive skill galaxy">
            <defs>
              <radialGradient id="core"><stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9" /><stop offset="100%" stopColor="#7B61FF" stopOpacity="0" /></radialGradient>
            </defs>
            <ellipse cx={CX} cy={CY} rx={330} ry={215} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" />
            <ellipse cx={CX} cy={CY} rx={180} ry={118} fill="none" stroke="rgba(255,255,255,0.04)" />
            <motion.circle cx={CX} cy={CY} r={60} fill="url(#core)" animate={reduce ? undefined : { opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 4, repeat: Infinity }} />
            <circle cx={CX} cy={CY} r={22} fill="#0A0A0A" stroke="#00D4FF" strokeOpacity={0.6} />
            <text x={CX} y={CY + 48} textAnchor="middle" className="fill-muted font-mono" fontSize={12}>FULL STACK</text>

            {edges.map(([a, b]) => {
              const on = focusId && (a === focusId || b === focusId);
              return (
                <motion.line key={`${a}-${b}`} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
                  stroke={on ? "#00D4FF" : "rgba(255,255,255,0.05)"} strokeWidth={on ? 1.5 : 1}
                  initial={false} animate={{ pathLength: on ? [0, 1] : 1, opacity: on ? 0.9 : 1 }} transition={{ duration: 0.6 }} />
              );
            })}

            {skills.map((s, i) => {
              const p = pos[s.id]; const color = categoryColor[s.category];
              const isFocus = focusId === s.id;
              const related = focus?.related.includes(s.id) || s.related.includes(focusId ?? "");
              return (
                <motion.g key={s.id} role="button" tabIndex={0} aria-label={`${s.name}, ${s.category}`} aria-pressed={selected?.id === s.id}
                  style={{ cursor: "pointer", outline: "none" }}
                  animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(s.id)} onBlur={() => setHover(null)}
                  onClick={() => setSelected(s)} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(s); } }}
                  opacity={dimmed(s) ? 0.15 : focusId && !isFocus && !related ? 0.45 : 1}>
                  <motion.circle cx={p.x} cy={p.y} r={p.r} fill={color} fillOpacity={0.14} stroke={color} strokeOpacity={isFocus ? 1 : 0.5}
                    animate={{ scale: isFocus ? 1.25 : 1 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                  <circle cx={p.x} cy={p.y} r={3} fill={color} />
                  {isFocus && <circle cx={p.x} cy={p.y} r={p.r + 10} fill="none" stroke={color} strokeOpacity={0.35} />}
                  <text x={p.x} y={p.y + p.r + 16} textAnchor="middle" fontSize={13} className={isFocus ? "fill-fg" : "fill-muted"}>{s.name}</text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <aside aria-live="polite" className="glass rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }}>
                <p className="font-mono text-xs" style={{ color: categoryColor[selected.category] }}>{selected.category}</p>
                <h3 className="mt-2 text-2xl font-semibold">{selected.name}</h3>
                <div className="mt-4 flex items-center gap-1" aria-label={`Proficiency ${selected.level} of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.span key={n} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: n * 0.05 }}
                      className={`h-1.5 flex-1 origin-left rounded-full ${n <= selected.level ? "bg-gradient-to-r from-accent to-violet" : "bg-raised"}`} />
                  ))}
                </div>
                <p className="mt-2 font-mono text-xs text-dim">experience: {selected.years}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{selected.detail}</p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-dim">Connected to</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.related.map((r) => {
                    const s = skills.find((x) => x.id === r); if (!s) return null;
                    return <button key={r} onClick={() => setSelected(s)} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-accent/50 hover:text-fg">{s.name}</button>;
                  })}
                </div>
              </motion.div>
            ) : <p className="text-sm text-muted">Select a planet to inspect it.</p>}
          </AnimatePresence>
        </aside>
      </div>

      <ul className="sr-only">{skills.map((s) => <li key={s.id}>{s.name} ({s.category}): {s.detail}</li>)}</ul>
    </Section>
  );
}
