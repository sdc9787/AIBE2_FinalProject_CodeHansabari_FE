import { clientFetch } from '@/shared';
import type { ApiProcessResponse } from '@/entities/coverLetterFeatures/model/type';

export const processCoverLetterFeatures =
  async (): Promise<ApiProcessResponse> => {
    const response = await clientFetch.post<ApiProcessResponse>(
      '/api/cover-letter-features/process',
    );
    return response;
  };
