import { clientFetch } from '@/shared/api';
import { UserResponse } from '../model';

export async function fetchUserMe(): Promise<UserResponse> {
  const response = await clientFetch.get<UserResponse>('/auth/me');
  return response;
}
