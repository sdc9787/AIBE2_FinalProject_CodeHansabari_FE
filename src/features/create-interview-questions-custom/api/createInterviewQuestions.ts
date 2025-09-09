import { clientFetch } from '@/shared/api';
import { CreateInterviewQuestionsResponse } from '../model/type';

// 면접 질문/답변 생성 API
export async function createInterviewQuestions(
  coverLetterId: number,
): Promise<CreateInterviewQuestionsResponse> {
  const response = await clientFetch.post<CreateInterviewQuestionsResponse>(
    `/v1/me/cover-letters/${coverLetterId}/interview-questions`,
  );

  return response;
}
