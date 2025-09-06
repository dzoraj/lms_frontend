import { CourseRealization } from '../subject/course-realization.model';
import { TeachingType } from '../teaching/teaching-type.model';
import { LearningOutcome } from '../subject/learning-outcome.model';

export interface TeachingSession {
  id?: number;
  startTime?: string | null;
  endTime?: string | null;
  courseRealization?: CourseRealization | null;
  teachingType?: TeachingType | null;
  learningOutcomes?: LearningOutcome[];
}
