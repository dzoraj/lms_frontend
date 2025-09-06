import { Component, OnInit } from '@angular/core';
import { SelectedFacultyService } from '../../service/selected-faculty.service';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from "../../dynamic-components/view-table/view-table.component";
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-study-programs',
  template: `
    <app-home>
      <h2>Study Programs</h2>
      <app-view-table [data]="programs"></app-view-table>
    </app-home>
  `,
  standalone: true,
  imports: [ViewTableComponent, HomeComponent],
})
export class StudyProgramsComponent implements OnInit {
  programs: any[] = [];
  selectedFacultyId: number | null = null;

  constructor(
    private dynamicService: DynamicService,
    private selectedFacultyService: SelectedFacultyService
  ) {}

  ngOnInit(): void {
    this.selectedFacultyService.selectedFaculty$.subscribe(facultySlugOrId => {
      if (!facultySlugOrId) {
        this.programs = [];
        return;
      }

      const facultyId = Number(facultySlugOrId);
      this.selectedFacultyId = facultyId;

      this.dynamicService.getStudyProgramsByFaculty(facultyId).subscribe(data => {
        this.programs = data;
      });
    });
  }
}
