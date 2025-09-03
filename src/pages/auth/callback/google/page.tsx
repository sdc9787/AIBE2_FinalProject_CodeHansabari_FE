import { useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { clientFetch } from '@/shared';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const { code, state } = router.query;
    
    if (code && state) {
      // localStorage에서 저장된 state 가져오기
      const storedState = localStorage.getItem('oauth_state');
      
      // state 검증
      if (state !== storedState) {
        console.error('State 불일치 - CSRF 공격 가능성');
        toast.error('보안 오류가 발생했습니다. 다시 로그인해주세요.');
        localStorage.removeItem('oauth_state');
        router.push('/');
        return;
      }
      
      // state 검증 성공 - localStorage에서 제거
      localStorage.removeItem('oauth_state');
      
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
      localStorage.removeItem('oauth_state'); // 혹시 남아있는 state 정리
      router.push('/');
    }
  }, [router]);

  return <p>구글 로그인 처리 중...</p>;
}
