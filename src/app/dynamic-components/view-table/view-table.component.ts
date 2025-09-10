import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NoDataDirective } from '../../directives/no-data.directive';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-table',
  standalone: true,
  imports: [NoDataDirective, CommonModule, RouterLink],
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.css'] 
})
export class ViewTableComponent implements OnChanges {

  private router = inject(Router);

  @Input() rowLinkFn: ((row: any) => string) | null = null;
  @Input() data: any[] = [];

  columns: string[] = [];
  sortDirections: { [key: string]: 'asc' | 'desc' } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.columns = Object.keys(this.data[0]).filter(key => key !== 'id');
    }
  }

  getValue(row: any, column: string): any {
    const value = row[column];
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(v => v.name || '').filter(n => n).join(', ');
      }
      return value.name ?? JSON.stringify(value);
    }

    return value;
  }

  sort(columnKey: string) {
    this.sortDirections[columnKey] =
      this.sortDirections[columnKey] === 'asc' ? 'desc' : 'asc';

    const direction = this.sortDirections[columnKey] === 'asc' ? 1 : -1;

    this.data = [...this.data].sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction * valueA.localeCompare(valueB);
      }
      return direction * ((valueA ?? 0) - (valueB ?? 0));
    });
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
