import { useQuery } from '@tanstack/react-query';
import { interviewQuestionsQueryKeys } from './queryKey';
import { InterviewQnaListResponse, InterviewQnaListData } from '../index';
import { getInterviewQuestions } from '../../api/index';

export const useInterviewQuestions = (coverLetterId: number) => {
  return useQuery<InterviewQnaListResponse, Error, InterviewQnaListData>({
    queryKey: interviewQuestionsQueryKeys.list(coverLetterId),
    queryFn: () => getInterviewQuestions(coverLetterId),
    enabled: !!coverLetterId,
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 하지 않음
    select: (data) => data.data,
  });
};
