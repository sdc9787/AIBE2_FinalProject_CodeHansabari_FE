// 항목 편집 리스트 타입
export interface ResumeItem {
  name: string;
  required: boolean;
  state: boolean;
}

// 이력서 데이터 타입
export interface ResumeData {
  title: string;
  memberInfo: {
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
    customLinks: Array<{
      title: string;
      url: string;
    }>;
  };
  sections: {
    education: Array<{
      school: string;
      major: string;
      period: string;
      status: string;
    }>;
    experience: Array<{
      company: string;
      position: string;
      period: string;
      description: string;
    }>;
    projects: Array<{
      title: string;
      period: string;
      description: string;
      techStack: string[];
      link: string;
    }>;
    certificates: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
    awards: Array<{
      title: string;
      issuer: string;
      date: string;
      description: string;
    }>;
  };
}
