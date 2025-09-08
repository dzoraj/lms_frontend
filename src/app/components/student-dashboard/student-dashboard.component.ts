// src/app/student-dashboard/student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { LoginService } from '../../service/loginService/login.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentDto: any | null = null;
  courseAttendances: any[] = [];
  studyHistory: any[] = [];
  averageGrade: number | null = null;
  totalEspb: number = 0;
  loading = false;
  error: string | null = null;

  constructor(private dynamic: DynamicService, private loginService: LoginService) {}

  ngOnInit(): void {
    const studentId = this.getLoggedStudentId();
    if (!studentId) {
      this.error = 'Student ID not found in JWT token.';
      return;
    }
    this.loadDashboard(studentId);
  }

  private getLoggedStudentId(): number | null {
    const user = this.loginService.getUser();
    if (!user) return null;
    return user.id ?? null;
  }

  private loadDashboard(studentId: number): void {
    this.loading = true;
    this.error = null;

    this.dynamic.getById<any>(`students/dashboard`, studentId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (dashboard) => {
          this.studentDto = dashboard;
          this.courseAttendances = dashboard?.currentCourses ?? [];
          this.studyHistory = dashboard?.studyHistory ?? [];
          this.averageGrade = dashboard?.averageGrade ?? null;
          this.totalEspb = dashboard?.totalEcts ?? 0;
        },
        error: (err) => {
          console.error('Failed to load student dashboard', err);
          this.error = err?.error?.message || err?.message || 'Failed to load student dashboard';
        }
      });
  }

  registerExam(ca: any): void {
    if (!ca) return;
    const studentId = this.getLoggedStudentId();
    if (!studentId) {
      this.error = 'Student ID not found, cannot register exam.';
      return;
    }

    ca.__registering = true;
    const body = { courseAttendanceId: ca.id, studentId };

    this.dynamic.create<any>('exams/register', body)
      .pipe(finalize(() => { ca.__registering = false; }))
      .subscribe({
        next: () => this.loadDashboard(studentId),
        error: (err) => {
          console.error('Failed to register exam', err);
          this.error = err?.error?.message || err?.message || 'Failed to register exam';
        }
      });
  }

  canRegister(ca: any): boolean {
    if (!ca) return false;
    const grade = ca?.konacnaOcena ?? ca?.finalGrade ?? ca?.grade;
    return grade === undefined || grade === null;
  }

  formatNotificationDate(n: any): string {
    if (!n || !n.date) return '';
    const d = new Date(n.date);
    return isNaN(d.getTime()) ? n.date : d.toLocaleString();
  }
}
