'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 스크롤 애니메이션 설정
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
      observerRef.current?.observe(card);
    });

    // 부드러운 스크롤 설정
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', function (e: Event) {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('href');
        if (href) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      });
    });

    // 헤더 스크롤 효과
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('bg-white/98', 'shadow-lg');
          header.classList.remove('bg-white/95');
        } else {
          header.classList.add('bg-white/95');
          header.classList.remove('bg-white/98', 'shadow-lg');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* 헤더 */}
      <header className="header fixed top-0 right-0 left-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            CV Mento
          </div>
          <div className="flex gap-4">
            <a
              href="#auth"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Google로 시작하기
            </a>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 pt-32 pb-20 text-center text-white">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='80' cy='80' r='1' fill='rgba(255,255,255,0.1)'/%3E%3Ccircle cx='40' cy='60' r='1' fill='rgba(255,255,255,0.1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grain)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <h1 className="animate-fade-in mb-5 text-5xl leading-tight font-extrabold md:text-6xl">
            AI가 도와주는
            <br />
            완벽한 자기소개서
          </h1>
          <p className="animate-fade-in mb-10 text-xl font-light opacity-90 md:text-2xl">
            인공지능 기반 분석과 첨삭으로
            <br />
            취업 성공률을 높여보세요
          </p>

          <div className="animate-fade-in mt-10 flex flex-col justify-center gap-5 md:flex-row">
            <a
              href="#auth"
              className="inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Google로 시작하기
            </a>
            <a
              href="#features"
              className="inline-block rounded-full border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-indigo-600"
            >
              기능 둘러보기
            </a>
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-800 md:text-5xl">
            왜 CV Mento를 선택해야 할까요?
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="feature-card group relative overflow-hidden rounded-3xl bg-white p-10 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-50 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
              <span className="animate-float mb-5 block text-5xl">🤖</span>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                AI 기반 자동 분석
              </h3>
              <p className="leading-relaxed text-gray-600">
                300여 개 IT기업 자소서를 학습한 AI가 당신의 자기소개서를 100가지
                관점에서 분석하고 실시간으로 개선점을 제안합니다.
              </p>
            </div>

            <div
              className="feature-card group relative overflow-hidden rounded-3xl bg-white p-10 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-50 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
              <span
                className="animate-float mb-5 block text-5xl"
                style={{ animationDelay: '1s' }}
              >
                ✏️
              </span>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                실시간 첨삭 서비스
              </h3>
              <p className="leading-relaxed text-gray-600">
                글을 쓰는 동시에 AI가 문체, 구조, 내용을 실시간으로 첨삭해주고,
                챗봇을 통한 추가 상담도 받을 수 있습니다.
              </p>
            </div>

            <div
              className="feature-card group relative overflow-hidden rounded-3xl bg-white p-10 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-50 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
              <span
                className="animate-float mb-5 block text-5xl"
                style={{ animationDelay: '2s' }}
              >
                ❓
              </span>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                맞춤형 예상질문
              </h3>
              <p className="leading-relaxed text-gray-600">
                작성한 자기소개서를 바탕으로 면접에서 나올 수 있는 질문들을
                예측하고 답변 가이드까지 제공합니다.
              </p>
            </div>

            <div
              className="feature-card group relative overflow-hidden rounded-3xl bg-white p-10 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-50 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
              <span
                className="animate-float mb-5 block text-5xl"
                style={{ animationDelay: '3s' }}
              >
                📄
              </span>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                프로급 이력서 작성
              </h3>
              <p className="leading-relaxed text-gray-600">
                다양한 템플릿으로 전문적인 이력서를 작성하고 실시간 미리보기를
                통해 완성도 높은 이력서를 만들어보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 소셜로그인 섹션 */}
      <section
        id="auth"
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-24 text-center text-white"
      >
        {/* 기울어진 배경 요소 */}
        <div className="absolute -top-12 right-0 left-0 h-24 origin-top-left -skew-y-1 transform bg-gray-50"></div>

        <div className="relative z-10 mx-auto max-w-2xl px-5">
          <h2 className="mb-5 text-4xl font-bold md:text-5xl">
            지금 시작해보세요!
          </h2>
          <p className="mb-10 text-xl opacity-90">
            Google 계정으로 간편하게 로그인하고
            <br />
            AI의 도움으로 더 나은 자기소개서를 완성해보세요
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-blue-500">🔵</span>
              Google로 시작하기
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
