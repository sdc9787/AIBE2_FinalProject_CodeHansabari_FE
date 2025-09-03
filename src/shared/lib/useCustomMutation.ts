import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface UseCustomMutationArgs<TVariables, TResult, TError> {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  invalidateQueryKeys?: Array<Array<string | number | object>>;
  mutationOptions?: UseMutationOptions<TResult, TError, TVariables>;
  successMessage?: string;
}

interface MutationContext {
  toastId?: string;
}

export const useCustomMutation = <TVariables, TResult, TError = Error>(
  args: UseCustomMutationArgs<TVariables, TResult, TError>,
) => {
  const queryClient = useQueryClient();
  const { mutationFn, invalidateQueryKeys, mutationOptions, successMessage } =
    args;

  return useMutation<TResult, TError, TVariables, MutationContext>({
    mutationFn,
    ...mutationOptions,
    onMutate: (variables) => {
      // 기존 onMutate가 있다면 실행
      if (mutationOptions?.onMutate) {
        mutationOptions.onMutate(variables);
      }

      if (successMessage) {
        const toastId = toast.loading('응답을 기다리는중...');
        return { toastId };
      }
    },
    onSuccess: (data, variables, context) => {
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
      if (successMessage) {
        toast.success(successMessage, { id: context?.toastId });
      }
    },
    onError: (error: TError, variables, context) => {
      if (mutationOptions?.onError) {
        mutationOptions.onError(error, variables, context);
      }
      const errorMessage = (error as any)?.message ?? '알 수 없는 에러입니다';
      toast.error(errorMessage, { id: context?.toastId });
    },
    onSettled: (data, error, variables, context) => {
      if (mutationOptions?.onSettled) {
        mutationOptions.onSettled(data, error, variables, context);
      }

      if (invalidateQueryKeys) {
        invalidateQueryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      // invalidateQueries를 pending 상태로 저장
      // if (invalidateQueryKeys) {
      // pendingInvalidationRef.current = invalidateQueryKeys;
      // }
    },
  });
};
