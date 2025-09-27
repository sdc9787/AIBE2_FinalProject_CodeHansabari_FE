import { useCustomMutation } from '@/shared';
import { deduplicateCoverLetterFeatures } from '@/features/cover-letter-features/api';
import type { ApiDeduplicateResponse } from '@/entities/coverLetterFeatures/model/type';

export const useDeduplicateCoverLetterFeatures = () => {
  return useCustomMutation<void, ApiDeduplicateResponse>({
    mutationFn: () => deduplicateCoverLetterFeatures(),
    successMessage: '중복 제거가 완료되었습니다.',
  });
};
