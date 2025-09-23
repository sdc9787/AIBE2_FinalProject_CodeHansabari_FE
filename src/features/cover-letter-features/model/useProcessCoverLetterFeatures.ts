import { useCustomMutation } from '@/shared';
import { processCoverLetterFeatures } from '@/features/cover-letter-features/api';

export const useProcessCoverLetterFeatures = () => {
  return useCustomMutation({
    mutationFn: () => processCoverLetterFeatures(),
    successMessage: '전체 특징 처리가 시작/완료되었습니다.',
    loadingType: 'global',
    // Invalidate relevant queries if any (none added here)
  });
};
