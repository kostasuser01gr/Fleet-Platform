export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  runCount: number;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'webhook' | 'manual';
  event?: string;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    time?: string;
    days?: number[];
    cron?: string;
  };
  webhook?: {
    url: string;
    secret?: string;
  };
}

export interface WorkflowAction {
  id: string;
  type: 'notification' | 'email' | 'api_call' | 'data_update' | 'workflow';
  config: Record<string, unknown>;
  order: number;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: unknown;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  results?: Array<unknown>;
}
