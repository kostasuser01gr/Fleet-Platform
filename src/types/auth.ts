export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
