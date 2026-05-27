import { getTranslations, getLocale } from 'next-intl/server';
import { ShaderAnimation } from '@/components/ui/shader-lines';
import { HeroSplineBackground } from '@/components/ui/HeroSplineBackground';
import { HeroWordCycler } from './HeroWordCycler';
import { HeroReveal } from './HeroReveal';
import { HeroStats } from './HeroStats';
import './Hero.less';

export const Hero = async () => {
  const t = await getTranslations('hero');
  const locale = await getLocale();

  const stats = [
    { value: '50+', label: t('stats.projects') },
    { value: '8+', label: t('stats.experience') },
    { value: '100%', label: t('stats.communication') },
    { value: '0€', label: t('stats.response') },
  ];

  return (
    <>
      <div className="hero-sticky-wrapper">
        <section className="hero" id="hero" aria-label="Hero" data-nav-dark>
          <div className="hero__bg" aria-hidden="true">
            <HeroSplineBackground />
          </div>

          {/* GSAP entrance choreography — renders null, targets hero DOM */}
          <HeroReveal />

          <div className="container hero__container">
            <div className="hero__top-bar">
              <span className="hero__label">{t('badge')}</span>
              <span className="hero__location">{t('location')}</span>
            </div>

            <div className="hero__headline">
              <h1 className="hero__title">
                {/* Lines 1 & 3: overflow clip → GSAP yPercent slide */}
                <span className="hero__title-clip">
                  <span className="hero__title-line hero__title-line--1 hero__title-inner">
                    {t('line1')}
                  </span>
                </span>

                {/* Line 2: cycling word — fades in, no clip (avoids Framer Motion conflict) */}
                <span className="hero__title-line hero__title-line--2">
                  <HeroWordCycler locale={locale} />
                </span>

                <span className="hero__title-clip">
                  <span className="hero__title-line hero__title-line--3 hero__title-inner">
                    {t('line3')}
                  </span>
                </span>
              </h1>

              <div className="hero__side">
                <div className="hero__ctas">
                  <a href="#whyMe" className="btn btn--dark btn--lg" data-magnetic>
                    {t('ctaPrimary')}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <a href="#portfolio" className="btn btn--lg hero__cta-outline" data-magnetic>
                    {t('ctaSecondary')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="hero__scroll-hint" aria-hidden="true">
            <span className="hero__scroll-line" />
            <span className="hero__scroll-text">Scroll</span>
          </div>
        </section>
      </div>

      <div className="hero-stats-sticky-wrapper">
        <section className="hero-stats-section">
          <h2 className="hero__h2">{t('whyMe')}</h2>

          <p className="hero__description">{t('description')}</p>
          <div id="whyMe" className="container">
            <HeroStats stats={stats} />
          </div>
        </section>
      </div>
    </>
  );
};
