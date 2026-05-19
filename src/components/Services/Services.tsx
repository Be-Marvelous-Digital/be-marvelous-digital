import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
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
        <FadeIn>
          <div className="services__header">
            <span className="label-text">{t('label')}</span>
            <h2 className="services__title" id="services-heading">
              {t('title')
                .split('\n')
                .map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
            </h2>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="services__grid">
            {items.map((service) => (
              <article key={service.number} className="services__card">
                <span className="services__card-number" aria-hidden="true">
                  {service.number}
                </span>
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
