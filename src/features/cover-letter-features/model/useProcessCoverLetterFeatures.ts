import { useCustomMutation } from '@/shared';
import { processCoverLetterFeatures } from '@/features/cover-letter-features/api';
import type { ApiProcessResponse } from '@/entities/coverLetterFeatures/model/type';

export const useProcessCoverLetterFeatures = () => {
  return useCustomMutation<void, ApiProcessResponse>({
    mutationFn: () => processCoverLetterFeatures(),
    successMessage: '전체 특징 처리가 시작/완료되었습니다.',
  });
};
