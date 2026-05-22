import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation/Navigation';
import './privacy-policy.less';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

const SECTION_KEYS = [
  'controller',
  'dataCollected',
  'purpose',
  'cookies',
  'retention',
  'sharing',
  'rights',
  'security',
  'children',
  'changes',
  'contact',
] as const;

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy');

  return (
    <>
      <Navigation forceDark />
      <main className="privacy">
        <div className="container">
          <div className="privacy__header">
            <h1 className="privacy__title">{t('title')}</h1>
            <p className="privacy__updated">{t('lastUpdated')}</p>
          </div>

          <div className="privacy__content">
            <p className="privacy__intro">{t('intro')}</p>

            {SECTION_KEYS.map((key) => (
              <section key={key} className="privacy__section">
                <h2 className="privacy__section-title">{t(`sections.${key}.title`)}</h2>
                <div className="privacy__section-body">
                  {t(`sections.${key}.content`)
                    .split('\n\n')
                    .map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
