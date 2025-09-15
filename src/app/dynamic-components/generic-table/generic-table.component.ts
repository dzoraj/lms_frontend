import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NoDataDirective } from '../../directives/no-data.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [NoDataDirective, CommonModule, FormsModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnChanges {

  @Input() data: any[] = [];
  @Input() displayedColumns?: string[];
  @Input() hiddenKeys: string[] = ['id', 'deleted', 'evaluations'];
  @Input() columnLabels?: Record<string, string>;
  @Input() columnRenderers?: Record<string, (row: any) => string>;

  @Output() removeEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<any>();

  @Input() exportBase?: string;        
  @Input() idField: string = 'id';     
  @Input() exportNeedsAuth = true;     

  columns: string[] = [];
  filteredData: any[] = [];
  searchTerm: string = '';
  sortDirections: { [key: string]: 'asc' | 'desc' } = {};

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.rebuildColumns();
      this.filteredData = [...(this.data || [])];
    }
    if (changes['displayedColumns']) {
      this.rebuildColumns();
    }
  }

  private rebuildColumns() {
    if (this.displayedColumns && this.displayedColumns.length) {
      this.columns = [...this.displayedColumns];
      return;
    }
    if (!this.data || this.data.length === 0) {
      this.columns = [];
      return;
    }
    const allKeys = new Set<string>();
    this.data.forEach(row => {
      Object.keys(row || {}).forEach(k => {
        if (!this.hiddenKeys.includes(k)) allKeys.add(k);
      });
    });
    this.columns = Array.from(allKeys).sort();
  }

  headerFor(column: string): string {
    return this.columnLabels?.[column] ?? column;
  }

  getValue(row: any, column: string): string {
    if (!row) return '';
    const renderer = this.columnRenderers?.[column];
    if (renderer) {
      try { return String(renderer(row) ?? ''); } catch { return ''; }
    }
    const value = row[column];
    if (value === null || value === undefined) return '';

    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      if (typeof value[0] === 'object') {
        return value.map(v => this.bestName(v)).filter(Boolean).join(', ');
      }
      return value.join(', ');
    }

    if (typeof value === 'object') {
      return this.bestName(value) ?? '';
    }

    return String(value);
  }

  private bestName(obj: any): string | undefined {
    if (!obj) return undefined;
    const nameKeys = ['name', 'naziv', 'title', 'subjectName', 'fileName', 'email', 'description'];
    for (const k of nameKeys) {
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
        return String(obj[k]);
      }
    }
    if (obj.id !== undefined) return `#${obj.id}`;
    try { return JSON.stringify(obj); } catch { return ''; }
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
      const aVal = this.flattenForSort(a?.[columnKey]);
      const bVal = this.flattenForSort(b?.[columnKey]);
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction * aVal.localeCompare(bVal);
      }
      const aNum = typeof aVal === 'number' ? aVal : Number.NaN;
      const bNum = typeof bVal === 'number' ? bVal : Number.NaN;
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return direction * (aNum - bNum);
      return 0;
    });
  }

  private flattenForSort(val: any): string | number {
    if (val === null || val === undefined) return '';
    if (Array.isArray(val)) return String(val.map(v => (typeof v === 'object' ? this.bestName(v) : v)).join(', '));
    if (typeof val === 'object') return this.bestName(val) ?? '';
    return val;
  }

  filterTable() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredData = [...this.data];
      return;
    }
    this.filteredData = this.data.filter(row =>
      this.columns.some(col => String(this.getValue(row, col)).toLowerCase().includes(term))
    );
  }

  openPdf(row: any) {
    this.openExport(row, 'pdf');
  }

  openXml(row: any) {
    this.openExport(row, 'xml');
  }

  private openExport(row: any, ext: 'pdf' | 'xml') {
    if (!this.exportBase) return;
    const id = row?.[this.idField];
    if (id == null) return;
    const url = this.resolveUrl(`${this.exportBase}/${id}.${ext}`);

    if (!this.exportNeedsAuth) {
      window.open(url, '_blank');
      return;
    }

    const headers = this.buildAuthHeaders();
    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      },
      error: (err) => {
        console.error(`Failed to download ${ext}`, err);
      }
    });
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    const origin = window?.location?.origin ?? '';
    return path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`;
  }
}
