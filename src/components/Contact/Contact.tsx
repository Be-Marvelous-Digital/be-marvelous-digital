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
  };

  return (
    <section
      className="contact section section--dark"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="contact__inner">
          {/* Left — copy + quick-contact info */}
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
              <p className="contact__quick-label">{t('emailLabel')}</p>
              <a
                href="mailto:peter@bemarvelousdigital.sk"
                target="_blank"
                className="contact__email-link"
                aria-label="Send an email"
              >
                peter@bemarvelousdigital.sk
              </a>
              <a href="tel:+421949154514" className="contact__phone-link" aria-label="Call me">
                +421 949 154 514
              </a>

              <div className="contact__availability">
                <div className="contact__availability-dot" aria-hidden="true" />
                <span className="contact__availability-text">{t('availability')}</span>
              </div>
            </div>
          </FadeIn>

          {/* Right — contact form */}
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
