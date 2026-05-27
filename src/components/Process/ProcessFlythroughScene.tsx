'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

interface ProcessFlythroughSceneProps {
  progressRef: MutableRefObject<number>;
  tier: 'low' | 'mid' | 'high';
  stepCount: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function WaypointGeometry({
  position,
  color,
  index,
  progressRef,
  totalSteps,
}: {
  position: THREE.Vector3;
  color: string;
  index: number;
  progressRef: MutableRefObject<number>;
  totalSteps: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.3 + index;
    meshRef.current.rotation.z = t * 0.2;

    // Pulse when the camera is near this waypoint
    const stepProgress = index / totalSteps;
    const distance = Math.abs(progressRef.current - stepProgress);
    const proximity = Math.max(0, 1 - distance * totalSteps * 1.5);
    const scale = 1 + proximity * 0.4;
    meshRef.current.scale.setScalar(scale);
    // Shimmer: base pulse + proximity boost
    const shimmer = 0.3 + Math.sin(t * 2 + index * 1.5) * 0.2;
    materialRef.current.emissiveIntensity = shimmer + proximity * 2.5;
  });

  const geometry = useMemo(() => {
    const geos = [
      <octahedronGeometry key="oct" args={[0.8, 0]} />,
      <icosahedronGeometry key="ico" args={[0.7, 1]} />,
      <torusGeometry key="tor" args={[0.6, 0.25, 12, 24]} />,
      <dodecahedronGeometry key="dod" args={[0.7, 0]} />,
    ];
    return geos[index % geos.length];
  }, [index]);

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.7}
        wireframe
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function TunnelParticles({ count, tier }: { count: number; tier: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isMobile = tier !== 'high';

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const maxRadius = isMobile ? 6 : 12;
    const minRadius = isMobile ? 1.5 : 3;
    for (let i = 0; i < count; i++) {
      const angle = seededRandom(i * 4) * Math.PI * 2;
      const radius = minRadius + seededRandom(i * 4 + 1) * maxRadius;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -seededRandom(i * 4 + 2) * 100;
      sz[i] = 0.5 + seededRandom(i * 4 + 3) * 1.5;
    }
    return [pos, sz];
  }, [count, isMobile]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  const posAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);
  const sizeAttr = useMemo(() => new THREE.BufferAttribute(sizes, 1), [sizes]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={posAttr} />
        <primitive attach="attributes-size" object={sizeAttr} />
      </bufferGeometry>
      <pointsMaterial
        color="#2448ff"
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export const ProcessFlythroughScene = ({
  progressRef,
  tier,
  stepCount,
}: ProcessFlythroughSceneProps) => {
  const { camera } = useThree();
  const smoothProgress = useRef(0);

  const isMobile = tier !== 'high';

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const pathLength = 80;
    const xSpread = isMobile ? 1 : 3;
    const ySpread = isMobile ? 0.8 : 1.5;

    for (let i = 0; i <= stepCount; i++) {
      const t = i / stepCount;
      const x = Math.sin(t * Math.PI * 2) * xSpread;
      const y = Math.cos(t * Math.PI * 3) * ySpread;
      const z = -t * pathLength;
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.CatmullRomCurve3(points);
  }, [stepCount, isMobile]);

  const waypointPositions = useMemo(() => {
    const xOffset = isMobile ? 1.5 : 3;
    const yOffsetA = isMobile ? 1 : 2;
    const yOffsetB = isMobile ? -0.5 : -1;

    return Array.from({ length: stepCount }, (_, i) => {
      const t = (i + 0.5) / stepCount;
      const point = curve.getPointAt(t);
      const offset = new THREE.Vector3(
        i % 2 === 0 ? xOffset : -xOffset,
        i % 3 === 0 ? yOffsetA : yOffsetB,
        0,
      );
      return point.clone().add(offset);
    });
  }, [stepCount, curve, isMobile]);

  const colors = ['#2448ff', '#4466ff', '#6b8aff', '#3355ff'];

  useFrame(() => {
    smoothProgress.current = lerp(smoothProgress.current, progressRef.current, 0.06);

    const p = Math.min(smoothProgress.current, 0.999);

    const position = curve.getPointAt(p);
    const lookTarget = curve.getPointAt(Math.min(p + 0.02, 1));

    camera.position.copy(position);
    camera.lookAt(lookTarget);
  });

  const particleCount = tier === 'low' ? 100 : tier === 'mid' ? 300 : 600;

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, -20]} intensity={1} color="#2448ff" distance={50} />
      <pointLight position={[0, -5, -50]} intensity={0.8} color="#4466ff" distance={50} />
      <fog attach="fog" args={['#060509', 5, 60]} />

      <TunnelParticles count={particleCount} tier={tier} />

      {waypointPositions.map((pos, i) => (
        <WaypointGeometry
          key={i}
          position={pos}
          color={colors[i % colors.length]}
          index={i}
          progressRef={progressRef}
          totalSteps={stepCount}
        />
      ))}
    </>
  );
};
