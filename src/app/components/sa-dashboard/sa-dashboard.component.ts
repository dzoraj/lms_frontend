import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { finalize } from 'rxjs';
import { SchedulePlannerComponent } from "../schedule-planner/schedule-planner.component";

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
    SchedulePlannerComponent
],
  templateUrl: './sa-dashboard.component.html',
  styleUrls: ['./sa-dashboard.component.css']
})
export class SaDashboardComponent implements OnInit {
  studyYears: any[] = [];
  enrollments: any[] = [];
  studentResults: any[] = [];
  selectedStudent: any | null = null;
  newEnrollment = {
    studentId: null as number | null,
    studyYearId: null as number | null,
    indexNumber: ''
  };

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

  constructor(private dynamic: DynamicService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.dynamic.getByPath<any[]>('studyYear')
      .subscribe(yrs => this.studyYears = yrs ?? []);
    this.dynamic.getByPath<any[]>('studentInYear')
      .pipe(finalize(() => this.loading = false))
      .subscribe(enr => this.enrollments = enr ?? []);
  }

  searchStudents(query: string) {
    if (!query || query.length < 2) {
      this.studentResults = [];
      return;
    }
    this.dynamic.getByPath<any[]>(`students/search?name=${encodeURIComponent(query)}`)
      .subscribe({
        next: (res) => this.studentResults = res ?? [],
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
      this.error = "Please select student and study year";
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
        this.success = "Enrollment saved!";
        this.newEnrollment = { studentId: null, studyYearId: null, indexNumber: '' };
        this.selectedStudent = null;
        this.studentResults = [];
        this.loadAll();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => this.error = err?.error?.message || 'Failed to enroll student'
    });
  }

  searchUsersForRole() {
    if (!this.roleUserSearch.trim()) {
      this.filteredUsers = [];
      this.selectedUserRoles = [];
      return;
    }
    const params = new HttpParams().set('query', this.roleUserSearch);
    this.http.get<any[]>('http://localhost:8080/api/administrator/search-users', { params })
      .subscribe({
        next: users => {
          this.filteredUsers = users;
        },
        error: () => this.roleError = 'Failed to search users'
      });
  }

  onUserChange() {
    const user = this.filteredUsers.find(u => u.id === this.selectedUserId);
    this.selectedUserRoles = user ? user.roles : [];
  }

  assignStudentRole() {
    if (!this.selectedUserId) return;
    this.http.post(`http://localhost:8080/api/student-administration/assign-student-role`, {
      userId: this.selectedUserId,
      roleName: 'STUDENT'
    }, { responseType: 'text' }).subscribe({
      next: res => {
        this.roleMessage = res;
        this.roleError = null;
        this.onUserChange();
      },
      error: err => this.roleError = err.error || 'Failed to assign role'
    });
  }

  removeStudentRole() {
    if (!this.selectedUserId) return;
    const params = new HttpParams().set('userId', this.selectedUserId.toString());
    this.http.delete(`http://localhost:8080/api/student-administration/remove-student-role`, { params })
      .subscribe({
        next: () => {
          this.roleMessage = `Removed STUDENT role from user ${this.selectedUserId}`;
          this.roleError = null;
          this.onUserChange();
        },
        error: err => this.roleError = err.error || 'Failed to remove role'
      });
  }
  searchStudentsForDocs(query: string) {
  if (!query || query.length < 2) {
    this.docStudentResults = [];
    return;
  }
  this.dynamic.getByPath<any[]>(`students/search?name=${encodeURIComponent(query)}`)
    .subscribe({
      next: (res) => this.docStudentResults = res ?? [],
      error: () => this.docStudentResults = []
    });
}

selectDocStudent(student: any) {
  this.selectedDocStudent = student;
}

downloadDocument() {
  if (!this.selectedDocStudent || !this.selectedTemplate) {
    this.docError = "Please select student and document type.";
    return;
  }
  this.docError = null;

  this.dynamic.getByPathBlob(`documents/${this.selectedTemplate}/${this.selectedDocStudent.id}`)
    .subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedTemplate}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.docError = "Failed to generate document"
    });
}
}