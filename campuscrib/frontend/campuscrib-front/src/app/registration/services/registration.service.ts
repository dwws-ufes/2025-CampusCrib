import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message-dialog/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);

  register(formData: any) {
    const newUser: User = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      isEmailConfirmed: true,
      passwordHashed: formData.password,
      birthDate: formData.birthDate,
      profileImage: '',
      role: formData.role
    };
    this.auth.login(newUser);
    this.message.success('Registration successful');
    this.router.navigate(['/profile']);
    return true;
  }
} 