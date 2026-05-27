'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import './SplitTextReveal.less';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SplitTextRevealProps {
  children: React.ReactNode;
  /** Split granularity — 'chars' for desktop, 'words' for mobile. Auto-selects by default. */
  splitType?: 'chars' | 'words' | 'lines' | 'auto';
  /** Animation direction */
  direction?: 'up' | 'down';
  /** Stagger delay between elements (seconds) */
  stagger?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Whether to use scrub instead of toggle */
  scrub?: boolean | number;
  /** Additional className */
  className?: string;
  /** Tag to render as */
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  /** HTML id attribute */
  id?: string;
}

export const SplitTextReveal = ({
  children,
  splitType = 'auto',
  direction = 'up',
  stagger,
  duration = 0.8,
  triggerStart = 'top 85%',
  scrub = false,
  className = '',
  as: Tag = 'div',
  id,
}: SplitTextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resolvedSplitType =
      splitType === 'auto' ? (tier === 'high' ? 'chars' : 'words') : splitType;

    const resolvedStagger = stagger ?? (resolvedSplitType === 'chars' ? 0.02 : 0.04);

    const split = new SplitText(el, {
      type: resolvedSplitType === 'chars' ? 'chars,words' : resolvedSplitType,
    });

    const targets =
      resolvedSplitType === 'chars'
        ? split.chars
        : resolvedSplitType === 'words'
          ? split.words
          : split.lines;

    if (!targets || targets.length === 0) {
      split.revert();
      return;
    }

    gsap.set(targets, { yPercent: direction === 'up' ? 110 : -110, opacity: 0 });

    const tween = gsap.to(targets, {
      yPercent: 0,
      opacity: 1,
      duration,
      stagger: resolvedStagger,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        ...(scrub
          ? { scrub: typeof scrub === 'number' ? scrub : 1 }
          : { toggleActions: 'play none none reverse' }),
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [tier, splitType, direction, stagger, duration, triggerStart, scrub]);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLDivElement>}
      className={`split-text-reveal ${className}`}
      id={id}
    >
      {children}
    </Tag>
  );
};
