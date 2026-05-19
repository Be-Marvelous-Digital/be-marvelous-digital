# Cookies, Analytics, Meta Pixel & Privacy Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GDPR-compliant cookie consent, Google Analytics, Meta Pixel with form conversion tracking, and a bilingual Privacy Policy page compliant with EU/Slovak regulations.

**Architecture:** Cookie consent bar manages user preferences (analytics/marketing) stored in a cookie. GA and Meta Pixel scripts only load after explicit consent. Form submissions fire conversion events to both platforms. Privacy policy page is a static route under `[locale]/privacy-policy` with full SK/EN content.

**Tech Stack:** Next.js App Router, TypeScript, LESS, next-intl, next/script

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/CookieConsent/CookieConsent.tsx` | Cookie banner UI (client component) |
| Create | `src/components/CookieConsent/CookieConsent.less` | Cookie banner styles |
| Create | `src/lib/cookies.ts` | Cookie consent read/write helpers |
| Create | `src/components/Analytics/GoogleAnalytics.tsx` | GA script loader (client component) |
| Create | `src/components/Analytics/MetaPixel.tsx` | Meta Pixel script loader (client component) |
| Create | `src/lib/analytics.ts` | Unified event tracking helpers (GA + Meta Pixel) |
| Create | `src/app/[locale]/privacy-policy/page.tsx` | Privacy policy page |
| Create | `src/app/[locale]/privacy-policy/privacy-policy.less` | Privacy policy page styles |
| Modify | `src/app/[locale]/layout.tsx` | Add CookieConsent, GoogleAnalytics, MetaPixel |
| Modify | `src/components/Contact/ContactForm/ContactForm.tsx` | Fire conversion events on form submit |
| Modify | `src/components/Footer/Footer.tsx` | Add Privacy Policy link |
| Modify | `messages/en.json` | Add cookie consent + privacy policy translations |
| Modify | `messages/sk.json` | Add cookie consent + privacy policy translations |
| Modify | `.env.example` | Add GA and Meta Pixel env vars |
| Modify | `.env` | Add GA and Meta Pixel env vars (empty placeholders) |

---

## Task 1: Environment Variables

**Files:**
- Modify: `.env.example`
- Modify: `.env`

- [ ] **Step 1: Add env vars to `.env.example`**

Add these lines at the end of `.env.example`:

```
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
```

- [ ] **Step 2: Add env vars to `.env`**

Add same lines at the end of `.env`:

```
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
```

- [ ] **Step 3: Commit**

```bash
git add .env.example .env
git commit -m "chore: add GA and Meta Pixel env vars"
```

---

## Task 2: Cookie Consent Helpers

**Files:**
- Create: `src/lib/cookies.ts`

- [ ] **Step 1: Create cookie consent helpers**

Create `src/lib/cookies.ts`:

```typescript
export type CookiePreferences = {
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_NAME = 'cookie_consent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function getCookieConsent(): CookiePreferences | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match.split('=')[1]));
  } catch {
    return null;
  }
}

export function setCookieConsent(prefs: CookiePreferences): void {
  const value = encodeURIComponent(JSON.stringify(prefs));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function hasConsented(): boolean {
  return getCookieConsent() !== null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cookies.ts
git commit -m "feat: add cookie consent read/write helpers"
```

---

## Task 3: Cookie Consent Banner — Translations

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/sk.json`

- [ ] **Step 1: Add English translations**

Add to `messages/en.json` after the `"portfolio_page"` section (before the closing `}`):

```json
"cookies": {
  "title": "We value your privacy",
  "description": "We use cookies to analyze website traffic and optimize your experience. You can choose which cookies to allow.",
  "acceptAll": "Accept All",
  "rejectAll": "Reject All",
  "customize": "Customize",
  "save": "Save Preferences",
  "necessary": "Necessary",
  "necessaryDesc": "Required for the website to function. Cannot be disabled.",
  "analytics": "Analytics",
  "analyticsDesc": "Help us understand how visitors interact with our website (Google Analytics).",
  "marketing": "Marketing",
  "marketingDesc": "Used to deliver relevant ads and measure campaign effectiveness (Meta Pixel).",
  "privacyLink": "Privacy Policy"
},
"privacy": {
  "title": "Privacy Policy",
  "metaTitle": "Privacy Policy",
  "metaDescription": "Privacy policy for Be Marvelous Digital — how we collect, use, and protect your personal data in compliance with GDPR and Slovak law.",
  "lastUpdated": "Last updated: May 19, 2026",
  "intro": "Be Marvelous Digital (\"we\", \"us\", \"our\"), operated by Peter Lehocky, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you visit our website bemarvelousdigital.com (the \"Website\").",
  "sections": {
    "controller": {
      "title": "1. Data Controller",
      "content": "The data controller responsible for your personal data is:\n\nPeter Lehocky — Be Marvelous Digital\nEmail: hello@bemarvelousdigital.com\n\nAs the data controller, we determine the purposes and means of processing your personal data in accordance with the EU General Data Protection Regulation (GDPR) — Regulation (EU) 2016/679 — and Act No. 18/2018 Coll. on the Protection of Personal Data of the Slovak Republic."
    },
    "dataCollected": {
      "title": "2. Personal Data We Collect",
      "content": "We collect the following personal data:\n\n**a) Contact form submissions**\nWhen you submit our contact form, we collect your: full name, email address, phone number (optional), and project description message.\n\n**b) Analytics data (with consent)**\nWith your explicit consent, we collect anonymized usage data via Google Analytics, including: pages visited, time spent on pages, referral source, device type and browser, approximate geographic location (country/city level).\n\n**c) Marketing data (with consent)**\nWith your explicit consent, Meta Pixel collects data about your interactions with our website to measure the effectiveness of our advertising campaigns on Meta platforms (Facebook, Instagram).\n\n**d) Technical data**\nOur hosting infrastructure automatically logs: IP address (anonymized), browser type and version, operating system, and date/time of access. This data is necessary for the secure operation of the Website."
    },
    "purpose": {
      "title": "3. Purpose and Legal Basis for Processing",
      "content": "We process your personal data for the following purposes:\n\n| Purpose | Legal Basis (GDPR) |\n|---|---|\n| Responding to contact form inquiries | Art. 6(1)(b) — Performance of a contract or pre-contractual steps |\n| Website analytics (Google Analytics) | Art. 6(1)(a) — Your explicit consent |\n| Advertising measurement (Meta Pixel) | Art. 6(1)(a) — Your explicit consent |\n| Website security and operation | Art. 6(1)(f) — Legitimate interest |\n| Legal compliance | Art. 6(1)(c) — Legal obligation |"
    },
    "cookies": {
      "title": "4. Cookies",
      "content": "Our website uses cookies — small text files stored on your device.\n\n**Necessary cookies** are required for the website to function properly (e.g., cookie consent preferences). These do not require consent under Art. 5(3) of the ePrivacy Directive.\n\n**Analytics cookies** (Google Analytics) are only set after you provide explicit consent. They help us understand how visitors use our website.\n\n**Marketing cookies** (Meta Pixel) are only set after you provide explicit consent. They enable us to measure the effectiveness of advertising on Meta platforms.\n\nYou can change your cookie preferences at any time by clearing your browser cookies and revisiting our website."
    },
    "retention": {
      "title": "5. Data Retention",
      "content": "We retain your personal data only for as long as necessary:\n\n- **Contact form data:** Up to 2 years after your last communication, or until you request deletion.\n- **Analytics data:** 14 months (Google Analytics default retention period).\n- **Marketing data:** As governed by Meta's data policies, up to 2 years.\n- **Server logs:** 30 days."
    },
    "sharing": {
      "title": "6. Data Sharing and Transfers",
      "content": "We may share your data with the following third parties:\n\n- **Mailchimp** (The Rocket Science Group LLC) — for processing contact form submissions. Mailchimp is certified under the EU-US Data Privacy Framework.\n- **Google LLC** — for analytics services (Google Analytics). Google is certified under the EU-US Data Privacy Framework.\n- **Meta Platforms, Inc.** — for advertising measurement (Meta Pixel). Meta is certified under the EU-US Data Privacy Framework.\n\nAll third-party processors are bound by data processing agreements and operate in compliance with GDPR requirements. Where data is transferred outside the EEA, appropriate safeguards (Standard Contractual Clauses or adequacy decisions) are in place."
    },
    "rights": {
      "title": "7. Your Rights",
      "content": "Under the GDPR and Slovak Act No. 18/2018 Coll., you have the right to:\n\n- **Access** your personal data (Art. 15 GDPR)\n- **Rectify** inaccurate data (Art. 16 GDPR)\n- **Erase** your data — \"right to be forgotten\" (Art. 17 GDPR)\n- **Restrict** processing (Art. 18 GDPR)\n- **Data portability** (Art. 20 GDPR)\n- **Object** to processing (Art. 21 GDPR)\n- **Withdraw consent** at any time without affecting the lawfulness of prior processing (Art. 7(3) GDPR)\n\nTo exercise any of these rights, contact us at hello@bemarvelousdigital.com. We will respond within 30 days.\n\nYou also have the right to lodge a complaint with the Slovak supervisory authority:\n\nÚrad na ochranu osobných údajov Slovenskej republiky\n(Office for Personal Data Protection of the Slovak Republic)\nHraničná 12, 820 07 Bratislava 27\nWebsite: dataprotection.gov.sk"
    },
    "security": {
      "title": "8. Data Security",
      "content": "We implement appropriate technical and organizational measures to protect your personal data, including: HTTPS encryption for all data in transit, secure hosting infrastructure, access controls limiting data access to authorized personnel only, and regular security updates."
    },
    "children": {
      "title": "9. Children's Privacy",
      "content": "Our Website is not directed at children under 16 years of age. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such data, please contact us and we will delete it promptly."
    },
    "changes": {
      "title": "10. Changes to This Policy",
      "content": "We may update this Privacy Policy from time to time. The updated version will be indicated by the \"Last updated\" date at the top. We encourage you to review this page periodically."
    },
    "contact": {
      "title": "11. Contact",
      "content": "If you have any questions about this Privacy Policy or our data practices, contact us at:\n\nPeter Lehocky — Be Marvelous Digital\nEmail: hello@bemarvelousdigital.com"
    }
  }
}
```

- [ ] **Step 2: Add Slovak translations**

Add to `messages/sk.json` after the `"portfolio_page"` section (before the closing `}`):

```json
"cookies": {
  "title": "Vaše súkromie je pre nás dôležité",
  "description": "Používame cookies na analýzu návštevnosti webu a optimalizáciu vášho zážitku. Môžete si vybrať, ktoré cookies povolíte.",
  "acceptAll": "Prijať všetky",
  "rejectAll": "Odmietnuť všetky",
  "customize": "Prispôsobiť",
  "save": "Uložiť preferencie",
  "necessary": "Nevyhnutné",
  "necessaryDesc": "Potrebné pre fungovanie webstránky. Nie je možné ich vypnúť.",
  "analytics": "Analytické",
  "analyticsDesc": "Pomáhajú nám pochopiť, ako návštevníci používajú web (Google Analytics).",
  "marketing": "Marketingové",
  "marketingDesc": "Slúžia na zobrazovanie relevantných reklám a meranie účinnosti kampaní (Meta Pixel).",
  "privacyLink": "Ochrana osobných údajov"
},
"privacy": {
  "title": "Ochrana osobných údajov",
  "metaTitle": "Ochrana osobných údajov",
  "metaDescription": "Zásady ochrany osobných údajov Be Marvelous Digital — ako zhromažďujeme, používame a chránime vaše osobné údaje v súlade s GDPR a slovenskou legislatívou.",
  "lastUpdated": "Posledná aktualizácia: 19. máj 2026",
  "intro": "Be Marvelous Digital (\"my\", \"nás\", \"náš\"), prevádzkované Petrom Lehockým, sa zaväzuje chrániť vaše súkromie. Tieto zásady ochrany osobných údajov vysvetľujú, ako zhromažďujeme, používame a chránime vaše osobné údaje pri návšteve webstránky bemarvelousdigital.com (\"Webstránka\").",
  "sections": {
    "controller": {
      "title": "1. Prevádzkovateľ",
      "content": "Prevádzkovateľom zodpovedným za vaše osobné údaje je:\n\nPeter Lehocký — Be Marvelous Digital\nEmail: hello@bemarvelousdigital.com\n\nAko prevádzkovateľ určujeme účely a prostriedky spracúvania vašich osobných údajov v súlade s Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR) a Zákonom č. 18/2018 Z. z. o ochrane osobných údajov Slovenskej republiky."
    },
    "dataCollected": {
      "title": "2. Osobné údaje, ktoré zhromažďujeme",
      "content": "Zhromažďujeme nasledovné osobné údaje:\n\n**a) Údaje z kontaktného formulára**\nPri odoslaní kontaktného formulára zhromažďujeme: celé meno, e-mailovú adresu, telefónne číslo (voliteľné) a popis projektu.\n\n**b) Analytické údaje (so súhlasom)**\nS vaším výslovným súhlasom zhromažďujeme anonymizované údaje o používaní cez Google Analytics, vrátane: navštívených stránok, času stráveného na stránkach, zdroja návštevy, typu zariadenia a prehliadača, približnej geografickej polohy (úroveň krajiny/mesta).\n\n**c) Marketingové údaje (so súhlasom)**\nS vaším výslovným súhlasom Meta Pixel zhromažďuje údaje o vašich interakciách s naším webom na meranie účinnosti reklamných kampaní na platformách Meta (Facebook, Instagram).\n\n**d) Technické údaje**\nNaša hostingová infraštruktúra automaticky zaznamenáva: IP adresu (anonymizovanú), typ a verziu prehliadača, operačný systém a dátum/čas prístupu. Tieto údaje sú nevyhnutné pre bezpečnú prevádzku Webstránky."
    },
    "purpose": {
      "title": "3. Účel a právny základ spracúvania",
      "content": "Vaše osobné údaje spracúvame na nasledovné účely:\n\n| Účel | Právny základ (GDPR) |\n|---|---|\n| Odpovede na dotazy z kontaktného formulára | Čl. 6 ods. 1 písm. b) — Plnenie zmluvy alebo predzmluvné opatrenia |\n| Analytika webstránky (Google Analytics) | Čl. 6 ods. 1 písm. a) — Váš výslovný súhlas |\n| Meranie reklamy (Meta Pixel) | Čl. 6 ods. 1 písm. a) — Váš výslovný súhlas |\n| Bezpečnosť a prevádzka webstránky | Čl. 6 ods. 1 písm. f) — Oprávnený záujem |\n| Plnenie zákonných povinností | Čl. 6 ods. 1 písm. c) — Zákonná povinnosť |"
    },
    "cookies": {
      "title": "4. Cookies",
      "content": "Naša webstránka používa cookies — malé textové súbory uložené vo vašom zariadení.\n\n**Nevyhnutné cookies** sú potrebné pre správne fungovanie webstránky (napr. preferencie súhlasu s cookies). Tieto nevyžadujú súhlas podľa čl. 5 ods. 3 smernice ePrivacy.\n\n**Analytické cookies** (Google Analytics) sa nastavujú len po vašom výslovnom súhlase. Pomáhajú nám pochopiť, ako návštevníci používajú web.\n\n**Marketingové cookies** (Meta Pixel) sa nastavujú len po vašom výslovnom súhlase. Umožňujú nám merať účinnosť reklamy na platformách Meta.\n\nSvoje preferencie cookies môžete kedykoľvek zmeniť vymazaním cookies v prehliadači a opätovnou návštevou webstránky."
    },
    "retention": {
      "title": "5. Doba uchovávania údajov",
      "content": "Vaše osobné údaje uchovávame len po nevyhnutne potrebnú dobu:\n\n- **Údaje z kontaktného formulára:** Až 2 roky od poslednej komunikácie, alebo do vymazania na vašu žiadosť.\n- **Analytické údaje:** 14 mesiacov (predvolená doba uchovávania Google Analytics).\n- **Marketingové údaje:** V súlade s pravidlami Meta, až 2 roky.\n- **Serverové záznamy:** 30 dní."
    },
    "sharing": {
      "title": "6. Zdieľanie a prenos údajov",
      "content": "Vaše údaje môžeme zdieľať s nasledovnými tretími stranami:\n\n- **Mailchimp** (The Rocket Science Group LLC) — na spracovanie odoslaní kontaktného formulára. Mailchimp je certifikovaný v rámci EU-US Data Privacy Framework.\n- **Google LLC** — na analytické služby (Google Analytics). Google je certifikovaný v rámci EU-US Data Privacy Framework.\n- **Meta Platforms, Inc.** — na meranie reklamy (Meta Pixel). Meta je certifikovaná v rámci EU-US Data Privacy Framework.\n\nVšetci spracovatelia tretích strán sú viazaní zmluvami o spracúvaní údajov a pôsobia v súlade s požiadavkami GDPR. V prípade prenosu údajov mimo EHP sú zavedené primerané záruky (štandardné zmluvné doložky alebo rozhodnutia o primeranosti)."
    },
    "rights": {
      "title": "7. Vaše práva",
      "content": "Podľa GDPR a Zákona č. 18/2018 Z. z. máte právo na:\n\n- **Prístup** k osobným údajom (čl. 15 GDPR)\n- **Opravu** nesprávnych údajov (čl. 16 GDPR)\n- **Vymazanie** údajov — „právo na zabudnutie" (čl. 17 GDPR)\n- **Obmedzenie** spracúvania (čl. 18 GDPR)\n- **Prenosnosť** údajov (čl. 20 GDPR)\n- **Namietanie** proti spracúvaniu (čl. 21 GDPR)\n- **Odvolanie súhlasu** kedykoľvek bez vplyvu na zákonnosť predchádzajúceho spracúvania (čl. 7 ods. 3 GDPR)\n\nNa uplatnenie týchto práv nás kontaktujte na hello@bemarvelousdigital.com. Odpovieme do 30 dní.\n\nMáte tiež právo podať sťažnosť dozornému orgánu:\n\nÚrad na ochranu osobných údajov Slovenskej republiky\nHraničná 12, 820 07 Bratislava 27\nWebstránka: dataprotection.gov.sk"
    },
    "security": {
      "title": "8. Bezpečnosť údajov",
      "content": "Uplatňujeme primerané technické a organizačné opatrenia na ochranu vašich osobných údajov, vrátane: HTTPS šifrovania pre všetky prenášané údaje, bezpečnej hosťingovej infraštruktúry, prístupových kontrol obmedzujúcich prístup k údajom len oprávneným osobám a pravidelných bezpečnostných aktualizácií."
    },
    "children": {
      "title": "9. Ochrana súkromia detí",
      "content": "Naša Webstránka nie je určená deťom mladším ako 16 rokov. Vedome nezhromažďujeme osobné údaje od detí. Ak sa domnievate, že sme takéto údaje neúmyselne zhromaždili, kontaktujte nás a bezodkladne ich vymažeme."
    },
    "changes": {
      "title": "10. Zmeny týchto zásad",
      "content": "Tieto zásady ochrany osobných údajov môžeme priebežne aktualizovať. Aktualizovaná verzia bude označená dátumom „Posledná aktualizácia" v hornej časti. Odporúčame pravidelne túto stránku kontrolovať."
    },
    "contact": {
      "title": "11. Kontakt",
      "content": "Ak máte akékoľvek otázky ohľadom týchto zásad ochrany osobných údajov alebo našich postupov spracovania údajov, kontaktujte nás:\n\nPeter Lehocký — Be Marvelous Digital\nEmail: hello@bemarvelousdigital.com"
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add messages/en.json messages/sk.json
git commit -m "feat: add cookie consent and privacy policy translations (SK/EN)"
```

---

## Task 4: Cookie Consent Banner — Component

**Files:**
- Create: `src/components/CookieConsent/CookieConsent.tsx`
- Create: `src/components/CookieConsent/CookieConsent.less`

- [ ] **Step 1: Create CookieConsent component**

Create `src/components/CookieConsent/CookieConsent.tsx`:

```tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({ analytics: false, marketing: false });

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

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
```

- [ ] **Step 2: Create CookieConsent styles**

Create `src/components/CookieConsent/CookieConsent.less`:

```less
@import (reference) '../../styles/global.less';

.cookie-consent {
  position: fixed;
  bottom: @spacing-5;
  left: @spacing-5;
  right: @spacing-5;
  z-index: @z-toast;
  animation: cookie-slide-up @duration-slow @ease-out both;

  @media (min-width: @bp-md) {
    left: auto;
    right: @spacing-8;
    max-width: 28rem;
  }

  &__inner {
    background: @color-surface;
    border: @border-default;
    border-radius: @radius-xl;
    padding: @spacing-6;
    box-shadow: @shadow-xl;
  }

  &__text {
    margin-bottom: @spacing-5;
  }

  &__title {
    font-family: @font-display;
    font-size: @font-size-lg;
    font-weight: @font-weight-semibold;
    color: @color-ink;
    margin-bottom: @spacing-2;
  }

  &__description {
    font-size: @font-size-sm;
    line-height: @line-height-normal;
    color: @color-ink-secondary;
  }

  &__link {
    color: @color-accent;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: @color-accent-hover;
    }
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: @spacing-3;
    margin-bottom: @spacing-5;
    padding-top: @spacing-4;
    border-top: @border-default;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: @spacing-4;
    cursor: pointer;

    &--disabled {
      cursor: default;
      opacity: 0.7;
    }

    input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  &__option-info {
    display: flex;
    flex-direction: column;
    gap: @spacing-0-5;
  }

  &__option-name {
    font-size: @font-size-sm;
    font-weight: @font-weight-semibold;
    color: @color-ink;
  }

  &__option-desc {
    font-size: @font-size-xs;
    color: @color-ink-tertiary;
    line-height: @line-height-normal;
  }

  &__toggle {
    flex-shrink: 0;
    width: 2.75rem;
    height: 1.5rem;
    border-radius: @radius-full;
    background: @color-border;
    position: relative;
    transition: background @transition-fast;

    &::after {
      content: '';
      position: absolute;
      top: 0.1875rem;
      left: 0.1875rem;
      width: 1.125rem;
      height: 1.125rem;
      border-radius: @radius-full;
      background: @color-surface;
      box-shadow: @shadow-xs;
      transition: transform @transition-fast;
    }

    &--on {
      background: @color-accent;

      &::after {
        transform: translateX(1.25rem);
      }
    }
  }

  &__actions {
    display: flex;
    gap: @spacing-2;
    flex-wrap: wrap;
  }
}

@keyframes cookie-slide-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CookieConsent/
git commit -m "feat: add cookie consent banner component with customizable preferences"
```

---

## Task 5: Google Analytics Component

**Files:**
- Create: `src/components/Analytics/GoogleAnalytics.tsx`

- [ ] **Step 1: Create GoogleAnalytics component**

Create `src/components/Analytics/GoogleAnalytics.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsent } from '@/lib/cookies';

export const GoogleAnalytics = () => {
  const [enabled, setEnabled] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing?.analytics) {
      setEnabled(true);
    }

    function handleConsentUpdate(e: Event) {
      const detail = (e as CustomEvent).detail;
      setEnabled(detail.analytics === true);
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Analytics/GoogleAnalytics.tsx
git commit -m "feat: add Google Analytics component with consent gating"
```

---

## Task 6: Meta Pixel Component

**Files:**
- Create: `src/components/Analytics/MetaPixel.tsx`

- [ ] **Step 1: Create MetaPixel component**

Create `src/components/Analytics/MetaPixel.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsent } from '@/lib/cookies';

export const MetaPixel = () => {
  const [enabled, setEnabled] = useState(false);
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    const existing = getCookieConsent();
    if (existing?.marketing) {
      setEnabled(true);
    }

    function handleConsentUpdate(e: Event) {
      const detail = (e as CustomEvent).detail;
      setEnabled(detail.marketing === true);
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Analytics/MetaPixel.tsx
git commit -m "feat: add Meta Pixel component with consent gating"
```

---

## Task 7: Analytics Event Tracking Helpers

**Files:**
- Create: `src/lib/analytics.ts`

- [ ] **Step 1: Create analytics event helpers**

Create `src/lib/analytics.ts`:

```typescript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackContactFormSubmission(): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'contact',
      event_label: 'contact_form_submission',
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Lead');
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/analytics.ts
git commit -m "feat: add unified analytics event tracking helpers"
```

---

## Task 8: Wire Contact Form to Fire Conversion Events

**Files:**
- Modify: `src/components/Contact/ContactForm/ContactForm.tsx`

- [ ] **Step 1: Add conversion tracking to form submission**

In `src/components/Contact/ContactForm/ContactForm.tsx`:

1. Add import at top (after existing imports):
```typescript
import { trackContactFormSubmission } from '@/lib/analytics';
```

2. In the `handleSubmit` callback, add `trackContactFormSubmission()` after `setStatus('success')` on line 50:
```typescript
setStatus('success');
trackContactFormSubmission();
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Contact/ContactForm/ContactForm.tsx
git commit -m "feat: fire GA and Meta Pixel conversion events on contact form submission"
```

---

## Task 9: Wire Analytics & Cookie Consent into Locale Layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add components to locale layout**

Update `src/app/[locale]/layout.tsx` to:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics';
import { MetaPixel } from '@/components/Analytics/MetaPixel';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <GoogleAnalytics />
      <MetaPixel />
      {children}
      <CookieConsent locale={locale} />
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: wire cookie consent, Google Analytics, and Meta Pixel into locale layout"
```

---

## Task 10: Privacy Policy Page

**Files:**
- Create: `src/app/[locale]/privacy-policy/page.tsx`
- Create: `src/app/[locale]/privacy-policy/privacy-policy.less`

- [ ] **Step 1: Create privacy policy page**

Create `src/app/[locale]/privacy-policy/page.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
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
              <h2 className="privacy__section-title">
                {t(`sections.${key}.title`)}
              </h2>
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
  );
}
```

- [ ] **Step 2: Create privacy policy styles**

Create `src/app/[locale]/privacy-policy/privacy-policy.less`:

```less
@import (reference) '../../../styles/global.less';

.privacy {
  padding-top: calc(@nav-height-lg + @spacing-16);
  padding-bottom: @section-padding-y-desktop;
  min-height: 100vh;
  background: @color-bg;

  @media (max-width: @bp-md) {
    padding-top: calc(@nav-height + @spacing-10);
    padding-bottom: @section-padding-y-mobile;
  }

  &__header {
    margin-bottom: @spacing-12;
  }

  &__title {
    font-family: @font-display;
    font-size: @font-size-h1-desktop;
    font-weight: @font-weight-bold;
    color: @color-ink;
    line-height: @line-height-tight;
    margin-bottom: @spacing-4;

    @media (max-width: @bp-lg) {
      font-size: @font-size-h1-tablet;
    }

    @media (max-width: @bp-sm) {
      font-size: @font-size-h1-mobile;
    }
  }

  &__updated {
    font-size: @font-size-sm;
    color: @color-ink-tertiary;
  }

  &__content {
    max-width: 48rem;
  }

  &__intro {
    font-size: @font-size-md;
    line-height: @line-height-relaxed;
    color: @color-ink-secondary;
    margin-bottom: @spacing-10;
  }

  &__section {
    margin-bottom: @spacing-10;
  }

  &__section-title {
    font-family: @font-display;
    font-size: @font-size-xl;
    font-weight: @font-weight-semibold;
    color: @color-ink;
    margin-bottom: @spacing-4;
  }

  &__section-body {
    font-size: @font-size-base;
    line-height: @line-height-relaxed;
    color: @color-ink-secondary;

    p {
      margin-bottom: @spacing-4;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/privacy-policy/
git commit -m "feat: add bilingual privacy policy page (GDPR + Slovak law compliant)"
```

---

## Task 11: Add Privacy Policy Link to Footer

**Files:**
- Modify: `src/components/Footer/Footer.tsx`

- [ ] **Step 1: Add Privacy Policy to the "More" links**

In `src/components/Footer/Footer.tsx`, add a third entry to the `moreLinks` array (after the Contact entry on line 22):

```typescript
const moreLinks = [
  { href: `${prefix}/blog`, label: 'Blog' },
  { href: `${home}#contact`, label: locale === 'en' ? 'Contact' : 'Kontakt' },
  { href: `${prefix}/privacy-policy`, label: locale === 'en' ? 'Privacy Policy' : 'Ochrana osobných údajov' },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer/Footer.tsx
git commit -m "feat: add privacy policy link to footer"
```

---

## Self-Review

**Spec coverage check:**
- [x] Cookie consent bar — Task 2 (helpers), Task 3 (translations), Task 4 (component)
- [x] Google Analytics setup with .env — Task 1 (env), Task 5 (component)
- [x] Meta Pixel setup with .env — Task 1 (env), Task 6 (component)
- [x] Form submission events/conversions — Task 7 (helpers), Task 8 (wiring)
- [x] Privacy policy page — Task 10 (page + styles)
- [x] GDPR/Slovak law compliance — Task 3 (full legal text in translations), Task 10 (renders it)
- [x] Footer link — Task 11
- [x] Layout wiring — Task 9

**Placeholder scan:** No TBDs, TODOs, or vague instructions found. All code is complete.

**Type consistency:** `CookiePreferences` type used consistently across cookies.ts, CookieConsent.tsx, GoogleAnalytics.tsx, MetaPixel.tsx. Event names (`cookie-consent-update`) match across producer and consumers.
