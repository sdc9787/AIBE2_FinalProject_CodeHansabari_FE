import { useQuery } from '@tanstack/react-query';
import { fetchUserMe } from '../../api';
import { USER_QUERY_KEYS } from './queryKey';

export function useUserMe() {
  return useQuery({
    queryKey: USER_QUERY_KEYS.me,
    queryFn: fetchUserMe,
    retry: false, // 인증 실패 시 재시도 하지 않음
    staleTime: 1000 * 60 * 5, // 5분간 stale하지 않음
  });
}
