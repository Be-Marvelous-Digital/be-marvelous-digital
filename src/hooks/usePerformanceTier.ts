'use client';

import { useState, useEffect } from 'react';
import { getPerformanceTier } from '@/utils/performanceTier';

type PerformanceTier = 'low' | 'mid' | 'high';

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('mid');

  useEffect(() => {
    setTier(getPerformanceTier());
  }, []);

  return tier;
}
