import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Navigation } from '@/components/Navigation/Navigation';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { Portfolio } from '@/components/Portfolio/Portfolio';
import { Process } from '@/components/Process/Process';
import { About } from '@/components/About/About';
import { BlogPreview } from '@/components/BlogPreview/BlogPreview';
import { Contact } from '@/components/Contact/Contact';
import { Footer } from '@/components/Footer/Footer';
import type { Post } from '@prisma/client';

type PostPreview = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'coverImage' | 'publishedAt' | 'titleSk' | 'slugSk' | 'excerptSk'>;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isSk = locale === 'sk';

  const title = isSk
    ? 'Be Marvelous Digital — Freelance webdizajn a vývoj'
    : 'Be Marvelous Digital — Freelance Web Developer';
  const description = isSk
    ? 'Vysokokvalitné, krásne navrhnuté webstránky od Petra Lehockého. Rýchle, spoľahlivé, detailorientované. Vždy hovoríte priamo so mnou.'
    : 'High-quality, beautifully designed websites by Peter Lehocky. Fast, reliable, detail-oriented. You always speak directly with me.';

  return {
    title,
    description,
    alternates: {
      canonical: isSk ? '/' : '/en',
      languages: { sk: '/', en: '/en' },
    },
    openGraph: {
      title,
      description,
      locale: isSk ? 'sk_SK' : 'en_US',
      alternateLocale: isSk ? 'en_US' : 'sk_SK',
    },
  };
}

export default async function HomePage() {
  let posts: PostPreview[] = [];

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        titleSk: true,
        slugSk: true,
        excerptSk: true,
      },
    });
  } catch {
    // DB not available at build time
  }

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <About />
        {posts.length > 0 && <BlogPreview posts={posts} />}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
