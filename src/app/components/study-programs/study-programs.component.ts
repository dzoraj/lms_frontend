import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectedFacultyService } from '../../service/selected-faculty.service';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from '../../dynamic-components/view-table/view-table.component';
import { CommonModule } from '@angular/common';
import { Subject as RxSubject, switchMap, takeUntil, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-study-programs',
  standalone: true,
  imports: [CommonModule, ViewTableComponent],
  templateUrl: './study-programs.component.html',
  styleUrls: ['./study-programs.component.css'],
})
export class StudyProgramsComponent implements OnInit, OnDestroy {
  programs: any[] = [];
  private destroy$ = new RxSubject<void>();

  rowLink = (p: any) => `/study-program/${p.id}`;

  constructor(
    private dynamicService: DynamicService,
    private selectedFacultyService: SelectedFacultyService
  ) {}

  ngOnInit(): void {
    this.selectedFacultyService.selectedFaculty$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(facultySlugOrId => {
          if (!facultySlugOrId) return of([]);
          const facultyId = Number(facultySlugOrId);

          return forkJoin({
            programs: this.dynamicService.getStudyProgramsByFaculty(facultyId),
            faculties: this.dynamicService.getAll<any>('faculty'),
            teachers: this.dynamicService.getAll<any>('teacher')
          });
        })
      )
      .subscribe(({ programs, faculties, teachers }: any) => {
        console.log('Raw programs from API:', programs);

        this.programs = (programs || []).map((p: any) => {
          const faculty = faculties.find((f: any) => f.id === p.facultyId);
          const leader = teachers.find((t: any) => t.id === p.leaderId);

          return {
            id: p.id,
            name: p.name,
            leader: leader ? leader.name : `Leader #${p.leaderId}`,
            faculty: faculty ? faculty.name : `Faculty #${p.facultyId}`
          };
        });

        console.log('Mapped programs:', this.programs);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
