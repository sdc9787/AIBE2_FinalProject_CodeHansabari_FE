import { http, HttpResponse } from 'msw';
import { mockAISuggestResponse } from '@/entities/resume/model/mocks';
import type { AISuggestRequest, AISuggestApiResponse } from '@/entities/resume';

export const aiSuggestResumeHandlers = [
  http.post('/api/v1/resumes/ai-suggest', async () => {
    // AI 처리 시뮬레이션을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response: AISuggestApiResponse = {
      success: true,
      message: 'AI 이력서 첨삭 제안이 생성되었습니다.',
      data: mockAISuggestResponse,
      timestamp: new Date().toISOString(),
    };

    return HttpResponse.json(response);
  }),
];
