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

/**
 * A 3D shape that flies across the screen during the hero→stats gap,
 * driven by scroll position in the transition zone.
 */
function FlyAcrossShape() {
  const meshRef = useRef<Mesh>(null);
  const smoothT = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Calculate the scroll zone where hero is gone and stats haven't arrived
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1;

    // Hero wrapper is 220svh, animation ends at ~80% = ~176vh
    // Stats wrapper starts after hero wrapper — extend 400px further
    const flyStart = vh * 1.5;
    const flyEnd = vh * 3 + 400;
    const range = flyEnd - flyStart;
    const rawT = range > 0 ? Math.max(0, Math.min(1, (scrollY - flyStart) / range)) : 0;

    smoothT.current = lerp(smoothT.current, rawT, 0.08);
    const t = smoothT.current;

    // Organic S-curve trajectory with vertical wobble
    const x = lerp(14, -14, t) + Math.sin(t * Math.PI * 3) * 2.5;
    const y = Math.sin(t * Math.PI * 1.3) * 4 + Math.cos(t * Math.PI * 2.7) * 1.5;
    const z = -5 + Math.sin(t * Math.PI * 0.8) * 3 + Math.cos(t * Math.PI * 2) * 1.5;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5 + t * Math.PI;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;

    // Fade in at start, fade out at end
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

    // Enter from left (-16), exit right (+16), upper screen
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
 * Star-field particles that fade in after Process and drift slowly,
 * creating an immersive deep-space tunnel feel.
 */
function DeepSpaceStars({ count, tier }: { count: number; tier: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const getProgress = useDeepSpaceProgress();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 25;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = 10 + Math.random() * 30;
    }
    return pos;
  }, [count]);

  const posAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    const p = getProgress();

    // Fade in with scroll, max opacity 0.5
    materialRef.current.opacity = p * 0.5;

    // Slow rotation for drift
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.015 + p * 0.4;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={posAttr} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#6b8aff"
        size={tier === 'low' ? 0.15 : 0.1}
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Small wireframe gems scattered in space — drift into view
 * with scroll, orbit gently with time-based rotation.
 */
function SpaceGem({
  basePosition,
  geoType,
  color,
  index,
}: {
  basePosition: [number, number, number];
  geoType: 'octahedron' | 'icosahedron' | 'tetrahedron';
  color: string;
  index: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const getProgress = useDeepSpaceProgress();

  const geo = useMemo(() => {
    switch (geoType) {
      case 'octahedron':
        return <octahedronGeometry args={[0.4, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.35, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.4, 0]} />;
    }
  }, [geoType]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const p = getProgress();
    const elapsed = state.clock.elapsedTime;

    // Staggered fade-in based on index
    const staggerDelay = index * 0.08;
    const localP = Math.max(0, Math.min(1, (p - staggerDelay) / 0.3));

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = localP * 0.4;
    }

    meshRef.current.scale.setScalar(localP * (0.5 + Math.sin(elapsed * 0.5 + index) * 0.1));

    // Gentle orbit around base position
    const orbitRadius = 1.5;
    const speed = 0.2 + index * 0.05;
    meshRef.current.position.set(
      basePosition[0] + Math.sin(elapsed * speed + index * 2) * orbitRadius,
      basePosition[1] + Math.cos(elapsed * speed * 0.7 + index) * orbitRadius * 0.6,
      basePosition[2] + Math.sin(elapsed * speed * 0.3 + index * 3) * 1,
    );

    meshRef.current.rotation.x = elapsed * 0.3 + index;
    meshRef.current.rotation.y = elapsed * 0.2 + index * 0.5;
  });

  return (
    <mesh ref={meshRef} scale={0}>
      {geo}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0}
        wireframe
        emissive={color}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

/**
 * Orbiting diamond that emerges after Process and persists through
 * About/Contact — the hero object of the deep space environment.
 */
function OrbitingDiamond() {
  const meshRef = useRef<Mesh>(null);
  const getProgress = useDeepSpaceProgress();

  useFrame((state) => {
    if (!meshRef.current) return;
    const p = getProgress();
    const elapsed = state.clock.elapsedTime;

    // Fade in over the first 15% of the zone
    const fadeIn = Math.min(1, p / 0.15);
    // Fade out in the last 10%
    const fadeOut = p > 0.9 ? lerp(1, 0, (p - 0.9) / 0.1) : 1;
    const visibility = fadeIn * fadeOut;

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = visibility * 0.6;
    }

    meshRef.current.scale.setScalar(1.2 * Math.max(0.05, visibility));

    // Slow, wide orbit near the camera
    const orbitT = elapsed * 0.15 + p * Math.PI * 3;
    meshRef.current.position.set(
      Math.sin(orbitT) * 6 + Math.cos(orbitT * 0.6) * 2,
      Math.sin(orbitT * 0.4) * 4 + Math.cos(orbitT * 1.1) * 1.5,
      22 + Math.sin(orbitT * 0.7) * 4,
    );

    meshRef.current.rotation.x = elapsed * 0.4 + p * Math.PI * 2;
    meshRef.current.rotation.y = elapsed * 0.25;
    meshRef.current.rotation.z = elapsed * 0.15 + p * Math.PI;
  });

  return (
    <mesh ref={meshRef} scale={0}>
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
  );
}

/**
 * Pulsing accent lights that drift through the deep space zone,
 * adding mysterious colored fog highlights.
 */
function NebulaLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const getProgress = useDeepSpaceProgress();

  useFrame((state) => {
    const p = getProgress();
    const elapsed = state.clock.elapsedTime;
    const intensity = p * 0.8;

    if (light1Ref.current) {
      light1Ref.current.intensity = intensity * (0.6 + Math.sin(elapsed * 0.3) * 0.4);
      light1Ref.current.position.set(
        Math.sin(elapsed * 0.1) * 15,
        Math.cos(elapsed * 0.15) * 10,
        20 + Math.sin(elapsed * 0.08) * 8,
      );
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = intensity * (0.4 + Math.sin(elapsed * 0.25 + 2) * 0.3);
      light2Ref.current.position.set(
        Math.cos(elapsed * 0.12) * 12,
        Math.sin(elapsed * 0.08) * 8,
        15 + Math.cos(elapsed * 0.1) * 6,
      );
    }
    if (light3Ref.current) {
      light3Ref.current.intensity = intensity * (0.3 + Math.sin(elapsed * 0.2 + 4) * 0.2);
      light3Ref.current.position.set(
        Math.sin(elapsed * 0.07) * 10,
        Math.cos(elapsed * 0.13) * 12,
        25 + Math.sin(elapsed * 0.15) * 6,
      );
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} color="#2448ff" intensity={0} distance={40} decay={2} />
      <pointLight ref={light2Ref} color="#4466ff" intensity={0} distance={35} decay={2} />
      <pointLight ref={light3Ref} color="#6b8aff" intensity={0} distance={30} decay={2} />
    </>
  );
}

/** Combines all deep space elements into one group. */
function DeepSpaceEnvironment({ tier }: { tier: 'low' | 'mid' | 'high' }) {
  const starCount = tier === 'low' ? 150 : tier === 'mid' ? 400 : 800;
  const gemCount = tier === 'low' ? 4 : tier === 'mid' ? 8 : 12;

  const gems = useMemo(() => {
    const geoTypes: Array<'octahedron' | 'icosahedron' | 'tetrahedron'> = [
      'octahedron',
      'icosahedron',
      'tetrahedron',
    ];
    const colors = ['#2448ff', '#6b8aff', '#4466ff', '#2448ff', '#6b8aff'];

    return Array.from({ length: gemCount }, (_, i) => ({
      basePosition: [
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 18,
        20 + Math.random() * 15,
      ] as [number, number, number],
      geoType: geoTypes[i % geoTypes.length],
      color: colors[i % colors.length],
    }));
  }, [gemCount]);

  return (
    <>
      <DeepSpaceStars count={starCount} tier={tier} />
      <NebulaLights />
      <OrbitingDiamond />
      {gems.map((gem, i) => (
        <SpaceGem key={i} index={i} {...gem} />
      ))}
    </>
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

  return (
    <>
      <group ref={groupRef}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#2448ff" />
        <pointLight position={[-10, -10, 5]} intensity={0.3} color="#4466ff" />
        <FlyAcrossShape />
      </group>
      <PortfolioFlyOrb />
      <DeepSpaceEnvironment tier={tier} />
    </>
  );
};
