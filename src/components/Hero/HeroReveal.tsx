'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Orchestrates the hero entrance animation via GSAP.
 * Renders nothing — purely a side-effect component.
 * Must be placed inside the hero section so GSAP targets are in the DOM.
 */
export const HeroReveal = () => {
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      delay: 0.05,
    });

    // 1. Badge + location slide up
    tl.fromTo('.hero__top-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 });

    // 2. Title lines rise from behind clip containers (lines 1 & 3)
    tl.fromTo(
      '.hero__title-inner',
      { yPercent: 108 },
      { yPercent: 0, duration: 1.1, stagger: 0.14 },
      '-=0.35',
    );

    // 3. Line 2 (HeroWordCycler) fades in simultaneously with line 3
    tl.fromTo('.hero__title-line--2', { opacity: 0 }, { opacity: 1, duration: 0.85 }, '-=0.95');

    // 4. Description + CTAs
    tl.fromTo('.hero__side', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.85 }, '-=0.6');

    // 5. Stats stagger in
    tl.fromTo(
      '.hero__stat',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
      '-=0.55',
    );

    // 6. Scroll hint
    tl.fromTo(
      '.hero__scroll-hint',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3',
    );

    return () => {
      tl.kill();
    };
  }, []);

  return null;
};
