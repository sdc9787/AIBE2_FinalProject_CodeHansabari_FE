//이력서 목록 조회 아이템
export interface ResponseResumeListItem {
  resumeId: number;
  title: string;
  updatedAt: string;
  completedSections: string[];
}

//이력서 목록 조회
export interface ResponseResumeList {
  success: boolean;
  message: string;
  data: {
    content: ResponseResumeListItem[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

// 기술 스택 메타데이터
export interface TechStackMetadata {
  id: number;
  name: string;
  category: string;
}

// 이력서 타입 메타데이터
export interface ResumeTypeMetadata {
  value: ResumeType;
  description: string;
}

// 경력 타입 메타데이터
export interface CareerTypeMetadata {
  value: CareerType;
  description: string;
}

// 학위 수준 메타데이터
export interface DegreeLevelMetadata {
  value: DegreeLevel;
  description: string;
}

// 숙련도 수준 메타데이터
export interface ProficiencyLevelMetadata {
  value: ProficiencyLevel;
  description: string;
}

// 프로젝트 타입 메타데이터
export interface ProjectTypeMetadata {
  value: ProjectType;
  description: string;
}

// 추가 정보 카테고리 메타데이터
export interface AdditionalInfoCategoryMetadata {
  value: AdditionalInfoCategory;
  description: string;
}

// 이력서 메타데이터 전체 응답
export interface ResumeMetadata {
  success: boolean;
  message: string;
  data: {
    techStacks: TechStackMetadata[];
    resumeTypes: ResumeTypeMetadata[];
    careerTypes: CareerTypeMetadata[];
    degreeLevels: DegreeLevelMetadata[];
    proficiencyLevels: ProficiencyLevelMetadata[];
    projectTypes: ProjectTypeMetadata[];
    additionalInfoCategories: AdditionalInfoCategoryMetadata[];
  };
  timestamp: string;
}

// -----------------------------------------------------

//학력
export interface Education {
  schoolName: string; // 학교 이름
  degreeLevel: DegreeLevel; // 학위 수준
  graduationDate: string; // 졸업일 또는 졸업 예정일 (YYYY-MM-DD)
  major?: string; // 전공 (선택)
  personalGpa?: number | null; // 개인 평점 (선택)
  totalGpa?: number | null; // 전체 평점(선택)
}

// 기술 스택 (이력서 저장/수정용)
export interface TechStack {
  techStackId: number; // 기술 스택 식별자(ID)
  proficiencyLevel?: ProficiencyLevel; // 숙련도 수준 (선택)
}

// 프로젝트에서 사용하는 기술스택 (용도 포함)
export interface ProjectTechStack {
  techStackId: number; // 기술 스택 ID
  usageType?: string; // 해당 기술의 사용 용도나 역할 ("백엔드 프레임워크", "프론트엔드")
}

// 커스텀 링크
export interface CustomLink {
  name: string; // 링크 이름(예: 포트폴리오, 블로그)
  url: string; // 링크 URL
}

// 경력 내 기술 스택 (저장 요청 스펙)
export interface CareerTechStack {
  techStackId: number; // 경력 항목에 연관된 기술 스택 ID
}

// 경력 정보
export interface Career {
  startDate: string; // 경력 시작일 (YYYY-MM-DD)
  endDate?: string | null; // 경력 종료일(재직중이면 null 또는 생략)
  companyName: string; // 회사명
  departmentPosition: string; // 부서/직책
  companyDescription?: string; // 회사 설명(선택)
  mainTasks?: string; // 담당 업무(선택)
  techStacks?: CareerTechStack[]; // 해당 경력에서 사용한 기술 스택 목록(선택)
}

// 프로젝트 정보
export interface Project {
  startDate: string; // 프로젝트 시작일 (YYYY-MM-DD)
  endDate: string; // 프로젝트 종료일
  name: string; // 프로젝트 명
  description?: string; // 프로젝트 요약 설명
  detailedDescription?: string; // 상세 설명(선택)
  repositoryUrl?: string | null; // 저장소 URL(선택)
  deployUrl?: string | null; // 배포 URL(선택)
  projectType?: ProjectType; // 프로젝트 유형(개인/팀/회사)
  techStacks?: ProjectTechStack[]; // 프로젝트에서 사용한 기술 스택 목록(선택)
}

// 교육/훈련 정보
export interface Training {
  startDate: string; // 교육/훈련 시작일 (YYYY-MM-DD)
  endDate: string; // 교육/훈련 종료일 (YYYY-MM-DD)
  courseName: string; // 과정명
  institutionName: string; // 기관명
  detailedContent?: string; // 상세 내용(선택)
  techStacks?: CareerTechStack[]; // 과정에서 사용된 기술 스택(선택)
}

// 추가 정보 (수상/자격증/어학/활동)
export interface AdditionalInfo {
  startDate: string; // 활동/수상/자격 시작일 (YYYY-MM-DD)
  endDate?: string | null; // 종료일(선택)
  category: AdditionalInfoCategory; // 항목 분류(수상/자격/어학/활동)
  activityName: string; // 활동명 또는 수상명/자격명
  relatedOrganization: string; // 관련 기관 또는 수여처
  detailedContent?: string; // 상세 내용(선택)
  certificateNumber?: string | null; // 자격증 번호(선택)
  languageLevel?: string | null; // 어학 수준(선택)
}

// 이력서 상세 조회 아이템
export interface ResponseResumeDetailItem extends CreateResumeRequest {
  resumeId: number; // 이력서 ID
}

export interface ResponseResumeDetail {
  success: boolean;
  message: string;
  data: ResponseResumeDetailItem;
}

// 이력서 수정 요청
export type UpdateResumeRequest = CreateResumeRequest;

// 이력서 생성 요청
export interface CreateResumeRequest {
  // Required by backend
  title: string;
  type: ResumeType;
  name: string;
  email: string;
  birthYear: number;
  phone: string;
  careerType: CareerType;
  fieldName: string;

  // Optional fields
  introduction?: string;
  githubUrl?: string;
  blogUrl?: string;
  notionUrl?: string;

  // Collections (can be empty arrays)
  educations?: Education[];
  techStacks?: TechStack[];
  customLinks?: CustomLink[];
  careers?: Career[];
  projects?: Project[];
  trainings?: Training[];
  additionalInfos?: AdditionalInfo[];
}

// 이력서 관련 열거형 및 공통 타입 정의
export type ResumeType = 'DEFAULT' | 'MODERN';
export type CareerType = 'FRESHMAN' | 'EXPERIENCED';
export type DegreeLevel =
  | 'HIGH_SCHOOL'
  | 'ASSOCIATE'
  | 'BACHELOR'
  | 'MASTER'
  | 'DOCTORATE';
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ProjectType = 'PERSONAL' | 'TEAM' | 'COMPANY';
export type AdditionalInfoCategory =
  | 'AWARD'
  | 'CERTIFICATE'
  | 'LANGUAGE'
  | 'ACTIVITY';
