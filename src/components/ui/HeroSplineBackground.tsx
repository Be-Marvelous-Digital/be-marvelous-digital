'use client';

import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export const HeroSplineBackground = () => {
  return (
    <div className="hero-spline">
      <Suspense fallback={null}>
        <Spline
          className="hero-spline__scene"
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
        />
      </Suspense>
      <div className="hero-spline__overlay" />
    </div>
  );
};
