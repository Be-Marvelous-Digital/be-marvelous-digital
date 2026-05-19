import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    title, slug: rawSlug, excerpt, body: postBody, published, publishedAt,
    titleSk, slugSk, excerptSk, bodySk,
  } = body;

  if (!title || !rawSlug || !excerpt || !postBody) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const finalSlug = slugify(rawSlug, { lower: true, strict: true });
  const finalSlugSk = slugSk ? slugify(slugSk, { lower: true, strict: true }) : null;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        body: postBody,
        published: Boolean(published),
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        titleSk: titleSk || null,
        slugSk: finalSlugSk,
        excerptSk: excerptSk || null,
        bodySk: bodySk || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
