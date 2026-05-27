'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { getPerformanceTier, getDprForTier } from '@/utils/performanceTier';
import './SceneCanvas.less';

const Canvas = lazy(() => import('@react-three/fiber').then((mod) => ({ default: mod.Canvas })));

const BackgroundScene = lazy(() =>
  import('./BackgroundScene').then((mod) => ({ default: mod.BackgroundScene })),
);

export const SceneCanvas = () => {
  const [mounted, setMounted] = useState(false);
  const [tier, setTier] = useState<'low' | 'mid' | 'high'>('mid');

  useEffect(() => {
    setTier(getPerformanceTier());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dpr = getDprForTier(tier);

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          dpr={dpr}
          gl={{
            antialias: tier !== 'low',
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ fov: 50, near: 0.1, far: 200, position: [0, 0, 30] }}
          frameloop="always"
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <BackgroundScene tier={tier} />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};
