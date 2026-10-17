"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { fadeUp, stagger } from "@/lib/motion";
import Scramble from "./Scramble";

export function Section({ id, eyebrow, title, intro, children, component }: {
  id: string; eyebrow: string; title: React.ReactNode; intro?: string; children: React.ReactNode; component?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} data-component={component} className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-36">
      <motion.header variants={stagger()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="mb-12 max-w-2xl md:mb-16">
        <motion.p variants={fadeUp} className="eyebrow flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-accent" />
          <Scramble text={eyebrow} />
        </motion.p>
        <motion.h2 variants={fadeUp} id={`${id}-title`} className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{title}</motion.h2>
        {intro && <motion.p variants={fadeUp} className="mt-5 text-base text-muted md:text-lg">{intro}</motion.p>}
      </motion.header>
      {children}
    </section>
  );
}

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 32, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

type MagneticProps = { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; download?: boolean; external?: boolean };

export function MagneticButton({ href, children, variant = "primary", download, external }: MagneticProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 16);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 16);
  };
  const reset = () => { x.set(0); y.set(0); };

  const styles = {
    primary: "bg-fg text-black hover:shadow-[0_0_48px_-8px_rgba(0,212,255,0.8)]",
    secondary: "border-glow border border-line bg-card/60 text-fg backdrop-blur",
    ghost: "text-muted hover:text-fg",
  }[variant];

  return (
    <motion.a ref={ref} href={href} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}
      download={download} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
      className={`group relative inline-flex min-h-11 items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-medium transition-[box-shadow,border-color,color] duration-300 ${styles}`}>
      {children}
    </motion.a>
  );
}
