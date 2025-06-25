import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message-dialog/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);
  private apiUrl = 'http://localhost:8080';

  register(formData: any) {
    const formDataToSend = new FormData();
    const userData ={
      firstName: formData.firstName, 
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      birthDate: formData.birthDate,
      role: formData.role,
      legalGuardian: formData.legalGuardian || ''
    };

    formDataToSend.append('data', JSON.stringify(userData));
   
    if (formData.profileImage) {
      formDataToSend.append('profileImage', formData.profileImage);
    }

    return this.http.post(`${this.apiUrl}/api/registration/users/register`, formDataToSend).subscribe({
      next: (response: any) => {
        try {
          if (response.accessToken && response.refreshToken) {
            const tokens = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            };

            const userData: Partial<User> = {
              id: response.id,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              emailConfirmed: response.emailConfirmed ?? false,
              birthDate: formData.birthDate,
              profileImage: response.profileImage || '',
              role: formData.role,
              legalGuardian: formData.legalGuardian
            };

            this.auth.loginWithTokens(tokens);
          } else {
            const newUser: User = {
              id: response.id,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              emailConfirmed: response.emailConfirmed,
              birthDate: response.birthDate,
              profileImage: response.profileImage,
              role: response.role,
              legalGuardian: response.legalGuardian
            };
            
            this.auth.login(newUser);
          }
          
          this.message.success('Registration successful');
          this.router.navigate(['/profile']);
        } catch (error) {
          console.error('Error processing registration response:', error);
          this.message.error('Registration successful but failed to process user data');
        }
      },
      error: (error) => {
        this.message.error('Registration failed');
        console.error('Registration error:', error);
      }
    });
  }
} 