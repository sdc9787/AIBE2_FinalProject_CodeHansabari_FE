import { ResumeEditPage } from '@/pages';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  // Next.js requires awaiting params in server components when using dynamic params
  const awaitedParams = (await params) as PageProps['params'];
  return <ResumeEditPage id={awaitedParams.id} />;
}
