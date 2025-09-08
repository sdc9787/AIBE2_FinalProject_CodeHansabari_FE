import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 인증이 필요한 경로들
 */
const protectedRoutes = [
  '/cover-letter',
  // 필요에 따라 더 추가
];

/**
 * 공개 경로들 (인증 없이 접근 가능)
 */
const publicRoutes = [
  '/',
  '/auth/callback/google',
  // 필요에 따라 더 추가
];

/**
 * 인증 상태를 확인하는 함수
 */
async function checkAuthStatus(request: NextRequest): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // 개발 환경에서 MSW 사용 시
    const isMswEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isMswEnabled && isDevelopment && apiUrl?.includes('localhost')) {
      // MSW 개발 환경에서는 기본적으로 인증된 것으로 처리
      return true;
    }

    // 프로덕션 환경에서는 실제 API 호출
    const cookieHeader = request.headers.get('cookie') || '';
    const authUrl = `${apiUrl}/auth/status`;

    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.success && data.data.authenticated;
    }

    return false;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 라우트는 미들웨어에서 제외
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 공개 경로는 인증 체크 없이 통과
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 보호된 경로인지 확인
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // 실제 API를 통한 인증 상태 확인
    const isAuthenticated = await checkAuthStatus(request);

    if (!isAuthenticated) {
      // 인증되지 않은 경우 홈페이지로 리다이렉트
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cover-letter/:path*'],
};
