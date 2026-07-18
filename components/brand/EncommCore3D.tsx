"use client";

/* eslint-disable react-hooks/purity, react-hooks/immutability --
 * React Three Fiber components inherently:
 *  - mutate three.js objects (camera.position, mesh.rotation, etc.) inside useFrame
 *  - use Math.random() to seed particle distributions in useMemo
 * These imperative patterns are idiomatic for WebGL and cannot satisfy the
 * React Compiler's purity/immutability analysis. The mutation is scoped to
 * the render loop and does not affect React state. */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  Sparkles,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ENCOMM CORE — procedural 3D brand object.
 *
 * Inspired by the geometry of the ENCOMM logo (a faceted violet crystal with
 * an internal "E" structure), this is a branded visual metaphor — not a
 * literal replacement of the official logo.
 *
 * Composition:
 *  - Outer translucent hexagonal crystal (transmission glass)
 *  - Inner metallic core plates that open into architectural layers on scroll
 *  - Illuminated data channels (thin emissive edges)
 *  - Soft contact shadow on a bright spatial floor
 *  - Particle network (Sparkles) — information moving through the system
 *
 * The opening sequence is driven by scroll progress (0..1) passed in via a
 * ref so the parent Hero can control it; here we bind to ScrollTrigger
 * internally as well for the in-place ambient rotation.
 */

type CoreProps = {
  /** 0 (closed) → 1 (fully open) progress; controlled by scroll. */
  progressRef: React.MutableRefObject<number>;
  /** multiplier for particle density etc. */
  quality: "full" | "mobile";
};

/** The layered inner core plates. They translate apart by `open`. */
function InnerCore({ openRef }: { openRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const plateCount = 5;
  const plateRefs = useRef<THREE.Mesh[]>([]);

  useFrame((_, dt) => {
    const open = openRef.current;
    if (group.current) {
      // gentle ambient rotation; rate scales slightly with open
      group.current.rotation.y += dt * (0.12 + open * 0.06);
    }
    // distribute plates along Y based on open amount
    for (let i = 0; i < plateRefs.current.length; i++) {
      const mesh = plateRefs.current[i];
      if (!mesh) continue;
      const t = i / (plateCount - 1); // 0..1
      const offset = (t - 0.5) * 2; // -1..1
      const targetY = offset * (0.18 + open * 1.1);
      mesh.position.y += (targetY - mesh.position.y) * Math.min(1, dt * 6);
      const targetRot = open * 0.5 * Math.sign(offset || 1);
      mesh.rotation.y += (targetRot - mesh.rotation.y) * Math.min(1, dt * 6);
    }
  });

  // Material with emissive violet internal light
  const coreMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#5E48D6"),
        emissive: new THREE.Color("#725CFF"),
        emissiveIntensity: 0.55,
        metalness: 0.9,
        roughness: 0.28,
      }),
    [],
  );

  const channelMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#9BE7FB"),
        transparent: true,
        opacity: 0.9,
      }),
    [],
  );

  return (
    <group ref={group}>
      {/* Core plates: stacked rounded hexagons */}
      {Array.from({ length: plateCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) plateRefs.current[i] = m;
          }}
          material={coreMaterial}
        >
          <cylinderGeometry args={[0.62 - i * 0.04, 0.66 - i * 0.04, 0.08, 6]} />
        </mesh>
      ))}

      {/* E-bar: the three horizontal bars of the "E" — bright emissive */}
      {[0.34, 0, -0.34].map((y, i) => (
        <mesh key={`bar-${i}`} position={[0, y, 0.36]} material={channelMaterial}>
          <boxGeometry args={[0.62, 0.06, 0.03]} />
        </mesh>
      ))}
      {/* Vertical spine of the E */}
      <mesh position={[0.32, 0, 0.36]} material={channelMaterial}>
        <boxGeometry args={[0.06, 0.74, 0.03]} />
      </mesh>

      {/* Thin data ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={channelMaterial}>
        <torusGeometry args={[1.05, 0.004, 8, 64]} />
      </mesh>
    </group>
  );
}

/** Outer translucent glass crystal — hexagonal bipyramid-ish shape. */
function OuterCrystal() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y -= dt * 0.05;
    }
  });
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[1.25, 1.25, 1.9, 6, 1]} />
      <MeshTransmissionMaterial
        thickness={0.9}
        roughness={0.06}
        transmission={1}
        ior={1.35}
        chromaticAberration={0.06}
        backside
        color="#E4CFFF"
        attenuationColor="#9AAEFF"
        attenuationDistance={2.6}
        distortion={0.1}
        distortionScale={0.2}
        temporalDistortion={0.05}
      />
    </mesh>
  );
}

/** Small orbiting data fragments — appear as scroll opens the core. */
function DataFragments({ openRef }: { openRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const count = 18;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        radius: 1.7 + Math.random() * 1.1,
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        yspread: (Math.random() - 0.5) * 1.6,
        size: 0.02 + Math.random() * 0.025,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const open = openRef.current;
    if (group.current) {
      group.current.visible = open > 0.04;
      group.current.children.forEach((child, i) => {
        const s = seeds[i];
        if (!s) return;
        const angle = t * s.speed + s.offset;
        const r = s.radius * (0.5 + open * 0.9);
        child.position.set(
          Math.cos(angle) * r,
          s.yspread * (0.2 + open),
          Math.sin(angle) * r,
        );
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = Math.min(1, open * 1.3);
      });
    }
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[s.size, 8, 8]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#9BE7FB" : i % 3 === 1 ? "#C9AEFF" : "#E7A8F5"}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ openRef }: { openRef: React.MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    // subtle parallax based on pointer (desktop only — R3F pointer stays 0 on touch)
    const tx = pointer.x * 0.3;
    const ty = pointer.y * 0.2;
    camera.position.x += (tx - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += (3.0 + ty - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(0, 0, 0);
  });

  // Bind scroll progress -> openRef via ScrollTrigger tied to the hero pin.
  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const st = ScrollTrigger.create({
      trigger: hero || "#top",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        openRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, [openRef]);

  return null;
}

export default function EncommCore3D({ progressRef, quality }: CoreProps) {
  const openRef = progressRef;
  const isMobile = quality === "mobile";

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 3.0, 6], fov: 34 }}
      // Pause rendering when tab is hidden (r3f handles via frameloop)
      frameloop="always"
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      {/* Bright studio environment for soft reflections */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-4, 2, 2]} intensity={30} color="#725CFF" />
      <pointLight position={[3, -2, 3]} intensity={18} color="#66D7F5" />
      <pointLight position={[0, 3, -3]} intensity={12} color="#E7A8F5" />

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
        <OuterCrystal />
        <InnerCore openRef={openRef} />
        <DataFragments openRef={openRef} />
      </Float>

      {/* Information-particles network — restrained count */}
      <Sparkles
        count={isMobile ? 16 : 36}
        scale={7}
        size={2}
        speed={0.25}
        opacity={0.6}
        color="#C9AEFF"
      />

      <ContactShadows
        position={[0, -2.0, 0]}
        opacity={0.32}
        scale={12}
        blur={3}
        far={4}
        color="#101426"
      />

      <Environment preset="studio" />

      <Rig openRef={openRef} />
    </Canvas>
  );
}
