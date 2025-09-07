export interface User {
  memberId: number;
  email: string;
  name: string;
  picture?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  timestamp: string;
  message?: string;
}
