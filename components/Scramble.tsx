"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/** Decodes text from random glyphs when it enters the viewport. Real text stays in the DOM for SEO / screen readers. */
export default function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0, raf = 0;
    const total = text.length * 2 + 10;
    const tick = () => {
      frame++;
      setOut(text.split("").map((ch, i) => (ch === " " ? " " : frame > i * 2 + 8 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (frame < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}
