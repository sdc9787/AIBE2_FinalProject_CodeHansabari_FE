export interface CrawlItem {
  coverLetterId: number; // 자기소개서 ID
  text: string; // 크롤링된 자기소개서 내용
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface CrawlListResponse {
  success: boolean;
  message: string;
  data: CrawlItem[];
  timestamp: number;
}

export interface CrawlDetailResponse {
  success: boolean;
  message: string;
  data: CrawlItem;
  timestamp: number;
}

export interface CrawlDeleteResponse {
  success: boolean;
  message: string;
  data: null;
  timestamp: number;
}

export interface CrawlSearchResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    crawledCount: number; // 크롤링된 자기소개서 개수
  };
  timestamp: number;
}

export interface FetchAdminResumesParams {
  page: number;
  size: number;
  status?: 'ACTIVE' | 'DELETED';
  email?: string;
  title?: string;
}

export interface AdminResumeItem {
  resumeId: number;
  authorEmail: string;
  title: string;
  status: 'ACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  scheduledDeletionDate?: string | null;
}

export interface AdminResumeListResponse {
  success: boolean;
  message: string;
  data: {
    content: AdminResumeItem[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
  timestamp: string;
  errorCode?: string | null;
  canRetry?: boolean | null;
}

export interface FetchAdminCoverLettersParams {
  page: number;
  size: number;
  status?: 'ACTIVE' | 'DELETED';
  email?: string;
  title?: string;
}

export interface AdminCoverLetterItem {
  coverLetterId: number;
  authorEmail: string;
  title: string;
  status: 'ACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  scheduledDeletionDate?: string | null;
}

export interface AdminCoverLetterListResponse {
  success: boolean;
  message: string;
  data: {
    content: AdminCoverLetterItem[];
    totalElements: number;
    totalPages: number;
  };
  timestamp: string;
  errorCode?: string | null;
  canRetry?: boolean | null;
}
