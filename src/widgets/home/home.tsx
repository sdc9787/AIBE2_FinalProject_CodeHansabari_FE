'use client';

import Link from 'next/link';
import { useUserStore } from '@/shared';

const features = [
  {
    emoji: '🤖',
    title: 'AI 기반 자동 분석',
    description:
      '300여 개 IT기업 자소서를 학습한 AI가 당신의 자기소개서를 100가지 관점에서 분석하고 실시간으로 개선점을 제안합니다.',
  },
  {
    emoji: '✏️',
    title: '실시간 첨삭 서비스',
    description:
      '글을 쓰는 동시에 AI가 문체, 구조, 내용을 실시간으로 첨삭해주고, 챗봇을 통한 추가 상담도 받을 수 있습니다.',
  },
  {
    emoji: '❓',
    title: '맞춤형 예상질문',
    description:
      '작성한 자기소개서를 바탕으로 면접에서 나올 수 있는 질문들을 예측하고 답변 가이드까지 제공합니다.',
  },
  {
    emoji: '📄',
    title: '프로급 이력서 작성',
    description:
      '다양한 템플릿으로 전문적인 이력서를 작성하고 실시간 미리보기를 통해 완성도 높은 이력서를 만들어보세요.',
  },
];

export function Home() {
  const { user, isAuthenticated } = useUserStore();

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 pt-32 pb-20 text-center text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          {isAuthenticated && user ? (
            // 로그인된 사용자용 히어로
            <>
              <h1 className="mb-5 text-5xl leading-tight font-extrabold md:text-6xl">
                안녕하세요, {user.name}님!
                <br />
                오늘도 함께 성장해요
              </h1>
              <p className="mb-10 text-xl font-light opacity-90 md:text-2xl">
                AI와 함께 완벽한 자기소개서와 이력서를
                <br />
                작성하고 면접을 준비해보세요
              </p>

              <div className="flex flex-col justify-center gap-5 md:flex-row">
                <Link
                  href="/cover-letter"
                  className="rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-indigo-600"
                >
                  자기소개서 작성하기
                </Link>
                <Link
                  href="/resume"
                  className="rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-indigo-600"
                >
                  이력서 작성하기
                </Link>
                <Link
                  href="/interview-questions"
                  className="rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-indigo-600"
                >
                  면접 연습하기
                </Link>
              </div>
            </>
          ) : (
            // 비로그인 사용자용 히어로
            <>
              <h1 className="mb-5 text-5xl leading-tight font-extrabold md:text-6xl">
                AI가 도와주는
                <br />
                완벽한 자기소개서
              </h1>
              <p className="mb-10 text-xl font-light opacity-90 md:text-2xl">
                인공지능 기반 분석과 첨삭으로
                <br />
                취업 성공률을 높여보세요
              </p>

              <div className="flex flex-col justify-center gap-5 md:flex-row">
                <Link
                  href="/auth"
                  className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 transition-transform hover:scale-105"
                >
                  Google로 시작하기
                </Link>
                <Link
                  href="#features"
                  className="rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-indigo-600"
                >
                  기능 둘러보기
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-800 md:text-5xl">
            왜 CV Mento를 선택해야 할까요?
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-10 text-center shadow-xl"
              >
                <span className="mb-5 block text-5xl">{feature.emoji}</span>
                <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소셜로그인 / 대시보드 섹션 */}
      <section
        id="auth"
        className="relative bg-gradient-to-br from-gray-600 to-gray-800 py-24 text-center text-white"
      >
        {/* 기울어진 배경 요소 */}
        <div className="absolute inset-x-0 -top-12 h-24 origin-top-left -skew-y-1 transform bg-gray-50" />

        <div className="relative z-10 mx-auto max-w-2xl px-5">
          {isAuthenticated && user ? (
            // 로그인된 사용자용 대시보드 섹션
            <>
              <h2 className="mb-5 text-4xl font-bold md:text-5xl">
                나의 작업 공간
              </h2>
              <p className="mb-10 text-xl opacity-90">
                AI와 함께 더 나은 취업 준비를 시작해보세요
                <br />
                모든 기능을 자유롭게 이용할 수 있습니다
              </p>

              <div className="flex flex-col gap-4 md:flex-row md:justify-center">
                <Link
                  href="/cover-letter"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition-transform hover:scale-105"
                >
                  <span className="text-blue-500">📝</span>
                  자기소개서 관리
                </Link>
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition-transform hover:scale-105"
                >
                  <span className="text-green-500">📄</span>
                  이력서 작성
                </Link>
                <Link
                  href="/interview-questions"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition-transform hover:scale-105"
                >
                  <span className="text-purple-500">❓</span>
                  면접 연습
                </Link>
              </div>
            </>
          ) : (
            // 비로그인 사용자용 로그인 섹션
            <>
              <h2 className="mb-5 text-4xl font-bold md:text-5xl">
                지금 시작해보세요!
              </h2>
              <p className="mb-10 text-xl opacity-90">
                Google 계정으로 간편하게 로그인하고
                <br />
                AI의 도움으로 더 나은 자기소개서를 완성해보세요
              </p>

              <Link
                href="/auth"
                className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition-transform hover:scale-105"
              >
                <span className="text-blue-500">🔵</span>
                Google로 시작하기
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
