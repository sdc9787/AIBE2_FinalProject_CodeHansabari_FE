import { clientFetch } from './clientFetch';

export interface AuthStatusResponse {
  success: boolean;
  message: string;
  data: {
    authenticated: boolean;
    member: {
      memberId: number;
      email: string;
      name: string;
      picture: string;
    } | null;
  };
  errorCode: string | null;
  canRetry: boolean;
  timestamp: string;
}

/**
 * 현재 사용자의 인증 상태를 확인합니다.
 * 미들웨어나 컴포넌트에서 사용할 수 있습니다.
 */
export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  try {
    const response = await clientFetch.get('/auth/status');
    return response.data;
  } catch (error) {
    // 인증 실패 시 기본 응답 반환
    return {
      success: false,
      message: '인증 상태 확인에 실패했습니다.',
      data: {
        authenticated: false,
        member: null,
      },
      errorCode: 'AUTH_CHECK_FAILED',
      canRetry: true,
      timestamp: new Date().toISOString(),
    };
  }
}
