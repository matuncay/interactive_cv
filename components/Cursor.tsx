"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** Soft follower ring for fine pointers. The native cursor stays visible for accessibility. */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 38 }), sy = useSpring(y, { stiffness: 450, damping: 38 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: PointerEvent) => setHover(!!(e.target as Element)?.closest?.("a, button, [role='button'], [role='tab'], input, textarea, label"));
    const d = () => setDown(true), u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference">
      <motion.div animate={{ scale: down ? 0.7 : hover ? 1.8 : 1, opacity: hover ? 1 : 0.6 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="-ml-4 -mt-4 h-8 w-8 rounded-full border border-white" />
    </motion.div>
  );
}
