import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectedFacultyService } from '../../service/selected-faculty.service';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from "../../dynamic-components/view-table/view-table.component";
import { CommonModule } from '@angular/common';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-study-programs',
  standalone: true,
  imports: [CommonModule, ViewTableComponent],
  template: `
    <section class="card" *ngIf="programs?.length; else empty">
      <h3 class="section-title">Study Programs</h3>
      <app-view-table [data]="programs"></app-view-table>
    </section>

    <ng-template #empty>
      <section class="card muted">
        <h3 class="section-title">Study Programs</h3>
        <p>No study programs for this faculty.</p>
      </section>
    </ng-template>
  `,
  styles: [`
    .card { max-width: 1100px; margin: 1rem auto; padding: 1.25rem; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,.06); background: #fff; }
    .section-title { margin: 0 0 .75rem; font-weight: 600; }
    .muted { opacity: .9; }
  `]
})
export class StudyProgramsComponent implements OnInit, OnDestroy {
  programs: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dynamicService: DynamicService,
    private selectedFacultyService: SelectedFacultyService
  ) {}

  ngOnInit(): void {
    this.selectedFacultyService.selectedFaculty$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(facultySlugOrId => {
          if (!facultySlugOrId) return [];
          const facultyId = Number(facultySlugOrId);
          return this.dynamicService.getStudyProgramsByFaculty(facultyId);
        })
      )
      .subscribe((data: any) => this.programs = data || []);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
