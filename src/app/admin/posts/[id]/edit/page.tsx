import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PostEditor } from '@/components/admin/PostEditor/PostEditor';
import type { Metadata } from 'next';
import '../../../dashboard.less';
import '../../new/new-post.less';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) },
    select: { title: true },
  });
  return { title: post ? `Edit: ${post.title}` : 'Edit Post' };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) notFound();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      body: true,
      titleSk: true,
      slugSk: true,
      excerptSk: true,
      bodySk: true,
      published: true,
    },
  });

  if (!post) notFound();

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-brand">
          <Link
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <span className="dashboard__logo-mark">B·M</span>
            <span className="dashboard__logo-text">CMS</span>
          </Link>
        </div>
        <Link href="/admin/posts" className="dashboard__view-all">
          ← All Posts
        </Link>
      </header>

      <main className="new-post">
        <h1 className="new-post__title">Edit Post</h1>
        <PostEditor initialData={post} />
      </main>
    </div>
  );
}
