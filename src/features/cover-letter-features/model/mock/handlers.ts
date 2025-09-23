import { http, HttpResponse } from 'msw';
import {
  mockProcessResponse,
  mockExtractResponse,
  mockDeduplicateResponse,
  mockErrorResponse,
} from './mock';

export const coverLetterFeaturesHandlers = [
  // 전체 프로세스 실행
  http.post('/api/cover-letter-features/process', async () => {
    try {
      // 시뮬레이션: 긴 작업의 경우 딜레이 추가
      await new Promise((res) => setTimeout(res, 2000));
      return HttpResponse.json(mockProcessResponse);
    } catch (err) {
      console.error('cover-letter-features/process handler error', err);
      return HttpResponse.json(mockErrorResponse, { status: 500 });
    }
  }),

  // 특징 추출
  http.post('/api/cover-letter-features/extract', async () => {
    try {
      await new Promise((res) => setTimeout(res, 1500));
      return HttpResponse.json(mockExtractResponse);
    } catch (err) {
      console.error('cover-letter-features/extract handler error', err);
      return HttpResponse.json(mockErrorResponse, { status: 500 });
    }
  }),

  // 중복 제거
  http.post('/api/cover-letter-features/deduplicate', async () => {
    try {
      await new Promise((res) => setTimeout(res, 1200));
      return HttpResponse.json(mockDeduplicateResponse);
    } catch (err) {
      console.error('cover-letter-features/deduplicate handler error', err);
      return HttpResponse.json(mockErrorResponse, { status: 500 });
    }
  }),
];
