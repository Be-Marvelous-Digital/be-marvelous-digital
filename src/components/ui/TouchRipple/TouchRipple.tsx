'use client';

import { useEffect } from 'react';
import './TouchRipple.less';

const INTERACTIVE_SELECTOR = 'a, button, [data-interactive], [data-magnetic]';
const RIPPLE_DURATION = 600;

export const TouchRipple = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: none)').matches) return;

    function onTouchStart(e: TouchEvent) {
      const target = (e.target as Element).closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'touch-ripple__wave';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      const needsRelative = getComputedStyle(target).position === 'static';
      if (needsRelative) {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';

      target.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        if (needsRelative) {
          target.style.position = '';
        }
        target.style.overflow = '';
      }, RIPPLE_DURATION);
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return null;
};
