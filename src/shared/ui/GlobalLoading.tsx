'use client';

import { useLoadingStore } from '@/shared';

export function GlobalLoading() {
  const { isLoading, loadingMessage } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          {/* 로딩 스피너 */}
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
          </div>
          {/* 로딩 메시지 */}
          <p className="text-lg font-medium text-gray-800">{loadingMessage}</p>
          {/* 로딩 점들 */}
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
