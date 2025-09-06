import { Component, OnInit } from '@angular/core';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from '../../dynamic-components/view-table/view-table.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from "../home/home.component";

@Component({
  selector: 'app-faculties',
  template: `

    
    <app-home>    <h2>Faculties</h2><app-view-table [data]="faculties" [rowLinkFn]="getFacultyLink"></app-view-table></app-home>
  `,
  standalone: true,
  imports: [ViewTableComponent, CommonModule, RouterModule, HomeComponent]
})
export class FacultiesComponent implements OnInit {
  faculties: any[] = [];
  getFacultyLink = (faculty: any) => `/faculty/${faculty.id}`;
  constructor(private dynamicService: DynamicService) { }

  ngOnInit(): void {
    this.dynamicService.getAll<any>('faculty').subscribe(data => {
      this.faculties = data;
    });
  }
}
