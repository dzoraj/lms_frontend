import { Teacher } from '../users/teacher.model';
import { StudyYear } from './study-year.model';

export interface StudyProgram {
  id: number;
  name: string;
  leader?: Teacher | null; 
  studyYear?: StudyYear[]; 
}
