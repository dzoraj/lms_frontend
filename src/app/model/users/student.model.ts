import { Address } from "../address.model";
import { StudentInYear } from "../student/student-in-year.model";
import { CourseAttendance } from "../subject/course-attendance.model";
import { RegisteredUser } from "./registered-user.model";


export interface Student extends RegisteredUser {
  courseAttendances: CourseAttendance[];
  studentInYear: StudentInYear[];
  address: Address;
}
