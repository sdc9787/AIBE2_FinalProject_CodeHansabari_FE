import { http, HttpResponse } from 'msw';

// 사용자 정보 타입 정의
interface UserInfo {
  memberId: number;
  email: string;
  name: string;
  picture: string;
}

// 로컬 테스트를 위한 인증 상태 관리
// 테스트를 위해 초기에 인증된 상태로 설정
let isUserAuthenticated = true;
let currentUser: UserInfo | null = {
  memberId: 12345,
  email: 'test@example.com',
  name: '테스트 사용자',
  picture: 'https://via.placeholder.com/150',
};

export const loginGoogleHandler = [
  http.get('/auth/google/url', ({ request }) => {
    const url = new URL(request.url);
    const redirectUri = url.searchParams.get('redirectUri');

    // 하드코딩된 state 값
    const state = 'hardcoded-state-value-for-testing';

    // 더미 Google OAuth URL
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=dummy_client_id&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&state=${state}`;

    return HttpResponse.json({
      success: true,
      message: '구글 로그인 URL이 성공적으로 생성되었습니다.',
      data: {
        loginUrl: loginUrl,
        state: state,
      },
      errorCode: null,
      canRetry: true,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/auth/google/login', async ({ request }) => {
    try {
      const body = await request.json();
      const { code, state, redirectUri } = body as {
        code: string;
        state: string;
        redirectUri: string;
      };

      // 간단한 검증 로직
      if (!code || !state || !redirectUri) {
        return HttpResponse.json(
          {
            success: false,
            message: '필수 파라미터가 누락되었습니다.',
            data: null,
            errorCode: 'MISSING_PARAMETERS',
            canRetry: false,
            timestamp: new Date().toISOString(),
          },
          { status: 400 },
        );
      }

      // state 검증 (하드코딩된 값과 비교)
      if (state !== 'hardcoded-state-value-for-testing') {
        return HttpResponse.json(
          {
            success: false,
            message: '인증에 실패했습니다.',
            data: null,
            errorCode: 'AUTHENTICATION_FAILED',
            canRetry: false,
            timestamp: new Date().toISOString(),
          },
          { status: 401 },
        );
      }

      // 성공적인 로그인 응답
      const userInfo = {
        memberId: 12345,
        email: 'test@example.com',
        name: '테스트 사용자',
        picture: 'https://via.placeholder.com/150',
      };

      // 인증 상태 업데이트
      isUserAuthenticated = true;
      currentUser = userInfo;

      return HttpResponse.json({
        success: true,
        message: '로그인이 성공적으로 완료되었습니다.',
        data: {
          message: '구글 로그인 성공',
          member: userInfo,
          note: '테스트 계정으로 로그인되었습니다.',
        },
        errorCode: null,
        canRetry: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Login error:', error);
      return HttpResponse.json(
        {
          success: false,
          message: '서버 내부 오류가 발생했습니다.',
          data: null,
          errorCode: 'INTERNAL_SERVER_ERROR',
          canRetry: true,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }
  }),

  // 인증 상태 확인 API
  http.get('/auth/status', () => {
    // 인증되지 않은 경우
    if (!isUserAuthenticated || !currentUser) {
      return HttpResponse.json(
        {
          success: false,
          message: '인증되지 않은 사용자입니다.',
          data: {
            authenticated: false,
            member: null,
          },
          errorCode: 'UNAUTHENTICATED',
          canRetry: false,
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      );
    }

    // 인증된 경우
    return HttpResponse.json({
      success: true,
      message: '인증된 사용자입니다.',
      data: {
        authenticated: true,
        member: currentUser,
      },
      errorCode: null,
      canRetry: true,
      timestamp: new Date().toISOString(),
    });
  }),

  // 로그아웃 API
  http.post('/auth/logout', () => {
    // 인증 상태 초기화
    isUserAuthenticated = false;
    currentUser = null;

    return HttpResponse.json({
      success: true,
      message: '로그아웃이 성공적으로 완료되었습니다.',
      data: null,
      errorCode: null,
      canRetry: false,
      timestamp: new Date().toISOString(),
    });
  }),

  // 개발용: 인증 상태 토글 API
  http.post('/dev/toggle-auth', () => {
    if (isUserAuthenticated) {
      // 로그아웃
      isUserAuthenticated = false;
      currentUser = null;
      return HttpResponse.json({
        success: true,
        message: '테스트용 로그아웃 완료',
        data: { authenticated: false },
      });
    } else {
      // 로그인
      isUserAuthenticated = true;
      currentUser = {
        memberId: 12345,
        email: 'test@example.com',
        name: '테스트 사용자',
        picture: 'https://via.placeholder.com/150',
      };
      return HttpResponse.json({
        success: true,
        message: '테스트용 로그인 완료',
        data: { authenticated: true, member: currentUser },
      });
    }
  }),
];
