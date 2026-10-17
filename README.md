# Mustafa Tuncay — Portfolio v2

A lifecycle-driven portfolio: **Discover → Analyze → Design → Build → Deploy → Transform**.
Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js

```bash
npm install
npm run dev        # http://localhost:3000
```
Deploy: push to GitHub → import in Vercel.

## What's new in v2
- **Living particle CV** (`components/MorphParticles.tsx`): one WebGL system (3,200 particles desktop / 1,400 mobile)
  morphs per section — "MT" → helix → galaxy → layers → lattice → sphere → torus → target → wave → "MT".
  Cursor repels particles, every morph bursts, scroll speed adds energy, Dev Mode turns them green.
  Pauses in background tabs; disabled for prefers-reduced-motion; falls back silently without WebGL.
- **Role Fit Simulator** (`#fit`): recruiters pick requirements or paste a job description → animated match score,
  strengths / growth areas, and a pre-filled "Discuss this role" email.
- **The CV is a repo** (`#readme`): README.md, how-i-work.md, values.json, CHANGELOG.md (career as semantic versions)
  and KNOWN_ISSUES.md (honest growth areas).
- Modern polish: masked headline reveal, aurora gradients, glass cards, animated conic borders,
  3D tilt project cards, text-scramble section labels, cursor follower ring, layout-animated nav.
- Terminal: new `fit`, `readme`, `sudo hire-mustafa`.

## Before publishing — edit `content/data.ts`
Contact links, `[YYYY]` years, `[X]` skill years, project/metric numbers (0 renders `[X]`),
`fitProfile` levels, and the texts in `readmeFiles` / `values` (it's your voice — make it yours).
Add an anonymised CV at `public/resume.pdf`.
