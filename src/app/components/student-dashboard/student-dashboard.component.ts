import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { LoginService } from '../../service/loginService/login.service';
import { NavbarComponent } from "../navbar/navbar.component";

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatTabsModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentDto: any | null = null;
  loading = false;
  error: string | null = null;

  constructor(private dynamic: DynamicService, private loginService: LoginService) {}

  ngOnInit(): void {
    const studentId = this.getLoggedStudentId();
    if (!studentId) {
      this.error = 'Student ID not found in JWT token.';
      return;
    }
    this.loadDashboard(studentId);
  }

  private getLoggedStudentId(): number | null {
    const user = this.loginService.getUser();
    return user?.id ?? null;
  }

  private loadDashboard(studentId: number): void {
    this.loading = true;
    this.error = null;

    this.dynamic.getById<any>('students/dashboard', studentId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (dashboard) => {
          this.studentDto = dashboard;
        },
        error: (err) => {
          console.error('Failed to load student dashboard', err);
          this.error = err?.error?.message || err?.message || 'Failed to load student dashboard';
        }
      });
  }
}
