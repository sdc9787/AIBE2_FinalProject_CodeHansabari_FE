'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/shared/ui';
import { useCrawlList, type CrawlItem } from '@/entities/admin';
import { clientFetch } from '@/shared/api';
import { useStartCrawl } from '@/features/start-crawl';
import { useDeleteCrawl } from '@/features/delete-crawl';

export const AdminCrawl = () => {
  const [selectedCrawls, setSelectedCrawls] = useState<number[]>([]);

  // 커스텀 훅 사용
  const {
    data: crawlList,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchCrawlList,
  } = useCrawlList();
  const startCrawlMutation = useStartCrawl();
  const deleteAllCrawlMutation = useDeleteCrawl();

  // 크롤링 시작 핸들러
  const handleStartCrawl = () => {
    startCrawlMutation.mutate({});
  };

  // 삭제 핸들러 id값이 있으면 개별 삭제
  const handleDeleteAllCrawl = (crawlId?: number) => {
    if (crawlId) {
      if (window.confirm('선택한 크롤링 데이터를 삭제하시겠습니까?')) {
        deleteAllCrawlMutation.mutate({ id: crawlId });
        setSelectedCrawls([]);
      }
    } else {
      if (window.confirm('모든 크롤링 데이터를 삭제하시겠습니까?')) {
        deleteAllCrawlMutation.mutate({});
        setSelectedCrawls([]);
      }
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          크롤링 및 특정 관리
        </h2>
        <p className="text-gray-600">
          자기소개서 크롤링 데이터를 관리하고 새로운 크롤링을 실행할 수
          있습니다.
        </p>
      </div>

      {/* 크롤링 제어 버튼 영역 */}
      <div className="mb-6 flex gap-3">
        <Button
          onClick={handleStartCrawl}
          disabled={startCrawlMutation.isPending}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
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
          className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
        >
          전체 삭제
        </Button>
      </div>

      {/* 크롤링 목록 테이블 */}
      <div className="overflow-hidden rounded-lg bg-gray-50">
        <div className="border-b bg-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            크롤링 대상 목록
          </h3>
        </div>

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
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              다시 시도
            </Button>
          </div>
        ) : !crawlList || crawlList.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">크롤링된 데이터가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left" />
                  <th className="p-3 text-left font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    내용 미리보기
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    생성일
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    수정일
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    상태 / 작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {crawlList &&
                  crawlList.map((crawl: CrawlItem, index: number) => (
                    <tr
                      key={crawl.coverLetterId}
                      className={`border-b hover:bg-gray-50 ${
                        selectedCrawls.includes(crawl.coverLetterId)
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <td className="p-3" />
                      <td className="p-3 font-mono text-sm">
                        {crawl.coverLetterId}
                      </td>
                      <td className="max-w-md p-3">
                        <div className="truncate" title={crawl.text}>
                          {crawl.text.length > 100
                            ? `${crawl.text.substring(0, 100)}...`
                            : crawl.text}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(crawl.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(crawl.updatedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="flex items-center gap-2 p-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          완료
                        </span>
                        <Button
                          onClick={() =>
                            handleDeleteAllCrawl(crawl.coverLetterId)
                          }
                          className="ml-2 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          삭제
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 통계 정보 */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="font-semibold text-blue-900">전체 크롤링 수</h4>
          <p className="text-2xl font-bold text-blue-700">
            {crawlList?.length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="font-semibold text-green-900">선택된 항목</h4>
          <p className="text-2xl font-bold text-green-700">
            {selectedCrawls.length}
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <h4 className="font-semibold text-purple-900">크롤링 상태</h4>
          <p className="text-2xl font-bold text-purple-700">
            {startCrawlMutation.isPending ? '진행중' : '대기'}
          </p>
        </div>
      </div>
    </div>
  );
};
