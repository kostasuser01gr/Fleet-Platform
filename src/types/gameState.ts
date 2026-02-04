import { Vehicle } from './vehicle';
import { VehiclePart, ServiceCooperator, Consumable, ServiceJob } from './inventory';
import { Achievement } from './gamification';
import { Rental } from './rental';

export interface GameState {
  player: PlayerState;
  vehicles: Vehicle[];
  inventory: {
    parts: VehiclePart[];
    consumables: Consumable[];
    maxSlots: number;
  };
  cooperators: ServiceCooperator[];
  activeJobs: ServiceJob[];
  economy: EconomyState;
  progression: ProgressionState;
  settings: GameSettings;
}

export interface PlayerState {
  id: string;
  username: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  reputation: number;
  budget: number;
  currency: {
    premium: number;
    tokens: number;
  };
  unlockedFeatures: string[];
  stats: {
    totalMilesDriven: number;
    totalVehiclesOwned: number;
    totalPartsInstalled: number;
    totalServicesCompleted: number;
    totalEarnings: number;
    totalSpent: number;
  };
  skills: {
    mechanics: number; // reduces service costs
    negotiation: number; // better prices from cooperators
    driving: number; // reduces vehicle wear
    business: number; // increases rental income
  };
}

export interface EconomyState {
  marketPrices: {
    [partType: string]: {
      base: number;
      fluctuation: number; // percentage
    };
  };
  demandFactors: {
    [serviceType: string]: number; // affects cooperator prices
  };
  seasonalEvents: SeasonalEvent[];
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  effects: {
    priceMultipliers?: { [key: string]: number };
    specialParts?: string[];
    bonusRewards?: number;
  };
  active: boolean;
}

export interface ProgressionState {
  currentMissions: Mission[];
  completedMissions: string[];
  achievements: Achievement[];
  unlockedCooperators: string[];
  researchProgress: {
    [researchId: string]: number;
  };
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'delivery' | 'upgrade' | 'service' | 'collect' | 'challenge';
  objectives: MissionObjective[];
  rewards: {
    experience: number;
    money: number;
    reputation?: number;
    items?: string[];
  };
  deadline?: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  status: 'available' | 'active' | 'completed' | 'failed';
}

export interface MissionObjective {
  id: string;
  description: string;
  type: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface GameSettings {
  difficulty: 'casual' | 'normal' | 'hardcore';
  autoSave: boolean;
  notifications: {
    serviceComplete: boolean;
    lowCondition: boolean;
    missions: boolean;
    deals: boolean;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    effects: boolean;
    shadows: boolean;
  };
  audio: {
    master: number;
    effects: number;
    music: number;
  };
}

export interface DailyDeal {
  id: string;
  partId: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  expiresAt: Date;
  limited: boolean;
  quantityAvailable?: number;
}
