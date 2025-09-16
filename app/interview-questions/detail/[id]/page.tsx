import { InterviewQuestionsDetailPage } from '@/pages';

export default async function InterviewQuestions({ params }: { params: any }) {
  // Next.js requires awaiting `params` before accessing its properties.
  // Await here, then forward a Promise to the shared page component which
  // itself expects `params: Promise<{ id: string }>`.
  const resolved = await params;
  const id = resolved?.id;

  return <InterviewQuestionsDetailPage params={Promise.resolve({ id })} />;
}
