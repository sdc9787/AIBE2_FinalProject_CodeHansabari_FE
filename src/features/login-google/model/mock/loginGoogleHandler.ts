import { http, HttpResponse } from 'msw';

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
      return HttpResponse.json({
        success: true,
        message: '로그인이 성공적으로 완료되었습니다.',
        data: {
          message: '구글 로그인 성공',
          member: {
            memberId: 12345,
            email: 'test@example.com',
            name: '테스트 사용자',
            picture: 'https://via.placeholder.com/150',
          },
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
];
