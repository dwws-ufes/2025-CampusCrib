import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private auth = inject(AuthService);
  private router = inject(Router);

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
    this.router.navigate(['/profile']);
    return true;
  }
} 