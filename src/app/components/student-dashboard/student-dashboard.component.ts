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
import { StudentNotificationsComponent } from "../student-notification/student-notification.component";
import { QuizTakeComponent } from '../quiz-take/quiz-take.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatTabsModule,
    MatCardModule,
    MatProgressBarModule,
    RouterLink,
    StudentNotificationsComponent,
    QuizTakeComponent
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

  takingKeId: number | null = null;
  activeEnrollmentId: number | null = null;

  constructor(
    private dynamic: DynamicService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    const studentId = this.getLoggedStudentId();
    if (!studentId) {
      this.error = 'Student ID not found in JWT token.';
      return;
    }
    this.loadDashboard(studentId);
    this.loadUpcomingExams(studentId);
    this.dynamic.getById<any>('notifications/student', studentId).subscribe(list => { this.notifications = list; });
  }

  private getLoggedStudentId(): number | null {
    const user = this.loginService.getUser();
    return user?.id ?? null;
  }

  private applyAttemptedFlags(): void {
    const ids = new Set<number>((this.studentDto?.examAttempts ?? []).map((a: any) => a.evaluationId).filter((x: any) => x != null));
    this.upcomingExams = (this.upcomingExams ?? []).map((e: any) => ({ ...e, attempted: ids.has(e.id) }));
  }

  private backfillAttemptTypes(): void {
    const map = new Map<number, any>((this.upcomingExams ?? []).map((e: any) => [e.id, e]));
    if (this.studentDto?.examAttempts?.length) {
      this.studentDto.examAttempts = this.studentDto.examAttempts.map((a: any) => {
        const src = map.get(a.evaluationId);
        const t = a.type ?? a.evaluationType ?? src?.type ?? src?.evaluationType ?? null;
        const instr = a.instrument ?? a.evaluationInstrument ?? src?.instrument ?? src?.evaluationInstrument ?? null;
        return { ...a, type: t, instrument: instr };
      });
    }
  }

  private loadDashboard(studentId: number): void {
    this.loading = true;
       this.error = null;
    this.dynamic.getById<any>('students/dashboard', studentId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (dashboard) => {
          this.studentDto = dashboard;
          this.activeEnrollmentId = dashboard?.enrollments?.[0]?.id ?? null;
          this.applyAttemptedFlags();
          this.backfillAttemptTypes();
        },
        error: (err) => {
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
          this.applyAttemptedFlags();
          this.backfillAttemptTypes();
        },
        error: () => {}
      });
  }

  applyForExam(evaluationId: number): void {
    const activeEnrollmentId = this.studentDto?.enrollments?.[0]?.id;
    if (!activeEnrollmentId) {
      this.error = 'No active enrollment found.';
      return;
    }
    const payload = { studentInYearId: activeEnrollmentId, knowledgeEvaluationId: evaluationId };
    this.dynamic.create<any>('exam-applications', payload)
      .subscribe({
        next: () => {
          const exam = this.upcomingExams.find((e) => e.id === evaluationId);
          if (exam) exam.applied = true;
          alert('Successfully applied for exam.');
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to apply for exam';
        }
      });
  }

  canStart(exam: any): boolean {
    const now = Date.now();
    const start = exam?.startTime ? new Date(exam.startTime).getTime() : -Infinity;
    const end = exam?.endTime ? new Date(exam.endTime).getTime() : Infinity;
    const windowOk = start <= now && now <= end;
    return !!exam?.applied && windowOk && !exam?.attempted;
  }

  windowStatus(exam: any): 'before' | 'during' | 'after' {
    const now = Date.now();
    const start = exam?.startTime ? new Date(exam.startTime).getTime() : -Infinity;
    const end = exam?.endTime ? new Date(exam.endTime).getTime() : Infinity;
    if (now < start) return 'before';
    if (now > end) return 'after';
    return 'during';
  }

  startQuiz(exam: any): void {
    if (!this.activeEnrollmentId) { this.error = 'No active enrollment found.'; return; }
    this.takingKeId = exam.id;
  }

  onFinished(_: any): void {
    const id = this.takingKeId;
    this.takingKeId = null;
    if (id != null) {
      const ex = this.upcomingExams.find(e => e.id === id);
      if (ex) ex.attempted = true;
    }
    const sid = this.getLoggedStudentId(); if (sid) this.loadDashboard(sid);
  }

  cancelQuiz(): void { this.takingKeId = null; }

  private truthyFlag(v: any): boolean {
    if (v === true) return true;
    if (v === false) return false;
    if (v === 1 || v === '1') return true;
    if (v === 0 || v === '0') return false;
    if (typeof v === 'string') {
      const s = v.toLowerCase();
      if (s === 'true' || s === 'yes' || s === 'y') return true;
      if (s === 'false' || s === 'no' || s === 'n') return false;
    }
    return !!v;
  }

  displayLatest(att: any): string {
    const v =
      att?.latest ??
      att?.isLatest ??
      att?.latestAttempt ??
      att?.latestFlag ??
      att?.latest_mark ??
      null;
    return this.truthyFlag(v) ? 'Yes' : 'No';
  }
  getSubj(att: any[] | null | undefined, subjectId: number | null | undefined) {
  if (!att || subjectId == null) return null;
  for (let i = 0; i < att.length; i++) {
    const s = att[i];
    if (s && s.subjectId === subjectId) return s;
  }
  return null;
}
}

