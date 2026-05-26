'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: string;
  label: string;
}

interface HeroStatsProps {
  stats: Stat[];
}

export const HeroStats = ({ stats }: HeroStatsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Stagger-reveal each stat on scroll
      gsap.to('.hero__stat', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      // Counter animation for numeric values
      container.querySelectorAll<HTMLElement>('.hero__stat-value[data-target]').forEach((el) => {
        const raw = el.dataset.target ?? '';
        const suffix = raw.replace(/[0-9]/g, ''); // e.g. "+" or "%"
        const target = parseInt(raw, 10);
        if (isNaN(target)) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero__stats" role="list" ref={ref}>
      {stats.map(({ value, label }) => {
        // Detect if value is purely numeric + suffix (e.g. "50+", "100%", "8+")
        const numMatch = value.match(/^(\d+)(.*)$/);
        const dataTarget = numMatch ? value : undefined;

        return (
          <div key={label} className="hero__stat" role="listitem">
            <span className="hero__stat-value" data-target={dataTarget}>
              {value}
            </span>
            <span className="hero__stat-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
};
