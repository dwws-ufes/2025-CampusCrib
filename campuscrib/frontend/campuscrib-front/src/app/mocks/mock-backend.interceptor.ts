import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Crib } from '../models/crib.model';

// Mock Data Store
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    emailConfirmed: true,
    birthDate: new Date('1980-05-15'),
    profileImage: '',
    role: 'LANDLORD'
  },
  {
    id: '2',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    emailConfirmed: true,
    birthDate: new Date('1999-03-20'),
    profileImage: '',
    role: 'TENANT'
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob.wilson@example.com',
    emailConfirmed: false,
    birthDate: new Date('2000-07-10'),
    profileImage: '',
    role: 'TENANT'
  }
];

  const mockCribs: Crib[] = [
    {
      id: '1',
      cribId: '1',
      title: 'Cozy Student Apartment Near Campus',
    description: 'Perfect for students! Walking distance to university with modern amenities.',
    price: 850,
    numRooms: 2,
    numBathrooms: 1,
    numPeopleAlreadyIn: 1,
    numAvailableVacancies: 1,
    acceptedGenders: 'ANY',
    petsPolicy: false,
    landlordId: '1',
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
      cribId: '2',
      title: 'Luxury Downtown Loft',
    description: 'Modern loft in the heart of downtown with great amenities and city views.',
    price: 1200,
    numRooms: 1,
    numBathrooms: 1,
    numPeopleAlreadyIn: 0,
    numAvailableVacancies: 1,
    acceptedGenders: 'FEMALE',
    petsPolicy: true,
    landlordId: '1',
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
      cribId: '3',
      title: 'Shared House with Garden',
    description: 'Beautiful house with private garden, perfect for nature lovers.',
    price: 650,
    numRooms: 3,
    numBathrooms: 2,
    numPeopleAlreadyIn: 2,
    numAvailableVacancies: 1,
    acceptedGenders: 'MALE',
    petsPolicy: true,
    landlordId: '2',
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

// Mock Auth State
let currentUser: User | null = null;
let authTokens = {
  accessToken: 'mock-access-token-12345',
  refreshToken: 'mock-refresh-token-67890'
};

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  // Skip mocking for non-API calls
  if (!url.includes('/api/')) {
    return next(req);
  }

  // Add delay
  const mockResponse = (data: any, status = 200) => {
    return of(new HttpResponse({ 
      status, 
      body: data 
    })).pipe(delay(500)); 
  };

  const mockError = (message: string, status = 400) => {
    return throwError(() => ({ 
      error: { message }, 
      status 
    })).pipe(delay(300));
  };

  // AUTH ENDPOINTS
  if (url.includes('/auth/login') && method === 'POST') {
    const { email, password } = body as any;
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === '123456') {
      currentUser = user;
      return mockResponse({
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken
      });
    } else {
      return mockError('Invalid credentials', 401);
    }
  }

  if (url.includes('/auth/logout') && method === 'POST') {
    currentUser = null;
    return mockResponse({ message: 'Logout successful' });
  }

  // REGISTRATION ENDPOINTS
  if (url.includes('/registration/users/register') && method === 'POST') {
    let userData: any;
    
    if (body instanceof FormData) {
      const dataString = body.get('data') as string;
      userData = JSON.parse(dataString);
    } else {
      userData = body as any;
    }
    
    // Check if email already exists
    if (mockUsers.find(u => u.email === userData.email)) {
      return mockError('Email already exists', 409);
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      emailConfirmed: false,
      birthDate: new Date(userData.birthDate),
      profileImage: '',
      role: userData.role || 'TENANT',
      legalGuardian: userData.legalGuardian || ''
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    
    return mockResponse({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      emailConfirmed: newUser.emailConfirmed,
      birthDate: newUser.birthDate,
      profileImage: newUser.profileImage,
      role: newUser.role,
      legalGuardian: newUser.legalGuardian
    });
  }

  if (url.includes('/auth/refresh') && method === 'POST') {
    return mockResponse({
      accessToken: 'new-mock-access-token-' + Date.now(),
      refreshToken: 'new-mock-refresh-token-' + Date.now()
    });
  }

  // USER ENDPOINTS
  if (url.includes('/registration/users/me') && method === 'GET') {
    if (!currentUser) {
      return mockError('Unauthorized', 401);
    }
    return mockResponse(currentUser);
  }

  if (url.includes('/registration/users/me') && method === 'PUT') {
    if (!currentUser) {
      return mockError('Unauthorized', 401);
    }
    const updates = body as Partial<User>;
    currentUser = { ...currentUser, ...updates };
    
    const userIndex = mockUsers.findIndex(u => u.id === currentUser!.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = currentUser;
    }
    
    return mockResponse(currentUser);
  }

  if (url.includes('/registration/users/') && method === 'GET') {
    const userId = url.split('/').pop();
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      return mockResponse(user);
    } else {
      return mockError('User not found', 404);
    }
  }

  // CRIB ENDPOINTS
  if (url.includes('/manager/cribs/all') && method === 'GET') {
    if (url.includes('all-my')) {
      // Get cribs by current landlord
      if (!currentUser) {
        return mockError('Unauthorized', 401);
      }
      const landlordCribs = mockCribs.filter(c => c.landlordId === currentUser!.id);
      return mockResponse(landlordCribs);
    } else {
      return mockResponse(mockCribs);
    }
  }

  if (url.includes('/manager/cribs/crib/') && method === 'GET') {
    const cribId = url.split('/').pop();
    // Try to find by both id and cribId to handle different routing scenarios
    const crib = mockCribs.find(c => c.id === cribId || c.cribId === cribId);
    if (crib) {
      return mockResponse(crib);
    } else {
      return mockError('Crib not found', 404);
    }
  }

  if (url.includes('/manager/cribs/register') && method === 'POST') {
    if (!currentUser) {
      return mockError('Unauthorized', 401);
    }
    
    const cribData = body as any;
    const newCrib: Crib = {
      id: (mockCribs.length + 1).toString(),
      cribId: (mockCribs.length + 1).toString(),
      title: cribData.title,
      description: cribData.description,
      price: cribData.price,
      numRooms: cribData.numRooms,
      numBathrooms: cribData.numBathrooms,
      numPeopleAlreadyIn: cribData.numPeopleAlreadyIn,
      numAvailableVacancies: cribData.numAvailableVacancies,
      acceptedGenders: cribData.acceptedGenders,
      petsPolicy: cribData.petsPolicy,
      landlordId: currentUser.id!,
      location: cribData.location
    };
    
    mockCribs.push(newCrib);
    return mockResponse(newCrib, 201);
  }

  if ((url.includes('/manager/cribs/crib/') && (method === 'PUT' || method === 'PATCH')) ||
      (url.includes('/manager/cribs/') && method === 'PUT')) {
    const urlParts = url.split('/');
    const cribId = urlParts[urlParts.length - 1];
    const cribIndex = mockCribs.findIndex(c => c.id === cribId);
    
    if (cribIndex === -1) {
      return mockError('Crib not found', 404);
    }
    
    const updates = body as Partial<Crib>;
    mockCribs[cribIndex] = { ...mockCribs[cribIndex], ...updates };
    return mockResponse(mockCribs[cribIndex]);
  }

  if ((url.includes('/manager/cribs/crib/') && method === 'DELETE') ||
      (url.includes('/manager/cribs/') && method === 'DELETE')) {
    const urlParts = url.split('/');
    const cribId = urlParts[urlParts.length - 1];
    const cribIndex = mockCribs.findIndex(c => c.id === cribId);
    
    if (cribIndex === -1) {
      return mockError('Crib not found', 404);
    }
    
    mockCribs.splice(cribIndex, 1);
    return mockResponse({ message: 'Crib deleted successfully' });
  }

  // SEARCH ENDPOINTS
  if (url.includes('/api/search/cribs') && method === 'GET') {
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;
    
    let filteredCribs = [...mockCribs];
    
    // Apply filters based on query parameters
    if (params.get('id')) {
      filteredCribs = filteredCribs.filter(c => c.cribId === params.get('id'));
    }
    
    if (params.get('gender')) {
      const gender = params.get('gender');
      filteredCribs = filteredCribs.filter(c => 
        c.acceptedGenders === 'ANY' || c.acceptedGenders === gender
      );
    }
    
    if (params.get('petsPolicy')) {
      const petsAllowed = params.get('petsPolicy') === 'true';
      filteredCribs = filteredCribs.filter(c => c.petsPolicy === petsAllowed);
    }
    
    if (params.get('numberOfRooms')) {
      const numRooms = parseInt(params.get('numberOfRooms')!);
      filteredCribs = filteredCribs.filter(c => c.numRooms === numRooms);
    }
    
    if (params.get('numberOfRoomsMin')) {
      const minRooms = parseInt(params.get('numberOfRoomsMin')!);
      filteredCribs = filteredCribs.filter(c => c.numRooms >= minRooms);
    }
    
    if (params.get('numberOfRoomsMax')) {
      const maxRooms = parseInt(params.get('numberOfRoomsMax')!);
      filteredCribs = filteredCribs.filter(c => c.numRooms <= maxRooms);
    }
    
    if (params.get('numberOfBathrooms')) {
      const numBathrooms = parseInt(params.get('numberOfBathrooms')!);
      filteredCribs = filteredCribs.filter(c => c.numBathrooms === numBathrooms);
    }
    
    if (params.get('numberOfBathroomsMin')) {
      const minBathrooms = parseInt(params.get('numberOfBathroomsMin')!);
      filteredCribs = filteredCribs.filter(c => c.numBathrooms >= minBathrooms);
    }
    
    if (params.get('numberOfBathroomsMax')) {
      const maxBathrooms = parseInt(params.get('numberOfBathroomsMax')!);
      filteredCribs = filteredCribs.filter(c => c.numBathrooms <= maxBathrooms);
    }
    
    if (params.get('availableVacancies')) {
      const vacancies = parseInt(params.get('availableVacancies')!);
      filteredCribs = filteredCribs.filter(c => c.numAvailableVacancies === vacancies);
    }
    
    if (params.get('availableVacanciesMin')) {
      const minVacancies = parseInt(params.get('availableVacanciesMin')!);
      filteredCribs = filteredCribs.filter(c => c.numAvailableVacancies >= minVacancies);
    }
    
    if (params.get('availableVacanciesMax')) {
      const maxVacancies = parseInt(params.get('availableVacanciesMax')!);
      filteredCribs = filteredCribs.filter(c => c.numAvailableVacancies <= maxVacancies);
    }
    
    if (params.get('price')) {
      const price = parseFloat(params.get('price')!);
      filteredCribs = filteredCribs.filter(c => c.price === price);
    }
    
    if (params.get('priceMin')) {
      const minPrice = parseFloat(params.get('priceMin')!);
      filteredCribs = filteredCribs.filter(c => c.price >= minPrice);
    }
    
    if (params.get('priceMax')) {
      const maxPrice = parseFloat(params.get('priceMax')!);
      filteredCribs = filteredCribs.filter(c => c.price <= maxPrice);
    }
    
    if (params.get('landlordId')) {
      const landlordId = params.get('landlordId');
      filteredCribs = filteredCribs.filter(c => c.landlordId === landlordId);
    }
    
    if (params.get('city')) {
      const city = params.get('city')!.toLowerCase();
      filteredCribs = filteredCribs.filter(c => 
        c.title.toLowerCase().includes(city) ||
        c.description.toLowerCase().includes(city) ||
        c.location.city.toLowerCase().includes(city) ||
        c.location.state.toLowerCase().includes(city) ||
        c.location.street.toLowerCase().includes(city)
      );
    }
    
    if (params.get('state')) {
      const state = params.get('state')!.toLowerCase();
      filteredCribs = filteredCribs.filter(c => 
        c.location.state.toLowerCase().includes(state)
      );
    }
    
    if (params.get('neighborhood')) {
      const neighborhood = params.get('neighborhood')!.toLowerCase();
      filteredCribs = filteredCribs.filter(c => 
        c.location.street.toLowerCase().includes(neighborhood)
      );
    }

    if (params.get('q') || params.get('search')) {
      const searchTerm = (params.get('q') || params.get('search'))!.toLowerCase();
      filteredCribs = filteredCribs.filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.location.city.toLowerCase().includes(searchTerm) ||
        c.location.state.toLowerCase().includes(searchTerm) ||
        c.location.street.toLowerCase().includes(searchTerm)
      );
    }
    
    return mockResponse(filteredCribs);
  }

  return next(req);
}; 