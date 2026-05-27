'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

const MAGNETIC_STRENGTH = 0.35;
const MAGNETIC_SELECTOR = '[data-magnetic]';

export function useMagneticEffect() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    let activeMagnetic: HTMLElement | null = null;
    const mouse = { x: 0, y: 0 };

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!activeMagnetic) return;

      const rect = activeMagnetic.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (mouse.x - cx) * MAGNETIC_STRENGTH;
      const dy = (mouse.y - cy) * MAGNETIC_STRENGTH;

      gsap.to(activeMagnetic, {
        x: dx,
        y: dy,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    function onMouseOver(e: MouseEvent) {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const target = el.closest(MAGNETIC_SELECTOR) as HTMLElement | null;
      if (target) {
        activeMagnetic = target;
      }
    }

    function onMouseOut(e: MouseEvent) {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const target = el.closest(MAGNETIC_SELECTOR) as HTMLElement | null;
      if (target && target === activeMagnetic) {
        gsap.to(activeMagnetic, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
        activeMagnetic = null;
      }
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);
}
