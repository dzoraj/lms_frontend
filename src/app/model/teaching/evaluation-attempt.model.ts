import { KnowledgeEvaluation } from '../teaching/knowledge-evaluation.model';
import { StudentInYear } from '../student/student-in-year.model';

export interface EvaluationAttempt {
  id?: number;
  points?: number | null;
  note?: string | null;
  latest: boolean;
  evaluation?: KnowledgeEvaluation | null;
  studentInYear?: StudentInYear | null;
}
