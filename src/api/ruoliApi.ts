import axiosClient from './axiosClient';
import type { Ruolo, CreateRuoloPayload, UpdateRuoloPayload, RuoliResponse, RuoliParams } from '../types/ruoli';

export const getRuoliApi = async (params?: RuoliParams): Promise<RuoliResponse> => {
  const response = await axiosClient.get<RuoliResponse>('/ruoli', { params });
  return response.data;
};

export const getRuoloByIdApi = async (id: number): Promise<{ ruolo: Ruolo }> => {
  const response = await axiosClient.get<{ ruolo: Ruolo }>(`/ruoli/${id}`);
  return response.data;
};

export const createRuoloApi = async (payload: CreateRuoloPayload): Promise<{ ruolo: Ruolo }> => {
  const response = await axiosClient.post<{ ruolo: Ruolo }>('/ruoli', payload);
  return response.data;
};

export const updateRuoloApi = async (id: number, payload: UpdateRuoloPayload): Promise<{ ruolo: Ruolo }> => {
  const response = await axiosClient.put<{ ruolo: Ruolo }>(`/ruoli/${id}`, payload);
  return response.data;
};

export const deleteRuoloApi = async (id: number): Promise<{ message: string }> => {
  const response = await axiosClient.delete<{ message: string }>(`/ruoli/${id}`);
  return response.data;
};

export const assegnaRuoloAUtenteApi = async (userId: number, ruoloId: number): Promise<{ message: string }> => {
  const response = await axiosClient.post<{ message: string }>(`/ruoli/${userId}/assegna`, { ruoloId });
  return response.data;
};

export const disassegnaRuoloDaUtenteApi = async (userId: number, ruoloId: number): Promise<{ message: string }> => {
  const response = await axiosClient.post<{ message: string }>(`/ruoli/${userId}/disassegna`, { ruoloId });
  return response.data;
};
