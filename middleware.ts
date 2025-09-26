import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 인증이 필요한 경로들
 */
const protectedRoutes = [
  '/cover-letter',
  '/resume',
  '/interview-questions',
  '/admin/users/statistics',
  '/admin/users',
  '/admin/crawl',
  '/admin/restore',
];

/**
 * 공개 경로들 (인증 없이 접근 가능)
 */
const publicRoutes = [
  '/',
  '/auth/callback/google',
  '/auth/refresh', // 토큰 갱신 페이지 추가
  // 필요에 따라 더 추가
];

/**
 * 인증 상태를 확인하는 함수
 */
async function checkAuthStatus(
  request: NextRequest,
): Promise<
  boolean | 'refresh_needed' | { authenticated?: boolean; role?: string }
> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // MSW 사용 시 인증 우회
    const isMswEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

    if (isMswEnabled) {
      // MSW 환경에서는 기본적으로 인증된 것으로 처리
      return true;
    }

    // 프로덕션 환경에서는 실제 API 호출
    const cookieHeader = request.headers.get('cookie') || '';
    const authUrl = `${apiUrl}/auth/status`;

    const makeStatusRequest = async () =>
      fetch(authUrl, {
        method: 'GET',
        headers: {
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        credentials: 'include',
        cache: 'no-store',
      });

    // 1) 초기 인증 상태 확인
    let response = await makeStatusRequest();

    // 2) 인증 실패(401)인 경우 토큰 갱신이 필요함을 표시
    if (!response.ok && response.status === 401) {
      // 미들웨어에서는 토큰 갱신을 시도하지 않고
      // 클라이언트에서 처리하도록 특별한 상태 반환
      return 'refresh_needed' as any;
    }

    if (response.ok) {
      const data = await response.json();
      // Return the API's data object so middleware can inspect role, etc.
      // expected shape: { authenticated: boolean, role?: string, ... }
      return data.data || (data.success && { authenticated: true });
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
    const authResult = await checkAuthStatus(request);

    if (authResult === 'refresh_needed') {
      // 토큰 갱신이 필요한 경우 갱신 페이지로 리다이렉트
      const url = request.nextUrl.clone();
      url.pathname = '/auth/refresh';
      url.searchParams.set('redirect', pathname); // 원래 가려던 페이지 저장
      return NextResponse.redirect(url);
    }

    if (!authResult) {
      // 인증되지 않은 경우 홈페이지로 리다이렉트
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // 추가: /admin 경로 접근시 role 체크 (USER는 접근 불가)
  if (pathname.startsWith('/admin')) {
    const authResult = await checkAuthStatus(request);

    if (authResult === 'refresh_needed') {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/refresh';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // authResult may be an object with role
    if (typeof authResult === 'object') {
      const role = (authResult as any).role;
      const authenticated = (authResult as any).authenticated;
      if (!authenticated || role === 'USER') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } else if (!authResult) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cover-letter/:path*',
    '/resume/:path*',
    '/interview-questions/:path*',
    '/admin/:path*',
  ],
};
