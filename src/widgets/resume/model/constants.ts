// IT 직종 목록 (coverLetter와 동일)
export const IT_JOB_FIELDS = [
  '프론트엔드 개발자',
  '백엔드 개발자',
  '풀스택 개발자',
  '모바일 앱 개발자',
  '게임 개발자',
  '데이터 사이언티스트',
  '데이터 엔지니어',
  '머신러닝 엔지니어',
  'AI 엔지니어',
  'DevOps 엔지니어',
  '시스템 엔지니어',
  '네트워크 엔지니어',
  '보안 엔지니어',
  '클라우드 엔지니어',
  'QA 엔지니어',
  'UI/UX 디자이너',
  '프로덕트 매니저',
  '프로젝트 매니저',
  'IT 컨설턴트',
  '기술 영업',
  '기타',
];

// 기술스택 전체 목록 (단일 배열)
export const ALL_TECH_STACKS = [
  // 언어
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  // 프론트엔드
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'Nuxt.js',
  'Svelte',
  'HTML',
  'CSS',
  'Sass',
  'Tailwind CSS',
  // 백엔드
  'Node.js',
  'Express.js',
  'Spring Boot',
  'Django',
  'Flask',
  'FastAPI',
  'NestJS',
  'Laravel',
  'Ruby on Rails',
  // 데이터베이스
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'Oracle',
  'MariaDB',
  'DynamoDB',
  // 클라우드
  'AWS',
  'Azure',
  'Google Cloud',
  'Firebase',
  'Vercel',
  'Netlify',
  'Heroku',
  // 도구
  'Git',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitHub Actions',
  'Webpack',
  'Vite',
  'ESLint',
  'Prettier',
];

// 기본 항목 편집 리스트
export const DEFAULT_RESUME_ITEMS = [
  { name: '기본정보', required: true, state: true },
  { name: '학력', required: true, state: true },
  { name: '개발직무', required: true, state: true },
  { name: '기술스택', required: true, state: true },
  { name: '간단소개', required: false, state: false },
  { name: '링크', required: false, state: false },
  { name: '경력', required: false, state: false },
  { name: '프로젝트', required: false, state: false },
  { name: '교육이력', required: false, state: false },
  { name: '자격증', required: false, state: false },
  { name: '수상내역', required: false, state: false },
  { name: '기타사항', required: false, state: false },
];

// 서버 스펙에 맞춘 기본 이력서 데이터
export const DEFAULT_RESUME_DATA = {
  title: '',
  memberInfo: {
    name: '',
    age: '',
    careerType: '',
    email: '',
    phoneNumber: '',
    blogUrl: '',
    githubUrl: '',
    notionUrl: '',
    introduction: '',
    techStack: [],
    customLinks: [],
  },
  sections: [
    {
      sectionType: 'EDUCATION',
      sectionTitle: '학력',
      items: [],
    },
    {
      sectionType: 'WORK_EXPERIENCE',
      sectionTitle: '경력',
      items: [
        {
          title: '',
          subTitle: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    },
    {
      sectionType: 'PROJECTS',
      sectionTitle: '프로젝트',
      items: [
        {
          title: '',
          subTitle: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    },
    {
      sectionType: 'CERTIFICATES',
      sectionTitle: '자격증',
      items: [],
    },
    {
      sectionType: 'AWARDS',
      sectionTitle: '수상',
      items: [],
    },
  ],
};
