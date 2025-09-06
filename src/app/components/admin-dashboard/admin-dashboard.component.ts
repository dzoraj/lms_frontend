// inside admin-dashboard.component.ts
import { Component } from '@angular/core';
import { ENTITY_CONFIG } from '../../configurations/entity.config';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { UserRoleManagerComponent } from '../user-role-manager/user-role-manager.component';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [RouterLink, NgFor, NgIf, UserRoleManagerComponent, NavbarComponent],
})
export class AdminDashboardComponent {
  ENTITY_CONFIG = ENTITY_CONFIG;
  entityKeys = Object.keys(ENTITY_CONFIG) as (keyof typeof ENTITY_CONFIG)[];
  
  showUserRoleManager = false;

  getTitle(key: keyof typeof ENTITY_CONFIG): string {
    return this.ENTITY_CONFIG[key].title;
  }

  getEndpoint(key: keyof typeof ENTITY_CONFIG): string {
    return this.ENTITY_CONFIG[key].endpoint;
  }

  toggleRoleManager() {
    this.showUserRoleManager = !this.showUserRoleManager;
  }
}
