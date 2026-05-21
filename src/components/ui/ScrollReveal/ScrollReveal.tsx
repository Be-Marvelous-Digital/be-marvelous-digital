'use client';

import { useRef, useEffect } from 'react';

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
  distance = 32,
  duration = 0.7,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const yFrom = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

    // Set initial hidden state
    el.style.opacity = '0';
    el.style.transform = `translateY(${yFrom}px)`;
    el.style.transition = `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          } else {
            // Reverse when scrolling back up (same as toggleActions: play none none reverse)
            el.style.opacity = '0';
            el.style.transform = `translateY(${yFrom}px)`;
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -15% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, distance, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
