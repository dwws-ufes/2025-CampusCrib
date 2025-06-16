import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CribSearchComponent } from '../../crib-search/components/crib-search.component';
import { CribListComponent } from '../../crib-list/components/crib-list.component';
import { Crib } from '../../models/crib.model';

@Component({
  selector: 'app-crib',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CribSearchComponent,
    CribListComponent
  ],
  templateUrl: './crib.component.html',
  styleUrl: './crib.component.css'
})
export class CribComponent {
  cribs: Crib[] = [];
  loading = false;
  searchQuery = '';
  // userLocation: GeolocationCoordinates | null = null;

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

  constructor() {
    this.cribs = this.mockCribs;
    // console.log("Geolocation User", this.userLocation);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    console.log('Search query:', query);
  }

  onFiltersChange(filters: any) {
    console.log('Filters changed:', filters);
  }
} 