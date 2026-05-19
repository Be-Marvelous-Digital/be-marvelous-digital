'use client';

import { useState, useCallback } from 'react';
import { trackContactFormSubmission } from '@/lib/analytics';
import './ContactForm.less';

interface ContactFormLabels {
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  submitting: string;
  success: string;
  successDetail: string;
  error: string;
  invalidEmail: string;
  invalidPhone: string;
}

interface ContactFormProps {
  labels: ContactFormLabels;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type FieldErrors = {
  email?: string;
  phone?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

export const ContactForm = ({ labels }: ContactFormProps) => {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleFocus = useCallback((name: string) => setFocused(name), []);
  const handleBlur = useCallback(() => setFocused(null), []);

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};

    if (values.email && !EMAIL_REGEX.test(values.email)) {
      errors.email = labels.invalidEmail;
    }

    if (values.phone && !PHONE_REGEX.test(values.phone)) {
      errors.phone = labels.invalidPhone;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [values.email, values.phone, labels.invalidEmail, labels.invalidPhone]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setStatus('loading');
      setErrorMsg('');
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Failed');
        setStatus('success');
        trackContactFormSubmission();
      } catch {
        setStatus('error');
        setErrorMsg(labels.error);
      }
    },
    [values, labels.error, validate],
  );

  const isActive = (field: string) =>
    focused === field || Boolean(values[field as keyof typeof values]);

  if (status === 'success') {
    return (
      <div className="contact-form__success">
        <div className="contact-form__success-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M7 12.5l3.5 3.5 6.5-7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="contact-form__success-title">{labels.success}</p>
        <p className="contact-form__success-detail">{labels.successDetail}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <div className={`contact-form__field${isActive('name') ? ' contact-form__field--active' : ''}`}>
          <input
            type="text"
            id="cf-name"
            name="name"
            className="contact-form__input"
            placeholder=" "
            value={values.name}
            required
            autoComplete="name"
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
          />
          <label htmlFor="cf-name" className="contact-form__label">
            {labels.name}
          </label>
          <span className="contact-form__line" aria-hidden="true" />
        </div>

        <div className={`contact-form__field${isActive('phone') ? ' contact-form__field--active' : ''}${fieldErrors.phone ? ' contact-form__field--error' : ''}`}>
          <input
            type="tel"
            id="cf-phone"
            name="phone"
            className="contact-form__input"
            placeholder=" "
            value={values.phone}
            autoComplete="tel"
            onChange={handleChange}
            onFocus={() => handleFocus('phone')}
            onBlur={handleBlur}
          />
          <label htmlFor="cf-phone" className="contact-form__label">
            {labels.phone}
          </label>
          <span className="contact-form__line" aria-hidden="true" />
          {fieldErrors.phone && (
            <span className="contact-form__field-error" role="alert">{fieldErrors.phone}</span>
          )}
        </div>
      </div>

      <div className={`contact-form__field${isActive('email') ? ' contact-form__field--active' : ''}${fieldErrors.email ? ' contact-form__field--error' : ''}`}>
        <input
          type="email"
          id="cf-email"
          name="email"
          className="contact-form__input"
          placeholder=" "
          value={values.email}
          required
          autoComplete="email"
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
        />
        <label htmlFor="cf-email" className="contact-form__label">
          {labels.email}
        </label>
        <span className="contact-form__line" aria-hidden="true" />
        {fieldErrors.email && (
          <span className="contact-form__field-error" role="alert">{fieldErrors.email}</span>
        )}
      </div>

      <div
        className={`contact-form__field contact-form__field--textarea${isActive('message') ? ' contact-form__field--active' : ''}`}
      >
        <textarea
          id="cf-message"
          name="message"
          className="contact-form__textarea"
          placeholder=" "
          value={values.message}
          required
          rows={5}
          onChange={handleChange}
          onFocus={() => handleFocus('message')}
          onBlur={handleBlur}
        />
        <label htmlFor="cf-message" className="contact-form__label">
          {labels.message}
        </label>
        <span className="contact-form__line" aria-hidden="true" />
        <span className="contact-form__char-count" aria-hidden="true">
          {values.message.length}
        </span>
      </div>

      {status === 'error' && (
        <p className="contact-form__error-msg" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className={`contact-form__submit btn btn--dark btn--lg${status === 'loading' ? ' contact-form__submit--loading' : ''}`}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className="contact-form__spinner" aria-hidden="true" />
            {labels.submitting}
          </>
        ) : (
          <>
            {labels.submit}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
};
