'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui';
import { useCrawlList, type CrawlItem } from '@/entities/admin';
import { useStartCrawl } from '@/features/start-crawl';
import { useDeleteCrawl } from '@/features/delete-crawl';

export const AdminCrawl = () => {
  const [selectedCrawls, setSelectedCrawls] = useState<number[]>([]);

  // 데이터 훅
  const {
    data: crawlList,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchCrawlList,
  } = useCrawlList();
  const startCrawlMutation = useStartCrawl();
  const deleteAllCrawlMutation = useDeleteCrawl();

  const handleStartCrawl = () => startCrawlMutation.mutate({});

  const handleDeleteAllCrawl = (crawlId?: number) => {
    const confirmMessage = crawlId
      ? '선택한 크롤링 데이터를 삭제하시겠습니까?'
      : '모든 크롤링 데이터를 삭제하시겠습니까?';
    if (!window.confirm(confirmMessage)) return;
    if (crawlId) deleteAllCrawlMutation.mutate({ id: crawlId });
    else deleteAllCrawlMutation.mutate({});
    setSelectedCrawls([]);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">크롤링 관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            자기소개서 크롤링 결과를 조회하고, 새로운 크롤링을 시작하거나
            데이터를 관리할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleStartCrawl}
            disabled={startCrawlMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {startCrawlMutation.isPending ? '크롤링 중...' : '크롤링 시작'}
          </Button>

          <Button
            onClick={() => handleDeleteAllCrawl()}
            disabled={
              !crawlList ||
              crawlList.length === 0 ||
              deleteAllCrawlMutation.isPending
            }
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            전체 삭제
          </Button>
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="rounded-lg border border-[#e2e8f0] bg-white">
        {isListLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">크롤링 목록을 불러오는 중...</p>
          </div>
        ) : listError ? (
          <div className="p-8 text-center">
            <p className="mb-4 text-red-600">
              크롤링 목록을 불러오는데 실패했습니다.
            </p>
            <Button
              onClick={() => refetchCrawlList()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              다시 시도
            </Button>
          </div>
        ) : !crawlList || crawlList.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">크롤링된 데이터가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* 헤더(데스크톱) */}
            <div className="hidden grid-cols-12 bg-[#fafbfc] p-3 text-sm font-medium text-gray-700 md:grid">
              <div className="col-span-1">ID</div>
              <div className="col-span-5">내용 미리보기</div>
              <div className="col-span-2">생성일</div>
              <div className="col-span-2">수정일</div>
              <div className="col-span-1 text-center">상태</div>
              <div className="col-span-1 text-center">삭제</div>
            </div>

            {/* 항목 리스트: 모바일은 카드형, 데스크톱은 그리드 행 */}
            <div>
              {crawlList?.map((crawl: CrawlItem) => (
                <div
                  key={crawl.coverLetterId}
                  className="flex flex-col border-b px-3 py-3 hover:bg-gray-50 md:grid md:grid-cols-12 md:items-center"
                >
                  <div className="font-mono text-sm text-gray-800 md:col-span-1">
                    {crawl.coverLetterId}
                  </div>

                  <div className="text-sm text-gray-700 md:col-span-5">
                    <div className="truncate" title={crawl.text}>
                      {crawl.text.length > 120
                        ? `${crawl.text.substring(0, 120)}...`
                        : crawl.text}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 md:col-span-2">
                    {new Date(crawl.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="text-sm text-gray-600 md:col-span-2">
                    {new Date(crawl.updatedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <span className="mx-auto flex w-14 items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 md:col-span-1">
                    완료
                  </span>

                  <Button
                    onClick={() => handleDeleteAllCrawl(crawl.coverLetterId)}
                    className="mx-auto w-14 rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 md:col-span-1"
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
