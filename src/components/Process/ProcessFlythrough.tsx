'use client';

import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPerformanceTier } from '@/utils/performanceTier';
import './ProcessFlythrough.less';

gsap.registerPlugin(ScrollTrigger);

const Canvas = lazy(() => import('@react-three/fiber').then((mod) => ({ default: mod.Canvas })));

const ProcessFlythroughScene = lazy(() =>
  import('./ProcessFlythroughScene').then((mod) => ({
    default: mod.ProcessFlythroughScene,
  })),
);

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessFlythroughProps {
  steps: ProcessStep[];
}

/** Each step lands at a different screen position */
const STEP_POSITIONS: Array<{ align: string; justify: string }> = [
  { align: 'flex-start', justify: 'flex-start' }, // top-left
  { align: 'flex-end', justify: 'flex-end' }, // bottom-right
  { align: 'flex-start', justify: 'flex-end' }, // top-right
  { align: 'flex-end', justify: 'flex-start' }, // bottom-left
];

export const ProcessFlythrough = ({ steps }: ProcessFlythroughProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const tier = useRef(getPerformanceTier());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const stepIndex = Math.min(Math.floor(self.progress * steps.length), steps.length - 1);
          setActiveStep(stepIndex);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [steps.length]);

  const dpr = tier.current === 'low' ? 1 : tier.current === 'mid' ? 1.5 : 2;

  return (
    <section
      className="process-flythrough"
      ref={containerRef}
      id="process"
      aria-label="Development process"
    >
      <div className="process-flythrough__canvas">
        {mounted && (
          <Suspense fallback={null}>
            <Canvas
              dpr={dpr}
              gl={{
                antialias: tier.current !== 'low',
                alpha: true,
                powerPreference: 'high-performance',
              }}
              camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 0] }}
              style={{ pointerEvents: 'none' }}
            >
              <Suspense fallback={null}>
                <ProcessFlythroughScene
                  progressRef={progressRef}
                  tier={tier.current}
                  stepCount={steps.length}
                />
              </Suspense>
            </Canvas>
          </Suspense>
        )}
      </div>

      <h2 className="process-flythrough__heading">Proces</h2>
      <svg
        className="process-flythrough__orbit-shape"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2L22 12L12 22L2 12Z"
          stroke="#2448ff"
          strokeWidth="1.5"
          fill="rgba(36,72,255,0.08)"
        />
      </svg>

      {/* Progress dots */}
      <div className="process-flythrough__progress">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`process-flythrough__progress-dot ${
              i <= activeStep ? 'process-flythrough__progress-dot--active' : ''
            }`}
          />
        ))}
      </div>

      {/* Each step positioned at a different screen location */}
      {steps.map((step, i) => {
        const pos = STEP_POSITIONS[i % STEP_POSITIONS.length];
        const isActive = i === activeStep;

        return (
          <div
            key={step.number}
            className={`process-flythrough__step ${isActive ? 'process-flythrough__step--active' : ''}`}
            style={{
              alignSelf: pos.align,
              justifySelf: pos.justify,
            }}
          >
            <span className="process-flythrough__step-number">{step.number}</span>
            <h3 className="process-flythrough__step-title">{step.title}</h3>
            <p className="process-flythrough__step-desc">{step.description}</p>
          </div>
        );
      })}
    </section>
  );
};
