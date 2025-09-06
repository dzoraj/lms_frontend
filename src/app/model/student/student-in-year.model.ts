import { Student } from '../users/student.model';
import { StudyYear } from './study-year.model';

export interface StudentInYear {
  id: number;
  enrollmentDate: string; 
  indexNumber: string;
  student: Student;
  studyYear?: StudyYear | null; 
}
