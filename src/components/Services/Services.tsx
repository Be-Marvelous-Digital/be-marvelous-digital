import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal/SplitTextReveal';
import './Services.less';

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  highlights: string[];
}

export const Services = async () => {
  const t = await getTranslations('services');
  const items = t.raw('items') as ServiceItem[];

  return (
    <section className="services section" id="services" aria-labelledby="services-heading">
      <div className="container">
        <div className="services__header">
          <FadeIn>
            <span className="label-text">{t('label')}</span>
          </FadeIn>
          <SplitTextReveal
            as="h2"
            className="services__title"
            id="services-heading"
            triggerStart="top 88%"
          >
            {t('title')}
          </SplitTextReveal>
        </div>

        <FadeIn>
          <div className="services__grid">
            {items.map((service) => (
              <article key={service.number} className="services__card">
                <div className="services__card-top">
                  <span className="services__card-number" aria-hidden="true">
                    {service.number}
                  </span>
                  <span className="services__card-arrow" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 16L16 4M16 4H8M16 4v8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="services__card-title">{service.title}</h3>
                <p className="services__card-description">{service.description}</p>
                <ul className="services__card-highlights" aria-label="Key features">
                  {service.highlights.map((item) => (
                    <li key={item} className="services__card-highlight">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
