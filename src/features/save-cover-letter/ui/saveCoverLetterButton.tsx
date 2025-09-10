'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { useModalStore } from '@/shared';
import { useSaveCoverLetter } from '../model';
import { TitleInputModal } from '@/widgets/coverLetter/ui/TitleInputModal';
import { SaveCompleteModal } from '@/widgets/coverLetter/ui/SaveCompleteModal';

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
  const router = useRouter();
  const { open, close } = useModalStore();
  const { mutate: saveCoverLetter, isPending } = useSaveCoverLetter();

  const handleSaveClick = () => {
    const defaultTitle = getDefaultTitle();

    open(
      <TitleInputModal
        onSave={handleTitleSave}
        onCancel={close}
        defaultTitle={defaultTitle}
      />,
    );
  };

  const handleTitleSave = (title: string) => {
    saveCoverLetter(
      {
        title,
        content: data.content,
        jobField: data.jobField,
        experienceYears: data.experienceYears,
        isAiImproved: data.isAiImproved || false,
      },
      {
        onSuccess: () => {
          close();
          open(
            <SaveCompleteModal
              onInterviewQuestions={handleInterviewQuestions}
              onLater={handleLater}
            />,
          );
        },
      },
    );
  };

  const handleInterviewQuestions = () => {
    close();
    router.push('/interview-questions');
  };

  const handleLater = () => {
    close();
  };

  // 현재 날짜를 기본 제목으로 생성
  const getDefaultTitle = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `자기소개서_${year}_${month}_${day}`;
  };

  return (
    <Button
      onClick={handleSaveClick}
      disabled={disabled || isPending}
      loading={isPending}
      variant="primary"
      className={className}
    >
      저장하기
    </Button>
  );
}
