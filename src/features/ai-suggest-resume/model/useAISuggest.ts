import { useMutation } from '@tanstack/react-query';
import { fetchAISuggest } from '@/entities/resume';
import { AISuggestRequest } from '@/entities/resume';

export const useAISuggestMutation = () => {
  return useMutation({
    mutationFn: (data: AISuggestRequest) => fetchAISuggest(data),
  });
};
