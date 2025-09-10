export const interviewQuestionsQueryKeys = {
  list: (coverLetterId: number) =>
    ['interviewQuestions', 'list', coverLetterId] as const,
} as const;
