export interface VehiclePart {
  id: string;
  name: string;
  category: 'engine' | 'body' | 'interior' | 'electronics' | 'wheels' | 'tools';
  price: number;
  quality: 'basic' | 'standard' | 'premium' | 'luxury' | 'legendary';
  image?: string;
  description: string;
  compatibility: string[]; // Vehicle types this part works with
  stats: {
    performance?: number;
    durability?: number;
    efficiency?: number;
    appeal?: number;
  };
  isPremium: boolean;
}

export interface Tool {
  id: string;
  name: string;
  type: 'wrench' | 'screwdriver' | 'multimeter' | 'scanner' | 'lift' | 'special';
  required: boolean;
  available: boolean;
  location?: string; // GPS location if needed
  isPremium: boolean;
}

export interface AssemblySession {
  id: string;
  vehicleId: string;
  parts: VehiclePart[];
  tools: Tool[];
  progress: number; // 0-100
  status: 'in-progress' | 'completed' | 'paused';
  startedAt: Date;
  completedAt?: Date;
  xpEarned: number;
  coinsEarned: number;
  quality: 'basic' | 'standard' | 'premium' | 'luxury' | 'legendary';
}
