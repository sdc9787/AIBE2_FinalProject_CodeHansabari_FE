import { useCustomMutation } from '@/shared';
import { updateCrawl } from '@/features';

export const useUpdateCrawl = (crawlId: number) => {
  return useCustomMutation({
    mutationFn: () => updateCrawl(crawlId),
    successMessage: '데이터가 수정되었습니다.',
    invalidateQueryKeys: [
      ['crawlList', crawlId],
      ['crawlList', 'list'],
    ],
  });
};
