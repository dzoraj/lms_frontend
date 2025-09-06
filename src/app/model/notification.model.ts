
import { File } from './file.model';
import { CourseRealization } from './subject/course-realization.model';
import { TeacherOnCourse } from './teaching/teacher-on-course.model';

export interface Notification {
  id: number;
  title: string;
  content: string;
  timePosted: string; 
  courseRealization?: CourseRealization;
  teacherOnCourse?: TeacherOnCourse;
  attachments?: File[];
}
