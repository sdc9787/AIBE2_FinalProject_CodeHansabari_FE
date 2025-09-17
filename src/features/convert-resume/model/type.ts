// 이력서 변환 관련 타입 정의
export interface ConvertResumeResponse {
  success: boolean;
  message: string;
  data: {
    title: string;
    type: 'DEFAULT' | 'MODERN';
    name: string;
    email: string;
    birthYear: number;
    phone: string;
    careerType: 'FRESHMAN' | 'EXPERIENCED';
    fieldName: string;
    introduction?: string;
    githubUrl?: string;
    blogUrl?: string;
    notionUrl?: string;
    educations: Array<{
      schoolName: string;
      major?: string;
      degreeLevel:
        | 'HIGH_SCHOOL'
        | 'ASSOCIATE'
        | 'BACHELOR'
        | 'MASTER'
        | 'DOCTORATE';
      personalGpa?: number;
      totalGpa?: number;
      graduationDate: string;
    }>;
    techStacks: Array<{
      techStackId: number;
      techStackName: string;
      proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    }>;
    customLinks: Array<{
      name: string;
      url: string;
    }>;
    careers: Array<{
      startDate: string;
      endDate?: string;
      companyName: string;
      companyDescription?: string;
      departmentPosition: string;
      mainTasks?: string;
      techStacks: Array<{
        techStackId: number;
        techStackName: string;
      }>;
    }>;
    projects: Array<{
      startDate: string;
      endDate: string;
      name: string;
      description?: string;
      detailedDescription?: string;
      repositoryUrl?: string;
      deployUrl?: string;
      projectType: 'PERSONAL' | 'TEAM' | 'COMPANY';
      techStacks: Array<{
        techStackId: number;
        techStackName: string;
        usageType?: string;
      }>;
    }>;
    trainings: Array<{
      startDate: string;
      endDate: string;
      courseName: string;
      institutionName: string;
      detailedContent?: string;
      techStacks: Array<{
        techStackId: number;
        techStackName: string;
      }>;
    }>;
    additionalInfos: Array<{
      category: 'AWARD' | 'CERTIFICATE' | 'LANGUAGE' | 'ACTIVITY';
      title: string;
      description?: string;
      issuedDate?: string;
      issuingOrganization?: string;
      score?: string;
      details?: string;
    }>;
  };
  timestamp: string;
}

export interface ConvertResumeErrorResponse {
  success: false;
  message: string;
  data: null;
  timestamp: string;
}
