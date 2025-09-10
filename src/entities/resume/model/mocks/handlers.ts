import { http, HttpResponse } from 'msw';
import { mockResumes, mockAISuggestResponse } from './index';
import type {
  ResumeResponse,
  ResumeListResponse,
  CreateResumeRequest,
  UpdateResumeRequest,
  AISuggestApiResponse,
  Resume,
} from '../type';

const resumeDatabase = [...mockResumes];

export const resumeHandlers = [
  // 이력서 목록 조회
  http.get('/api/v1/resumes', () => {
    const response: ResumeListResponse = {
      success: true,
      message: '이력서 목록 조회 성공',
      data: resumeDatabase,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),

  // 이력서 상세 조회
  http.get('/api/v1/resumes/:id', ({ params }) => {
    const id = Number(params.id);
    const resume = resumeDatabase.find((r) => r.id === id);

    if (!resume) {
      const errorResponse: ResumeResponse = {
        success: false,
        message: '이력서를 찾을 수 없습니다.',
        data: {} as Resume,
        errorCode: 'RESUME_NOT_FOUND',
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    const response: ResumeResponse = {
      success: true,
      message: '이력서 조회 성공',
      data: resume,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),

  // 이력서 생성
  http.post('/api/v1/resumes', async ({ request }) => {
    const body = (await request.json()) as CreateResumeRequest;

    const newResume = {
      id: Math.max(...resumeDatabase.map((r) => r.id)) + 1,
      title: body.title,
      memberInfo: body.memberInfo,
      sections: body.sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    resumeDatabase.push(newResume);

    const response: ResumeResponse = {
      success: true,
      message: '이력서 생성 성공',
      data: newResume,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  // 이력서 수정
  http.put('/api/v1/resumes/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as UpdateResumeRequest;

    const resumeIndex = resumeDatabase.findIndex((r) => r.id === id);
    if (resumeIndex === -1) {
      const errorResponse: ResumeResponse = {
        success: false,
        message: '이력서를 찾을 수 없습니다.',
        data: {} as Resume,
        errorCode: 'RESUME_NOT_FOUND',
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    const updatedResume = {
      ...resumeDatabase[resumeIndex],
      title: body.title,
      memberInfo: body.memberInfo,
      sections: body.sections,
      updatedAt: new Date().toISOString(),
    };

    resumeDatabase[resumeIndex] = updatedResume;

    const response: ResumeResponse = {
      success: true,
      message: '이력서 수정 성공',
      data: updatedResume,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),

  // 이력서 삭제
  http.delete('/api/v1/resumes/:id', ({ params }) => {
    const id = Number(params.id);
    const resumeIndex = resumeDatabase.findIndex((r) => r.id === id);

    if (resumeIndex === -1) {
      const errorResponse = {
        success: false,
        message: '이력서를 찾을 수 없습니다.',
        errorCode: 'RESUME_NOT_FOUND',
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    resumeDatabase.splice(resumeIndex, 1);

    const response = {
      success: true,
      message: '이력서 삭제 성공',
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),

  // AI 이력서 첨삭 제안
  http.post('/api/v1/resumes/ai-suggest', async () => {
    // 실제로는 AI API를 호출하겠지만, mock에서는 미리 정의된 응답 반환
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 지연 시뮬레이션

    const response: AISuggestApiResponse = {
      success: true,
      message: 'AI 첨삭 제안 생성 완료',
      data: mockAISuggestResponse,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),
];
