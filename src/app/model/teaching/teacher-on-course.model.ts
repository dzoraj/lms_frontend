import { Teacher } from '../users/teacher.model';
import { TeachingType } from './teaching-type.model';
import { CourseRealization } from '../subject/course-realization.model';
import { Notification } from '../notification.model';

export interface TeacherOnCourse {
  id?: number;
  numberOfClasses?: number | null;
  teacher?: Teacher | null;
  teachingType?: TeachingType | null;
  courseRealization?: CourseRealization | null;
  notifications?: Notification[];
}
