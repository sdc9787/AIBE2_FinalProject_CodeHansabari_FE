'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoadingStore } from '@/shared';

/**
 * 페이지 이동 시 글로벌 로딩 상태를 자동으로 리셋하는 훅
 */
export const useRouteChangeReset = () => {
  const pathname = usePathname();
  const { resetLoading } = useLoadingStore();

  useEffect(() => {
    // 페이지 이동 시 글로벌 로딩 상태 리셋
    resetLoading();
  }, [pathname, resetLoading]);
};
