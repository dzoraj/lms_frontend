import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SelectedFacultyService } from '../../service/selected-faculty.service';

@Component({
  selector: 'app-faculty-detail',
  standalone: true,
  imports: [HomeComponent],
  template: `
    <app-home>
      <h2>Faculty ID: {{ facultyId }}</h2>
    </app-home>
  `
})
export class FacultyDetailComponent implements OnInit {
  facultyId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private selectedFacultyService: SelectedFacultyService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('facultyId');
    this.facultyId = idParam ? Number(idParam) : null;

    if (this.facultyId) {
      this.selectedFacultyService.setFaculty(this.facultyId);
    } else {
      console.error('Invalid or missing facultyId in route');
    }
  }
}
