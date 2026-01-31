export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'custom' | 'standard';
  metrics: AnalyticsMetric[];
  charts: ChartConfig[];
  filters: ReportFilter[];
  createdAt: Date;
  updatedAt: Date;
  schedule?: ReportSchedule;
}

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  title: string;
  data: Array<Record<string, unknown>>;
  xAxis?: string;
  yAxis?: string;
  series?: string[];
  options?: Record<string, unknown>;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: unknown;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  day?: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
}

export interface PredictiveInsight {
  id: string;
  type: 'demand_forecast' | 'price_optimization' | 'maintenance_prediction' | 'failure_prediction';
  title: string;
  description: string;
  confidence: number;
  prediction: Record<string, unknown>;
  recommendations: string[];
  timeframe: string;
  createdAt: Date;
}
