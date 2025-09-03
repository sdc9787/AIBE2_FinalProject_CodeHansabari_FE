import { Button } from '@/shared/ui';
import { useSaveCoverLetter } from '../model';

interface SaveCoverLetterData {
  title: string;
  content: string;
  jobField: string;
  experienceYears: number;
  isAiImproved?: boolean;
}

interface SaveCoverLetterButtonProps {
  data: SaveCoverLetterData;
  disabled?: boolean;
  className?: string;
}

export function SaveCoverLetterButton({
  data,
  disabled,
  className,
}: SaveCoverLetterButtonProps) {
  const { mutate: saveCoverLetter, isPending } = useSaveCoverLetter();

  const handleSave = () => {
    saveCoverLetter({
      title: data.title,
      content: data.content,
      jobField: data.jobField,
      experienceYears: data.experienceYears,
      isAiImproved: data.isAiImproved || false,
    });
  };

  return (
    <Button
      onClick={handleSave}
      disabled={disabled || isPending}
      loading={isPending}
      variant="primary"
      className={className}
    >
      저장하기
    </Button>
  );
}
