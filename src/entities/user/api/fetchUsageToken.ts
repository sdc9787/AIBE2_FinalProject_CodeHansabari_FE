import { clientFetch } from '@/shared/api';
import { TokenUsage } from '../model';

export async function fetchUsageToken(): Promise<TokenUsage> {
  const response = await clientFetch.get<TokenUsage>('/api/v1/usage/tokens');
  return response;
}
