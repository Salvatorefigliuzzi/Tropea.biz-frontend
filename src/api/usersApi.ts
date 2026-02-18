import axiosClient from './axiosClient';
import type { 
  User, 
  UsersResponse, 
  CreateUserPayload, 
  UpdateUserPayload,
  UserParams
} from '../types/users';

export const getUsersApi = async (params?: UserParams): Promise<UsersResponse> => {
  const response = await axiosClient.get('/users', { params });
  return response.data;
};

export const getUserByIdApi = async (id: number): Promise<{ user: User }> => {
  const response = await axiosClient.get(`/users/${id}`);
  return response.data;
};

export const createUserApi = async (data: CreateUserPayload): Promise<User> => {
  const response = await axiosClient.post('/users', data);
  return response.data;
};

export const updateUserApi = async (id: number, data: UpdateUserPayload): Promise<{ user: User }> => {
  const response = await axiosClient.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUserApi = async (id: number): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/users/${id}`);
  return response.data;
};
