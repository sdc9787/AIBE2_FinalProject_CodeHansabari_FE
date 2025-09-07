import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api';
import { USER_QUERY_KEYS } from '@/entities/user/model/query/queryKey';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // 사용자 관련 쿼리 무효화
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.me });
      // 페이지 새로고침으로 인증 상태 초기화
      window.location.href = '/';
    },
  });
}
