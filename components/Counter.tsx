"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Counts up when visible. value 0 = "not provided yet" → shows a placeholder. */
export default function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce || value === 0) return;
    const c = animate(0, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className} aria-label={value === 0 ? "to be added" : `${value}${suffix}`}>
      {value === 0 ? <span className="text-dim">[X]</span> : <>{n}{suffix}</>}
    </span>
  );
}
