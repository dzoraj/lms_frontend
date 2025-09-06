import { StudyProgram } from './study-program.model';
import { Subject } from '../subject/subject.model';

export interface StudyYear {
  id: number;
  enrollmentDate: string; // ISO 8601 date (e.g., "2025-06-09")
  studyProgram?: StudyProgram | null; // nullable
  subjects?: Subject[]; // optional
}
