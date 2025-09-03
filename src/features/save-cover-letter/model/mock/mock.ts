// 자소서 저장 요청 타입
export interface SaveCoverLetterRequest {
  title: string;
  content: string;
  jobField: string;
  experienceYears: number;
  isAiImproved: boolean;
}

// 자소서 저장 응답 타입
export interface SaveCoverLetterResponse {
  success: boolean;
  message: string;
  data: null;
}

// 테스트용 모킹 데이터
export const mockSaveCoverLetterRequest: SaveCoverLetterRequest = {
  title: '네이버 백엔드 개발자 지원',
  content:
    '저는 소프트웨어 개발에 대한 열정을 바탕으로 다양한 프로젝트를 수행해왔습니다. 특히 백엔드 개발에 관심이 많아 Spring Boot와 JPA를 활용한 REST API 개발 경험이 있습니다.',
  jobField: '백엔드 개발자',
  experienceYears: 1,
  isAiImproved: false,
};

export const mockSaveCoverLetterSuccessResponse: SaveCoverLetterResponse = {
  success: true,
  message: '원본 자소서가 저장되었습니다.',
  data: null,
};

export const mockSaveCoverLetterErrorResponse: SaveCoverLetterResponse = {
  success: false,
  message: '자소서 저장 중 오류가 발생했습니다.',
  data: null,
};
