import { useCustomMutation } from '@/shared';
import { deleteCrawl } from '@/features';

export const useDeleteCrawl = (crawlId?: number) => {
  return useCustomMutation({
    mutationFn: () => deleteCrawl(crawlId),
    successMessage: '데이터가 삭제되었습니다.',
    invalidateQueryKeys: [['admin', 'crawl', 'list']],
  });
};
