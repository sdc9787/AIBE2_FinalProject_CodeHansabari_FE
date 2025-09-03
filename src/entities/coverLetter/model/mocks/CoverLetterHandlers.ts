import { http, HttpResponse } from 'msw';
import { mockCoverLetterDetail, mockCoverLetterList } from './CoverLetterMocks';

export const coverLetterHandlers = [
  http.get('/api/v1/cover-letters', () => {
    return HttpResponse.json(mockCoverLetterList);
  }),

  // optional: detail handler
  http.get('/api/v1/cover-letters/:id', () => {
    // In a simple default handler, always return the mock detail
    return HttpResponse.json(mockCoverLetterDetail);
  }),
];
