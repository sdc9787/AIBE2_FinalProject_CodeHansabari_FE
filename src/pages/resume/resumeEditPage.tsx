'use client';

import { ResumeDocumentEdit } from '@/widgets/resume/ui/resumeEdit';

interface ResumeEditPageProps {
  id: string;
}

export function ResumeEditPage({ id }: ResumeEditPageProps) {
  const resumeId = parseInt(id, 10);
  return <ResumeDocumentEdit resumeId={resumeId} />;
}
