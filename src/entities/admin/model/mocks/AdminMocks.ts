import {
  AdminResumeListResponse,
  AdminCoverLetterListResponse,
  CrawlListResponse,
  CrawlDetailResponse,
  AdminMemberListResponse,
  AdminMemberDetailResponse,
  AdminMemberStatisticsResponse,
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

export const mockCrawlStartResponse = {
  success: true,
  message: '요청이 성공적으로 처리되었습니다.',
  data: {
    success: true,
    message: '자소서 크롤링이 완료되었습니다.',
    crawledCount: 150,
  },
  timestamp: '2024-01-15T14:30:00',
};

export const mockCrawlDeleteResponse = {
  success: true,
  message: '크롤링 데이터가 삭제되었습니다.',
  data: null,
  timestamp: '2024-01-15T14:30:00',
};

export const mockCrawlUpdateResponse = {
  success: true,
  message: '요청이 성공적으로 처리되었습니다.',
  data: {
    coverLetterId: 1,
    text: '저는 소프트웨어 개발 분야에서 지속적인 성장을 추구하는 개발자입니다...',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T14:30:00',
  },
  timestamp: '2024-01-15T14:30:00',
};

export const mockAdminResumePatchResponse = {
  success: true,
  message: '이력서가 복구되었습니다.',
  data: null,
  timestamp: '2024-01-15T14:30:00',
};

export const mockAdminCoverLetterPatchResponse = {
  success: true,
  message: '자기소개서가 복구되었습니다.',
  data: null,
  timestamp: '2024-01-15T14:30:00',
};

// 회원 관리 Mock 데이터
export const mockAdminMemberList: AdminMemberListResponse = {
  success: true,
  message: '회원 목록 조회 성공',
  data: {
    content: [
      {
        memberId: 1,
        email: 'user@example.com',
        name: '홍길동',
        picture: 'https://example.com/profile.jpg',
        role: 'USER',
        status: 'ACTIVE',
        lastLoginAt: '2025-09-08T10:30:00',
        createdAt: '2025-09-01T09:00:00',
        updatedAt: '2025-09-08T10:30:00',
      },
      {
        memberId: 2,
        email: 'admin@example.com',
        name: '관리자',
        picture: 'https://example.com/admin.jpg',
        role: 'ADMIN',
        status: 'ACTIVE',
        lastLoginAt: '2025-09-08T11:15:00',
        createdAt: '2025-08-15T14:20:00',
        updatedAt: '2025-09-08T11:15:00',
      },
      {
        memberId: 3,
        email: 'test@example.com',
        name: '테스트유저',
        picture: 'https://example.com/test.jpg',
        role: 'USER',
        status: 'INACTIVE',
        lastLoginAt: '2025-08-20T09:30:00',
        createdAt: '2025-08-01T10:00:00',
        updatedAt: '2025-08-20T09:30:00',
      },
      {
        memberId: 4,
        email: 'suspended@example.com',
        name: '정지유저',
        picture: 'https://example.com/suspended.jpg',
        role: 'USER',
        status: 'SUSPENDED',
        lastLoginAt: '2025-07-15T14:20:00',
        createdAt: '2025-07-01T11:30:00',
        updatedAt: '2025-07-15T14:20:00',
      },
      {
        memberId: 5,
        email: 'root@example.com',
        name: '최고관리자',
        picture: 'https://example.com/root.jpg',
        role: 'ROOT',
        status: 'ACTIVE',
        lastLoginAt: '2025-09-08T12:00:00',
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-09-08T12:00:00',
      },
    ],
    totalElements: 150,
    totalPages: 15,
    size: 10,
    number: 0,
    first: true,
    last: false,
  },
  timestamp: '2024-01-15T14:30:00',
};

export const mockAdminMemberDetail: AdminMemberDetailResponse = {
  success: true,
  message: '회원 상세 조회 성공',
  data: {
    memberId: 1,
    googleId: 'google_123456789',
    email: 'user@example.com',
    name: '홍길동',
    picture: 'https://lh3.googleusercontent.com/...',
    role: 'USER',
    status: 'ACTIVE',
    lastLoginAt: '2025-09-08T10:30:00',
    createdAt: '2025-09-01T09:00:00',
    updatedAt: '2025-09-08T10:30:00',
    coverLetterCount: 5,
    resumeCount: 2,
  },
  timestamp: '2024-01-15T14:30:00',
};

export const mockAdminMemberStatistics: AdminMemberStatisticsResponse = {
  success: true,
  message: '회원 통계 조회 성공',
  data: {
    totalMembers: 1250,
    activeMembers: 1180,
    inactiveMembers: 65,
    suspendedMembers: 5,
    userRoleCount: 1200,
    adminRoleCount: 48,
    rootRoleCount: 2,
    todayNewMembers: 12,
    monthlyNewMembers: 89,
  },
  timestamp: '2024-01-15T14:30:00',
};
