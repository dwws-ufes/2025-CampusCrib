import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'https://cribdwws.free.beeceptor.com';

  refreshToken(): Observable<any> {
    const refreshToken = this.auth.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/api/auth/refresh`, { 
      refreshToken 
    }).pipe(
      map((response: any) => {
        if (response.accessToken && response.refreshToken) {
          const tokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          };
          
          // Update tokens while preserving current user data
          const currentUser = this.auth.currentUser();
          if (currentUser) {
            this.auth.loginWithTokens(tokens);
          }
          
          return response;
        }
        throw new Error('Invalid refresh response');
      }),
      catchError((error) => {
        // If refresh fails, logout user
        this.auth.logout();
        return throwError(() => error);
      })
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp < currentTime : false;
    } catch {
      return true;
    }
  }
} 