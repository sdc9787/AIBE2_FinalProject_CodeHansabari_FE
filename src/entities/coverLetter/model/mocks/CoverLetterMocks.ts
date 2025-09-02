import { CoverLetterDetailResponse, CoverLetterListResponse } from '@/entities';

export const mockCoverLetterList: CoverLetterListResponse = {
  success: true,
  message: '자소서 목록 조회 성공',
  data: {
    content: [
      {
        coverLetterId: 1,
        title: '[AI첨삭] 네이버 백엔드 개발자 지원',
        content:
          '저는 백엔드 개발 분야에서 3년간의 실무 경험을 통해 확고한 기술적 역량을 구축해왔습니다...',
        jobField: '백엔드 개발자',
        experience: '3년',
        createdAt: '2025-09-01T10:30:00',
        updatedAt: '2025-09-01T10:35:00',
      },
      {
        coverLetterId: 2,
        title: '[원본] 카카오 프론트엔드 개발자 지원',
        content:
          '프론트엔드 개발에 대한 열정과 사용자 경험을 고려한 UI 구현을 통해 일관된 성능을 제공해왔습니다...',
        jobField: '프론트엔드 개발자',
        experience: '2년',
        createdAt: '2025-08-25T09:20:00',
        updatedAt: '2025-08-25T09:20:00',
      },
      {
        coverLetterId: 3,
        title: '[AI첨삭] 삼성 데이터 엔지니어 지원',
        content:
          '데이터 파이프라인 설계 및 최적화를 통해 안정적인 데이터 처리를 경험하였으며, 대용량 데이터 처리에 강점이 있습니다...',
        jobField: '데이터 엔지니어',
        experience: '4년',
        createdAt: '2025-08-30T14:00:00',
        updatedAt: '2025-08-30T14:00:00',
      },
      {
        coverLetterId: 4,
        title: '[원본] 스타트업 풀스택 개발자 지원',
        content:
          '프론트엔드와 백엔드를 아우르는 풀스택 능력을 바탕으로 빠르게 요구사항을 구현하고 배포해온 경험이 있습니다...',
        jobField: '풀스택 개발자',
        experience: '3년',
        createdAt: '2025-09-01T12:00:00',
        updatedAt: '2025-09-01T12:00:00',
      },
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 5,
    },
    totalElements: 15,
    totalPages: 3,
  },
};

export const mockCoverLetterDetail: CoverLetterDetailResponse = {
  success: true,
  message: '자소서 조회 성공',
  data: {
    coverLetterId: 1,
    title: '[원본] 네이버 백엔드 개발자 지원',
    content:
      '저는 소프트웨어 개발에 대한 열정을 바탕으로 다양한 프로젝트를 수행해왔습니다. 특히 백엔드 개발에 관심이 많아 Spring Boot와 JPA를 활용한 REST API 개발 경험이 있습니다. 대학교 재학 중 진행한 팀 프로젝트에서는 주도적으로 서버 아키텍처를 설계하고 구현했으며, 이를 통해 협업과 문제해결 능력을 기를 수 있었습니다.',
    jobField: '백엔드 개발자',
    experience: '1년',
    createdAt: '2025-09-01T10:30:00',
    updatedAt: '2025-09-01T10:30:00',
  },
};
