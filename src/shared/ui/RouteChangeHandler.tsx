'use client';

import { useRouteChangeReset } from '@/shared';

/**
 * 페이지 이동 시 글로벌 상태를 리셋하는 컴포넌트
 * 레이아웃에서 사용하여 전역적으로 적용
 */
export const RouteChangeHandler = () => {
  useRouteChangeReset();
  return null;
};
