import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './service/loginService/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (loginService.getUser() && loginService.validateRoles(route.data['requiredRoles'])) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
