'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserMe } from '@/entities/user/model/query/useUserMe';
import { useUserStore } from '@/shared';
import { GoogleLoginButton, LogoutButton } from '@/features';

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className }: UserInfoProps) {
  const router = useRouter();
  const { isLoading } = useUserMe();
  const { user, isAuthenticated } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 로딩 중일 때는 스켈레톤 표시
  if (isLoading) {
    return (
      // 로그인 버튼과 동일한 높이/모양의 스켈레톤을 사용해서 레이아웃 점프를 방지합니다.
      <div className={className}>
        <div className="animate-pulse">
          <div className="h-[52px] w-32 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // 인증되지 않았거나 사용자 정보가 없을 때는 로그인 버튼 표시
  if (!isAuthenticated || !user) {
    return (
      <GoogleLoginButton className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-semibold text-white" />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
      >
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        )}
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-gray-900">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-100 p-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="space-y-1 p-2">
              {/* 관리자 권한이 있는 경우 관리자 페이지로 이동하는 버튼 노출 */}
              {user.role && user.role !== 'USER' && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/admin/users');
                  }}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  관리자 페이지
                </button>
              )}

              <LogoutButton className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
