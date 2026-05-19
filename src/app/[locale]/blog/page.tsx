import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';
import './blog.less';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isSk = locale === 'sk';
  return {
    title: isSk ? 'Blog — Webdizajn a vývoj' : 'Blog — Web Development Insights',
    description: isSk
      ? 'Praktické články o webdizajne, výkone, SEO a všetkom, čo firmy potrebujú vedieť o online prítomnosti.'
      : 'Practical articles on web performance, design, SEO, and everything businesses need to know to get the most out of their online presence.',
  };
}

function formatDate(date: Date | null, locale: string): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale === 'sk' ? 'sk-SK' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const prefix = locale === 'en' ? '/en' : '';

  const posts = await prisma.post
    .findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: true,
        titleSk: true,
        slugSk: true,
        excerptSk: true,
      },
    })
    .catch(() => []);

  return (
    <>
      <Navigation forceDark />
      <main>
        <div className="blog-index">
          <div className="blog-index__hero">
            <div className="container">
              <span className="label-text">{t('label')}</span>
              <h1 className="blog-index__title">{t('title')}</h1>
              <p className="blog-index__description">{t('description')}</p>
            </div>
          </div>

          <div className="container">
            {posts.length === 0 ? (
              <div className="blog-index__empty">
                <p>{t('empty')}</p>
              </div>
            ) : (
              <div className="blog-index__grid">
                {posts.map((post, index) => {
                  const displayTitle = locale === 'sk' && post.titleSk ? post.titleSk : post.title;
                  const displayExcerpt =
                    locale === 'sk' && post.excerptSk ? post.excerptSk : post.excerpt;
                  const displaySlug = locale === 'sk' && post.slugSk ? post.slugSk : post.slug;
                  const postHref = `${prefix}/blog/${displaySlug}`;
                  const isFeatured = index === 0;

                  return (
                    <article
                      key={post.id}
                      className={`blog-index__card${isFeatured ? ' blog-index__card--featured' : ''}`}
                    >
                      <Link
                        href={postHref}
                        className="blog-index__card-overlay"
                        aria-label={displayTitle}
                      />

                      <div className="blog-index__card-image">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={displayTitle}
                            className="blog-index__card-img"
                          />
                        ) : (
                          <div className="blog-index__card-image-placeholder" />
                        )}
                      </div>

                      <div className="blog-index__card-body">
                        <div className="blog-index__card-meta">
                          {post.publishedAt && (
                            <time
                              className="blog-index__card-date"
                              dateTime={new Date(post.publishedAt).toISOString()}
                            >
                              {formatDate(post.publishedAt, locale)}
                            </time>
                          )}
                          <span className="blog-index__card-author">{post.author}</span>
                        </div>

                        <h2 className="blog-index__card-title">{displayTitle}</h2>
                        <p className="blog-index__card-excerpt">{displayExcerpt}</p>

                        <span className="blog-index__card-read-more">
                          {t('readMore')}
                          <svg
                            className="blog-index__card-arrow"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 7h10M8 3l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
