import { VehiclePart, ServiceCooperator } from './inventory';
import { Vehicle } from './vehicle';

// Type Guards and Validation
export const isValidPart = (part: any): part is VehiclePart => {
  return (
    typeof part?.id === 'string' &&
    typeof part?.name === 'string' &&
    typeof part?.condition === 'number' &&
    part?.condition >= 0 &&
    part?.condition <= 100 &&
    typeof part?.price === 'number' &&
    part?.price >= 0
  );
};

export const isValidCooperator = (coop: any): coop is ServiceCooperator => {
  return (
    typeof coop?.id === 'string' &&
    typeof coop?.name === 'string' &&
    typeof coop?.priceMultiplier === 'number' &&
    coop?.priceMultiplier > 0 &&
    typeof coop?.quality === 'number' &&
    coop?.quality >= 1 &&
    coop?.quality <= 5
  );
};

export const isValidVehicle = (vehicle: any): vehicle is Vehicle => {
  return (
    typeof vehicle?.id === 'string' &&
    typeof vehicle?.make === 'string' &&
    typeof vehicle?.model === 'string'
  );
};

// Part Upgrade System
export interface PartUpgrade {
  id: string;
  tier: number;
  requirements: {
    parts?: string[];
    currency: number;
    workshopLevel: number;
    reputation?: number;
  };
  bonuses: {
    performance: number;
    durability: number;
    specialEffect?: SpecialEffect;
  };
  unlocked: boolean;
}

export interface SpecialEffect {
  id: string;
  name: string;
  description: string;
  type: 'speed_boost' | 'efficiency' | 'durability' | 'unique';
  magnitude: number;
  duration?: number;
}

export interface PartGem {
  id: string;
  name: string;
  type: 'speed' | 'efficiency' | 'durability' | 'special';
  bonus: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  socketable: boolean;
}

export interface Enchantment {
  id: string;
  name: string;
  effect: string;
  bonus: Record<string, number>;
  duration: number;
  stackable: boolean;
}

export interface EnhancedVehiclePart extends VehiclePart {
  upgradeTree?: PartUpgrade[];
  currentUpgradeTier: number;
  socketSlots: number;
  gems: PartGem[];
  enchantments: Enchantment[];
  forgeLevel: number;
  modifications: PartModification[];
}

export interface PartModification {
  id: string;
  name: string;
  type: 'performance' | 'aesthetic' | 'utility';
  cost: number;
  effects: Record<string, number>;
  appliedAt: Date;
}

// Validation Result
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

// Part Installation Validation
export interface InstallationValidation extends ValidationResult {
  compatibilityIssues?: string[];
  recommendedParts?: string[];
}

// Market & Economy
export interface MarketContext {
  region: string;
  seasonalFactor: number;
  eventBonus?: number;
  playerReputation: number;
}

export interface MarketTrend {
  partType: string;
  trend: number; // 0.5 to 2.0
  volume: number;
  lastUpdate: Date;
  prediction: 'rising' | 'falling' | 'stable';
}

export interface PriceHistory {
  partId: string;
  prices: Array<{
    date: Date;
    price: number;
    volume: number;
  }>;
}

// Negotiation
export interface NegotiationResult {
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  bonusServices: BonusService[];
  reputationChange: number;
}

export interface BonusService {
  id: string;
  name: string;
  value: number;
  description: string;
}

export interface DealResponse {
  accepted: boolean;
  counterOffer?: number;
  message: string;
  reputationGain?: number;
  unlockBonus?: string[];
}

// Weather & Environment
export interface Weather {
  condition: 'clear' | 'rain' | 'snow' | 'fog' | 'storm';
  temperature: number;
  visibility: number;
  roadCondition: 'dry' | 'wet' | 'icy' | 'flooded';
  wind: number;
}

export interface VehicleModifiers {
  performanceMultiplier: number;
  fuelConsumptionMultiplier: number;
  partDegradationRate: number;
  accidentRisk: number;
  visibilityReduction: number;
}

// Analytics
export interface GameAction {
  type: string;
  category: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

// Performance Metrics
export interface PerformanceMetrics {
  fps: number;
  loadTime: number;
  memoryUsage: number;
  apiLatency: number;
  renderTime: number;
}

// Filter Types
export interface PartFilters {
  type?: string;
  rarity?: string;
  minCondition?: number;
  maxPrice?: number;
  installed?: boolean;
  minPerformance?: number;
  hasUpgrades?: boolean;
}

export interface CooperatorFilters {
  services?: string[];
  minQuality?: number;
  maxPriceMultiplier?: number;
  unlocked?: boolean;
  city?: string;
  specialties?: string[];
}
