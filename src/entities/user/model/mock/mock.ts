import { TokenUsage, UserResponse } from '../type';

export const userInfoMock: UserResponse = {
  success: true,
  message: '요청이 성공적으로 처리되었습니다.',
  data: {
    memberId: 789,
    email: 'user@gmail.com',
    name: '박민수',
    picture: '/images/profile.png',
    role: 'USER',
    isActive: true,
    createdAt: '2024-01-05T11:20:00',
    lastLoginAt: '2024-01-15T18:10:45',
  },
  timestamp: '2024-01-15T18:10:45',
};

export const usageTokenMock: TokenUsage = {
  success: true,
  message: '토큰 사용량 조회 성공',
  data: {
    remainingTokens: 25,
    maxTokens: 40,
    nextRefillTime: '2025-09-12T14:00:00',
    refillAmount: 10,
  },
  errorCode: null,
  canRetry: null,
  timestamp: '2025-09-12T12:30:00',
};
