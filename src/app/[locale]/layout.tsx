import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/config';
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
