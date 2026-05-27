'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { getPerformanceTier } from '@/utils/performanceTier';

/**
 * Scroll velocity distortion — subtle skew on fast scroll.
 *
 * NOTE: CSS `filter` (blur) on <main> is intentionally avoided because it
 * creates a new containing block that breaks `position: fixed` inside it
 * (which GSAP ScrollTrigger's `pin` relies on). Only `transform: skewY`
 * is used — it gives the "weighty" feel without breaking pinned sections.
 */
export const ScrollDistortion = () => {
  const lenis = useLenis();
  const intensityRef = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const tier = getPerformanceTier();
    if (tier !== 'high') return;

    const mainEl = document.querySelector('main');
    if (!mainEl) return;
    const main: HTMLElement = mainEl;

    const maxSkew = 0.25;
    const velocityDivisor = 2000;
    let currentSkew = 0;

    function loop() {
      const velocity = lenis?.velocity ?? 0;
      const targetIntensity = Math.min(Math.abs(velocity) / velocityDivisor, 1);

      intensityRef.current += (targetIntensity - intensityRef.current) * 0.12;

      if (intensityRef.current < 0.001) {
        intensityRef.current = 0;
      }

      const skew = intensityRef.current * maxSkew * Math.sign(velocity);

      if (Math.abs(skew - currentSkew) > 0.005) {
        currentSkew = skew;

        if (Math.abs(skew) < 0.005) {
          main.style.transform = '';
        } else {
          main.style.transform = `skewY(${skew.toFixed(3)}deg)`;
        }
      }

      rafId.current = requestAnimationFrame(loop);
    }

    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      main.style.transform = '';
    };
  }, [lenis]);

  return null;
};
