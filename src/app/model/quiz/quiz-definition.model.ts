import { QuizQuestion } from "./quiz-question.model";

export interface QuizDefinition {
  id?: number;
  knowledgeEvaluationId: number;
  title?: string;
  instructions?: string;
  maxPoints: number;
  active?: boolean;
  questions: QuizQuestion[];
}