import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { 
  SemanticUniversityService, 
  UniversitySearchResult, 
  CityInfo 
} from '../../services/semantic-university.service';

@Component({
  selector: 'app-university-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './university-search.component.html',
  styleUrls: ['./university-search.component.css']
})
export class UniversitySearchComponent implements OnInit {
  searchForm: FormGroup;
  loading = false;
  searchResult: UniversitySearchResult | null = null;
  hasSearched = false;
  
  popularCities = [
    'Vitória',
    'Aracruz',
  ];

  constructor(
    private fb: FormBuilder,
    private semanticUniversityService: SemanticUniversityService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      cityName: ['Vitória', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.searchCity('Vitória', false);
  }

  onSearchSubmit() {
    if (this.searchForm.valid) {
      const cityName = this.searchForm.get('cityName')?.value.trim();
      this.searchCity(cityName, true);
    }
  }

  searchCity(cityName: string, showSnackbar: boolean = false) {
    if (!cityName || cityName.trim().length < 2) {
      return;
    }

    this.loading = true;
    this.hasSearched = true;

    this.semanticUniversityService.searchUniversitiesInCity(cityName).subscribe({
      next: (result) => {
        this.searchResult = result;
        this.loading = false;
        
        if (showSnackbar) {
          const message = result.universities.length > 0 
            ? `Found ${result.universities.length} universities in ${result.city.name}`
            : `No universities found in ${cityName}`;
          this.snackBar.open(message, 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Search failed:', error);
        this.loading = false;
        this.snackBar.open('Search failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  quickSearch(cityName: string) {
    this.searchForm.patchValue({ cityName });
    this.searchCity(cityName, true);
  }

  exportResults(format: 'turtle' | 'jsonld') {
    if (this.searchResult) {
      this.semanticUniversityService.exportSearchResults(this.searchResult, format);
      this.snackBar.open(`Exported as ${format.toUpperCase()}`, 'Close', { duration: 2000 });
    }
  }

  copyToClipboard(text: string, label: string = 'Text') {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open(`${label} copied to clipboard`, 'Close', { duration: 2000 });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.snackBar.open('Failed to copy to clipboard', 'Close', { duration: 2000 });
    });
  }

  getUniversityTypeIcon(type: string): string {
    return type === 'University' ? 'school' : 'business';
  }

  getUniversityTypeColor(type: string): string {
    return type === 'University' ? 'primary' : 'accent';
  }

  formatFoundingYear(year?: number): string {
    return year ? `Founded in ${year}` : 'Founding year unknown';
  }


  formatCoordinates(city: CityInfo): string {
    return `${city.coordinates.lat.toFixed(4)}, ${city.coordinates.lng.toFixed(4)}`;
  }

  
  openDbpediaResource(uri: string) {
    window.open(uri, '_blank');
  }

  getFormattedSparqlQuery(): string {
    return this.searchResult?.sparqlQuery || '';
  }

  getFormattedRdf(): string {
    return this.searchResult?.generatedRdf || '';
  }


  hasResults(): boolean {
    return this.searchResult !== null && this.searchResult.universities.length > 0;
  }

  getSearchStats(): string {
    if (!this.searchResult) return '';
    
    const count = this.searchResult.universities.length;
    const city = this.searchResult.city.name;
    
    if (count === 0) {
      return `No universities found in ${city}`;
    } else if (count === 1) {
      return `Found 1 university in ${city}`;
    } else {
      return `Found ${count} universities in ${city}`;
    }
  }



  clearResults() {
    this.searchResult = null;
    this.hasSearched = false;
    this.searchForm.patchValue({ cityName: '' });
  }

  getYearsSinceFounding(foundingYear?: number): string {
    if (!foundingYear) return '';
    const currentYear = new Date().getFullYear();
    const years = currentYear - foundingYear;
    return `(${years} years old)`;
  }
}
