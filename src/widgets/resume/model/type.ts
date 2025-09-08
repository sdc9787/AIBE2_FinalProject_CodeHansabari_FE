// 회원 정보 구조 정의
export interface MemberInfo {
  name: string; // 이름
  age?: string; // 나이
  careerType?: string; // 경력 유형
  email: string; // 이메일
  phoneNumber?: string; // 전화번호
  blogUrl?: string; // 블로그 URL
  githubUrl?: string; // GitHub URL
  notionUrl?: string; // Notion URL
  introduction?: string; // 자기소개
  techStack?: string[]; // 기술 스택
}

// 이력서 항목의 구조 정의
export interface ResumeItem {
  title: string; // 항목 제목
  subTitle?: string; // 부제목
  startDate?: string; // 시작 날짜
  endDate?: string; // 종료 날짜
  description?: string; // 설명
}

// 각 섹션의 구조 정의
export interface ResumeSection {
  sectionType: string; // 예: "experience", "education", "project"
  sectionTitle: string; // 예: "경력", "학력", "프로젝트"
  items: ResumeItem[];
}

// 전체 이력서 데이터 구조
export interface Resume {
  id: number;
  title: string;
  memberInfo: MemberInfo;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeRequest {
  title: string;
  memberInfo: MemberInfo;
  sections: ResumeSection[];
}

export interface UpdateResumeRequest {
  title: string;
  memberInfo: MemberInfo;
  sections: ResumeSection[];
}

export interface AISuggestRequest {
  experienceContent: string;
}

export interface AISuggestResponse {
  suggestedSections: ResumeSection[];
}

export interface ResumeResponse {
  success: boolean;
  message: string;
  data: Resume;
  errorCode?: string;
  canRetry?: boolean;
  timestamp: string;
}

export interface ResumeListResponse {
  success: boolean;
  message: string;
  data: Resume[];
  errorCode?: string;
  canRetry?: boolean;
  timestamp: string;
}

export interface AISuggestApiResponse {
  success: boolean;
  message: string;
  data: AISuggestResponse;
  errorCode?: string;
  canRetry?: boolean;
  timestamp: string;
}
