import { clientFetch } from '@/shared/api';
import { InterviewQnaListResponse } from '../model';

// 기존 면접 질문/답변 조회 API
export async function getInterviewQuestions(
  coverLetterId: number,
): Promise<InterviewQnaListResponse> {
  const response = await clientFetch.get<InterviewQnaListResponse>(
    `/api/v1/me/cover-letters/${coverLetterId}/interview-questions`,
  );

  return response;
}
