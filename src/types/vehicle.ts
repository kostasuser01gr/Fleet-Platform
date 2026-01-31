export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'sedan' | 'suv' | 'truck' | 'sports' | 'luxury';
  color: string;
  status: 'available' | 'rented' | 'maintenance';
  image: string;
  vin: string;
  licensePlate: string;
  mileage: number;
  purchasePrice: number;
  rentalPricePerDay: number;
  features: VehicleFeature[];
  costs: VehicleCosts;
  stats: VehicleStats;
}

export interface VehicleFeature {
  name: string;
  category: 'exterior' | 'interior' | 'performance' | 'safety';
  installed: boolean;
  cost: number;
}

export interface VehicleCosts {
  maintenance: number;
  fuel: number;
  insurance: number;
  repairs: number;
  total: number;
}

export interface VehicleStats {
  totalRentals: number;
  totalRevenue: number;
  daysRented: number;
  averageRating: number;
}

export interface FleetStats {
  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  maintenanceVehicles: number;
  totalValue: number;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
}
