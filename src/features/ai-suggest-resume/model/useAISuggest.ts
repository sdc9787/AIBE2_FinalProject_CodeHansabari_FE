import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAISuggest } from '@/entities/resume';
import { AISuggestRequest } from '@/entities/resume';

export const useAISuggestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AISuggestRequest) => fetchAISuggest(data),
  });
};
