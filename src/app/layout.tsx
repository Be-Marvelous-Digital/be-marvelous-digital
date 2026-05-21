import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/global.less';
import '@/app/globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bemarvelousdigital.sk'),
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon/favicon.ico',
  },
  manifest: '/favicon/site.webmanifest',
  title: {
    default: 'Be Marvelous Digital — Freelance Web Developer',
    template: '%s | Be Marvelous Digital',
  },
  description:
    'High-quality, beautifully designed websites by Peter Lehocky — freelance web developer. Fast, reliable, detail-oriented. You always talk directly to me.',
  keywords: [
    'freelance web developer',
    'web design',
    'Next.js developer',
    'React developer',
    'website development',
    'UI UX design',
    'freelance webový vývojár',
    'tvorba webstránok',
    'webdizajn Slovensko',
    'SEO optimalizácia',
    'web developer Slovakia',
    'Peter Lehocky',
  ],
  authors: [{ name: 'Peter Lehocky', url: 'https://bemarvelousdigital.sk' }],
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: 'https://bemarvelousdigital.sk',
    siteName: 'Be Marvelous Digital',
    title: 'Be Marvelous Digital — Freelance Web Developer',
    description:
      'High-quality, beautifully designed websites. Fast, reliable, detail-oriented freelance web development.',
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
    title: 'Be Marvelous Digital',
    description: 'High-quality websites by freelance developer Peter Lehocky.',
    images: ['/opengraph.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
