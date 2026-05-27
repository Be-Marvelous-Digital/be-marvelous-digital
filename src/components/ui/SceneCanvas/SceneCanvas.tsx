'use client';

import { Suspense, lazy, useState } from 'react';
import { getPerformanceTier, getDprForTier } from '@/utils/performanceTier';
import './SceneCanvas.less';

const Canvas = lazy(() => import('@react-three/fiber').then((mod) => ({ default: mod.Canvas })));

const BackgroundScene = lazy(() =>
  import('./BackgroundScene').then((mod) => ({ default: mod.BackgroundScene })),
);

export const SceneCanvas = () => {
  const [config] = useState(() => {
    if (typeof window === 'undefined') return null;
    const tier = getPerformanceTier();
    return { tier, dpr: getDprForTier(tier) };
  });

  if (!config) return null;

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          dpr={config.dpr}
          gl={{
            antialias: config.tier !== 'low',
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ fov: 50, near: 0.1, far: 200, position: [0, 0, 30] }}
          frameloop="always"
          style={{ pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            <BackgroundScene tier={config.tier} />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};
