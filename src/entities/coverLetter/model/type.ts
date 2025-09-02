export interface CoverLetterItem {
  coverLetterId: number;
  title: string;
  content: string;
  jobField: string;
  experience: string;
  createdAt: string; // ISO datetime
  updatedAt: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
}

//CoverLetterList
export interface CoverLetterListData {
  content: CoverLetterItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
}

export interface CoverLetterListResponse {
  success: boolean;
  message: string;
  data: CoverLetterListData;
}

//CoverLetterDetail
export interface CoverLetterDetailData {
  coverLetterId: number;
  title: string;
  content: string;
  jobField: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterDetailResponse {
  success: boolean;
  message: string;
  data: CoverLetterDetailData;
}
