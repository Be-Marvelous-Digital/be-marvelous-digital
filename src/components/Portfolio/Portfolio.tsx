import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal/SplitTextReveal';
import { PortfolioHScrollClient } from './PortfolioHScrollClient';
import './Portfolio.less';

export const Portfolio = async () => {
  const t = await getTranslations('portfolio');

  return (
    <section className="portfolio section--dark" id="portfolio" aria-labelledby="portfolio-heading">
      <PortfolioHScrollClient>
        <div className="container" data-nav-dark>
          <div className="portfolio__header">
            <FadeIn>
              <span className="label-text portfolio__label">{t('label')}</span>
            </FadeIn>
            <SplitTextReveal
              as="h2"
              className="portfolio__title"
              id="portfolio-heading"
              triggerStart="top bottom"
            >
              {t('title')}
            </SplitTextReveal>
            <FadeIn>
              <p className="portfolio__subtitle">{t('subtitle')}</p>
            </FadeIn>
          </div>
        </div>
      </PortfolioHScrollClient>
    </section>
  );
};
