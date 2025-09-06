import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Subscription } from 'rxjs';
import { LoginService } from '../../service/loginService/login.service';
import { SelectedFacultyService } from '../../service/selected-faculty.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  selectedFaculty: number | null = null;
  isLoggedIn = false;
  isAdmin = false;
  isStudent = false;
  isTeacher = false;
  isSluzba = false;


  private loginSub?: Subscription;
  private facultySub?: Subscription;

  constructor(
    private loginService: LoginService,
    private selectedFacultyService: SelectedFacultyService
  ) {}

  ngOnInit() {
    this.loginSub = this.loginService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;

      const roles = this.loginService.getRoles();
      console.log('JWT roles:', roles); // 👈 LOG za debug

      if (loggedIn) {
        this.isAdmin = roles.includes('ROLE_ADMIN');
        this.isStudent = roles.includes('ROLE_STUDENT');
        this.isTeacher = roles.includes('ROLE_NASTAVNIK');
        this.isSluzba = roles.includes('ROLE_SLUZBA');
      } else {
        this.isAdmin = false;
        this.isStudent = false;
        this.isTeacher = false;
        this.isSluzba = false;
      }
    });

    this.facultySub = this.selectedFacultyService.selectedFaculty$.subscribe(slug => {
      this.selectedFaculty = slug;
    });
  }

  logout() {
    this.loginService.logout();
  }

  ngOnDestroy() {
    this.loginSub?.unsubscribe();
    this.facultySub?.unsubscribe();
  }
}
