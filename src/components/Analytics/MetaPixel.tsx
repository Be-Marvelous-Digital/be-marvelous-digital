'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { getCookieConsent } from '@/lib/cookies';

let marketingConsent = false;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return marketingConsent;
}

function getServerSnapshot() {
  return false;
}

function handleConsentUpdate(e: Event) {
  const detail = (e as CustomEvent).detail;
  marketingConsent = detail.marketing === true;
  listeners.forEach((cb) => cb());
}

export const MetaPixel = () => {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pixelId = ''; // Add Meta Pixel ID here when available

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing?.marketing) {
      marketingConsent = true;
      listeners.forEach((cb) => cb());
    }

    window.addEventListener('cookie-consent-update', handleConsentUpdate);
    return () => window.removeEventListener('cookie-consent-update', handleConsentUpdate);
  }, []);

  if (!pixelId || !enabled) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};
