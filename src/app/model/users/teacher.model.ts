import { RegisteredUser } from './registered-user.model';
import { Title } from '../title/title.model';
import { TeacherOnCourse } from '../teaching/teacher-on-course.model';
import { Address } from '../address.model';

export interface Teacher extends RegisteredUser {
  name: string;
  biography: string;
  jmbg: string;
  titles: Title[];
  courses: TeacherOnCourse[];
  address: Address;
}
