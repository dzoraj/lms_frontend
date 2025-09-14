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

  private loadDashboard(studentId: number): void {
    this.loading = true;
    this.error = null;

    this.dynamic.getById<any>('students/dashboard', studentId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (dashboard) => {
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
