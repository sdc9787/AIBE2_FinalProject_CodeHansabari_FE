import { clientFetch } from '@/shared';

interface saveCoverLetter {
  title: string;
  content: string;
  jobField: string;
  experienceYears: number;
  isAiImproved: boolean;
}

export async function saveCoverLetter(data: saveCoverLetter) {
  return await clientFetch.post('/api/v1/cover-letters', data);
}
