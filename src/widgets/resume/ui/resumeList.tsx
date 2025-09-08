'use client';
import { useResumeList } from '@/entities';
import { Card } from '@/shared/ui/Card';
import { useRouter } from 'next/navigation';

export function ResumeList() {
  // 데이터 가져오기 훅 사용
  const { data, isLoading, error } = useResumeList();

  //라우터
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading resumes</div>;
  return (
    <div>
      <Card title="이력서 목록">
        <div></div>
      </Card>
    </div>
  );
}
