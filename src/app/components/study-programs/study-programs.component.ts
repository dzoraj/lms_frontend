import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectedFacultyService } from '../../service/selected-faculty.service';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from '../../dynamic-components/view-table/view-table.component';
import { CommonModule } from '@angular/common';
import { Subject as RxSubject, switchMap, takeUntil } from 'rxjs';
import { NavbarComponent } from "../navbar/navbar.component";

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
