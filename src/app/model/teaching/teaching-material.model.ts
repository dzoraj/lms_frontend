import { LearningOutcome } from '../subject/learning-outcome.model';
import { File } from '../file.model';

export interface TeachingMaterial {
  id?: number;
  name?: string | null;
  authors?: string | null;   // comma-separated authors string
  yearOfPublication?: string | null; // ISO date string (LocalDateTime in Java)
  learningOutcome?: LearningOutcome | null;
  files?: File[];
}
