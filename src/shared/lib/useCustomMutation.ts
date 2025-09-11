import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useLoadingStore } from '@/shared';

// API 에러 형태 정의
export interface ApiError {
  status?: number;
  message?: string;
  error?: string;
  errorCode?: string;
  timestamp?: string;
  errors?: Record<string, string | string[]>;
  body?: any; // clientFetch에서 err.body로 던지는 경우 지원
  [key: string]: any;
}

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

export const useCustomMutation = <TVariables, TResult, TError = ApiError>(
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

      // 서버 에러 응답 형식에서 message만 추출하여 표시
      let errorMessage = '알 수 없는 에러입니다';
      const errAny = error as unknown as ApiError | Record<string, any>;

      // support different thrown shapes: parsed body thrown directly, or Error with body
      const candidateBody =
        errAny && typeof errAny === 'object'
          ? (errAny.body ?? errAny)
          : undefined;

      if (candidateBody) {
        if (typeof candidateBody === 'string' && candidateBody.trim()) {
          errorMessage = candidateBody;
        } else if (
          typeof candidateBody === 'object' &&
          candidateBody.message &&
          typeof candidateBody.message === 'string'
        ) {
          errorMessage = candidateBody.message;
        } else if (
          typeof candidateBody === 'object' &&
          candidateBody.error &&
          typeof candidateBody.error === 'string'
        ) {
          errorMessage = candidateBody.error;
        } else if (
          typeof candidateBody === 'object' &&
          candidateBody.errors &&
          typeof candidateBody.errors === 'object'
        ) {
          const vals =
            Object.values(candidateBody.errors).flat?.() ??
            Object.values(candidateBody.errors);
          errorMessage = vals.map(String).join(', ');
        }
      } else if (
        (errAny as any)?.message &&
        typeof (errAny as any).message === 'string'
      ) {
        errorMessage = (errAny as any).message;
      }

      // 로딩 타입에 따른 에러 처리 (토스트는 여기서만 출력)
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
