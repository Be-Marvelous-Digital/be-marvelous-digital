'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { getPerformanceTier } from '@/utils/performanceTier';

const ProcessFlythrough = lazy(() =>
  import('./ProcessFlythrough').then((mod) => ({
    default: mod.ProcessFlythrough,
  })),
);

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessSwitchProps {
  steps: ProcessStep[];
  fallback: React.ReactNode;
}

export const ProcessSwitch = ({ steps, fallback }: ProcessSwitchProps) => {
  const [useFlythrough, setUseFlythrough] = useState(false);

  useEffect(() => {
    const tier = getPerformanceTier();
    setUseFlythrough(tier !== 'low');
  }, []);

  if (!useFlythrough) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={<>{fallback}</>}>
      <ProcessFlythrough steps={steps} />
    </Suspense>
  );
};
