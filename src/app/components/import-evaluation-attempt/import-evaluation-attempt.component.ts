import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type Mode = 'MERGE' | 'REPLACE';

@Component({
  selector: 'app-import-evaluation-attempt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-evaluation-attempt.component.html',
  styleUrls: ['./import-evaluation-attempt.component.css']
})
export class ImportEvaluationAttemptComponent {
  mode: Mode = 'MERGE';
  xml = '';
  path = '';
  file?: File | null;
  result: any = null;
  validation: any = null;
  error = '';
  loading = false;
  baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files && input.files.length ? input.files[0] : null;
  }

  async doValidate() {
    this.validation = null;
    this.error = '';
    const body = this.xml || '';
    try {
      const res = await fetch(`${this.baseUrl}/import/evaluations/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          ...Object.fromEntries(this.authHeaders().keys().map(k => [k, this.authHeaders().get(k) as string]))
        },
        body
      });
      const data = await res.json();
      if (!res.ok) {
        this.validation = data;
        this.error = typeof data === 'string' ? data : (data?.errors?.join('\n') || 'Validation error');
        return;
      }
      this.validation = data;
    } catch (e: any) {
      this.error = e?.message || 'Failed to validate';
    }
  }

  async doImport() {
    this.result = null;
    this.error = '';
    this.loading = true;
    try {
      const fd = new FormData();
      if (this.file) fd.append('file', this.file);
      if (this.xml?.trim()) fd.append('xml', this.xml.trim());
      if (this.path?.trim()) fd.append('path', this.path.trim());
      fd.append('mode', this.mode);
      const res = await fetch(`${this.baseUrl}/import/evaluations`, {
        method: 'POST',
        headers: Object.fromEntries(this.authHeaders().keys().map(k => [k, this.authHeaders().get(k) as string])),
        body: fd
      });
      if (!res.ok) {
        const txt = await res.text();
        this.error = txt || 'Import failed';
        return;
      }
      this.result = await res.json();
    } catch (e: any) {
      this.error = e?.message || 'Import failed';
    } finally {
      this.loading = false;
    }
  }

  async downloadSchema() {
    try {
      const res = await fetch(`${this.baseUrl}/import/evaluations/schema`, {
        headers: Object.fromEntries(this.authHeaders().keys().map(k => [k, this.authHeaders().get(k) as string]))
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'evaluation.xsd';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch {}
  }

  clearAll() {
    this.file = null;
    this.xml = '';
    this.path = '';
    this.result = null;
    this.validation = null;
    this.error = '';
    this.mode = 'MERGE';
  }
}
