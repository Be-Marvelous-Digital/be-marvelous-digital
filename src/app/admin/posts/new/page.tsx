import Link from 'next/link';
import { PostEditor } from '@/components/admin/PostEditor/PostEditor';
import type { Metadata } from 'next';
import '../../dashboard.less';
import './new-post.less';

export const metadata: Metadata = { title: 'New Post' };

export default function NewPostPage() {
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
        <h1 className="new-post__title">New Post</h1>
        <PostEditor />
      </main>
    </div>
  );
}
