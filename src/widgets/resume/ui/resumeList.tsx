'use client';
import { useResumeList } from '@/entities';
import { useRouter } from 'next/navigation';

export function ResumeList() {
  // 데이터 가져오기 훅 사용
  const { data, isLoading, error } = useResumeList();

  //라우터
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading resumes</div>;
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl p-4">
        <h3>이력서 목록</h3>
        <div>123</div>
      </div>
    </div>
  );
}
