import { StudyYear } from '../student/study-year.model';
import { LearningOutcome } from './learning-outcome.model';

export interface Subject {
  id: number;
  name?: string;
  espb?: number;
  mandatory?: boolean;
  lectureCount?: number;
  labCount?: number;
  otherTeachingForms?: number;
  researchWork?: number;
  otherClasses?: number;
  studyYear?: StudyYear;
  syllabus?: LearningOutcome[];
  subSubjects?: Subject[];
  parentSubject?: Subject;
}
