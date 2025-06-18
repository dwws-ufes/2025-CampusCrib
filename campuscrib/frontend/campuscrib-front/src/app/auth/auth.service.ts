import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);

  get currentUser() {
    return this._currentUser.asReadonly();
  }

  login(user: User) {
    this._currentUser.set(user);
  }

  logout() {
    this._currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }
} 