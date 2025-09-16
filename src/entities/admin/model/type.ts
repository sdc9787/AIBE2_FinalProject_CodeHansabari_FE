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
