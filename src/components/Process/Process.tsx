import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal/SplitTextReveal';
import { ProcessTimeline } from './ProcessTimeline';
import { ProcessSwitch } from './ProcessSwitch';
import './Process.less';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const Process = async () => {
  const t = await getTranslations('process');
  const steps = t.raw('steps') as ProcessStep[];

  const timelineFallback = (
    <section
      className="process section section--surface"
      id="process"
      aria-labelledby="process-heading"
    >
      <div className="container">
        {' '}
        <h2 className="process__heading">Proces</h2>
        <div className="process__header">
          <FadeIn>
            <span className="label-text">{t('label')}</span>
          </FadeIn>
          <SplitTextReveal
            as="h2"
            className="process__title"
            id="process-heading"
            triggerStart="top 88%"
          >
            {t('title')}
          </SplitTextReveal>
        </div>
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

  return <ProcessSwitch steps={steps} fallback={timelineFallback} />;
};
