'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserInfo } from './ui';
import { useUsageTokens } from '@/entities/user/model/query/useUsageTokens';
import Image from 'next/image';

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

  // 계산된 실제 리필량: 최대 토큰을 넘지 않도록 remaining + refillAmount 로 계산
  const computedRefillDisplay = (() => {
    const remaining = tokenUsage?.remainingTokens ?? 0;
    const max = tokenUsage?.maxTokens ?? 0;
    const refill = tokenUsage?.refillAmount ?? 0;

    if (max <= 0) return null; // 최대 토큰 정보 없으면 표시 안함

    if (remaining >= max) return { atMax: true, amount: 0 };

    const possibleAdd = max - remaining;
    const actualAdd = Math.min(refill, possibleAdd);
    return { atMax: false, amount: actualAdd };
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
            {/*토큰 사용량 표시 - hover 시 리필 정보 표시 */}
            <div className="group relative mr-4 hidden sm:block">
              <div className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-100/50 px-4 py-2 text-sm font-medium text-indigo-700 transition-all duration-200 hover:bg-indigo-100">
                {isLoading ? (
                  <i className="xi-spinner-3 xi-spin"></i>
                ) : (
                  <>
                    <Image
                      src="/image/coin.png"
                      width={16}
                      height={16}
                      alt="Coin"
                      className="flex-shrink-0"
                    />
                    <span>{tokenUsage?.remainingTokens ?? 0}</span>
                  </>
                )}
              </div>

              {/* Hover 시 나타나는 리필 정보 툴팁 */}
              {!isLoading && (
                <div className="pointer-events-none absolute top-full right-0 mt-2 w-48 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
                    <div className="mb-1 font-medium">토큰 리필 정보</div>
                    <div className="text-gray-300">
                      리필 시간: {formattedNextRefill}
                    </div>
                    <div className="text-gray-300">
                      {computedRefillDisplay == null ? (
                        '리필 토큰: -'
                      ) : computedRefillDisplay.atMax ? (
                        <span className="text-green-300">
                          최대 토큰에 도달했습니다.
                        </span>
                      ) : (
                        <>
                          리필 토큰:{' '}
                          <span className="font-medium">
                            {computedRefillDisplay.amount}
                          </span>
                          개
                        </>
                      )}
                    </div>
                    {/* 화살표 */}
                    <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
            <UserInfo />
          </div>
        </div>
      </header>
      <div className="h-30"></div>
    </>
  );
}
