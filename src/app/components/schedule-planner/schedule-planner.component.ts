import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { ConflictResult } from '../../model/teaching/schedule/conflict-result.model';
import { RecurringTeachingSessionRequest } from '../../model/teaching/schedule/recurring-teaching-session-request.model';
import { UnifiedScheduleItem } from '../../model/teaching/schedule/unified-schedule-item.model';
import { ConflictProbe } from '../../model/teaching/schedule/conflict-probe.model';
import { ScheduleItemType } from '../../model/teaching/schedule/schedule-item-type.model';
import { KnowledgeEvaluationCreate } from '../../model/teaching/schedule/knowledge-evaluation-create.model';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-schedule-planner',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDatepickerModule, MatNativeDateModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatTableModule, MatListModule
  ],
  templateUrl: './schedule-planner.component.html',
  styleUrls: ['./schedule-planner.component.css']
})
export class SchedulePlannerComponent {
  studyYears: any[] = [];
  schedStudyYearId: number | null = null;
  schedFrom: Date = new Date();
  schedTo: Date = new Date(new Date().setDate(new Date().getDate() + 7));
  schedule: UnifiedScheduleItem[] = [];
  columns = ['start', 'end', 'type', 'subject', 'label', 'crid'];

  courseRealizations: any[] = [];
  teachingTypes: any[] = [];
  evaluationTypes: any[] = [];
  evaluationInstruments: any[] = [];
  learningOutcomes: any[] = [];

  recCourseRealizationId: number | null = null;
  recTeachingTypeId: number | null = null;
  recStartDate: Date = new Date();
  recEndDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 4));
  recStartTime = '08:00';
  recEndTime = '09:30';
  recDaysOfWeek: string[] = [];
  recSelectedLOIds: number[] = [];
  recSkipDateInput = '';
  recSkipDates: string[] = [];
  conflict?: ConflictResult;

  evalCourseRealizationId: number | null = null;
  evalEvaluationTypeId: number | null = null;
  evalEvaluationInstrumentId: number | null = null;
  evalSelectedLOIds: number[] = [];
  evalPoints: number | null = null;
  evalDate: Date = new Date();
  evalStartTime = '10:00';
  evalEndTime = '12:00';
  evalConflict?: ConflictResult;

  weekdays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  constructor(private api: ScheduleService, private dynamic: DynamicService) {
    this.dynamic.getByPath<any[]>('studyYear').subscribe(x => this.studyYears = x ?? []);
    this.dynamic.getByPath<any[]>('teachingType').subscribe(x => this.teachingTypes = x ?? []);
    this.dynamic.getByPath<any[]>('evaluationType').subscribe(x => this.evaluationTypes = x ?? []);
    this.dynamic.getByPath<any[]>('evaluationInstrument').subscribe(x => this.evaluationInstruments = x ?? []);
    this.dynamic.getByPath<any[]>('courseRealization').subscribe(x => this.courseRealizations = x ?? []);
    this.dynamic.getByPath<any[]>('learningOutcome').subscribe(x => this.learningOutcomes = x ?? []);
  }

  private pad(n: number) { return String(n).padStart(2, '0'); }
  private localIso(dt: Date) {
    const y = dt.getFullYear(), m = this.pad(dt.getMonth() + 1), d = this.pad(dt.getDate());
    const hh = this.pad(dt.getHours()), mm = this.pad(dt.getMinutes()), ss = this.pad(dt.getSeconds());
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
  }
  private combine(dateOnly: Date, hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date(dateOnly);
    d.setHours(h, m, 0, 0);
    return this.localIso(d);
  }

  load() {
    if (!this.schedStudyYearId) return;
    this.api.unified(this.schedStudyYearId, this.localIso(this.schedFrom), this.localIso(this.schedTo))
      .subscribe(list => this.schedule = list ?? []);
  }

  addSkipDate() {
    if (!this.recSkipDateInput) return;
    if (!this.recSkipDates.includes(this.recSkipDateInput)) this.recSkipDates.push(this.recSkipDateInput);
    this.recSkipDateInput = '';
  }
  removeSkipDate(i: number) { this.recSkipDates.splice(i, 1); }

  previewConflicts() {
    this.conflict = undefined;
    if (!this.recCourseRealizationId || !this.recStartDate || !this.recEndDate || !this.recDaysOfWeek.length) return;
    const chosen = new Set(this.recDaysOfWeek);
    const start = new Date(this.recStartDate);
    const end = new Date(Math.min(this.recEndDate.getTime(), start.getTime() + 14 * 86400000));
    const probes: ConflictProbe[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const dow = cursor.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase();
      const ymd = cursor.toISOString().slice(0, 10);
      if (chosen.has(dow) && !this.recSkipDates.includes(ymd)) {
        probes.push({
          type: 'TEACHING_SESSION' as ScheduleItemType,
          courseRealizationId: this.recCourseRealizationId!,
          start: this.combine(cursor, this.recStartTime),
          end: this.combine(cursor, this.recEndTime)
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    this.api.checkConflicts(probes).subscribe(r => this.conflict = r);
  }

  createRecurring() {
    if (!this.recCourseRealizationId || !this.recTeachingTypeId || !this.recDaysOfWeek.length) return;
    const payload: RecurringTeachingSessionRequest = {
      courseRealizationId: this.recCourseRealizationId,
      teachingTypeId: this.recTeachingTypeId,
      startDate: this.recStartDate.toISOString().slice(0, 10),
      endDate: this.recEndDate.toISOString().slice(0, 10),
      startTime: this.recStartTime,
      endTime: this.recEndTime,
      daysOfWeek: this.recDaysOfWeek,
      learningOutcomeIds: this.recSelectedLOIds,
      skipDates: this.recSkipDates
    };
    this.api.createRecurringTeaching(payload).subscribe(ids => {
      alert(`Created ${ids.length} sessions`);
      if (this.schedStudyYearId) this.load();
    });
  }

  previewEvalConflicts() {
    this.evalConflict = undefined;
    if (!this.evalCourseRealizationId || !this.evalEvaluationTypeId || !this.evalEvaluationInstrumentId) return;
    const start = this.combine(this.evalDate, this.evalStartTime);
    const end = this.combine(this.evalDate, this.evalEndTime);
    const probe: ConflictProbe = {
      type: 'KNOWLEDGE_EVALUATION' as ScheduleItemType,
      courseRealizationId: this.evalCourseRealizationId!,
      start, end
    };
    this.api.checkConflicts([probe]).subscribe(r => this.evalConflict = r);
  }

  createKnowledgeEvaluation() {
    if (!this.evalCourseRealizationId || !this.evalEvaluationTypeId || !this.evalEvaluationInstrumentId) return;
    const payload: KnowledgeEvaluationCreate = {
      startTime: this.combine(this.evalDate, this.evalStartTime),
      endTime: this.combine(this.evalDate, this.evalEndTime),
      points: this.evalPoints ?? null,
      evaluationInstrumentId: this.evalEvaluationInstrumentId,
      evaluationTypeId: this.evalEvaluationTypeId,
      courseRealizationId: this.evalCourseRealizationId,
      learningOutcomeIds: this.evalSelectedLOIds
    };
    this.dynamic.create('knowledgeEvaluation', payload).subscribe({
      next: () => {
        alert('Knowledge evaluation created.');
        if (this.schedStudyYearId) this.load();
        this.evalConflict = undefined;
      },
      error: err => alert(err?.error?.message || 'Failed to create knowledge evaluation')
    });
  }
}
