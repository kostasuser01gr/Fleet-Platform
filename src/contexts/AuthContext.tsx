import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthToken, LoginCredentials, AuthState } from '../types/auth';
import { APIService } from '../services/apiService';
import { RealtimeService } from '../services/realtimeService';
import { toast } from 'sonner';
import { authStorage } from '../lib/storage';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Auto-login with default user - tool is free and accessible to everyone
    const initAuth = async () => {
      try {
        const storedToken = authStorage.getToken();
        const storedUser = authStorage.getUser();
        
        if (storedToken && storedUser) {
          // Use stored auth if available
          setState({
            user: storedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          RealtimeService.connect();
        } else {
          // Auto-login with default company user - no restrictions
          const defaultUser: User = {
            id: 'company_user',
            email: 'user@company.com',
            name: 'Company User',
            role: 'admin',
            permissions: ['all'],
            createdAt: new Date(),
            lastLogin: new Date(),
          };
          
          const defaultToken: AuthToken = {
            accessToken: 'free_access_token',
            refreshToken: 'free_refresh_token',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          };

          authStorage.setToken(defaultToken);
          authStorage.setUser(defaultUser);

          setState({
            user: defaultUser,
            token: defaultToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          RealtimeService.connect();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Even on error, allow access with default user
        const defaultUser: User = {
          id: 'company_user',
          email: 'user@company.com',
          name: 'Company User',
          role: 'admin',
          permissions: ['all'],
          createdAt: new Date(),
        };
        setState({
          user: defaultUser,
          token: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // In production, this would verify with backend
      // For now, check if token is expired
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      return tokenData.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock login - in production, call real API
      const response = await APIService.post<{ user: User; token: AuthToken }>('/auth/login', credentials);
      
      // Simulate API response
      const mockUser: User = {
        id: 'u1',
        email: credentials.email,
        name: 'John Doe',
        role: 'admin',
        permissions: ['all'],
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      const mockToken: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      authStorage.setToken(mockToken);
      authStorage.setUser(mockUser);

      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Connect real-time service
      RealtimeService.connect();
      
      toast.success('Login successful!', {
        description: `Welcome back, ${mockUser.name}`,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      const errorMessage = err?.message || 'Login failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error('Login failed', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await APIService.post('/auth/register', data);
      
      // Auto-login after registration
      await login({ email: data.email, password: data.password });
      
      toast.success('Registration successful!', {
        description: 'Your account has been created.',
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      const errorMessage = err?.message || 'Registration failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error('Registration failed', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await APIService.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authStorage.clear();
      RealtimeService.disconnect();
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      toast.success('Logged out successfully');
    }
  };

  const refreshAuth = async () => {
    try {
      const storedToken = authStorage.getToken();
      if (!storedToken) return;

      const response = await APIService.post<{ token: AuthToken }>('/auth/refresh', {
        refreshToken: storedToken.refreshToken,
      });

      // Mock refresh
      const newToken: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: storedToken.refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      authStorage.setToken(newToken);
      setState(prev => ({
        ...prev,
        token: newToken,
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updatedUser = { ...state.user!, ...updates };
      await APIService.put(`/users/${state.user!.id}`, updates);
      
      authStorage.setUser(updatedUser);
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      toast.success('Profile updated');
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error('Update failed', {
        description: err?.message || 'Failed to update profile',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        refreshAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
