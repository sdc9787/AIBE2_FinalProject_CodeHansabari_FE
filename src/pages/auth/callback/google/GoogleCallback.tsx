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
        .then((response) => {
          if (response.success && response.data?.member) {
            // Store에 사용자 정보 저장
            setUser(response.data.member);

            // 사용자 쿼리 무효화
            queryClient.invalidateQueries({
              queryKey: USER_QUERY_KEYS.me,
            });

            toast.success('로그인에 성공했습니다.');
            router.push('/');
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

  return <p>구글 로그인 처리 중...</p>;
}
