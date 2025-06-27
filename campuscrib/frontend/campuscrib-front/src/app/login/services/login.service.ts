import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
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
  private apiUrl = 'http://localhost:8081';

  login(credentials: any) {
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post(`${this.apiUrl}/api/auth/login`, loginData).subscribe({
      next: (response: any) => {
        try {
          const tokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          };

          this.auth.loginWithTokens(tokens);
          this.message.success('Login successful').afterClosed().subscribe(() => {
            this.router.navigate(['/profile']);
          });
          return;
        } catch (error) {
          console.error('Error processing login response:', error);
          this.message.error('Login successful but failed to process user data');
        }
      },
      error: (error) => {
        this.message.error('Invalid credentials');
        console.error('Login error:', error);
      }
    });
  }

  logout() {
    const accessToken = this.auth.getAccessToken();
    const logoutData = accessToken ? { accessToken } : {};
    
    return this.http.post(`${this.apiUrl}/api/auth/logout`, logoutData).subscribe({
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
