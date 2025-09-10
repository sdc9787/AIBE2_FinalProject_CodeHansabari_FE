'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserInfo } from './ui';

export function Header() {
  const pathname = usePathname();

  // 현재 경로가 주어진 path와 일치하는지 확인
  const isActivePath = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-3xl font-bold transition-all duration-200 ${
                isActivePath('/')
                  ? 'scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:scale-105'
              }`}
            >
              CV Mento
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/cover-letter"
                className={`font-medium transition-all duration-200 ${
                  isActivePath('/cover-letter')
                    ? 'border-b-2 border-indigo-600 pb-1 font-semibold text-indigo-600'
                    : 'text-gray-700 hover:font-semibold hover:text-indigo-600'
                }`}
              >
                자기소개서
              </Link>
              <Link
                href="/resume"
                className={`font-medium transition-all duration-200 ${
                  isActivePath('/resume')
                    ? 'border-b-2 border-indigo-600 pb-1 font-semibold text-indigo-600'
                    : 'text-gray-700 hover:font-semibold hover:text-indigo-600'
                }`}
              >
                이력서
              </Link>
              <Link
                href="/interview-questions"
                className={`font-medium transition-all duration-200 ${
                  isActivePath('/interview-questions')
                    ? 'border-b-2 border-indigo-600 pb-1 font-semibold text-indigo-600'
                    : 'text-gray-700 hover:font-semibold hover:text-indigo-600'
                }`}
              >
                AI 모의면접
              </Link>
            </nav>
          </div>
          <UserInfo />
        </div>
      </header>
      <div className="h-30 w-screen"></div>
    </>
  );
}
