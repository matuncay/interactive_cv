import { metrics } from "@/content/data";
import Counter from "./Counter";
import { Reveal, Section } from "./ui";

function Sparkline({ seed }: { seed: number }) {
  const pts = Array.from({ length: 12 }, (_, i) => `${i * 10},${20 - ((Math.sin(i * 0.9 + seed) + 1) * 6 + i * 0.6)}`).join(" ");
  return (
    <svg aria-hidden viewBox="0 0 110 24" className="mt-4 h-6 w-full">
      <defs><linearGradient id={`spark-${seed}`}><stop offset="0" stopColor="#00D4FF" stopOpacity="0.2" /><stop offset="1" stopColor="#7B61FF" /></linearGradient></defs>
      <polyline points={pts} fill="none" stroke={`url(#spark-${seed})`} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Metrics() {
  return (
    <Section id="impact" component="Metrics" eyebrow="06 / Transform" title={<>Impact, <span className="text-gradient">measured.</span></>}>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {metrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.06} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
            <div className="card border-glow h-full p-5">
              <dd className="font-mono text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-tight"><Counter value={m.value} suffix={m.suffix} /></dd>
              <dt className="mt-3 text-sm text-muted">{m.label}</dt>
              <Sparkline seed={i} />
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
