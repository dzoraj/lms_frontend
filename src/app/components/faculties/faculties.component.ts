import { Component, OnInit } from '@angular/core';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from '../../dynamic-components/view-table/view-table.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-faculties',
  template: `
    <app-home>
      <h2>Faculties</h2>
      <app-view-table [data]="faculties" [rowLinkFn]="getFacultyLink"></app-view-table>
    </app-home>
  `,
  standalone: true,
  imports: [ViewTableComponent, CommonModule, RouterModule, HomeComponent]
})
export class FacultiesComponent implements OnInit {
  faculties: any[] = [];
  getFacultyLink = (faculty: any) => `/faculty/${faculty.id}`;

  constructor(private dynamicService: DynamicService) {}

  ngOnInit(): void {
    forkJoin({
      faculties: this.dynamicService.getAll<any>('faculty'),
      universities: this.dynamicService.getAll<any>('university'),
      teachers: this.dynamicService.getAll<any>('teacher')
    }).subscribe(({ faculties, universities, teachers }) => {
      this.faculties = faculties.map((f: any) => {
        const teacher = teachers.find((t: any) => t.id === f.dean);
        const uni = universities.find((u: any) => u.id === f.university);

        return {
          id: f.id,
          name: f.name,
          Dean: teacher ? teacher.name : `Teacher #${f.dean}`,
          university: uni ? uni.name : `University #${f.university}`,
          addresses: f.addresses?.map(
            (a: any) => `${a.address} ${a.number}, ${a.city}, ${a.country}`
          ).join(' | ') || 'No addresses'
        };
      });

      console.log('Mapped faculties:', this.faculties);
    });
  }
}
