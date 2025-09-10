import { http, HttpResponse } from 'msw';
import {
  createMockInterviewQnaListResponse,
  createMockCreateQuestionsResponse,
  createMockCustomAnswerResponse,
} from './index';
import type { CustomQuestionRequest } from '../type';

export const interviewQuestionsHandlers = [
  // 기존 면접 질문/답변 조회
  http.get(
    '/api/v1/me/cover-letters/:coverLetterId/interview-questions',
    ({ params }) => {
      const coverLetterId = Number(params.coverLetterId);

      // 시뮬레이션을 위한 지연
      return new Promise((resolve) => {
        setTimeout(() => {
          const response = createMockInterviewQnaListResponse(coverLetterId);
          resolve(HttpResponse.json(response));
        }, 500);
      });
    },
  ),

  // 면접 질문/답변 생성
  http.post(
    '/api/v1/me/cover-letters/:coverLetterId/interview-questions',
    async ({ params }) => {
      const coverLetterId = Number(params.coverLetterId);

      // AI 처리 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 최대 15개 제한 체크
      const existingQuestions =
        createMockInterviewQnaListResponse(coverLetterId);
      if (existingQuestions.data.totalCount >= 15) {
        return HttpResponse.json(
          {
            timestamp: new Date().toISOString(),
            status: 409,
            error: 'Conflict',
            errorCode: 'INTERVIEW_LIMIT_EXCEEDED',
            message: '더 이상 질문을 생성할 수 없습니다. (최대 15개)',
            errors: {},
          },
          { status: 409 },
        );
      }

      const response = createMockCreateQuestionsResponse(coverLetterId);
      return HttpResponse.json(response);
    },
  ),

  // 커스텀 질문 AI 답변 생성
  http.post(
    '/api/v1/me/cover-letters/:coverLetterId/interview-questions/custom-answer',
    async ({ request, params }) => {
      try {
        const coverLetterId = Number(params.coverLetterId);
        const body = (await request.json()) as CustomQuestionRequest;

        // 유효성 검증
        if (!body.question || body.question.trim() === '') {
          return HttpResponse.json(
            {
              timestamp: new Date().toISOString(),
              status: 400,
              error: 'Bad Request',
              errorCode: 'VALIDATION_ERROR',
              message: '질문은 필수입니다.',
              errors: {},
            },
            { status: 400 },
          );
        }

        // AI 처리 시뮬레이션을 위한 지연
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 커스텀 답변 생성
        const response = createMockCustomAnswerResponse(body.question);

        // 생성된 면접 질문 리스트에 추가
        const existingQnas =
          createMockInterviewQnaListResponse(coverLetterId).data.qnaList;
        const newQnaId = Math.max(...existingQnas.map((q) => q.qnaId), 0) + 1;

        const newQna = {
          qnaId: newQnaId,
          question: body.question,
          answer: response.data.answer,
          tip: response.data.tip,
          createdAt: new Date().toISOString(),
        };

        // mockInterviewQnaByLetter에 새 질문 추가
        const { mockInterviewQnaByLetter } = await import('./index');
        if (!mockInterviewQnaByLetter[coverLetterId]) {
          mockInterviewQnaByLetter[coverLetterId] = [];
        }
        mockInterviewQnaByLetter[coverLetterId].push(newQna);

        return HttpResponse.json(response);
      } catch {
        return HttpResponse.json(
          {
            timestamp: new Date().toISOString(),
            status: 500,
            error: 'Internal Server Error',
            errorCode: 'INTERVIEW_SERVICE_ERROR',
            message: '커스텀 질문 답변 생성에 실패했습니다.',
            errors: {},
          },
          { status: 500 },
        );
      }
    },
  ),
];
