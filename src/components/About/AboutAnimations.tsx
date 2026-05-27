'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouchDevice } from '@/utils/performanceTier';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven animations for the About section:
 * - Photo: parallax shift + animated glowing border
 * - Advantages: blue accent line wipes in from left on each item
 * - Icon boxes: scale + glow pulse on scroll reveal
 *
 * Renders nothing — purely a side-effect component.
 */
export const AboutAnimations = () => {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Skip scroll-driven animations on touch devices for performance
    if (isTouchDevice()) return;

    const timer = setTimeout(() => {
      const section = document.querySelector<HTMLElement>('#about');
      if (!section) return;

      ctxRef.current = gsap.context(() => {
        // ── Photo parallax ──────────────────────────────────────────────
        const photo = section.querySelector<HTMLElement>('.about__photo-wrapper');
        if (photo) {
          gsap.to(photo, {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });

          // Animated glowing border that pulses in
          gsap.fromTo(
            photo,
            {
              boxShadow: '0 0 0px rgba(36, 72, 255, 0), inset 0 0 0px rgba(36, 72, 255, 0)',
            },
            {
              boxShadow: '0 0 40px rgba(36, 72, 255, 0.15), inset 0 0 30px rgba(36, 72, 255, 0.05)',
              ease: 'none',
              scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 1,
              },
            },
          );
        }

        // ── Advantage border wipe ───────────────────────────────────────
        const advantages = section.querySelectorAll<HTMLElement>('.about__advantage');
        advantages.forEach((item, i) => {
          // Animate the border from invisible to accent-colored
          gsap.fromTo(
            item,
            { borderImage: 'linear-gradient(90deg, rgba(36,72,255,0) 0%, transparent 0%) 1' },
            {
              borderImage: 'linear-gradient(90deg, rgba(36,72,255,0.3) 0%, transparent 80%) 1',
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.5,
              },
            },
          );

          // Icon scale + glow
          const icon = item.querySelector<HTMLElement>('.about__advantage-icon');
          if (icon) {
            gsap.fromTo(
              icon,
              { scale: 0.6, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                ease: 'back.out(2)',
                duration: 0.6,
                delay: i * 0.08,
                scrollTrigger: {
                  trigger: item,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              },
            );
          }
        });

        // ── Label accent line ───────────────────────────────────────────
        const label = section.querySelector<HTMLElement>('.about__label');
        if (label) {
          gsap.fromTo(
            label,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: label,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      }, section);
    }, 200);

    return () => {
      clearTimeout(timer);
      ctxRef.current?.revert();
    };
  }, []);

  return null;
};
