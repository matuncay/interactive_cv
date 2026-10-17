"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Living particle CV.
 * One fixed WebGL particle system morphs into a new formation for each lifecycle section:
 *   identity "MT" → timeline helix → skill galaxy → architecture layers → build lattice
 *   → transformation sphere → impact torus → fit target → readme wave → back to identity.
 * Particles react to the cursor, burst on every morph and speed up with scroll velocity.
 */

type Shape = { label: string; gen: (n: number) => Float32Array; offsetX?: number; opacity: number; spin: number };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function textShape(n: number, str: string): Float32Array {
  const W = 512, H = 200;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const out = new Float32Array(n * 3);
  if (!ctx) return sphere(n);
  ctx.fillStyle = "#fff";
  ctx.font = "800 180px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(str, W / 2, H / 2 + 8);
  const d = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
  const count = pts.length / 2;
  if (!count) return sphere(n);
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * count);
    out[i * 3] = (pts[k * 2] - W / 2) / 40 + rnd(-0.04, 0.04);
    out[i * 3 + 1] = -(pts[k * 2 + 1] - H / 2) / 40 + rnd(-0.04, 0.04);
    out[i * 3 + 2] = rnd(-0.5, 0.5);
  }
  return out;
}

function helix(n: number) {
  const o = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = i / n, a = t * Math.PI * 6, strand = i % 2 ? Math.PI : 0;
    o[i * 3] = (t - 0.5) * 22;
    o[i * 3 + 1] = Math.sin(a + strand) * 1.3 + rnd(-0.12, 0.12);
    o[i * 3 + 2] = Math.cos(a + strand) * 1.3 + rnd(-0.12, 0.12);
  }
  return o;
}

function galaxy(n: number) {
  const o = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = Math.pow(Math.random(), 0.7) * 7.5;
    const a = r * 0.75 + ((i % 3) * Math.PI * 2) / 3 + rnd(-0.35, 0.35) / (r * 0.3 + 0.4);
    o[i * 3] = Math.cos(a) * r;
    o[i * 3 + 1] = rnd(-0.25, 0.25) * (1 - r / 9);
    o[i * 3 + 2] = Math.sin(a) * r;
  }
  return o;
}

function layers(n: number) {
  const o = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const l = i % 5;
    o[i * 3] = rnd(-5, 5);
    o[i * 3 + 1] = 4 - l * 2 + rnd(-0.05, 0.05);
    o[i * 3 + 2] = rnd(-2.5, 2.5);
  }
  return o;
}

function lattice(n: number) {
  const o = new Float32Array(n * 3), k = 9;
  for (let i = 0; i < n; i++) {
    const gx = Math.floor(Math.random() * k), gy = Math.floor(Math.random() * k), gz = Math.floor(Math.random() * k);
    // place along cube edges of the grid for a wireframe look
    const axis = i % 3, t = Math.random();
    const p = [gx, gy, gz];
    p[axis] = Math.min(p[axis] + t, k - 1);
    o[i * 3] = (p[0] / (k - 1) - 0.5) * 7;
    o[i * 3 + 1] = (p[1] / (k - 1) - 0.5) * 7;
    o[i * 3 + 2] = (p[2] / (k - 1) - 0.5) * 7;
  }
  return o;
}

function sphere(n: number) {
  const o = new Float32Array(n * 3), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
    o[i * 3] = Math.cos(th) * r * 4.8;
    o[i * 3 + 1] = y * 4.8;
    o[i * 3 + 2] = Math.sin(th) * r * 4.8;
  }
  return o;
}

function torus(n: number) {
  const o = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2, R = 4.2, r = 1.3;
    o[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    o[i * 3 + 1] = r * Math.sin(v);
    o[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  return o;
}

function target(n: number) {
  const o = new Float32Array(n * 3), radii = [1.2, 2.6, 4, 5.4];
  for (let i = 0; i < n; i++) {
    const r = radii[i % radii.length] + rnd(-0.08, 0.08), a = Math.random() * Math.PI * 2;
    o[i * 3] = Math.cos(a) * r;
    o[i * 3 + 1] = Math.sin(a) * r;
    o[i * 3 + 2] = rnd(-0.2, 0.2);
  }
  return o;
}

function wave(n: number) {
  const o = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = rnd(-12, 12), z = rnd(-6, 6);
    o[i * 3] = x;
    o[i * 3 + 1] = Math.sin(x * 0.55) * 0.8 + Math.cos(z * 0.7) * 0.5 - 2.5;
    o[i * 3 + 2] = z;
  }
  return o;
}

const SHAPES: Record<string, Shape> = {
  identity: { label: "identity", gen: (n) => textShape(n, "MT"), offsetX: 6, opacity: 0.95, spin: 0 },
  timeline: { label: "timeline.helix", gen: helix, opacity: 0.45, spin: 0 },
  galaxy: { label: "skills.galaxy", gen: galaxy, opacity: 0.45, spin: 0.06 },
  stack: { label: "architecture.layers", gen: layers, opacity: 0.4, spin: 0.12 },
  lattice: { label: "build.lattice", gen: lattice, opacity: 0.4, spin: 0.15 },
  sphere: { label: "transform.sphere", gen: sphere, opacity: 0.45, spin: 0.1 },
  torus: { label: "impact.torus", gen: torus, opacity: 0.45, spin: 0.12 },
  target: { label: "fit.target", gen: target, opacity: 0.4, spin: 0 },
  field: { label: "ops.field", gen: wave, opacity: 0.4, spin: 0.03 },
};

const SECTION_SHAPE: Record<string, keyof typeof SHAPES> = {
  top: "identity", journey: "timeline", skills: "galaxy", architecture: "stack", projects: "lattice",
  transformation: "sphere", impact: "torus", fit: "target", readme: "field", lab: "lattice", terminal: "field", contact: "identity",
};

const vertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPixelRatio * (12.0 / -mv.z);
    vColor = aColor;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uDev;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    vec3 c = mix(vColor, vec3(0.13, 0.77, 0.37), uDev);
    gl_FragColor = vec4(c, a * uOpacity);
  }
`;

export default function MorphParticles() {
  const mount = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("identity");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const N = mobile ? 1400 : 3200;
    setCount(N);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL → the site still works without particles
    }
    const dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    // Precompute every formation once
    const targets: Record<string, Float32Array> = {};
    (Object.keys(SHAPES) as (keyof typeof SHAPES)[]).forEach((k) => (targets[k] = SHAPES[k].gen(N)));

    const cur = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) cur[i] = rnd(-15, 15); // start scattered → assemble into "MT"
    const off = new Float32Array(N * 3);
    const speed = new Float32Array(N);
    const phase = new Float32Array(N);
    const sizes = new Float32Array(N);
    const colors = new Float32Array(N * 3);
    const cA = new THREE.Color("#00D4FF"), cB = new THREE.Color("#7B61FF"), tmp = new THREE.Color();
    for (let i = 0; i < N; i++) {
      speed[i] = rnd(0.025, 0.075);
      phase[i] = Math.random() * Math.PI * 2;
      sizes[i] = Math.random() < 0.06 ? rnd(1.8, 2.6) : rnd(0.5, 1.3);
      tmp.copy(cA).lerp(cB, Math.random());
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    }

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uSize: { value: mobile ? 5 : 6 }, uPixelRatio: { value: dpr }, uOpacity: { value: 0 }, uDev: { value: 0 } },
    });

    const group = new THREE.Group();
    group.add(new THREE.Points(geo, mat));
    scene.add(group);

    let shapeKey: keyof typeof SHAPES = "identity";
    let tgt = targets.identity;

    const setShape = (key: keyof typeof SHAPES) => {
      if (key === shapeKey) return;
      shapeKey = key;
      tgt = targets[key];
      setLabel(SHAPES[key].label);
      for (let i = 0; i < N * 3; i++) off[i] += rnd(-0.9, 0.9); // morph burst
    };

    // Which section is in the middle of the viewport?
    const ids = Object.keys(SECTION_SHAPE);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShape(SECTION_SHAPE[e.target.id])),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const observeAll = () => ids.forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    observeAll();
    const mo = new MutationObserver(() => { io.disconnect(); observeAll(); }); // Dev Mode adds/removes the lab section
    mo.observe(document.getElementById("main") ?? document.body, { childList: true });

    // Pointer & scroll
    const ndc = new THREE.Vector2(10, 10);
    let pointerActive = false;
    const onMove = (e: PointerEvent) => {
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      pointerActive = true;
    };
    const onLeave = () => { pointerActive = false; };
    let lastY = window.scrollY, vel = 0;
    const onScroll = () => { vel = Math.min(Math.abs(window.scrollY - lastY), 80); lastY = window.scrollY; };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const v3 = new THREE.Vector3(), dir = new THREE.Vector3(), mLocal = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const shape = SHAPES[shapeKey];
      const wide = window.innerWidth >= 1024;
      const aspect = window.innerWidth / window.innerHeight;
      const scale = Math.max(0.42, Math.min(1, aspect / 1.5));

      // group transforms
      group.position.x += ((wide ? shape.offsetX ?? 0 : 0) - group.position.x) * 0.05;
      group.position.y += ((wide || shapeKey !== "identity" ? 0 : 3) - group.position.y) * 0.05;
      const s = group.scale.x + (scale - group.scale.x) * 0.05;
      group.scale.setScalar(s);
      if (shape.spin) group.rotation.y += shape.spin * dt * (1 + vel * 0.03);
      else group.rotation.y += (Math.atan2(Math.sin(-group.rotation.y), Math.cos(-group.rotation.y))) * 0.04;
      const tiltX = pointerActive ? -ndc.y * 0.15 : 0;
      group.rotation.x += ((shapeKey === "galaxy" ? 0.45 : shapeKey === "field" ? 0.25 : 0) + tiltX - group.rotation.x) * 0.04;

      // cursor in local space (intersection with z=0 plane)
      v3.set(ndc.x, ndc.y, 0.5).unproject(camera);
      dir.copy(v3).sub(camera.position).normalize();
      mLocal.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z);
      group.worldToLocal(mLocal);

      const wobble = 0.035 + vel * 0.004;
      vel *= 0.92;
      const R2 = 2.6;
      const p = posAttr.array as Float32Array;

      for (let i = 0; i < N; i++) {
        const j = i * 3, sp = speed[i];
        cur[j] += (tgt[j] - cur[j]) * sp;
        cur[j + 1] += (tgt[j + 1] - cur[j + 1]) * sp;
        cur[j + 2] += (tgt[j + 2] - cur[j + 2]) * sp;

        if (pointerActive) {
          const dx = cur[j] - mLocal.x, dy = cur[j + 1] - mLocal.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const f = (1 - d2 / R2) * 0.18;
            off[j] += dx * f; off[j + 1] += dy * f; off[j + 2] += f * 0.5;
          }
        }
        off[j] *= 0.9; off[j + 1] *= 0.9; off[j + 2] *= 0.9;

        const ph = phase[i];
        p[j] = cur[j] + off[j] + Math.sin(t * 0.8 + ph) * wobble;
        p[j + 1] = cur[j + 1] + off[j + 1] + Math.cos(t * 0.7 + ph) * wobble;
        p[j + 2] = cur[j + 2] + off[j + 2];
      }
      posAttr.needsUpdate = true;

      const op = shape.opacity * (mobile ? 0.7 : 1);
      mat.uniforms.uOpacity.value += (op - mat.uniforms.uOpacity.value) * 0.05;
      const dev = document.documentElement.dataset.devmode === "true" ? 1 : 0;
      mat.uniforms.uDev.value += (dev - mat.uniforms.uDev.value) * 0.05;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mount} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
      <div aria-hidden className="pointer-events-none fixed bottom-4 left-4 z-40 hidden font-mono text-[10px] text-dim md:block">
        <span className="text-accent">●</span> particles {count.toLocaleString("en")} · formation: <span className="text-muted">{label}</span>
      </div>
    </>
  );
}
