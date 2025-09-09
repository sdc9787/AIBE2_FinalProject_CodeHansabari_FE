import { clientFetch } from '@/shared/api';
import {
  CustomQuestionAnswerResponse,
  CustomQuestionRequest,
} from '../model/type';

// 커스텀 질문 AI 답변 생성 API
export async function createCustomQuestionAnswer(
  coverLetterId: number,
  data: CustomQuestionRequest,
): Promise<CustomQuestionAnswerResponse> {
  const response = await clientFetch.post<CustomQuestionAnswerResponse>(
    `/v1/me/cover-letters/${coverLetterId}/interview-questions/custom-answer`,
    data,
  );

  return response;
}
