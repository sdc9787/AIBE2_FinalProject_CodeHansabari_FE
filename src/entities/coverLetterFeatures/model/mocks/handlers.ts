import { http, HttpResponse } from 'msw';
import {
  mockCoverLetterFeaturesStatistics,
  mockRawCoverLetterFeature,
  mockCoverLetterFeature,
  TOTAL_RAW,
  CATEGORY_DISTRIBUTION,
} from './mock';

export const coverLetterEntitiesHandlers = [
  // 통계
  http.get('/api/cover-letter-features/statistics', () => {
    return HttpResponse.json(mockCoverLetterFeaturesStatistics);
  }),

  // raw 전체 (paging)
  http.get('/api/cover-letter-features/raw', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const totalElements = TOTAL_RAW;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const startIdx = page * size + 1;
    const maxItems = Math.min(size, Math.max(0, totalElements - page * size));
    const content = Array.from({ length: maxItems }).map((_, i) =>
      mockRawCoverLetterFeature(startIdx + i),
    );

    return HttpResponse.json({
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        content,
        pageable: { pageNumber: page, pageSize: size },
        totalElements,
        totalPages,
        numberOfElements: content.length,
        size,
        number: page,
        first: page === 0,
        last: page >= totalPages - 1,
        empty: content.length === 0,
      },
    });
  }),

  // raw by category
  http.get(
    '/api/cover-letter-features/raw/category/:category',
    ({ params, request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || '0');
      const size = Number(url.searchParams.get('size') || '20');
      const category = params.category as string;
      const categoryTotal = CATEGORY_DISTRIBUTION[category] ?? 0;
      const totalElements = categoryTotal;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const startIdx = page * size + 1;
      const maxItems = Math.min(size, Math.max(0, totalElements - page * size));
      const content = Array.from({ length: maxItems }).map((_, i) =>
        mockRawCoverLetterFeature(startIdx + i, category),
      );

      return HttpResponse.json({
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          content,
          pageable: { pageNumber: page, pageSize: size },
          totalElements,
          totalPages,
          numberOfElements: content.length,
          size,
          number: page,
          first: page === 0,
          last: page >= totalPages - 1,
          empty: content.length === 0,
        },
      });
    },
  ),

  // final features list
  http.get('/api/cover-letter-features', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    // final features assume same TOTAL_RAW -> pagination based on TOTAL_RAW
    const totalElements = TOTAL_RAW;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const startIdx = page * size + 1;
    const maxItems = Math.min(size, Math.max(0, totalElements - page * size));
    const content = Array.from({ length: maxItems }).map((_, i) =>
      mockCoverLetterFeature(startIdx + i),
    );

    return HttpResponse.json({
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        content,
        pageable: { pageNumber: page, pageSize: size },
        totalElements,
        totalPages,
        numberOfElements: content.length,
        size,
        number: page,
        first: page === 0,
        last: page >= totalPages - 1,
        empty: content.length === 0,
      },
    });
  }),

  // final by category
  http.get(
    '/api/cover-letter-features/category/:category',
    ({ params, request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || '0');
      const size = Number(url.searchParams.get('size') || '20');
      const category = params.category as string;
      const categoryTotal = CATEGORY_DISTRIBUTION[category] ?? 0;
      const totalElements = categoryTotal;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const startIdx = page * size + 1;
      const maxItems = Math.min(size, Math.max(0, totalElements - page * size));
      const content = Array.from({ length: maxItems }).map((_, i) =>
        mockCoverLetterFeature(startIdx + i, category),
      );

      return HttpResponse.json({
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          content,
          pageable: { pageNumber: page, pageSize: size },
          totalElements,
          totalPages,
          numberOfElements: content.length,
          size,
          number: page,
          first: page === 0,
          last: page >= totalPages - 1,
          empty: content.length === 0,
        },
      });
    },
  ),
];
