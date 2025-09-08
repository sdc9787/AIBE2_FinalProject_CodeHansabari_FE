'use client';

import { useRouter } from 'next/navigation';
import { ResumeList } from '@/widgets/resume';

export function ResumePage() {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push('/resume/new');
  };

  const handleEdit = (resumeId: number) => {
    router.push(`/resume/${resumeId}`);
  };

  return <ResumeList onCreateNew={handleCreateNew} onEdit={handleEdit} />;
}
