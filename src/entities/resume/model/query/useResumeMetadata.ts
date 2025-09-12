import { useQuery } from '@tanstack/react-query';
import { ResumeMetadata } from '..';
import { fetchResumeMetadata } from '@/entities';

export const useResumeMetadata = () => {
  return useQuery<ResumeMetadata, Error, ResumeMetadata['data']>({
    queryKey: ['resume', 'metadata'],
    queryFn: fetchResumeMetadata,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 가비지 컬렉션 방지
    refetchOnWindowFocus: false,
    select: (data) => data.data, // 필요한 데이터만 선택 가능
  });
};
