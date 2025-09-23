import { useCustomMutation } from '@/shared';
import { extractCoverLetterFeatures } from '@/features/cover-letter-features/api';

export const useExtractCoverLetterFeatures = () => {
  return useCustomMutation({
    mutationFn: () => extractCoverLetterFeatures(),
    successMessage: '특징 추출이 완료되었습니다.',
    loadingType: 'global',
  });
};
