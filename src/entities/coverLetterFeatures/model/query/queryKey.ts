export const coverLetterFeaturesQueryKeys = {
  statistics: ['coverLetterFeatures', 'statistics'] as const,
  rawList: (page = 0, size = 20, sort?: string) =>
    ['coverLetterFeatures', 'rawList', page, size, sort] as const,
  rawCategory: (category: string, page = 0, size = 20, sort?: string) =>
    ['coverLetterFeatures', 'rawCategory', category, page, size, sort] as const,
  list: (page = 0, size = 20, sort?: string) =>
    ['coverLetterFeatures', 'list', page, size, sort] as const,
  category: (category: string, page = 0, size = 20, sort?: string) =>
    ['coverLetterFeatures', 'category', category, page, size, sort] as const,
};
