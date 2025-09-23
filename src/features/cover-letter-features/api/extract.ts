import { clientFetch } from '@/shared';
import type { ApiExtractResponse } from '@/entities/coverLetterFeatures/model/type';

export const extractCoverLetterFeatures =
  async (): Promise<ApiExtractResponse> => {
    const response = await clientFetch.post<ApiExtractResponse>(
      '/api/cover-letter-features/extract',
    );
    return response;
  };
