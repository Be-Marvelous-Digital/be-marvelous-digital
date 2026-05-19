import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import '../dashboard.less';

export const metadata: Metadata = { title: 'Posts' };

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-brand">
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span className="dashboard__logo-mark">B·M</span>
            <span className="dashboard__logo-text">CMS</span>
          </Link>
        </div>
        <Link href="/admin" className="dashboard__view-all">← Dashboard</Link>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__page-header">
          <h1 className="dashboard__title">All Posts</h1>
          <Link href="/admin/posts/new" className="btn btn--primary">+ New Post</Link>
        </div>

        <section className="dashboard__section">
          {posts.length === 0 ? (
            <div className="dashboard__empty">
              <p>No posts yet. <Link href="/admin/posts/new">Create your first post →</Link></p>
            </div>
          ) : (
            <ul className="dashboard__post-list">
              {posts.map((post) => (
                <li key={post.id} className="dashboard__post-item">
                  <div className="dashboard__post-info">
                    <span className={`dashboard__post-status ${post.published ? 'dashboard__post-status--published' : ''}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="dashboard__post-title">{post.title}</span>
                  </div>
                  <div className="dashboard__post-actions">
                    <span className="dashboard__post-date">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.updatedAt))}
                    </span>
                    <Link href={`/admin/posts/${post.id}/edit`} className="dashboard__post-edit">Edit</Link>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="dashboard__post-view">View ↗</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
