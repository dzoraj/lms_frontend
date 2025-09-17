import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { LoginService } from '../../service/loginService/login.service';
import { QuestionService } from '../../service/question/question.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { GenericCrudComponent } from '../generic-crud/generic-crud.component';
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';
import { QuizComponent } from "../quiz/quiz.component";

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    MatTabsModule,
    GenericCrudComponent,
    GenericTableComponent,
    QuizComponent
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  teacherDto: any | null = null;
  subjects: any[] = [];
  evalInstrQuestions$!: Observable<any[]>;
  tableDisplayedColumns = ['name', 'file'];
  tableColumnLabels = { name: 'Instrument', file: 'File' };
  tableHiddenKeys = ['id', 'deleted', 'evaluations'];
  tableColumnRenderers = { file: (row: any) => row?.file?.name || '—' };

  studentFilters = {
    name: '',
    indexNumber: '',
    enrollmentYear: null as number | null,
    minAvg: null as number | null,
    maxAvg: null as number | null,
  };
  students: any[] = [];
  studentsLoading = false;

  tableStudentCols = ['name', 'email', 'indexNumber', 'enrollmentYear', 'averageGrade', 'espb'];
  tableStudentLabels = {
    name: 'Student',
    email: 'Email',
    indexNumber: 'Index',
    enrollmentYear: 'Enrollment Year',
    averageGrade: 'Avg',
    espb: 'ESPB'
  };

  selectedStudentProfile: any | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  globalSearch = false;

  syllabus: any[] = [];
  selectedSubject: any | null = null;
  newOutcome: string = '';
  syllabusLoading = false;

  sessions: any[] = [];
  selectedSession: any | null = null;
  sessionOutcomes: any[] = [];
  sessionLoading = false;
  selectedOutcomes: number[] = [];

  notifications: any[] = [];
  newNotification: { title: string; content: string } = { title: '', content: '' };
  notificationsLoading = false;
  examApplications: any[] = [];
  selectedExamApp: any | null = null;
  examAppsLoading = false;

  gradeForm = { points: 0, note: '' };
  gradeSuccess: string | null = null;

  quizSelectedSubjectId: number | null = null;
  quizMode: 'editor' | 'take' = 'editor';
  quizStudentInYearId?: number;
  keOptions: Array<{ id: number; label: string }> = [];
  selectedKeId: number | null = null;

  constructor(
    private dynamic: DynamicService,
    private loginService: LoginService,
    public questionService: QuestionService
  ) {}

  ngOnInit(): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) {
      this.error = 'Teacher ID not found in JWT token.';
      return;
    }
    this.loadDashboard(teacherId);
    this.evalInstrQuestions$ = this.questionService.getEvaluationInstrumentQuestions();
  }

  private getLoggedTeacherId(): number | null {
    const user = this.loginService.getUser();
    return user?.id ?? null;
  }

  private loadDashboard(teacherId: number): void {
    this.loading = true;
    this.error = null;
    this.dynamic.getById<any>('teacher-dashboard', teacherId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (dashboard) => {
          this.teacherDto = dashboard;
          this.subjects = dashboard?.subjects ?? [];
        },
        error: (err) => {
          this.error = err?.error?.message || err?.message || 'Failed to load teacher dashboard';
        }
      });
  }

  searchStudents(): void {
    const params = new URLSearchParams();
    const f = this.studentFilters;
    if (f.name?.trim()) params.set('name', f.name.trim());
    if (f.indexNumber?.trim()) params.set('indexNumber', f.indexNumber.trim());
    if (f.enrollmentYear) params.set('enrollmentYear', String(f.enrollmentYear));
    if (f.minAvg != null) params.set('minAvg', String(f.minAvg));
    if (f.maxAvg != null) params.set('maxAvg', String(f.maxAvg));
    this.studentsLoading = true;
    let path: string;
    if (this.globalSearch) {
      path = `students/search?${params.toString()}`;
    } else {
      const teacherId = this.getLoggedTeacherId();
      if (!teacherId) return;
      path = `teacher/${teacherId}/students?${params.toString()}`;
    }
    this.dynamic.getByPath<any[]>(path)
      .pipe(finalize(() => this.studentsLoading = false))
      .subscribe({
        next: (list) => {
          this.students = list ?? [];
          this.selectedStudentProfile = null;
        },
        error: () => {}
      });
  }

  clearStudentFilters(): void {
    this.studentFilters = { name: '', indexNumber: '', enrollmentYear: null, minAvg: null, maxAvg: null };
    this.students = [];
    this.selectedStudentProfile = null;
  }

  openStudentProfile(row: any): void {
    if (!row?.id) return;
    this.selectedStudentProfile = null;
    this.dynamic.getByPath<any>(`students/${row.id}/profile`)
      .subscribe({
        next: (prof) => this.selectedStudentProfile = prof,
        error: () => {}
      });
  }

  loadSyllabus(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.syllabusLoading = true;
    this.dynamic
      .getByPath<any[]>(`teacher/${teacherId}/subjects/${subjectId}/syllabus`)
      .pipe(finalize(() => (this.syllabusLoading = false)))
      .subscribe({
        next: (list) => {
          this.syllabus = list ?? [];
          this.selectedSubject = this.subjects.find((s) => s.id === subjectId) || null;
        },
        error: () => {}
      });
  }

  saveOutcome(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId || !this.newOutcome.trim()) return;
    const payload = { description: this.newOutcome };
    this.dynamic
      .create<any>(`teacher/${teacherId}/subjects/${subjectId}/syllabus`, payload)
      .subscribe({
        next: (res) => {
          this.syllabus.push(res);
          this.newOutcome = '';
        },
        error: () => {}
      });
  }

  deleteOutcome(subjectId: number, outcomeId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.dynamic
      .delete(`teacher/${teacherId}/subjects/${subjectId}/syllabus`, outcomeId)
      .subscribe({
        next: () => {
          this.syllabus = this.syllabus.filter(lo => lo.id !== outcomeId);
        },
        error: () => {}
      });
  }

  loadSessions(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.selectedSubject = this.subjects.find((s) => s.id === subjectId) || null;
    this.sessionLoading = true;
    this.dynamic
      .getByPath<any[]>(`teachingSession?subjectId=${subjectId}`)
      .pipe(finalize(() => (this.sessionLoading = false)))
      .subscribe({
        next: (list) => {
          this.sessions = list ?? [];
          this.selectedSession = null;
          this.sessionOutcomes = [];
        },
        error: () => {}
      });
  }

  loadSessionOutcomes(subjectId: number, sessionId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId || !subjectId) return;
    this.dynamic
      .getByPath<any[]>(`teacher/${teacherId}/subjects/${subjectId}/sessions/${sessionId}/outcomes`)
      .subscribe({
        next: (list) => {
          this.sessionOutcomes = list ?? [];
          this.selectedSession = this.sessions.find((s) => s.id === sessionId) || null;
          this.selectedOutcomes = this.sessionOutcomes.map((lo) => lo.id);
        },
        error: () => {}
      });
  }

  assignOutcomesToSession(subjectId: number, sessionId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.dynamic
      .create<any>(`teacher/${teacherId}/subjects/${subjectId}/sessions/${sessionId}/outcomes`, this.selectedOutcomes)
      .subscribe({
        next: (session) => {
          this.sessionOutcomes = session.learningOutcomeIds ?? [];
          this.successMessage = 'Outcomes successfully assigned!';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: () => {}
      });
  }

  toggleOutcomeSelection(outcomeId: number): void {
    if (this.selectedOutcomes.includes(outcomeId)) {
      this.selectedOutcomes = this.selectedOutcomes.filter((id) => id !== outcomeId);
    } else {
      this.selectedOutcomes.push(outcomeId);
    }
  }

  loadNotifications(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.notificationsLoading = true;
    this.dynamic
      .getByPath<any[]>(`teacher/${teacherId}/subjects/${subjectId}/notifications`)
      .pipe(finalize(() => (this.notificationsLoading = false)))
      .subscribe({
        next: (list) => {
          this.notifications = list ?? [];
          this.selectedSubject = this.subjects.find((s) => s.id === subjectId) || null;
        },
        error: () => {}
      });
  }

  createNotification(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId || !this.newNotification.title.trim()) return;
    const payload = { title: this.newNotification.title, content: this.newNotification.content };
    this.dynamic
      .create<any>(`teacher/${teacherId}/subjects/${subjectId}/notifications`, payload)
      .subscribe({
        next: (res) => {
          this.notifications.unshift(res);
          this.newNotification = { title: '', content: '' };
          this.successMessage = 'Notification posted!';
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: () => {}
      });
  }

  loadExamApplications(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.examAppsLoading = true;
    this.dynamic
      .getByPath<any[]>(`teacher/${teacherId}/subjects/${subjectId}/examApplications`)
      .pipe(finalize(() => this.examAppsLoading = false))
      .subscribe({
        next: (apps) => {
          this.examApplications = apps ?? [];
          this.selectedSubject = this.subjects.find(s => s.id === subjectId) || null;
        },
        error: () => {}
      });
  }

  openGradeEntry(app: any): void {
    this.selectedExamApp = app;
    this.gradeForm = { points: 0, note: '' };
    this.gradeSuccess = null;
  }

  submitGrade(app: any): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    if (this.gradeForm.points <= 0) {
      alert("Points must be greater than 0.");
      return;
    }
    this.dynamic
      .create<any>(
        `teacher/${teacherId}/examApplication/${app.id}/grade?points=${this.gradeForm.points}&note=${encodeURIComponent(this.gradeForm.note || '')}`,
        {}
      )
      .subscribe({
        next: () => {
          this.gradeSuccess = 'Grade successfully saved!';
          setTimeout(() => (this.gradeSuccess = null), 3000);
          this.selectedExamApp = null;
          this.loadExamApplications(this.selectedSubject!.id);
        },
        error: (err) => {
          alert(err?.error?.message || "Failed to save grade");
        }
      });
  }

  onSelectQuizSubject(subjectId: number): void {
    this.quizSelectedSubjectId = subjectId;
    this.selectedKeId = null;
    this.keOptions = [];
    this.fetchKeOptionsFromExamApps(subjectId);
  }

  private fetchKeOptionsFromExamApps(subjectId: number): void {
    const teacherId = this.getLoggedTeacherId();
    if (!teacherId) return;
    this.dynamic
      .getByPath<any[]>(`teacher/${teacherId}/subjects/${subjectId}/examApplications`)
      .subscribe({
        next: (apps) => {
          const seen = new Set<number>();
          const options: Array<{ id: number; label: string }> = [];
          (apps ?? []).forEach((a: any) => {
            const id: number | undefined =
              a?.knowledgeEvaluationId ??
              a?.evaluationId ??
              a?.knowledgeEvaluation?.id ??
              a?.keId;
            if (!id || seen.has(id)) return;
            seen.add(id);
            const dateStr = a?.examDate ? new Date(a.examDate).toLocaleString() : '';
            const typeStr = a?.evaluationType || a?.evaluationTypeName || 'Evaluation';
            const pts = a?.points ?? a?.maxPoints;
            const label = [typeStr, dateStr, pts != null ? `${pts} pts` : ''].filter(Boolean).join(' — ');
            options.push({ id, label: label || `KE #${id}` });
          });
          this.keOptions = options.sort((a, b) => a.label.localeCompare(b.label));
          if (this.keOptions.length >= 1) this.selectedKeId = this.keOptions[0].id;
        },
        error: () => {
          this.keOptions = [];
          this.selectedKeId = null;
        }
      });
  }
}
