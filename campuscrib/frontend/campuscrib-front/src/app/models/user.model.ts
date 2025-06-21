export type UserRole = 'TENANT' | 'LANDLORD';

export interface User {
  id?: string; // uuid
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  passwordHashed?: string;
  birthDate: Date | string;
  profileImage: string;
  role: UserRole;
  legalGuardian?: string | null;
} 