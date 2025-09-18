'use client';

import React from 'react';
import { useAdminMemberStatistics } from '@/entities/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export const AdminMemberStatistics = () => {
  const { data, isLoading, error, refetch } = useAdminMemberStatistics();

  const stats = data;

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // 상태별 회원 수 도넛 차트 데이터
  const statusChartData = stats
    ? {
        labels: ['활성', '비활성', '정지'],
        datasets: [
          {
            data: [
              stats.activeMembers || 0,
              stats.inactiveMembers || 0,
              stats.suspendedMembers || 0,
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  // 역할별 회원 수 바 차트 데이터
  const roleChartData = stats
    ? {
        labels: ['일반 사용자', '관리자', '최고 관리자'],
        datasets: [
          {
            label: '회원 수',
            data: [
              stats.userRoleCount || 0,
              stats.adminRoleCount || 0,
              stats.rootRoleCount || 0,
            ],
            backgroundColor: [
              'rgba(107, 114, 128, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(147, 51, 234, 0.8)',
            ],
            borderColor: [
              'rgba(107, 114, 128, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(147, 51, 234, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-gray-500">통계 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <span className="text-red-500">
          통계 데이터를 불러오는데 실패했습니다.
        </span>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-gray-500">통계 데이터가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-scroll p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-black">회원 통계</h1>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
              <span className="text-xs text-blue-600">전체</span>
              <span className="text-sm font-semibold text-blue-700">
                {(stats.totalMembers || 0).toLocaleString()}명
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
              <span className="text-xs text-green-600">활성화율</span>
              <span className="text-sm font-semibold text-green-700">
                {stats.totalMembers
                  ? (
                      ((stats.activeMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5">
              <span className="text-xs text-indigo-600">오늘 신규</span>
              <span className="text-sm font-semibold text-indigo-700">
                {stats.todayNewMembers || 0}명
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <span className="text-xs text-emerald-600">이번 달 신규</span>
              <span className="text-sm font-semibold text-emerald-700">
                {stats.monthlyNewMembers || 0}명
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>

      {/* 기본 정보 */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2"></div>

      {/* 상태별/역할별 통계 */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-800">
            신규 가입 통계
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-indigo-50 p-3">
              <div className="text-sm font-medium text-indigo-600">
                오늘 가입
              </div>
              <div className="text-xl font-bold text-indigo-700">
                {(stats.todayNewMembers || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-indigo-500">
                {stats.totalMembers
                  ? (
                      ((stats.todayNewMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <div className="text-sm font-medium text-emerald-600">
                이번 달 가입
              </div>
              <div className="text-xl font-bold text-emerald-700">
                {(stats.monthlyNewMembers || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-emerald-500">
                {stats.totalMembers
                  ? (
                      ((stats.monthlyNewMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
          </div>
        </div>
        {/* 상태별 회원 수 */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            상태별 회원 수
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-50 p-3">
              <div className="text-xs font-medium text-green-600">활성</div>
              <div className="text-lg font-bold text-green-700">
                {(stats.activeMembers || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-green-500">
                {stats.totalMembers
                  ? (
                      ((stats.activeMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3">
              <div className="text-xs font-medium text-yellow-600">비활성</div>
              <div className="text-lg font-bold text-yellow-700">
                {(stats.inactiveMembers || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-yellow-500">
                {stats.totalMembers
                  ? (
                      ((stats.inactiveMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <div className="text-xs font-medium text-red-600">정지</div>
              <div className="text-lg font-bold text-red-700">
                {(stats.suspendedMembers || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-red-500">
                {stats.totalMembers
                  ? (
                      ((stats.suspendedMembers || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
          </div>
        </div>

        {/* 역할별 회원 수 */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            역할별 회원 수
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-600">
                일반 사용자
              </div>
              <div className="text-lg font-bold text-gray-700">
                {(stats.userRoleCount || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-gray-500">
                {stats.totalMembers
                  ? (
                      ((stats.userRoleCount || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="text-xs font-medium text-blue-600">관리자</div>
              <div className="text-lg font-bold text-blue-700">
                {(stats.adminRoleCount || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-blue-500">
                {stats.totalMembers
                  ? (
                      ((stats.adminRoleCount || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <div className="text-xs font-medium text-purple-600">
                최고 관리자
              </div>
              <div className="text-lg font-bold text-purple-700">
                {(stats.rootRoleCount || 0).toLocaleString()}명
              </div>
              <div className="text-xs text-purple-500">
                {stats.totalMembers
                  ? (
                      ((stats.rootRoleCount || 0) / stats.totalMembers) *
                      100
                    ).toFixed(1)
                  : '0.0'}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 상태별 회원 수 도넛 차트 */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            상태별 회원 분포
          </h2>
          {statusChartData && (
            <div className="flex h-60 items-center justify-center">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* 역할별 회원 수 바 차트 */}
        <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-gray-800">
            역할별 회원 분포
          </h2>
          {roleChartData && (
            <div className="h-60">
              <Bar data={roleChartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
