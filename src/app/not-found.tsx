import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';
import './not-found.less';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="not-found">
        <div className="container not-found__container">
          <span className="not-found__code" aria-hidden="true">
            404
          </span>
          <h1 className="not-found__title">Page not found</h1>
          <p className="not-found__description">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="btn btn--primary">
            Back to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
