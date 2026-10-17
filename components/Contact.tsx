"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { profile } from "@/content/data";
import { trackSpotlight } from "@/lib/motion";
import { Reveal } from "./ui";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { window.location.href = `mailto:${profile.email}`; }
  };
  const tile = "card border-glow group flex min-h-36 flex-col justify-between p-6 text-left";

  return (
    <section id="contact" data-component="Contact" aria-labelledby="contact-title" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:px-8 md:py-40">
      <Reveal>
        <p className="eyebrow">↺ Discover</p>
        <h2 id="contact-title" className="mt-4 max-w-3xl text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
          Let&apos;s build <span className="text-gradient">what&apos;s next.</span>
        </h2>
        <p className="mt-5 max-w-xl text-muted">Every successful solution starts with a conversation. Your project begins at the first phase.</p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.a whileHover={{ y: -4 }} href={profile.linkedin} target="_blank" rel="noopener noreferrer" onPointerMove={trackSpotlight} className={tile}>
          <span className="font-mono text-xs text-dim">01</span><span><span className="block text-lg font-medium">LinkedIn</span><span className="text-sm text-muted">Connect professionally ↗</span></span>
        </motion.a>
        <motion.a whileHover={{ y: -4 }} href={profile.github} target="_blank" rel="noopener noreferrer" onPointerMove={trackSpotlight} className={tile}>
          <span className="font-mono text-xs text-dim">02</span><span><span className="block text-lg font-medium">GitHub</span><span className="text-sm text-muted">Read the code ↗</span></span>
        </motion.a>
        <motion.button whileHover={{ y: -4 }} onClick={copy} onPointerMove={trackSpotlight} className={tile}>
          <span className="font-mono text-xs text-dim">03</span>
          <span><span className="block text-lg font-medium">Email</span><span className="text-sm text-muted" aria-live="polite">{copied ? <span className="text-ok">✓ Copied to clipboard</span> : "Click to copy address"}</span></span>
        </motion.button>
        <motion.a whileHover={{ y: -4 }} href={profile.resume} download onPointerMove={trackSpotlight} className={`${tile} !bg-gradient-to-br from-accent/15 to-violet/15`}>
          <span className="font-mono text-xs text-dim">04</span><span><span className="block text-lg font-medium">Resume</span><span className="text-sm text-muted">Download PDF ↓</span></span>
        </motion.a>
      </div>

      <footer className="mt-24 flex flex-col gap-3 border-t border-line pt-8 font-mono text-xs text-dim md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
        <span><span className="text-ok">✓</span> build {process.env.NEXT_PUBLIC_BUILD_SHA} · Next.js · Three.js · psst: type <span className="text-accent">letsgo</span></span>
      </footer>
    </section>
  );
}
