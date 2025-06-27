import { Injectable, signal, inject } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userService = inject(UserService);
  private _currentUser = signal<User | null>(null);
  private _tokens = signal<AuthTokens | null>(null);
  private _isLoading = signal<boolean>(false);

  constructor() {
    this.initializeFromStorage();
  }

  get currentUser() {
    return this._currentUser.asReadonly();
  }

  get tokens() {
    return this._tokens.asReadonly();
  }

  get isLoading() {
    return this._isLoading.asReadonly();
  }

  private initializeFromStorage() {
    const storedTokens = localStorage.getItem('authTokens');
    
    if (storedTokens) {
      try {
        const tokens: AuthTokens = JSON.parse(storedTokens);
        
        if (this.isTokenValid(tokens.accessToken)) {
          this._tokens.set(tokens);
          this.fetchAndSetCurrentUser();
        }
        // } else {
        //   this.clearStorage();
        // }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        // this.clearStorage();
      }
    }
  }

  private fetchAndSetCurrentUser() {
    this._isLoading.set(true);
    
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this._currentUser.set(user);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch user data:', error);
        this.logout();
        this._isLoading.set(false);
      }
    });
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

  loginWithTokens(tokens: AuthTokens) {
    this._tokens.set(tokens);
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    this.fetchAndSetCurrentUser();
  }

  login(user: User) {
    this._currentUser.set(user);
  }

  logout() {
    this._currentUser.set(null);
    this._tokens.set(null);
    this.clearStorage();
  }

  private clearStorage() {
    localStorage.removeItem('authTokens');
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }

  getAccessToken(): string | null {
    const tokens = this._tokens();
    return tokens ? tokens.accessToken : null;
  }

  getRefreshToken(): string | null {
    const tokens = this._tokens();
    return tokens ? tokens.refreshToken : null;
  }

  refreshUserData() {
    if (this.isAuthenticated()) {
      this.fetchAndSetCurrentUser();
    }
  }

  loginAsMockLandlord() {
    const mockLandlord: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      emailConfirmed: true,
      birthDate: new Date('1980-05-15'),
      profileImage: '',
      role: 'LANDLORD'
    };
    this.login(mockLandlord);
  }
} 