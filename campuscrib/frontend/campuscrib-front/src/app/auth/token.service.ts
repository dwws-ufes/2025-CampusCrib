import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private apiUrl = 'http://localhost:8081';

  refreshToken(): Observable<any> {
    const refreshToken = this.storageService.getRefreshToken();
    
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
          
          // Update tokens in storage
          this.storageService.setTokens(tokens);
          
          return response;
        }
        throw new Error('Invalid refresh response');
      }),
      catchError((error) => {
        // If refresh fails, clear tokens
        this.storageService.clearTokens();
        return throwError(() => error);
      })
    );
  }

  isTokenExpired(token: string): boolean {
    return this.storageService.isTokenExpired(token);
  }
} 