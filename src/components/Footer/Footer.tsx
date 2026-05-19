import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Logo } from '@/components/Logo/Logo';
import './Footer.less';

export const Footer = async () => {
  const t = await getTranslations('footer');
  const locale = await getLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const year = new Date().getFullYear();

  const home = prefix || '/';

  const navigateLinks = [
    { href: `${home}#services`, label: locale === 'en' ? 'Services' : 'Služby' },
    { href: `${home}#portfolio`, label: locale === 'en' ? 'Portfolio' : 'Portfólio' },
    { href: `${home}#process`, label: locale === 'en' ? 'Process' : 'Proces' },
    { href: `${home}#about`, label: locale === 'en' ? 'About' : 'O mne' },
  ];

  const moreLinks = [
    { href: `${prefix}/blog`, label: 'Blog' },
    { href: `${home}#contact`, label: locale === 'en' ? 'Contact' : 'Kontakt' },
    {
      href: `${prefix}/privacy-policy`,
      label: locale === 'en' ? 'Privacy Policy' : 'Ochrana osobných údajov',
    },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo href={prefix || '/'} className="footer__logo logo--sm" />
            <p className="footer__tagline">
              {locale === 'en'
                ? 'Websites that work and look beautifully — built directly by me.'
                : 'Webstránky, ktoré fungujú a vyzerajú krásne — postavené priamo mnou.'}
            </p>
          </div>

          <div className="footer__nav-groups">
            <div className="footer__nav-group">
              <span className="footer__nav-label">{t('navigate')}</span>
              <ul className="footer__nav-list">
                {navigateLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer__nav-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__nav-group">
              <span className="footer__nav-label">{t('more')}</span>
              <ul className="footer__nav-list">
                {moreLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer__nav-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} Be Marvelous Digital.{' '}
            {locale === 'en' ? 'All rights reserved.' : 'Všetky práva vyhradené.'}
          </p>
          <p className="footer__made-by">{t('credit')}</p>
        </div>
      </div>
    </footer>
  );
};
