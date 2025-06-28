import { Injectable, signal, inject } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { StorageService } from './storage.service';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);

  constructor() {
    this.initializeFromStorage();
  }

  get currentUser() {
    return this._currentUser.asReadonly();
  }

  get tokens() {
    return this.storageService.tokens;
  }

  get isLoading() {
    return this._isLoading.asReadonly();
  }

  private initializeFromStorage() {
    const tokens = this.storageService.initializeFromStorage();
    
    if (tokens) {
      this.fetchAndSetCurrentUser();
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

  loginWithTokens(tokens: AuthTokens) {
    this.storageService.setTokens(tokens);
    this.fetchAndSetCurrentUser();
  }

  login(user: User) {
    this._currentUser.set(user);
  }

  logout() {
    this._currentUser.set(null);
    this.storageService.clearTokens();
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }

  getAccessToken(): string | null {
    return this.storageService.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.storageService.getRefreshToken();
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