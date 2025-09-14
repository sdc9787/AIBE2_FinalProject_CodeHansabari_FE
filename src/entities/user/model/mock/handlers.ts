import { http, HttpResponse } from 'msw';
import { usageTokenMock, userInfoMock } from './mock';

const userInfo = userInfoMock; // 사용자 정보 mock 데이터
const usageToken = usageTokenMock; // 토큰 사용량 mock 데이터

export const userHandlers = [
  http.get('/auth/me', () => {
    return HttpResponse.json(userInfo);
  }),
  http.get('/api/v1/usage/tokens', () => {
    return HttpResponse.json(usageToken);
  }),
];
