"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const MorphParticles = dynamic(() => import("./MorphParticles"), { ssr: false });

/** Global particle layer — skipped entirely for users who prefer reduced motion. */
export default function Background() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return <MorphParticles />;
}
