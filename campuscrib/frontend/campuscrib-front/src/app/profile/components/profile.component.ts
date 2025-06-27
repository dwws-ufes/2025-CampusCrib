import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private login = inject(LoginService);
  readonly user = this.auth.currentUser;
  readonly isLoading = this.auth.isLoading;

  logout() {
    this.auth.logout();
    this.login.logout();
    this.router.navigate(['/login']);
  }

  refreshProfile() {
    this.auth.refreshUserData();
  }
} 