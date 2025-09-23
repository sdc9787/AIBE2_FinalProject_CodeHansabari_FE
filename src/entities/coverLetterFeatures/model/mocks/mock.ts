// Controlled mock dataset sizes and distributions for testing
const TOTAL_RAW = 50;
const CATEGORY_DISTRIBUTION: Record<string, number> = {
  EXPRESSION: 20,
  STRUCTURE: 15,
  CONTENT: 15,
};

export const mockCoverLetterFeaturesStatistics = {
  success: true,
  message: '조회 성공',
  data: {
    totalCount: TOTAL_RAW,
    expressionCount: CATEGORY_DISTRIBUTION.EXPRESSION,
    structureCount: CATEGORY_DISTRIBUTION.STRUCTURE,
    contentCount: CATEGORY_DISTRIBUTION.CONTENT,
  },
};

export const mockRawCoverLetterFeature = (id = 1, category?: string) => ({
  rawCoverLetterFeatureId: id,
  featuresCategory:
    category ??
    (id % 3 === 1 ? 'EXPRESSION' : id % 3 === 2 ? 'STRUCTURE' : 'CONTENT'),
  description:
    '구체적인 수치를 제시하여 성과를 명확하게 보여줌 - 예시 설명 ' + id,
  coverLetterId: 1000 + id,
  createdAt: new Date(Date.now() - id * 1000 * 60).toISOString(),
  updatedAt: new Date().toISOString(),
});

export const mockCoverLetterFeature = (id = 1, category?: string) => ({
  coverLetterFeatureId: id,
  featuresCategory:
    category ??
    (id % 3 === 1 ? 'EXPRESSION' : id % 3 === 2 ? 'STRUCTURE' : 'CONTENT'),
  description: '문장이 간결하고 핵심 메시지가 명확함 - 대표 문장 ' + id,
  duplicateCount: Math.max(0, 10 - (id % 7)),
  representativeCoverLetterId: 1000 + id,
  createdAt: new Date(Date.now() - id * 1000 * 60).toISOString(),
  updatedAt: new Date().toISOString(),
});

export { TOTAL_RAW, CATEGORY_DISTRIBUTION };
