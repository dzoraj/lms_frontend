
import { EvaluationInstrument } from './evaluation-instrument.model';
import { EvaluationType } from './evualuation-type.model';
import { CourseRealization } from '../subject/course-realization.model';
import { LearningOutcome } from '../subject/learning-outcome.model';

export interface KnowledgeEvaluation {
  id?: number;
  startTime?: string | null;  // ISO date string
  endTime?: string | null;    // ISO date string
  points?: number | null;
  evaluationInstrument?: EvaluationInstrument | null;
  evaluationType?: EvaluationType | null;
  courseRealization?: CourseRealization | null;
  learningOutcomes?: LearningOutcome[];
}
