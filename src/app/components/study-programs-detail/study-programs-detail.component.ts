import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';

interface StudyProgramOverview {
  id: number;
  name: string;
  leaderId?: number | null;
  leaderName?: string | null;
  subjects?: SubjectSummary[];
}

interface SubjectSummary {
  id: number;
  name: string;
  espb?: number;
  mandatory?: boolean;
  studyYear?: number;
}

@Component({
  selector: 'app-study-program-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-programs-detail.component.html',
  styleUrls: ['./study-programs-detail.component.css'],

})
export class StudyProgramDetailComponent implements OnInit {
  overview: StudyProgramOverview | null = null;
  groupedSubjects: { year: number; subjects: SubjectSummary[] }[] = [];
  openIndex: number | null = null;

  subjectLink = (s: SubjectSummary) => `/subject/${s.id}`;

  constructor(private route: ActivatedRoute, private api: DynamicService) {}

  ngOnInit() {
    const programId = Number(this.route.snapshot.paramMap.get('studyProgramId'));
    this.api.getStudyProgramOverview(programId).subscribe(o => {
      this.overview = o;

      const groups: { [year: number]: SubjectSummary[] } = {};
      o.subjects?.forEach(subj => {
        const year = subj.studyYear?.id ?? 0; 
        if (!groups[year]) groups[year] = [];
        groups[year].push(subj);
      });

      this.groupedSubjects = Object.entries(groups).map(([year, subjects]) => ({
        year: Number(year),
        subjects,
      }));

    });
  }

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
