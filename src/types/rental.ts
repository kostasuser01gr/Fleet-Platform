export interface Rental {
  id: string;
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  dailyRate: number;
  totalCost: number;
  status: 'active' | 'completed' | 'upcoming';
  rating?: number;
  review?: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  type: 'oil-change' | 'tire-rotation' | 'brake-service' | 'inspection' | 'repair';
  scheduledDate: Date;
  cost: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'rental' | 'maintenance' | 'vehicle-added' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

export interface GameProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalEarnings: number;
  vehiclesManaged: number;
  rentalsCompleted: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: Date;
  reward: number;
  icon: string;
}
