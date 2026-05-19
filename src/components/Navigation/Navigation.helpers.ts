/**
 * Returns the equivalent URL in the alternate locale.
 *
 * SK is the default locale (no prefix): /  /blog  /portfolio/id
 * EN always has the /en prefix:         /en  /en/blog  /en/portfolio/id
 *
 * @param pathname - the current window.location.pathname
 * @param locale   - the current active locale ('sk' | 'en')
 */
export function getAlternateHref(pathname: string, locale: string): string {
  // Strip any locale prefix to get the bare path
  const bare = pathname
    .replace(/^\/en(\/|$)/, '/')
    .replace(/^\/sk(\/|$)/, '/')
    .replace(/\/$/, '') || '/';

  if (locale === 'sk') {
    // Currently on SK → switch to EN (add /en prefix)
    return bare === '/' ? '/en' : `/en${bare}`;
  }

  // Currently on EN → switch to SK (default locale, no prefix)
  return bare || '/';
}
