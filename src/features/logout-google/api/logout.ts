import { clientFetch } from '@/shared/api';

export async function logoutUser(): Promise<{
  success: boolean;
  message?: string;
}> {
  const response = await clientFetch.post('/auth/logout');
  return response;
}
