import { Vehicle } from '../types/vehicle';
import { Rental } from '../types/rental';

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalRentals: number;
  averageRentalDuration: number;
  fleetUtilization: number;
  popularVehicles: Array<{ vehicleId: string; name: string; rentals: number }>;
  revenueByVehicleType: Record<string, number>;
  peakHours: Array<{ hour: number; count: number }>;
  customerRetention: number;
  maintenanceCosts: number;
  profitMargin: number;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  rentals: number;
  utilization: number;
}

export interface PredictionResult {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

class AnalyticsEngine {
  private vehicles: Vehicle[] = [];
  private rentals: Rental[] = [];

  setData(vehicles: Vehicle[], rentals: Rental[]) {
    this.vehicles = vehicles;
    this.rentals = rentals;
  }

  calculateMetrics(): AnalyticsMetrics {
    const totalRevenue = this.calculateTotalRevenue();
    const totalRentals = this.rentals.length;
    const averageRentalDuration = this.calculateAverageRentalDuration();
    const fleetUtilization = this.calculateFleetUtilization();
    const popularVehicles = this.getPopularVehicles();
    const revenueByVehicleType = this.getRevenueByVehicleType();
    const peakHours = this.getPeakHours();
    const customerRetention = this.calculateCustomerRetention();
    const maintenanceCosts = this.calculateMaintenanceCosts();
    const profitMargin = this.calculateProfitMargin(totalRevenue, maintenanceCosts);

    return {
      totalRevenue,
      totalRentals,
      averageRentalDuration,
      fleetUtilization,
      popularVehicles,
      revenueByVehicleType,
      peakHours,
      customerRetention,
      maintenanceCosts,
      profitMargin,
    };
  }

  private calculateTotalRevenue(): number {
    return this.rentals.reduce((sum, rental) => sum + rental.totalCost, 0);
  }

  private calculateAverageRentalDuration(): number {
    if (this.rentals.length === 0) return 0;
    
    const totalDuration = this.rentals.reduce((sum, rental) => {
      const start = new Date(rental.startDate).getTime();
      const end = new Date(rental.endDate).getTime();
      return sum + (end - start);
    }, 0);

    return totalDuration / this.rentals.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  private calculateFleetUtilization(): number {
    if (this.vehicles.length === 0) return 0;
    const rentedVehicles = this.vehicles.filter(v => v.status === 'rented').length;
    return (rentedVehicles / this.vehicles.length) * 100;
  }

  private getPopularVehicles() {
    const vehicleRentals = new Map<string, { name: string; count: number }>();
    
    this.rentals.forEach(rental => {
      const vehicle = this.vehicles.find(v => v.id === rental.vehicleId);
      if (vehicle) {
        const vehicleName = `${vehicle.make} ${vehicle.model}`;
        const current = vehicleRentals.get(vehicle.id) || { name: vehicleName, count: 0 };
        vehicleRentals.set(vehicle.id, { name: vehicleName, count: current.count + 1 });
      }
    });

    return Array.from(vehicleRentals.entries())
      .map(([vehicleId, data]) => ({
        vehicleId,
        name: data.name,
        rentals: data.count,
      }))
      .sort((a, b) => b.rentals - a.rentals)
      .slice(0, 5);
  }

  private getRevenueByVehicleType(): Record<string, number> {
    const revenueByType: Record<string, number> = {};
    
    this.rentals.forEach(rental => {
      const vehicle = this.vehicles.find(v => v.id === rental.vehicleId);
      if (vehicle) {
        revenueByType[vehicle.type] = (revenueByType[vehicle.type] || 0) + rental.totalCost;
      }
    });

    return revenueByType;
  }

  private getPeakHours(): Array<{ hour: number; count: number }> {
    const hourCounts = new Array(24).fill(0);
    
    this.rentals.forEach(rental => {
      const hour = new Date(rental.startDate).getHours();
      hourCounts[hour]++;
    });

    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateCustomerRetention(): number {
    const customerRentals = new Map<string, number>();
    
    this.rentals.forEach(rental => {
      const count = customerRentals.get(rental.customerName) || 0;
      customerRentals.set(rental.customerName, count + 1);
    });

    const totalCustomers = customerRentals.size;
    const repeatCustomers = Array.from(customerRentals.values()).filter(count => count > 1).length;

    return totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
  }

  private calculateMaintenanceCosts(): number {
    return this.vehicles.reduce((sum, vehicle) => {
      return sum + (vehicle.costs.maintenance || 0);
    }, 0);
  }

  private calculateProfitMargin(revenue: number, costs: number): number {
    if (revenue === 0) return 0;
    return ((revenue - costs) / revenue) * 100;
  }

  generateTimeSeriesData(days: number = 30): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayRentals = this.rentals.filter(r => {
        const rentalDate = new Date(r.startDate).toISOString().split('T')[0];
        return rentalDate === dateStr;
      });

      data.push({
        date: dateStr,
        revenue: dayRentals.reduce((sum, r) => sum + r.totalCost, 0),
        rentals: dayRentals.length,
        utilization: this.calculateFleetUtilization(),
      });
    }

    return data;
  }

  predictTrends(): PredictionResult[] {
    const timeSeriesData = this.generateTimeSeriesData(30);
    
    if (timeSeriesData.length < 7) {
      return [];
    }

    const predictions: PredictionResult[] = [];

    // Revenue prediction
    const revenueValues = timeSeriesData.map(d => d.revenue);
    const revenuePrediction = this.simpleLinearRegression(revenueValues);
    predictions.push({
      metric: 'Revenue',
      current: revenueValues[revenueValues.length - 1],
      predicted: revenuePrediction.predicted,
      confidence: revenuePrediction.confidence,
      trend: revenuePrediction.trend,
    });

    // Utilization prediction
    const utilizationValues = timeSeriesData.map(d => d.utilization);
    const utilizationPrediction = this.simpleLinearRegression(utilizationValues);
    predictions.push({
      metric: 'Fleet Utilization',
      current: utilizationValues[utilizationValues.length - 1],
      predicted: utilizationPrediction.predicted,
      confidence: utilizationPrediction.confidence,
      trend: utilizationPrediction.trend,
    });

    return predictions;
  }

  private simpleLinearRegression(values: number[]): { 
    predicted: number; 
    confidence: number; 
    trend: 'up' | 'down' | 'stable' 
  } {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const predicted = slope * n + intercept;
    const current = values[values.length - 1];
    
    const variance = values.reduce((sum, val) => {
      const diff = val - (sumY / n);
      return sum + diff * diff;
    }, 0) / n;

    const confidence = Math.min(100, Math.max(0, 100 - (variance / Math.abs(current || 1) * 100)));

    let trend: 'up' | 'down' | 'stable';
    const change = current !== 0 ? ((predicted - current) / current) * 100 : 0;
    
    if (Math.abs(change) < 5) {
      trend = 'stable';
    } else if (change > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }

    return { predicted, confidence, trend };
  }

  generateInsights(): string[] {
    const metrics = this.calculateMetrics();
    const insights: string[] = [];

    if (metrics.fleetUtilization > 80) {
      insights.push('⚠️ Fleet utilization is high. Consider expanding your fleet to meet demand.');
    }

    if (metrics.fleetUtilization < 40) {
      insights.push('💡 Fleet utilization is low. Focus on marketing to increase bookings.');
    }

    if (metrics.profitMargin < 20) {
      insights.push('⚠️ Profit margin is below optimal levels. Review maintenance costs and pricing strategy.');
    }

    if (metrics.customerRetention > 70) {
      insights.push('🎉 Excellent customer retention! Your service quality is working well.');
    }

    const topVehicle = metrics.popularVehicles[0];
    if (topVehicle) {
      insights.push(`🚗 ${topVehicle.name} is your most popular vehicle with ${topVehicle.rentals} rentals.`);
    }

    return insights;
  }
}

export const analyticsEngine = new AnalyticsEngine();
