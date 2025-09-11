// Import and re-export types from entities
import type {
  ResumeType,
  CareerType,
  DegreeLevel,
  ProficiencyLevel,
  ProjectType,
  AdditionalInfoCategory,
  Education,
  TechStack,
  ProjectTechStack,
  CustomLink,
  Career,
  Project,
  Training,
  AdditionalInfo,
  Resume,
  CreateResumeRequest,
  UpdateResumeRequest,
  AISuggestRequest,
  AISuggestResponse,
  ResumeListItem,
  ResumeListData,
  AISuggestApiResponse,
} from '@/entities/resume/model/type';

// Re-export for widget use
export type {
  ResumeType,
  CareerType,
  DegreeLevel,
  ProficiencyLevel,
  ProjectType,
  AdditionalInfoCategory,
  Education,
  TechStack,
  ProjectTechStack,
  CustomLink,
  Career,
  Project,
  Training,
  AdditionalInfo,
  Resume,
  CreateResumeRequest,
  UpdateResumeRequest,
  AISuggestRequest,
  AISuggestResponse,
  ResumeListItem,
  ResumeListData,
  AISuggestApiResponse,
};

// Widget-specific types
export interface ResumeItem {
  name: string;
  required: boolean;
  state: boolean;
}

// Legacy support - will be removed
export interface ResumeDataItem {
  title: string;
  subTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeSection {
  sectionType: string;
  sectionTitle: string;
  items: ResumeDataItem[];
}

export interface ResumeData {
  title: string;
  memberInfo: any; // Legacy - to be removed
  sections: ResumeSection[];
}

// Server response types for widgets
export interface WidgetResumeResponse {
  data: Resume[];
}

export interface ServerResumeData extends ResumeData {
  id: number;
  createdAt: string;
  updatedAt: string;
}
