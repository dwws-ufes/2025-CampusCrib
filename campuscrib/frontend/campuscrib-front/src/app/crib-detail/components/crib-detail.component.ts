import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Crib } from '../../models/crib.model';
import { Review } from '../../models/review.model';
import { CribService } from '../../crib/services/crib.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-crib-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './crib-detail.component.html',
  styleUrl: './crib-detail.component.css'
})
export class CribDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cirbService = inject(CribService);

  crib: Crib | null = null;
  reviews: Review[] = [];
  loading = true;
  cribNotFound = false;

  mockReviews: Review[] = [
    {
      id: '1',
      rating: 4.5,
      comment: 'Great place to stay! Very clean and close to campus. The landlord was responsive and helpful.',
      userId: '1',
      cribId: '1',
      user: {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        emailConfirmed: true,
        passwordHashed: '',
        birthDate: new Date('1999-03-15'),
        profileImage: '',
        role: 'TENANT'
      },
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      rating: 5.0,
      comment: 'Perfect for students! Walking distance to everything I need. Highly recommend!',
      userId: '2',
      cribId: '1',
      user: {
        id: '2',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@email.com',
        emailConfirmed: true,
        passwordHashed: '',
        birthDate: new Date('2000-07-22'),
        profileImage: '',
        role: 'TENANT'
      },
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      rating: 4.0,
      comment: 'Nice loft with amazing city views. A bit pricey but worth it for the location and amenities.',
      userId: '3',
      cribId: '2',
      user: {
        id: '3',
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma.davis@email.com',
        emailConfirmed: true,
        passwordHashed: '',
        birthDate: new Date('1998-11-08'),
        profileImage: '',
        role: 'TENANT'
      },
      createdAt: new Date('2024-01-20')
    },
    {
      id: '4',
      rating: 4.8,
      comment: 'Love the garden! Perfect for someone who enjoys nature. The house is spacious and well-maintained.',
      userId: '4',
      cribId: '3',
      user: {
        id: '4',
        firstName: 'Alex',
        lastName: 'Rodriguez',
        email: 'alex.r@email.com',
        emailConfirmed: true,
        passwordHashed: '',
        birthDate: new Date('1997-05-30'),
        profileImage: '',
        role: 'TENANT'
      },
      createdAt: new Date('2024-01-12')
    }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const cribId = params['id'];
      this.loadCribDetails(cribId);
    });
  }

  loadCribDetails(id: string) {
    this.loading = true;

    this.cirbService
      .getCribById(id)
      .pipe(first())
      .subscribe({
        next: (crib) => {
          this.crib = crib;
          this.reviews = this.mockReviews.filter((r) => r.cribId === id);
          this.cribNotFound = false;
          this.loading = false;
        },
        error: () => {
          this.crib = null;
          this.reviews = [];
          this.cribNotFound = true;
          this.loading = false;
        }
      });
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onContact() {
    console.log('Contact landlord for crib:', this.crib?.id);
  }

  onShare() {
    console.log('Share crib:', this.crib?.id);
  }

  onFavorite() {
    console.log('Add to favorites:', this.crib?.id);
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
} 