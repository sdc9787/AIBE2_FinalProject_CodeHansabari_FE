import { useQuery } from '@tanstack/react-query';
import { fetchResumeList } from '../../api';

export const useResumeList = () => {
  return useQuery({
    queryKey: ['resumeList'],
    queryFn: fetchResumeList,
  });
};
