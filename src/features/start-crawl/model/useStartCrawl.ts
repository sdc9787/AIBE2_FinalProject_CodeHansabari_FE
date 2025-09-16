import { useCustomMutation } from '@/shared';
import { startCrawl } from '@/features';

export const useStartCrawl = () => {
  return useCustomMutation({
    mutationFn: () => startCrawl(),
    invalidateQueryKeys: [['crawlList', 'list']],
    loadingType: 'global',
  });
};
