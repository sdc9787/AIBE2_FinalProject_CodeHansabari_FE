import { http, HttpResponse } from 'msw';
import {
  resumeDetailMock,
  resumeListMock,
  resumeMetadataMock,
  resumeCreateMock,
  resumeUpdateMock,
  resumeDeleteMock,
} from './mock';

const resumeDetail = resumeDetailMock; //이력서 상세 mock 데이터
const resumeList = resumeListMock; //이력서 리스트 mock 데이터
const resumeMetadata = resumeMetadataMock; //이력서 메타데이터 mock 데이터

export const resumeHandlers = [
  // 이력서 리스트 조회 핸들러
  http.get('/api/v1/resumes', () => {
    return HttpResponse.json(resumeList);
  }),

  // 이력서 상세 조회 핸들러
  http.get('/api/v1/resumes/:id', () => {
    return HttpResponse.json(resumeDetail);
  }),

  // 이력서 메타데이터 조회 핸들러
  http.get('/api/v1/resumes/metadata', () => {
    return HttpResponse.json(resumeMetadata);
  }),

  // 이력서 생성 핸들러
  http.post('/api/v1/resumes', () => {
    return HttpResponse.json(resumeCreateMock);
  }),

  // 이력서 수정 핸들러
  http.put('/api/v1/resumes/:id', () => {
    return HttpResponse.json(resumeUpdateMock);
  }),

  // 이력서 삭제 핸들러
  http.delete('/api/v1/resumes/:id', () => {
    return HttpResponse.json(resumeDeleteMock);
  }),
];
