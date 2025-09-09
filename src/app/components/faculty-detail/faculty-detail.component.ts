import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SelectedFacultyService } from '../../service/selected-faculty.service';
import { StudyProgramsComponent } from '../study-programs/study-programs.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faculty-detail',
  standalone: true,
  imports: [HomeComponent, StudyProgramsComponent, CommonModule, RouterLink],
  template: `
    <app-home>
      <div class="page">
        <header class="header">
          <a routerLink="/faculty" class="back-link">← Back to Faculties</a>
        </header>

        <app-study-programs></app-study-programs>
      </div>
    </app-home>
  `,
  styles: [`
    .page { padding: 1rem; }
    .header { max-width: 1100px; margin: 0 auto 0.5rem; display: flex; align-items: baseline; gap: 1rem; }
    .title { margin: 0; font-weight: 700; }
    .back-link { text-decoration: none; opacity: .85; }
    .back-link:hover { text-decoration: underline; }
  `]
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
