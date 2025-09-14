'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserInfo } from './ui';
import { useUsageTokens } from '@/entities/user/model/query/useUsageTokens';

interface MenuItem {
  name: string;
  path: string;
}

export function Header() {
  const pathname = usePathname();

  const menuList: MenuItem[] = [
    { name: '자기소개서', path: '/cover-letter' },
    { name: 'AI 모의면접', path: '/interview-questions' },
    { name: '이력서', path: '/resume' },
  ];

  //토큰 사용량 표시
  const { data: tokenUsage, isLoading } = useUsageTokens();

  // 현재 경로가 주어진 path와 일치하는지 확인
  const isActivePath = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  if (isLoading) {
    return <></>;
  }

  // 포맷된 리필 시간 (없으면 '-')
  const formattedNextRefill = (() => {
    const iso = tokenUsage?.nextRefillTime;
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '-';
      // 한국어 로케일로 날짜/시간 표시
      return d.toLocaleString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '-';
    }
  })();

  return (
    <>
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-black/10 bg-white/95 backdrop-blur-sm">
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
              {menuList.map((menu) => (
                <Link
                  key={menu.path}
                  href={menu.path}
                  className={`border-b-2 pb-1 font-medium transition-all duration-200 ${
                    isActivePath(menu.path)
                      ? 'border-indigo-600 font-semibold text-indigo-600'
                      : 'border-white text-gray-700 hover:font-semibold hover:text-indigo-600'
                  }`}
                >
                  {menu.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center justify-center">
            {/*토큰 사용량 및 다음 리필 시간 표시 */}
            <div className="mr-4 hidden flex-col items-center rounded-full bg-indigo-100/50 px-6 py-1 text-sm font-medium text-indigo-700 sm:flex">
              <div>
                토큰 사용량: {tokenUsage?.remainingTokens ?? 0} /{' '}
                {tokenUsage?.maxTokens ?? 0}
              </div>
              <div className="text-xs text-indigo-700/80">
                리필: {formattedNextRefill} / {tokenUsage?.refillAmount ?? 0}{' '}
                토큰
              </div>
            </div>
            <UserInfo />
          </div>
        </div>
      </header>
      <div className="h-30"></div>
    </>
  );
}
