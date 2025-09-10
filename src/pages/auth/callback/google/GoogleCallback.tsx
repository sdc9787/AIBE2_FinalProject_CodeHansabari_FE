'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clientFetch } from '@/shared';
import { useUserStore } from '@/shared';
import { GoogleLoginResponse } from '@/entities/user/model/type';
import { USER_QUERY_KEYS } from '@/entities/user/model/query/queryKey';

export function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  useEffect(() => {
    if (!searchParams) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      clientFetch
        .post<GoogleLoginResponse>('/auth/google/login', {
          code: code,
          state: state,
          redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        })
        .then(async (response) => {
          if (response.success && response.data?.member) {
            // Store에 사용자 정보 저장
            setUser(response.data.member);

            // 사용자 쿼리 무효화 및 재실행
            await queryClient.invalidateQueries({
              queryKey: USER_QUERY_KEYS.me,
            });

            // 잠시 대기하여 상태 동기화
            await new Promise((resolve) => setTimeout(resolve, 100));

            toast.success('로그인에 성공했습니다.');

            // window.location.href를 사용하여 강제 새로고침과 함께 이동
            window.location.href = '/';
          } else {
            throw new Error('로그인 응답이 올바르지 않습니다.');
          }
        })
        .catch((error) => {
          console.error('Google 로그인 실패:', error);
          toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
          router.push('/');
        });
    } else {
      // code나 state가 없는 경우 (인증 실패)
      toast.error('인증에 실패했습니다. 다시 시도해주세요.');
      router.push('/');
    }
  }, [router, searchParams, queryClient, setUser]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="inline-block h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
    </div>
  );
}
