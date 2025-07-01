import { Component, inject } from '@angular/core';
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
import { CribService, SearchFilters } from '../services/crib.service';
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
  private cribService = inject(CribService);
  
  cribs: Crib[] = [];
  loading = false;
  searchQuery = '';
  filterForm: FormGroup;
  showFilters: boolean = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      maxPrice: [null],
      acceptedGenders: [''],
      petsAllowed: [null],
      city: [''],
      minVacancies: [null]
    });

    // Load all cribs initially
    this.loadAllCribs();
  }

  loadAllCribs(): void {
    this.loading = true;
    this.cribService.searchCribs({}).subscribe({
      next: (cribs) => {
        this.cribs = cribs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cribs:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(sidenav?: any): void {
    const {
      maxPrice,
      acceptedGenders,
      petsAllowed,
      city,
      minVacancies
    } = this.filterForm.value;

    const searchFilters: SearchFilters = {};
    
    if (maxPrice) searchFilters.priceMax = maxPrice;
    if (acceptedGenders && acceptedGenders !== '') searchFilters.gender = acceptedGenders;
    if (petsAllowed !== null) searchFilters.petsPolicy = petsAllowed;
    if (city && city.trim() !== '') searchFilters.city = city.trim();
    if (minVacancies) searchFilters.availableVacanciesMin = minVacancies;

    this.loading = true;
    this.cribService.searchCribs(searchFilters).subscribe({
      next: (cribs) => {
        this.cribs = cribs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error applying filters:', error);
        this.loading = false;
      }
    });

    if (sidenav) {
      sidenav.close();
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    console.log('Search query:', query);
    
    if (!query || query.trim() === '') {
      this.loadAllCribs();
    } else {
      this.loading = true;
      const searchTerm = query.toLowerCase().trim();
      
      const searchFilters: SearchFilters = {
        city: searchTerm  
      };
      
      this.cribService.searchCribs(searchFilters).subscribe({
        next: (cribs) => {
          this.cribs = cribs;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching cribs:', error);
          this.loading = false;
        }
      });
    }
  }

  onFiltersChange(filters: any): void {
    console.log('Filters changed:', filters);
  }
}
