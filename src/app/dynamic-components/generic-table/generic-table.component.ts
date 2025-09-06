import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NoDataDirective } from '../../directives/no-data.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-generic-table',
  imports: [NoDataDirective],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css',
  standalone:true
})
export class GenericTableComponent implements OnChanges {
  
  @Input()
  data: any[] = [];
  
  columns : string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data && this.data.length > 0) {      
      this.columns = Object.keys(this.data[0]).filter(key => key !== "id");
    } 
  }

getValue(row: any, column: string): any {
  const value = row[column];

  if (value === null || value === undefined) return '';

  if (typeof value === 'object') {
    // If it's an array, join their names
    if (Array.isArray(value)) {
      return value.map(v => v.name || '').filter(n => n).join(', ');
    }
    // Else try to get name or fallback to string
    return value.name ?? JSON.stringify(value);
  }

  return value;
}


  @Output()
  removeEvent = new EventEmitter<number>();

  @Output()
  editEvent = new EventEmitter<any>();

remove(id: number | undefined): void {
  if (id === undefined || id === null) {
    console.error("Tried to delete but ID is undefined/null");
    return;
  }
  console.log("Emitting delete for ID:", id);
  this.removeEvent.emit(id);
}



  update(data: any): void{
    this.editEvent.emit(data);
  }

  sortDirections: { [key: string]: 'asc' | 'desc' } = {};

  sort(columnKey: string) {
    this.sortDirections[columnKey] = this.sortDirections[columnKey] === 'asc' ? 'desc' : 'asc';

    this.data = [...this.data].sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];

      const direction = this.sortDirections[columnKey] === 'asc' ? 1 : -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction * valueA.localeCompare(valueB);
      } else {
        return direction * (valueA - valueB);
      }
    });
  }

  
}
