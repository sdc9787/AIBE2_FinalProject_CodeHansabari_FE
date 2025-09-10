'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchUserMe } from '../../api';
import { USER_QUERY_KEYS } from './queryKey';
import { useUserStore } from '@/shared';

export function useUserMe() {
  const { setUser, clearUser } = useUserStore();

  const query = useQuery({
    queryKey: USER_QUERY_KEYS.me,
    queryFn: fetchUserMe,
    retry: false, // 인증 실패 시 재시도 하지 않음
    staleTime: 1000 * 60 * 5, // 5분간 stale하지 않음
  });

  useEffect(() => {
    if (query.data?.success && query.data.data) {
      setUser(query.data.data);
    } else if (query.error) {
      clearUser();
    }
  }, [query.data, query.error, setUser, clearUser]);

  return query;
}
