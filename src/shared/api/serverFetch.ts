// 요청 설정 옵션
interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined | null>; // URL 쿼리 파라미터
  headers?: Record<string, string>; // 추가 HTTP 헤더
}

// 기본 API URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// 기본 HTTP 헤더
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// URL과 쿼리 파라미터를 조합하여 완전한 URL 생성
function buildURL(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

// 서버 환경에서 쿠키를 헤더에 포함하여 요청
async function request<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  config?: RequestConfig & { cookie?: string },
): Promise<T> {
  const url = buildURL(endpoint, config?.params);
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...config?.headers,
  };
  if (config?.cookie) {
    headers['cookie'] = config.cookie;
  }
  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as T;
}

// 서버 사이드 API 호출을 위한 fetch 래퍼
export const serverFetch = {
  get: <T>(endpoint: string, config?: RequestConfig & { cookie?: string }) =>
    request<T>('GET', endpoint, undefined, config),
  post: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig & { cookie?: string },
  ) => request<T>('POST', endpoint, data, config),
  patch: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig & { cookie?: string },
  ) => request<T>('PATCH', endpoint, data, config),
  put: <T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig & { cookie?: string },
  ) => request<T>('PUT', endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestConfig & { cookie?: string }) =>
    request<T>('DELETE', endpoint, undefined, config),
};
