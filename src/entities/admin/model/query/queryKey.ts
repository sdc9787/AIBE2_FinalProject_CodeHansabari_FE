export const adminQueryKeys = {
  resumes: (page: number, size: number) =>
    ['admin', 'resumes', page, size] as const,
  coverLetters: (page: number, size: number) =>
    ['admin', 'coverLetters', page, size] as const,
  crawlList: () => ['admin', 'crawl', 'list'] as const,
  crawlDetail: (id: number) => ['admin', 'crawl', 'detail', id] as const,
  members: (params: any) => ['admin', 'members', params] as const,
  memberDetail: (memberId: number) =>
    ['admin', 'member', 'detail', memberId] as const,
  memberStatistics: () => ['admin', 'member', 'statistics'] as const,
};
