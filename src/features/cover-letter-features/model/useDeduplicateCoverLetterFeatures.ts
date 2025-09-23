import { useCustomMutation } from '@/shared';
import { deduplicateCoverLetterFeatures } from '@/features/cover-letter-features/api';

export const useDeduplicateCoverLetterFeatures = () => {
  return useCustomMutation({
    mutationFn: () => deduplicateCoverLetterFeatures(),
    successMessage: '중복 제거가 완료되었습니다.',
    loadingType: 'global',
  });
};
