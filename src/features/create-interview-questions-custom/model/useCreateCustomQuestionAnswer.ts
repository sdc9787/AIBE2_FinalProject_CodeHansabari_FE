import {
  createCustomQuestionAnswer,
  CustomQuestionAnswerResponse,
  CustomQuestionRequest,
} from '@/features';
import { interviewQuestionsQueryKeys } from '@/entities';
import { useCustomMutation } from '@/shared/lib';

interface UseCreateCustomQuestionAnswerArgs {
  coverLetterId: number;
}

export const useCreateCustomQuestionAnswer = ({
  coverLetterId,
}: UseCreateCustomQuestionAnswerArgs) => {
  return useCustomMutation<CustomQuestionRequest, CustomQuestionAnswerResponse>(
    {
      mutationFn: (data: CustomQuestionRequest) =>
        createCustomQuestionAnswer(coverLetterId, data),
      successMessage: '커스텀 질문에 대한 답변이 성공적으로 생성되었습니다.',
      invalidateQueryKeys: [
        [...interviewQuestionsQueryKeys.list(coverLetterId)],
      ],
      loadingType: 'global',
    },
  );
};
