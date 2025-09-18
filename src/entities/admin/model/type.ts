export interface CrawlItem {
  coverLetterId: number; // 자기소개서 ID
  text: string; // 크롤링된 자기소개서 내용
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// paginated crawl list response returned from /api/crawled-cover-letters/
export interface CrawlListPagedData {
  content: CrawlItem[];
  pageable: {
    sort: { sorted: boolean; unsorted: boolean; empty: boolean };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CrawlListResponse {
  success: boolean;
  message: string;
  data: CrawlListPagedData;
  timestamp: number | string;
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

// 회원 관리 관련 타입들
export interface FetchAdminMembersParams {
  page?: number;
  size?: number;
  email?: string;
  name?: string;
  role?: 'USER' | 'ADMIN' | 'ROOT';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'name';
  sortDirection?: 'asc' | 'desc';
}

export interface AdminMemberItem {
  memberId: number;
  email: string;
  name: string;
  picture: string;
  role: 'USER' | 'ADMIN' | 'ROOT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMemberListResponse {
  success: boolean;
  message: string;
  data: {
    content: AdminMemberItem[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  };
  timestamp: string;
}

export interface AdminMemberDetailItem {
  memberId: number;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  role: 'USER' | 'ADMIN' | 'ROOT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  coverLetterCount: number;
  resumeCount: number;
}

export interface AdminMemberDetailResponse {
  success: boolean;
  message: string;
  data: AdminMemberDetailItem;
  timestamp: string;
}

export interface AdminMemberStatistics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  suspendedMembers: number;
  userRoleCount: number;
  adminRoleCount: number;
  rootRoleCount: number;
  todayNewMembers: number;
  monthlyNewMembers: number;
}

export interface AdminMemberStatisticsResponse {
  success: boolean;
  message: string;
  data: AdminMemberStatistics;
  timestamp: string;
}
