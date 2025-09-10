import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useLoadingStore } from '@/shared';

interface UseCustomMutationArgs<TVariables, TResult, TError> {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  invalidateQueryKeys?: Array<Array<string | number | object>>;
  mutationOptions?: UseMutationOptions<TResult, TError, TVariables>;
  successMessage?: string;
  loadingType?: 'toast' | 'global' | 'none'; // 로딩 표시 방식 선택
}

interface MutationContext {
  toastId?: string;
}

export const useCustomMutation = <TVariables, TResult, TError = Error>(
  args: UseCustomMutationArgs<TVariables, TResult, TError>,
) => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoadingStore();
  const {
    mutationFn,
    invalidateQueryKeys,
    mutationOptions,
    successMessage,
    loadingType = 'toast', // 기본값은 toast
  } = args;

  return useMutation<TResult, TError, TVariables, MutationContext>({
    mutationFn,
    ...mutationOptions,
    onMutate: (variables) => {
      // 기존 onMutate가 있다면 실행
      if (mutationOptions?.onMutate) {
        mutationOptions.onMutate(variables);
      }

      // 로딩 타입에 따른 처리
      if (loadingType === 'toast') {
        const toastId = toast.loading('응답을 기다리는중...');
        return { toastId };
      } else if (loadingType === 'global') {
        setLoading(true, '30~40초 정도 소요될 수 있습니다.');
      }

      return {};
    },
    onSuccess: (data, variables, context) => {
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }

      // 로딩 타입에 따른 처리
      if (loadingType === 'toast' && successMessage) {
        toast.success(successMessage, { id: context?.toastId });
      } else if (loadingType === 'global') {
        setLoading(false);
        if (successMessage) {
          toast.success(successMessage);
        }
      } else if (loadingType === 'none' && successMessage) {
        toast.success(successMessage);
      }
    },
    onError: (error: TError, variables, context) => {
      if (mutationOptions?.onError) {
        mutationOptions.onError(error, variables, context);
      }

      // 서버 에러 응답 형식에 맞게 메시지 추출
      let errorMessage = '알 수 없는 에러입니다';

      if (error && typeof error === 'object') {
        const errorObj = error as any;

        // 서버에서 오는 구체적인 메시지 우선 사용
        if (errorObj.message) {
          errorMessage = errorObj.message;
        }
        // 상태 코드별 특별 처리
        else if (errorObj.status === 429) {
          errorMessage = '사용 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        } else if (errorObj.status === 401) {
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
        } else if (errorObj.status === 403) {
          errorMessage = '권한이 없습니다.';
        } else if (errorObj.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }

      // 로딩 타입에 따른 에러 처리
      if (loadingType === 'toast') {
        toast.error(errorMessage, { id: context?.toastId });
      } else if (loadingType === 'global') {
        setLoading(false);
        toast.error(errorMessage);
      } else if (loadingType === 'none') {
        toast.error(errorMessage);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (mutationOptions?.onSettled) {
        mutationOptions.onSettled(data, error, variables, context);
      }

      // 글로벌 로딩 정리
      if (loadingType === 'global') {
        setLoading(false);
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
