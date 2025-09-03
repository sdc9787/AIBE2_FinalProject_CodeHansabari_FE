import { http, HttpResponse } from 'msw';

export const saveCoverLetterHandler = [
  http.post('/api/v1/cover-letters', async ({ request }) => {
    try {
      const body = await request.json();

      // 요청 데이터 검증
      const { title, content, jobField, experienceYears, isAiImproved } =
        body as {
          title: string;
          content: string;
          jobField: string;
          experienceYears: number;
          isAiImproved: boolean;
        };

      // 필수 필드 검증
      if (
        !title ||
        !content ||
        !jobField ||
        experienceYears === undefined ||
        isAiImproved === undefined
      ) {
        return HttpResponse.json(
          {
            success: false,
            message: '필수 필드가 누락되었습니다.',
            data: null,
          },
          { status: 400 },
        );
      }

      // 성공 응답
      return HttpResponse.json(
        {
          success: true,
          message: '원본 자소서가 저장되었습니다.',
          data: null,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error('Save cover letter error:', error);
      // 에러 응답
      return HttpResponse.json(
        {
          success: false,
          message: '자소서 저장 중 오류가 발생했습니다.',
          data: null,
        },
        { status: 500 },
      );
    }
  }),
];
