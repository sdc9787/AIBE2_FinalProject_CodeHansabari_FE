export const mockProcessResponse = {
  success: true,
  message: '전체 특징 처리가 완료되었습니다.',
  data: {
    rawFeaturesCount: 942,
    finalFeaturesCount: 100,
    deduplicationRatio: '89.4%',
    batchSize: 2,
    totalBatches: 157,
    status: 'COMPLETE',
    message: '전체 특징 처리가 완료되었습니다.',
  },
};

export const mockExtractResponse = {
  success: true,
  message: '특징 추출이 완료되었습니다.',
  data: {
    extractedCount: 942,
    batchSize: 2,
    totalBatches: 471,
    status: 'COMPLETE',
  },
};

export const mockDeduplicateResponse = {
  success: true,
  message: '중복 제거가 완료되었습니다.',
  data: {
    finalFeaturesCount: 100,
    perCategory: {
      EXPRESSION: 34,
      STRUCTURE: 33,
      CONTENT: 33,
    },
    status: 'COMPLETE',
  },
};

export const mockErrorResponse = {
  success: false,
  message: '서버 오류가 발생했습니다.',
  data: {},
  errorCode: 'SERVER_ERROR',
  canRetry: true,
  timestamp: new Date().toISOString(),
};
