'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getCookieConsent, setCookieConsent } from '@/lib/cookies';
import type { CookiePreferences } from '@/lib/cookies';
import './CookieConsent.less';

interface CookieConsentProps {
  locale: string;
}

export const CookieConsent = ({ locale }: CookieConsentProps) => {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(() => {
    if (typeof document === 'undefined') return false;
    return getCookieConsent() === null;
  });
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({ analytics: false, marketing: false });

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = { analytics: true, marketing: true };
    setCookieConsent(allAccepted);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-update', { detail: allAccepted }));
  }, []);

  const handleRejectAll = useCallback(() => {
    const allRejected: CookiePreferences = { analytics: false, marketing: false };
    setCookieConsent(allRejected);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-update', { detail: allRejected }));
  }, []);

  const handleSave = useCallback(() => {
    setCookieConsent(prefs);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-update', { detail: prefs }));
  }, [prefs]);

  const handleToggleAnalytics = useCallback(() => {
    setPrefs((prev) => ({ ...prev, analytics: !prev.analytics }));
  }, []);

  const handleToggleMarketing = useCallback(() => {
    setPrefs((prev) => ({ ...prev, marketing: !prev.marketing }));
  }, []);

  const handleCustomize = useCallback(() => {
    setShowCustomize(true);
  }, []);

  if (!visible) return null;

  const privacyHref = locale === 'en' ? '/en/privacy-policy' : '/privacy-policy';

  return (
    <div className="cookie-consent" role="dialog" aria-label={t('title')}>
      <div className="cookie-consent__inner">
        <div className="cookie-consent__text">
          <p className="cookie-consent__title">{t('title')}</p>
          <p className="cookie-consent__description">
            {t('description')}{' '}
            <Link href={privacyHref} className="cookie-consent__link">
              {t('privacyLink')}
            </Link>
          </p>
        </div>

        {showCustomize && (
          <div className="cookie-consent__options">
            <label className="cookie-consent__option cookie-consent__option--disabled">
              <span className="cookie-consent__option-info">
                <span className="cookie-consent__option-name">{t('necessary')}</span>
                <span className="cookie-consent__option-desc">{t('necessaryDesc')}</span>
              </span>
              <input type="checkbox" checked disabled />
              <span className="cookie-consent__toggle cookie-consent__toggle--on" />
            </label>

            <label className="cookie-consent__option">
              <span className="cookie-consent__option-info">
                <span className="cookie-consent__option-name">{t('analytics')}</span>
                <span className="cookie-consent__option-desc">{t('analyticsDesc')}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={handleToggleAnalytics}
              />
              <span className={`cookie-consent__toggle${prefs.analytics ? ' cookie-consent__toggle--on' : ''}`} />
            </label>

            <label className="cookie-consent__option">
              <span className="cookie-consent__option-info">
                <span className="cookie-consent__option-name">{t('marketing')}</span>
                <span className="cookie-consent__option-desc">{t('marketingDesc')}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={handleToggleMarketing}
              />
              <span className={`cookie-consent__toggle${prefs.marketing ? ' cookie-consent__toggle--on' : ''}`} />
            </label>
          </div>
        )}

        <div className="cookie-consent__actions">
          {showCustomize ? (
            <button className="btn btn--primary btn--sm" onClick={handleSave}>
              {t('save')}
            </button>
          ) : (
            <>
              <button className="btn btn--primary btn--sm" onClick={handleAcceptAll}>
                {t('acceptAll')}
              </button>
              <button className="btn btn--secondary btn--sm" onClick={handleRejectAll}>
                {t('rejectAll')}
              </button>
              <button className="btn btn--ghost btn--sm" onClick={handleCustomize}>
                {t('customize')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
