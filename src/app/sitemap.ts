import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { portfolioProjects } from '@/data/portfolio';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bemarvelousdigital.sk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages — both SK (default, no prefix) and EN (/en)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: { sk: siteUrl, en: `${siteUrl}/en` },
      },
    },
    {
      url: `${siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: { sk: siteUrl, en: `${siteUrl}/en` },
      },
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: { sk: `${siteUrl}/blog`, en: `${siteUrl}/en/blog` },
      },
    },
    {
      url: `${siteUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: { sk: `${siteUrl}/blog`, en: `${siteUrl}/en/blog` },
      },
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
      alternates: {
        languages: {
          sk: `${siteUrl}/privacy-policy`,
          en: `${siteUrl}/en/privacy-policy`,
        },
      },
    },
    {
      url: `${siteUrl}/en/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
      alternates: {
        languages: {
          sk: `${siteUrl}/privacy-policy`,
          en: `${siteUrl}/en/privacy-policy`,
        },
      },
    },
  ];

  // Portfolio pages
  const portfolioPages: MetadataRoute.Sitemap = portfolioProjects.flatMap((project) => [
    {
      url: `${siteUrl}/portfolio/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          sk: `${siteUrl}/portfolio/${project.id}`,
          en: `${siteUrl}/en/portfolio/${project.id}`,
        },
      },
    },
    {
      url: `${siteUrl}/en/portfolio/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          sk: `${siteUrl}/portfolio/${project.id}`,
          en: `${siteUrl}/en/portfolio/${project.id}`,
        },
      },
    },
  ]);

  // Blog posts from database
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, slugSk: true, updatedAt: true },
    });

    blogPages = posts.flatMap((post) => {
      const skSlug = post.slugSk ?? post.slug;
      return [
        {
          url: `${siteUrl}/blog/${skSlug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: {
              sk: `${siteUrl}/blog/${skSlug}`,
              en: `${siteUrl}/en/blog/${post.slug}`,
            },
          },
        },
        {
          url: `${siteUrl}/en/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: {
              sk: `${siteUrl}/blog/${skSlug}`,
              en: `${siteUrl}/en/blog/${post.slug}`,
            },
          },
        },
      ];
    });
  } catch {
    // DB not available at build time
  }

  return [...staticPages, ...portfolioPages, ...blogPages];
}
