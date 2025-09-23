export interface User {
  memberId: number;
  email: string;
  name: string;
  picture?: string;
  role: 'USER' | 'ADMIN' | 'ROOT';
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    member: User;
    note: string;
  };
  errorCode: string;
  canRetry: boolean;
  timestamp: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  timestamp: string;
  message?: string;
}

export interface TokenUsage {
  success: boolean;
  message: string;
  data: {
    remainingTokens: number; // 현재 남은 토큰 수
    maxTokens: number; // 최대 토큰 수
    nextRefillTime: string; // 다음 리필 시간 (ISO 8601 형식)
    refillAmount: number; // 리필 수량
  };
  errorCode: string | null;
  canRetry: boolean | null;
  timestamp: string; // ISO 8601 형식
}
