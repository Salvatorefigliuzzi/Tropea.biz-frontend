export interface Role {
  id: number;
  nome: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string | null;
  isVerified: boolean;
  privacyAcceptedAt: string;
  policyAcceptedAt: string;
  ruoli?: Role[];
  // Add other fields as necessary
}

export interface Permission {
  id: number;
  nome: string;
  alias: string;
  gruppoId: number | null;
}

export interface Group {
  id: number;
  nome: string;
  alias: string;
  icona?: string;
  ordine: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: User;
  permissions: Permission[];
  permissionsList?: string[];
  groups: Group[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permissions: Permission[];
  permissionsList?: string[];
  groups: Group[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
