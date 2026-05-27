import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn/FadeIn';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal/SplitTextReveal';
import type { Post } from '@prisma/client';
import './BlogPreview.less';

type PostPreview = Pick<
  Post,
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'coverImage'
  | 'publishedAt'
  | 'titleSk'
  | 'slugSk'
  | 'excerptSk'
>;

interface BlogPreviewProps {
  posts: PostPreview[];
}

function formatDate(date: Date | null, locale: string): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale === 'sk' ? 'sk-SK' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export const BlogPreview = async ({ posts }: BlogPreviewProps) => {
  const t = await getTranslations('blog');
  const locale = await getLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <section className="blog-preview section" id="blog" aria-labelledby="blog-preview-heading">
      <div className="container">
        <div className="blog-preview__header">
          <div>
            <FadeIn>
              <span className="label-text">{t('preview.label')}</span>
            </FadeIn>
            <SplitTextReveal
              as="h2"
              className="blog-preview__title"
              id="blog-preview-heading"
              triggerStart="top 88%"
            >
              {t('title')}
            </SplitTextReveal>
          </div>
          <FadeIn>
            <Link href={`${prefix}/blog`} className="blog-preview__all-link">
              {t('preview.all')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </FadeIn>
        </div>

        <div className="blog-preview__grid">
          {posts.map((post, index) => {
            const displayTitle = locale === 'sk' && post.titleSk ? post.titleSk : post.title;
            const displayExcerpt =
              locale === 'sk' && post.excerptSk ? post.excerptSk : post.excerpt;
            const displaySlug = locale === 'sk' && post.slugSk ? post.slugSk : post.slug;
            const href = `${prefix}/blog/${displaySlug}`;

            return (
              <FadeIn key={post.id} delay={index * 0.1} direction="up">
                <article
                  className={`blog-preview__card ${index === 0 ? 'blog-preview__card--featured' : ''}`}
                >
                  <Link
                    href={href}
                    className="blog-preview__card-cover-link"
                    aria-label={displayTitle}
                  />

                  <div className="blog-preview__card-image">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={displayTitle}
                        className="blog-preview__card-img"
                      />
                    ) : (
                      <div className="blog-preview__card-image-placeholder" aria-hidden="true" />
                    )}
                  </div>

                  <div className="blog-preview__card-body">
                    {post.publishedAt && (
                      <time
                        className="blog-preview__card-date"
                        dateTime={new Date(post.publishedAt).toISOString()}
                      >
                        {formatDate(post.publishedAt, locale)}
                      </time>
                    )}
                    <h3 className="blog-preview__card-title">{displayTitle}</h3>
                    <p className="blog-preview__card-excerpt">{displayExcerpt}</p>
                    <span className="blog-preview__card-read-more">
                      {t('readMore')}
                      <svg
                        className="blog-preview__card-arrow"
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
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
