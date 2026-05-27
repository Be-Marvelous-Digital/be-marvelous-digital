'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { getPerformanceTier } from '@/utils/performanceTier';

gsap.registerPlugin(SplitText);

/**
 * Orchestrates the hero entrance animation via GSAP.
 * Renders nothing — purely a side-effect component.
 * Uses SplitText for per-character title reveals on high-tier devices,
 * per-word on mid/low tier.
 */
export const HeroReveal = () => {
  useEffect(() => {
    const tier = getPerformanceTier();
    const isCharLevel = tier === 'high';

    const titleInners = gsap.utils.toArray<HTMLElement>('.hero__title-inner');
    const splits: SplitText[] = [];

    titleInners.forEach((el) => {
      const split = new SplitText(el, {
        type: isCharLevel ? 'chars,words' : 'words',
      });
      splits.push(split);
    });

    const allTargets = splits.flatMap((s) => (isCharLevel ? (s.chars ?? []) : (s.words ?? [])));

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      delay: 0.05,
    });

    // 1. Badge + location slide up
    tl.fromTo('.hero__top-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 });

    // 2. Title chars/words cascade in from below
    if (allTargets.length > 0) {
      tl.fromTo(
        allTargets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: isCharLevel ? 0.9 : 1.0,
          stagger: isCharLevel ? 0.018 : 0.05,
          ease: 'power4.out',
        },
        '-=0.35',
      );
    }

    // 3. Line 2 (HeroWordCycler) fades in simultaneously
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
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
};
