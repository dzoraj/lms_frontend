import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { LoginService } from '../../service/loginService/login.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../service/notification-service/notification.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatTabsModule,
    MatCardModule,
    MatProgressBarModule,
    RouterLink
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentDto: any | null = null;
  notifications: any[] = [];
  upcomingExams: any[] = [];  
  loading = false;
  error: string | null = null;

  private readonly PASS_THRESHOLD_60 = 31;

  constructor(
    private dynamic: DynamicService,
    private loginService: LoginService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    const studentId = this.getLoggedStudentId();
    if (!studentId) {
      this.error = 'Student ID not found in JWT token.';
      return;
    }

    this.loadDashboard(studentId);
    this.loadUpcomingExams(studentId);

    this.dynamic.getById<any>('notifications/student', studentId)
      .subscribe(list => {
        this.notifications = list;
      });
  }

  private getLoggedStudentId(): number | null {
    const user = this.loginService.getUser();
    return user?.id ?? null;
  }

  private calculateGrade(points: number): number | null {
    if (points < this.PASS_THRESHOLD_60) return null;
    if (points <= 36) return 6;
    if (points <= 42) return 7;
    if (points <= 48) return 8;
    if (points <= 54) return 9;
    return 10;
  }

  private loadDashboard(studentId: number): void {
    this.loading = true;
    this.error = null;

    this.dynamic.getById<any>('students/dashboard', studentId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (dashboard) => {
          const attempts = dashboard?.examAttempts ?? [];
          const grouped: Record<string, { total: number; tests: number[] }> = {};

          attempts.forEach((att: any) => {
            const key = (att.subjectId ?? att.subjectName) as string;
            const pts = Number(att.points ?? 0);
            if (!grouped[key]) grouped[key] = { total: 0, tests: [] };
            grouped[key].total += pts;
            grouped[key].tests.push(pts);
          });

          dashboard.examAttempts = attempts.map((att: any) => {
            const key = (att.subjectId ?? att.subjectName) as string;
            const info = grouped[key];
            const totalPoints = info.total;
            const subjectPassed =
              totalPoints >= this.PASS_THRESHOLD_60 &&
              info.tests.every((t) => t >= 10);
            const testPassed = att.points >= 10;
            return { ...att, totalPoints, subjectPassed, testPassed };
          });

          if (dashboard?.passedExams?.length) {
            dashboard.passedExams = dashboard.passedExams.map((pe: any) => {
              const key = (pe.subjectId ?? pe.subjectName) as string;
              const subjectInfo = grouped[key];
              let pts: number = Number(pe.points ?? 0);
              if ((!pts || pts === 0) && subjectInfo) pts = subjectInfo.total;
              const subjectPassed =
                subjectInfo &&
                subjectInfo.total >= this.PASS_THRESHOLD_60 &&
                subjectInfo.tests.every((t) => t >= 10);
              const grade = subjectPassed ? this.calculateGrade(pts) : null;
              return { ...pe, points: pts, grade: grade ?? 'Fail' };
            });

            const validGrades: number[] = dashboard.passedExams
              .map((pe: any) => (typeof pe.grade === 'number' ? pe.grade : null))
              .filter((g: number | null): g is number => g !== null && g >= 6 && g <= 10);

            dashboard.averageGrade =
              validGrades.length > 0
                ? (
                    validGrades.reduce((a: number, b: number) => a + b, 0) /
                    validGrades.length
                  ).toFixed(2)
                : null;
          } else {
            dashboard.averageGrade = null;
          }

          this.studentDto = dashboard;
        },
        error: (err) => {
          console.error('Failed to load student dashboard', err);
          this.error = err?.error?.message || err?.message || 'Failed to load student dashboard';
        },
      });
  }

  private loadUpcomingExams(studentId: number): void {
    this.dynamic.getById<any>('students/upcoming-exams', studentId)
      .subscribe({
        next: (list) => {
          this.upcomingExams = list.map((exam: any) => ({
            ...exam,
            applied: exam.applied ?? false
          }));
        },
        error: (err) => {
          console.error('Failed to load upcoming exams', err);
        }
      });
  }

  applyForExam(evaluationId: number): void {
    const activeEnrollmentId = this.studentDto?.enrollments?.[0]?.id;
    if (!activeEnrollmentId) {
      this.error = 'No active enrollment found.';
      return;
    }

    const payload = {
      studentInYearId: activeEnrollmentId,
      knowledgeEvaluationId: evaluationId
    };

    this.dynamic.create<any>('exam-applications', payload)
      .subscribe({
        next: () => {
          const exam = this.upcomingExams.find((e) => e.id === evaluationId);
          if (exam) exam.applied = true; 
          alert('Successfully applied for exam.');
        },
        error: (err) => {
          console.error(err);
          this.error = err?.error?.message || 'Failed to apply for exam';
        }
      });
  }
}
