import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal/SplitTextReveal';
import { AboutAnimations } from './AboutAnimations';
import './About.less';

interface Advantage {
  title: string;
  description: string;
}

export const About = async () => {
  const t = await getTranslations('about');
  const advantages = t.raw('advantages') as Advantage[];

  return (
    <section className="about section section--dark" id="about" aria-labelledby="about-heading">
      <AboutAnimations />
      <div className="container">
        <div className="about__layout">
          <FadeIn className="about__left">
            <div className="about__photo-wrapper">
              <Image
                src="/peter.webp"
                alt="Peter Lehocky — freelance web developer"
                fill
                className="about__photo"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <span className="about__label">{t('label')}</span>
            <SplitTextReveal
              as="h2"
              className="about__title"
              id="about-heading"
              triggerStart="top 88%"
            >
              {t('title')}
            </SplitTextReveal>
            <p className="about__intro">{t('intro1')}</p>
            <p className="about__intro">{t('intro2')}</p>
            <a href="#contact" className="btn btn--dark about__cta" data-magnetic>
              {t('cta')}
            </a>
          </FadeIn>

          <div className="about__right">
            <ul className="about__advantages" aria-label="Key advantages">
              {advantages.map(({ title, description }, i) => (
                <li key={title} className="about__advantage">
                  <FadeIn delay={i * 0.1} direction="up">
                    <div className="about__advantage-inner">
                      <div className="about__advantage-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8.5L6.5 12 13 5"
                            stroke="#2448FF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="about__advantage-body">
                        <h3 className="about__advantage-title">{title}</h3>
                        <p className="about__advantage-description">{description}</p>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
