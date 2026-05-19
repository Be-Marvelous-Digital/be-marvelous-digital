'use client';

import { useEffect, useRef, useState } from 'react';

const FILL_DURATION = 1800;
const PAUSE_BETWEEN = 400;

interface ProcessTimelineProps {
  children: React.ReactNode;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export const ProcessTimeline = ({ children }: ProcessTimelineProps) => {
  const containerRef = useRef<HTMLOListElement>(null);
  const [started, setStarted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const container = containerRef.current;
    if (!container) return;

    startTimeRef.current = performance.now();

    function tick() {
      const steps = container!.querySelectorAll<HTMLElement>('.process__step');
      const total = steps.length;
      const elapsed = performance.now() - startTimeRef.current;
      const cycleDuration = total * FILL_DURATION + (total - 1) * PAUSE_BETWEEN;
      const loopTime = elapsed % cycleDuration;

      let accumulated = 0;

      steps.forEach((step) => {
        const divider = step.querySelector<HTMLElement>('.process__step-divider');
        if (!divider) return;

        const fillStart = accumulated;
        const fillEnd = fillStart + FILL_DURATION;
        accumulated = fillEnd + PAUSE_BETWEEN;

        let progress: number;

        if (loopTime < fillStart) {
          progress = 0;
        } else if (loopTime >= fillEnd) {
          progress = 1;
        } else {
          progress = easeInOut((loopTime - fillStart) / FILL_DURATION);
        }

        const isActive = loopTime >= fillStart && loopTime < fillEnd;
        const isDone = loopTime >= fillEnd;

        divider.style.setProperty('--progress', String(progress));
        step.classList.toggle('process__step--active', isActive);
        step.classList.toggle('process__step--done', isDone);
      });

      animationRef.current = requestAnimationFrame(tick);
    }

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [started]);

  return (
    <ol ref={containerRef} className="process__steps" aria-label="Development process steps">
      {children}
    </ol>
  );
};
