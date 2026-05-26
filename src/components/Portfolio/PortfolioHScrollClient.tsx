'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioProjects } from '@/data/portfolio';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioHScrollClientProps {
  children?: React.ReactNode;
}

export const PortfolioHScrollClient = ({ children }: PortfolioHScrollClientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'sk';
  const prefix = locale === 'en' ? '/en' : '';

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Calculate the exact translateX needed so the last card's center
      // aligns with the viewport center
      const getScrollDistance = () => {
        const cards = track.querySelectorAll('.portfolio-hscroll__card');
        const lastCard = cards[cards.length - 1] as HTMLElement;
        if (!lastCard) return track.scrollWidth - window.innerWidth;

        // Last card's center relative to the track's left edge
        const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
        // We need to translate the track so lastCardCenter sits at viewport center
        const translateNeeded = lastCardCenter - window.innerWidth / 2;
        return Math.max(0, translateNeeded);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 3,
          start: 'top top',
          end: () => `+=${getScrollDistance() + window.innerHeight}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Ease in at start, linear through middle, ease out at end
      tl.fromTo(
        track,
        { x: 0 },
        {
          x: () => -getScrollDistance(),
          ease: 'power2.inOut',
        },
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="portfolio-hscroll" ref={containerRef} data-nav-dark>
      {children && <div className="portfolio-hscroll__overlay-header">{children}</div>}
      <div className="portfolio-hscroll__track" ref={trackRef}>
        {portfolioProjects.map((project, i) => {
          const description =
            locale === 'sk' && project.descriptionSk ? project.descriptionSk : project.description;

          return (
            <Link
              key={project.id}
              href={`${prefix}/portfolio/${project.id}`}
              className="portfolio-hscroll__card"
              aria-label={`View ${project.name} project`}
            >
              <div className="portfolio-hscroll__card-header">
                <span className="portfolio-hscroll__card-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="portfolio-hscroll__card-tag">{project.category}</span>
              </div>

              <div className="portfolio-hscroll__card-image">
                <Image
                  src={project.pageImage}
                  alt={project.name}
                  fill
                  className="portfolio-hscroll__card-img"
                  sizes="(max-width: 768px) 90vw, 540px"
                  priority={i < 2}
                />
              </div>

              <div className="portfolio-hscroll__card-footer">
                <h3 className="portfolio-hscroll__card-title">{project.name}</h3>
                <p className="portfolio-hscroll__card-desc">{description}</p>
                <span className="portfolio-hscroll__card-cta" aria-hidden="true">
                  View project
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile: swipe hint */}
      <div className="portfolio-hscroll__mobile-hint" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 10h12M12 6l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Swipe to explore</span>
      </div>
    </div>
  );
};
