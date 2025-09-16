import { interviewQuestionsQueryKeys } from '@/entities';
import {
  createInterviewQuestions,
  CreateInterviewQuestionsResponse,
} from '@/features';
import { useCustomMutation } from '@/shared/lib';

interface UseCreateInterviewQuestionsArgs {
  coverLetterId: number;
}

export const useCreateInterviewQuestions = ({
  coverLetterId,
}: UseCreateInterviewQuestionsArgs) => {
  return useCustomMutation<void, CreateInterviewQuestionsResponse>({
    mutationFn: () => createInterviewQuestions(coverLetterId),
    invalidateQueryKeys: [[...interviewQuestionsQueryKeys.list(coverLetterId)]],
    successMessage: '면접 질문/답변이 성공적으로 생성되었습니다.',
    loadingType: 'global',
    requireTokenCheck: true,
    tokenPreflightStrategy: 'fresh',
    usageToken: 3, // 이 작업이 2 토큰을 소모한다고 가정
  });
};
