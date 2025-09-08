import { ResumeDetailPage } from '@/pages/resume';

interface ResumeDetailPageProps {
  params: {
    id: string;
  };
}

export default function ResumeDetail({ params }: ResumeDetailPageProps) {
  return <ResumeDetailPage id={params.id} />;
}
