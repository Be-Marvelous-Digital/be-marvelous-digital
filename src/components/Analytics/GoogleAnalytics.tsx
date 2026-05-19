'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { getCookieConsent } from '@/lib/cookies';

let analyticsConsent = false;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return analyticsConsent;
}

function getServerSnapshot() {
  return false;
}

function handleConsentUpdate(e: Event) {
  const detail = (e as CustomEvent).detail;
  analyticsConsent = detail.analytics === true;
  listeners.forEach((cb) => cb());
}

export const GoogleAnalytics = () => {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing?.analytics) {
      analyticsConsent = true;
      listeners.forEach((cb) => cb());
    }

    window.addEventListener('cookie-consent-update', handleConsentUpdate);
    return () => window.removeEventListener('cookie-consent-update', handleConsentUpdate);
  }, []);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
};
