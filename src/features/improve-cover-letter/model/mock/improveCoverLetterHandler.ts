import { http, HttpResponse } from 'msw';
import {
  mockImproveCoverLetterResponse,
  mockImproveCoverLetterResponseVariations,
  mockErrorResponse,
} from './mock';

export const improveCoverLetterHandlers = [
  // AI 자소서 개선 핸들러
  http.post('/api/v1/cover-letters/ai-improve', async ({ request }) => {
    try {
      const body = await request.json();

      // 요청 데이터 검증
      if (!body || typeof body !== 'object') {
        return HttpResponse.json(mockErrorResponse, { status: 400 });
      }

      const { content, jobField, experienceYears, customPrompt } = body;

      // 필수 필드 검증
      if (!content || content.trim().length === 0) {
        return HttpResponse.json(
          {
            success: false,
            message: '자기소개서 내용을 입력해주세요.',
            data: null,
          },
          { status: 400 },
        );
      }

      // 2초 딜레이 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 직무 분야에 따른 응답 선택
      let response;
      if (
        jobField?.includes('프론트') ||
        jobField?.includes('frontend') ||
        jobField?.includes('Frontend')
      ) {
        response = mockImproveCoverLetterResponseVariations[0];
      } else if (
        jobField?.includes('신입') ||
        experienceYears === 0 ||
        experienceYears === '0'
      ) {
        response = mockImproveCoverLetterResponseVariations[1];
      } else if (jobField?.includes('데이터') || jobField?.includes('분석')) {
        // 데이터 관련 응답이 있다면 사용, 없으면 기본 응답
        response = mockImproveCoverLetterResponse;
      } else {
        // 기본 백엔드 개발자 응답
        response = mockImproveCoverLetterResponse;
      }

      // 커스텀 프롬프트가 있는 경우 피드백에 반영
      if (customPrompt && customPrompt.trim().length > 0) {
        response = {
          ...response,
          data: {
            ...response.data,
            feedback: {
              ...response.data.feedback,
              summary: `${response.data.feedback.summary} 요청사항: "${customPrompt}"을 반영하여 추가로 개선하였습니다.`,
            },
          },
        };
      }

      return HttpResponse.json(response);
    } catch (error) {
      console.error('Improve cover letter handler error:', error);
      return HttpResponse.json(mockErrorResponse, { status: 500 });
    }
  }),

  // 자소서 개선 상태 확인 핸들러 (옵션)
  http.get('/api/v1/cover-letters/ai-improve/status/:taskId', () => {
    return HttpResponse.json({
      success: true,
      message: '처리 완료',
      data: {
        status: 'completed',
        progress: 100,
        estimatedTime: 0,
      },
    });
  }),
];
