import { ResumeEditPage } from '@/pages';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ResumeEditPage id={params.id} />;
}
