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
import { CribService } from '../services/crib.service';
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
  allCribs: Crib[] = [];
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

    // Load cribs from service
    this.allCribs = this.cribService.getAllCribs();
    this.cribs = [...this.allCribs];
  }

  applyFilters(sidenav?: any): void {
    const {
      maxPrice,
      acceptedGenders,
      petsAllowed,
      city,
      minVacancies
    } = this.filterForm.value;

    this.cribs = this.allCribs.filter(crib => {
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
