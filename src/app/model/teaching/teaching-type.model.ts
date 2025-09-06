import { TeacherOnCourse } from './teacher-on-course.model';
import { TeachingSession } from './teaching-session.model';

export interface TeachingType {
  id?: number;
  name?: string;
  courses?: TeacherOnCourse[];    
  teachingSessions?: TeachingSession[]; 
}
