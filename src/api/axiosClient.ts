import axios from 'axios';
import store from '../store';
import { logout, setCredentials } from '../features/auth/authSlice';

const axiosClient = axios.create({
  baseURL: '/api', // Vite proxy will handle this
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken,
          });

          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          store.dispatch(
            setCredentials({
              token: newToken,
              refreshToken: newRefreshToken,
              user: state.auth.user,
              permissions: state.auth.permissions,
              groups: state.auth.groups,
            })
          );

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      } else {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
