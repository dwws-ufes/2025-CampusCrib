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

  crib: Crib | null = null;
  reviews: Review[] = [];
  loading = true;
  cribNotFound = false;
  mockCribs: Crib[] = [
    {
      id: '1',
      title: 'Cozy Student Apartment Near Campus',
      description: 'Perfect for students! Walking distance to university with modern amenities.',
      price: 850,
      numRooms: 2,
      numBathrooms: 1,
      numPeopleAlreadyIn: 1,
      numAvailableVacancies: 1,
      acceptedGenders: 'Any',
      petsPolicy: false,
      location: {
        street: '123 University Ave',
        city: 'College Town',
        state: 'CA',
        zipCode: '90210',
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    {
      id: '2',
      title: 'Luxury Downtown Loft',
      description: 'Modern loft in the heart of downtown with great amenities and city views.',
      price: 1200,
      numRooms: 1,
      numBathrooms: 1,
      numPeopleAlreadyIn: 0,
      numAvailableVacancies: 1,
      acceptedGenders: 'Female',
      petsPolicy: true,
      location: {
        street: '456 Main St',
        city: 'Downtown',
        state: 'CA',
        zipCode: '90211',
        latitude: 34.0525,
        longitude: -118.2440
      }
    },
    {
      id: '3',
      title: 'Shared House with Garden',
      description: 'Beautiful house with private garden, perfect for nature lovers.',
      price: 650,
      numRooms: 3,
      numBathrooms: 2,
      numPeopleAlreadyIn: 2,
      numAvailableVacancies: 1,
      acceptedGenders: 'Male',
      petsPolicy: true,
      location: {
        street: '789 Oak Street',
        city: 'Suburbia',
        state: 'CA',
        zipCode: '90212',
        latitude: 34.0530,
        longitude: -118.2445
      }
    }
  ];

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
    
    setTimeout(() => {
      const foundCrib = this.mockCribs.find(crib => crib.id === id);
      
      if (foundCrib) {
        this.crib = foundCrib;
        this.reviews = this.mockReviews.filter(review => review.cribId === id);
        this.cribNotFound = false;
      } else {
        this.crib = null;
        this.reviews = [];
        this.cribNotFound = true;
      }
      
      this.loading = false;
    }, 500);
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