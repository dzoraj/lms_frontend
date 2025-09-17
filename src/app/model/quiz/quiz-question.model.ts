import { QuizOption } from "./quiz-option.model";
import { QuestionType } from "./quiz-type.model";

export interface QuizQuestion {
  id?: number;
  text: string;
  type: QuestionType;
  points: number;
  orderIndex?: number;
  options: QuizOption[];
}