/**
 * Deterministic formation generators for the intelligence field.
 *
 * Each function returns N positions (Float32Array, 3*N) describing where
 * particles should settle for a given section "mood". Formations are
 * deterministic (seeded) so SSR/client produce identical layouts — important
 * to avoid hydration mismatches.
 *
 * Formations are blended in the shader by passing two arrays (A, B) and a
 * uFormation mix value 0..1, then swapped when the mix completes.
 */

/** Mulberry32 — small deterministic PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FormationKey =
  | "boot"
  | "core"
  | "systems"
  | "capabilities"
  | "usecases"
  | "approach"
  | "company"
  | "contact";

const TWO_PI = Math.PI * 2;

/** Scatter particles on a large soft shell — the boot/hero ambient state. */
export function shellFormation(count: number, radius = 8): Float32Array {
  const rng = mulberry32(1337);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // bias toward a flattened disc + dome
    const theta = rng() * TWO_PI;
    const r = radius * (0.4 + rng() * 0.9);
    const y = (rng() - 0.5) * radius * 0.9;
    arr[i * 3] = Math.cos(theta) * r;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = Math.sin(theta) * r * 0.6 - 1.5;
  }
  return arr;
}

/** Concentrate into a dense torus around the core (hero assembled). */
export function coreFormation(count: number, radius = 2.6): Float32Array {
  const rng = mulberry32(7);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = rng() * TWO_PI;
    const ringR = radius * (0.85 + rng() * 0.5);
    const yJitter = (rng() - 0.5) * 1.6;
    const layer = Math.floor(rng() * 3) - 1; // -1, 0, 1
    arr[i * 3] = Math.cos(theta) * ringR;
    arr[i * 3 + 1] = yJitter + layer * 0.5;
    arr[i * 3 + 2] = Math.sin(theta) * ringR;
  }
  return arr;
}

/** Split into three clusters (the three systems). */
export function systemsFormation(count: number): Float32Array {
  const rng = mulberry32(21);
  const arr = new Float32Array(count * 3);
  const centers: [number, number, number][] = [
    [-3.4, 0.4, 0],
    [0, 0.4, 0.5],
    [3.4, 0.4, 0],
  ];
  for (let i = 0; i < count; i++) {
    const c = centers[i % 3]!;
    const theta = rng() * TWO_PI;
    const r = 0.4 + rng() * 1.3;
    arr[i * 3] = c[0] + Math.cos(theta) * r;
    arr[i * 3 + 1] = c[1] + (rng() - 0.5) * 1.6;
    arr[i * 3 + 2] = c[2] + Math.sin(theta) * r;
  }
  return arr;
}

/** Spherical neural cloud (capabilities). */
export function capabilitiesFormation(count: number, radius = 3.4): Float32Array {
  const rng = mulberry32(42);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // even sphere distribution
    const u = rng();
    const v = rng();
    const theta = TWO_PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.7 + rng() * 0.5);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi);
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
}

/** Workflow funnel (use cases): wide top → narrow bottom. */
export function usecaseFormation(count: number): Float32Array {
  const rng = mulberry32(64);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = rng();
    const layerR = 3.4 * (1 - t * 0.7) + 0.4;
    const theta = rng() * TWO_PI;
    arr[i * 3] = Math.cos(theta) * layerR;
    arr[i * 3 + 1] = 2.0 - t * 4.0;
    arr[i * 3 + 2] = Math.sin(theta) * layerR * 0.7;
  }
  return arr;
}

/** Pipeline flow (approach): particles along a horizontal axis with bands. */
export function approachFormation(count: number): Float32Array {
  const rng = mulberry32(88);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = rng();
    const x = (t - 0.5) * 9.0;
    const band = Math.sin(t * Math.PI * 5) * 0.5;
    const theta = rng() * TWO_PI;
    const r = 0.4 + rng() * 0.7;
    arr[i * 3] = x;
    arr[i * 3 + 1] = Math.cos(theta) * r * 0.6 + band;
    arr[i * 3 + 2] = Math.sin(theta) * r * 0.6;
  }
  return arr;
}

/** Globe of points (company) centered slightly back. */
export function companyFormation(count: number, radius = 3.2): Float32Array {
  const rng = mulberry32(101);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = rng();
    const v = rng();
    const theta = TWO_PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.92 + rng() * 0.12);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi);
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 1.5;
  }
  return arr;
}

/** Converge toward the contact form (calm, dense, lower). */
export function contactFormation(count: number): Float32Array {
  const rng = mulberry32(202);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = rng() * TWO_PI;
    const r = 0.6 + rng() * 2.0;
    arr[i * 3] = Math.cos(theta) * r;
    arr[i * 3 + 1] = -1.5 + (rng() - 0.5) * 2.0;
    arr[i * 3 + 2] = Math.sin(theta) * r;
  }
  return arr;
}

export function formationForKey(key: FormationKey, count: number): Float32Array {
  switch (key) {
    case "boot": return shellFormation(count);
    case "core": return coreFormation(count);
    case "systems": return systemsFormation(count);
    case "capabilities": return capabilitiesFormation(count);
    case "usecases": return usecaseFormation(count);
    case "approach": return approachFormation(count);
    case "company": return companyFormation(count);
    case "contact": return contactFormation(count);
  }
}

/** Per-point spectral colors. */
export function spectralColors(count: number, seed = 7): Float32Array {
  const rng = mulberry32(seed);
  const arr = new Float32Array(count * 3);
  const palette = [
    [0.42, 0.30, 1.0],   // violet
    [0.71, 0.61, 1.0],   // lilac
    [0.31, 0.83, 0.96],  // cyan
    [0.90, 0.55, 0.94],  // magenta
    [0.81, 0.89, 1.0],   // iceblue
    [1.0, 1.0, 1.0],     // white sparkle
  ];
  for (let i = 0; i < count; i++) {
    const c = palette[Math.floor(rng() * palette.length)]!;
    arr[i * 3] = c[0]!;
    arr[i * 3 + 1] = c[1]!;
    arr[i * 3 + 2] = c[2]!;
  }
  return arr;
}
