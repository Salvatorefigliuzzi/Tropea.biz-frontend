import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, Permission, Group, AuthResponse } from '../../types/auth';
import { loginApi, registerApi, logoutApi, getProfileApi } from '../../api/authApi';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  permissions: [],
  permissionsList: [],
  groups: [],
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState() as any;
    const refreshToken = state.auth.refreshToken;
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error: any) {
      // Even if API fails, we clear local state
      console.error('Logout API failed', error);
    }
    return;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User | null;
        token: string;
        refreshToken: string;
        permissions: Permission[];
        permissionsList?: string[];
        groups: Group[];
      }>
    ) => {
      const { user, token, refreshToken, permissions, permissionsList, groups } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.permissions = permissions;
      state.permissionsList = permissionsList || permissions.map((p) => p.nome);
      state.groups = groups;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.permissions = [];
      state.permissionsList = [];
      state.groups = [];
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        const { user, token, refreshToken, permissions, permissionsList, groups } = action.payload;
        state.user = user;
        state.token = token;
        state.refreshToken = refreshToken;
        state.permissions = permissions;
        state.permissionsList = permissionsList || permissions.map((p) => p.nome);
        state.groups = groups;
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        const { user, permissions, permissionsList, groups } = action.payload;
        state.user = user;
        state.permissions = permissions;
        state.permissionsList = permissionsList || permissions.map((p) => p.nome);
        state.groups = groups;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // Usually registration requires email verification, so we don't auto-login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.permissions = [];
        state.permissionsList = [];
        state.groups = [];
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
