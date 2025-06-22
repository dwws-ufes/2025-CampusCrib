import { User } from './user.model';
import { Crib } from './crib.model';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  cribId: string;
  user?: User;
  crib?: Crib;
  createdAt?: Date;
} 