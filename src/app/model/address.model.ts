import { Faculty } from './university/faculty.model';
import { University } from './university/university.model';
import { Student } from './users/student.model';
import { Teacher } from './users/teacher.model';

export interface Address {
  id: number;
  address: string;
  number: string;
  city: string;
  country: string;
  student?: Student;
  teacher?: Teacher;
  university?: University;
  faculty?: Faculty;
}
