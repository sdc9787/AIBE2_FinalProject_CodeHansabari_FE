import {
  AdminResumeListResponse,
  AdminCoverLetterListResponse,
  CrawlListResponse,
  CrawlDetailResponse,
} from '../type';

export const mockAdminResumeList: AdminResumeListResponse = {
  success: true,
  message: '관리자 이력서 목록 조회 성공',
  data: {
    content: [
      {
        resumeId: 1,
        authorEmail: 'user1@example.com',
        title: '네이버 백엔드 지원 이력서',
        status: 'ACTIVE',
        createdAt: '2025-09-01T10:00:00',
        updatedAt: '2025-09-01T10:00:00',
      },
      {
        resumeId: 2,
        authorEmail: 'user2@example.com',
        title: '카카오 프론트엔드 지원 이력서',
        status: 'DELETED',
        createdAt: '2025-08-20T09:15:00',
        updatedAt: '2025-08-25T13:00:00',
        deletedAt: '2025-09-10T00:00:00',
      },
      {
        resumeId: 3,
        authorEmail: 'user3@example.com',
        title: '토스 데이터 엔지니어 이력서',
        status: 'ACTIVE',
        createdAt: '2025-07-11T11:05:00',
        updatedAt: '2025-07-11T11:05:00',
      },
    ],
    totalPages: 1,
    totalElements: 3,
    size: 10,
    number: 0,
  },
  timestamp: new Date().toISOString(),
};

export const mockAdminCoverLetterList: AdminCoverLetterListResponse = {
  success: true,
  message: '관리자 자기소개서 목록 조회 성공',
  data: {
    content: [
      {
        coverLetterId: 1,
        authorEmail: 'user1@example.com',
        title: 'AI첨삭 네이버 지원서',
        status: 'ACTIVE',
        createdAt: '2025-09-01T10:00:00',
        updatedAt: '2025-09-01T10:00:00',
      },
      {
        coverLetterId: 2,
        authorEmail: 'user2@example.com',
        title: '원본 카카오 지원서',
        status: 'DELETED',
        createdAt: '2025-08-02T14:30:00',
        updatedAt: '2025-08-02T14:30:00',
        deletedAt: '2025-09-05T12:00:00',
      },
      {
        coverLetterId: 3,
        authorEmail: 'user3@example.com',
        title: '삼성 데이터 엔지니어 지원서',
        status: 'ACTIVE',
        createdAt: '2025-07-30T09:00:00',
        updatedAt: '2025-07-30T09:00:00',
      },
    ],
    totalElements: 3,
    totalPages: 1,
  },
  timestamp: new Date().toISOString(),
};

// crawl mocks
export const mockCrawlList: CrawlListResponse = {
  success: true,
  message: '크롤링된 자기소개서 목록 조회 성공',
  data: [
    {
      coverLetterId: 101,
      text: '크롤링된 자기소개서 예시 텍스트 1 - 회사 지원 동기 및 경험 설명',
      createdAt: '2025-09-10T08:00:00',
      updatedAt: '2025-09-10T08:00:00',
    },
    {
      coverLetterId: 102,
      text: '크롤링된 자기소개서 예시 텍스트 2 - 프로젝트 경험과 기술 스택 요약',
      createdAt: '2025-09-09T12:30:00',
      updatedAt: '2025-09-09T12:30:00',
    },
    {
      coverLetterId: 103,
      text: '크롤링된 자기소개서 예시 텍스트 3 - 문제 해결 사례 중심',
      createdAt: '2025-09-08T15:45:00',
      updatedAt: '2025-09-08T15:45:00',
    },
  ],
  timestamp: Date.now(),
};

export const mockCrawlDetail: CrawlDetailResponse = {
  success: true,
  message: '크롤링된 자기소개서 상세 조회 성공',
  data: {
    coverLetterId: 101,
    text: '크롤링된 자기소개서 예시 텍스트 1 - 상세 내용: 저는 해당 직무에서 OO을 수행하며 ...',
    createdAt: '2025-09-10T08:00:00',
    updatedAt: '2025-09-10T08:00:00',
  },
  timestamp: Date.now(),
};
