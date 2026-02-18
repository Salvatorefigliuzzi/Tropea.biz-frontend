import axiosClient from './axiosClient';
import type { 
  Permesso, 
  PermessiResponse, 
  CreatePermessoPayload, 
  UpdatePermessoPayload,
  PermessoParams
} from '../types/permessi';

export const getPermessiApi = async (params?: PermessoParams): Promise<PermessiResponse> => {
  const response = await axiosClient.get('/permessi', { params });
  return response.data;
};

export const getPermessoByIdApi = async (id: number): Promise<{ permesso: Permesso }> => {
  const response = await axiosClient.get(`/permessi/${id}`);
  return response.data;
};

export const createPermessoApi = async (data: CreatePermessoPayload): Promise<{ permesso: Permesso }> => {
  const response = await axiosClient.post('/permessi', data);
  return response.data;
};

export const updatePermessoApi = async (id: number, data: UpdatePermessoPayload): Promise<{ permesso: Permesso }> => {
  const response = await axiosClient.put(`/permessi/${id}`, data);
  return response.data;
};

export const deletePermessoApi = async (id: number): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/permessi/${id}`);
  return response.data;
};

export const assegnaPermessoARuoloApi = async (ruoloId: number, permessoId: number): Promise<{ message: string }> => {
  const response = await axiosClient.post(`/permessi/${ruoloId}/assegna`, { permessoId });
  return response.data;
};

export const disassegnaPermessoDaRuoloApi = async (ruoloId: number, permessoId: number): Promise<{ message: string }> => {
  const response = await axiosClient.post(`/permessi/${ruoloId}/disassegna`, { permessoId });
  return response.data;
};
