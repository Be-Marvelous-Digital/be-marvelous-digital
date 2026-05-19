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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bemarvelousdigital.com'),
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
  ],
  authors: [{ name: 'Peter Lehocky', url: 'https://bemarvelousdigital.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bemarvelousdigital.com',
    siteName: 'Be Marvelous Digital',
    title: 'Be Marvelous Digital — Freelance Web Developer',
    description:
      'High-quality, beautifully designed websites. Fast, reliable, detail-oriented freelance web development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Be Marvelous Digital',
    description: 'High-quality websites by freelance developer Peter Lehocky.',
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
