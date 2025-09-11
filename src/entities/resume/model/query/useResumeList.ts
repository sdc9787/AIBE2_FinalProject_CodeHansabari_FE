import { useQuery } from '@tanstack/react-query';
import {
  fetchResumeList,
  FetchResumeListParams,
  ResponseResumeList,
} from '@/entities';

export const useResumeList = (params: FetchResumeListParams) => {
  return useQuery<ResponseResumeList, Error, ResponseResumeList['data']>({
    queryKey: ['resumeList', params],
    queryFn: () => fetchResumeList(params),
    select: (res) => res.data,
  });
};
