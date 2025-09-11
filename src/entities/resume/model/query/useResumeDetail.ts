import { useQuery } from '@tanstack/react-query';
import { fetchResumeDetail, ResponseResumeDetail } from '@/entities';

export const useResumeDetail = (resumeId?: number) => {
  return useQuery<ResponseResumeDetail, Error, ResponseResumeDetail['data']>({
    queryKey: ['resumeDetail', resumeId],
    queryFn: () => fetchResumeDetail(resumeId!),
    enabled: !!resumeId,
    select: (res) => res.data,
  });
};
