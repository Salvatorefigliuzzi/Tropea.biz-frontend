import type { PaginatedResponse, PaginationParams } from './common';
import type { Permesso } from './permessi';

export interface Ruolo {
  id: number;
  nome: string;
  ordine: number;
  permessi?: Permesso[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRuoloPayload {
  nome: string;
  ordine?: number;
}

export interface UpdateRuoloPayload {
  nome?: string;
  ordine?: number;
}

export type RuoliResponse = PaginatedResponse<Ruolo>;
export interface RuoliParams extends PaginationParams {
  search?: string;
}
