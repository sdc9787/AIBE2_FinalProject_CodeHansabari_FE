import { useQuery } from '@tanstack/react-query';
import { fetchResumeDetail } from '../../api';
import { Resume, ResumeResponse } from '../type';

export const useResumeDetail = (resumeId?: number) => {
  return useQuery<ResumeResponse, Error, Resume>({
    queryKey: ['resumeDetail', resumeId],
    queryFn: () => fetchResumeDetail(resumeId!),
    enabled: !!resumeId,
    select: (res) => res.data,
  });
};
