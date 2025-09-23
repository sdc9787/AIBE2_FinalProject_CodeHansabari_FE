import { http, HttpResponse } from 'msw';
import {
  mockCoverLetterFeaturesStatistics,
  mockRawCoverLetterFeature,
  mockCoverLetterFeature,
} from './mock';

export const coverLetterFeaturesHandlers = [
  // 통계
  http.get('/api/cover-letter-features/statistics', () => {
    return HttpResponse.json(mockCoverLetterFeaturesStatistics);
  }),

  // raw 전체 (paging)
  http.get('/api/cover-letter-features/raw', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '0');
    const size = Number(url.searchParams.get('size') || '20');
    const start = page * size + 1;
    const content = Array.from({ length: Math.min(size, 5) }).map((_, i) =>
      mockRawCoverLetterFeature(start + i),
    );

    return HttpResponse.json({
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        content,
        pageable: { pageNumber: page, pageSize: size },
        totalElements: 5,
        totalPages: 1,
        numberOfElements: content.length,
        size,
        number: page,
        first: true,
        last: true,
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
      const content = Array.from({ length: Math.min(size, 5) }).map((_, i) => ({
        ...mockRawCoverLetterFeature(i + 1),
        featuresCategory: category,
      }));

      return HttpResponse.json({
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          content,
          pageable: { pageNumber: page, pageSize: size },
          totalElements: 5,
          totalPages: 1,
          numberOfElements: content.length,
          size,
          number: page,
          first: true,
          last: true,
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
    const content = Array.from({ length: Math.min(size, 5) }).map((_, i) =>
      mockCoverLetterFeature(page * size + i + 1),
    );

    return HttpResponse.json({
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        content,
        pageable: { pageNumber: page, pageSize: size },
        totalElements: 5,
        totalPages: 1,
        numberOfElements: content.length,
        size,
        number: page,
        first: true,
        last: true,
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
      const content = Array.from({ length: Math.min(size, 5) }).map((_, i) => ({
        ...mockCoverLetterFeature(i + 1),
        featuresCategory: category,
      }));

      return HttpResponse.json({
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          content,
          pageable: { pageNumber: page, pageSize: size },
          totalElements: 5,
          totalPages: 1,
          numberOfElements: content.length,
          size,
          number: page,
          first: true,
          last: true,
          empty: content.length === 0,
        },
      });
    },
  ),
];
