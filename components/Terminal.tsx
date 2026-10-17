"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { journey, profile, projects, skills } from "@/content/data";
import { useDevMode } from "./DevMode";
import { Reveal, Section } from "./ui";

type Line = { kind: "in" | "out"; node: React.ReactNode };
const COMMANDS = ["help", "about", "skills", "projects", "experience", "contact", "fit", "readme", "clear"] as const;
const bar = (n: number) => "█".repeat(n * 4) + "░".repeat(20 - n * 4);
function hash(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h * 2654435761); }
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function run(cmd: string, dev: { enabled: boolean; setEnabled: (v: boolean) => void }): React.ReactNode | null | "clear" {
  switch (cmd) {
    case "help":
      return (
        <div className="grid grid-cols-[110px_1fr] gap-x-4">
          {[["about", "who I am"], ["skills", "proficiency overview"], ["projects", "selected projects"], ["experience", "career as git log"], ["contact", "get in touch"], ["fit", "open the role-fit check"], ["readme", "open the source"], ["clear", "clear the screen"]].map(([c, d]) => (
            <Fragment key={c}><span className="text-accent">{c}</span><span className="text-muted">{d}</span></Fragment>
          ))}
        </div>
      );
    case "about":
      return <p className="max-w-2xl text-fg/85">{profile.about}<br /><span className="text-dim">languages: {profile.languages.join(", ")}</span></p>;
    case "skills":
      return <div>{[...skills].sort((a, b) => b.level - a.level).slice(0, 10).map((s) => (
        <div key={s.id} className="flex gap-3 whitespace-pre"><span className="w-44 shrink-0 text-muted">{s.name}</span><span className="text-accent">{bar(s.level)}</span></div>
      ))}</div>;
    case "projects":
      return <div>{projects.map((p) => (
        <div key={p.id} className="flex gap-3"><span className="text-dim">{p.code}</span>
          <a href="#projects" className="text-accent underline-offset-2 hover:underline">{p.name}</a>
          <span className="hidden text-muted sm:inline">[{p.stack.slice(0, 3).join(", ")}]</span></div>
      ))}</div>;
    case "experience":
      return <div>{[...journey].reverse().filter((m) => !m.future).map((m, i) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <span className="text-warn">* {hash(m.id).toString(16).slice(0, 7)}</span>{" "}
          {i === 0 && <span className="text-ok">(HEAD -&gt; {m.id}) </span>}
          <span className="text-fg">{m.title}</span> <span className="text-muted">· {m.org}</span>
        </div>
      ))}</div>;
    case "contact":
      navigator.clipboard?.writeText(profile.email).catch(() => {});
      return (
        <div>
          <div>email&nbsp;&nbsp;&nbsp; <a className="text-accent" href={`mailto:${profile.email}`}>{profile.email}</a> <span className="text-ok">(copied)</span></div>
          <div>linkedin <a className="text-accent" href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a></div>
          <div>github&nbsp;&nbsp; <a className="text-accent" href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a></div>
        </div>
      );
    case "fit": go("fit"); return <span className="text-muted">→ opening fit.check() …</span>;
    case "readme": go("readme"); return <span className="text-muted">→ cat README.md …</span>;
    case "letsgo":
      if (!dev.enabled) dev.setEnabled(true);
      return <span className="text-ok">Developer Mode enabled. Scroll up to the lab. Type `exit` to leave.</span>;
    case "exit":
      if (dev.enabled) dev.setEnabled(false);
      return <span className="text-muted">Developer Mode disabled.</span>;
    case "sudo hire-mustafa":
      setTimeout(() => go("contact"), 600);
      return <span className="text-ok">✓ Permission granted. Redirecting to contact…</span>;
    case "clear": return "clear";
    case "": return null;
    default:
      return <span className="text-red-400">command not found: {cmd}. Type <span className="text-accent">help</span>.</span>;
  }
}

export default function Terminal() {
  const dev = useDevMode();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = new Date().getHours();
    const greet = h < 12 ? "Guten Morgen" : h < 18 ? "Good afternoon" : "Good evening";
    setLines([{ kind: "out", node: <span className="text-muted">{greet}. Welcome to mustafa@portfolio — type <span className="text-accent">help</span> to start.</span> }]);
  }, []);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }); }, [lines]);

  const exec = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out = run(cmd, dev);
    if (out === "clear") setLines([]);
    else setLines((l) => [...l, { kind: "in", node: raw }, ...(out ? [{ kind: "out" as const, node: out }] : [])]);
    if (cmd) setHistory((h) => [cmd, ...h].slice(0, 50));
    setHIdx(-1);
    setValue("");
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") exec(value);
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(hIdx + 1, history.length - 1); if (history[i]) { setHIdx(i); setValue(history[i]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = hIdx - 1; setHIdx(Math.max(i, -1)); setValue(i >= 0 ? history[i] : ""); }
    else if (e.key === "Tab") { e.preventDefault(); const m = COMMANDS.filter((c) => c.startsWith(value)); if (m.length === 1) setValue(m[0]); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    <Section id="terminal" component="Terminal" eyebrow="07 / Ops" title={<>Prefer the <span className="text-gradient">command line?</span></>}
      intro="A real shell experience — history with ↑ ↓, Tab completion, Ctrl+L to clear.">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-line bg-raised/90 shadow-[0_40px_120px_-40px_rgba(0,212,255,0.25)] backdrop-blur-md" onClick={() => input.current?.focus()}>
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" /><span className="h-3 w-3 rounded-full bg-[#FEBC2E]" /><span className="h-3 w-3 rounded-full bg-[#28C840]" />
            <span className="ml-3 font-mono text-xs text-dim">mustafa@portfolio: ~</span>
          </div>
          <div ref={scroller} role="log" aria-live="polite" className="h-[380px] overflow-y-auto p-5 font-mono text-[13px] leading-relaxed">
            {lines.map((l, i) => (
              <div key={i} className="mb-2">
                {l.kind === "in" ? <div><span className="text-ok">➜</span> <span className="text-accent">~</span> <span className="text-fg">{l.node}</span></div> : l.node}
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-ok">➜</span>&nbsp;<span className="text-accent">~</span>&nbsp;
              <label htmlFor="term-input" className="sr-only">Terminal command</label>
              <input id="term-input" ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
                autoComplete="off" autoCapitalize="off" spellCheck={false} className="flex-1 bg-transparent text-fg caret-accent outline-none" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3 md:hidden">
            {COMMANDS.slice(0, 6).map((c) => <button key={c} onClick={() => exec(c)} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted">{c}</button>)}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
