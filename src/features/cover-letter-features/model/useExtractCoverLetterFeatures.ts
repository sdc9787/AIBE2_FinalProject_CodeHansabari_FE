import { useCustomMutation } from '@/shared';
import { extractCoverLetterFeatures } from '@/features/cover-letter-features/api';
import type { ApiExtractResponse } from '@/entities/coverLetterFeatures/model/type';

export const useExtractCoverLetterFeatures = () => {
  return useCustomMutation<void, ApiExtractResponse>({
    mutationFn: () => extractCoverLetterFeatures(),
    successMessage: '특징 추출을 시작하였습니다.',
  });
};
