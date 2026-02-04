export interface VehiclePart {
  id: string;
  name: string;
  type: 'engine' | 'tires' | 'transmission' | 'suspension' | 'body' | 'electronics' | 'brakes' | 'exhaust' | 'interior' | 'paint';
  manufacturer: string;
  condition: number; // 0-100
  performance: number; // performance boost percentage
  durability: number; // how long it lasts
  price: number;
  installed: boolean;
  vehicleId?: string; // if installed on a vehicle
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  stats: {
    speed?: number;
    acceleration?: number;
    handling?: number;
    durability?: number;
    efficiency?: number;
  };
  requirements?: {
    level?: number;
    reputation?: number;
  };
  imageUrl?: string;
}

export interface ServiceCooperator {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  services: ServiceType[];
  priceMultiplier: number; // 0.5 = very cheap, 1.0 = normal, 2.0 = expensive
  quality: number; // 1-5 stars
  specialties: string[];
  unlocked: boolean;
  unlockCost?: number;
  unlockRequirements?: {
    level?: number;
    reputation?: number;
    completedMissions?: string[];
  };
  discounts: Discount[];
  workSpeed: number; // 0.5 = slow, 1.0 = normal, 2.0 = fast
  reliability: number; // 0-100
  reputation: number; // 0-100
  availableHours: {
    open: string;
    close: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export type ServiceType = 
  | 'tire_replacement'
  | 'engine_repair'
  | 'transmission_service'
  | 'suspension_upgrade'
  | 'body_work'
  | 'electronics_install'
  | 'brake_service'
  | 'exhaust_upgrade'
  | 'paint_job'
  | 'interior_detailing'
  | 'oil_change'
  | 'inspection'
  | 'tuning'
  | 'custom_fabrication';

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  condition?: string;
  expiresAt?: Date;
}

export interface Consumable {
  id: string;
  name: string;
  type: 'oil' | 'coolant' | 'brake_fluid' | 'fuel_additive' | 'cleaning' | 'tool';
  quantity: number;
  price: number;
  effect?: {
    conditionBoost?: number;
    performanceBoost?: number;
    duration?: number; // in game days
  };
}

export interface InventoryState {
  parts: VehiclePart[];
  consumables: Consumable[];
  maxSlots: number;
  currentSlots: number;
}

export interface ServiceJob {
  id: string;
  vehicleId: string;
  cooperatorId: string;
  serviceType: ServiceType;
  partIds?: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  cost: number;
  qualityRating?: number;
}

export interface PartInstallation {
  partId: string;
  vehicleId: string;
  installedAt: Date;
  installedBy?: string; // player or cooperator id
  condition: number;
  mileageAtInstall: number;
}
