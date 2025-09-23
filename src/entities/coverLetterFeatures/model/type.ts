// API response types for cover-letter-features

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  canRetry?: boolean;
  timestamp?: string;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
};

export type PagedData<T> = {
  content: T[];
  pageable: { pageNumber: number; pageSize: number };
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type FeatureCategory = 'EXPRESSION' | 'STRUCTURE' | 'CONTENT' | string;

export type RawCoverLetterFeature = {
  rawCoverLetterFeatureId: number;
  featuresCategory: FeatureCategory;
  description: string;
  coverLetterId: number;
  createdAt: string;
  updatedAt: string;
};

export type CoverLetterFeature = {
  coverLetterFeatureId: number;
  featuresCategory: FeatureCategory;
  description: string;
  duplicateCount: number;
  representativeCoverLetterId: number;
  createdAt: string;
  updatedAt: string;
};

export type CoverLetterFeaturesStatistics = {
  totalCount: number;
  expressionCount: number;
  structureCount: number;
  contentCount: number;
};

export type ProcessResponseData = {
  rawFeaturesCount: number;
  finalFeaturesCount: number;
  deduplicationRatio: string;
  batchSize: number;
  totalBatches: number;
  status: string;
  message?: string;
};

export type ExtractResponseData = {
  extractedCount: number;
  batchSize: number;
  totalBatches: number;
  status: string;
};

export type DeduplicateResponseData = {
  finalFeaturesCount: number;
  perCategory: Record<'EXPRESSION' | 'STRUCTURE' | 'CONTENT', number>;
  status: string;
};

// Convenience exported shapes used by hooks / API modules
export type RawCoverLetterFeaturePage = PagedData<RawCoverLetterFeature>;
export type CoverLetterFeaturePage = PagedData<CoverLetterFeature>;

export type ApiRawPageResponse = ApiResponse<RawCoverLetterFeaturePage>;
export type ApiRawByCategoryResponse = ApiResponse<RawCoverLetterFeaturePage>;
export type ApiFeaturePageResponse = ApiResponse<CoverLetterFeaturePage>;
export type ApiStatisticsResponse = ApiResponse<CoverLetterFeaturesStatistics>;

export type ApiProcessResponse = ApiResponse<ProcessResponseData>;
export type ApiExtractResponse = ApiResponse<ExtractResponseData>;
export type ApiDeduplicateResponse = ApiResponse<DeduplicateResponseData>;

export {};
