import { clientFetch } from '@/shared';

interface ExtractResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const extractCoverLetterFeatures =
  async (): Promise<ExtractResponse> => {
    const response = await clientFetch.post(
      '/api/cover-letter-features/extract',
    );
    return response;
  };
