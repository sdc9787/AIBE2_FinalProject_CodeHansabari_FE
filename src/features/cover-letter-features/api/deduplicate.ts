import { clientFetch } from '@/shared';
import type { ApiDeduplicateResponse } from '@/entities/coverLetterFeatures/model/type';

export const deduplicateCoverLetterFeatures =
  async (): Promise<ApiDeduplicateResponse> => {
    const response = await clientFetch.post<ApiDeduplicateResponse>(
      '/api/cover-letter-features/deduplicate',
    );
    return response;
  };
