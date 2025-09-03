'use client';

import { clientFetch } from '@/shared';
import { Button } from '@/shared/ui';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface GoogleLoginButtonProps {
  className?: string;
}

export function GoogleLoginButton({ className }: GoogleLoginButtonProps) {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
      const scope = 'openid email profile';
      const responseType = 'code';

      // 백엔드 서버에서 state값과 redirect 주소 획득
      const response = await clientFetch.get(
        `/auth/google/url?redirectUri=${redirectUri}`,
      );
      const { state } = response.data.state;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}`;

      // Next.js router를 사용한 외부 URL 리디렉션
      router.push(googleAuthUrl);
    } catch (error) {
      console.error('Google 로그인 URL 요청 실패:', error);
      toast.error('로그인 준비 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Button onClick={handleGoogleLogin} variant="outline" className={className}>
      Google로 로그인
    </Button>
  );
}
