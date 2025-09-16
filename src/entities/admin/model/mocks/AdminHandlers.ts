import { http, HttpResponse } from 'msw';
import {
  mockAdminResumeList,
  mockAdminCoverLetterList,
  mockCrawlList,
  mockCrawlDetail,
} from './AdminMocks';

export const adminHandlers = [
  http.get('/api/v1/admin/resumes', () => {
    return HttpResponse.json(mockAdminResumeList);
  }),

  http.get('/api/v1/admin/cover-letters', () => {
    return HttpResponse.json(mockAdminCoverLetterList);
  }),

  // crawl endpoints
  http.get('/api/crawl/cover-letters', () => {
    return HttpResponse.json(mockCrawlList);
  }),

  http.get('/api/crawl/cover-letters/:id', (req) => {
    // Return the same detail mock for now
    return HttpResponse.json(mockCrawlDetail);
  }),
];
