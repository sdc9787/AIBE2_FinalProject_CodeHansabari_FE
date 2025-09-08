export interface MemberInfo {
  name: string;
  email: string;
  phoneNumber?: string;
  blogUrl?: string;
}

export interface ResumeItem {
  title: string;
  subTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeSection {
  sectionType: string;
  sectionTitle: string;
  items: ResumeItem[];
}

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
