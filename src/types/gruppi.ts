import type { PaginatedResponse, PaginationParams } from './common';
import type { Permesso } from './permessi';

export interface Gruppo {
  id: number;
  nome: string;
  alias: string;
  icona?: string;
  ordine: number;
  permessi?: Permesso[];
  createdAt?: string;
  updatedAt?: string;
}

export type GruppiResponse = PaginatedResponse<Gruppo>;

export interface CreateGruppoPayload {
  nome: string;
  alias: string;
  icona?: string;
  ordine?: number;
}

export interface UpdateGruppoPayload {
  nome?: string;
  alias?: string;
  icona?: string;
  ordine?: number;
}

export type GruppoParams = PaginationParams & {
  search?: string;
};
