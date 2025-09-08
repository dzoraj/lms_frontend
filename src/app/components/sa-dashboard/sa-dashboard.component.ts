import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-sa-dashboard',
  standalone: true,
  templateUrl: './sa-dashboard.component.html',
  styleUrls: ['./sa-dashboard.component.css'],
  imports: [NavbarComponent],
})
export class SaDashboardComponent {}
