import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import type { Metadata } from 'next';
import './dashboard.less';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const session = await auth();

  const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
  ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: { id: true, title: true, slug: true, published: true, updatedAt: true },
  });

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-brand">
          <span className="dashboard__logo-mark">B·M</span>
          <span className="dashboard__logo-text">CMS</span>
        </div>
        <div className="dashboard__header-right">
          <span className="dashboard__user">{session?.user?.email}</span>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button type="submit" className="dashboard__signout">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__page-header">
          <h1 className="dashboard__title">Dashboard</h1>
          <Link href="/admin/posts/new" className="btn btn--primary">
            + New Post
          </Link>
        </div>

        <div className="dashboard__stats">
          <div className="dashboard__stat-card">
            <span className="dashboard__stat-value">{totalPosts}</span>
            <span className="dashboard__stat-label">Total posts</span>
          </div>
          <div className="dashboard__stat-card dashboard__stat-card--green">
            <span className="dashboard__stat-value">{publishedPosts}</span>
            <span className="dashboard__stat-label">Published</span>
          </div>
          <div className="dashboard__stat-card">
            <span className="dashboard__stat-value">{draftPosts}</span>
            <span className="dashboard__stat-label">Drafts</span>
          </div>
        </div>

        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <h2 className="dashboard__section-title">Recent posts</h2>
            <Link href="/admin/posts" className="dashboard__view-all">View all</Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="dashboard__empty">
              <p>No posts yet. <Link href="/admin/posts/new">Create your first post →</Link></p>
            </div>
          ) : (
            <ul className="dashboard__post-list">
              {recentPosts.map((post) => (
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
                    <Link href={`/admin/posts/${post.id}/edit`} className="dashboard__post-edit">
                      Edit
                    </Link>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="dashboard__post-view">
                      View ↗
                    </Link>
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
