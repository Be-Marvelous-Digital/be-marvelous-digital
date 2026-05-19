'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import { Logo } from '@/components/Logo/Logo';
import { getAlternateHref } from './Navigation.helpers';
import './Navigation.less';

const NAV_LINKS_SK = [
  { href: '/#services', label: 'Služby' },
  { href: '/#portfolio', label: 'Portfólio' },
  { href: '/#process', label: 'Proces' },
  { href: '/#about', label: 'O mne' },
  { href: '/blog', label: 'Blog' },
] as const;

const NAV_LINKS_EN = [
  { href: '/en#services', label: 'Services' },
  { href: '/en#portfolio', label: 'Portfolio' },
  { href: '/en#process', label: 'Process' },
  { href: '/en#about', label: 'About' },
  { href: '/en/blog', label: 'Blog' },
] as const;

interface NavigationProps {
  forceDark?: boolean;
}

export const Navigation = ({ forceDark = false }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIntersecting, setHeroIntersecting] = useState<boolean | null>(null);
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
    const darkElement = document.querySelector('[data-nav-dark]');
    if (!darkElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroIntersecting(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(darkElement);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  const isScrolledState = forceDark || (heroIntersecting !== null ? !heroIntersecting : scrolled);

  return (
    <header className={`navigation ${isScrolledState ? 'navigation--scrolled' : ''}`}>
      <div className="navigation__inner container">
        <Logo
          href={locale === 'en' ? '/en' : '/'}
          className="navigation__logo"
          onClick={closeMenu}
        />

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

        <a
          href={altHref}
          className="navigation__locale-toggle"
          aria-label={`Switch to ${altLocale}`}
        >
          {altLocale}
        </a>

        <button
          className={`navigation__burger ${menuOpen ? 'navigation__burger--open' : ''}`}
          onClick={toggleMenu}
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
        <button className="navigation__mobile-close" onClick={closeMenu} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <nav className="navigation__mobile-links">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="navigation__mobile-link" onClick={closeMenu}>
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
          <a href={altHref} className="navigation__mobile-locale" onClick={closeMenu}>
            {altLocale}
          </a>
        </nav>
      </div>
    </header>
  );
};
