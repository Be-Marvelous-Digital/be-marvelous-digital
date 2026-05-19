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
