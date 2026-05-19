import type { Metadata } from 'next';
import './admin.less';

export const metadata: Metadata = {
  title: {
    default: 'Admin — Be Marvelous Digital',
    template: '%s | Admin',
  },
  robots: { index: false, follow: false },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
