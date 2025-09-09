import { useQuery } from '@tanstack/react-query';
import { fetchResumeList } from '../../api';
import { Resume, ResumeListResponse } from '../type';

export const useResumeList = () => {
  return useQuery<ResumeListResponse, Error, Resume[]>({
    queryKey: ['resumeList'],
    queryFn: fetchResumeList,
    select: (res) => res.data,
  });
};
