'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
  className?: string;
  distance?: number;
  duration?: number;
}

export const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  className,
  distance = 44,
  duration = 0.9,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [delay, direction, distance, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
