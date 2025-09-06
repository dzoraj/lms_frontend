import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';
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
      this.universityData = Array.isArray(data) ? data : [data];
    });
  }
}
