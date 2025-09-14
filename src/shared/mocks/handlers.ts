import {
  coverLetterHandlers,
  interviewQuestionsHandlers,
  resumeHandlers,
  userHandlers,
} from '@/entities';

import {
  improveCoverLetterHandlers,
  loginGoogleHandler,
  saveCoverLetterHandler,
} from '@/features';

export const handlers = [
  ...coverLetterHandlers,
  ...resumeHandlers,
  ...interviewQuestionsHandlers,
  ...improveCoverLetterHandlers,
  ...saveCoverLetterHandler,
  ...loginGoogleHandler,
  ...userHandlers,
];
