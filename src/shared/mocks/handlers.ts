import { coverLetterHandlers } from '@/entities';
import { resumeHandlers } from '@/entities/resume';
import { interviewQuestionsHandlers } from '@/entities/interviewQuestions';
import { loginGoogleHandler } from '@/features';
import { improveCoverLetterHandlers } from '@/features/improve-cover-letter';
import { saveCoverLetterHandler } from '@/features/save-cover-letter';

export const handlers = [
  ...coverLetterHandlers,
  ...resumeHandlers,
  ...interviewQuestionsHandlers,
  ...improveCoverLetterHandlers,
  ...saveCoverLetterHandler,
  ...loginGoogleHandler,
];
