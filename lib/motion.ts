export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

/** Sets --mx/--my CSS vars for the card spotlight effect. */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
