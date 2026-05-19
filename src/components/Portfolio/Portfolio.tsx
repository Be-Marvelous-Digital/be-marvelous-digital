import { getTranslations, getLocale } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import type { PortfolioCardItem } from '@/components/ui/testimonials-columns-1';
import { PortfolioColumnsClient } from './PortfolioColumnsClient';
import { portfolioProjects } from '@/data/portfolio';
import './Portfolio.less';

export const Portfolio = async () => {
  const t = await getTranslations('portfolio');
  const locale = await getLocale();
  const isSk = locale === 'sk';

  const portfolioItems: PortfolioCardItem[] = portfolioProjects.map((project) => ({
    text: isSk && project.descriptionSk ? project.descriptionSk : project.description,
    image: project.screenshot,
    name: project.name,
    role: project.category,
    url: project.url,
  }));

  return (
    <section
      className="portfolio section section--dark"
      id="portfolio"
      aria-labelledby="portfolio-heading"
    >
      <div className="container">
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

        <FadeIn delay={0.15}>
          <PortfolioColumnsClient
            col1={portfolioItems.slice(0, 2)}
            col2={portfolioItems.slice(2, 4)}
            col3={portfolioItems.slice(4, 6)}
            projectIds={portfolioProjects.map((p) => p.id)}
          />
        </FadeIn>
      </div>
    </section>
  );
};
