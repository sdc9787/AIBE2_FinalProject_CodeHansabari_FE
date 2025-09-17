import { useCustomMutation } from '@/shared';
import { restoreCoverLetter } from '@/features/restore-coverLetter/api';

export const useRestoreCoverLetter = (coverLetterId?: number) => {
  return useCustomMutation({
    mutationFn: () => restoreCoverLetter(coverLetterId as number),
    successMessage: '자소서가 복구되었습니다.',
    invalidateQueryKeys: [['admin', 'coverLetters', 'list']],
  });
};
