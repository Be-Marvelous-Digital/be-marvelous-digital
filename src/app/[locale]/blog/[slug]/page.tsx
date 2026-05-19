import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Footer/Footer';
import './post.less';

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

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await prisma.post
    .findFirst({
      where: {
        published: true,
        OR: [{ slug }, { slugSk: slug }],
      },
      select: { title: true, excerpt: true, titleSk: true, excerptSk: true },
    })
    .catch(() => null);

  if (!post) return { title: 'Post not found' };

  const metaTitle = locale === 'sk' && post.titleSk ? post.titleSk : post.title;
  const metaExcerpt = locale === 'sk' && post.excerptSk ? post.excerptSk : post.excerpt;

  return {
    title: metaTitle,
    description: metaExcerpt,
    openGraph: { title: metaTitle, description: metaExcerpt, type: 'article' },
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

  return (
    <>
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
