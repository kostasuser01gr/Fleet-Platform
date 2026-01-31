// Audit Logging Service

import { APIService } from './apiService';
import type { AuditLog, AuditActionType } from '../types/partsRadar';
import { useAuth } from '../contexts/AuthContext';

class AuditService {
  private static readonly API_BASE = '/api/parts/audit';

  /**
   * Log an audit event
   */
  static async log(
    actionType: AuditActionType,
    diffSummary: string,
    options?: {
      mode?: 'single' | 'bulk';
      vehicleIds?: Array<string>;
      partnerIds?: Array<string>;
      requestId?: string;
      quoteId?: string;
      beforeSnapshot?: Record<string, unknown>;
      afterSnapshot?: Record<string, unknown>;
    }
  ): Promise<boolean> {
    try {
      // Get current user from auth context (would need to be passed or accessed differently)
      // For now, we'll get it from storage
      const { authStorage } = await import('../lib/storage');
      const user = authStorage.getUser();
      
      if (!user) {
        console.warn('Cannot log audit: no user found');
        return false;
      }

      const auditLog: Omit<AuditLog, 'id' | 'ts'> = {
        actorId: user.id,
        actorName: user.name,
        actionType,
        diffSummary,
        ...options,
      };

      await APIService.post(`${this.API_BASE}`, auditLog);
      return true;
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Don't throw - audit failures shouldn't break the app
      return false;
    }
  }

  /**
   * Get audit logs with filters
   */
  static async getLogs(filters?: {
    actionType?: AuditActionType;
    actorId?: string;
    requestId?: string;
    partnerId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<Array<AuditLog>> {
    try {
      const response = await APIService.get<Array<AuditLog>>(
        `${this.API_BASE}`,
        {
          useCache: true,
          cacheTTL: 10 * 1000, // 10 seconds cache
        }
      );
      return response || [];
    } catch (error) {
      console.error('Get audit logs failed:', error);
      return [];
    }
  }

  /**
   * Convenience methods for common actions
   */
  static async logPartnerCreate(partnerId: string, partnerName: string): Promise<boolean> {
    return this.log('partner_create', `Created partner: ${partnerName}`, {
      partnerIds: [partnerId],
    });
  }

  static async logPartnerUpdate(partnerId: string, partnerName: string, changes: string): Promise<boolean> {
    return this.log('partner_update', `Updated partner ${partnerName}: ${changes}`, {
      partnerIds: [partnerId],
    });
  }

  static async logRequestCreate(requestId: string, mode: 'single' | 'bulk', vehicleIds: Array<string>): Promise<boolean> {
    return this.log('request_create', `Created ${mode} parts request`, {
      requestId,
      mode,
      vehicleIds,
    });
  }

  static async logRequestStatusChange(
    requestId: string,
    oldStatus: string,
    newStatus: string,
    vehicleIds?: Array<string>
  ): Promise<boolean> {
    return this.log('request_status_change', `Request status: ${oldStatus} → ${newStatus}`, {
      requestId,
      vehicleIds,
    });
  }

  static async logQuoteAccept(quoteId: string, requestId: string, partnerId: string): Promise<boolean> {
    return this.log('quote_accept', `Accepted quote from partner`, {
      quoteId,
      requestId,
      partnerIds: [partnerId],
    });
  }
}

export { AuditService };
