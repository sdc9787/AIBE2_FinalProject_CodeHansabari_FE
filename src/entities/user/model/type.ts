export interface User {
  memberId: number;
  email: string;
  name: string;
  picture?: string;
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
