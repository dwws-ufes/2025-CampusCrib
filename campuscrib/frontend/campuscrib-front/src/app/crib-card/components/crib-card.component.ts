import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Crib } from '../../models/crib.model';

@Component({
  selector: 'app-crib-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './crib-card.component.html',
  styleUrl: './crib-card.component.css'
})
export class CribCardComponent {
  @Input() crib!: Crib;
  private router = inject(Router);

  onViewDetails() {
    this.router.navigate(['/crib', this.crib.cribId]);
  }

  onContact() {
    console.log('Contact for crib:', this.crib.id);
  }
} 