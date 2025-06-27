export type Gender = 'MALE' | 'FEMALE' | 'ANY';

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
  landlordId: string;
} 