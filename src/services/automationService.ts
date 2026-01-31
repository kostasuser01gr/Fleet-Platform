import { Workflow, WorkflowExecution } from '../types/automation';
import { APIService } from './apiService';
import { RealtimeService } from './realtimeService';
import { toast } from 'sonner';

export class AutomationService {
  private static workflows: Workflow[] = [];
  private static executions: WorkflowExecution[] = [];
  private static schedulerInterval: NodeJS.Timeout | null = null;

  static async initialize() {
    // Load workflows from API or storage
    try {
      this.workflows = await APIService.get<Workflow[]>('/automation/workflows');
    } catch {
      // Use mock data if API fails
      this.workflows = this.getMockWorkflows();
    }

    // Start scheduler for time-based triggers
    this.startScheduler();
  }

  static async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'runCount'>): Promise<Workflow> {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `wf_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      runCount: 0,
    };

    try {
      const created = await APIService.post<Workflow>('/automation/workflows', newWorkflow);
      this.workflows.push(created);
      return created;
    } catch {
      // Mock creation
      this.workflows.push(newWorkflow);
      return newWorkflow;
    }
  }

  static async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    try {
      const updated = await APIService.put<Workflow>(`/automation/workflows/${id}`, updates);
      const index = this.workflows.findIndex(w => w.id === id);
      if (index !== -1) {
        this.workflows[index] = updated;
      }
      return updated;
    } catch {
      const index = this.workflows.findIndex(w => w.id === id);
      if (index !== -1) {
        this.workflows[index] = { ...this.workflows[index], ...updates, updatedAt: new Date() };
        return this.workflows[index];
      }
      throw new Error('Workflow not found');
    }
  }

  static async deleteWorkflow(id: string): Promise<void> {
    try {
      await APIService.delete(`/automation/workflows/${id}`);
    } catch {
      // Continue even if API fails
    }
    this.workflows = this.workflows.filter(w => w.id !== id);
  }

  static async executeWorkflow(workflowId: string, data?: Record<string, unknown>): Promise<WorkflowExecution> {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    if (!workflow.enabled) {
      throw new Error('Workflow is disabled');
    }

    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId,
      status: 'running',
      startedAt: new Date(),
    };

    this.executions.push(execution);

    try {
      // Check conditions
      if (workflow.conditions && !this.evaluateConditions(workflow.conditions, data)) {
        execution.status = 'cancelled';
        execution.completedAt = new Date();
        return execution;
      }

      // Execute actions
      const results = [];
      for (const action of workflow.actions.sort((a, b) => a.order - b.order)) {
        const result = await this.executeAction(action, data);
        results.push(result);
      }

      execution.status = 'completed';
      execution.completedAt = new Date();
      execution.results = results;

      // Update workflow run count
      workflow.runCount++;
      workflow.lastRun = new Date();

      // Emit event
      RealtimeService.emit('workflow_executed', {
        workflowId,
        executionId: execution.id,
        status: execution.status,
      });

      toast.success('Workflow executed', {
        description: `Workflow "${workflow.name}" completed successfully`,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      execution.status = 'failed';
      execution.error = err.message || 'Unknown error';
      execution.completedAt = new Date();

      toast.error('Workflow failed', {
        description: error.message || 'Workflow execution failed',
      });
    }

    return execution;
  }

  private static async executeAction(action: import('../types/automation').WorkflowAction, data?: Record<string, unknown>): Promise<unknown> {
    switch (action.type) {
      case 'notification':
        toast.info(action.config.title || 'Notification', {
          description: action.config.message,
        });
        return { type: 'notification', success: true };

      case 'email':
        // In production, send email via API
        console.log('Sending email:', action.config);
        return { type: 'email', success: true };

      case 'api_call':
        try {
          const response = await APIService.request(
            action.config.endpoint,
            action.config.method || 'POST',
            { ...action.config.data, ...data }
          );
          return { type: 'api_call', success: true, response };
        } catch (error) {
          throw new Error(`API call failed: ${error}`);
        }

      case 'data_update':
        // Update local data or trigger API update
        RealtimeService.emit('data_update', {
          entity: action.config.entity,
          id: action.config.id,
          updates: action.config.updates,
        });
        return { type: 'data_update', success: true };

      case 'workflow':
        // Trigger another workflow
        const subWorkflow = this.workflows.find(w => w.id === action.config.workflowId);
        if (subWorkflow) {
          return await this.executeWorkflow(subWorkflow.id, data);
        }
        throw new Error('Sub-workflow not found');

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private static evaluateConditions(conditions: Array<import('../types/automation').WorkflowCondition>, data: Record<string, unknown>): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getFieldValue(condition.field, data);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'greater_than':
          return fieldValue > condition.value;
        case 'less_than':
          return fieldValue < condition.value;
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        default:
          return true;
      }
    });
  }

  private static getFieldValue(field: string, data: Record<string, unknown>): unknown {
    return field.split('.').reduce((obj: unknown, key: string): unknown => {
      if (obj && typeof obj === 'object' && key in obj) {
        return (obj as Record<string, unknown>)[key];
      }
      return undefined;
    }, data);
  }

  private static startScheduler() {
    this.schedulerInterval = setInterval(() => {
      const now = new Date();
      
      this.workflows
        .filter(w => w.enabled && w.trigger.type === 'schedule')
        .forEach(workflow => {
          if (this.shouldRunSchedule(workflow.trigger.schedule!, now)) {
            this.executeWorkflow(workflow.id);
          }
        });
    }, 60000); // Check every minute
  }

  private static shouldRunSchedule(schedule: { frequency: 'daily' | 'weekly' | 'monthly'; day?: number; time: string }, now: Date): boolean {
    if (!schedule) return false;

    switch (schedule.frequency) {
      case 'daily':
        if (schedule.time) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          return now.getHours() === hours && now.getMinutes() === minutes;
        }
        return false;

      case 'weekly':
        if (schedule.days && schedule.time) {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          return schedule.days.includes(now.getDay()) &&
                 now.getHours() === hours &&
                 now.getMinutes() === minutes;
        }
        return false;

      default:
        return false;
    }
  }

  static getWorkflows(): Workflow[] {
    return this.workflows;
  }

  static getExecutions(workflowId?: string): WorkflowExecution[] {
    if (workflowId) {
      return this.executions.filter(e => e.workflowId === workflowId);
    }
    return this.executions;
  }

  private static getMockWorkflows(): Workflow[] {
    return [
      {
        id: 'wf1',
        name: 'Daily Maintenance Reminder',
        description: 'Send reminder for vehicles due for maintenance',
        enabled: true,
        trigger: {
          type: 'schedule',
          schedule: {
            frequency: 'daily',
            time: '09:00',
          },
        },
        actions: [
          {
            id: 'a1',
            type: 'notification',
            config: {
              title: 'Maintenance Reminder',
              message: 'Check vehicles due for maintenance today',
            },
            order: 1,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        runCount: 0,
      },
    ];
  }
}
