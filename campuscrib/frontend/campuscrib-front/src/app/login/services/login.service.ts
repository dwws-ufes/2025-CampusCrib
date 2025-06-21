import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message-dialog/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);
  private apiUrl = 'http://localhost:8080';

  login(credentials: any) {
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post(`${this.apiUrl}/api/auth/login`, loginData).subscribe({
      next: (response: any) => {
        const mockUser: User = {
          firstName: 'Mock',
          lastName: 'User',
          email: credentials.email,
          emailConfirmed: true,
          passwordHashed: credentials.password,
          birthDate: '2000-01-01',
          profileImage: '',
          role: 'TENANT'
        };
        this.auth.login(mockUser);
        this.message.success('Login successful');
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.message.error('Invalid credentials');
        console.error('Login error:', error);
      }
    });
  }

  logout() {
    return this.http.post(`${this.apiUrl}/api/auth/logout`, {}).subscribe({
      next: (response: any) => {
        this.auth.logout();
        this.message.success('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.auth.logout();
        this.router.navigate(['/login']);
        console.error('Logout error:', error);
      }
    });
  }
}
