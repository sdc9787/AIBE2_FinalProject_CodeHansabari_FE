export const mockCoverLetterFeaturesStatistics = {
  success: true,
  message: '조회 성공',
  data: {
    totalCount: 942,
    expressionCount: 320,
    structureCount: 310,
    contentCount: 312,
  },
};

export const mockRawCoverLetterFeature = (id = 1) => ({
  rawCoverLetterFeatureId: id,
  featuresCategory: 'EXPRESSION',
  description: '구체적인 수치를 제시하여 성과를 명확하게 보여줌',
  coverLetterId: 101 + id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const mockCoverLetterFeature = (id = 1) => ({
  coverLetterFeatureId: id,
  featuresCategory: 'EXPRESSION',
  description: '문장이 간결하고 핵심 메시지가 명확함',
  duplicateCount: 9,
  representativeCoverLetterId: 101 + id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
