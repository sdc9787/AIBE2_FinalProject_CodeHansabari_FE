'use client';
import { ResumeEdit } from './resumeEdit';

interface ResumeDetailProps {
  id: string;
}

export function ResumeDetail({ id }: ResumeDetailProps) {
  return <ResumeEdit id={Number(id)} />;
}
