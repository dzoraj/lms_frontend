import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NoDataDirective } from '../../directives/no-data.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [NoDataDirective,CommonModule,FormsModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnChanges {
  
  @Input() data: any[] = [];
  @Output() removeEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<any>();

  columns: string[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';

  sortDirections: { [key: string]: 'asc' | 'desc' } = {};

ngOnChanges(changes: SimpleChanges) {
  if (changes['data'] && this.data && this.data.length > 0) {
    // Collect unique keys from all rows
    const allKeys = new Set<string>();
    this.data.forEach(row => {
      Object.keys(row).forEach(k => {
        if (k !== 'id') allKeys.add(k);
      });
    });

    // Convert to array and sort alphabetically (or define your own fixed order)
    this.columns = Array.from(allKeys).sort();

    // Keep filtered data aligned
    this.filteredData = [...this.data];
  } 
}


  getValue(row: any, column: string): any {
    const value = row[column];
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return value.map(v => v.name || '').filter(n => n).join(', ');
      return value.name ?? JSON.stringify(value);
    }
    return value;
  }

  remove(id: number | undefined): void {
    if (id === undefined || id === null) return;
    this.removeEvent.emit(id);
  }

  update(data: any): void {
    this.editEvent.emit(data);
  }

  sort(columnKey: string) {
    this.sortDirections[columnKey] = this.sortDirections[columnKey] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirections[columnKey] === 'asc' ? 1 : -1;

    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction * valueA.localeCompare(valueB);
      } else {
        return direction * ((valueA || 0) - (valueB || 0));
      }
    });
  }

  filterTable() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter(row => {
      return this.columns.some(col => {
        const val = this.getValue(row, col);
        return val.toString().toLowerCase().includes(term);
      });
    });
  }
}
