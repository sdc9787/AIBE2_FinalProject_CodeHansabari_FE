'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

export function AdminLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  const routerMenu = [
    { name: '회원 통계 및 관리', path: '/admin/users' },
    { name: '크롤링 관리', path: '/admin/crawl' },
    { name: '이력서 복구', path: '/admin/restore/resumes' },
    { name: '자소서 복구', path: '/admin/restore/cover-letters' },
  ];

  function isActive(path: string) {
    const normalize = (s?: string) => (s || '').replace(/\/$/, '');
    const np = normalize(pathname ?? '');
    const p = normalize(path);

    if (p === '/admin') return np === '/admin' || np === '';

    // Special-case: keep '/admin/users' from matching '/admin/users/statistics'
    if (p === '/admin/users') {
      // active when exactly on /admin/users or on subpaths that are not /admin/users/statistics
      return (
        np === '/admin/users' ||
        (np.startsWith('/admin/users/') &&
          !np.startsWith('/admin/users/statistics'))
      );
    }

    return np === p || np.startsWith(p + '/');
  }

  return (
    <div className="flex bg-gray-50">
      <aside className="fixed top-20 bottom-0 w-56 border-r border-gray-200 bg-white">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {routerMenu.map((m) => {
              const active = isActive(m.path);
              return (
                <li key={m.path}>
                  <Link
                    href={m.path}
                    className={
                      `flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors hover:bg-indigo-50 focus:outline-none ` +
                      (active
                        ? 'bg-indigo-100 font-medium text-indigo-700'
                        : 'text-gray-600')
                    }
                  >
                    <span className="truncate">{m.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="h-full flex-1 p-6 pl-60">{children}</main>
    </div>
  );
}
