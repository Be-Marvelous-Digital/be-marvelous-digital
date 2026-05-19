import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { ProcessTimeline } from './ProcessTimeline';
import './Process.less';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const Process = async () => {
  const t = await getTranslations('process');
  const steps = t.raw('steps') as ProcessStep[];

  return (
    <section className="process section section--surface" id="process" aria-labelledby="process-heading">
      <div className="container">
        <FadeIn>
          <div className="process__header">
            <span className="label-text">{t('label')}</span>
            <h2 className="process__title" id="process-heading">
              {t('title').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
          </div>
        </FadeIn>

        <ProcessTimeline>
          {steps.map((step, i) => (
            <li key={step.number} className="process__step">
              <span className="process__step-divider" aria-hidden="true" />
              <FadeIn delay={i * 0.12} direction="up">
                <div className="process__step-inner">
                  <div className="process__step-number" aria-hidden="true">
                    {step.number}
                  </div>
                  <div className="process__step-body">
                    <h3 className="process__step-title">{step.title}</h3>
                    <p className="process__step-description">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            </li>
          ))}
        </ProcessTimeline>
      </div>
    </section>
  );
};
