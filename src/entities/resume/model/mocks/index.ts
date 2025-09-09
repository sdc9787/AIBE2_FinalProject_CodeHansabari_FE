import type { Resume, AISuggestResponse } from '../type';

export const mockResumes: Resume[] = [
  {
    id: 1,
    title: '프론트엔드 개발자 이력서',
    memberInfo: {
      name: '김개발',
      email: 'kim.dev@example.com',
      phoneNumber: '010-1234-5678',
      blogUrl: 'https://kim-dev.blog.com',
    },
    sections: [
      {
        sectionType: 'experience',
        sectionTitle: '경력',
        items: [
          {
            title: '프론트엔드 개발자',
            subTitle: '(주)테크스타트업',
            startDate: '2022-03',
            endDate: '현재',
            description:
              'React, TypeScript를 활용한 웹 애플리케이션 개발\n- 사용자 인터페이스 설계 및 구현\n- 반응형 웹 디자인 적용\n- REST API 연동 및 상태 관리',
          },
          {
            title: '주니어 개발자',
            subTitle: '(주)소프트웨어컴퍼니',
            startDate: '2020-06',
            endDate: '2022-02',
            description:
              'JavaScript, HTML, CSS를 활용한 웹 개발\n- 기존 시스템 유지보수\n- 신규 기능 개발 참여\n- 코드 리뷰 및 테스트',
          },
        ],
      },
      {
        sectionType: 'education',
        sectionTitle: '학력',
        items: [
          {
            title: '컴퓨터공학과',
            subTitle: '한국대학교',
            startDate: '2016-03',
            endDate: '2020-02',
            description:
              '학사 졸업 (GPA: 3.8/4.5)\n- 프로그래밍, 자료구조, 알고리즘 전공\n- 컴퓨터 네트워크, 데이터베이스 수강',
          },
        ],
      },
      {
        sectionType: 'projects',
        sectionTitle: '프로젝트',
        items: [
          {
            title: 'E-커머스 플랫폼 개발',
            subTitle: '팀 프로젝트',
            startDate: '2023-01',
            endDate: '2023-06',
            description:
              'React, Node.js를 활용한 온라인 쇼핑몰 구축\n- 상품 관리 시스템 개발\n- 결제 시스템 연동\n- 사용자 인증 및 권한 관리',
          },
          {
            title: '개인 포트폴리오 웹사이트',
            subTitle: '개인 프로젝트',
            startDate: '2022-09',
            endDate: '2022-12',
            description:
              'Next.js, TailwindCSS를 활용한 포트폴리오 사이트\n- 반응형 디자인 구현\n- SEO 최적화\n- GitHub Pages 배포',
          },
        ],
      },
      {
        sectionType: 'skills',
        sectionTitle: '기술 스택',
        items: [
          {
            title: 'Frontend',
            subTitle: '',
            startDate: '',
            endDate: '',
            description:
              'React, TypeScript, Next.js, TailwindCSS, HTML5, CSS3, JavaScript ES6+',
          },
          {
            title: 'Backend',
            subTitle: '',
            startDate: '',
            endDate: '',
            description: 'Node.js, Express.js, MongoDB, MySQL, REST API',
          },
          {
            title: 'Tools',
            subTitle: '',
            startDate: '',
            endDate: '',
            description: 'Git, GitHub, VS Code, Figma, Postman, Docker',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 2,
    title: '백엔드 개발자 이력서',
    memberInfo: {
      name: '이서버',
      email: 'lee.server@example.com',
      phoneNumber: '010-9876-5432',
    },
    sections: [
      {
        sectionType: 'experience',
        sectionTitle: '경력',
        items: [
          {
            title: '시니어 백엔드 개발자',
            subTitle: '(주)클라우드테크',
            startDate: '2021-09',
            endDate: '현재',
            description:
              'Spring Boot, Java를 활용한 서버 개발\n- 마이크로서비스 아키텍처 설계\n- AWS 클라우드 인프라 구축\n- 데이터베이스 최적화',
          },
        ],
      },
      {
        sectionType: 'education',
        sectionTitle: '학력',
        items: [
          {
            title: '정보통신공학과',
            subTitle: '서울과학기술대학교',
            startDate: '2015-03',
            endDate: '2019-02',
            description:
              '학사 졸업 (GPA: 4.0/4.5)\n- 네트워크 프로그래밍, 시스템 프로그래밍 전공',
          },
        ],
      },
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 3,
    title: 'UI/UX 디자이너 이력서',
    memberInfo: {
      name: '박디자인',
      email: 'park.design@example.com',
      phoneNumber: '010-5555-7777',
      blogUrl: 'https://park-design.portfolio.com',
    },
    sections: [
      {
        sectionType: 'experience',
        sectionTitle: '경력',
        items: [
          {
            title: 'UI/UX 디자이너',
            subTitle: '(주)디자인스튜디오',
            startDate: '2020-01',
            endDate: '현재',
            description:
              'Figma, Sketch를 활용한 UI/UX 디자인\n- 사용자 경험 리서치\n- 와이어프레임 및 프로토타입 제작\n- 디자인 시스템 구축',
          },
        ],
      },
      {
        sectionType: 'education',
        sectionTitle: '학력',
        items: [
          {
            title: '시각디자인학과',
            subTitle: '홍익대학교',
            startDate: '2014-03',
            endDate: '2018-02',
            description: '학사 졸업\n- 그래픽 디자인, 인터랙션 디자인 전공',
          },
        ],
      },
      {
        sectionType: 'skills',
        sectionTitle: '디자인 툴',
        items: [
          {
            title: 'Design Tools',
            subTitle: '',
            startDate: '',
            endDate: '',
            description: 'Figma, Sketch, Adobe XD, Photoshop, Illustrator',
          },
          {
            title: 'Prototyping',
            subTitle: '',
            startDate: '',
            endDate: '',
            description: 'Framer, Principle, InVision, Zeplin',
          },
        ],
      },
    ],
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
  },
];

export const mockAISuggestResponse: AISuggestResponse = {
  suggestedSections: [
    {
      sectionType: 'experience',
      sectionTitle: '경력 (AI 첨삭 제안)',
      items: [
        {
          title: '시니어 프론트엔드 개발자',
          subTitle: '(주)테크스타트업',
          startDate: '2022-03',
          endDate: '현재',
          description:
            '• React 및 TypeScript 기반 대규모 웹 애플리케이션 아키텍처 설계 및 개발\n• 컴포넌트 재사용성 향상을 위한 디자인 시스템 구축 (개발 효율성 40% 향상)\n• 사용자 경험 최적화를 통한 페이지 로딩 속도 개선 (평균 2초 단축)\n• 크로스 브라우저 호환성을 고려한 반응형 웹 애플리케이션 개발\n• RESTful API 설계 및 상태 관리 라이브러리(Redux, Zustand) 활용한 데이터 플로우 최적화',
        },
        {
          title: '프론트엔드 개발자',
          subTitle: '(주)소프트웨어컴퍼니',
          startDate: '2020-06',
          endDate: '2022-02',
          description:
            '• ES6+ 문법과 모던 JavaScript 프레임워크를 활용한 인터랙티브 웹 서비스 개발\n• Git 기반 협업 워크플로우 구축 및 코드 리뷰 문화 정착\n• 웹 접근성(WCAG 2.1) 가이드라인 준수한 사용자 친화적 인터페이스 구현\n• Jest, Cypress를 활용한 단위 테스트 및 E2E 테스트 코드 작성\n• 레거시 시스템의 점진적 모던화 작업 주도 (성능 지표 30% 개선)',
        },
      ],
    },
    {
      sectionType: 'projects',
      sectionTitle: '프로젝트 (AI 첨삭 제안)',
      items: [
        {
          title: 'E-커머스 플랫폼 풀스택 개발',
          subTitle: '팀 리더 (5인 팀)',
          startDate: '2023-01',
          endDate: '2023-06',
          description:
            '• 기술 스택: React, TypeScript, Node.js, MongoDB, AWS\n• MSA 아키텍처 기반 확장 가능한 전자상거래 플랫폼 개발\n• 실시간 재고 관리 시스템 구축 (동시 접속자 1000명 처리 가능)\n• Stripe API 연동을 통한 안전한 결제 시스템 구현\n• JWT 기반 사용자 인증 및 권한 관리 시스템 개발\n• Docker 컨테이너화 및 CI/CD 파이프라인 구축으로 배포 자동화',
        },
        {
          title: '개발자 포트폴리오 플랫폼',
          subTitle: '개인 프로젝트 (오픈소스)',
          startDate: '2022-09',
          endDate: '2022-12',
          description:
            '• 기술 스택: Next.js 13, TailwindCSS, Framer Motion, Vercel\n• SSG 및 ISR을 활용한 SEO 최적화 포트폴리오 사이트 개발\n• Lighthouse 성능 점수 95점 이상 달성\n• 다크모드 및 반응형 디자인 구현\n• GitHub API 연동을 통한 실시간 프로젝트 정보 동기화\n• Google Analytics 연동으로 사용자 행동 분석 (월 방문자 500명 이상)',
        },
      ],
    },
    {
      sectionType: 'skills',
      sectionTitle: '핵심 역량 (AI 첨삭 제안)',
      items: [
        {
          title: 'Frontend Development',
          subTitle: '전문 분야',
          startDate: '',
          endDate: '',
          description:
            '• 언어: TypeScript, JavaScript (ES6+), HTML5, CSS3\n• 프레임워크: React (3년), Next.js (2년), Vue.js (1년)\n• 상태관리: Redux Toolkit, Zustand, React Query\n• 스타일링: TailwindCSS, Styled-components, SCSS\n• 테스팅: Jest, React Testing Library, Cypress',
        },
        {
          title: 'Backend & DevOps',
          subTitle: '보조 기술',
          startDate: '',
          endDate: '',
          description:
            '• 런타임: Node.js, Express.js\n• 데이터베이스: MongoDB, MySQL, PostgreSQL\n• 클라우드: AWS (EC2, S3, CloudFront), Vercel\n• 도구: Docker, GitHub Actions, Webpack, Vite',
        },
        {
          title: 'Collaboration & Tools',
          subTitle: '협업 도구',
          startDate: '',
          endDate: '',
          description:
            '• 버전관리: Git, GitHub (Pull Request 기반 협업)\n• 디자인: Figma (디자이너와의 협업 경험)\n• 프로젝트 관리: Jira, Notion, Slack\n• API 도구: Postman, Insomnia',
        },
      ],
    },
  ],
};

// 개별 이력서 조회용 mock 함수
export const getMockResumeById = (id: number): Resume | undefined => {
  return mockResumes.find((resume) => resume.id === id);
};

// 새 이력서 생성 시뮬레이션
export const createMockResume = (title: string): Resume => {
  const newId = Math.max(...mockResumes.map((r) => r.id)) + 1;
  return {
    id: newId,
    title,
    memberInfo: {
      name: '',
      email: '',
    },
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
