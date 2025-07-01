import { Injectable, signal, inject } from '@angular/core';
import { Crib } from '../../models/crib.model';
import { User } from '../../models/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from '../../shared/message-dialog/services/message.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SearchFilters {
  id?: string;
  gender?: string;
  petsPolicy?: boolean;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  availableVacancies?: number;
  price?: number;
  landlordId?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
    numberOfRoomsMin?: number;
  numberOfRoomsMax?: number;
  numberOfBathroomsMin?: number;
  numberOfBathroomsMax?: number;
  availableVacanciesMin?: number;
  availableVacanciesMax?: number;
  priceMin?: number;
  priceMax?: number;
}

@Injectable({ providedIn: 'root' })
export class CribService {
  private http = inject(HttpClient);
  private message = inject(MessageService);
  private apiUrl = 'http://localhost:8083';
  private searchApiUrl = 'http://localhost:8085';
  private auth = inject(AuthService);
  private router = inject(Router);
  private _cribs = signal<Crib[]>([]);

  constructor() {
    this.initializeMockData();
  }

  get cribs() {
    return this._cribs.asReadonly();
  }

  searchCribs(filters: SearchFilters): Observable<Crib[]> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof SearchFilters];
      if (value !== undefined && value !== null && value !== '') {
        let apiParamName = key;
        if (key === 'numberOfRooms') apiParamName = 'numberOfRooms';
        if (key === 'numberOfBathrooms') apiParamName = 'numberOfBathrooms';
        if (key === 'availableVacancies') apiParamName = 'availableVacancies';
        
        params = params.set(apiParamName, value.toString());
      }
    });

    return this.http.get<Crib[]>(`${this.searchApiUrl}/api/search/cribs`, {
      params
    });
  }

  getAllCribs(): Observable<Crib[]> {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.get<Crib[]>(`${this.apiUrl}/api/manager/cribs/all`, httpOptions);
  }

  getCribsByLandlord(): Observable<Crib[]> {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.get<Crib[]>(`${this.apiUrl}/api/manager/cribs/all-my`,httpOptions);
  }

  getCribById(id: string): Observable<Crib> {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.get<Crib>(`${this.apiUrl}/api/manager/cribs/crib/${id}`, httpOptions);
  }

  createCrib(crib: Omit<Crib, 'id'> & { landlordId: string }): Observable<any> {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.post(`${this.apiUrl}/api/manager/cribs/register`, crib, httpOptions);
  }


  updateCrib(id: string, updates: Partial<Crib>): Observable<Crib> {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.patch<Crib>(
      `${this.apiUrl}/api/manager/cribs/crib/${id}`,
      updates,
      httpOptions
    );
  }

  deleteCrib(id: string): Observable<void> {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.delete<void>(`${this.apiUrl}/api/manager/cribs/crib/${id}`, httpOptions);
  }

  canEditCrib(cribId: string, landlordId: string): Observable<boolean> {
    return this.getCribById(cribId).pipe(
      map(crib => crib.landlordId === landlordId)
    );
  }

  
  private initializeMockData() {
    const mockCribs: Crib[] = [
      {
        id: '1',
        title: 'Cozy Student Apartment Near Campus',
        description: 'Perfect for students! Walking distance to university with modern amenities.',
        price: 850,
        numRooms: 2,
        numBathrooms: 1,
        numPeopleAlreadyIn: 1,
        numAvailableVacancies: 1,
        acceptedGenders: 'ANY',
        petsPolicy: false,
        landlordId: 'landlord-1',
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
        acceptedGenders: 'FEMALE',
        petsPolicy: true,
        landlordId: 'landlord-2',
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
        acceptedGenders: 'MALE',
        petsPolicy: true,
        landlordId: 'landlord-1',
        location: {
          street: '789 Oak Street',
          city: 'Suburbia',
          state: 'CA',
          zipCode: '90212',
          latitude: 34.0530,
          longitude: -118.2445
        }
      },
      {
        id: '4',
        title: 'Modern Studio Apartment',
        description: 'Compact but efficient studio perfect for a single student.',
        price: 750,
        numRooms: 1,
        numBathrooms: 1,
        numPeopleAlreadyIn: 0,
        numAvailableVacancies: 1,
        acceptedGenders: 'ANY',
        petsPolicy: false,
        landlordId: 'landlord-1',
        location: {
          street: '321 College Blvd',
          city: 'College Town',
          state: 'CA',
          zipCode: '90210',
          latitude: 34.0520,
          longitude: -118.2435
        }
      },
      {
        id: '5',
        title: 'Spacious Family House',
        description: 'Large house perfect for multiple students sharing.',
        price: 2000,
        numRooms: 4,
        numBathrooms: 3,
        numPeopleAlreadyIn: 2,
        numAvailableVacancies: 2,
        acceptedGenders: 'ANY',
        petsPolicy: true,
        landlordId: 'landlord-3',
        location: {
          street: '987 Family Lane',
          city: 'Residential Area',
          state: 'CA',
          zipCode: '90213',
          latitude: 34.0535,
          longitude: -118.2450
        }
      }
    ];

    this._cribs.set(mockCribs);
  }

  getMockLandlords(): User[] {
    return [
      {
        id: 'landlord-1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        emailConfirmed: true,
        birthDate: new Date('1980-05-15'),
        profileImage: '',
        role: 'LANDLORD'
      },
      {
        id: 'landlord-2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        emailConfirmed: true,
        birthDate: new Date('1975-08-22'),
        profileImage: '',
        role: 'LANDLORD'
      },
      {
        id: 'landlord-3',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@example.com',
        emailConfirmed: true,
        birthDate: new Date('1985-12-10'),
        profileImage: '',
        role: 'LANDLORD'
      }
    ];
  }
} 