import { AuthToken, User } from '../types/auth';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'fleet_auth_token',
  USER: 'fleet_user',
  SETTINGS: 'fleet_settings',
  OFFLINE_QUEUE: 'fleet_offline_queue',
  CACHE: 'fleet_cache',
} as const;

class StorageService {
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue || null;
      return JSON.parse(item);
    } catch {
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  static remove(key: string): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  static clear(): void {
    if (!this.isAvailable()) return;
    localStorage.clear();
  }
}

export const authStorage = {
  getToken: (): AuthToken | null => {
    return StorageService.get<AuthToken>(STORAGE_KEYS.AUTH_TOKEN);
  },
  
  setToken: (token: AuthToken): void => {
    StorageService.set(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  
  getUser: (): User | null => {
    const user = StorageService.get<User>(STORAGE_KEYS.USER);
    if (user) {
      // Convert date strings back to Date objects
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      };
    }
    return null;
  },
  
  setUser: (user: User): void => {
    StorageService.set(STORAGE_KEYS.USER, user);
  },
  
  clear: (): void => {
    StorageService.remove(STORAGE_KEYS.AUTH_TOKEN);
    StorageService.remove(STORAGE_KEYS.USER);
  },
};

export const settingsStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    const settings = StorageService.get<Record<string, unknown>>(STORAGE_KEYS.SETTINGS, {});
    return (settings?.[key] as T) ?? defaultValue ?? null;
  },
  
  set: <T>(key: string, value: T): void => {
    const settings = StorageService.get<Record<string, unknown>>(STORAGE_KEYS.SETTINGS, {});
    settings[key] = value;
    StorageService.set(STORAGE_KEYS.SETTINGS, settings);
  },
  
  clear: (): void => {
    StorageService.remove(STORAGE_KEYS.SETTINGS);
  },
};

export const cacheStorage = {
  get: <T>(key: string): T | null => {
    const cache = StorageService.get<Record<string, { data: T; expires: number }>>(STORAGE_KEYS.CACHE, {});
    const item = cache[key];
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expires) {
      delete cache[key];
      StorageService.set(STORAGE_KEYS.CACHE, cache);
      return null;
    }
    
    return item.data;
  },
  
  set: <T>(key: string, data: T, ttl: number = 3600000): void => {
    const cache = StorageService.get<Record<string, { data: T; expires: number }>>(STORAGE_KEYS.CACHE, {});
    cache[key] = {
      data,
      expires: Date.now() + ttl,
    };
    StorageService.set(STORAGE_KEYS.CACHE, cache);
  },
  
  remove: (key: string): void => {
    const cache = StorageService.get<Record<string, { data: unknown; expires: number }>>(STORAGE_KEYS.CACHE, {});
    delete cache[key];
    StorageService.set(STORAGE_KEYS.CACHE, cache);
  },
  
  clear: (): void => {
    StorageService.remove(STORAGE_KEYS.CACHE);
  },
};

export const offlineQueue = {
  add: (request: { method: string; url: string; data?: unknown; timestamp: number }): void => {
    const queue = StorageService.get<Array<typeof request>>(STORAGE_KEYS.OFFLINE_QUEUE, []);
    queue.push(request);
    StorageService.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },
  
  getAll: (): Array<{ method: string; url: string; data?: unknown; timestamp: number }> => {
    return StorageService.get<Array<{ method: string; url: string; data?: unknown; timestamp: number }>>(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },
  
  clear: (): void => {
    StorageService.remove(STORAGE_KEYS.OFFLINE_QUEUE);
  },
  
  remove: (index: number): void => {
    const queue = this.getAll();
    queue.splice(index, 1);
    StorageService.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },
};
