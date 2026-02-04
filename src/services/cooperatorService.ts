import { ServiceCooperator, ServiceType, ServiceJob } from '../types/inventory';

class CooperatorService {
  private cooperators: ServiceCooperator[] = [];
  
  // Cooperator Discovery
  findNearbyCooperators(
    lat: number, 
    lng: number, 
    maxDistance: number = 100
  ): ServiceCooperator[] {
    return this.cooperators.filter(coop => {
      const distance = this.calculateDistance(
        lat, 
        lng, 
        coop.location.lat, 
        coop.location.lng
      );
      return distance <= maxDistance;
    });
  }

  findCheapestCooperator(serviceType: ServiceType): ServiceCooperator | null {
    const available = this.cooperators.filter(
      c => c.unlocked && c.services.includes(serviceType)
    );
    
    if (available.length === 0) return null;
    
    return available.reduce((cheapest, current) => 
      current.priceMultiplier < cheapest.priceMultiplier ? current : cheapest
    );
  }

  findBestQualityCooperator(serviceType: ServiceType): ServiceCooperator | null {
    const available = this.cooperators.filter(
      c => c.unlocked && c.services.includes(serviceType)
    );
    
    if (available.length === 0) return null;
    
    return available.reduce((best, current) => 
      current.quality > best.quality ? current : best
    );
  }

  findFastestCooperator(serviceType: ServiceType): ServiceCooperator | null {
    const available = this.cooperators.filter(
      c => c.unlocked && c.services.includes(serviceType)
    );
    
    if (available.length === 0) return null;
    
    return available.reduce((fastest, current) => 
      current.workSpeed > fastest.workSpeed ? current : fastest
    );
  }

  // Price Calculation
  calculateServiceCost(
    cooperatorId: string, 
    serviceType: ServiceType, 
    baseCost: number = 100
  ): number {
    const cooperator = this.cooperators.find(c => c.id === cooperatorId);
    if (!cooperator) return baseCost;

    let cost = baseCost * cooperator.priceMultiplier;

    // Apply discounts
    cooperator.discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        cost *= (1 - discount.value / 100);
      } else {
        cost -= discount.value;
      }
    });

    return Math.round(cost);
  }

  // Distance Calculation (Haversine formula)
  private calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Recommendation Engine
  recommendCooperator(
    serviceType: ServiceType,
    priority: 'price' | 'quality' | 'speed' = 'price'
  ): ServiceCooperator | null {
    switch (priority) {
      case 'price':
        return this.findCheapestCooperator(serviceType);
      case 'quality':
        return this.findBestQualityCooperator(serviceType);
      case 'speed':
        return this.findFastestCooperator(serviceType);
      default:
        return null;
    }
  }

  // Unlock System
  canUnlockCooperator(
    cooperatorId: string, 
    playerLevel: number, 
    playerReputation: number
  ): boolean {
    const cooperator = this.cooperators.find(c => c.id === cooperatorId);
    if (!cooperator || cooperator.unlocked) return false;

    const requirements = cooperator.unlockRequirements;
    if (!requirements) return true;

    const meetsLevel = !requirements.level || playerLevel >= requirements.level;
    const meetsReputation = !requirements.reputation || 
      playerReputation >= requirements.reputation;

    return meetsLevel && meetsReputation;
  }

  getUnlockProgress(
    cooperatorId: string, 
    playerLevel: number, 
    playerReputation: number
  ): {
    level: { current: number; required: number; met: boolean };
    reputation: { current: number; required: number; met: boolean };
    overall: boolean;
  } {
    const cooperator = this.cooperators.find(c => c.id === cooperatorId);
    if (!cooperator) {
      throw new Error('Cooperator not found');
    }

    const requirements = cooperator.unlockRequirements || {};

    return {
      level: {
        current: playerLevel,
        required: requirements.level || 0,
        met: !requirements.level || playerLevel >= requirements.level
      },
      reputation: {
        current: playerReputation,
        required: requirements.reputation || 0,
        met: !requirements.reputation || playerReputation >= requirements.reputation
      },
      overall: this.canUnlockCooperator(cooperatorId, playerLevel, playerReputation)
    };
  }

  // Service Time Estimation
  estimateServiceTime(cooperatorId: string, serviceType: ServiceType): number {
    const cooperator = this.cooperators.find(c => c.id === cooperatorId);
    if (!cooperator) return 60; // Default 60 minutes

    // Base times for different services (in minutes)
    const baseTimes: Record<ServiceType, number> = {
      tire_replacement: 30,
      engine_repair: 180,
      transmission_service: 240,
      suspension_upgrade: 120,
      body_work: 300,
      electronics_install: 90,
      brake_service: 60,
      exhaust_upgrade: 90,
      paint_job: 480,
      interior_detailing: 120,
      oil_change: 20,
      inspection: 45,
      tuning: 150,
      custom_fabrication: 600
    };

    const baseTime = baseTimes[serviceType] || 60;
    return Math.round(baseTime / cooperator.workSpeed);
  }

  // Rating and Reputation
  rateCooperator(cooperatorId: string, rating: number): void {
    const cooperator = this.cooperators.find(c => c.id === cooperatorId);
    if (!cooperator) return;

    // Update reputation based on rating (1-5)
    const reputationChange = (rating - 3) * 2; // -4 to +4
    cooperator.reputation = Math.max(0, Math.min(100, 
      cooperator.reputation + reputationChange
    ));
  }

  // Filtering
  filterByPriceRange(
    minMultiplier: number, 
    maxMultiplier: number
  ): ServiceCooperator[] {
    return this.cooperators.filter(
      c => c.priceMultiplier >= minMultiplier && c.priceMultiplier <= maxMultiplier
    );
  }

  filterByQuality(minQuality: number): ServiceCooperator[] {
    return this.cooperators.filter(c => c.quality >= minQuality);
  }

  filterByReliability(minReliability: number): ServiceCooperator[] {
    return this.cooperators.filter(c => c.reliability >= minReliability);
  }

  // Bulk Operations
  setCooperators(cooperators: ServiceCooperator[]): void {
    this.cooperators = cooperators;
  }

  addCooperator(cooperator: ServiceCooperator): void {
    this.cooperators.push(cooperator);
  }

  getCooperator(id: string): ServiceCooperator | undefined {
    return this.cooperators.find(c => c.id === id);
  }

  getAllCooperators(): ServiceCooperator[] {
    return this.cooperators;
  }

  getUnlockedCooperators(): ServiceCooperator[] {
    return this.cooperators.filter(c => c.unlocked);
  }

  getLockedCooperators(): ServiceCooperator[] {
    return this.cooperators.filter(c => !c.unlocked);
  }
}

export const cooperatorService = new CooperatorService();
export default cooperatorService;
