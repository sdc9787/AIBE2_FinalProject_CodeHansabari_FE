'use client';

import React from 'react';
import { useAdminMemberStatistics } from '@/entities/admin';

export const AdminMemberStatistics = () => {
  const { data, isLoading, error, refetch } = useAdminMemberStatistics();

  const stats = data;

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
    <div className="flex h-full w-full flex-col items-start justify-start gap-6 overflow-y-scroll p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-black">회원 통계</h1>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>

      {/* 전체 회원 수 */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          전체 회원 수
        </h2>
        <div className="text-3xl font-bold text-blue-600">
          {(stats.totalMembers || 0).toLocaleString()}명
        </div>
      </div>

      {/* 상태별 통계 */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          상태별 회원 수
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-sm font-medium text-green-600">활성</div>
            <div className="text-2xl font-bold text-green-700">
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

          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-sm font-medium text-yellow-600">비활성</div>
            <div className="text-2xl font-bold text-yellow-700">
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

          <div className="rounded-lg bg-red-50 p-4">
            <div className="text-sm font-medium text-red-600">정지</div>
            <div className="text-2xl font-bold text-red-700">
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

      {/* 역할별 통계 */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          역할별 회원 수
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-600">일반 사용자</div>
            <div className="text-2xl font-bold text-gray-700">
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

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm font-medium text-blue-600">관리자</div>
            <div className="text-2xl font-bold text-blue-700">
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

          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-sm font-medium text-purple-600">
              최고 관리자
            </div>
            <div className="text-2xl font-bold text-purple-700">
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

      {/* 가입 통계 */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          신규 가입 통계
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-indigo-50 p-4">
            <div className="text-sm font-medium text-indigo-600">오늘 가입</div>
            <div className="text-2xl font-bold text-indigo-700">
              {(stats.todayNewMembers || 0).toLocaleString()}명
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-sm font-medium text-emerald-600">
              이번 달 가입
            </div>
            <div className="text-2xl font-bold text-emerald-700">
              {(stats.monthlyNewMembers || 0).toLocaleString()}명
            </div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 (미래 확장용) */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">요약 정보</h2>
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalMembers
                ? (
                    ((stats.activeMembers || 0) / stats.totalMembers) *
                    100
                  ).toFixed(1)
                : '0.0'}
              %
            </div>
            <div className="text-sm text-gray-600">활성화율</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-green-600">
              {stats.todayNewMembers || 0}
            </div>
            <div className="text-sm text-gray-600">오늘 신규</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(stats.adminRoleCount || 0) + (stats.rootRoleCount || 0)}
            </div>
            <div className="text-sm text-gray-600">총 관리자</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-orange-600">
              {stats.monthlyNewMembers || 0}
            </div>
            <div className="text-sm text-gray-600">월간 신규</div>
          </div>
        </div>
      </div>
    </div>
  );
};
