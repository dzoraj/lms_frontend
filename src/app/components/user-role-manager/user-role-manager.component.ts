import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-role-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
  
    <div class="role-manager">
      <h3>Manage User Roles</h3>

      <form (ngSubmit)="assignRole()">
        <label>User ID:
          <input type="number" [(ngModel)]="userId" name="userId" required />
        </label>

        <label>Role:
          <select [(ngModel)]="roleName" name="roleName" required>
            <option *ngFor="let role of availableRoles" [value]="role.name">
              {{ role.name }}
            </option>
          </select>
        </label>

        <button type="submit">Assign Role</button>
        <button type="button" (click)="removeRole()">Remove Role</button>
      </form>

      <p *ngIf="message" style="color: green;">{{ message }}</p>
      <p *ngIf="error" style="color: red;">{{ error }}</p>
    </div>
  `,
  styles: [`
    .role-manager {
      border: 1px solid #ccc;
      padding: 1rem;
      margin-top: 1rem;
      width: 300px;
      border-radius: 10px;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input, select {
      width: 100%;
      padding: 4px;
    }
    button {
      margin-top: 0.5rem;
      margin-right: 0.5rem;
    }
  `]
})
export class UserRoleManagerComponent implements OnInit {
  userId!: number;
  roleName: string = '';
  message: string = '';
  error: string = '';
  availableRoles: { id: number; name: string }[] = [];

  constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.http.get<any[]>('http://localhost:8080/api/role').subscribe({
      next: roles => {
      console.log('Fetched roles:', roles); 
      this.availableRoles = roles;
    },
    error: err => {
      console.error('Error fetching roles:', err);
      this.error = 'Failed to load roles';
    }
  });
}


  assignRole() {
    this.http.post(`http://localhost:8080/api/administrator/assign-role`, {
      userId: this.userId,
      roleName: this.roleName
    }, { responseType: 'text' }).subscribe({
      next: res => {
        this.clearMessages();
        this.message = res; 
      },
      error: err => {
        this.clearMessages();
        this.error = err.error || 'Failed to assign role';
      }
    });

  }

  removeRole() { //not working
    this.clearMessages();
    this.http.delete(`http://localhost:8080/api/administrator/remove-role`, {
      params: { userId: this.userId, roleName: this.roleName }
    }).subscribe({
      next: () => this.message = `Removed role "${this.roleName}" from user ${this.userId}`,
      error: err => this.error = err.error?.message || 'Failed to remove role'
    });
  }

  private clearMessages() {
    this.message = '';
    this.error = '';
  }
}
