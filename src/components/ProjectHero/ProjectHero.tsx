'use client';
import { useRef } from 'react';
import { useScroll } from 'motion/react';
import Link from 'next/link';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { ShaderBackground } from '@/components/ui/ShaderBackground';

interface ProjectHeroProps {
  portfolioHref: string;
  backLabel: string;
  category: string;
  name: string;
  description: string;
  pageImage: string;
  url: string;
}

export const ProjectHero = ({
  portfolioHref,
  backLabel,
  category,
  name,
  description,
  pageImage,
  url,
}: ProjectHeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  return (
    <div ref={heroRef} className="project__hero" data-nav-dark>
      <ShaderBackground />
      <div className="project__title-block">
        <Link href={portfolioHref} className="project__back">
          {backLabel}
        </Link>
        <p className="project__category">{category}</p>
        <h1 className="project__name">{name}</h1>
        <p className="project__description">{description}</p>
      </div>
      <MacbookScroll
        src={pageImage}
        showGradient={false}
        url={url}
        scrollYProgress={scrollYProgress}
      />
    </div>
  );
};
