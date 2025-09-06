import { KnowledgeEvaluation } from '../teaching/knowledge-evaluation.model';
import { TeacherOnCourse } from '../teaching/teacher-on-course.model';
import { TeachingSession } from '../teaching/teaching-session.model';
import { CourseAttendance } from './course-attendance.model';
import { Subject } from './subject.model';


export interface CourseRealization {
  id: number;
  subject?: Subject;
  teachersOnCourse?: TeacherOnCourse[];
  courseAttendances?: CourseAttendance[];
  notifications?: Notification[];
  knowledgeEvaluations?: KnowledgeEvaluation[];
  teachingSessions?: TeachingSession[];
}
