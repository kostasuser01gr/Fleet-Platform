// Parts Request & Quote Management Service

import { APIService } from './apiService';
import type {
  CustomPartner,
  PartsRequest,
  Quote,
  PartnerFilters,
  PartnerScore,
  ScoringWeights,
  RequestStatus,
  QuoteStatus,
} from '../types/partsRadar';

class PartsService {
  private static readonly API_BASE = '/api/parts';

  // ===== PARTNERS =====

  static async getPartners(filters?: PartnerFilters): Promise<Array<CustomPartner>> {
    try {
      const response = await APIService.get<Array<CustomPartner>>(
        `${this.API_BASE}/partners`,
        {
          useCache: true,
          cacheTTL: 60 * 1000, // 1 minute cache
        }
      );
      return response || [];
    } catch (error) {
      console.error('Get partners failed:', error);
      return [];
    }
  }

  static async getPartnerById(partnerId: string): Promise<CustomPartner | null> {
    try {
      const response = await APIService.get<CustomPartner>(
        `${this.API_BASE}/partners/${partnerId}`
      );
      return response;
    } catch (error) {
      console.error('Get partner failed:', error);
      return null;
    }
  }

  static async createPartner(partner: Omit<CustomPartner, 'partnerId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<CustomPartner | null> {
    try {
      const response = await APIService.post<CustomPartner>(
        `${this.API_BASE}/partners`,
        partner
      );
      return response;
    } catch (error) {
      console.error('Create partner failed:', error);
      return null;
    }
  }

  static async updatePartner(partnerId: string, updates: Partial<CustomPartner>): Promise<CustomPartner | null> {
    try {
      const response = await APIService.put<CustomPartner>(
        `${this.API_BASE}/partners/${partnerId}`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Update partner failed:', error);
      return null;
    }
  }

  static async deletePartner(partnerId: string): Promise<boolean> {
    try {
      await APIService.delete(`${this.API_BASE}/partners/${partnerId}`);
      return true;
    } catch (error) {
      console.error('Delete partner failed:', error);
      return false;
    }
  }

  // ===== REQUESTS =====

  static async getRequests(filters?: { status?: RequestStatus; createdBy?: string }): Promise<Array<PartsRequest>> {
    try {
      const response = await APIService.get<Array<PartsRequest>>(
        `${this.API_BASE}/requests`,
        {
          useCache: true,
          cacheTTL: 30 * 1000, // 30 seconds cache
        }
      );
      return response || [];
    } catch (error) {
      console.error('Get requests failed:', error);
      return [];
    }
  }

  static async getRequestById(requestId: string): Promise<PartsRequest | null> {
    try {
      const response = await APIService.get<PartsRequest>(
        `${this.API_BASE}/requests/${requestId}`
      );
      return response;
    } catch (error) {
      console.error('Get request failed:', error);
      return null;
    }
  }

  static async createRequest(request: Omit<PartsRequest, 'requestId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<PartsRequest | null> {
    try {
      const response = await APIService.post<PartsRequest>(
        `${this.API_BASE}/requests`,
        request
      );
      return response;
    } catch (error) {
      console.error('Create request failed:', error);
      return null;
    }
  }

  static async updateRequest(requestId: string, updates: Partial<PartsRequest>): Promise<PartsRequest | null> {
    try {
      const response = await APIService.put<PartsRequest>(
        `${this.API_BASE}/requests/${requestId}`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Update request failed:', error);
      return null;
    }
  }

  static async updateRequestStatus(requestId: string, status: RequestStatus, updatedBy: string): Promise<boolean> {
    try {
      await this.updateRequest(requestId, { status, updatedBy, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Update request status failed:', error);
      return false;
    }
  }

  // ===== QUOTES =====

  static async getQuotes(requestId: string): Promise<Array<Quote>> {
    try {
      const response = await APIService.get<Array<Quote>>(
        `${this.API_BASE}/quotes?requestId=${requestId}`
      );
      return response || [];
    } catch (error) {
      console.error('Get quotes failed:', error);
      return [];
    }
  }

  static async createQuote(quote: Omit<Quote, 'quoteId' | 'updatedAt'>): Promise<Quote | null> {
    try {
      const response = await APIService.post<Quote>(
        `${this.API_BASE}/quotes`,
        quote
      );
      return response;
    } catch (error) {
      console.error('Create quote failed:', error);
      return null;
    }
  }

  static async updateQuote(quoteId: string, updates: Partial<Quote>): Promise<Quote | null> {
    try {
      const response = await APIService.put<Quote>(
        `${this.API_BASE}/quotes/${quoteId}`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Update quote failed:', error);
      return null;
    }
  }

  static async acceptQuote(quoteId: string, requestId: string): Promise<boolean> {
    try {
      // Update quote status
      await this.updateQuote(quoteId, { status: 'accepted', updatedAt: new Date() });
      
      // Update request to approved
      const request = await this.getRequestById(requestId);
      if (request) {
        await this.updateRequestStatus(requestId, 'approved', request.updatedBy);
        await this.updateRequest(requestId, {
          selectedQuoteId: quoteId,
          selectedPartnerId: request.selectedPartnerId,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Accept quote failed:', error);
      return false;
    }
  }

  // ===== SCORING =====

  /**
   * Calculate partner score with explainable ranking
   */
  static calculatePartnerScore(
    partner: CustomPartner,
    quote?: Quote,
    etaMinutes?: number,
    weights: ScoringWeights = { cost: 0.4, speed: 0.3, reliability: 0.3 }
  ): PartnerScore {
    // Normalize inputs (0-1 scale)
    const costValue = quote?.totals.grandTotal || partner.priceIndex;
    const costScore = Math.max(0, 1 - costValue / 100); // Lower cost = higher score
    
    const speedScore = etaMinutes 
      ? Math.max(0, 1 - etaMinutes / 120) // Max 120 min, lower ETA = higher score
      : 0.5; // Default if no ETA
    
    const reliabilityScore = partner.reliabilityIndex / 100;
    
    // Weighted sum
    const totalScore = (
      costScore * weights.cost +
      speedScore * weights.speed +
      reliabilityScore * weights.reliability
    ) * 100;
    
    // Build explanation
    const factors: Array<string> = [];
    if (costScore > 0.7) factors.push(`+low cost (${costValue.toFixed(0)})`);
    if (speedScore > 0.7 && etaMinutes) factors.push(`+ETA ${etaMinutes}m`);
    if (reliabilityScore > 0.7) factors.push(`+reliability ${partner.reliabilityIndex}`);
    
    const explanation = factors.length > 0
      ? `Best because: ${factors.join(', ')}`
      : 'Standard option';
    
    return {
      partnerId: partner.partnerId,
      score: Math.round(totalScore),
      explanation,
      costScore: Math.round(costScore * 100),
      speedScore: Math.round(speedScore * 100),
      reliabilityScore: Math.round(reliabilityScore * 100),
    };
  }

  /**
   * Rank partners by score
   */
  static rankPartners(
    partners: Array<CustomPartner>,
    quotes: Array<Quote>,
    etas: Array<{ partnerId: string; etaMinutes: number }>,
    weights?: ScoringWeights
  ): Array<PartnerScore> {
    return partners
      .map((partner) => {
        const quote = quotes.find((q) => q.partnerId === partner.partnerId);
        const eta = etas.find((e) => e.partnerId === partner.partnerId);
        
        return this.calculatePartnerScore(
          partner,
          quote,
          eta?.etaMinutes,
          weights
        );
      })
      .sort((a, b) => b.score - a.score);
  }
}

export { PartsService };
