import { Component, OnInit } from '@angular/core';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from '../../dynamic-components/view-table/view-table.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-university',
  template: `
  <app-home>
    <h2>University Overview</h2>
    <app-view-table [data]="universityData"></app-view-table></app-home>
  `,
  standalone: true,
  imports: [ViewTableComponent,HomeComponent],
})
export class UniversityComponent implements OnInit {
  universityData: any[] = [];

  constructor(private dynamicService: DynamicService) {}

ngOnInit(): void {
  this.dynamicService.getAll<any>('university').subscribe(data => {
    const universities = Array.isArray(data) ? data : [data];

    this.universityData = universities.map(u => ({
      ...u,
      addresses: u.addresses?.map(
        (a: any) => `${a.address} ${a.number}, ${a.city}, ${a.country}`
      ).join(' | ') || 'No addresses',

      faculties: u.faculties?.map(
        (f: any) =>
          `${f.name} (${f.addresses?.map((a: any) =>
            `${a.address} ${a.number}, ${a.city}, ${a.country}`
          ).join(' | ') || 'No addresses'})`
      ).join(' | ') || 'No faculties'
    }));
  });
}

}
