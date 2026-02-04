import { VehiclePart, ServiceCooperator, ServiceJob, PartInstallation } from '../types/inventory';
import { Vehicle } from '../types/vehicle';

class InventoryService {
  private parts: VehiclePart[] = [];
  private cooperators: ServiceCooperator[] = [];
  private activeJobs: ServiceJob[] = [];
  private installations: PartInstallation[] = [];

  // Parts Management
  addPart(part: VehiclePart): void {
    this.parts.push(part);
  }

  removePart(partId: string): void {
    this.parts = this.parts.filter(p => p.id !== partId);
  }

  getPart(partId: string): VehiclePart | undefined {
    return this.parts.find(p => p.id === partId);
  }

  getAllParts(): VehiclePart[] {
    return this.parts;
  }

  getAvailableParts(): VehiclePart[] {
    return this.parts.filter(p => !p.installed);
  }

  getInstalledParts(vehicleId: string): VehiclePart[] {
    return this.parts.filter(p => p.installed && p.vehicleId === vehicleId);
  }

  filterPartsByType(type: string): VehiclePart[] {
    return this.parts.filter(p => p.type === type);
  }

  filterPartsByRarity(rarity: string): VehiclePart[] {
    return this.parts.filter(p => p.rarity === rarity);
  }

  // Part Installation
  installPart(partId: string, vehicleId: string, mileage: number = 0): boolean {
    const part = this.getPart(partId);
    if (!part || part.installed) return false;

    // Uninstall any existing part of the same type
    const existingPart = this.parts.find(
      p => p.installed && p.vehicleId === vehicleId && p.type === part.type
    );
    
    if (existingPart) {
      this.uninstallPart(existingPart.id);
    }

    // Install the new part
    part.installed = true;
    part.vehicleId = vehicleId;

    // Record installation
    const installation: PartInstallation = {
      partId,
      vehicleId,
      installedAt: new Date(),
      condition: part.condition,
      mileageAtInstall: mileage
    };
    this.installations.push(installation);

    return true;
  }

  uninstallPart(partId: string): boolean {
    const part = this.getPart(partId);
    if (!part || !part.installed) return false;

    part.installed = false;
    part.vehicleId = undefined;

    return true;
  }

  // Vehicle Stats Calculation
  calculateVehicleStats(vehicleId: string): {
    speed: number;
    acceleration: number;
    handling: number;
    durability: number;
    efficiency: number;
  } {
    const installedParts = this.getInstalledParts(vehicleId);
    
    const stats = {
      speed: 0,
      acceleration: 0,
      handling: 0,
      durability: 0,
      efficiency: 0
    };

    installedParts.forEach(part => {
      if (part.stats.speed) stats.speed += part.stats.speed;
      if (part.stats.acceleration) stats.acceleration += part.stats.acceleration;
      if (part.stats.handling) stats.handling += part.stats.handling;
      if (part.stats.durability) stats.durability += part.stats.durability;
      if (part.stats.efficiency) stats.efficiency += part.stats.efficiency;
    });

    return stats;
  }

  // Part Degradation
  degradePart(partId: string, amount: number = 1): void {
    const part = this.getPart(partId);
    if (!part) return;

    part.condition = Math.max(0, part.condition - amount);
    
    // If condition drops too low, reduce performance
    if (part.condition < 50) {
      part.performance = Math.floor(part.performance * (part.condition / 100));
    }
  }

  degradeVehicleParts(vehicleId: string, amount: number = 1): void {
    const installedParts = this.getInstalledParts(vehicleId);
    installedParts.forEach(part => {
      this.degradePart(part.id, amount);
    });
  }

  // Repair Part
  repairPart(partId: string, amount: number = 100): void {
    const part = this.getPart(partId);
    if (!part) return;

    part.condition = Math.min(100, part.condition + amount);
  }

  // Cooperator Management
  addCooperator(cooperator: ServiceCooperator): void {
    this.cooperators.push(cooperator);
  }

  getCooperator(cooperatorId: string): ServiceCooperator | undefined {
    return this.cooperators.find(c => c.id === cooperatorId);
  }

  getAllCooperators(): ServiceCooperator[] {
    return this.cooperators;
  }

  getUnlockedCooperators(): ServiceCooperator[] {
    return this.cooperators.filter(c => c.unlocked);
  }

  unlockCooperator(cooperatorId: string): boolean {
    const cooperator = this.getCooperator(cooperatorId);
    if (!cooperator || cooperator.unlocked) return false;

    cooperator.unlocked = true;
    return true;
  }

  filterCooperatorsByService(serviceType: string): ServiceCooperator[] {
    return this.cooperators.filter(c => c.services.includes(serviceType as any));
  }

  // Service Jobs
  createServiceJob(
    vehicleId: string,
    cooperatorId: string,
    serviceType: string,
    partIds?: string[]
  ): ServiceJob {
    const cooperator = this.getCooperator(cooperatorId);
    if (!cooperator) {
      throw new Error('Cooperator not found');
    }

    // Calculate cost based on cooperator pricing
    let baseCost = 100; // Base service cost
    if (partIds && partIds.length > 0) {
      partIds.forEach(partId => {
        const part = this.getPart(partId);
        if (part) baseCost += part.price;
      });
    }

    const cost = baseCost * cooperator.priceMultiplier;

    // Apply discounts
    let finalCost = cost;
    cooperator.discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        finalCost *= (1 - discount.value / 100);
      } else {
        finalCost -= discount.value;
      }
    });

    const job: ServiceJob = {
      id: `job-${Date.now()}`,
      vehicleId,
      cooperatorId,
      serviceType: serviceType as any,
      partIds,
      status: 'pending',
      cost: Math.round(finalCost)
    };

    this.activeJobs.push(job);
    return job;
  }

  startServiceJob(jobId: string): boolean {
    const job = this.activeJobs.find(j => j.id === jobId);
    if (!job || job.status !== 'pending') return false;

    const cooperator = this.getCooperator(job.cooperatorId);
    if (!cooperator) return false;

    job.status = 'in_progress';
    job.startTime = new Date();

    // Calculate completion time based on work speed
    const baseTime = 60 * 60 * 1000; // 1 hour in milliseconds
    const adjustedTime = baseTime / cooperator.workSpeed;
    job.estimatedCompletion = new Date(Date.now() + adjustedTime);

    return true;
  }

  completeServiceJob(jobId: string): boolean {
    const job = this.activeJobs.find(j => j.id === jobId);
    if (!job || job.status !== 'in_progress') return false;

    const cooperator = this.getCooperator(job.cooperatorId);
    if (!cooperator) return false;

    job.status = 'completed';
    job.actualCompletion = new Date();
    job.qualityRating = cooperator.quality;

    // Apply service effects
    if (job.partIds) {
      job.partIds.forEach(partId => {
        // Repair or install parts
        this.repairPart(partId, 50);
      });
    }

    return true;
  }

  getActiveJobs(vehicleId?: string): ServiceJob[] {
    if (vehicleId) {
      return this.activeJobs.filter(j => j.vehicleId === vehicleId && j.status !== 'completed');
    }
    return this.activeJobs.filter(j => j.status !== 'completed');
  }

  // Market Price Calculation
  calculateMarketPrice(part: VehiclePart, fluctuation: number = 0): number {
    const basePrice = part.price;
    const rarityMultiplier = {
      common: 1.0,
      uncommon: 1.5,
      rare: 2.5,
      epic: 4.0,
      legendary: 6.0
    }[part.rarity] || 1.0;

    const conditionMultiplier = part.condition / 100;
    const marketPrice = basePrice * rarityMultiplier * conditionMultiplier;
    
    // Apply market fluctuation (-20% to +20%)
    const fluctuatedPrice = marketPrice * (1 + fluctuation / 100);
    
    return Math.round(fluctuatedPrice);
  }

  // Sorting
  sortPartsByPrice(ascending: boolean = true): VehiclePart[] {
    return [...this.parts].sort((a, b) => 
      ascending ? a.price - b.price : b.price - a.price
    );
  }

  sortPartsByPerformance(ascending: boolean = false): VehiclePart[] {
    return [...this.parts].sort((a, b) => 
      ascending ? a.performance - b.performance : b.performance - a.performance
    );
  }

  sortPartsByCondition(ascending: boolean = false): VehiclePart[] {
    return [...this.parts].sort((a, b) => 
      ascending ? a.condition - b.condition : b.condition - a.condition
    );
  }

  // Analytics
  getTotalInventoryValue(): number {
    return this.parts.reduce((total, part) => total + part.price, 0);
  }

  getPartsByTypeCount(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.parts.forEach(part => {
      counts[part.type] = (counts[part.type] || 0) + 1;
    });
    return counts;
  }

  getAveragePartCondition(): number {
    if (this.parts.length === 0) return 0;
    const total = this.parts.reduce((sum, part) => sum + part.condition, 0);
    return Math.round(total / this.parts.length);
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
