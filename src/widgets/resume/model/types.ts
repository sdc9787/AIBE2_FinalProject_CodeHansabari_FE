// 항목 편집 리스트 타입
export interface ResumeItem {
  name: string;
  required: boolean;
  state: boolean;
}

// 커스텀 링크 타입
export interface CustomLink {
  title: string;
  url: string;
}

// 멤버 정보 타입
export interface MemberInfo {
  name: string;
  age: string;
  careerType: string;
  email: string;
  phoneNumber: string;
  blogUrl: string;
  githubUrl: string;
  notionUrl: string;
  introduction: string;
  techStack: string[];
  customLinks: CustomLink[];
}

// 이력서 아이템 타입
export interface ResumeDataItem {
  title: string;
  subTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

// 이력서 섹션 타입
export interface ResumeSection {
  sectionType: string;
  sectionTitle: string;
  items: ResumeDataItem[];
}

// 이력서 데이터 타입
export interface ResumeData {
  title: string;
  memberInfo: MemberInfo;
  sections: ResumeSection[];
}

// 서버 응답용 이력서 데이터 타입 (id, timestamps 포함)
export interface ServerResumeData extends ResumeData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 서버 응답 타입
export interface ResumeResponse {
  data: ServerResumeData[];
}
