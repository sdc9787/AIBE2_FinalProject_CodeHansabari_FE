import { coverLetterHandlers } from '@/entities';
import { resumeHandlers } from '@/entities/resume';
import { loginGoogleHandler } from '@/features';
import { improveCoverLetterHandlers } from '@/features/improve-cover-letter';
import { saveCoverLetterHandler } from '@/features/save-cover-letter';
import { aiSuggestResumeHandlers } from '@/features/ai-suggest-resume';

export const handlers = [
  ...coverLetterHandlers,
  ...resumeHandlers,
  ...improveCoverLetterHandlers,
  ...saveCoverLetterHandler,
  ...aiSuggestResumeHandlers,
  ...loginGoogleHandler,
];
