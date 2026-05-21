import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';
import './post.less';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.post
    .findMany({
      where: { published: true },
      select: { slug: true, slugSk: true },
    })
    .catch(() => []);

  const params: Array<{ locale: string; slug: string }> = [];
  for (const post of posts) {
    params.push({ locale: 'en', slug: post.slug });
    params.push({ locale: 'sk', slug: post.slugSk ?? post.slug });
  }
  return params;
}

import { SITE_URL as siteUrl } from '@/lib/constants';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const isSk = locale === 'sk';
  const post = await prisma.post
    .findFirst({
      where: {
        published: true,
        OR: [{ slug }, { slugSk: slug }],
      },
      select: {
        title: true,
        excerpt: true,
        titleSk: true,
        excerptSk: true,
        slug: true,
        slugSk: true,
        coverImage: true,
        publishedAt: true,
        author: true,
      },
    })
    .catch(() => null);

  if (!post) return { title: 'Post not found' };

  const metaTitle = isSk && post.titleSk ? post.titleSk : post.title;
  const metaExcerpt = isSk && post.excerptSk ? post.excerptSk : post.excerpt;
  const skSlug = post.slugSk ?? post.slug;

  return {
    title: metaTitle,
    description: metaExcerpt,
    alternates: {
      canonical: isSk ? `/blog/${skSlug}` : `/en/blog/${post.slug}`,
      languages: {
        sk: `/blog/${skSlug}`,
        en: `/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaExcerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : undefined,
    },
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;
  const prefix = locale === 'en' ? '/en' : '';

  const post = await prisma.post
    .findFirst({
      where: {
        published: true,
        OR: [{ slug }, { slugSk: slug }],
      },
    })
    .catch(() => null);

  if (!post) notFound();

  const displayTitle = locale === 'sk' && post.titleSk ? post.titleSk : post.title;
  const displayExcerpt = locale === 'sk' && post.excerptSk ? post.excerptSk : post.excerpt;
  const displayBody = locale === 'sk' && post.bodySk ? post.bodySk : post.body;

  const labels = {
    back: locale === 'sk' ? '← Všetky články' : '← All articles',
    writtenBy: locale === 'sk' ? 'Napísal' : 'Written by',
    ctaTitle:
      locale === 'sk'
        ? 'Chcete opraviť tieto problémy na vašej stránke?'
        : 'Ready to fix these issues on your site?',
    ctaDescription:
      locale === 'sk'
        ? 'Staviam webstránky, ktoré sú rýchle, SEO-optimalizované a správne nakonfigurované od prvého dňa.'
        : "I build websites that are fast, SEO-optimised, and properly configured from day one. Let's talk about your project.",
    ctaButton: locale === 'sk' ? 'Začať rozhovor' : 'Start a conversation',
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: displayTitle,
    description: displayExcerpt,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Be Marvelous Digital',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/opengraph.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${prefix}/blog/${slug}`,
    },
    inLanguage: locale === 'sk' ? 'sk' : 'en',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navigation forceDark />
      <main>
        <article className="blog-post">
          <div className="container">
            <div className="blog-post__back">
              <Link href={`${prefix}/blog`} className="blog-post__back-link">
                {labels.back}
              </Link>
            </div>

            <header className="blog-post__header">
              {post.publishedAt && (
                <time
                  className="blog-post__date"
                  dateTime={new Date(post.publishedAt).toISOString()}
                >
                  {formatDate(post.publishedAt, locale)}
                </time>
              )}
              <h1 className="blog-post__title">{displayTitle}</h1>
              <p className="blog-post__excerpt">{displayExcerpt}</p>
              <div className="blog-post__author">
                <span className="blog-post__author-label">{labels.writtenBy}</span>
                <span className="blog-post__author-name">{post.author}</span>
              </div>
            </header>
          </div>

          <div className="container container--narrow">
            <div className="blog-post__body" dangerouslySetInnerHTML={{ __html: displayBody }} />

            <div className="blog-post__cta">
              <div className="blog-post__cta-inner">
                <h2 className="blog-post__cta-title">{labels.ctaTitle}</h2>
                <p className="blog-post__cta-description">{labels.ctaDescription}</p>
                <a href={`${prefix}/#contact`} className="btn btn--primary">
                  {labels.ctaButton}
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
