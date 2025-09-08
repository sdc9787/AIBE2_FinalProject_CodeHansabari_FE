import { http, HttpResponse } from 'msw';

export const saveCoverLetterHandlers = [
  http.post('/api/v1/resumes/save', async ({ request }) => {
    const body = (await request.json()) as { title?: string };

    // 저장 시뮬레이션을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = {
      success: true,
      message: '이력서가 성공적으로 저장되었습니다.',
      data: {
        id: Math.floor(Math.random() * 1000) + 1,
        title: body?.title || '새 이력서',
        createdAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    return HttpResponse.json(response);
  }),
];
