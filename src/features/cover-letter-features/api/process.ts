import { clientFetch } from '@/shared';

interface ProcessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const processCoverLetterFeatures =
  async (): Promise<ProcessResponse> => {
    const response = await clientFetch.post(
      '/api/cover-letter-features/process',
    );
    return response;
  };
