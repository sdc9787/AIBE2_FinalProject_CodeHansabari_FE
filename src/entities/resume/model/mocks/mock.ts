import { ResponseResumeDetail, ResponseResumeList } from '../type';

// 이력서 상세 조회 mock 데이터
export const resumeDetailMock: ResponseResumeDetail = {
  success: true,
  message: '이력서를 성공적으로 조회했습니다.',
  data: {
    resumeId: 1,
    title: '카카오 백엔드 개발자 지원용 이력서',
    type: 'MODERN',
    name: '김신입',
    email: 'kim.newbie@example.com',
    birthYear: 1998,
    phone: '010-1234-5678',
    careerType: 'FRESHMAN',
    fieldName: '백엔드 개발자',
    introduction:
      '사용자 중심의 서비스를 만들고 싶은 열정적인 신입 개발자입니다. 대학교에서 컴퓨터공학을 전공하며 웹 개발에 관심을 가지게 되었고, 다양한 프로젝트를 통해 실무 경험을 쌓아왔습니다.',
    githubUrl: 'https://github.com/kimnewbie',
    blogUrl: 'https://kimnewbie.tistory.com',
    notionUrl: 'https://notion.so/kimnewbie/portfolio',

    educations: [
      {
        schoolName: '서울대학교',
        major: '컴퓨터공학과',
        degreeLevel: 'BACHELOR',
        personalGpa: 3.8,
        totalGpa: 4.5,
        graduationDate: '2024-02-15',
      },
      {
        schoolName: '서울고등학교',
        major: '이과',
        degreeLevel: 'HIGH_SCHOOL',
        personalGpa: null,
        totalGpa: null,
        graduationDate: '2017-02-10',
      },
    ],

    techStacks: [
      { techStackId: 1, proficiencyLevel: 'INTERMEDIATE' },
      { techStackId: 2, proficiencyLevel: 'INTERMEDIATE' },
      { techStackId: 3, proficiencyLevel: 'BEGINNER' },
      { techStackId: 4, proficiencyLevel: 'ADVANCED' },
    ],

    customLinks: [
      { name: '포트폴리오', url: 'https://kimnewbie-portfolio.vercel.app' },
      { name: 'LinkedIn', url: 'https://linkedin.com/in/kimnewbie' },
    ],

    careers: [
      {
        startDate: '2023-07-01',
        endDate: '2023-08-31',
        companyName: '스타트업 ABC',
        companyDescription:
          '핀테크 스타트업으로 개인 금융 관리 서비스를 제공하는 회사',
        departmentPosition: '개발팀/인턴 개발자',
        mainTasks:
          '사용자 인증 API 개발, 데이터베이스 설계 및 최적화, 단위 테스트 작성',
        techStacks: [{ techStackId: 1 }, { techStackId: 2 }],
      },
    ],

    projects: [
      {
        startDate: '2023-09-01',
        endDate: '2023-12-15',
        name: '온라인 서점 프로젝트',
        description: '사용자가 도서를 검색하고 구매할 수 있는 웹 서비스',
        detailedDescription:
          'Spring Boot를 사용한 백엔드 API 서버와 React를 활용한 프론트엔드로 구성된 풀스택 프로젝트입니다. 사용자 인증, 도서 검색, 장바구니, 결제 기능을 구현했으며, AWS EC2에 배포하여 서비스를 운영했습니다. 성능 최적화를 위해 Redis 캐싱을 도입하여 응답 속도를 30% 개선했습니다.',
        repositoryUrl: 'https://github.com/kimnewbie/online-bookstore',
        deployUrl: 'https://bookstore.kimnewbie.com',
        projectType: 'PERSONAL',
        techStacks: [
          { techStackId: 1, usageType: '백엔드 프레임워크' },
          { techStackId: 2, usageType: '데이터베이스' },
          { techStackId: 5, usageType: '프론트엔드' },
        ],
      },
      {
        startDate: '2023-03-01',
        endDate: '2023-06-30',
        name: '대학교 수강신청 시스템',
        description: '대학교 수강신청을 위한 웹 애플리케이션 (팀 프로젝트)',
        detailedDescription:
          '4명의 팀원과 함께 진행한 대학교 수강신청 시스템입니다. 저는 백엔드 개발을 담당하여 학생 인증, 수강신청, 시간표 관리 API를 개발했습니다. 동시 접속자 처리를 위해 Redis를 활용한 분산 락을 구현했습니다.',
        repositoryUrl: 'https://github.com/team-project/course-registration',
        deployUrl: null,
        projectType: 'TEAM',
        techStacks: [
          { techStackId: 1, usageType: '백엔드' },
          { techStackId: 2, usageType: '데이터베이스' },
        ],
      },
    ],

    trainings: [
      {
        startDate: '2023-01-15',
        endDate: '2023-03-15',
        courseName: 'Spring Boot 실무 개발 과정',
        institutionName: '패스트캠퍼스',
        detailedContent:
          'Spring Boot, Spring Data JPA, Spring Security를 활용한 실무 프로젝트 개발 과정을 수료했습니다. RESTful API 설계, 데이터베이스 연동, 보안 구현 등을 학습했습니다.',
        techStacks: [{ techStackId: 1 }, { techStackId: 2 }],
      },
      {
        startDate: '2022-07-01',
        endDate: '2022-08-31',
        courseName: 'AWS 클라우드 기초 과정',
        institutionName: 'AWS 교육센터',
        detailedContent:
          'AWS EC2, S3, RDS 등 클라우드 서비스 기초를 학습하고 실습을 통해 웹 애플리케이션을 배포하는 방법을 익혔습니다.',
        techStacks: [{ techStackId: 6 }],
      },
    ],

    additionalInfos: [
      {
        startDate: '2023-11-15',
        endDate: '2023-11-15',
        category: 'AWARD',
        activityName: '2023 대학생 해커톤 대상',
        relatedOrganization: '한국정보화진흥원',
        detailedContent:
          'AI를 활용한 개인 금융 관리 서비스로 대상을 수상했습니다. 팀 리더로서 프로젝트를 주도하며 백엔드 개발을 담당했습니다.',
        certificateNumber: null,
        languageLevel: null,
      },
      {
        startDate: '2023-08-20',
        endDate: '2023-08-20',
        category: 'CERTIFICATE',
        activityName: '정보처리기사',
        relatedOrganization: '한국산업인력공단',
        detailedContent:
          '소프트웨어 개발 전반에 대한 이론과 실무 지식을 검증받았습니다.',
        certificateNumber: '23202000123',
        languageLevel: null,
      },
      {
        startDate: '2023-06-10',
        endDate: '2023-06-10',
        category: 'LANGUAGE',
        activityName: 'TOEIC',
        relatedOrganization: 'ETS',
        detailedContent: '영어 실력 향상을 위해 꾸준히 학습한 결과입니다.',
        certificateNumber: null,
        languageLevel: '900점',
      },
      {
        startDate: '2022-03-01',
        endDate: '2022-12-31',
        category: 'ACTIVITY',
        activityName: '대학교 컴퓨터 동아리 활동',
        relatedOrganization: '서울대학교 CODE 동아리',
        detailedContent:
          '동아리 부회장으로 활동하며 신입생 교육 프로그램을 기획하고 운영했습니다. 알고리즘 스터디와 프로젝트 멘토링을 진행했습니다.',
        certificateNumber: null,
        languageLevel: null,
      },
    ],
  },
};

// 이력서 목록 조회 mock 데이터
export const resumeListMock: ResponseResumeList = {
  success: true,
  message: '이력서 목록을 성공적으로 조회했습니다.',
  data: {
    content: [
      {
        resumeId: 1,
        title: '네이버 백엔드 개발자 지원용 이력서',
        updatedAt: '2024-03-15 10:30:25',
        completedSections: ['educations', 'techStacks', 'careers', 'projects'],
      },
    ],
    totalPages: 1,
    totalElements: 1,
    size: 10,
    number: 0,
  },
};

// 이력서 저장 mock 데이터
export const resumeCreateMock = {
  success: true,
  message: '이력서를 성공적으로 저장했습니다.',
  data: null,
};

// 이력서 수정 mock 데이터
export const resumeUpdateMock = {
  success: true,
  message: '이력서를 성공적으로 수정했습니다.',
  data: null,
};

// 이력서 삭제 mock 데이터
export const resumeDeleteMock = {
  success: true,
  message: '이력서를 성공적으로 삭제했습니다.',
  data: null,
};

// 이력서 메타데이터 조회 mock 데이터
export const resumeMetadataMock = {
  success: true,
  message: '이력서 메타데이터를 성공적으로 조회했습니다.',
  data: {
    techStacks: [
      {
        id: 318,
        name: '4D',
        category: 'Other',
      },
      {
        id: 297,
        name: '8x8',
        category: 'Other',
      },
      {
        id: 232,
        name: 'AR',
        category: 'Hardware/System',
      },
      {
        id: 224,
        name: 'ARM',
        category: 'Hardware/System',
      },
      {
        id: 29,
        name: 'AWK',
        category: 'Language',
      },
      {
        id: 104,
        name: 'AWS',
        category: 'DevOps',
      },
      {
        id: 171,
        name: 'Adobe XD',
        category: 'Design/UI',
      },
      {
        id: 313,
        name: 'Afi',
        category: 'Other',
      },
      {
        id: 194,
        name: 'BI',
        category: 'Data/Analytics',
      },
      {
        id: 156,
        name: 'Babel',
        category: 'Build/Package',
      },
      {
        id: 163,
        name: 'Bit',
        category: 'Build/Package',
      },
      {
        id: 153,
        name: 'Bower',
        category: 'Build/Package',
      },
      {
        id: 254,
        name: 'Box',
        category: 'Enterprise/Business',
      },
      {
        id: 162,
        name: 'Buck',
        category: 'Build/Package',
      },
      {
        id: 5,
        name: 'C',
        category: 'Language',
      },
      {
        id: 7,
        name: 'C#',
        category: 'Language',
      },
      {
        id: 6,
        name: 'C++',
        category: 'Language',
      },
      {
        id: 34,
        name: 'CSS3',
        category: 'Frontend',
      },
      {
        id: 225,
        name: 'CUDA',
        category: 'Hardware/System',
      },
      {
        id: 30,
        name: 'CUE',
        category: 'Language',
      },
      {
        id: 72,
        name: 'CakePHP',
        category: 'Backend',
      },
      {
        id: 90,
        name: 'Cassandra',
        category: 'Database',
      },
      {
        id: 137,
        name: 'Chai',
        category: 'Testing',
      },
      {
        id: 115,
        name: 'Chef',
        category: 'DevOps',
      },
      {
        id: 102,
        name: 'CircleCI',
        category: 'DevOps',
      },
      {
        id: 15,
        name: 'Clojure',
        category: 'Language',
      },
      {
        id: 324,
        name: 'CloudFlare',
        category: 'Other',
      },
      {
        id: 131,
        name: 'Cocos2d',
        category: 'Mobile',
      },
      {
        id: 261,
        name: 'Cocos2d',
        category: 'Game/Media',
      },
      {
        id: 325,
        name: 'CoffeeScript',
        category: 'Other',
      },
      {
        id: 248,
        name: 'Confluence',
        category: 'Enterprise/Business',
      },
      {
        id: 129,
        name: 'Cordova',
        category: 'Mobile',
      },
      {
        id: 97,
        name: 'CoreData',
        category: 'Database',
      },
      {
        id: 91,
        name: 'CouchDB',
        category: 'Database',
      },
      {
        id: 92,
        name: 'Couchbase',
        category: 'Database',
      },
      {
        id: 20,
        name: 'Crystal',
        category: 'Language',
      },
      {
        id: 144,
        name: 'Cucumber',
        category: 'Testing',
      },
      {
        id: 138,
        name: 'Cypress',
        category: 'Testing',
      },
      {
        id: 317,
        name: 'DB',
        category: 'Other',
      },
      {
        id: 215,
        name: 'DDD',
        category: 'Architecture/Pattern',
      },
      {
        id: 269,
        name: 'DID',
        category: 'Blockchain/Crypto',
      },
      {
        id: 193,
        name: 'DVC',
        category: 'Data/Analytics',
      },
      {
        id: 179,
        name: 'DaVinci',
        category: 'Design/UI',
      },
      {
        id: 265,
        name: 'DaVinci',
        category: 'Game/Media',
      },
      {
        id: 21,
        name: 'Dart',
        category: 'Language',
      },
      {
        id: 65,
        name: 'Django',
        category: 'Backend',
      },
      {
        id: 315,
        name: 'Dm',
        category: 'Other',
      },
      {
        id: 99,
        name: 'Docker',
        category: 'DevOps',
      },
      {
        id: 278,
        name: 'Dojo',
        category: 'Other',
      },
      {
        id: 167,
        name: 'Dotenv',
        category: 'Build/Package',
      },
      {
        id: 255,
        name: 'Dropbox',
        category: 'Enterprise/Business',
      },
      {
        id: 75,
        name: 'Drupal',
        category: 'Backend',
      },
      {
        id: 316,
        name: 'Dw',
        category: 'Other',
      },
      {
        id: 216,
        name: 'EDA',
        category: 'Architecture/Pattern',
      },
      {
        id: 185,
        name: 'ELK',
        category: 'Data/Analytics',
      },
      {
        id: 245,
        name: 'ERP',
        category: 'Enterprise/Business',
      },
      {
        id: 164,
        name: 'ESLint',
        category: 'Build/Package',
      },
      {
        id: 192,
        name: 'ETL',
        category: 'Data/Analytics',
      },
      {
        id: 174,
        name: 'Eclipse',
        category: 'Design/UI',
      },
      {
        id: 326,
        name: 'Electron',
        category: 'Other',
      },
      {
        id: 16,
        name: 'Elixir',
        category: 'Language',
      },
      {
        id: 31,
        name: 'Elm',
        category: 'Language',
      },
      {
        id: 41,
        name: 'Ember.js',
        category: 'Frontend',
      },
      {
        id: 82,
        name: 'Entity Framework',
        category: 'Backend',
      },
      {
        id: 267,
        name: 'Eos',
        category: 'Blockchain/Crypto',
      },
      {
        id: 17,
        name: 'Erlang',
        category: 'Language',
      },
      {
        id: 59,
        name: 'Express.js',
        category: 'Backend',
      },
      {
        id: 19,
        name: 'F#',
        category: 'Language',
      },
      {
        id: 305,
        name: 'FF4J',
        category: 'Other',
      },
      {
        id: 226,
        name: 'FPGA',
        category: 'Hardware/System',
      },
      {
        id: 242,
        name: 'FW',
        category: 'Hardware/System',
      },
      {
        id: 67,
        name: 'FastAPI',
        category: 'Backend',
      },
      {
        id: 61,
        name: 'Fastify',
        category: 'Backend',
      },
      {
        id: 168,
        name: 'Figma',
        category: 'Design/UI',
      },
      {
        id: 273,
        name: 'Firebase',
        category: 'Other',
      },
      {
        id: 66,
        name: 'Flask',
        category: 'Backend',
      },
      {
        id: 133,
        name: 'Flet',
        category: 'Mobile',
      },
      {
        id: 126,
        name: 'Flutter',
        category: 'Mobile',
      },
      {
        id: 219,
        name: 'Flux',
        category: 'Architecture/Pattern',
      },
      {
        id: 50,
        name: 'Foundation',
        category: 'Frontend',
      },
      {
        id: 105,
        name: 'GCP',
        category: 'DevOps',
      },
      {
        id: 40,
        name: 'Gatsby',
        category: 'Frontend',
      },
      {
        id: 111,
        name: 'Git',
        category: 'DevOps',
      },
      {
        id: 112,
        name: 'GitHub',
        category: 'DevOps',
      },
      {
        id: 113,
        name: 'GitLab',
        category: 'DevOps',
      },
      {
        id: 8,
        name: 'Go',
        category: 'Language',
      },
      {
        id: 260,
        name: 'Godot',
        category: 'Game/Media',
      },
      {
        id: 195,
        name: 'Google Analytics',
        category: 'Data/Analytics',
      },
      {
        id: 149,
        name: 'Gradle',
        category: 'Build/Package',
      },
      {
        id: 198,
        name: 'GraphQL',
        category: 'Protocol/Standard',
      },
      {
        id: 25,
        name: 'Groovy',
        category: 'Language',
      },
      {
        id: 154,
        name: 'Grunt',
        category: 'Build/Package',
      },
      {
        id: 155,
        name: 'Gulp',
        category: 'Build/Package',
      },
      {
        id: 320,
        name: 'Gum',
        category: 'Other',
      },
      {
        id: 319,
        name: 'Gym',
        category: 'Other',
      },
      {
        id: 189,
        name: 'H2O',
        category: 'Data/Analytics',
      },
      {
        id: 33,
        name: 'HTML5',
        category: 'Frontend',
      },
      {
        id: 196,
        name: 'HTTP',
        category: 'Protocol/Standard',
      },
      {
        id: 241,
        name: 'HW',
        category: 'Hardware/System',
      },
      {
        id: 26,
        name: 'Hack',
        category: 'Language',
      },
      {
        id: 183,
        name: 'Hadoop',
        category: 'Data/Analytics',
      },
      {
        id: 52,
        name: 'Handlebars',
        category: 'Frontend',
      },
      {
        id: 18,
        name: 'Haskell',
        category: 'Language',
      },
      {
        id: 110,
        name: 'Helm',
        category: 'DevOps',
      },
      {
        id: 106,
        name: 'Heroku',
        category: 'DevOps',
      },
      {
        id: 271,
        name: 'Hexo',
        category: 'Other',
      },
      {
        id: 78,
        name: 'Hibernate',
        category: 'Backend',
      },
      {
        id: 272,
        name: 'Hugo',
        category: 'Other',
      },
      {
        id: 211,
        name: 'IPFS',
        category: 'Protocol/Standard',
      },
      {
        id: 306,
        name: 'IPS',
        category: 'Other',
      },
      {
        id: 247,
        name: 'ISMS',
        category: 'Enterprise/Business',
      },
      {
        id: 172,
        name: 'IntelliJ IDEA',
        category: 'Design/UI',
      },
      {
        id: 128,
        name: 'Ionic',
        category: 'Mobile',
      },
      {
        id: 280,
        name: 'Iris',
        category: 'Other',
      },
      {
        id: 279,
        name: 'Iron',
        category: 'Other',
      },
      {
        id: 79,
        name: 'JPA',
        category: 'Backend',
      },
      {
        id: 203,
        name: 'JSON',
        category: 'Protocol/Standard',
      },
      {
        id: 51,
        name: 'JSX',
        category: 'Frontend',
      },
      {
        id: 135,
        name: 'JUnit',
        category: 'Testing',
      },
      {
        id: 202,
        name: 'JWT',
        category: 'Protocol/Standard',
      },
      {
        id: 140,
        name: 'Jasmine',
        category: 'Testing',
      },
      {
        id: 3,
        name: 'Java',
        category: 'Language',
      },
      {
        id: 1,
        name: 'JavaScript',
        category: 'Language',
      },
      {
        id: 101,
        name: 'Jenkins',
        category: 'DevOps',
      },
      {
        id: 134,
        name: 'Jest',
        category: 'Testing',
      },
      {
        id: 249,
        name: 'Jira',
        category: 'Enterprise/Business',
      },
      {
        id: 22,
        name: 'Julia',
        category: 'Language',
      },
      {
        id: 120,
        name: 'K3d',
        category: 'DevOps',
      },
      {
        id: 119,
        name: 'K8S',
        category: 'DevOps',
      },
      {
        id: 184,
        name: 'Kafka',
        category: 'Data/Analytics',
      },
      {
        id: 141,
        name: 'Karma',
        category: 'Testing',
      },
      {
        id: 62,
        name: 'Koa',
        category: 'Backend',
      },
      {
        id: 123,
        name: 'Kong',
        category: 'DevOps',
      },
      {
        id: 11,
        name: 'Kotlin',
        category: 'Language',
      },
      {
        id: 100,
        name: 'Kubernetes',
        category: 'DevOps',
      },
      {
        id: 121,
        name: 'Kudu',
        category: 'DevOps',
      },
      {
        id: 236,
        name: 'L2',
        category: 'Hardware/System',
      },
      {
        id: 237,
        name: 'L3',
        category: 'Hardware/System',
      },
      {
        id: 238,
        name: 'L4',
        category: 'Hardware/System',
      },
      {
        id: 239,
        name: 'L7',
        category: 'Hardware/System',
      },
      {
        id: 210,
        name: 'LDAP',
        category: 'Protocol/Standard',
      },
      {
        id: 48,
        name: 'LESS',
        category: 'Frontend',
      },
      {
        id: 68,
        name: 'Laravel',
        category: 'Backend',
      },
      {
        id: 322,
        name: 'Leaflet',
        category: 'Other',
      },
      {
        id: 160,
        name: 'Lerna',
        category: 'Build/Package',
      },
      {
        id: 228,
        name: 'Linux',
        category: 'Hardware/System',
      },
      {
        id: 277,
        name: 'Lodash',
        category: 'Other',
      },
      {
        id: 24,
        name: 'Lua',
        category: 'Language',
      },
      {
        id: 74,
        name: 'Lumen',
        category: 'Backend',
      },
      {
        id: 187,
        name: 'MATLAB',
        category: 'Data/Analytics',
      },
      {
        id: 227,
        name: 'MCU',
        category: 'Hardware/System',
      },
      {
        id: 246,
        name: 'MES',
        category: 'Enterprise/Business',
      },
      {
        id: 212,
        name: 'MSA',
        category: 'Architecture/Pattern',
      },
      {
        id: 213,
        name: 'MVC',
        category: 'Architecture/Pattern',
      },
      {
        id: 214,
        name: 'MVVM',
        category: 'Architecture/Pattern',
      },
      {
        id: 186,
        name: 'Machine Learning',
        category: 'Data/Analytics',
      },
      {
        id: 87,
        name: 'MariaDB',
        category: 'Database',
      },
      {
        id: 44,
        name: 'Material-UI',
        category: 'Frontend',
      },
      {
        id: 150,
        name: 'Maven',
        category: 'Build/Package',
      },
      {
        id: 96,
        name: 'Memcached',
        category: 'Database',
      },
      {
        id: 270,
        name: 'Meteor',
        category: 'Other',
      },
      {
        id: 221,
        name: 'MobX',
        category: 'Architecture/Pattern',
      },
      {
        id: 136,
        name: 'Mocha',
        category: 'Testing',
      },
      {
        id: 85,
        name: 'MongoDB',
        category: 'Database',
      },
      {
        id: 98,
        name: 'Mongoose',
        category: 'Database',
      },
      {
        id: 147,
        name: 'Moq',
        category: 'Testing',
      },
      {
        id: 83,
        name: 'MySQL',
        category: 'Database',
      },
      {
        id: 117,
        name: 'NGINX',
        category: 'DevOps',
      },
      {
        id: 190,
        name: 'NLP',
        category: 'Data/Analytics',
      },
      {
        id: 307,
        name: 'NSQ',
        category: 'Other',
      },
      {
        id: 60,
        name: 'NestJS',
        category: 'Backend',
      },
      {
        id: 107,
        name: 'Netlify',
        category: 'DevOps',
      },
      {
        id: 38,
        name: 'Next.js',
        category: 'Frontend',
      },
      {
        id: 268,
        name: 'Nft',
        category: 'Blockchain/Crypto',
      },
      {
        id: 116,
        name: 'Nginx',
        category: 'DevOps',
      },
      {
        id: 27,
        name: 'Nim',
        category: 'Language',
      },
      {
        id: 95,
        name: 'NoSQL',
        category: 'Database',
      },
      {
        id: 58,
        name: 'Node.js',
        category: 'Backend',
      },
      {
        id: 308,
        name: 'Npl',
        category: 'Other',
      },
      {
        id: 39,
        name: 'Nuxt.js',
        category: 'Frontend',
      },
      {
        id: 201,
        name: 'OAuth',
        category: 'Protocol/Standard',
      },
      {
        id: 191,
        name: 'OLAP',
        category: 'Data/Analytics',
      },
      {
        id: 256,
        name: 'OVH',
        category: 'Enterprise/Business',
      },
      {
        id: 223,
        name: 'OWIN',
        category: 'Architecture/Pattern',
      },
      {
        id: 251,
        name: 'Okta',
        category: 'Enterprise/Business',
      },
      {
        id: 206,
        name: 'OpenAPI',
        category: 'Protocol/Standard',
      },
      {
        id: 264,
        name: 'OpenCV',
        category: 'Game/Media',
      },
      {
        id: 263,
        name: 'OpenGL',
        category: 'Game/Media',
      },
      {
        id: 309,
        name: 'Ora',
        category: 'Other',
      },
      {
        id: 88,
        name: 'Oracle',
        category: 'Database',
      },
      {
        id: 12,
        name: 'PHP',
        category: 'Language',
      },
      {
        id: 118,
        name: 'PM2',
        category: 'DevOps',
      },
      {
        id: 166,
        name: 'PMD',
        category: 'Build/Package',
      },
      {
        id: 218,
        name: 'PWA',
        category: 'Architecture/Pattern',
      },
      {
        id: 180,
        name: 'Pandas',
        category: 'Data/Analytics',
      },
      {
        id: 159,
        name: 'Parcel',
        category: 'Build/Package',
      },
      {
        id: 275,
        name: 'Passport.js',
        category: 'Other',
      },
      {
        id: 70,
        name: 'Phoenix',
        category: 'Backend',
      },
      {
        id: 169,
        name: 'Photoshop',
        category: 'Design/UI',
      },
      {
        id: 188,
        name: 'Pig',
        category: 'Data/Analytics',
      },
      {
        id: 84,
        name: 'PostgreSQL',
        category: 'Database',
      },
      {
        id: 323,
        name: 'Postman',
        category: 'Other',
      },
      {
        id: 274,
        name: 'Prisma',
        category: 'Other',
      },
      {
        id: 142,
        name: 'Protractor',
        category: 'Testing',
      },
      {
        id: 53,
        name: 'Pug',
        category: 'Frontend',
      },
      {
        id: 145,
        name: 'Puppeteer',
        category: 'Testing',
      },
      {
        id: 182,
        name: 'PyTorch',
        category: 'Data/Analytics',
      },
      {
        id: 4,
        name: 'Python',
        category: 'Language',
      },
      {
        id: 282,
        name: 'Q.js',
        category: 'Other',
      },
      {
        id: 283,
        name: 'QA',
        category: 'Other',
      },
      {
        id: 234,
        name: 'Qemu',
        category: 'Hardware/System',
      },
      {
        id: 233,
        name: 'Qt',
        category: 'Hardware/System',
      },
      {
        id: 310,
        name: 'Que',
        category: 'Other',
      },
      {
        id: 311,
        name: 'Quuu',
        category: 'Other',
      },
      {
        id: 23,
        name: 'R',
        category: 'Language',
      },
      {
        id: 312,
        name: 'RDB',
        category: 'Other',
      },
      {
        id: 197,
        name: 'REST',
        category: 'Protocol/Standard',
      },
      {
        id: 240,
        name: 'RF',
        category: 'Hardware/System',
      },
      {
        id: 284,
        name: 'ROS',
        category: 'Other',
      },
      {
        id: 285,
        name: 'RPA',
        category: 'Other',
      },
      {
        id: 132,
        name: 'Rax',
        category: 'Mobile',
      },
      {
        id: 35,
        name: 'React',
        category: 'Frontend',
      },
      {
        id: 125,
        name: 'React Native',
        category: 'Mobile',
      },
      {
        id: 86,
        name: 'Redis',
        category: 'Database',
      },
      {
        id: 220,
        name: 'Redux',
        category: 'Architecture/Pattern',
      },
      {
        id: 158,
        name: 'Rollup',
        category: 'Build/Package',
      },
      {
        id: 13,
        name: 'Ruby',
        category: 'Language',
      },
      {
        id: 69,
        name: 'Ruby on Rails',
        category: 'Backend',
      },
      {
        id: 161,
        name: 'Rush',
        category: 'Build/Package',
      },
      {
        id: 9,
        name: 'Rust',
        category: 'Language',
      },
      {
        id: 244,
        name: 'SAP',
        category: 'Enterprise/Business',
      },
      {
        id: 47,
        name: 'SCSS',
        category: 'Frontend',
      },
      {
        id: 286,
        name: 'SDK',
        category: 'Other',
      },
      {
        id: 287,
        name: 'SEO',
        category: 'Other',
      },
      {
        id: 217,
        name: 'SPA',
        category: 'Architecture/Pattern',
      },
      {
        id: 94,
        name: 'SQL',
        category: 'Database',
      },
      {
        id: 89,
        name: 'SQLite',
        category: 'Database',
      },
      {
        id: 209,
        name: 'SSH',
        category: 'Protocol/Standard',
      },
      {
        id: 208,
        name: 'SSL',
        category: 'Protocol/Standard',
      },
      {
        id: 56,
        name: 'SVG',
        category: 'Frontend',
      },
      {
        id: 114,
        name: 'SVN',
        category: 'DevOps',
      },
      {
        id: 243,
        name: 'SW',
        category: 'Hardware/System',
      },
      {
        id: 222,
        name: 'SWR',
        category: 'Architecture/Pattern',
      },
      {
        id: 49,
        name: 'Sass',
        category: 'Frontend',
      },
      {
        id: 14,
        name: 'Scala',
        category: 'Language',
      },
      {
        id: 139,
        name: 'Selenium',
        category: 'Testing',
      },
      {
        id: 71,
        name: 'Sinatra',
        category: 'Backend',
      },
      {
        id: 170,
        name: 'Sketch',
        category: 'Design/UI',
      },
      {
        id: 276,
        name: 'Socket.io',
        category: 'Other',
      },
      {
        id: 165,
        name: 'SonarQube',
        category: 'Build/Package',
      },
      {
        id: 63,
        name: 'Spring',
        category: 'Backend',
      },
      {
        id: 64,
        name: 'Spring Boot',
        category: 'Backend',
      },
      {
        id: 77,
        name: 'Strapi',
        category: 'Backend',
      },
      {
        id: 45,
        name: 'Styled Components',
        category: 'Frontend',
      },
      {
        id: 175,
        name: 'Sublime Text',
        category: 'Design/UI',
      },
      {
        id: 37,
        name: 'Svelte',
        category: 'Frontend',
      },
      {
        id: 288,
        name: 'Swagger',
        category: 'Other',
      },
      {
        id: 10,
        name: 'Swift',
        category: 'Language',
      },
      {
        id: 73,
        name: 'Symfony',
        category: 'Backend',
      },
      {
        id: 289,
        name: 'TCAD',
        category: 'Other',
      },
      {
        id: 146,
        name: 'TDD',
        category: 'Testing',
      },
      {
        id: 46,
        name: 'Tailwind CSS',
        category: 'Frontend',
      },
      {
        id: 181,
        name: 'TensorFlow',
        category: 'Data/Analytics',
      },
      {
        id: 109,
        name: 'Terraform',
        category: 'DevOps',
      },
      {
        id: 143,
        name: 'TestCafe',
        category: 'Testing',
      },
      {
        id: 54,
        name: 'Three.js',
        category: 'Frontend',
      },
      {
        id: 80,
        name: 'Thymeleaf',
        category: 'Backend',
      },
      {
        id: 93,
        name: 'TiDB',
        category: 'Database',
      },
      {
        id: 290,
        name: 'Tilt',
        category: 'Other',
      },
      {
        id: 81,
        name: 'Tomcat',
        category: 'Backend',
      },
      {
        id: 250,
        name: 'Trac',
        category: 'Enterprise/Business',
      },
      {
        id: 103,
        name: 'Travis CI',
        category: 'DevOps',
      },
      {
        id: 291,
        name: 'Trax',
        category: 'Other',
      },
      {
        id: 266,
        name: 'Truffle',
        category: 'Blockchain/Crypto',
      },
      {
        id: 2,
        name: 'TypeScript',
        category: 'Language',
      },
      {
        id: 177,
        name: 'UXCam',
        category: 'Design/UI',
      },
      {
        id: 178,
        name: 'UXPin',
        category: 'Design/UI',
      },
      {
        id: 229,
        name: 'Ubuntu',
        category: 'Hardware/System',
      },
      {
        id: 130,
        name: 'Unity',
        category: 'Mobile',
      },
      {
        id: 259,
        name: 'Unity',
        category: 'Game/Media',
      },
      {
        id: 262,
        name: 'Unreal Engine',
        category: 'Game/Media',
      },
      {
        id: 292,
        name: 'Uppy',
        category: 'Other',
      },
      {
        id: 293,
        name: 'Utm',
        category: 'Other',
      },
      {
        id: 32,
        name: 'VBA',
        category: 'Language',
      },
      {
        id: 231,
        name: 'VR',
        category: 'Hardware/System',
      },
      {
        id: 28,
        name: 'Vala',
        category: 'Language',
      },
      {
        id: 43,
        name: 'Vanilla JS',
        category: 'Frontend',
      },
      {
        id: 108,
        name: 'Vercel',
        category: 'DevOps',
      },
      {
        id: 176,
        name: 'Vim',
        category: 'Design/UI',
      },
      {
        id: 173,
        name: 'Visual Studio',
        category: 'Design/UI',
      },
      {
        id: 157,
        name: 'Vite',
        category: 'Build/Package',
      },
      {
        id: 36,
        name: 'Vue.js',
        category: 'Frontend',
      },
      {
        id: 57,
        name: 'Vuetify',
        category: 'Frontend',
      },
      {
        id: 321,
        name: 'Vuo',
        category: 'Other',
      },
      {
        id: 294,
        name: 'WPF',
        category: 'Other',
      },
      {
        id: 230,
        name: 'WSL',
        category: 'Hardware/System',
      },
      {
        id: 55,
        name: 'WebGL',
        category: 'Frontend',
      },
      {
        id: 200,
        name: 'WebRTC',
        category: 'Protocol/Standard',
      },
      {
        id: 199,
        name: 'WebSocket',
        category: 'Protocol/Standard',
      },
      {
        id: 148,
        name: 'Webpack',
        category: 'Build/Package',
      },
      {
        id: 295,
        name: 'Wey',
        category: 'Other',
      },
      {
        id: 257,
        name: 'Wix',
        category: 'Enterprise/Business',
      },
      {
        id: 76,
        name: 'WordPress',
        category: 'Backend',
      },
      {
        id: 204,
        name: 'XML',
        category: 'Protocol/Standard',
      },
      {
        id: 207,
        name: 'XMPP',
        category: 'Protocol/Standard',
      },
      {
        id: 235,
        name: 'Xen',
        category: 'Hardware/System',
      },
      {
        id: 205,
        name: 'YAML',
        category: 'Protocol/Standard',
      },
      {
        id: 152,
        name: 'Yarn',
        category: 'Build/Package',
      },
      {
        id: 258,
        name: 'Yii',
        category: 'Enterprise/Business',
      },
      {
        id: 298,
        name: 'Yoga',
        category: 'Other',
      },
      {
        id: 299,
        name: 'Yolk',
        category: 'Other',
      },
      {
        id: 301,
        name: 'ZK',
        category: 'Other',
      },
      {
        id: 302,
        name: 'Zest',
        category: 'Other',
      },
      {
        id: 303,
        name: 'Zeta',
        category: 'Other',
      },
      {
        id: 252,
        name: 'Zoho',
        category: 'Enterprise/Business',
      },
      {
        id: 253,
        name: 'Zoom',
        category: 'Enterprise/Business',
      },
      {
        id: 124,
        name: 'Zuul',
        category: 'DevOps',
      },
      {
        id: 314,
        name: 'act',
        category: 'Other',
      },
      {
        id: 281,
        name: 'hub',
        category: 'Other',
      },
      {
        id: 127,
        name: 'iOS',
        category: 'Mobile',
      },
      {
        id: 42,
        name: 'jQuery',
        category: 'Frontend',
      },
      {
        id: 122,
        name: 'k6',
        category: 'DevOps',
      },
      {
        id: 151,
        name: 'npm',
        category: 'Build/Package',
      },
      {
        id: 304,
        name: 'pip',
        category: 'Other',
      },
      {
        id: 296,
        name: 'ws',
        category: 'Other',
      },
      {
        id: 300,
        name: 'yolo',
        category: 'Other',
      },
    ],
    resumeTypes: [
      {
        value: 'DEFAULT',
        description: '기본형',
      },
      {
        value: 'MODERN',
        description: '모던형',
      },
    ],
    careerTypes: [
      {
        value: 'FRESHMAN',
        description: '신입',
      },
      {
        value: 'EXPERIENCED',
        description: '경력',
      },
    ],
    degreeLevels: [
      {
        value: 'HIGH_SCHOOL',
        description: '고졸',
      },
      {
        value: 'ASSOCIATE',
        description: '전문학사',
      },
      {
        value: 'BACHELOR',
        description: '학사',
      },
      {
        value: 'MASTER',
        description: '석사',
      },
      {
        value: 'DOCTORATE',
        description: '박사',
      },
    ],
    proficiencyLevels: [
      {
        value: 'BEGINNER',
        description: '초급',
      },
      {
        value: 'INTERMEDIATE',
        description: '중급',
      },
      {
        value: 'ADVANCED',
        description: '고급',
      },
    ],
    projectTypes: [
      {
        value: 'PERSONAL',
        description: '개인',
      },
      {
        value: 'TEAM',
        description: '팀',
      },
      {
        value: 'COMPANY',
        description: '회사',
      },
    ],
    additionalInfoCategories: [
      {
        value: 'AWARD',
        description: '수상내역',
      },
      {
        value: 'LANGUAGE',
        description: '어학능력',
      },
      {
        value: 'CERTIFICATE',
        description: '자격증',
      },
      {
        value: 'ACTIVITY',
        description: '대외활동',
      },
    ],
  },
  timestamp: '2025-09-11T16:06:41.548313222',
};
