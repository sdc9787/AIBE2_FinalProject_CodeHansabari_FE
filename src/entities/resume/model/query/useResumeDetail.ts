import { useQuery } from '@tanstack/react-query';
import { fetchResumeDetail } from '../../api';

export const useResumeDetail = (resumeId?: number) => {
  return useQuery({
    queryKey: ['resumeDetail', resumeId],
    queryFn: () => fetchResumeDetail(resumeId!),
    enabled: !!resumeId,
  });
};
