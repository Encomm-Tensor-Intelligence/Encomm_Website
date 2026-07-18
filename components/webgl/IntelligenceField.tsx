"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fieldVertexShader, fieldFragmentShader } from "./shaders";
import {
  formationForKey,
  spectralColors,
  mulberry32,
  type FormationKey,
} from "./formations";
import { motion } from "@/lib/motion/motion-store";

const FORMATION_BY_SECTION: Record<string, FormationKey> = {
  top: "core",
  systems: "systems",
  "system-assistant": "systems",
  "system-postmatrix": "systems",
  "system-custom": "systems",
  capabilities: "capabilities",
  "use-cases": "usecases",
  approach: "approach",
  company: "company",
  contact: "contact",
};

const PARTICLE_COUNTS = { high: 3200, medium: 1600, low: 700 };

function FieldPoints({ quality }: { quality: "high" | "medium" | "low" }) {
  const count = PARTICLE_COUNTS[quality];
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Build geometry once.
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const boot = formationForKey("boot", count);
    const core = formationForKey("core", count);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const colors = spectralColors(count, 13);
    const rng = mulberry32(99);
    for (let i = 0; i < count; i++) {
      seeds[i] = rng();
      scales[i] = 0.5 + rng() * 1.8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(boot, 3));
    geo.setAttribute("aTargetA", new THREE.BufferAttribute(core, 3));
    geo.setAttribute("aTargetB", new THREE.BufferAttribute(boot.slice(), 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  // Dispose on unmount / count change.
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Track current/next formation + blend factor for smooth transitions.
  const formationState = useRef({
    current: "core" as FormationKey,
    next: "core" as FormationKey,
    blend: 1, // 1 = fully on "next"
  });

  // Pre-compute all formation arrays for instant swapping.
  const formations = useMemo(() => {
    const map: Partial<Record<FormationKey, Float32Array>> = {};
    (Object.keys(FORMATION_BY_SECTION) as string[]).forEach((k) => {
      const fk = FORMATION_BY_SECTION[k]!;
      if (!map[fk]) map[fk] = formationForKey(fk, count);
    });
    return map as Record<FormationKey, Float32Array>;
  }, [count]);

  // Sync attributes when formation changes.
  useEffect(() => {
    const swapIfNeeded = () => {
      const sectionId = motion.activeSection;
      const targetKey =
        FORMATION_BY_SECTION[sectionId] ?? ("core" as FormationKey);
      const fs = formationState.current;
      if (targetKey !== fs.next) {
        // Move current "next" (now fully blended) into A, set B = new target.
        const attrA = geometry.attributes.aTargetA as THREE.BufferAttribute;
        const attrB = geometry.attributes.aTargetB as THREE.BufferAttribute;
        const nextArr = formations[targetKey];
        const curArr = formations[fs.next];
        // A becomes what we're currently displaying (the old "next" since blend=1)
        attrA.array.set(curArr);
        attrB.array.set(nextArr);
        attrA.needsUpdate = true;
        attrB.needsUpdate = true;
        fs.current = fs.next;
        fs.next = targetKey;
        fs.blend = 0;
      }
    };
    const interval = window.setInterval(swapIfNeeded, 220);
    return () => window.clearInterval(interval);
  }, [formations, geometry]);

  useFrame((state, dt) => {
    const mat = materialRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;

    const fs = formationState.current;
    if (fs.blend < 1) {
      fs.blend = Math.min(1, fs.blend + dt * 1.0);
    }

    const u = mat.uniforms;
    if (u.uTime) u.uTime.value = state.clock.elapsedTime;
    if (u.uFormation) u.uFormation.value = fs.blend;
    if (u.uCursorStrength)
      u.uCursorStrength.value = motion.cursorInside ? 0.6 : 0.0;
    if (u.uCursor) (u.uCursor.value as THREE.Vector2).set(motion.cursorX, motion.cursorY);
    if (u.uVelocity) u.uVelocity.value = Math.min(motion.velocity, 60);
    if (u.uIntro)
      u.uIntro.value = Math.min(1, (u.uIntro.value as number) + dt * 0.4);

    // gentle whole-field rotation that responds to active section mood
    const targetRotY = motion.cursorX * 0.15;
    const targetRotX = motion.cursorY * 0.06;
    pts.rotation.y += (targetRotY - pts.rotation.y) * 0.04;
    pts.rotation.x += (targetRotX - pts.rotation.x) * 0.04;

    // subtle parallax drift
    pts.position.x +=
      (motion.cursorX * 0.25 - pts.position.x) * 0.03;
    pts.position.y +=
      (motion.cursorY * 0.18 - pts.position.y) * 0.03;
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
      uCursor: { value: new THREE.Vector2(0, 0) },
      uCursorStrength: { value: 0 },
      uVelocity: { value: 0 },
      uFormation: { value: 1 },
      uSize: { value: quality === "high" ? 9 : quality === "medium" ? 7 : 6 },
      uIntro: { value: 0 },
    }),
    [quality],
  );

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={fieldVertexShader}
        fragmentShader={fieldFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Thin static-ish connection lines between a few anchor nodes — decorative. */
function FieldLines({ quality }: { quality: "high" | "medium" | "low" }) {
  const lineCount = quality === "high" ? 40 : quality === "medium" ? 22 : 10;
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(lineCount * 2 * 3);
    const rng = mulberry32(321);
    for (let i = 0; i < lineCount; i++) {
      const a = rng() * Math.PI * 2;
      const b = rng() * Math.PI * 2;
      const ra = 1.5 + rng() * 2.5;
      const rb = 1.5 + rng() * 2.5;
      positions[i * 6] = Math.cos(a) * ra;
      positions[i * 6 + 1] = (rng() - 0.5) * 3;
      positions[i * 6 + 2] = Math.sin(a) * ra;
      positions[i * 6 + 3] = Math.cos(b) * rb;
      positions[i * 6 + 4] = (rng() - 0.5) * 3;
      positions[i * 6 + 5] = Math.sin(b) * rb;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [lineCount]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.z = motion.cursorX * 0.08;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial
        color="#6a4dff"
        transparent
        opacity={quality === "low" ? 0.05 : 0.09}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

export default function IntelligenceField({
  quality,
}: {
  quality: "high" | "medium" | "low";
}) {
  const dpr: [number, number] =
    quality === "high" ? [1, 2] : quality === "medium" ? [1, 1.5] : [1, 1];

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: "none" }}
      dpr={dpr}
      gl={{
        antialias: quality !== "low",
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 0, 8], fov: 55 }}
      frameloop="always"
      aria-hidden="true"
    >
      <FieldPoints quality={quality} />
      <FieldLines quality={quality} />
    </Canvas>
  );
}
