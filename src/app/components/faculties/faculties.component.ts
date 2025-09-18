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
      teachers: this.dynamicService.getAll<any>('teacher'),
      addresses: this.dynamicService.getAll<any>('address')
    }).subscribe(({ faculties, universities, teachers, addresses }) => {
      const teacherById: Record<number, any> = Object.fromEntries((teachers ?? []).map((t: any) => [t.id, t]));
      const uniById: Record<number, any> = Object.fromEntries((universities ?? []).map((u: any) => [u.id, u]));
      const addrById: Record<number, any> = Object.fromEntries((addresses ?? []).map((a: any) => [a.id, a]));

      this.faculties = (faculties ?? []).map((f: any) => {
        const dean = teacherById[f.deanId];
        const uni = uniById[f.universityId];
        const addrList: string =
          (f.addressIds ?? [])
            .map((aid: number) => addrById[aid])
            .filter(Boolean)
            .map((a: any) => `${a.address} ${a.number}, ${a.city}, ${a.country}`)
            .join(' | ') || 'No addresses';

        return {
          id: f.id,
          name: f.name,
          Dean: dean?.name ?? (f.deanId ? `Teacher #${f.deanId}` : '—'),
          University: uni?.name ?? (f.universityId ? `University #${f.universityId}` : '—'),
          Addresses: addrList
        };
      });
    });
  }
}
