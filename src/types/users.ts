import type { PaginatedResponse, PaginationParams } from './common';
import type { Ruolo } from './ruoli';

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string | null;
  privacyAcceptedAt?: string;
  policyAcceptedAt?: string;
  isVerified: boolean;
  active: boolean;
  ruoli?: Ruolo[];
  createdAt?: string;
  updatedAt?: string;
}

export type UsersResponse = PaginatedResponse<User>;

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  surname?: string;
  privacyAccepted: boolean;
  policyAccepted: boolean;
  active?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  surname?: string;
  password?: string;
  privacyAccepted?: boolean;
  policyAccepted?: boolean;
  active?: boolean;
}

export interface UserParams extends PaginationParams {
  search?: string;
}
