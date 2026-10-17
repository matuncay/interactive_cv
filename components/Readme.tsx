"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import { journey, readmeFiles, values } from "@/content/data";
import { Section } from "./ui";

const versions = ["v0.1.0", "v1.0.0", "v2.0.0", "v3.0.0", "Unreleased"];
const changelog = `# Changelog
All notable changes to this engineer are documented here.

${[...journey].reverse().map((m) => {
  const v = versions[journey.indexOf(m)];
  return `## [${v}] ${m.title} — ${m.period}
> ${m.org}
${m.highlights.map((h) => `- Added: ${h}`).join("\n")}`;
}).join("\n\n")}`;

const files: { name: string; icon: string; kind: "md" | "json" }[] = [
  { name: "README.md", icon: "◆", kind: "md" },
  { name: "how-i-work.md", icon: "◇", kind: "md" },
  { name: "values.json", icon: "{}", kind: "json" },
  { name: "CHANGELOG.md", icon: "↻", kind: "md" },
  { name: "KNOWN_ISSUES.md", icon: "!", kind: "md" },
];

function mdLine(line: string) {
  if (line.startsWith("# ")) return <span className="text-lg font-semibold text-fg">{line.slice(2)}</span>;
  if (line.startsWith("## ")) return <span className="font-semibold text-accent">{line}</span>;
  if (line.startsWith("> ")) return <span className="italic text-muted">{line}</span>;
  if (line.startsWith("- [x]")) return <span className="text-dim line-through decoration-dim/60"><span className="text-ok no-underline">✓</span>{line.slice(5)}</span>;
  if (line.startsWith("- [ ]")) return <span className="text-fg/85"><span className="text-warn">○</span>{line.slice(5)}</span>;
  if (line.startsWith("- ")) return <span className="text-fg/85"><span className="text-violet">-</span>{line.slice(1)}</span>;
  return <span className="text-fg/75">{line}</span>;
}

function jsonLines(): React.ReactNode[] {
  const entries = Object.entries(values);
  return [
    <span key="o" className="text-muted">{"{"}</span>,
    ...entries.map(([k, v], i) => (
      <span key={k}>
        {"  "}<span className="text-accent">&quot;{k}&quot;</span><span className="text-muted">: </span>
        {typeof v === "boolean" ? <span className="text-violet">{String(v)}</span>
          : Array.isArray(v) ? <><span className="text-muted">[</span>{v.map((x, j) => <Fragment key={x}><span className="text-ok">&quot;{x}&quot;</span>{j < v.length - 1 && <span className="text-muted">, </span>}</Fragment>)}<span className="text-muted">]</span></>
          : <span className="text-ok">&quot;{v}&quot;</span>}
        {i < entries.length - 1 && <span className="text-muted">,</span>}
      </span>
    )),
    <span key="c" className="text-muted">{"}"}</span>,
  ];
}

export default function Readme() {
  const [file, setFile] = useState("README.md");
  const f = files.find((x) => x.name === file)!;
  const lines: React.ReactNode[] = f.kind === "json" ? jsonLines()
    : (file === "CHANGELOG.md" ? changelog : readmeFiles[file]).split("\n").map((l) => mdLine(l));

  return (
    <Section id="readme" component="Readme" eyebrow="⌥ / Source" title={<>The CV is a repo. <span className="text-gradient">Read the source.</span></>}
      intro="Beyond skills: how I work, what I value, my career as a changelog — and an honest list of known issues.">
      <div className="overflow-hidden rounded-2xl border border-line bg-[#0F0F0F]/85 shadow-[0_40px_120px_-40px_rgba(123,97,255,0.3)] backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" /><span className="h-3 w-3 rounded-full bg-[#FEBC2E]" /><span className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 font-mono text-xs text-dim">mustafa-tuncay / main</span>
          <span className="ml-auto hidden font-mono text-[10px] text-dim sm:inline">★ open to opportunities</span>
        </div>
        <div className="grid md:grid-cols-[220px_1fr]">
          <nav aria-label="Files" className="flex gap-1 overflow-x-auto border-b border-line p-2 md:flex-col md:border-b-0 md:border-r md:p-3">
            <p className="hidden px-2 pb-2 font-mono text-[10px] uppercase tracking-wider text-dim md:block">Explorer</p>
            {files.map((x) => (
              <button key={x.name} onClick={() => setFile(x.name)} aria-current={file === x.name}
                className={`relative flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-mono text-xs transition-colors ${file === x.name ? "text-fg" : "text-muted hover:text-fg"}`}>
                {file === x.name && <motion.span layoutId="file-active" className="absolute inset-0 rounded-md bg-raised" />}
                <span className="relative w-4 text-center text-accent">{x.icon}</span>
                <span className="relative">{x.name}</span>
              </button>
            ))}
          </nav>
          <div className="min-h-[420px] overflow-x-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.pre key={file} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="font-mono text-[13px] leading-7">
                {lines.map((l, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }} className="flex">
                    <span aria-hidden className="mr-5 w-6 shrink-0 select-none text-right text-dim/70">{i + 1}</span>
                    <span className="whitespace-pre-wrap">{l}</span>
                  </motion.div>
                ))}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
