import { Routes } from '@angular/router';
import { QuestionResolver } from './service/question-resolver/question-resolver.service';
import { authGuard } from './auth.guard';
import { FacultiesComponent } from './components/faculties/faculties.component';
import { StudyProgramsComponent } from './components/study-programs/study-programs.component';
import { UniversityComponent } from './components/university/university.component';

export const routes: Routes = [
  { path: 'university', component: UniversityComponent },
  { path: 'faculty', component: FacultiesComponent },
  { path: 'studyProgram', component: StudyProgramsComponent },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
  path: 'faculty/:facultyId',
  loadComponent: () =>
    import('./components/faculty-detail/faculty-detail.component').then(m => m.FacultyDetailComponent),
  },
  {
  path: 'faculty/:facultyId/:studyProgram',
  loadComponent: () =>
    import('./components/study-programs/study-programs.component').then(m => m.StudyProgramsComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),

  },
  { path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
  {
    path: 'admin-dashboard',
    children: [
      {
        path: '',
        canActivate: [authGuard], 
        data: { requiredRoles: ['ROLE_ADMIN'] },
        loadComponent: () =>
          import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: ':endpoint',
        canActivate: [authGuard],
        data: { requiredRoles: ['ROLE_ADMIN'] },
        loadComponent: () =>
          import('./components/generic-crud/generic-crud.component').then(m => m.GenericCrudComponent),
        resolve: {
          questions: QuestionResolver,
        },
      },
    ],
  },
  {
  path: 'nastavnik-dashboard',
  canActivate: [authGuard],
  data: { requiredRoles: ['ROLE_TEACHER'] },
  loadComponent: () => 
    import('./components/nastavnik-dashboard/nastavnik-dashboard.component').then(m => m.NastavnikDashboardComponent)
  },
  {
  path: 'student-dashboard',
  canActivate: [authGuard],
  data: { requiredRoles: ['ROLE_STUDENT'] },
  loadComponent: () =>
    import('./components/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
  },
  {
  path: 'sluzba-dashboard',
  canActivate: [authGuard],
  data: { requiredRoles: ['ROLE_SLUZBA'] },
  loadComponent: () =>
    import('./components/sluzba-dashboard/sluzba-dashboard.component').then(m => m.SluzbaDashboardComponent),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

