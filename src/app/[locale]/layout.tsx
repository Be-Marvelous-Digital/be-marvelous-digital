import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/config';
import { CookieConsent } from '@/components/CookieConsent/CookieConsent';
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics';
import { MetaPixel } from '@/components/Analytics/MetaPixel';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bemarvelousdigital.sk';

const ogMeta: Record<string, { title: string; description: string; locale: string }> = {
  sk: {
    title: 'Be Marvelous Digital — Freelance webový vývojár',
    description:
      'Kvalitné, krásne navrhnuté webové stránky od Petra Lehockého. Rýchlo, spoľahlivo, s dôrazom na detail.',
    locale: 'sk_SK',
  },
  en: {
    title: 'Be Marvelous Digital — Freelance Web Developer',
    description:
      'High-quality, beautifully designed websites. Fast, reliable, detail-oriented freelance web development.',
    locale: 'en_US',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const og = ogMeta[locale] ?? ogMeta.en;

  return {
    openGraph: {
      type: 'website',
      locale: og.locale,
      url: locale === 'sk' ? siteUrl : `${siteUrl}/en`,
      siteName: 'Be Marvelous Digital',
      title: og.title,
      description: og.description,
      images: [
        {
          url: '/opengraph.png',
          width: 1200,
          height: 630,
          alt: 'Be Marvelous Digital',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title,
      description: og.description,
      images: ['/opengraph.png'],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Be Marvelous Digital',
    url: siteUrl,
    logo: `${siteUrl}/opengraph.png`,
    image: `${siteUrl}/opengraph.png`,
    description:
      'Freelance web developer specialising in fast, modern websites built with Next.js and React. Based in Slovakia, working internationally.',
    founder: {
      '@type': 'Person',
      name: 'Peter Lehocky',
      jobTitle: 'Freelance Web Developer',
      url: siteUrl,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SK',
    },
    areaServed: [
      { '@type': 'Country', name: 'Slovakia' },
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    knowsLanguage: ['sk', 'en'],
    priceRange: '$$',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <OrganizationJsonLd />
      <GoogleAnalytics />
      <MetaPixel />
      {children}
      <CookieConsent locale={locale} />
    </NextIntlClientProvider>
  );
}
