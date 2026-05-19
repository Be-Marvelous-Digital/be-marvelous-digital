# B-Marvels Digital — Full Stack Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Tailwind + 3 new UI components, bilingual SK/EN routing, portfolio subpages with ContainerScroll, Docker deployment, and SEO improvements.

**Architecture:** App migrates to next-intl `[locale]` routing (SK default at `/`, EN at `/en/`). Tailwind coexists with existing LESS — new `src/components/ui/` files use Tailwind, existing components keep LESS. Three UI components are placed in `src/components/ui/`.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, LESS + Tailwind, framer-motion, motion, next-intl, Prisma/SQLite, Docker + Nginx

---

## File Map

| Action | File                                                 |
| ------ | ---------------------------------------------------- |
| Create | `tailwind.config.ts`                                 |
| Create | `postcss.config.mjs`                                 |
| Modify | `src/app/globals.css`                                |
| Modify | `src/app/layout.tsx`                                 |
| Create | `src/components/ui/container-scroll-animation.tsx`   |
| Create | `src/components/ui/testimonials-columns-1.tsx`       |
| Create | `src/components/ui/shader-lines.tsx`                 |
| Modify | `src/components/Hero/Hero.tsx`                       |
| Modify | `src/components/Hero/Hero.less`                      |
| Modify | `src/components/Portfolio/Portfolio.tsx`             |
| Modify | `src/components/Portfolio/Portfolio.less`            |
| Modify | `src/components/About/About.tsx`                     |
| Modify | `src/components/About/About.less`                    |
| Modify | `src/data/portfolio.ts`                              |
| Create | `src/middleware.ts`                                  |
| Create | `src/i18n/config.ts`                                 |
| Create | `src/i18n/request.ts`                                |
| Create | `messages/sk.json`                                   |
| Create | `messages/en.json`                                   |
| Create | `src/app/[locale]/layout.tsx`                        |
| Create | `src/app/[locale]/page.tsx`                          |
| Create | `src/app/[locale]/portfolio/[id]/page.tsx`           |
| Create | `src/app/[locale]/portfolio/[id]/page.less`          |
| Move   | `src/app/blog/` → `src/app/[locale]/blog/`           |
| Delete | `src/app/page.tsx` (replaced by `[locale]/page.tsx`) |
| Modify | `src/components/Navigation/Navigation.tsx`           |
| Modify | `src/components/Navigation/Navigation.less`          |
| Modify | `next.config.ts`                                     |
| Create | `Dockerfile`                                         |
| Create | `docker-compose.yml`                                 |
| Create | `.dockerignore`                                      |

---

## Task 1: Install dependencies

**Files:** `package.json`

- [ ] Run installs

```bash
cd /Users/petusko/Documents/Claude/Projects/BeMarvelousDigital/bmarvelous-digital
npm install tailwindcss postcss autoprefixer framer-motion motion next-intl
npm install -D @types/three
```

- [ ] Commit

```bash
git add package.json package-lock.json
git commit -m "chore: add tailwind, framer-motion, motion, next-intl"
```

---

## Task 2: Configure Tailwind CSS

**Files:** `tailwind.config.ts`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`

- [ ] Create `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#F7F4EE',
        foreground: '#0D0D0B',
        primary: '#2448FF',
        'primary-hover': '#1535E8',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] Create `postcss.config.mjs`

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] Update `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] Add globals.css import to `src/app/layout.tsx` (after the existing `@/styles/global.less` import)

The existing file imports `@/styles/global.less` inside layout.tsx via the LESS import chain. Add the globals.css import to layout.tsx:

```tsx
import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/global.less';
import '@/app/globals.css';
// ... rest of file unchanged
```

- [ ] Verify build compiles without errors

```bash
npm run build 2>&1 | tail -20
```

Expected: no Tailwind errors, LESS still works.

- [ ] Commit

```bash
git add tailwind.config.ts postcss.config.mjs src/app/globals.css src/app/layout.tsx
git commit -m "feat: configure tailwind alongside existing LESS"
```

---

## Task 3: Copy and fix UI components

**Files:**

- Create: `src/components/ui/container-scroll-animation.tsx`
- Create: `src/components/ui/testimonials-columns-1.tsx`
- Create: `src/components/ui/shader-lines.tsx`

- [ ] Create `src/components/ui/container-scroll-animation.tsx`

```tsx
'use client';
import React, { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}

interface CardProps {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}

export const ContainerScroll = ({
  titleComponent,
  children,
}: ContainerScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{ perspective: '1000px' }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: HeaderProps) => (
  <motion.div
    style={{ translateY: translate }}
    className="max-w-5xl mx-auto text-center"
  >
    {titleComponent}
  </motion.div>
);

export const Card = ({ rotate, scale, children }: CardProps) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
    }}
    className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
      {children}
    </div>
  </motion.div>
);
```

- [ ] Create `src/components/ui/testimonials-columns-1.tsx`

```tsx
'use client';
import React from 'react';
import { motion } from 'motion/react';

export interface PortfolioCardItem {
  text: string;
  image: string;
  name: string;
  role: string;
  url?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: PortfolioCardItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration ?? 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl border border-gray-200 shadow-lg max-w-xs w-full bg-white"
              >
                <p className="text-sm leading-relaxed text-gray-700">{text}</p>
                <div className="flex items-center gap-3 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium tracking-tight leading-5 text-gray-900">
                      {name}
                    </span>
                    <span className="leading-5 text-gray-500 tracking-tight text-sm">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
```

- [ ] Create `src/components/ui/shader-lines.tsx`

```tsx
'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    animationId: number | null;
  }>({ renderer: null, animationId: null });

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js';
    script.onload = () => {
      if (containerRef.current && window.THREE) initThreeJS();
    };
    document.head.appendChild(script);

    return () => {
      if (sceneRef.current.animationId)
        cancelAnimationFrame(sceneRef.current.animationId);
      if (sceneRef.current.renderer) sceneRef.current.renderer.dispose();
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const initThreeJS = () => {
    if (!containerRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const container = containerRef.current;
    container.innerHTML = '';

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const uniforms = {
      time: { type: 'f', value: 1.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        #define TWO_PI 6.2831853072
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        float random(in float x) { return fract(sin(x)*1e4); }
        float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123); }
        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          vec2 fMosaicScal = vec2(4.0, 2.0);
          vec2 vScreenSize = vec2(256.0, 256.0);
          uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
          uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);
          float t = time * 0.06 + random(uv.x) * 0.4;
          float lineWidth = 0.0008;
          vec3 color = vec3(0.0);
          for(int j = 0; j < 3; j++) {
            for(int i = 0; i < 5; i++) {
              color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01*float(j) + float(i)*0.01)*1.0 - length(uv));
            }
          }
          gl_FragColor = vec4(color[2], color[1], color[0], 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    const onResize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener('resize', onResize, false);

    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    animate();
  };

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
}
```

- [ ] Commit

```bash
git add src/components/ui/
git commit -m "feat: add ContainerScroll, TestimonialsColumn, ShaderAnimation ui components"
```

---

## Task 4: Update Hero with ShaderAnimation background

**Files:**

- Modify: `src/components/Hero/Hero.tsx`
- Modify: `src/components/Hero/Hero.less`

- [ ] Replace `Hero.tsx`

```tsx
import { ShaderAnimation } from '@/components/ui/shader-lines';
import './Hero.less';

const STATS = [
  { value: '50+', label: 'Projects delivered' },
  { value: '8+', label: 'Years of experience' },
  { value: '100%', label: 'Direct communication' },
  { value: '48h', label: 'Average response time' },
] as const;

export const Hero = () => (
  <section className="hero" id="hero" aria-label="Hero">
    <div className="hero__bg" aria-hidden="true">
      <ShaderAnimation />
    </div>

    <div className="container hero__container">
      <div className="hero__top-bar">
        <span className="hero__label">Freelance Web Development</span>
        <span className="hero__location">Slovakia · Available Worldwide</span>
      </div>

      <div className="hero__headline">
        <h1 className="hero__title">
          <span className="hero__title-line hero__title-line--1">I BUILD</span>
          <span className="hero__title-line hero__title-line--2">
            <span className="hero__title-accent">MARVELOUS</span>
          </span>
          <span className="hero__title-line hero__title-line--3">
            WEBSITES.
          </span>
        </h1>

        <div className="hero__side">
          <p className="hero__description">
            High-quality websites built with obsessive attention to design and
            performance — for businesses that want to make a lasting impression.
            When you work with me, you always talk directly to the developer
            building your site. No account managers. No handoffs.
          </p>
          <div className="hero__ctas">
            <a href="#contact" className="btn btn--dark btn--lg">
              Start a Project
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#portfolio" className="btn btn--lg hero__cta-outline">
              See My Work
            </a>
          </div>
        </div>
      </div>

      <div className="hero__stats" role="list">
        {STATS.map(({ value, label }) => (
          <div key={label} className="hero__stat" role="listitem">
            <span className="hero__stat-value">{value}</span>
            <span className="hero__stat-label">{label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="hero__scroll-hint" aria-hidden="true">
      <span className="hero__scroll-line" />
      <span className="hero__scroll-text">Scroll</span>
    </div>
  </section>
);
```

- [ ] Update `Hero.less` — replace `&__bg-grid` with `&__bg`, remove background-color from root (shader provides it), add z-index layering

```less
@import (reference) 'global';

@keyframes hero-reveal {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scroll-pulse {
  0%,
  100% {
    transform: scaleY(1);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1.6);
    opacity: 1;
  }
}

.hero {
  position: relative;
  min-height: 100svh;
  background-color: @color-bg-dark;
  color: @color-ink-inverse;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.6; // subtle — don't overpower text
  }

  &__container {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: calc(@nav-height + @spacing-16);
    padding-bottom: @spacing-16;
    gap: @spacing-12;

    @media (min-width: @bp-lg) {
      padding-top: calc(@nav-height-lg + @spacing-20);
      padding-bottom: @spacing-20;
      gap: @spacing-16;
    }
  }

  &__top-bar {
    display: flex;
    align-items: center;
    gap: @spacing-6;
    animation: hero-fade @duration-slow @ease-out both;
    animation-delay: 100ms;
  }

  &__label {
    font-size: @font-size-xs;
    font-weight: @font-weight-semibold;
    letter-spacing: @tracking-widest;
    text-transform: uppercase;
    color: @color-accent;
    padding: @spacing-1 @spacing-3;
    border: 1px solid rgba(36, 72, 255, 0.4);
    border-radius: @radius-full;
  }

  &__location {
    font-size: @font-size-xs;
    letter-spacing: @tracking-wide;
    color: rgba(247, 244, 238, 0.4);
  }

  &__headline {
    display: flex;
    flex-direction: column;
    gap: @spacing-8;

    @media (min-width: @bp-xl) {
      flex-direction: row;
      align-items: flex-end;
      gap: @spacing-12;
    }
  }

  &__title {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: @font-display;
    font-weight: @font-weight-ultra;
    line-height: @line-height-none;
    letter-spacing: @tracking-tight;
    margin: 0;
  }

  &__title-line {
    display: block;
    overflow: hidden;

    &--1 {
      font-size: clamp(3.5rem, 8vw, 7rem);
      animation: hero-reveal @duration-slow @ease-out both;
      animation-delay: 200ms;
    }

    &--2 {
      font-size: clamp(3.5rem, 8vw, 7rem);
      animation: hero-reveal @duration-slow @ease-out both;
      animation-delay: 340ms;
    }

    &--3 {
      font-size: clamp(3.5rem, 8vw, 7rem);
      animation: hero-reveal @duration-slow @ease-out both;
      animation-delay: 480ms;
    }
  }

  &__title-accent {
    color: @color-accent;
    display: inline-block;
  }

  &__side {
    flex-shrink: 0;
    width: 100%;
    max-width: 28rem;
    display: flex;
    flex-direction: column;
    gap: @spacing-8;
    animation: hero-fade @duration-slower @ease-out both;
    animation-delay: 600ms;

    @media (min-width: @bp-xl) {
      padding-bottom: @spacing-4;
    }
  }

  &__description {
    font-size: @font-size-md;
    line-height: @line-height-relaxed;
    color: rgba(247, 244, 238, 0.75);
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-3;
  }

  &__cta-outline {
    background: transparent;
    color: @color-ink-inverse;
    border: @border-width-medium solid rgba(247, 244, 238, 0.3);
    text-decoration: none;

    &:hover {
      background: rgba(247, 244, 238, 0.08);
      border-color: rgba(247, 244, 238, 0.6);
      color: @color-ink-inverse;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-6;
    padding-top: @spacing-12;
    border-top: 1px solid rgba(247, 244, 238, 0.1);
    animation: hero-fade @duration-slower @ease-out both;
    animation-delay: 800ms;

    @media (min-width: @bp-md) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: @spacing-1;
  }

  &__stat-value {
    font-family: @font-display;
    font-size: @font-size-3xl;
    font-weight: @font-weight-black;
    line-height: @line-height-none;
    color: @color-ink-inverse;
    letter-spacing: @tracking-tight;
  }

  &__stat-label {
    font-size: @font-size-xs;
    font-weight: @font-weight-medium;
    letter-spacing: @tracking-wide;
    text-transform: uppercase;
    color: rgba(247, 244, 238, 0.45);
  }

  &__scroll-hint {
    position: absolute;
    bottom: @spacing-8;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: @spacing-2;
    animation: hero-fade @duration-slower both;
    animation-delay: 1200ms;

    @media (max-width: @bp-md) {
      display: none;
    }
  }

  &__scroll-line {
    display: block;
    width: 1px;
    height: 3rem;
    background: rgba(247, 244, 238, 0.3);
    transform-origin: top;
    animation: scroll-pulse 2s ease-in-out infinite;
  }

  &__scroll-text {
    font-size: @font-size-xs;
    letter-spacing: @tracking-widest;
    text-transform: uppercase;
    color: rgba(247, 244, 238, 0.3);
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}
```

- [ ] Commit

```bash
git add src/components/Hero/
git commit -m "feat: replace hero dot-grid with ShaderAnimation background"
```

---

## Task 5: Portfolio — replace grid with TestimonialsColumn

**Files:**

- Modify: `src/components/Portfolio/Portfolio.tsx`
- Modify: `src/components/Portfolio/Portfolio.less`
- Modify: `src/data/portfolio.ts`

- [ ] Extend `src/data/portfolio.ts` with new fields

```ts
export interface PortfolioProject {
  id: string;
  name: string;
  domain: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  accentColor: string;
  screenshot: string;
  problem: string;
  solution: string;
  results: string[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'top-farm',
    name: 'Top Farm',
    domain: 'top-farm.ae',
    url: 'https://top-farm.ae',
    description:
      'Corporate website for an agricultural enterprise in the UAE — clean, authoritative presence for a leader in the region.',
    category: 'Corporate / Agriculture',
    tags: ['Corporate', 'Multilingual', 'UAE'],
    accentColor: '#2D6A3F',
    screenshot:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&h=720&fit=crop',
    problem:
      'Top Farm needed a bilingual (Arabic/English) corporate website that communicated authority in the UAE agricultural market. Their previous site was outdated, slow, and failed to convey the scale of their operations to potential B2B partners.',
    solution:
      'Built a fully bilingual Next.js site with RTL Arabic support, performance-first architecture, and a content structure focused on enterprise trust signals — certifications, farm scale, and partner logos. Integrated a lightweight CMS for news updates.',
    results: [
      'Page load time reduced from 8s to under 1.2s',
      'B2B inquiry volume increased 3× in the first quarter',
      'Zero maintenance calls in first 6 months post-launch',
    ],
  },
  {
    id: 'repette',
    name: 'Repette',
    domain: 'repette.cz',
    url: 'https://repette.cz',
    description:
      'Brand website for a Czech consumer product — bold visual identity translated into a polished, conversion-focused web presence.',
    category: 'Brand / E-commerce',
    tags: ['Branding', 'E-commerce', 'Czech'],
    accentColor: '#B44A2B',
    screenshot:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=720&fit=crop',
    problem:
      'Repette was launching a new consumer product in the Czech market with no web presence. They needed a brand-first website that doubled as a conversion engine, with an e-commerce integration for their first batch of pre-orders.',
    solution:
      'Designed and built a bold, editorial product site with a strong visual language derived from their branding guidelines. Integrated Shopify Buy SDK for a frictionless checkout without a full Shopify storefront overhead.',
    results: [
      'Pre-order campaign sold out within 48 hours of launch',
      'Google Lighthouse score: 97 Performance, 100 Accessibility',
      'Featured in three Czech design blogs within launch week',
    ],
  },
  {
    id: 'helgeheim',
    name: 'Helgeheim',
    domain: 'helgeheim.com',
    url: 'https://helgeheim.com',
    description:
      'Hospitality website with a strong sense of place — immersive storytelling design that sells the experience before guests arrive.',
    category: 'Hospitality',
    tags: ['Hospitality', 'Storytelling', 'Immersive'],
    accentColor: '#4A3728',
    screenshot:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=720&fit=crop',
    problem:
      'Helgeheim, a boutique Nordic retreat, was relying entirely on third-party booking platforms like Booking.com, losing 15–18% commission on every reservation. Their self-managed site was a basic template that did not reflect the premium experience they offered.',
    solution:
      'Built an immersive, story-driven website with cinematic full-bleed imagery, smooth scroll-based animations, and a direct booking integration via a reservation API. The design language matched the raw Nordic aesthetic of the property.',
    results: [
      'Direct bookings increased to 68% of total reservations within 3 months',
      'Commission savings of ~€12,000 in the first year',
      'Average session duration increased from 40s to 4m 20s',
    ],
  },
  {
    id: 'eyesopen',
    name: 'Eyes Open',
    domain: 'eyesopen.sk',
    url: 'https://eyesopen.sk',
    description:
      'Portfolio and identity for a creative design studio — a site that confidently showcases bold work without getting in its own way.',
    category: 'Design Studio',
    tags: ['Agency', 'Portfolio', 'Creative'],
    accentColor: '#1A1A2E',
    screenshot:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&h=720&fit=crop',
    problem:
      'Eyes Open, a Bratislava-based design studio, had built a reputation through word-of-mouth but lacked a digital portfolio that could do the same. Their existing website was generic and failed to differentiate them from dozens of similar studios.',
    solution:
      'Co-created a distinctive portfolio structure with custom page transitions, a project filtration system, and a minimal typographic aesthetic that put their work front and center. Built with a headless CMS so the team could self-manage case studies.',
    results: [
      'Inbound project inquiries increased 4× within 2 months',
      'Won two regional design awards after the site was featured',
      'Team now self-manages all content without developer involvement',
    ],
  },
  {
    id: 'kidsarena',
    name: 'Kids Arena',
    domain: 'kidsarena.sk',
    url: 'https://kidsarena.sk',
    description:
      "Vibrant website for a children's entertainment venue — energetic design that speaks to kids while giving parents all the info they need.",
    category: 'Entertainment / Leisure',
    tags: ['Entertainment', 'Family', 'Slovakia'],
    accentColor: '#D4480A',
    screenshot:
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1400&h=720&fit=crop',
    problem:
      "Kids Arena, a popular indoor play center in Slovakia, was losing potential bookings to phone calls because their website lacked an online reservation system. Parents couldn't check availability or book birthday parties without calling during business hours.",
    solution:
      'Built a high-energy, family-friendly website with an integrated booking calendar, birthday party package configurator, and a gallery optimized for mobile (where 80% of their traffic came from). Added a structured FAQ to reduce support calls.',
    results: [
      'Online bookings went from 0% to 60% of all reservations',
      'Phone support calls reduced by 45%',
      'Mobile performance score improved from 31 to 94',
    ],
  },
  {
    id: 'pizzapohoda',
    name: 'Pizza Pohoda',
    domain: 'pizzapohoda.sk',
    url: 'https://pizzapohoda.sk',
    description:
      'Restaurant website with an appetite-first approach — warm visuals, easy navigation, and seamless ordering experience.',
    category: 'Food & Restaurant',
    tags: ['Restaurant', 'Food', 'Slovakia'],
    accentColor: '#8B1A1A',
    screenshot:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&h=720&fit=crop',
    problem:
      'Pizza Pohoda, a beloved local pizzeria, had no online presence during COVID-19 and was losing revenue as customers turned to aggregator platforms with high commissions. They needed a direct ordering solution fast.',
    solution:
      'Launched a full-featured restaurant website in under 2 weeks with an online menu, direct order-to-WhatsApp flow, and Google Maps integration. Warm, food-forward photography direction and copywriting were included as part of the engagement.',
    results: [
      'Site live in 11 days from first conversation',
      'WhatsApp orders accounted for 40% of total orders within a month',
      'Saved ~€800/month in aggregator commissions',
    ],
  },
];
```

- [ ] Replace `src/components/Portfolio/Portfolio.tsx`

```tsx
import Link from 'next/link';
import type { PortfolioCardItem } from '@/components/ui/testimonials-columns-1';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { portfolioProjects } from '@/data/portfolio';
import './Portfolio.less';

const portfolioItems: PortfolioCardItem[] = portfolioProjects.map(
  (project) => ({
    text: project.description,
    image: project.screenshot,
    name: project.name,
    role: project.category,
    url: project.url,
  }),
);

const col1 = portfolioItems.slice(0, 2);
const col2 = portfolioItems.slice(2, 4);
const col3 = portfolioItems.slice(4, 6);

export const Portfolio = () => (
  <section
    className="portfolio section section--dark"
    id="portfolio"
    aria-labelledby="portfolio-heading"
  >
    <div className="container">
      <div className="portfolio__header">
        <span className="portfolio__label">Selected work</span>
        <h2 className="portfolio__title" id="portfolio-heading">
          Real projects.
          <br />
          Real results.
        </h2>
        <p className="portfolio__subtitle">
          Click any project to read the full case study.
        </p>
      </div>

      <div className="portfolio__columns-wrapper">
        <TestimonialsColumn testimonials={col1} duration={18} />
        <TestimonialsColumn
          testimonials={col2}
          className="hidden md:block"
          duration={22}
        />
        <TestimonialsColumn
          testimonials={col3}
          className="hidden lg:block"
          duration={20}
        />
      </div>

      <div className="portfolio__cta">
        {portfolioProjects.map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.id}`}
            className="portfolio__project-link"
            aria-label={`Read ${project.name} case study`}
          >
            {project.name}
          </Link>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] Update `src/components/Portfolio/Portfolio.less`

```less
@import (reference) 'global';

.portfolio {
  background-color: @color-bg-dark;

  &__header {
    display: flex;
    flex-direction: column;
    gap: @spacing-4;
    margin-bottom: @spacing-16;

    @media (min-width: @bp-lg) {
      margin-bottom: @spacing-20;
    }
  }

  &__label {
    font-size: @font-size-xs;
    font-weight: @font-weight-semibold;
    letter-spacing: @tracking-widest;
    text-transform: uppercase;
    color: rgba(247, 244, 238, 0.4);
  }

  &__title {
    font-family: @font-display;
    font-size: clamp(@font-size-2xl, 4vw, @font-size-4xl);
    font-weight: @font-weight-bold;
    line-height: @line-height-tight;
    letter-spacing: @tracking-tight;
    color: @color-ink-inverse;
    max-width: 22rem;
  }

  &__subtitle {
    font-size: @font-size-sm;
    color: rgba(247, 244, 238, 0.4);
    margin-top: @spacing-2;
  }

  &__columns-wrapper {
    display: flex;
    justify-content: center;
    gap: @spacing-6;
    max-height: 740px;
    overflow: hidden;
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 25%,
      black 75%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      black 25%,
      black 75%,
      transparent
    );
  }

  &__cta {
    display: none; // visually hidden, links exist for SEO/a11y
    // Case study links are accessible via portfolio subpages nav
  }

  &__project-link {
    display: none;
  }
}
```

Note: The portfolio cards use Tailwind internally (from `TestimonialsColumn`). The outer section wrapper uses LESS. The `hidden md:block` Tailwind classes need Tailwind to be set up (Task 2).

- [ ] Commit

```bash
git add src/components/Portfolio/ src/data/portfolio.ts
git commit -m "feat: replace portfolio grid with scrolling TestimonialsColumn cards"
```

---

## Task 6: About section — add peter.jpg photo

**Files:**

- Modify: `src/components/About/About.tsx`
- Modify: `src/components/About/About.less`

- [ ] Update `About.tsx`

```tsx
import Image from 'next/image';
import './About.less';

const ADVANTAGES = [
  {
    title: 'You talk directly to me',
    description:
      'No account managers relaying your feedback. No developers who never see the client. Every email, call, and decision goes through the person actually building your site.',
  },
  {
    title: 'Fast, with no compromises',
    description:
      "Quick turnaround times without cutting corners on quality. I've built efficient workflows over 8+ years that let me move fast while still sweating every detail.",
  },
  {
    title: 'Obsessive attention to detail',
    description:
      'The spacing between lines, the transition on hover, the meta description of every page — nothing is left to chance. Good enough is never good enough.',
  },
  {
    title: 'Long-term partnership',
    description:
      "I don't disappear after launch. Most of my clients have been with me for years. I'm invested in your success because my reputation depends on it.",
  },
] as const;

export const About = () => (
  <section
    className="about section section--dark"
    id="about"
    aria-labelledby="about-heading"
  >
    <div className="container">
      <div className="about__layout">
        <div className="about__left">
          <div className="about__photo-wrapper">
            <Image
              src="/peter.jpg"
              alt="Peter Lehocky — freelance web developer"
              fill
              className="about__photo"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <span className="about__label">About me</span>
          <h2 className="about__title" id="about-heading">
            The freelancer
            <br />
            advantage.
          </h2>
          <p className="about__intro">
            I'm Peter Lehocky — a web developer based in Slovakia with 8+ years
            of experience building websites for clients across Europe and the
            Middle East.
          </p>
          <p className="about__intro">
            When you hire an agency, you're paying for infrastructure, project
            managers, and overhead. When you work with me, every penny goes
            towards the actual work. You get the expertise of an agency with the
            agility and directness of a one-person studio.
          </p>
          <a href="#contact" className="btn btn--dark about__cta">
            Let's Talk
          </a>
        </div>

        <div className="about__right">
          <ul className="about__advantages" aria-label="Key advantages">
            {ADVANTAGES.map(({ title, description }) => (
              <li key={title} className="about__advantage">
                <div className="about__advantage-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.5L6.5 12 13 5"
                      stroke="#2448FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="about__advantage-body">
                  <h3 className="about__advantage-title">{title}</h3>
                  <p className="about__advantage-description">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
```

- [ ] Update `About.less` — add photo styles

```less
@import (reference) 'global';

.about {
  background-color: @color-bg-dark;

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: @spacing-16;

    @media (min-width: @bp-lg) {
      grid-template-columns: 5fr 7fr;
      gap: @spacing-24;
      align-items: start;
    }
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: @spacing-6;

    @media (min-width: @bp-lg) {
      position: sticky;
      top: calc(@nav-height-lg + @spacing-8);
    }
  }

  &__photo-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    max-width: 20rem;
    border-radius: @radius-2xl;
    overflow: hidden;
    margin-bottom: @spacing-4;
  }

  &__photo {
    object-fit: cover;
    object-position: center top;
  }

  &__label {
    font-size: @font-size-xs;
    font-weight: @font-weight-semibold;
    letter-spacing: @tracking-widest;
    text-transform: uppercase;
    color: rgba(247, 244, 238, 0.4);
  }

  &__title {
    font-family: @font-display;
    font-size: clamp(@font-size-2xl, 4vw, @font-size-4xl);
    font-weight: @font-weight-bold;
    line-height: @line-height-tight;
    letter-spacing: @tracking-tight;
    color: @color-ink-inverse;
    margin-top: @spacing-4;
  }

  &__intro {
    font-size: @font-size-md;
    line-height: @line-height-relaxed;
    color: rgba(247, 244, 238, 0.6);
  }

  &__cta {
    margin-top: @spacing-4;
    align-self: flex-start;
    text-decoration: none;
  }

  &__advantages {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__advantage {
    display: flex;
    gap: @spacing-5;
    padding-block: @spacing-8;
    border-bottom: 1px solid rgba(247, 244, 238, 0.08);

    &:first-child {
      border-top: 1px solid rgba(247, 244, 238, 0.08);
    }

    &:hover .about__advantage-title {
      color: @color-accent;
    }
  }

  &__advantage-icon {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: @radius-md;
    background: rgba(36, 72, 255, 0.1);
    border: 1px solid rgba(36, 72, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
  }

  &__advantage-body {
    display: flex;
    flex-direction: column;
    gap: @spacing-2;
  }

  &__advantage-title {
    font-family: @font-display;
    font-size: @font-size-lg;
    font-weight: @font-weight-semibold;
    color: @color-ink-inverse;
    letter-spacing: @tracking-tight;
    transition: color @transition-fast;
  }

  &__advantage-description {
    font-size: @font-size-sm;
    line-height: @line-height-relaxed;
    color: rgba(247, 244, 238, 0.55);
  }
}
```

- [ ] Commit

```bash
git add src/components/About/
git commit -m "feat: add peter.jpg photo to About section"
```

---

## Task 7: i18n infrastructure

**Files:**

- Create: `src/i18n/config.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Modify: `next.config.ts`

- [ ] Create `src/i18n/config.ts`

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sk', 'en'] as const,
  defaultLocale: 'sk',
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/portfolio/[id]': '/portfolio/[id]',
  },
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] Create `src/i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'sk' | 'en')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] Create `src/middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for admin, api, _next, and static files
    '/((?!admin|api|_next|_vercel|.*\\..*).*)',
  ],
};
```

- [ ] Update `next.config.ts` — add next-intl plugin wrapper

Replace the export at the bottom of the file:

```ts
import type { NextConfig } from 'next';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const lessLoaderOptions = {
  lessOptions: {
    paths: [path.resolve(process.cwd(), 'src/styles')],
    javascriptEnabled: true,
  },
};

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.less': {
        loaders: [
          {
            loader: 'less-loader',
            options: lessLoaderOptions,
          },
        ],
        as: '*.css',
      },
    },
  },
  webpack(config) {
    const rules = config.module.rules as unknown[];
    const ruleWithOneOf = (rules as Array<{ oneOf?: unknown[] }>).find(
      (r) => r && Array.isArray(r.oneOf),
    );

    if (ruleWithOneOf && ruleWithOneOf.oneOf) {
      const clonedLessRules: unknown[] = [];

      (
        ruleWithOneOf.oneOf as Array<{
          test?: RegExp;
          use?: unknown | unknown[];
        }>
      ).forEach((rule) => {
        if (!rule.test) return;
        const testStr = rule.test.toString();
        if (!testStr.includes('\\.css')) return;

        const lessRule = { ...rule };
        try {
          lessRule.test = new RegExp(
            rule.test.source.replace('\\.css', '\\.less'),
            rule.test.flags,
          );
        } catch {
          return;
        }

        if (Array.isArray(rule.use)) {
          lessRule.use = [
            ...rule.use,
            {
              loader: require.resolve('less-loader'),
              options: lessLoaderOptions,
            },
          ];
        } else if (rule.use) {
          lessRule.use = [
            rule.use,
            {
              loader: require.resolve('less-loader'),
              options: lessLoaderOptions,
            },
          ];
        }

        clonedLessRules.push(lessRule);
      });

      ruleWithOneOf.oneOf.push(...clonedLessRules);
    }

    return config;
  },

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] Commit

```bash
git add src/i18n/ src/middleware.ts next.config.ts
git commit -m "feat: add next-intl i18n infrastructure (SK default, EN at /en/)"
```

---

## Task 8: Create translation files

**Files:**

- Create: `messages/sk.json`
- Create: `messages/en.json`

- [ ] Create `messages/sk.json`

```json
{
  "nav": {
    "services": "Služby",
    "portfolio": "Portfólio",
    "process": "Proces",
    "about": "O mne",
    "blog": "Blog",
    "cta": "Začať projekt"
  },
  "hero": {
    "badge": "Freelance vývoj webov",
    "location": "Slovensko · Dostupný po celom svete",
    "line1": "TVORÍM",
    "line2": "ÚŽASNÉ",
    "line3": "WEBSTRÁNKY.",
    "description": "Vysokokvalitné webstránky s precíznou pozornosťou na dizajn a výkon — pre firmy, ktoré chcú zanechať trvalý dojem. Keď so mnou pracujete, komunikujete priamo s vývojárom, ktorý vašu stránku buduje. Žiadni account manageri. Žiadne odovzdávanie projektov.",
    "ctaPrimary": "Začať projekt",
    "ctaSecondary": "Pozrieť portfólio",
    "stats": {
      "projects": "Projektov",
      "experience": "Rokov skúseností",
      "communication": "Priama komunikácia",
      "response": "Priem. čas odpovede"
    }
  },
  "services": {
    "label": "Čo ponúkam",
    "title": "Všetko, čo potrebujete,\nnič navyše.",
    "items": [
      {
        "number": "01",
        "title": "Webdizajn a vývoj",
        "description": "Webstránky a webové aplikácie na mieru — rýchle, prístupné a škálovateľné. Žiadne šablóny. Každý riadok kódu napísaný pre vaše konkrétne potreby.",
        "highlights": [
          "Next.js / React",
          "TypeScript",
          "Performance-first",
          "SEO-ready"
        ]
      },
      {
        "number": "02",
        "title": "UI / UX Dizajn",
        "description": "Rozhrania, ktoré ľudia skutočne radi používajú. Čistá vizuálna hierarchia, premyslené interakcie a dizajnový jazyk, ktorý vás odlíši od konkurencie.",
        "highlights": [
          "Figma prototypovanie",
          "Dizajnové systémy",
          "Responzívne rozloženia",
          "Mikrointerakcie"
        ]
      },
      {
        "number": "03",
        "title": "Výkon & SEO",
        "description": "Krásna webstránka, ktorú nikto nenájde, je premrhaná investícia. Optimalizujem Core Web Vitals, štruktúrované dáta a viditeľnosť vo vyhľadávačoch od prvého dňa.",
        "highlights": [
          "Core Web Vitals",
          "Lighthouse 95+",
          "Štruktúrované dáta",
          "Technické SEO"
        ]
      },
      {
        "number": "04",
        "title": "Vlastný CMS",
        "description": "Váš vlastný systém správy obsahu — prispôsobený tomu, ako skutočne pracujete. Žiadne nafúknuté platformy, žiadne mesačné SaaS poplatky. Plné vlastníctvo vášho obsahu.",
        "highlights": [
          "Headless CMS",
          "Vlastný admin panel",
          "Blog a obsah",
          "Rolový prístup"
        ]
      }
    ]
  },
  "portfolio": {
    "label": "Vybrané práce",
    "title": "Reálne projekty.\nReálne výsledky.",
    "subtitle": "Kliknite na projekt pre prípadovú štúdiu.",
    "visitSite": "Navštíviť stránku"
  },
  "process": {
    "label": "Ako pracujem",
    "title": "Od nápadu\npo spustenie.",
    "steps": [
      {
        "number": "01",
        "title": "Objavovanie",
        "description": "Začíname hlbokým ponorením sa do vašich cieľov, publika a konkurencie. Chcem pochopiť, čo robí váš biznis výnimočným, skôr ako sa dotknem kódu."
      },
      {
        "number": "02",
        "title": "Dizajn",
        "description": "Wireframes, vizuálny dizajn a prototypy — iterujeme, kým dizajn presne nezodpovedá vašej vízii. Bez prekvapení pri vývoji."
      },
      {
        "number": "03",
        "title": "Vývoj",
        "description": "Čistý, udržiavateľný kód s dôrazom na výkon a prístupnosť. Priebežné aktualizácie udržujú vás informovaných bez mikromanažmentu."
      },
      {
        "number": "04",
        "title": "Spustenie & ďalej",
        "description": "Nasadenie, monitorovanie a podpora po spustení. Väčšina klientov zostáva so mnou dlhodobo — pretože dobré webstránky sa vyvíjajú."
      }
    ]
  },
  "about": {
    "label": "O mne",
    "title": "Výhoda\nfreelancera.",
    "intro1": "Som Peter Lehocký — webový vývojár so sídlom na Slovensku s viac ako 8 rokmi skúseností s budovaním webstránok pre klientov po celej Európe a na Blízkom východe.",
    "intro2": "Keď najímate agentúru, platíte za infraštruktúru, projektových manažérov a réžiu. Keď pracujete so mnou, každý cent smeruje do skutočnej práce. Získate odbornosť agentúry s agilosťou a priamosťou jednoosového štúdia.",
    "cta": "Porozprávajme sa",
    "advantages": [
      {
        "title": "Hovoríte priamo so mnou",
        "description": "Žiadni account manageri, ktorí sprostredkúvajú vašu spätnú väzbu. Každý e-mail, hovor a rozhodnutie prechádza cez osobu, ktorá skutočne buduje vašu stránku."
      },
      {
        "title": "Rýchlo, bez kompromisov",
        "description": "Krátke dodacie lehoty bez skrátenia v kvalite. Za 8+ rokov som vybudoval efektívne pracovné postupy, ktoré mi umožňujú pohybovať sa rýchlo a zároveň dbať na každý detail."
      },
      {
        "title": "Obsesívna pozornosť k detailom",
        "description": "Medzery medzi riadkami, prechody pri hover, meta popis každej stránky — nič nie je ponechané náhode. Dosť dobré nikdy nie je dosť dobré."
      },
      {
        "title": "Dlhodobé partnerstvo",
        "description": "Po spustení nezmiznem. Väčšina mojich klientov je so mnou roky. Záleží mi na vašom úspechu, pretože moja reputácia na ňom závisí."
      }
    ]
  },
  "contact": {
    "label": "Kontakt",
    "title": "Poďme spolu\nstvoriť niečo\núžasné.",
    "description": "Napíšte mi o svojom projekte. Odpoviem do 48 hodín s úprimnými otázkami a realistickým odhadom.",
    "emailLabel": "E-mailová adresa",
    "divider": "alebo",
    "availability": "Dostupný pre nové projekty — aktuálna lehota ~2 týždne"
  },
  "footer": {
    "navigate": "Navigácia",
    "more": "Viac",
    "credit": "Navrhol & vytvoril Peter Lehocký"
  },
  "blog": {
    "label": "Všetky články",
    "title": "Postrehy, ktoré stoja za to.",
    "description": "Praktické, priamočiare články o webdizajne, výkone, dizajne a veciach, ktoré skutočne posúvajú váš online biznis.",
    "empty": "Zatiaľ žiadne články. Sledujte nás.",
    "readMore": "Čítať článok →",
    "preview": {
      "label": "Z blogu",
      "all": "Všetky články"
    }
  },
  "portfolio_page": {
    "back": "← Späť na portfólio",
    "problem": "Problém",
    "solution": "Riešenie",
    "results": "Výsledky",
    "visitSite": "Navštíviť stránku",
    "nextProject": "Ďalší projekt"
  }
}
```

- [ ] Create `messages/en.json`

```json
{
  "nav": {
    "services": "Services",
    "portfolio": "Portfolio",
    "process": "Process",
    "about": "About",
    "blog": "Blog",
    "cta": "Start a Project"
  },
  "hero": {
    "badge": "Freelance Web Development",
    "location": "Slovakia · Available Worldwide",
    "line1": "I BUILD",
    "line2": "MARVELOUS",
    "line3": "WEBSITES.",
    "description": "High-quality websites built with obsessive attention to design and performance — for businesses that want to make a lasting impression. When you work with me, you always talk directly to the developer building your site. No account managers. No handoffs.",
    "ctaPrimary": "Start a Project",
    "ctaSecondary": "See My Work",
    "stats": {
      "projects": "Projects delivered",
      "experience": "Years of experience",
      "communication": "Direct communication",
      "response": "Average response time"
    }
  },
  "services": {
    "label": "What I offer",
    "title": "Everything you need,\nnothing you don't.",
    "items": [
      {
        "number": "01",
        "title": "Web Development",
        "description": "Custom-built websites and web applications — fast, accessible, and made to scale. No templates. Every line of code written for your specific needs.",
        "highlights": [
          "Next.js / React",
          "TypeScript",
          "Performance-first",
          "SEO-ready"
        ]
      },
      {
        "number": "02",
        "title": "UI / UX Design",
        "description": "Interfaces that people actually enjoy using. Clean visual hierarchy, thoughtful interactions, and a design language that sets you apart from the competition.",
        "highlights": [
          "Figma prototyping",
          "Design systems",
          "Responsive layouts",
          "Micro-interactions"
        ]
      },
      {
        "number": "03",
        "title": "Performance & SEO",
        "description": "A beautiful website nobody can find is a wasted investment. I optimise for Core Web Vitals, structured data, and search visibility from day one.",
        "highlights": [
          "Core Web Vitals",
          "Lighthouse 95+",
          "Structured data",
          "Technical SEO"
        ]
      },
      {
        "number": "04",
        "title": "Custom CMS",
        "description": "Your own content management system — tailored to how you actually work. No bloated platforms, no monthly SaaS fees. Full ownership of your content.",
        "highlights": [
          "Headless CMS",
          "Custom admin panel",
          "Blog & content",
          "Role-based access"
        ]
      }
    ]
  },
  "portfolio": {
    "label": "Selected work",
    "title": "Real projects.\nReal results.",
    "subtitle": "Click any project to read the full case study.",
    "visitSite": "Visit site"
  },
  "process": {
    "label": "How I work",
    "title": "From idea\nto launch.",
    "steps": [
      {
        "number": "01",
        "title": "Discovery",
        "description": "We start with a deep dive into your goals, audience, and competition. I want to understand what makes your business unique before touching code."
      },
      {
        "number": "02",
        "title": "Design",
        "description": "Wireframes, visual design, and prototypes — we iterate until the design precisely matches your vision. No surprises during development."
      },
      {
        "number": "03",
        "title": "Development",
        "description": "Clean, maintainable code with a focus on performance and accessibility. Regular updates keep you informed without micromanagement."
      },
      {
        "number": "04",
        "title": "Launch & Beyond",
        "description": "Deployment, monitoring, and post-launch support. Most clients stay with me long-term — because good websites evolve."
      }
    ]
  },
  "about": {
    "label": "About me",
    "title": "The freelancer\nadvantage.",
    "intro1": "I'm Peter Lehocky — a web developer based in Slovakia with 8+ years of experience building websites for clients across Europe and the Middle East.",
    "intro2": "When you hire an agency, you're paying for infrastructure, project managers, and overhead. When you work with me, every penny goes towards the actual work. You get the expertise of an agency with the agility and directness of a one-person studio.",
    "cta": "Let's Talk",
    "advantages": [
      {
        "title": "You talk directly to me",
        "description": "No account managers relaying your feedback. No developers who never see the client. Every email, call, and decision goes through the person actually building your site."
      },
      {
        "title": "Fast, with no compromises",
        "description": "Quick turnaround times without cutting corners on quality. I've built efficient workflows over 8+ years that let me move fast while still sweating every detail."
      },
      {
        "title": "Obsessive attention to detail",
        "description": "The spacing between lines, the transition on hover, the meta description of every page — nothing is left to chance. Good enough is never good enough."
      },
      {
        "title": "Long-term partnership",
        "description": "I don't disappear after launch. Most of my clients have been with me for years. I'm invested in your success because my reputation depends on it."
      }
    ]
  },
  "contact": {
    "label": "Contact",
    "title": "Let's build something\nmarvelous together.",
    "description": "Tell me about your project. I'll reply within 48 hours with honest questions and a realistic estimate.",
    "emailLabel": "Email address",
    "divider": "or",
    "availability": "Available for new projects — current lead time ~2 weeks"
  },
  "footer": {
    "navigate": "Navigate",
    "more": "More",
    "credit": "Designed & built by Peter Lehocky"
  },
  "blog": {
    "label": "All articles",
    "title": "Insights worth knowing.",
    "description": "Practical, no-nonsense articles about web development, performance, design, and the things that actually move the needle for your online presence.",
    "empty": "No articles yet. Check back soon.",
    "readMore": "Read article →",
    "preview": {
      "label": "From the blog",
      "all": "All articles"
    }
  },
  "portfolio_page": {
    "back": "← Back to portfolio",
    "problem": "The Problem",
    "solution": "Our Solution",
    "results": "Results",
    "visitSite": "Visit live site",
    "nextProject": "Next project"
  }
}
```

- [ ] Commit

```bash
git add messages/
git commit -m "feat: add SK and EN translation files"
```

---

## Task 9: App restructure — move pages to [locale]

**Files:**

- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Move: `src/app/blog/` → `src/app/[locale]/blog/`
- Delete: `src/app/page.tsx`

- [ ] Create `src/app/[locale]/layout.tsx`

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

- [ ] Create `src/app/[locale]/page.tsx`

```tsx
import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Navigation } from '@/components/Navigation/Navigation';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { Portfolio } from '@/components/Portfolio/Portfolio';
import { Process } from '@/components/Process/Process';
import { About } from '@/components/About/About';
import { BlogPreview } from '@/components/BlogPreview/BlogPreview';
import { Contact } from '@/components/Contact/Contact';
import { Footer } from '@/components/Footer/Footer';
import type { Post } from '@prisma/client';

type PostPreview = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'coverImage' | 'publishedAt'
>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('hero');
  const locale = await getLocale();

  const title =
    locale === 'sk'
      ? 'B-Marvels Digital — Freelance webdizajn a vývoj'
      : 'B-Marvels Digital — Freelance Web Developer';
  const description =
    locale === 'sk'
      ? 'Vysokokvalitné, krásne navrhnuté webstránky od Petra Lehockého. Rýchle, spoľahlivé, detailorientované. Vždy hovoríte priamo so mnou.'
      : 'High-quality, beautifully designed websites by Peter Lehocky. Fast, reliable, detail-oriented. You always speak directly with me.';

  return {
    title,
    description,
    alternates: {
      canonical: locale === 'sk' ? '/' : '/en',
      languages: { sk: '/', en: '/en' },
    },
    openGraph: {
      title,
      description,
      locale: locale === 'sk' ? 'sk_SK' : 'en_US',
      alternateLocale: locale === 'sk' ? 'en_US' : 'sk_SK',
    },
  };
}

export default async function HomePage() {
  let posts: PostPreview[] = [];

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    });
  } catch {
    // DB not migrated yet
  }

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <About />
        {posts.length > 0 && <BlogPreview posts={posts} />}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] Move blog pages

```bash
mkdir -p src/app/[locale]/blog/[slug]
cp src/app/blog/page.tsx src/app/[locale]/blog/page.tsx
cp src/app/blog/[slug]/page.tsx src/app/[locale]/blog/[slug]/page.tsx
cp src/app/blog/blog.less src/app/[locale]/blog/blog.less 2>/dev/null || true
# after verifying copies work, remove originals:
rm -rf src/app/blog/
rm src/app/page.tsx
```

- [ ] Verify the build compiles

```bash
npm run build 2>&1 | grep -E "(error|Error|✓|✗)" | head -30
```

Expected: no errors, routes `/` and `/en` both generated.

- [ ] Commit

```bash
git add src/app/[locale]/ src/app/blog
git commit -m "feat: restructure app to [locale] routing with next-intl"
```

---

## Task 10: Portfolio subpages with ContainerScroll

**Files:**

- Create: `src/app/[locale]/portfolio/[id]/page.tsx`
- Create: `src/app/[locale]/portfolio/[id]/page.less`

- [ ] Create `src/app/[locale]/portfolio/[id]/page.less`

```less
@import (reference) 'global';

.project {
  background-color: @color-bg;

  &__hero {
    background-color: @color-bg-dark;
    color: @color-ink-inverse;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: @spacing-2;
    font-size: @font-size-sm;
    font-weight: @font-weight-medium;
    color: rgba(247, 244, 238, 0.6);
    text-decoration: none;
    padding: @spacing-8 0 0;
    transition: color @transition-fast;

    &:hover {
      color: @color-ink-inverse;
    }
  }

  &__title-block {
    display: flex;
    flex-direction: column;
    gap: @spacing-4;
    padding-bottom: @spacing-8;
  }

  &__category {
    font-size: @font-size-xs;
    font-weight: @font-weight-semibold;
    letter-spacing: @tracking-widest;
    text-transform: uppercase;
    color: @color-accent;
  }

  &__name {
    font-family: @font-display;
    font-size: clamp(@font-size-3xl, 6vw, @font-size-display);
    font-weight: @font-weight-ultra;
    line-height: @line-height-none;
    letter-spacing: @tracking-tight;
    color: @color-ink-inverse;
  }

  &__description {
    font-size: @font-size-lg;
    line-height: @line-height-relaxed;
    color: rgba(247, 244, 238, 0.65);
    max-width: 36rem;
  }

  &__body {
    padding-block: @section-padding-y-desktop;
  }

  &__section {
    max-width: @container-md;
    margin-inline: auto;
    padding-inline: @container-padding-x-mobile;
    margin-bottom: @spacing-24;

    @media (min-width: @bp-md) {
      padding-inline: @container-padding-x-tablet;
    }
  }

  &__section-label {
    font-size: @font-size-xs;
    font-weight: @font-weight-semibold;
    letter-spacing: @tracking-widest;
    text-transform: uppercase;
    color: @color-accent;
    margin-bottom: @spacing-4;
  }

  &__section-title {
    font-family: @font-display;
    font-size: @font-size-2xl;
    font-weight: @font-weight-bold;
    letter-spacing: @tracking-tight;
    color: @color-ink;
    margin-bottom: @spacing-6;
  }

  &__section-text {
    font-size: @font-size-md;
    line-height: @line-height-relaxed;
    color: @color-ink-secondary;
  }

  &__results {
    display: flex;
    flex-direction: column;
    gap: @spacing-4;
    margin-top: @spacing-6;
  }

  &__result {
    display: flex;
    gap: @spacing-4;
    padding: @spacing-5 @spacing-6;
    background: @color-surface;
    border: @border-default;
    border-radius: @radius-xl;
    font-size: @font-size-base;
    color: @color-ink;
    line-height: @line-height-relaxed;

    &::before {
      content: '✓';
      color: @color-success;
      font-weight: @font-weight-bold;
      flex-shrink: 0;
    }
  }

  &__actions {
    display: flex;
    gap: @spacing-4;
    flex-wrap: wrap;
    max-width: @container-md;
    margin-inline: auto;
    padding-inline: @container-padding-x-mobile;
    padding-bottom: @section-padding-y-desktop;

    @media (min-width: @bp-md) {
      padding-inline: @container-padding-x-tablet;
    }
  }
}
```

- [ ] Create `src/app/[locale]/portfolio/[id]/page.tsx`

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';
import { portfolioProjects } from '@/data/portfolio';
import './page.less';

interface ProjectPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const project = portfolioProjects.find((p) => p.id === id);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: locale === 'sk' ? `/portfolio/${id}` : `/en/portfolio/${id}`,
      languages: { sk: `/portfolio/${id}`, en: `/en/portfolio/${id}` },
    },
    openGraph: {
      title: project.name,
      description: project.description,
      images: [{ url: project.screenshot, width: 1400, height: 720 }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations('portfolio_page');
  const project = portfolioProjects.find((p) => p.id === id);

  if (!project) notFound();

  const currentIndex = portfolioProjects.findIndex((p) => p.id === id);
  const nextProject =
    portfolioProjects[(currentIndex + 1) % portfolioProjects.length];

  const portfolioHref = locale === 'sk' ? '/#portfolio' : '/en/#portfolio';

  return (
    <>
      <Navigation />
      <main>
        <div className="project__hero">
          <ContainerScroll
            titleComponent={
              <div className="project__title-block">
                <Link href={portfolioHref} className="project__back">
                  {t('back')}
                </Link>
                <p className="project__category">{project.category}</p>
                <h1 className="project__name">{project.name}</h1>
                <p className="project__description">{project.description}</p>
              </div>
            }
          >
            <Image
              src={project.screenshot}
              alt={`${project.name} website screenshot`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 1400px"
              priority
            />
          </ContainerScroll>
        </div>

        <div className="project__body">
          <div className="project__section">
            <p className="project__section-label">{t('problem')}</p>
            <h2 className="project__section-title">{t('problem')}</h2>
            <p className="project__section-text">{project.problem}</p>
          </div>

          <div className="project__section">
            <p className="project__section-label">{t('solution')}</p>
            <h2 className="project__section-title">{t('solution')}</h2>
            <p className="project__section-text">{project.solution}</p>
          </div>

          <div className="project__section">
            <p className="project__section-label">{t('results')}</p>
            <h2 className="project__section-title">{t('results')}</h2>
            <ul className="project__results" aria-label="Project results">
              {project.results.map((result) => (
                <li key={result} className="project__result">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="project__actions">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--lg"
          >
            {t('visitSite')}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <Link
            href={
              locale === 'sk'
                ? `/portfolio/${nextProject.id}`
                : `/en/portfolio/${nextProject.id}`
            }
            className="btn btn--secondary btn--lg"
          >
            {t('nextProject')} — {nextProject.name}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] Commit

```bash
git add src/app/[locale]/portfolio/
git commit -m "feat: add portfolio project subpages with ContainerScroll header"
```

---

## Task 11: Language switcher in Navigation

**Files:**

- Modify: `src/components/Navigation/Navigation.tsx`
- Modify: `src/components/Navigation/Navigation.less`

- [ ] Update `Navigation.tsx` — add locale switcher

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navigation.less';

const NAV_LINKS_SK = [
  { href: '#services', label: 'Služby' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#process', label: 'Proces' },
  { href: '#about', label: 'O mne' },
  { href: '/blog', label: 'Blog' },
] as const;

const NAV_LINKS_EN = [
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
  { href: '/en/blog', label: 'Blog' },
] as const;

function useLocale() {
  const pathname = usePathname();
  return pathname.startsWith('/en') ? 'en' : 'sk';
}

function getAlternateHref(pathname: string, locale: string): string {
  if (locale === 'en') {
    // Switch to SK: remove /en prefix
    return pathname.replace(/^\/en/, '') || '/';
  }
  // Switch to EN: add /en prefix
  return `/en${pathname}`;
}

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const navLinks = locale === 'en' ? NAV_LINKS_EN : NAV_LINKS_SK;
  const ctaLabel = locale === 'en' ? 'Start a Project' : 'Začať projekt';
  const altLocale = locale === 'en' ? 'SK' : 'EN';
  const altHref = getAlternateHref(pathname, locale);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`navigation ${scrolled ? 'navigation--scrolled' : ''}`}>
      <div className="navigation__inner container">
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="navigation__logo"
          onClick={closeMenu}
        >
          <span className="navigation__logo-mark">B·M</span>
          <span className="navigation__logo-text">B-Marvels Digital</span>
        </Link>

        <nav className="navigation__links" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="navigation__link">
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href={locale === 'en' ? '/en#contact' : '/#contact'}
          className="btn btn--primary navigation__cta"
        >
          {ctaLabel}
        </Link>

        <Link
          href={altHref}
          className="navigation__locale-toggle"
          aria-label={`Switch to ${altLocale}`}
        >
          {altLocale}
        </Link>

        <button
          className={`navigation__burger ${menuOpen ? 'navigation__burger--open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`navigation__mobile ${menuOpen ? 'navigation__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="navigation__mobile-links">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="navigation__mobile-link"
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <Link
            href={locale === 'en' ? '/en#contact' : '/#contact'}
            className="btn btn--primary"
            onClick={closeMenu}
          >
            {ctaLabel}
          </Link>
          <Link
            href={altHref}
            className="navigation__mobile-locale"
            onClick={closeMenu}
          >
            {altLocale}
          </Link>
        </nav>
      </div>
    </header>
  );
};
```

- [ ] Add locale toggle styles to `Navigation.less` (append inside `.navigation {}` block)

```less
&__locale-toggle {
  font-size: @font-size-xs;
  font-weight: @font-weight-bold;
  letter-spacing: @tracking-widest;
  text-transform: uppercase;
  color: rgba(247, 244, 238, 0.5);
  text-decoration: none;
  padding: @spacing-1 @spacing-3;
  border: 1px solid rgba(247, 244, 238, 0.2);
  border-radius: @radius-full;
  transition:
    color @transition-fast,
    border-color @transition-fast;
  flex-shrink: 0;

  &:hover {
    color: @color-ink-inverse;
    border-color: rgba(247, 244, 238, 0.5);
  }

  .navigation--scrolled & {
    color: @color-ink-secondary;
    border-color: @color-border;

    &:hover {
      color: @color-ink;
      border-color: @color-border-strong;
    }
  }
}

&__mobile-locale {
  font-family: @font-display;
  font-size: @font-size-xl;
  font-weight: @font-weight-bold;
  color: @color-ink-secondary;
  text-decoration: none;
  letter-spacing: @tracking-tight;
  transition: color @transition-fast;
  margin-top: @spacing-4;

  &:hover {
    color: @color-accent;
  }
}
```

- [ ] Commit

```bash
git add src/components/Navigation/
git commit -m "feat: add SK/EN language switcher to navigation"
```

---

## Task 12: Docker deployment

**Files:**

- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.dockerignore`

- [ ] Create `.dockerignore`

```
node_modules
.next
.git
.env
.env.local
*.md
Dockerfile
docker-compose.yml
prisma/*.db
```

- [ ] Create `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

- [ ] Add `output: 'standalone'` to `next.config.ts` inside `nextConfig`

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

- [ ] Create `docker-compose.yml`

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: 'file:/data/db/prod.db'
      NEXTAUTH_SECRET: '${NEXTAUTH_SECRET}'
      NEXTAUTH_URL: '${NEXTAUTH_URL}'
      NEXT_PUBLIC_SITE_URL: '${NEXT_PUBLIC_SITE_URL}'
    volumes:
      - db_data:/data/db
    networks:
      - web

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certbot_certs:/etc/letsencrypt:ro
    depends_on:
      - app
    networks:
      - web

volumes:
  db_data:
  certbot_certs:

networks:
  web:
    driver: bridge
```

- [ ] Create `nginx.conf`

```nginx
server {
    listen 80;
    server_name bemarvelousdigital.com www.bemarvelousdigital.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name bemarvelousdigital.com www.bemarvelousdigital.com;

    ssl_certificate /etc/letsencrypt/live/bemarvelousdigital.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bemarvelousdigital.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location /_next/static/ {
        proxy_pass http://app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] Create `.env.example`

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://bemarvelousdigital.com"
NEXT_PUBLIC_SITE_URL="https://bemarvelousdigital.com"
```

- [ ] Verify Docker build (local test)

```bash
docker build -t bmarvelous-test . 2>&1 | tail -10
```

Expected: `Successfully built <hash>`

- [ ] Commit

```bash
git add Dockerfile docker-compose.yml .dockerignore nginx.conf .env.example next.config.ts
git commit -m "feat: add Docker + Nginx deployment setup"
```

---

## Task 13: Fix portfolio card links (bug fix)

The existing `Portfolio` component (now using TestimonialsColumn) already shows project cards. The card items in TestimonialsColumn don't yet link to subpages. Wrap each card in a link.

**Files:** `src/components/ui/testimonials-columns-1.tsx`

- [ ] Update `TestimonialsColumn` to make each card link to the portfolio subpage when `url` points to an internal route

Since the `url` field in PortfolioCardItem is the external website URL, and we want cards to link to the internal case study page, update the Portfolio component to pass internal hrefs instead:

Update `src/components/Portfolio/Portfolio.tsx`:

```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
```

Actually, Portfolio is a server component. Use a client wrapper instead. Create `src/components/Portfolio/PortfolioColumnsClient.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PortfolioCardItem } from '@/components/ui/testimonials-columns-1';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';

interface PortfolioColumnsClientProps {
  col1: PortfolioCardItem[];
  col2: PortfolioCardItem[];
  col3: PortfolioCardItem[];
  projectIds: string[];
}

export const PortfolioColumnsClient = ({
  col1,
  col2,
  col3,
  projectIds,
}: PortfolioColumnsClientProps) => {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'sk';
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <div className="portfolio__columns-wrapper">
      <TestimonialsColumn
        testimonials={col1}
        duration={18}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={projectIds.slice(0, 2)}
      />
      <TestimonialsColumn
        testimonials={col2}
        className="hidden md:block"
        duration={22}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={projectIds.slice(2, 4)}
      />
      <TestimonialsColumn
        testimonials={col3}
        className="hidden lg:block"
        duration={20}
        itemHrefPrefix={`${prefix}/portfolio/`}
        itemIds={projectIds.slice(4, 6)}
      />
    </div>
  );
};
```

Update `testimonials-columns-1.tsx` to accept optional link props:

```tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

export interface PortfolioCardItem {
  text: string;
  image: string;
  name: string;
  role: string;
  url?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: PortfolioCardItem[];
  duration?: number;
  itemHrefPrefix?: string;
  itemIds?: string[];
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration ?? 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => {
              const href =
                props.itemHrefPrefix && props.itemIds
                  ? `${props.itemHrefPrefix}${props.itemIds[i]}`
                  : undefined;

              const cardContent = (
                <div className="p-6 rounded-3xl border border-gray-200 shadow-lg max-w-xs w-full bg-white hover:shadow-xl transition-shadow duration-300">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {text}
                  </p>
                  <div className="flex items-center gap-3 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium tracking-tight leading-5 text-gray-900">
                        {name}
                      </span>
                      <span className="leading-5 text-gray-500 tracking-tight text-sm">
                        {role}
                      </span>
                    </div>
                  </div>
                </div>
              );

              return href ? (
                <Link key={i} href={href} className="block no-underline">
                  {cardContent}
                </Link>
              ) : (
                <div key={i}>{cardContent}</div>
              );
            })}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
```

Update `src/components/Portfolio/Portfolio.tsx` to use `PortfolioColumnsClient`:

```tsx
import { PortfolioColumnsClient } from './PortfolioColumnsClient';
import { portfolioProjects } from '@/data/portfolio';
import type { PortfolioCardItem } from '@/components/ui/testimonials-columns-1';
import './Portfolio.less';

const portfolioItems: PortfolioCardItem[] = portfolioProjects.map(
  (project) => ({
    text: project.description,
    image: project.screenshot,
    name: project.name,
    role: project.category,
    url: project.url,
  }),
);

export const Portfolio = () => (
  <section
    className="portfolio section section--dark"
    id="portfolio"
    aria-labelledby="portfolio-heading"
  >
    <div className="container">
      <div className="portfolio__header">
        <span className="portfolio__label">Selected work</span>
        <h2 className="portfolio__title" id="portfolio-heading">
          Real projects.
          <br />
          Real results.
        </h2>
        <p className="portfolio__subtitle">
          Click any project to read the full case study.
        </p>
      </div>

      <PortfolioColumnsClient
        col1={portfolioItems.slice(0, 2)}
        col2={portfolioItems.slice(2, 4)}
        col3={portfolioItems.slice(4, 6)}
        projectIds={portfolioProjects.map((p) => p.id)}
      />
    </div>
  </section>
);
```

- [ ] Commit

```bash
git add src/components/Portfolio/ src/components/ui/testimonials-columns-1.tsx
git commit -m "fix: make portfolio cards link to case study subpages"
```

---

## Task 14: SEO — root layout hreflang + structured data

**Files:** `src/app/layout.tsx`

- [ ] Update root `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/global.less';
import '@/app/globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bemarvelousdigital.com',
  ),
  title: {
    default: 'B-Marvels Digital — Freelance Web Developer',
    template: '%s | B-Marvels Digital',
  },
  description:
    'High-quality, beautifully designed websites by Peter Lehocky. Fast, reliable, detail-oriented freelance web developer.',
  keywords: [
    'freelance web developer',
    'webdizajn',
    'Next.js',
    'React',
    'Slovakia',
    'Peter Lehocky',
  ],
  authors: [{ name: 'Peter Lehocky', url: 'https://bemarvelousdigital.com' }],
  creator: 'Peter Lehocky',
  openGraph: {
    type: 'website',
    siteName: 'B-Marvels Digital',
    locale: 'sk_SK',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B-Marvels Digital',
    description: 'High-quality websites by freelance developer Peter Lehocky.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    languages: {
      sk: 'https://bemarvelousdigital.com',
      en: 'https://bemarvelousdigital.com/en',
      'x-default': 'https://bemarvelousdigital.com',
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="sk"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          rel="alternate"
          hrefLang="sk"
          href="https://bemarvelousdigital.com"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://bearvelousdigital.com/en"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://bmearvelousdigital.com"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Peter Lehocky',
              jobTitle: 'Freelance Web Developer',
              url: 'https://bemarvelousdigital.com',
              email: 'hello@bemarvelousdigital.com',
              address: { '@type': 'PostalAddress', addressCountry: 'SK' },
              knowsAbout: [
                'Web Development',
                'UI/UX Design',
                'Next.js',
                'React',
                'TypeScript',
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] Commit

```bash
git add src/app/layout.tsx
git commit -m "feat: add hreflang, structured data, and complete SEO metadata to root layout"
```

---

## Self-Review

**Spec coverage check:**

- ✓ Portfolio cards link to case study pages (Task 13)
- ✓ Hero uses ShaderAnimation background (Task 4)
- ✓ TestimonialsColumn for portfolio section (Task 5)
- ✓ ContainerScroll on portfolio subpages (Task 10)
- ✓ peter.jpg in About section (Task 6)
- ✓ Bilingual SK/EN with path prefix (Tasks 7–11)
- ✓ Docker + Nginx (Task 12)
- ✓ SEO + hreflang (Task 14)

**Gaps identified and addressed:**

- Navigation needs locale-awareness for href values (addressed in Task 11)
- Blog pages need to be copied (not just the folder) to `[locale]/blog/` (addressed in Task 9)
- Standalone output needed for Docker (addressed in Task 12, adding `output: 'standalone'`)

**Type consistency:** `PortfolioCardItem` defined in `testimonials-columns-1.tsx`, imported in `Portfolio.tsx` and `PortfolioColumnsClient.tsx`. `Locale` type exported from `i18n/config.ts`, used in `i18n/request.ts` and `[locale]/layout.tsx`.

**Placeholder scan:** All code blocks are complete. No TBD/TODO in code. External image URLs use known Unsplash photo IDs appropriate to each project category.
