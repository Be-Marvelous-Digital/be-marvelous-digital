'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouchDevice } from '@/utils/performanceTier';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero "fly past" depth transition.
 *
 * As soon as the user starts scrolling, the hero scales up dramatically
 * and fades to 0 — feels like flying through it toward the screen.
 * The 3D canvas behind is revealed during the transition.
 *
 * Renders nothing — purely a side-effect component.
 */
export const DepthTransitions = () => {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Skip heavy GSAP depth animations on touch devices
    if (isTouchDevice()) return;

    // Delay to let HeroReveal entrance finish
    const timer = setTimeout(() => {
      const hero = document.querySelector<HTMLElement>('.hero');
      if (!hero) return;

      gsap.set(hero, { transformOrigin: '50% 50%', willChange: 'transform, opacity' });

      const wrapper = hero.closest('.hero-sticky-wrapper') as HTMLElement | null;

      const stats = document.querySelector<HTMLElement>('.hero-stats-section');

      ctxRef.current = gsap.context(() => {
        // Hero flies toward the viewer — aggressive ease so opacity
        // reaches 0 well before the wrapper ends (no upward drift visible)
        gsap.to(hero, {
          scale: 3,
          opacity: 0,
          ease: 'power4.in',
          scrollTrigger: {
            trigger: wrapper ?? hero,
            start: 'top top',
            end: '45% top',
            scrub: 0.8,
          },
        });

        // USPs emerge from depth after hero
        if (stats) {
          const statsWrapper = stats.closest('.hero-stats-sticky-wrapper') as HTMLElement | null;

          gsap.set(stats, {
            scale: 0.2,
            opacity: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity',
          });

          gsap.to(stats, {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: statsWrapper ?? stats,
              start: 'top top',
              end: '70% top',
              scrub: 0.8,
            },
          });
        }
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      ctxRef.current?.revert();
    };
  }, []);

  return null;
};
