"use client";

/* eslint-disable react-hooks/immutability --
 * React Three Fiber: imperative three.js mutation inside useFrame is idiomatic. */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { fresnelVertexShader, fresnelFragmentShader } from "./shaders";
import { motion } from "@/lib/motion/motion-store";

/**
 * ENCOMM CORE — open architectural brand object.
 *
 * Inspired by the supplied logo geometry (faceted hexagonal crystal with an
 * internal "E"), but rebuilt as a floating, layered, glass + metal structure.
 *
 * Layers (read by the hero scroll sequence via motion.progress):
 *   0.00–0.15  boot: shell faint, core hidden behind shimmer
 *   0.15–0.35  assemble: layers rise into place, channels ignite
 *   0.35–0.55  open: layers fan out, data fragments emerge
 *   0.55–0.75  orbit: labels/satellites around the core
 *   0.75–0.90  process: streams in→out
 *   0.90–1.00  align: layers settle into coherent system
 */

type CoreProps = { quality: "high" | "medium" | "low" };

/** Group of stacked hexagonal glass plates — the "E" layers. */
function CoreLayers({ progressRef }: { progressRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const plateRefs = useRef<THREE.Mesh[]>([]);
  const channelRefs = useRef<THREE.Mesh[]>([]);

  const PLATE_COUNT = 5;

  useFrame((_, dt) => {
    const p = progressRef.current;
    const g = group.current;
    if (!g) return;

    // ambient rotation scales with activity
    g.rotation.y += dt * (0.1 + p * 0.12);
    // intro rise
    g.position.y = THREE.MathUtils.lerp(g.position.y, p > 0.05 ? 0 : -1.2, 0.06);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, p > 0.02 ? 1 : 0.6, 0.06));

    // Open amount: 0 until 0.35, ramps to 1 by 0.55, then back to ~0.3 by 1.0
    const openRaw =
      p < 0.15 ? 0 : p < 0.35 ? (p - 0.15) / 0.2 : p < 0.55 ? 1 : p < 0.9 ? 1 - (p - 0.55) * 0.5 : 0.32;
    const open = Math.max(0, Math.min(1, openRaw));

    for (let i = 0; i < plateRefs.current.length; i++) {
      const m = plateRefs.current[i];
      if (!m) continue;
      const t = i / (PLATE_COUNT - 1); // 0..1
      const off = (t - 0.5) * 2; // -1..1
      const targetY = off * (0.12 + open * 1.15);
      m.position.y += (targetY - m.position.y) * Math.min(1, dt * 5);
      m.rotation.y += dt * (0.05 + (i % 2 ? 0.04 : -0.04)) * (0.4 + open);
      const sx = 1 + open * 0.05 * Math.sign(off || 1);
      m.scale.x += (sx - m.scale.x) * Math.min(1, dt * 5);
    }

    // channels illuminate after 0.15
    const lit = Math.min(1, Math.max(0, (p - 0.15) / 0.2));
    for (let i = 0; i < channelRefs.current.length; i++) {
      const m = channelRefs.current[i];
      if (!m) continue;
      const mat = m.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.15 + lit * 0.85 * (0.6 + 0.4 * Math.sin(performance.now() * 0.002 + i));
      }
    }
  });

  const hexGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1, 0.12, 6, 1);
    return g;
  }, []);
  useEffect(() => () => hexGeo.dispose(), [hexGeo]);

  return (
    <group ref={group}>
      {/* glass plates */}
      {Array.from({ length: PLATE_COUNT }).map((_, i) => (
        <mesh
          key={`plate-${i}`}
          ref={(m) => {
            if (m) plateRefs.current[i] = m;
          }}
          geometry={hexGeo}
        >
          <MeshTransmissionMaterial
            thickness={0.5 + i * 0.05}
            roughness={0.08}
            transmission={1}
            ior={1.4}
            chromaticAberration={0.08}
            backside
            color={i % 2 ? "#E4CFFF" : "#BFE3FF"}
            attenuationColor="#9BC0FF"
            attenuationDistance={2.4}
            distortion={0.12}
            distortionScale={0.25}
            temporalDistortion={0.04}
            resolution={128}
            samples={4}
          />
        </mesh>
      ))}

      {/* metallic rim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.025, 12, 80]} />
        <meshStandardMaterial color="#0b0f24" metalness={0.95} roughness={0.25} />
      </mesh>

      {/* E-bar channels — three horizontal emissive bars + spine */}
      {[
        { y: 0.34, w: 0.9 },
        { y: 0, w: 0.9 },
        { y: -0.34, w: 0.9 },
      ].map((b, i) => (
        <mesh
          key={`bar-${i}`}
          ref={(m) => {
            if (m) channelRefs.current[channelRefs.current.length] = m;
          }}
          position={[0, b.y, 0.62]}
        >
          <boxGeometry args={[b.w, 0.07, 0.04]} />
          <meshBasicMaterial color="#4fd4f5" transparent opacity={0.2} />
        </mesh>
      ))}
      <mesh
        ref={(m) => {
          if (m) channelRefs.current[channelRefs.current.length] = m;
        }}
        position={[0.42, 0, 0.62]}
      >
        <boxGeometry args={[0.07, 0.78, 0.04]} />
        <meshBasicMaterial color="#9BC0FF" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/** Fresnel glow shell — iridescent rim light around the core. */
function GlowShell() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (mat.current) {
      const u = mat.current.uniforms.uTime;
      if (u) u.value = state.clock.elapsedTime;
    }
  });
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6a4dff") },
      uColorB: { value: new THREE.Color("#e58bf0") },
      uColorC: { value: new THREE.Color("#4fd4f5") },
      uOpacity: { value: 0.55 },
    }),
    [],
  );
  return (
    <mesh scale={2.2}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        ref={mat}
        vertexShader={fresnelVertexShader}
        fragmentShader={fresnelFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/** Small instanced satellites orbiting the core — "data fragments". */
function Satellites({ progressRef }: { progressRef: React.RefObject<number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 26;
  const seeds = useMemo(() => {
    const arr: { r: number; speed: number; off: number; y: number; phase: number }[] = [];
    let s = 1234;
    const rng = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < COUNT; i++) {
      arr.push({
        r: 1.8 + rng() * 1.4,
        speed: 0.15 + rng() * 0.4,
        off: rng() * Math.PI * 2,
        y: (rng() - 0.5) * 2.2,
        phase: rng() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;
    const visible = p > 0.3 ? 1 : Math.max(0, (p - 0.2) / 0.1);
    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i]!;
      const a = t * s.speed + s.off;
      const r = s.r * (0.6 + p * 0.6);
      dummy.position.set(
        Math.cos(a) * r,
        s.y + Math.sin(t * 0.5 + s.phase) * 0.2,
        Math.sin(a) * r,
      );
      const sc = 0.04 + (i % 3) * 0.02;
      dummy.scale.setScalar(sc);
      dummy.rotation.y = a;
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      const col = (m.instanceColor ?? (m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3)));
      const palette = [
        [0.42, 0.30, 1.0],
        [0.31, 0.83, 0.96],
        [0.90, 0.55, 0.94],
      ];
      const c = palette[i % 3]!;
      col.setXYZ(i, c[0]! * visible, c[1]! * visible, c[2]! * visible);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial transparent opacity={0.9} />
    </instancedMesh>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((_, dt) => {
    const cx = motion.cursorX;
    const cy = motion.cursorY;
    const tx = cx * 0.6;
    const ty = 0.6 + cy * 0.35;
    camera.position.x += (tx - camera.position.x) * Math.min(1, dt * 1.6);
    camera.position.y += (ty - camera.position.y) * Math.min(1, dt * 1.6);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function EncommCore({ quality }: CoreProps) {
  const progressRef = useRef(0);

  // Bind scroll progress to the hero pin.
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector("[data-hero-pin]");
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const traveled = -r.top;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, traveled / total));
      progressRef.current = p;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    const id = window.setInterval(update, 120);
    return () => {
      window.removeEventListener("scroll", update);
      window.clearInterval(id);
    };
  }, []);

  const dpr: [number, number] =
    quality === "high" ? [1, 2] : quality === "medium" ? [1, 1.5] : [1, 1.25];

  return (
    <Canvas
      className="!absolute inset-0"
      style={{ background: "transparent" }}
      dpr={dpr}
      gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.6, 6.2], fov: 38 }}
      frameloop="always"
      aria-hidden="true"
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 6, 4]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-5, 2, 3]} intensity={42} color="#6a4dff" />
      <pointLight position={[4, -2, 3]} intensity={26} color="#4fd4f5" />
      <pointLight position={[0, 4, -3]} intensity={18} color="#e58bf0" />

      <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.4}>
        <CoreLayers progressRef={progressRef} />
        <GlowShell />
        <Satellites progressRef={progressRef} />
      </Float>

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.32}
        scale={14}
        blur={3.2}
        far={4.5}
        color="#0b0f24"
      />

      <Environment preset="studio" />

      <Rig />
    </Canvas>
  );
}
