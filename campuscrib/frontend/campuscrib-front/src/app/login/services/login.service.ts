import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private auth = inject(AuthService);
  private router = inject(Router);

  login(credentials: any) {
    if (credentials.email && credentials.password && credentials.password.length >= 6) {
      const mockUser: User = {
        firstName: 'Mock',
        lastName: 'User',
        email: credentials.email,
        isEmailConfirmed: true,
        passwordHashed: credentials.password,
        birthDate: '2000-01-01',
        profileImage: '',
        role: 'Tenant'
      };
      this.auth.login(mockUser);
      this.router.navigate(['/profile']);
      return true;
    }
    console.warn('Login failed');
    return false;
  }
}
