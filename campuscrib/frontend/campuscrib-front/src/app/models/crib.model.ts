export type Gender = 'Male' | 'Female' | 'Any';

export interface Location {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;  
  longitude: number;
}

export interface Crib {
  id: string; // uuid
  title: string;
  description: string;
  price: number;
  numRooms: number;
  numBathrooms: number;
  numPeopleAlreadyIn: number;
  numAvailableVacancies: number;
  acceptedGenders: Gender;
  petsPolicy: boolean;
  location: Location;
} 