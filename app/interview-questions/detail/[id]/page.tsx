import { InterviewQuestionsDetail } from '@/widgets';

interface InterviewQuestionsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterviewQuestionsDetailPage({
  params,
}: InterviewQuestionsDetailPageProps) {
  const { id } = await params;
  const coverLetterId = parseInt(id, 10);

  return <InterviewQuestionsDetail coverLetterId={coverLetterId} />;
}
