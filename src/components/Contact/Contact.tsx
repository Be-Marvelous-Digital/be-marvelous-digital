import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { ContactForm } from './ContactForm/ContactForm';
import './Contact.less';

export const Contact = async () => {
  const t = await getTranslations('contact');

  const formLabels = {
    name: t('form.name'),
    email: t('form.email'),
    phone: t('form.phone'),
    message: t('form.message'),
    submit: t('form.submit'),
    submitting: t('form.submitting'),
    success: t('form.success'),
    successDetail: t('form.successDetail'),
    error: t('form.error'),
    invalidEmail: t('form.invalidEmail'),
    invalidPhone: t('form.invalidPhone'),
    required: t('form.required'),
  };

  return (
    <section
      className="contact section section--dark"
      id="contact"
      aria-labelledby="contact-heading"
      data-nav-dark
    >
      {/* ── Big full-width email CTA ─────────────────────────────────────── */}
      <FadeIn>
        <div className="container contact__big-cta">
          <span className="label-text contact__big-label">{t('label')}</span>
          <a
            href="mailto:peter@bemarvelousdigital.sk"
            className="contact__big-email"
            aria-label="Send Peter an email"
          >
            peter@bemarvelousdigital.sk
          </a>
          <a href="tel:+421949154514" className="contact__big-phone" aria-label="Call Peter">
            +421 949 154 514
          </a>
        </div>
      </FadeIn>

      {/* ── Form + left copy ────────────────────────────────────────────── */}
      <div className="container">
        <div className="contact__inner">
          <FadeIn className="contact__left">
            <span className="label-text">{t('label')}</span>
            <h2 className="contact__title" id="contact-heading">
              {t('title')
                .split('\n')
                .map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
            </h2>
            <p className="contact__description">{t('description')}</p>

            <div className="contact__quick">
              <div className="contact__availability">
                <div className="contact__availability-dot" aria-hidden="true" />
                <span className="contact__availability-text">{t('availability')}</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="contact__right" delay={0.15}>
            <div className="contact__form-shell">
              <ContactForm labels={formLabels} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
