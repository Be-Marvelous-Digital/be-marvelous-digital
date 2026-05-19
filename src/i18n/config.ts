import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sk', 'en'] as const,
  defaultLocale: 'sk',
  // SK (default) has no prefix: /  /blog  /portfolio/:id
  // EN has /en prefix:           /en  /en/blog  /en/portfolio/:id
  localePrefix: 'as-needed',
  // Do not auto-detect locale from Accept-Language header —
  // locale is determined solely by the URL prefix.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
