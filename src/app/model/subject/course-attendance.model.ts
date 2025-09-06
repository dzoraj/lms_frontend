import { CourseRealization } from './course-realization.model';
import { Student } from '../users/student.model';

export interface CourseAttendance {
  id: number;
  konacnaOcena?: number;
  courseRealization?: CourseRealization;
  student?: Student;
}
