import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createResume } from '@/entities/resume';
import { CreateResumeRequest } from '@/entities/resume';

export const useCreateResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeRequest) => createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeList'] });
    },
  });
};
