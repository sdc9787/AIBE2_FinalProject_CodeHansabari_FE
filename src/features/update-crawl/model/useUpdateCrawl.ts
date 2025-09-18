import { useCustomMutation } from '@/shared';
import { updateCrawl } from '@/features';

export const useUpdateCrawl = () => {
  return useCustomMutation({
    mutationFn: ({ crawlId, text }: { crawlId: number; text: string }) =>
      updateCrawl(crawlId, text),
    successMessage: '데이터가 수정되었습니다.',
    invalidateQueryKeys: [['crawlList']],
  });
};
