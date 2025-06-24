import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const landlordGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();
  
  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  if (currentUser.role !== 'LANDLORD') {
    router.navigate(['/']);
    return false;
  }

  return true;
}; 