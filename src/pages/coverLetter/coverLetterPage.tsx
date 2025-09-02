import { CoverLetter } from '@/widgets';

interface CoverLetterPageProps {
  id?: number;
}

export function CoverLetterPage({ id }: CoverLetterPageProps) {
  return <CoverLetter id={id} />;
}
