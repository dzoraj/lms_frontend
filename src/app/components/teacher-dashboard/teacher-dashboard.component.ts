import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { LoginService } from '../../service/loginService/login.service';
import { QuestionService } from '../../service/question/question.service';

import { NavbarComponent } from "../navbar/navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { GenericCrudComponent } from '../generic-crud/generic-crud.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MatTabsModule, GenericCrudComponent],
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
  tableColumnRenderers = {
    file: (row: any) => row?.file?.name || '—'

  };

  loading = false;
  error: string | null = null;

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
}
