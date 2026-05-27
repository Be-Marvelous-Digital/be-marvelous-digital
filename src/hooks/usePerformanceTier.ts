'use client';

import { useState } from 'react';
import { getPerformanceTier } from '@/utils/performanceTier';

type PerformanceTier = 'low' | 'mid' | 'high';

export function usePerformanceTier(): PerformanceTier {
  const [tier] = useState<PerformanceTier>(() => {
    if (typeof window === 'undefined') return 'mid';
    return getPerformanceTier();
  });

  return tier;
}
