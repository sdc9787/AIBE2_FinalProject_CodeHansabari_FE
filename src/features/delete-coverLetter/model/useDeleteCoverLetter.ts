import { useCustomMutation } from '@/shared/lib';
import { deleteCoverLetter } from '@/entities/coverLetter/api/deleteCoverLetter';

export const useDeleteCoverLetter = () => {
  return useCustomMutation<number, void>({
    mutationFn: (coverLetterId: number) => deleteCoverLetter(coverLetterId),
    successMessage: '자기소개서가 성공적으로 삭제되었습니다.',
    // invalidate any coverLetter queries (list/detail). use prefix ['coverLetters'] to match query keys
    invalidateQueryKeys: [['coverLetters']],
  });
};
