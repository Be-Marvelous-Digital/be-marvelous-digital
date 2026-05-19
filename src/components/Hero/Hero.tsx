import { getTranslations, getLocale } from 'next-intl/server';
import { ShaderAnimation } from '@/components/ui/shader-lines';
import { HeroWordCycler } from './HeroWordCycler';
import './Hero.less';

export const Hero = async () => {
  const t = await getTranslations('hero');
  const locale = await getLocale();

  const stats = [
    { value: '50+', label: t('stats.projects') },
    { value: '8+', label: t('stats.experience') },
    { value: '100%', label: t('stats.communication') },
    { value: '48h', label: t('stats.response') },
  ];

  return (
    <section className="hero" id="hero" aria-label="Hero">
      <div className="hero__bg" aria-hidden="true">
        <ShaderAnimation />
      </div>

      <div className="container hero__container">
        <div className="hero__top-bar">
          <span className="hero__label">{t('badge')}</span>
          <span className="hero__location">{t('location')}</span>
        </div>

        <div className="hero__headline">
          <h1 className="hero__title">
            <span className="hero__title-line hero__title-line--1">{t('line1')}</span>
            <span className="hero__title-line hero__title-line--2">
              <HeroWordCycler locale={locale} />
            </span>
            <span className="hero__title-line hero__title-line--3">{t('line3')}</span>
          </h1>

          <div className="hero__side">
            <p className="hero__description">{t('description')}</p>
            <div className="hero__ctas">
              <a href="#contact" className="btn btn--dark btn--lg">
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
              <a href="#portfolio" className="btn btn--lg hero__cta-outline">
                {t('ctaSecondary')}
              </a>
            </div>
          </div>
        </div>

        <div className="hero__stats" role="list">
          {stats.map(({ value, label }) => (
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
};
