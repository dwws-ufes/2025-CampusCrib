import { Injectable, signal, inject } from '@angular/core';
import { Crib } from '../../models/crib.model';
import { User } from '../../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../shared/message-dialog/services/message.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class CribService {
  private http = inject(HttpClient);
  private message = inject(MessageService);
  private apiUrl = 'http://localhost:8083';
  private auth = inject(AuthService);
  private router = inject(Router);
  private _cribs = signal<Crib[]>([]);

  constructor() {
    this.initializeMockData();
  }

  get cribs() {
    return this._cribs.asReadonly();
  }

  getAllCribs(): Crib[] {
    return this._cribs();
  }

  getCribsByLandlord(landlordId: string): Crib[] {
    return this._cribs().filter(crib => crib.landlordId === landlordId);
  }

  getCribById(id: string): Crib | undefined {
    return this._cribs().find(crib => crib.id === id);
  }

  createCrib(crib: Omit<Crib, 'id'> & { landlordId: string }) {
    const token = this.auth.getAccessToken();

    const httpOptions = token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};

    return this.http.post(`${this.apiUrl}/api/manager/cribs/register`, crib, httpOptions).subscribe({
      next: (response: any) => {
        try {
          this.message.success('Crib Registration successful').afterClosed().subscribe(()=>{
            console.log(response);
            return response;
          });
        } catch (error) {
          console.error('Error processing registration response:', error);
          this.message.error('Registration successful but failed to process user data');
        }
      },
      error: (error) => {
        this.message.error('Registration failed');
        console.error('Registration error:', error);
      }
    });
    
  }

  updateCrib(id: string, updates: Partial<Crib>): Crib | null {
    const cribs = this._cribs();
    const index = cribs.findIndex(crib => crib.id === id);
    
    if (index === -1) return null;
    
    const updatedCrib = { ...cribs[index], ...updates };
    this._cribs.update(cribs => {
      const newCribs = [...cribs];
      newCribs[index] = updatedCrib;
      return newCribs;
    });
    
    return updatedCrib;
  }

  deleteCrib(id: string): boolean {
    const cribs = this._cribs();
    const filteredCribs = cribs.filter(crib => crib.id !== id);
    
    if (filteredCribs.length === cribs.length) return false;
    
    this._cribs.set(filteredCribs);
    return true;
  }

  canEditCrib(cribId: string, landlordId: string): boolean {
    const crib = this.getCribById(cribId);
    return crib?.landlordId === landlordId;
  }

  private generateId(): string {
    return 'crib-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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