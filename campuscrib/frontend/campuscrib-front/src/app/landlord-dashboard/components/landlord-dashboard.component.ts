import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { CribService } from '../../crib/services/crib.service';
import { Crib } from '../../models/crib.model';
import { CribEditComponent } from '../../crib-edit/components/crib-edit.component';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './landlord-dashboard.component.html',
  styleUrl: './landlord-dashboard.component.css'
})
export class LandlordDashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cribService = inject(CribService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private routerSubscription?: Subscription;

  currentUser = this.authService.currentUser;
  myCribs$: Observable<Crib[]> = this.cribService.getCribsByLandlord();

  loading = false;
  viewMode: 'grid' | 'list' = 'grid';

  private reloadCribs() {
    this.myCribs$ = this.cribService.getCribsByLandlord();
  }

  ngOnInit() {
    const user = this.currentUser();
    if (!user || user.role !== 'LANDLORD') {
      this.router.navigate(['/']);
      return;
    }

    this.reloadCribs();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/landlord-dashboard') {
          console.log('Reloading cribs after navigation to dashboard');
          this.reloadCribs();
        }
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onCreateCrib() {
    this.router.navigate(['/crib-registration']);
  }

  onEditCrib(crib: Crib) {
    const dialogRef = this.dialog.open(CribEditComponent, {
      width: '800px',
      data: { crib }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Crib updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.reloadCribs();
      }
    });
  }

  onDeleteCrib(crib: Crib) {
    const confirmed = confirm(`Are you sure you want to delete "${crib.title}"? This action cannot be undone.`);
    
    if (confirmed) {
      this.cribService.deleteCrib(crib.id).subscribe({
        next: () => {
          this.snackBar.open('Crib deleted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.reloadCribs();
        },
        error: () => {
          this.snackBar.open('Failed to delete Crib. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onViewCrib(crib: Crib) {
    this.router.navigate(['/crib', crib.id]);
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getOccupancyStatus(crib: Crib): string {
    const totalCapacity = crib.numPeopleAlreadyIn + crib.numAvailableVacancies;
    const occupancyRate = totalCapacity > 0 ? (crib.numPeopleAlreadyIn / totalCapacity) * 100 : 0;
    
    if (occupancyRate === 100) return 'Full';
    if (occupancyRate >= 75) return 'High';
    if (occupancyRate >= 50) return 'Medium';
    if (occupancyRate > 0) return 'Low';
    return 'Empty';
  }

  getOccupancyColor(status: string): string {
    switch (status) {
      case 'Full': return 'warn';
      case 'High': return 'accent';
      case 'Medium': return 'primary';
      case 'Low': return '';
      case 'Empty': return '';
      default: return '';
    }
  }
} 