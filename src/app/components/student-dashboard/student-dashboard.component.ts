import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { LoginService } from '../../service/loginService/login.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentDto: any | null = null;
  courseAttendances: any[] = [];
  studyHistory: any[] = [];            
  studyHistoryCourses: any[] = [];     
  averageGrade: number | null = null;
  totalEspb: number = 0;
  totalPoints: number = 0;

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
        console.log('Full dashboard payload:', dashboard);

        this.studentDto = dashboard;
        this.courseAttendances = dashboard?.currentCourses ?? [];
        this.studyHistory = dashboard?.studyHistory ?? [];                  
        this.studyHistoryCourses = dashboard?.studyHistoryCourses ?? [];   

        if (dashboard?.averageGrade != null) {
          this.averageGrade = dashboard.averageGrade;
        } else {
          const grades = this.studyHistoryCourses
            .filter(s => s?.finalGrade != null)
            .map(s => Number(s.finalGrade));
          this.averageGrade = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : null;
        }

        if (dashboard?.totalEspb != null) {
          this.totalEspb = dashboard.totalEspb;
        } else {
          this.totalEspb = this.studyHistoryCourses
            .filter(s => s?.espb != null && s?.finalGrade != null)
            .reduce((sum, s) => sum + (Number(s.espb) || 0), 0);
        }

        this.totalPoints = this.studyHistoryCourses
          .filter(s => s?.finalPoints != null)
          .reduce((sum, s) => sum + (Number(s.finalPoints) || 0), 0);
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
    if (!n) return '';
    const dateStr = n.time_posted ?? n.date ?? n.time ?? n.createdAt;
    if (!dateStr) return n?.time_posted ?? n?.date ?? '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString();
  }
}
