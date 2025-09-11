'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TokenRefreshPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // 토큰 갱신 성공
          const redirectPath = searchParams?.get('redirect') || '/';
          router.replace(redirectPath);
        } else {
          // 토큰 갱신 실패 - 로그인 페이지나 홈으로 이동
          setError('토큰 갱신에 실패했습니다. 다시 로그인해 주세요.');
          setTimeout(() => {
            router.replace('/');
          }, 2000);
        }
      } catch (err) {
        console.error('Token refresh error:', err);
        setError('네트워크 오류가 발생했습니다.');
        setTimeout(() => {
          router.replace('/');
        }, 2000);
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshToken();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">{error}</div>
          <div className="text-sm text-gray-500">
            잠시 후 홈페이지로 이동합니다...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <div className="text-lg font-medium">토큰을 갱신하고 있습니다...</div>
        <div className="mt-2 text-sm text-gray-500">잠시만 기다려 주세요.</div>
      </div>
    </div>
  );
}
