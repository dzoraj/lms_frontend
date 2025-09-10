import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css'],

})
export class SubjectDetailComponent implements OnInit {
  subject: any = null;

  constructor(private route: ActivatedRoute, private api: DynamicService,private location: Location) {}

  ngOnInit(): void {
    const subjectId = Number(this.route.snapshot.paramMap.get('subjectId'));
    this.api.getSubjectFull(subjectId).subscribe(s => this.subject = s);
  }
  goBack() {
  this.location.back();
  }
}
