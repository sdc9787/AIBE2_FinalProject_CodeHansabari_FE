import { useState, useEffect } from 'react';
import { checkAuthStatus, AuthStatusResponse } from '@/shared/api';

export interface UseAuthStatusReturn {
  isAuthenticated: boolean;
  user: AuthStatusResponse['data']['member'];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 인증 상태를 관리하는 커스텀 훅
 */
export function useAuthStatus(): UseAuthStatusReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthStatusResponse['data']['member']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await checkAuthStatus();

      if (response.success) {
        setIsAuthenticated(response.data.authenticated);
        setUser(response.data.member);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setError(response.message);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      setError(
        err instanceof Error
          ? err.message
          : '인증 상태 확인 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    refetch: fetchAuthStatus,
  };
}
