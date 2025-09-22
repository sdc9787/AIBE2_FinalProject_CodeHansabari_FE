import { http, HttpResponse } from 'msw';
import {
  mockAdminResumeList,
  mockAdminCoverLetterList,
  mockCrawlList,
  mockCrawlDetail,
  mockCrawlStartResponse,
  mockCrawlDeleteResponse,
  mockCrawlUpdateResponse,
  mockAdminResumePatchResponse,
  mockAdminCoverLetterPatchResponse,
  mockAdminMemberList,
  mockAdminMemberDetail,
  mockAdminMemberStatistics,
} from './AdminMocks';

export const adminHandlers = [
  // 데이터 조회 및 복구
  http.get('/api/v1/admin/resumes', () => {
    return HttpResponse.json(mockAdminResumeList);
  }),

  http.get('/api/v1/admin/cover-letters', () => {
    return HttpResponse.json(mockAdminCoverLetterList);
  }),

  http.patch('/api/v1/admin/resumes/:id', () => {
    return HttpResponse.json(mockAdminResumePatchResponse);
  }),

  http.patch('/api/v1/admin/cover-letters/:id', () => {
    return HttpResponse.json(mockAdminCoverLetterPatchResponse);
  }),

  // crawl endpoints (migrated to /api/crawled-cover-letters)
  http.get('/api/crawled-cover-letters/', async ({ request }) => {
    // simple pagination based on query params
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 20;

    const all = mockCrawlList.data.content;
    const start = page * size;
    const end = start + size;
    const content = all.slice(start, end);

    return HttpResponse.json({
      ...mockCrawlList,
      data: {
        content,
        pageable: {
          sort: { sorted: true, unsorted: false, empty: false },
          offset: start,
          pageNumber: page,
          pageSize: size,
          paged: true,
          unpaged: false,
        },
        totalElements: all.length,
        totalPages: Math.max(1, Math.ceil(all.length / size)),
        last: page >= Math.ceil(all.length / size) - 1,
        size,
        number: page,
        sort: { sorted: true, unsorted: false, empty: false },
        numberOfElements: content.length,
        first: page === 0,
        empty: content.length === 0,
      },
    });
  }),

  http.get('/api/crawled-cover-letters/:id', () => {
    // Return the same detail mock for now
    return HttpResponse.json(mockCrawlDetail);
  }),

  //feature
  http.post('/api/crawled-cover-letters', () => {
    return HttpResponse.json(mockCrawlStartResponse);
  }),

  http.delete('/api/crawled-cover-letters', () => {
    return HttpResponse.json(mockCrawlDeleteResponse);
  }),

  http.delete('/api/crawled-cover-letters/:id', () => {
    return HttpResponse.json(mockCrawlDeleteResponse);
  }),

  http.put('/api/crawled-cover-letters/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { text?: string };

    // find and update the item in the in-memory mock list
    const all = mockCrawlList.data.content;
    const idx = all.findIndex((it) => it.coverLetterId === id);
    if (idx === -1) {
      return HttpResponse.json({
        success: false,
        message: '해당 크롤링 데이터를 찾을 수 없습니다.',
        data: null,
        timestamp: new Date().toISOString(),
      });
    }

    const now = new Date().toISOString();
    const existing = all[idx];
    const updated = {
      ...existing,
      text: body.text ?? existing.text,
      updatedAt: now,
    };
    all[idx] = updated;

    // also update detail mock if it matches
    if (mockCrawlDetail && mockCrawlDetail.data?.coverLetterId === id) {
      mockCrawlDetail.data = {
        ...mockCrawlDetail.data,
        text: updated.text,
        updatedAt: now,
      };
    }

    return HttpResponse.json({
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        coverLetterId: id,
        text: updated.text,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
      timestamp: now,
    });
  }),

  // 회원 관리 API
  http.get('/api/v1/admin', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;
    const email = url.searchParams.get('email');
    const name = url.searchParams.get('name');
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');

    // 필터링 로직 (간단한 예시)
    let filteredContent = [...mockAdminMemberList.data.content];

    if (email) {
      filteredContent = filteredContent.filter((member) =>
        member.email.toLowerCase().includes(email.toLowerCase()),
      );
    }

    if (name) {
      filteredContent = filteredContent.filter((member) =>
        member.name.includes(name),
      );
    }

    if (role) {
      filteredContent = filteredContent.filter(
        (member) => member.role === role,
      );
    }

    if (status) {
      filteredContent = filteredContent.filter(
        (member) => member.status === status,
      );
    }

    // 페이징 처리
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const pagedContent = filteredContent.slice(startIndex, endIndex);

    return HttpResponse.json({
      ...mockAdminMemberList,
      data: {
        ...mockAdminMemberList.data,
        content: pagedContent,
        totalElements: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / size),
        size,
        number: page,
        first: page === 0,
        last: page >= Math.ceil(filteredContent.length / size) - 1,
      },
    });
  }),

  // 통계 API는 더 구체적인 경로를 먼저 매칭하도록 순서 변경
  http.get('/api/v1/admin/statistics', async () => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8초 지연
    console.log('MSW: Statistics API called');
    return HttpResponse.json(mockAdminMemberStatistics);
  }),

  http.get('/api/v1/admin/:memberId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 지연

    const memberId = Number(params.memberId);
    console.log('MSW: Member detail API called for memberId:', memberId);

    // memberId에 따라 다른 데이터 반환 (예시)
    const memberDetail = {
      ...mockAdminMemberDetail.data,
      memberId,
      email: `user${memberId}@example.com`,
      name: `사용자${memberId}`,
    };

    return HttpResponse.json({
      ...mockAdminMemberDetail,
      data: memberDetail,
    });
  }),

  // 회원 상태 변경
  http.put('/api/v1/admin/:memberId/status', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

    const memberId = Number(params.memberId);
    const body = (await request.json()) as { status: string; reason: string };

    return HttpResponse.json({
      success: true,
      message: '회원 상태가 변경되었습니다.',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }),

  // 회원 역할 변경
  http.put('/api/v1/admin/:memberId/role', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

    const memberId = Number(params.memberId);
    const body = (await request.json()) as { role: string; reason: string };

    return HttpResponse.json({
      success: true,
      message: '회원 역할이 변경되었습니다.',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }),

  // 회원 강제 로그아웃
  http.post('/api/v1/admin/:memberId/force-logout', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // 0.8초 지연

    const memberId = Number(params.memberId);

    return HttpResponse.json({
      success: true,
      message: '회원이 강제 로그아웃되었습니다.',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }),
];
