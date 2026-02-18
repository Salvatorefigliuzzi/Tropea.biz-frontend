import axiosClient from './axiosClient';
import type { 
  Gruppo, 
  GruppiResponse, 
  CreateGruppoPayload, 
  UpdateGruppoPayload,
  GruppoParams
} from '../types/gruppi';

export const getGruppiApi = async (params?: GruppoParams): Promise<GruppiResponse> => {
  const response = await axiosClient.get('/gruppi', { params });
  return response.data;
};

export const getGruppoByIdApi = async (id: number): Promise<{ gruppo: Gruppo }> => {
  const response = await axiosClient.get(`/gruppi/${id}`);
  return response.data;
};

export const createGruppoApi = async (data: CreateGruppoPayload): Promise<{ gruppo: Gruppo }> => {
  const response = await axiosClient.post('/gruppi', data);
  return response.data;
};

export const updateGruppoApi = async (id: number, data: UpdateGruppoPayload): Promise<{ gruppo: Gruppo }> => {
  const response = await axiosClient.put(`/gruppi/${id}`, data);
  return response.data;
};

export const deleteGruppoApi = async (id: number): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/gruppi/${id}`);
  return response.data;
};
