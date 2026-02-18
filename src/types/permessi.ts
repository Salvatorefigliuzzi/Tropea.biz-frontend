import type { PaginatedResponse, PaginationParams } from './common';
import type { Gruppo } from './gruppi';

export interface Permesso {
  id: number;
  nome: string;
  alias: string;
  gruppoId?: number | null;
  gruppo?: Gruppo | null;
  createdAt?: string;
  updatedAt?: string;
}

export type PermessiResponse = PaginatedResponse<Permesso>;

export interface CreatePermessoPayload {
  nome: string;
  alias: string;
  gruppoId?: number | null;
}

export interface UpdatePermessoPayload {
  nome?: string;
  alias?: string;
  gruppoId?: number | null;
}

export type PermessoParams = PaginationParams & {
  search?: string;
};
