'use client';

import { useEffect, useRef } from 'react';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';
import './CustomCursor.less';

export const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useMagneticEffect();

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Touch / pointer devices: skip entirely
    if (window.matchMedia('(hover: none)').matches) return;

    const mouse = { x: -200, y: -200 };
    const ringPos = { x: -200, y: -200 };
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // RAF lerp — ring trails the dot
    const loop = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.1;
      ringPos.y += (mouse.y - ringPos.y) * 0.1;

      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;

      rafId = requestAnimationFrame(loop);
    };

    // Hover state — grow ring on interactive elements
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [data-cursor]')) {
        ring.classList.add('cursor__ring--hover');
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [data-cursor]')) {
        ring.classList.remove('cursor__ring--hover');
      }
    };

    // Click flash
    const onClick = () => {
      dot.classList.add('cursor__dot--click');
      setTimeout(() => dot.classList.remove('cursor__dot--click'), 350);
    };

    document.body.classList.add('custom-cursor-active');
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('click', onClick);
    rafId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor__ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor__dot" ref={dotRef} aria-hidden="true" />
    </>
  );
};
