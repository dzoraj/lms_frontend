import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: any) {
    return this.http.post('http://localhost:8080/register', user);
  }

  login(user: any) {
    // Clear any existing token before login attempt
    localStorage.removeItem("token");
    return this.http.post<any>("http://localhost:8080/login", user).pipe(
      tap(response => {
        const token = response.token;
        localStorage.setItem("token", token);
        this.loggedInSubject.next(true); // Update login state

        const user = this.getUser();
        const roles = user?.roles || [];

        if (roles.includes("ROLE_ADMIN")) {
          this.router.navigate(['/admin-dashboard']);
        } else if (roles.includes("ROLE_STUDENT")) {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/home']); // fallback
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
      } catch (e) {
        console.error("Invalid token format", e);
        return null;
      }
    }
    return null;
  }

  getRoles(): string[] {
    const user = this.getUser();
    if (user && user.roles) {
      return user.roles;
    }
    return [];
  }

  validateRoles(requiredRoles: string[] = []): boolean {
    const userRoles = this.getRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }

  logout(): void {
    localStorage.removeItem("token");
    this.loggedInSubject.next(false);
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
