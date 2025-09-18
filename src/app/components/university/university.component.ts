import { Component, OnInit } from '@angular/core';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { ViewTableComponent } from '../../dynamic-components/view-table/view-table.component';
import { HomeComponent } from '../home/home.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-university',
  template: `
    <app-home>
      <h2>University Overview</h2>
      <app-view-table [data]="universityData"></app-view-table>
    </app-home>
  `,
  standalone: true,
  imports: [ViewTableComponent, HomeComponent],
})
export class UniversityComponent implements OnInit {
  universityData: any[] = [];

  constructor(private dynamicService: DynamicService) {}

  ngOnInit(): void {
    forkJoin({
      universities: this.dynamicService.getAll<any>('university'),
      faculties: this.dynamicService.getAll<any>('faculty'),
      addresses: this.dynamicService.getAll<any>('address')
    }).subscribe(({ universities, faculties, addresses }) => {
      const facById: Record<number, any> = Object.fromEntries((faculties ?? []).map((f: any) => [f.id, f]));
      const addrById: Record<number, any> = Object.fromEntries((addresses ?? []).map((a: any) => [a.id, a]));

      this.universityData = (universities ?? []).map((u: any) => {
        const addressStr =
          (u.addressIds ?? [])
            .map((aid: number) => addrById[aid])
            .filter(Boolean)
            .map((a: any) => `${a.address} ${a.number}, ${a.city}, ${a.country}`)
            .join(' | ') || 'No addresses';

        const facultiesStr =
          (u.facultyIds ?? [])
            .map((fid: number) => facById[fid])
            .filter(Boolean)
            .map((f: any) => f.name)
            .join(' | ') || 'No faculties';

        return {
          id: u.id,
          name: u.name,
          Addresses: addressStr,
          Faculties: facultiesStr
        };
      });
    });
  }
}
