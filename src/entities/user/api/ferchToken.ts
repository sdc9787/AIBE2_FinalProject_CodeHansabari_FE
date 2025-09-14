import { clientFetch } from '@/shared/api';
import { TokenUsage } from '../model';

export async function fetchUserMe(): Promise<TokenUsage> {
  const response = await clientFetch.get<TokenUsage>('/api/v1/usage/tokens');
  return response;
}
