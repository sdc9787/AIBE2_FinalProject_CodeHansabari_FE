import { useCustomMutation } from '@/shared';
import { restoreCoverLetter } from '@/features/restore-coverLetter/api';

export const useRestoreCoverLetter = () => {
  return useCustomMutation({
    mutationFn: (coverLetterId: number) => restoreCoverLetter(coverLetterId),
    successMessage: '자소서가 복구되었습니다.',
    invalidateQueryKeys: [['admin', 'coverLetters', 'list']],
  });
};
