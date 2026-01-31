export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'communication' | 'business' | 'maps' | 'custom';
  provider: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, unknown>;
  credentials: {
    encrypted: boolean;
    fields: string[];
  };
  webhooks?: WebhookConfig[];
  lastSync?: Date;
  error?: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  retryCount: number;
  lastTriggered?: Date;
}

export interface APICredential {
  id: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  rateLimit?: {
    requests: number;
    period: string;
  };
  createdAt: Date;
  lastUsed?: Date;
}
