import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://cribdwws.free.beeceptor.com';

  getCurrentUser(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/api/registration/users/me`).pipe(
      map(response => ({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        emailConfirmed: response.emailConfirmed,
        birthDate: response.birthDate,
        profileImage: response.profileImage || '',
        role: response.role,
        legalGuardian: response.legalGuardian
      })),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(userData: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/api/registration/users/me`, userData).pipe(
      map(response => ({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        emailConfirmed: response.emailConfirmed,
        birthDate: response.birthDate,
        profileImage: response.profileImage || '',
        role: response.role,
        legalGuardian: response.legalGuardian
      })),
      catchError(error => {
        console.error('Error updating user data:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/api/registration/users/${userId}`).pipe(
      map(response => ({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        emailConfirmed: response.emailConfirmed,
        birthDate: response.birthDate,
        profileImage: response.profileImage || '',
        role: response.role,
        legalGuardian: response.legalGuardian
      })),
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return throwError(() => error);
      })
    );
  }
} 