import axiosClient from './axiosClient';
import type { AuthResponse } from '../types/auth';

export const loginApi = async (data: any): Promise<AuthResponse> => {
  const response = await axiosClient.post('/auth/login', data);
  return response.data;
};

export const getProfileApi = async (): Promise<AuthResponse> => {
  const response = await axiosClient.get('/users/me');
  return response.data;
};

export const registerApi = async (data: any) => {
  const response = await axiosClient.post('/auth/register', data);
  return response.data;
};

export const logoutApi = async (refreshToken: string) => {
  const response = await axiosClient.post('/auth/logout', { refreshToken });
  return response.data;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await axiosClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async (data: any) => {
  const response = await axiosClient.post('/auth/reset-password', data);
  return response.data;
};

export const verifyResetTokenApi = async (token: string) => {
  const response = await axiosClient.get(`/auth/verify-reset-token?token=${token}`);
  return response.data;
};
