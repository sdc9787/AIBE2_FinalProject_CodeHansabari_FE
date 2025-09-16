import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useLoadingStore } from '@/shared';
import { fetchUsageToken } from '@/entities/user/api';

// 범용 레코드 타입 (any 사용 금지 대응)
type UnknownRecord = Record<string, unknown>;

// API 에러 형태 정의
export interface ApiError {
  status?: number;
  message?: string;
  error?: string;
  errorCode?: string;
  timestamp?: string;
  errors?: Record<string, string | string[]>;
  body?: UnknownRecord; // clientFetch에서 err.body로 던지는 경우 지원
  [key: string]: unknown;
}

interface UseCustomMutationArgs<TVariables, TResult, TError> {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  invalidateQueryKeys?: Array<Array<string | number | object>>;
  mutationOptions?: UseMutationOptions<TResult, TError, TVariables>;
  successMessage?: string;
  loadingType?: 'toast' | 'global' | 'none'; // 로딩 표시 방식 선택
  requireTokenCheck?: boolean; // if true, perform a preflight token check before mutation
  tokenPreflightStrategy?: 'cache' | 'fresh'; // 'cache' uses cached usageTokens, 'fresh' fetches latest
  usageToken?: number;
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
    requireTokenCheck = false,
    tokenPreflightStrategy = 'cache',
    usageToken = 1,
  } = args;

  // wrap the provided mutationFn to run an optional preflight token check
  const wrappedMutationFn = async (variables: TVariables) => {
    if (requireTokenCheck && loadingType === 'global') {
      try {
        const cached = queryClient.getQueryData<any>(['usageTokens']);
        let remaining: number | null = null;
        if (tokenPreflightStrategy === 'cache') {
          if (
            cached &&
            cached.data &&
            typeof cached.data.remainingTokens === 'number'
          ) {
            remaining = cached.data.remainingTokens;
          } else if (cached && typeof cached.remainingTokens === 'number') {
            // support earlier select behavior where select returns inner data
            remaining = cached.remainingTokens;
          }
          // if cache miss, fallback to fresh check
          if (remaining == null) {
            const fresh = await fetchUsageToken();
            remaining = fresh?.data?.remainingTokens ?? 0;
          }
        } else {
          // fresh fetch
          const fresh = await fetchUsageToken();
          remaining = fresh?.data?.remainingTokens ?? 0;
        }

        if (typeof remaining !== 'number' || remaining < usageToken) {
          throw new Error('토큰이 부족합니다.');
        }
      } catch (e) {
        // rethrow to allow useMutation onError handling to show toast
        throw e;
      }
    }

    return mutationFn(variables);
  };

  return useMutation<TResult, TError, TVariables, MutationContext>({
    mutationFn: wrappedMutationFn,
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
      const errAny = error as unknown as ApiError | UnknownRecord;

      // support different thrown shapes: parsed body thrown directly, or Error with body
      let candidateBody: unknown;
      if (errAny && typeof errAny === 'object' && errAny !== null) {
        // prefer explicit body field if present
        candidateBody =
          'body' in errAny && (errAny as ApiError).body
            ? (errAny as ApiError).body
            : errAny;
      }

      if (candidateBody != null) {
        if (typeof candidateBody === 'string' && candidateBody.trim()) {
          errorMessage = candidateBody;
        } else if (typeof candidateBody === 'object') {
          const cb = candidateBody as UnknownRecord;
          if (typeof cb['message'] === 'string') {
            errorMessage = String(cb['message']);
          } else if (typeof cb['error'] === 'string') {
            errorMessage = String(cb['error']);
          } else if (cb['errors'] && typeof cb['errors'] === 'object') {
            const errs = cb['errors'] as Record<string, unknown>;
            const rawVals = Object.values(errs) as unknown[];
            const flattened = (
              rawVals.flat ? rawVals.flat() : rawVals
            ) as unknown[];
            errorMessage = flattened.map(String).join(', ');
          }
        }
      } else if (
        errAny &&
        typeof errAny === 'object' &&
        typeof (errAny as UnknownRecord)['message'] === 'string'
      ) {
        errorMessage = String((errAny as UnknownRecord)['message']);
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
