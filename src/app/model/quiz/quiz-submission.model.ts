export interface QuizSubmission {
  knowledgeEvaluationId: number;
  studentInYearId: number;
  answers: { questionId: number; selectedOptionIds: number[] }[];
}