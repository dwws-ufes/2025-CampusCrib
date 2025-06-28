import { Injectable, signal } from '@angular/core';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _tokens = signal<AuthTokens | null>(null);

  get tokens() {
    return this._tokens.asReadonly();
  }

  initializeFromStorage() {
    const storedTokens = localStorage.getItem('authTokens');
    
    if (storedTokens) {
      try {
        const tokens: AuthTokens = JSON.parse(storedTokens);
        
        if (this.isTokenValid(tokens.accessToken)) {
          this._tokens.set(tokens);
          return tokens;
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
      }
    }
    return null;
  }

  setTokens(tokens: AuthTokens) {
    this._tokens.set(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));
  }

  clearTokens() {
    this._tokens.set(null);
    localStorage.removeItem('authTokens');
  }

  getAccessToken(): string | null {
    const tokens = this._tokens();
    return tokens ? tokens.accessToken : null;
  }

  getRefreshToken(): string | null {
    const tokens = this._tokens();
    return tokens ? tokens.refreshToken : null;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp < currentTime : false;
    } catch {
      return true;
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp > currentTime : true;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
