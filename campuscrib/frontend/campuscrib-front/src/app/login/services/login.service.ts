import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message-dialog/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);

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
      this.message.success('Login successful');
      this.router.navigate(['/profile']);
      return true;
    }
    this.message.error('Invalid credentials');
    return false;
  }
}
