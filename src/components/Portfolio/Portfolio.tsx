import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { PortfolioHScrollClient } from './PortfolioHScrollClient';
import './Portfolio.less';

export const Portfolio = async () => {
  const t = await getTranslations('portfolio');

  return (
    <section className="portfolio section--dark" id="portfolio" aria-labelledby="portfolio-heading">
      <PortfolioHScrollClient>
        <div className="container" data-nav-dark>
          <FadeIn>
            <div className="portfolio__header">
              <span className="label-text portfolio__label">{t('label')}</span>
              <h2 className="portfolio__title" id="portfolio-heading">
                {t('title')
                  .split('\n')
                  .map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
              </h2>
              <p className="portfolio__subtitle">{t('subtitle')}</p>
            </div>
          </FadeIn>
        </div>
      </PortfolioHScrollClient>
    </section>
  );
};
