// Enhanced API Service with error handling, retry logic, and interceptors
import { authStorage } from '../lib/storage';
import { offlineQueue } from '../lib/storage';
import { cacheStorage } from '../lib/storage';

export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface RequestConfig {
  retries?: number;
  timeout?: number;
  useCache?: boolean;
  cacheTTL?: number;
  skipAuth?: boolean;
}

class APIService {
  private static baseURL = import.meta.env.VITE_API_URL || '/api';
  private static defaultTimeout = 30000; // 30 seconds
  private static defaultRetries = 3;

  // Request interceptors
  private static async interceptRequest(config: RequestInit & { url: string }): Promise<RequestInit> {
    const token = authStorage.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (token && !config.skipAuth) {
      headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    return {
      ...config,
      headers,
    };
  }

  // Response interceptors
  private static async interceptResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: APIError = {
        message: 'Request failed',
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.code = errorData.code;
        error.details = errorData.details;
      } catch {
        error.message = response.statusText || error.message;
      }

      // Handle 401 - Unauthorized
      if (response.status === 401) {
        authStorage.clear();
        window.location.href = '/login';
        throw error;
      }

      throw error;
    }

    return response.json();
  }

  // Check if online
  private static isOnline(): boolean {
    return navigator.onLine;
  }

  // Retry logic
  private static async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.defaultRetries,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: unknown) {
      const apiError = error as APIError;
      if (retries > 0 && (apiError.status >= 500 || apiError.status === 0)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // Main request method
  static async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      retries = this.defaultRetries,
      timeout = this.defaultTimeout,
      useCache = false,
      cacheTTL = 3600000,
      skipAuth = false,
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `api_${method}_${endpoint}_${JSON.stringify(data || {})}`;

    // Check cache for GET requests
    if (method === 'GET' && useCache) {
      const cached = cacheStorage.get<T>(cacheKey);
      if (cached) return cached;
    }

    // If offline, queue the request
    if (!this.isOnline() && method !== 'GET') {
      offlineQueue.add({
        method,
        url: endpoint,
        data,
        timestamp: Date.now(),
      });
      throw new Error('Offline: Request queued for later');
    }

    const requestFn = async (): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const requestConfig = await this.interceptRequest({
          method,
          headers: {},
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
          url: endpoint,
          skipAuth,
        });

        const response = await fetch(url, requestConfig);
        clearTimeout(timeoutId);
        
        const result = await this.interceptResponse<T>(response);

        // Cache GET requests
        if (method === 'GET' && useCache) {
          cacheStorage.set(cacheKey, result, cacheTTL);
        }

        return result;
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw { message: 'Request timeout', status: 408 } as APIError;
        }
        
        throw error;
      }
    };

    return this.retryRequest(requestFn, retries);
  }

  // Convenience methods
  static async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, { ...config, useCache: true });
  }

  static async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, config);
  }

  static async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data, config);
  }

  static async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data, config);
  }

  static async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, config);
  }

  // Process offline queue when back online
  static async processOfflineQueue(): Promise<void> {
    if (!this.isOnline()) return;

    const queue = offlineQueue.getAll();
    if (queue.length === 0) return;

    for (let i = queue.length - 1; i >= 0; i--) {
      const item = queue[i];
      try {
        await this.request(item.url, item.method, item.data);
        offlineQueue.remove(i);
      } catch (error) {
        console.error('Failed to process queued request:', error);
        // Keep in queue for next attempt
      }
    }
  }

  // Namespaced API methods
  static vehicles = {
    getAll: (config?: RequestConfig) => APIService.get<Array<import('../types/vehicle').Vehicle>>('/vehicles', config),
    getById: (id: string, config?: RequestConfig) => APIService.get<import('../types/vehicle').Vehicle>(`/vehicles/${id}`, config),
    create: (data: Omit<import('../types/vehicle').Vehicle, 'id'>, config?: RequestConfig) => APIService.post<import('../types/vehicle').Vehicle>('/vehicles', data, config),
    update: (id: string, data: Partial<import('../types/vehicle').Vehicle>, config?: RequestConfig) => APIService.put<import('../types/vehicle').Vehicle>(`/vehicles/${id}`, data, config),
    delete: (id: string, config?: RequestConfig) => APIService.delete(`/vehicles/${id}`, config),
  };

  static assembly = {
    getParts: (config?: RequestConfig) => APIService.get<Array<import('../types/assembly').VehiclePart>>('/assembly/parts', config),
    getTools: (config?: RequestConfig) => APIService.get<Array<import('../types/assembly').Tool>>('/assembly/tools', config),
    startSession: (data: { vehicleId: string; parts: Array<string>; tools: Array<string> }, config?: RequestConfig) => APIService.post<import('../types/assembly').AssemblySession>('/assembly/sessions', data, config),
    updateSession: (id: string, data: Partial<import('../types/assembly').AssemblySession>, config?: RequestConfig) => APIService.put<import('../types/assembly').AssemblySession>(`/assembly/sessions/${id}`, data, config),
    completeSession: (id: string, config?: RequestConfig) => APIService.post<import('../types/assembly').AssemblySession>(`/assembly/sessions/${id}/complete`, {}, config),
  };

  static partners = {
    search: (params: Record<string, string>, config?: RequestConfig) => APIService.get<Array<import('../types/partner').Partner>>(`/partners/search?${new URLSearchParams(params)}`, config),
    getById: (id: string, config?: RequestConfig) => APIService.get<import('../types/partner').Partner>(`/partners/${id}`, config),
    getNearby: (lat: number, lng: number, radius: number, config?: RequestConfig) => 
      APIService.get<Array<import('../types/partner').Partner>>(`/partners/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, config),
  };

  static chat = {
    getChannels: (config?: RequestConfig) => APIService.get<Array<import('../types/chat').ChatChannel>>('/chat/channels', config),
    getMessages: (channelId: string, config?: RequestConfig) => APIService.get<Array<import('../types/chat').ChatMessage>>(`/chat/channels/${channelId}/messages`, config),
    sendMessage: (channelId: string, message: Omit<import('../types/chat').ChatMessage, 'id' | 'timestamp' | 'read'>, config?: RequestConfig) => 
      APIService.post<import('../types/chat').ChatMessage>(`/chat/channels/${channelId}/messages`, message, config),
  };

  static notes = {
    getAll: (config?: RequestConfig) => APIService.get<Array<import('../types/note').Note>>('/notes', config),
    getById: (id: string, config?: RequestConfig) => APIService.get<import('../types/note').Note>(`/notes/${id}`, config),
    create: (data: Omit<import('../types/note').Note, 'id' | 'createdAt' | 'updatedAt'>, config?: RequestConfig) => APIService.post<import('../types/note').Note>('/notes', data, config),
    update: (id: string, data: Partial<import('../types/note').Note>, config?: RequestConfig) => APIService.put<import('../types/note').Note>(`/notes/${id}`, data, config),
    delete: (id: string, config?: RequestConfig) => APIService.delete(`/notes/${id}`, config),
  };

  static analytics = {
    getMetrics: (period: string, config?: RequestConfig) => APIService.get<import('../types/analytics').AnalyticsMetrics>(`/analytics/metrics?period=${period}`, config),
    getReport: (reportId: string, config?: RequestConfig) => APIService.get<import('../types/analytics').AnalyticsReport>(`/analytics/reports/${reportId}`, config),
    createReport: (data: Omit<import('../types/analytics').AnalyticsReport, 'id' | 'createdAt'>, config?: RequestConfig) => APIService.post<import('../types/analytics').AnalyticsReport>('/analytics/reports', data, config),
    getPredictions: (config?: RequestConfig) => APIService.get<Array<import('../types/analytics').Prediction>>('/analytics/predictions', config),
  };

  static auth = {
    login: (credentials: { email: string; password: string }, config?: RequestConfig) => 
      APIService.post('/auth/login', credentials, { ...config, skipAuth: true }),
    register: (data: { email: string; password: string; name: string }, config?: RequestConfig) => 
      APIService.post('/auth/register', data, { ...config, skipAuth: true }),
    logout: (config?: RequestConfig) => APIService.post('/auth/logout', {}, config),
    refresh: (refreshToken: string, config?: RequestConfig) => 
      APIService.post('/auth/refresh', { refreshToken }, { ...config, skipAuth: true }),
  };

  static parts = {
    getPartners: (filters?: import('../types/partsRadar').PartnerFilters, config?: RequestConfig) => 
      APIService.get<Array<import('../types/partsRadar').CustomPartner>>('/parts/partners', { ...config, useCache: true, cacheTTL: 60000 }),
    getPartner: (id: string, config?: RequestConfig) => 
      APIService.get<import('../types/partsRadar').CustomPartner>(`/parts/partners/${id}`, config),
    createPartner: (data: Omit<import('../types/partsRadar').CustomPartner, 'partnerId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, config?: RequestConfig) => 
      APIService.post<import('../types/partsRadar').CustomPartner>('/parts/partners', data, config),
    updatePartner: (id: string, data: Partial<import('../types/partsRadar').CustomPartner>, config?: RequestConfig) => 
      APIService.put<import('../types/partsRadar').CustomPartner>(`/parts/partners/${id}`, data, config),
    deletePartner: (id: string, config?: RequestConfig) => 
      APIService.delete(`/parts/partners/${id}`, config),
    getRequests: (filters?: { status?: import('../types/partsRadar').RequestStatus; mode?: import('../types/partsRadar').RequestMode }, config?: RequestConfig) => 
      APIService.get<Array<import('../types/partsRadar').PartsRequest>>('/parts/requests', { ...config, useCache: true, cacheTTL: 30000 }),
    getRequest: (id: string, config?: RequestConfig) => 
      APIService.get<import('../types/partsRadar').PartsRequest>(`/parts/requests/${id}`, config),
    createRequest: (data: Omit<import('../types/partsRadar').PartsRequest, 'requestId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>, config?: RequestConfig) => 
      APIService.post<import('../types/partsRadar').PartsRequest>('/parts/requests', data, config),
    updateRequest: (id: string, data: Partial<import('../types/partsRadar').PartsRequest>, config?: RequestConfig) => 
      APIService.put<import('../types/partsRadar').PartsRequest>(`/parts/requests/${id}`, data, config),
    getQuotes: (requestId: string, config?: RequestConfig) => 
      APIService.get<Array<import('../types/partsRadar').Quote>>(`/parts/quotes?requestId=${requestId}`, config),
    createQuote: (data: Omit<import('../types/partsRadar').Quote, 'quoteId' | 'updatedAt'>, config?: RequestConfig) => 
      APIService.post<import('../types/partsRadar').Quote>('/parts/quotes', data, config),
    updateQuote: (id: string, data: Partial<import('../types/partsRadar').Quote>, config?: RequestConfig) => 
      APIService.put<import('../types/partsRadar').Quote>(`/parts/quotes/${id}`, data, config),
    getAuditLogs: (filters?: { actionType?: import('../types/partsRadar').AuditActionType; requestId?: string }, config?: RequestConfig) => 
      APIService.get<Array<import('../types/partsRadar').AuditLog>>('/parts/audit', { ...config, useCache: true, cacheTTL: 10000 }),
  };
}

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    APIService.processOfflineQueue();
  });
}

export { APIService };
