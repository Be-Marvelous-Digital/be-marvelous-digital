type PerformanceTier = 'low' | 'mid' | 'high';

let cachedTier: PerformanceTier | null = null;

export function getPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'mid';
  if (cachedTier) return cachedTier;

  const cores = navigator.hardwareConcurrency ?? 2;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (memory <= 2 || cores <= 2) {
    cachedTier = 'low';
  } else if (isMobile) {
    cachedTier = 'mid';
  } else {
    cachedTier = 'high';
  }

  return cachedTier;
}

export function getDprForTier(tier: PerformanceTier): number | [number, number] {
  switch (tier) {
    case 'low':
      return 1;
    case 'mid':
      return [1, 1.5];
    case 'high':
      return [1, 2];
  }
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none)').matches;
}
