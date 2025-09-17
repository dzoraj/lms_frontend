import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { finalize } from 'rxjs';
import { SchedulePlannerComponent } from '../schedule-planner/schedule-planner.component';
import { SaGeneralNotificationsComponent } from '../sa-general-notifications/sa-general-notifications.component';
import { FacultySuppliesComponent } from "../faculty-supplies/faculty-supplies.component";

@Component({
  selector: 'app-sa-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatOptionModule,
    NavbarComponent,
    GenericTableComponent,
    SchedulePlannerComponent,
    SaGeneralNotificationsComponent,
    FacultySuppliesComponent
],
  templateUrl: './sa-dashboard.component.html',
  styleUrls: ['./sa-dashboard.component.css']
})
export class SaDashboardComponent implements OnInit {
  studyYears: any[] = [];
  enrollments: any[] = [];
  studentResults: any[] = [];
  selectedStudent: any | null = null;
  newEnrollment = { studentId: null as number | null, studyYearId: null as number | null, indexNumber: '' };

  roleUserSearch = '';
  filteredUsers: any[] = [];
  selectedUserId: number | null = null;
  selectedUserRoles: string[] = [];
  roleMessage: string | null = null;
  roleError: string | null = null;

  docStudentSearch = '';
  docStudentResults: any[] = [];
  selectedDocStudent: any | null = null;
  selectedTemplate: string | null = null;
  docError: string | null = null;

  loading = false;
  error: string | null = null;
  success: string | null = null;

  materials: any[] = [];
  loans: any[] = [];

  materialQueryIssue: any = '';
  materialResultsIssue: any[] = [];
  selectedMaterialIssue: any | null = null;

  studentQueryIssue: any = '';
  studentResultsIssue: any[] = [];
  selectedStudentIssue: any | null = null;

  quantityForIssue = 1;

  loanIdToReturn: number | null = null;

  materialQueryInv: any = '';
  materialResultsInv: any[] = [];
  selectedMaterialInv: any | null = null;
  inventoryCountNew: number | null = null;

  libraryMessage: string | null = null;
  libraryError: string | null = null;

  private apiBase = 'http://localhost:8080/api';

  constructor(private dynamic: DynamicService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadInventory();
    this.loadLoans();
  }

  private authHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {}) };
  }

  private safeIncludes(hay: any, needle: string): boolean {
    const s = (hay ?? '').toString().toLowerCase();
    return s.includes(needle);
  }

  loadAll() {
    this.loading = true;
    this.dynamic.getByPath<any[]>('studyYear').subscribe(yrs => this.studyYears = yrs ?? []);
    this.dynamic.getByPath<any[]>('studentInYear')
      .pipe(finalize(() => this.loading = false))
      .subscribe(enr => this.enrollments = enr ?? []);
  }

  searchStudents(query: string) {
    if (!query || query.length < 2) { this.studentResults = []; return; }
    this.dynamic.getByPath<any[]>(`students/search?name=${encodeURIComponent(query)}`).subscribe({
      next: res => this.studentResults = res ?? [],
      error: () => this.studentResults = []
    });
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
    this.newEnrollment.studentId = student.id;
  }

  displayStudent = (student: any): string =>
    student ? `${student.name} (${student.indexNumber || '—'})` : '';

  enrollStudent() {
    if (!this.newEnrollment.studentId || !this.newEnrollment.studyYearId) {
      this.error = 'Please select student and study year';
      return;
    }
    this.error = null;
    this.dynamic.create<any>('studentInYear', {
      studentId: this.newEnrollment.studentId,
      studyYearId: this.newEnrollment.studyYearId,
      indexNumber: this.newEnrollment.indexNumber,
      enrollmentDate: new Date().toISOString().split('T')[0]
    }).subscribe({
      next: () => {
        this.success = 'Enrollment saved!';
        this.newEnrollment = { studentId: null, studyYearId: null, indexNumber: '' };
        this.selectedStudent = null;
        this.studentResults = [];
        this.loadAll();
        setTimeout(() => this.success = null, 3000);
      },
      error: err => this.error = err?.error?.message || 'Failed to enroll student'
    });
  }

  searchUsersForRole() {
    if (!this.roleUserSearch.trim()) { this.filteredUsers = []; this.selectedUserRoles = []; return; }
    const params = new HttpParams().set('query', this.roleUserSearch);
    this.http.get<any[]>(`${this.apiBase}/administrator/search-users`, { params }).subscribe({
      next: users => { this.filteredUsers = users; },
      error: () => this.roleError = 'Failed to search users'
    });
  }

  onUserChange() {
    const user = this.filteredUsers.find(u => u.id === this.selectedUserId);
    this.selectedUserRoles = user ? user.roles : [];
  }

  assignStudentRole() {
    if (!this.selectedUserId) return;
    this.http.post(`${this.apiBase}/student-administration/assign-student-role`,
      { userId: this.selectedUserId, roleName: 'STUDENT' },
      { responseType: 'text' }
    ).subscribe({
      next: res => { this.roleMessage = res; this.roleError = null; this.onUserChange(); },
      error: err => this.roleError = err.error || 'Failed to assign role'
    });
  }

  removeStudentRole() {
    if (!this.selectedUserId) return;
    const params = new HttpParams().set('userId', this.selectedUserId.toString());
    this.http.delete(`${this.apiBase}/student-administration/remove-student-role`, { params }).subscribe({
      next: () => { this.roleMessage = `Removed STUDENT role from user ${this.selectedUserId}`; this.roleError = null; this.onUserChange(); },
      error: err => this.roleError = err.error || 'Failed to remove role'
    });
  }

  searchStudentsForDocs(query: string) {
    if (!query || query.length < 2) { this.docStudentResults = []; return; }
    this.dynamic.getByPath<any[]>(`students/search?name=${encodeURIComponent(query)}`).subscribe({
      next: res => this.docStudentResults = res ?? [],
      error: () => this.docStudentResults = []
    });
  }

  selectDocStudent(student: any) { this.selectedDocStudent = student; }

  downloadDocument() {
    if (!this.selectedDocStudent || !this.selectedTemplate) {
      this.docError = 'Please select student and document type.';
      return;
    }
    this.docError = null;
    this.dynamic.getByPathBlob(`documents/${this.selectedTemplate}/${this.selectedDocStudent.id}`).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedTemplate}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.docError = 'Failed to generate document'
    });
  }

  loadInventory() {
    this.dynamic.getByPath<any[]>('library/inventory').subscribe({
      next: res => { this.materials = res ?? []; },
      error: () => { this.materials = []; }
    });
  }

  loadLoans() {
    this.dynamic.getByPath<any[]>('library/loans?limit=50').subscribe({
      next: res => { this.loans = res ?? []; },
      error: () => { this.loans = []; }
    });
  }

  displayMaterial = (m: any): string =>
    m ? `${m.name}${m.authors ? ' – ' + m.authors : ''} (${m.inventoryCount ?? 0})` : '';

  onMaterialIssueChange(value: any) {
    if (typeof value === 'string') {
      this.selectedMaterialIssue = null;
      const q = value.toLowerCase();
      this.materialResultsIssue = this.materials
        .filter(m =>
          this.safeIncludes(m.name, q) ||
          this.safeIncludes(m.authors, q) ||
          this.safeIncludes(m.id, q)
        )
        .slice(0, 20);
    } else if (value && value.id) {
      this.selectedMaterialIssue = value;
      this.materialQueryIssue = this.displayMaterial(value);
    }
  }

  selectMaterialIssue(m: any) {
    this.selectedMaterialIssue = m;
    this.materialQueryIssue = this.displayMaterial(m);
  }

  onStudentIssueChange(value: any) {
    if (typeof value === 'string') {
      this.selectedStudentIssue = null;
      const q = value.trim();
      if (q.length < 2) { this.studentResultsIssue = []; return; }
      this.dynamic.getByPath<any[]>(`students/search?name=${encodeURIComponent(q)}`).subscribe({
        next: res => this.studentResultsIssue = res ?? [],
        error: () => this.studentResultsIssue = []
      });
    } else if (value && value.id) {
      this.selectedStudentIssue = value;
      this.studentQueryIssue = this.displayStudent(value);
    }
  }

  selectStudentIssue(s: any) {
    this.selectedStudentIssue = s;
    this.studentQueryIssue = this.displayStudent(s);
  }

  onMaterialInvChange(value: any) {
    if (typeof value === 'string') {
      this.selectedMaterialInv = null;
      const q = value.toLowerCase();
      this.materialResultsInv = this.materials
        .filter(m =>
          this.safeIncludes(m.name, q) ||
          this.safeIncludes(m.authors, q) ||
          this.safeIncludes(m.id, q)
        )
        .slice(0, 20);
    } else if (value && value.id) {
      this.selectedMaterialInv = value;
      this.materialQueryInv = this.displayMaterial(value);
    }
  }

  selectMaterialInv(m: any) {
    this.selectedMaterialInv = m;
    this.materialQueryInv = this.displayMaterial(m);
  }

  issueMaterial() {
    this.libraryMessage = null;
    this.libraryError = null;
    if (!this.selectedMaterialIssue || !this.selectedStudentIssue || this.quantityForIssue < 1) {
      this.libraryError = 'Missing fields';
      return;
    }
    const params = new HttpParams()
      .set('teachingMaterialId', this.selectedMaterialIssue.id)
      .set('studentId', String(this.selectedStudentIssue.id))
      .set('quantity', String(this.quantityForIssue));
    this.http.post(`${this.apiBase}/library/issue`, null, { params, ...this.authHeaders() }).subscribe({
      next: (res: any) => {
        this.libraryMessage = `Issued loan #${res.id} to ${res.studentName ?? ''} ${res.indexNumber ? '(' + res.indexNumber + ')' : ''}`.trim();
        this.quantityForIssue = 1;
        this.studentQueryIssue = '';
        this.selectedStudentIssue = null;
        this.materialQueryIssue = '';
        this.selectedMaterialIssue = null;
        this.loadInventory();
        this.loadLoans();
      },
      error: err => this.libraryError = err?.error?.message || 'Issue failed'
    });
  }

  returnLoan() {
    this.libraryMessage = null;
    this.libraryError = null;
    if (!this.loanIdToReturn) { this.libraryError = 'Enter loan ID'; return; }
    this.http.post(`${this.apiBase}/library/return/${this.loanIdToReturn}`, null, this.authHeaders()).subscribe({
      next: (res: any) => {
        this.libraryMessage = `Returned loan #${res.id}`;
        this.loanIdToReturn = null;
        this.loadInventory();
        this.loadLoans();
      },
      error: err => this.libraryError = err?.error?.message || 'Return failed'
    });
  }

  setInventory() {
    this.libraryMessage = null;
    this.libraryError = null;
    if (!this.selectedMaterialInv || this.inventoryCountNew === null || this.inventoryCountNew < 0) {
      this.libraryError = 'Missing fields';
      return;
    }
    const params = new HttpParams().set('count', String(this.inventoryCountNew));
    this.http.post(`${this.apiBase}/library/inventory/${this.selectedMaterialInv.id}`, null, { params, ...this.authHeaders() }).subscribe({
      next: (res: any) => {
        this.libraryMessage = `Inventory set to ${res.inventoryCount} for #${res.id}`;
        this.inventoryCountNew = null;
        this.materialQueryInv = '';
        this.selectedMaterialInv = null;
        this.loadInventory();
      },
      error: err => this.libraryError = err?.error?.message || 'Set inventory failed'
    });
  }
}
