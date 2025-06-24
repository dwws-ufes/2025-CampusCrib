import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CribSearchComponent } from '../../crib-search/components/crib-search.component';
import { CribListComponent } from '../../crib-list/components/crib-list.component';
import { Crib } from '../../models/crib.model';

@Component({
  selector: 'app-crib',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    CribSearchComponent,
    CribListComponent
  ],
  templateUrl: './crib.component.html',
  styleUrls: ['./crib.component.css']
})
export class CribComponent {
  cribs: Crib[] = [];
  mockCribs: Crib[] = [];
  loading = false;
  searchQuery = '';
  filterForm: FormGroup;
  showFilters: boolean = false; // ✅ [ajuste] - controle de exibição da barra de filtros

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      maxPrice: [null],
      acceptedGenders: [''],
      petsAllowed: [null],
      city: [''],
      minVacancies: [null]
    });

    this.mockCribs = [
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

    this.cribs = [...this.mockCribs];
  }

  applyFilters(sidenav?: any): void {
    const {
      maxPrice,
      acceptedGenders,
      petsAllowed,
      city,
      minVacancies
    } = this.filterForm.value;

    this.cribs = this.mockCribs.filter(crib => {
      return (
        (!maxPrice || crib.price <= maxPrice) &&
        (!acceptedGenders || crib.acceptedGenders === acceptedGenders) &&
        (petsAllowed === null || crib.petsPolicy === petsAllowed) &&
        (!city || crib.location.city.toLowerCase().includes(city.toLowerCase())) &&
        (!minVacancies || crib.numAvailableVacancies >= minVacancies)
      );
    });

    if (sidenav) {
      sidenav.close();
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    console.log('Search query:', query);
  }

  onFiltersChange(filters: any): void {
    console.log('Filters changed:', filters);
  }
}
