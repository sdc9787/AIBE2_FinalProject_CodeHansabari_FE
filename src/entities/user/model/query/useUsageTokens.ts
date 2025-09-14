import { useQuery } from '@tanstack/react-query';
import { TokenUsage } from '../type';
import { fetchUsageToken } from '../../api';

export function useUsageTokens() {
  const query = useQuery<TokenUsage, Error, TokenUsage['data']>({
    queryKey: ['usageTokens'],
    queryFn: fetchUsageToken,
    staleTime: 1000 * 60 * 5, // 5분간 stale하지 않음
    select: (data) => data.data, // 필요한 데이터만 선택 가능
  });
  return query;
}
