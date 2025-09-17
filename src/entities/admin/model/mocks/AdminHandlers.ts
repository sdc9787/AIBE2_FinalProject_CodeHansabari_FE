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

  // crawl endpoints
  http.get('/api/crawl/cover-letters', () => {
    return HttpResponse.json(mockCrawlList);
  }),

  http.get('/api/crawl/cover-letters/:id', () => {
    // Return the same detail mock for now
    return HttpResponse.json(mockCrawlDetail);
  }),

  //feature
  http.post('/api/crawl/cover-letters', () => {
    return HttpResponse.json(mockCrawlStartResponse);
  }),

  http.delete('/api/crawl/cover-letters', () => {
    return HttpResponse.json(mockCrawlDeleteResponse);
  }),

  http.delete('/api/crawl/cover-letters/:id', () => {
    return HttpResponse.json(mockCrawlDeleteResponse);
  }),

  http.put('/api/crawl/cover-letters/:id', () => {
    return HttpResponse.json(mockCrawlUpdateResponse);
  }),
];
