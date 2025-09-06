import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Role } from '../../model/users/role.model';
import { User } from '../../model/users/user.model';

@Component({
  selector: 'app-user-role-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="role-manager-container">
      <div class="role-manager">
        <h3>Manage User Roles</h3>

        <form (ngSubmit)="assignRole()">
          <label>User:
            <input type="text" [(ngModel)]="userSearch" (input)="searchUsers()" name="userSearch" placeholder="Search by name or email..." />
          </label>

          <label *ngIf="filteredUsers.length > 0">Select User:
            <select [(ngModel)]="selectedUserId" (ngModelChange)="onUserChange()" name="selectedUserId" required size="5">
              <option *ngFor="let user of filteredUsers" [ngValue]="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </label>

          <label>Role:
            <select [(ngModel)]="roleName" name="roleName" required>
              <option *ngFor="let role of availableRoles" [value]="role.name">
                {{ role.name }}
              </option>
            </select>
          </label>

          <button type="submit" [disabled]="!selectedUserId || !roleName">Assign Role</button>
          <button type="button" (click)="removeRole()" [disabled]="!selectedUserId || !roleName">Remove Role</button>
        </form>

        <p *ngIf="message" style="color: green;">{{ message }}</p>
        <p *ngIf="error" style="color: red;">{{ error }}</p>
      </div>

      <div class="user-roles-table" *ngIf="selectedUserRoles.length > 0">
        <h4>Roles for selected user:</h4>
        <table>
          <thead>
            <tr>
              <th>Role Name</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let role of selectedUserRoles">
              <td>{{ role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .role-manager-container {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }
    .role-manager {
      border: 1px solid #ccc;
      padding: 1rem;
      width: 350px;
      border-radius: 10px;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input, select {
      width: 100%;
      padding: 4px;
      margin-bottom: 0.5rem;
    }
    button {
      margin-top: 0.5rem;
      margin-right: 0.5rem;
    }
    .user-roles-table {
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 10px;
      min-width: 200px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #999;
      padding: 4px 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  `]
})
export class UserRoleManagerComponent implements OnInit {
  userSearch = '';
  selectedUserId!: number;
  roleName = '';
  message = '';
  error = '';
  availableRoles: Role[] = [];
  filteredUsers: User[] = []; 
  selectedUserRoles: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load all roles
    this.http.get<Role[]>('http://localhost:8080/api/role')
      .subscribe({
        next: roles => this.availableRoles = roles,
        error: err => this.error = 'Failed to load roles'
      });

    // Load initial users
    this.http.get<any[]>('http://localhost:8080/api/administrator/search-users', { params: new HttpParams().set('query', '') })
      .subscribe({
        next: users => {
          this.filteredUsers = users.map(u => ({
            ...u,
            roles: u.roles.map((roleName: string) => ({ name: roleName }))
          }));
        },
        error: err => this.error = 'Failed to load users'
      });
  }

  clearMessages() {
    this.message = '';
    this.error = '';
  }

  searchUsers() {
    if (!this.userSearch.trim()) {
      this.filteredUsers = [];
      this.selectedUserRoles = [];
      return;
    }

    const params = new HttpParams().set('query', this.userSearch);
    this.http.get<any[]>('http://localhost:8080/api/administrator/search-users', { params })
      .subscribe({
        next: users => {
          this.filteredUsers = users.map(u => ({
            ...u,
            roles: u.roles.map((roleName: string) => ({ name: roleName }))
          }));
        },
        error: err => this.error = 'Failed to search users'
      });
  }

  onUserChange() {
    const user = this.filteredUsers.find(u => u.id === this.selectedUserId);
    this.selectedUserRoles = user ? user.roles.map(r => r.name) : [];
  }

  assignRole() {
    if (!this.selectedUserId || !this.roleName) return;

    this.clearMessages();
    this.http.post(`http://localhost:8080/api/administrator/assign-role`, {
      userId: this.selectedUserId,
      roleName: this.roleName
    }, { responseType: 'text' }).subscribe({
      next: res => {
        this.message = res;
        this.onUserChange();
      },
      error: err => this.error = err.error || 'Failed to assign role'
    });
  }

  removeRole() {
    if (!this.selectedUserId || !this.roleName) return;

    this.clearMessages();
    const params = new HttpParams()
      .set('userId', this.selectedUserId.toString())
      .set('roleName', this.roleName);

    this.http.delete(`http://localhost:8080/api/administrator/remove-role`, { params })
      .subscribe({
        next: () => {
          this.message = `Removed role "${this.roleName}" from user ${this.selectedUserId}`;
          this.onUserChange();
        },
        error: err => this.error = err.error || 'Failed to remove role'
      });
  }
}
