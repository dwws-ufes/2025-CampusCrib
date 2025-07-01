import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'campuscrib-front';
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToLandlordDashboard() {
    this.router.navigate(['/landlord-dashboard']);
  }
}
