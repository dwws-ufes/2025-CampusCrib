export type UserRole = 'Tenant' | 'LandLord';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isEmailConfirmed: boolean;
  passwordHashed: string;
  birthDate: Date | string;
  profileImage: string; // URL
  role: UserRole;
} 