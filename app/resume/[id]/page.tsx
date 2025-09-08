import { ResumeEditPage } from '@/pages/resume';

interface ResumeEditProps {
  params: {
    id: string;
  };
}

export default function ResumeEdit({ params }: ResumeEditProps) {
  return <ResumeEditPage id={params.id} />;
}
