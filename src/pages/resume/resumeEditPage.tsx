'use client';

import { ResumeDocument } from '@/widgets';

interface ResumeEditPageProps {
  id: string;
}

export function ResumeEditPage({ id }: ResumeEditPageProps) {
  const resumeId = parseInt(id, 10);
  return <ResumeDocument />;
}
