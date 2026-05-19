import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  const body = await request.json();
  const {
    title,
    slug: rawSlug,
    excerpt,
    body: postBody,
    published,
    publishedAt,
    titleSk,
    slugSk,
    excerptSk,
    bodySk,
  } = body;

  if (!title || !rawSlug || !excerpt || !postBody) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const finalSlug = slugify(rawSlug, { lower: true, strict: true });

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug: finalSlug,
        excerpt,
        body: postBody,
        published: Boolean(published),
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        titleSk: titleSk || null,
        slugSk: slugSk ? slugify(slugSk, { lower: true, strict: true }) : null,
        excerptSk: excerptSk || null,
        bodySk: bodySk || null,
      },
    });

    return NextResponse.json(post);
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Post not found or could not be deleted' }, { status: 404 });
  }
}
