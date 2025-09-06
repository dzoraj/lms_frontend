import { LearningOutcome } from '../subject/learning-outcome.model';

export interface EducationalGoal {
  id?: number;
  description?: string;
  learningOutcomes?: LearningOutcome[];
}
