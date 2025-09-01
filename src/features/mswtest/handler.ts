import { http, HttpResponse } from 'msw';
const mockCreateGoalResponse = {
  httpStatusCode: 200,
  errorCode: null,
  data: {
    id: 1,
    title: '',
  },
  errorMessage: null,
  fieldErrors: [],
};
export const sidebarCreateGoalHandler = [
  http.post('/api/goals', () => {
    return HttpResponse.json(mockCreateGoalResponse);
  }),
];
