import { useCustomMutation } from '@/shared';
import { startCrawl } from '@/features';

export const useStartCrawl = () => {
  return useCustomMutation({
    mutationFn: () => startCrawl(),
    invalidateQueryKeys: [['admin', 'crawl', 'list']],
    successMessage: '크롤링이 완료되었습니다.',
  });
};
