import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CribCardComponent } from '../../crib-card/components/crib-card.component';
import { Crib } from '../../models/crib.model';

@Component({
  selector: 'app-crib-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CribCardComponent
  ],
  templateUrl: './crib-list.component.html',
  styleUrl: './crib-list.component.css'
})
export class CribListComponent {
  @Input() cribs: Crib[] = [];
  @Input() loading = false;
} 