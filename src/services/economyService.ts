import { VehiclePart } from '../types/inventory';
import { MarketContext, MarketTrend, PriceHistory } from '../types/advancedInventory';

export class EconomyService {
  private static marketTrends: Map<string, MarketTrend> = new Map();
  private static priceHistory: Map<string, PriceHistory> = new Map();
  private static demandMultipliers: Map<string, number> = new Map();
  private static lastUpdate: Date = new Date();

  static initialize(): void {
    // Initialize market trends for all part types
    const partTypes = ['engine', 'tires', 'transmission', 'suspension', 'brakes', 'electronics', 'paint'];
    
    partTypes.forEach(type => {
      this.marketTrends.set(type, {
        partType: type,
        trend: 1.0,
        volume: Math.floor(Math.random() * 1000),
        lastUpdate: new Date(),
        prediction: 'stable'
      });
      
      this.demandMultipliers.set(type, 1.0);
    });

    // Start market simulation
    this.startMarketSimulation();
  }

  static calculatePartPrice(
    part: VehiclePart,
    context: MarketContext = {
      region: 'US',
      seasonalFactor: 1.0,
      playerReputation: 0
    }
  ): number {
    const basePrice = part.price;
    
    // Get market trend
    const trend = this.marketTrends.get(part.type)?.trend || 1.0;
    
    // Get demand multiplier
    const demand = this.demandMultipliers.get(part.type) || 1.0;
    
    // Condition affects price
    const conditionMultiplier = part.condition / 100;
    
    // Rarity premium
    const rarityMultipliers: Record<string, number> = {
      common: 1.0,
      uncommon: 1.5,
      rare: 2.5,
      epic: 4.0,
      legendary: 8.0
    };
    
    const rarityMultiplier = rarityMultipliers[part.rarity] || 1.0;
    
    // Seasonal factor
    const seasonal = context.seasonalFactor || 1.0;
    
    // Event bonus
    const eventBonus = context.eventBonus || 0;
    
    // Reputation discount (0-15%)
    const reputationDiscount = Math.min(context.playerReputation / 1000 * 0.15, 0.15);
    
    let finalPrice = basePrice * 
      trend * 
      demand * 
      conditionMultiplier * 
      rarityMultiplier * 
      seasonal;
    
    // Apply event bonus
    finalPrice += eventBonus;
    
    // Apply reputation discount
    finalPrice *= (1 - reputationDiscount);
    
    return Math.round(finalPrice);
  }

  static updateMarketTrends(): void {
    this.marketTrends.forEach((trend, partType) => {
      // Simulate market fluctuation (-10% to +10% per update)
      const change = (Math.random() - 0.5) * 0.2;
      const newTrend = Math.max(0.5, Math.min(2.0, trend.trend + change));
      
      // Determine prediction
      let prediction: 'rising' | 'falling' | 'stable' = 'stable';
      if (change > 0.05) prediction = 'rising';
      else if (change < -0.05) prediction = 'falling';
      
      // Update volume
      const volumeChange = Math.floor((Math.random() - 0.5) * 200);
      const newVolume = Math.max(0, trend.volume + volumeChange);
      
      this.marketTrends.set(partType, {
        ...trend,
        trend: newTrend,
        volume: newVolume,
        lastUpdate: new Date(),
        prediction
      });
      
      // Update demand based on volume
      const demandChange = volumeChange > 0 ? 0.05 : -0.05;
      const currentDemand = this.demandMultipliers.get(partType) || 1.0;
      this.demandMultipliers.set(
        partType,
        Math.max(0.5, Math.min(2.0, currentDemand + demandChange))
      );
    });
    
    this.lastUpdate = new Date();
  }

  static getInvestmentOpportunities(): string[] {
    const opportunities: string[] = [];
    
    this.marketTrends.forEach((trend, partType) => {
      // Find parts with low trend but rising prediction
      if (trend.trend < 0.9 && trend.prediction === 'rising') {
        opportunities.push(partType);
      }
      
      // Find parts with low demand but high volume
      const demand = this.demandMultipliers.get(partType) || 1.0;
      if (demand < 0.8 && trend.volume > 500) {
        opportunities.push(partType);
      }
    });
    
    return [...new Set(opportunities)];
  }

  static getMarketTrend(partType: string): MarketTrend | undefined {
    return this.marketTrends.get(partType);
  }

  static getAllMarketTrends(): MarketTrend[] {
    return Array.from(this.marketTrends.values());
  }

  static recordPriceHistory(part: VehiclePart, price: number): void {
    const history = this.priceHistory.get(part.id) || {
      partId: part.id,
      prices: []
    };
    
    history.prices.push({
      date: new Date(),
      price,
      volume: this.marketTrends.get(part.type)?.volume || 0
    });
    
    // Keep only last 30 days
    if (history.prices.length > 30) {
      history.prices = history.prices.slice(-30);
    }
    
    this.priceHistory.set(part.id, history);
  }

  static getPriceHistory(partId: string): PriceHistory | undefined {
    return this.priceHistory.get(partId);
  }

  static predictFuturePrice(part: VehiclePart, daysAhead: number = 7): number {
    const currentPrice = this.calculatePartPrice(part);
    const trend = this.marketTrends.get(part.type);
    
    if (!trend) return currentPrice;
    
    // Simple linear prediction based on current trend
    const dailyChange = (trend.trend - 1.0) / 7;
    const predictedMultiplier = 1 + (dailyChange * daysAhead);
    
    return Math.round(currentPrice * predictedMultiplier);
  }

  static applySeasonalEvent(event: string, multiplier: number, duration: number): void {
    setTimeout(() => {
      this.marketTrends.forEach((trend, partType) => {
        const newTrend = trend.trend * multiplier;
        this.marketTrends.set(partType, { ...trend, trend: newTrend });
      });
    }, 0);
    
    // Revert after duration
    setTimeout(() => {
      this.marketTrends.forEach((trend, partType) => {
        const newTrend = trend.trend / multiplier;
        this.marketTrends.set(partType, { ...trend, trend: newTrend });
      });
    }, duration);
  }

  private static startMarketSimulation(): void {
    // Update market every hour
    setInterval(() => {
      this.updateMarketTrends();
    }, 60 * 60 * 1000);
  }

  static getMarketSummary(): {
    trending: string[];
    declining: string[];
    stable: string[];
    hotDeals: string[];
  } {
    const trending: string[] = [];
    const declining: string[] = [];
    const stable: string[] = [];
    const hotDeals: string[] = [];
    
    this.marketTrends.forEach((trend, partType) => {
      if (trend.prediction === 'rising') trending.push(partType);
      else if (trend.prediction === 'falling') declining.push(partType);
      else stable.push(partType);
      
      const demand = this.demandMultipliers.get(partType) || 1.0;
      if (demand < 0.7 && trend.trend < 0.8) {
        hotDeals.push(partType);
      }
    });
    
    return { trending, declining, stable, hotDeals };
  }
}

// Initialize on import
EconomyService.initialize();

export default EconomyService;
