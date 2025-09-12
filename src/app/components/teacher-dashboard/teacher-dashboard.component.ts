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

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    MatTabsModule,
    GenericCrudComponent,
    GenericTableComponent
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

  globalSearch = false;

  syllabus: any[] = [];
  selectedSubject: any | null = null;
  newOutcome: string = '';
  syllabusLoading = false;

  constructor(
    private dynamic: DynamicService,
    private loginService: LoginService,
    public questionService: QuestionService
  ) { }

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
        error: (err) => {
          console.error('Student search failed', err);
        }
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
        error: (err) => console.error('Profile load failed', err)
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
        error: (err) => {
          console.error('Failed to load syllabus', err);
        },
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
        error: (err) => {
          console.error('Failed to save outcome', err);
        },
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
        error: (err) => {
          console.error('Failed to delete outcome', err);
        },
      });
  }






}
