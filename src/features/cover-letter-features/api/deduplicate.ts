import { clientFetch } from '@/shared';

interface DeduplicateResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const deduplicateCoverLetterFeatures =
  async (): Promise<DeduplicateResponse> => {
    const response = await clientFetch.post(
      '/api/cover-letter-features/deduplicate',
    );
    return response;
  };
