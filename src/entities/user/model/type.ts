export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}
