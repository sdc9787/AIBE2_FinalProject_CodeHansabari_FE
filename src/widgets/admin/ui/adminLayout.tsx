'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

export function AdminLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();

  const pathname = usePathname();

  const routerMenu = [
    { name: '크롤링 관리', path: '/admin/crawl' },
    { name: '데이터 관리', path: '/admin/data' },
    { name: '로그 관리', path: '/admin/log' },
    { name: '회원 관리', path: '/admin/users' },
  ];

  function isActive(path: string) {
    if (path === '/admin')
      return pathname === '/admin' || pathname === '/admin/';
    return pathname?.startsWith(path);
  }

  function handleClick(path: string) {
    router.push(path);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="p-6">
          <h1 className="text-lg font-semibold text-gray-800">대시보드</h1>
        </div>

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
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="text-gray-400" aria-hidden>
                      {/* icon placeholder - can integrate Icon component if needed */}
                    </span>
                    <span className="truncate">{m.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {/* render children so this can be used as a layout component */}
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
