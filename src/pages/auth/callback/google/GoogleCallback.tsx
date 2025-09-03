import { useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { clientFetch } from '@/shared';

export function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const { code, state } = router.query;
    if (code && state) {
      clientFetch
        .post('/auth/google/login', {
          code: code,
          state: state,
          redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        })
        .then(() => {
          router.push('/');
        })
        .catch((error) => {
          console.error('Google 로그인 실패:', error);
          toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
          router.push('/');
        });
    } else if (router.isReady) {
      // code나 state가 없는 경우 (인증 실패)
      toast.error('인증에 실패했습니다. 다시 시도해주세요.');
      router.push('/');
    }
  }, [router]);

  return <p>구글 로그인 처리 중...</p>;
}
