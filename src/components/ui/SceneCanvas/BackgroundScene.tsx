'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, Group } from 'three';
import * as THREE from 'three';

interface BackgroundSceneProps {
  tier: 'low' | 'mid' | 'high';
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Deterministic pseudo-random based on seed — avoids Math.random in render. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A 3D shape that flies across the screen during the hero→stats gap,
 * driven by scroll position in the transition zone.
 */
function FlyAcrossShape() {
  const meshRef = useRef<Mesh>(null);
  const smoothT = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1;

    const flyStart = 1;
    const flyEnd = vh * 3 + 400;
    const range = flyEnd - flyStart;
    const rawT = range > 0 ? Math.max(0, Math.min(1, (scrollY - flyStart) / range)) : 0;

    smoothT.current = lerp(smoothT.current, rawT, 0.08);
    const t = smoothT.current;

    const x = lerp(14, -14, t) + Math.sin(t * Math.PI * 3) * 2.5;
    const y = Math.sin(t * Math.PI * 1.3) * 4 + Math.cos(t * Math.PI * 2.7) * 1.5;
    const z = -5 + Math.sin(t * Math.PI * 0.8) * 3 + Math.cos(t * Math.PI * 2) * 1.5;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5 + t * Math.PI;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;

    const visibility = Math.sin(t * Math.PI);
    meshRef.current.scale.setScalar(1.8 * Math.max(0.1, visibility));
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = visibility * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[12, 0, -5]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#2448ff"
        transparent
        opacity={0}
        wireframe
        emissive="#2448ff"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

/**
 * Flying orb in the upper part of the screen during the portfolio section.
 * Uses DOM position of #portfolio to determine scroll zone.
 */
function PortfolioFlyOrb() {
  const meshRef = useRef<Mesh>(null);
  const smoothT = useRef(0);
  const zoneRef = useRef<{ start: number; end: number } | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    if (!zoneRef.current) {
      const portfolioEl = document.querySelector<HTMLElement>('#portfolio');
      if (!portfolioEl) return;
      const pinSpacer = portfolioEl.closest('.pin-spacer') as HTMLElement | null;
      const top = pinSpacer ? pinSpacer.offsetTop : portfolioEl.offsetTop;
      const height = pinSpacer ? pinSpacer.offsetHeight : portfolioEl.offsetHeight;
      zoneRef.current = { start: top, end: top + height };
    }

    const { start, end } = zoneRef.current;
    const range = end - start;
    const rawT = range > 0 ? Math.max(0, Math.min(1, (scrollY - start) / range)) : 0;

    smoothT.current = lerp(smoothT.current, rawT, 0.07);
    const t = smoothT.current;

    const x = lerp(-16, 16, t) + Math.sin(t * Math.PI * 2) * 2;
    const y = 4 + Math.sin(t * Math.PI * 1.5) * 2;
    const z = -4 + Math.sin(t * Math.PI) * 3;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.6 + t * Math.PI * 1.5;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.35;

    const visibility = Math.sin(t * Math.PI);
    meshRef.current.scale.setScalar(1.8 * Math.max(0.1, visibility));
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = visibility * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[-16, 4, -4]} scale={0}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#2448ff"
        transparent
        opacity={0}
        wireframe
        emissive="#2448ff"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

/**
 * Shared hook: computes a 0→1 progress value for the "deep space" zone
 * (Process end → footer). Lazily reads DOM positions once.
 */
function useDeepSpaceProgress() {
  const smoothT = useRef(0);
  const zoneRef = useRef<{ start: number; end: number } | null>(null);

  function getProgress(): number {
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1;

    if (!zoneRef.current) {
      const processEl = document.querySelector<HTMLElement>('#process');
      const footerEl = document.querySelector<HTMLElement>('footer');
      if (!processEl) return 0;

      const pinSpacer = processEl.closest('.pin-spacer') as HTMLElement | null;
      const processTop = pinSpacer ? pinSpacer.offsetTop : processEl.offsetTop;
      const processHeight = pinSpacer ? pinSpacer.offsetHeight : processEl.offsetHeight * 5;
      const start = processTop + processHeight * 0.85;
      const end = footerEl ? footerEl.offsetTop + footerEl.offsetHeight : start + vh * 6;

      zoneRef.current = { start, end };
    }

    const { start, end } = zoneRef.current;
    const range = end - start;
    if (range <= 0) return 0;

    const raw = Math.max(0, Math.min(1, (scrollY - start) / range));
    smoothT.current = lerp(smoothT.current, raw, 0.05);
    return smoothT.current;
  }

  return getProgress;
}

/**
 * Consolidated deep space: stars + orbiting diamond + nebula light
 * in a single useFrame to minimize per-frame overhead.
 */
function DeepSpaceConsolidated({ starCount }: { starCount: number }) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const diamondRef = useRef<Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const getProgress = useDeepSpaceProgress();

  const positions = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const angle = seededRandom(i * 3) * Math.PI * 2;
      const radius = 3 + seededRandom(i * 3 + 1) * 25;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = 10 + seededRandom(i * 3 + 2) * 30;
    }
    return pos;
  }, [starCount]);

  const posAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);

  // Single useFrame for all deep space elements
  useFrame((state) => {
    const p = getProgress();
    const elapsed = state.clock.elapsedTime;

    // Stars
    if (pointsRef.current && pointsMatRef.current) {
      pointsMatRef.current.opacity = p * 0.5;
      pointsRef.current.rotation.z = elapsed * 0.015 + p * 0.4;
    }

    // Diamond
    if (diamondRef.current) {
      const fadeIn = Math.min(1, p / 0.15);
      const fadeOut = p > 0.9 ? lerp(1, 0, (p - 0.9) / 0.1) : 1;
      const visibility = fadeIn * fadeOut;

      const mat = diamondRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = visibility * 0.6;
      diamondRef.current.scale.setScalar(1.2 * Math.max(0.05, visibility));

      const orbitT = elapsed * 0.15 + p * Math.PI * 3;
      diamondRef.current.position.set(
        Math.sin(orbitT) * 6 + Math.cos(orbitT * 0.6) * 2,
        Math.sin(orbitT * 0.4) * 4 + Math.cos(orbitT * 1.1) * 1.5,
        22 + Math.sin(orbitT * 0.7) * 4,
      );
      diamondRef.current.rotation.x = elapsed * 0.4 + p * Math.PI * 2;
      diamondRef.current.rotation.y = elapsed * 0.25;
    }

    // Single nebula light
    if (lightRef.current) {
      lightRef.current.intensity = p * 0.6 * (0.6 + Math.sin(elapsed * 0.3) * 0.4);
      lightRef.current.position.set(
        Math.sin(elapsed * 0.1) * 15,
        Math.cos(elapsed * 0.15) * 10,
        20 + Math.sin(elapsed * 0.08) * 8,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <primitive attach="attributes-position" object={posAttr} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          color="#6b8aff"
          size={0.1}
          transparent
          opacity={0}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh ref={diamondRef} scale={0}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#6b8aff"
          transparent
          opacity={0}
          wireframe
          emissive="#2448ff"
          emissiveIntensity={0.6}
        />
      </mesh>

      <pointLight ref={lightRef} color="#2448ff" intensity={0} distance={40} decay={2} />
    </group>
  );
}

export const BackgroundScene = ({ tier }: BackgroundSceneProps) => {
  const groupRef = useRef<Group>(null);
  const scrollRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const docHeight =
      typeof document !== 'undefined'
        ? document.documentElement.scrollHeight - window.innerHeight
        : 1;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    scrollRef.current = lerp(scrollRef.current, progress, 0.05);

    const p = scrollRef.current;
    groupRef.current.rotation.y = p * Math.PI * 1.5;
    groupRef.current.rotation.x = Math.sin(p * Math.PI) * 0.3;
    groupRef.current.position.y = Math.sin(p * Math.PI * 2) * 2;
  });

  // Low tier: just the hero fly-across, nothing else
  // Mid tier: fly-across + portfolio orb (no deep space)
  // High tier: everything
  const showPortfolioOrb = tier !== 'low';
  const showDeepSpace = tier === 'high';
  const starCount = 400;

  return (
    <>
      <group ref={groupRef}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#2448ff" />
        <pointLight position={[-10, -10, 5]} intensity={0.3} color="#4466ff" />
        <FlyAcrossShape />
      </group>
      {showPortfolioOrb && <PortfolioFlyOrb />}
      {showDeepSpace && <DeepSpaceConsolidated starCount={starCount} />}
    </>
  );
};
