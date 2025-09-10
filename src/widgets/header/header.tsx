import Link from 'next/link';
import { UserInfo } from './ui';

export function Header() {
  return (
    <>
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent"
            >
              CV Mento
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/cover-letter"
                className="font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                자기소개서
              </Link>
              <Link
                href="/resume"
                className="font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                이력서
              </Link>
              <Link
                href="/interview-questions"
                className="font-medium text-gray-700 transition-colors hover:text-indigo-600"
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
