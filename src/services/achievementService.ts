import { Achievement } from '../types/missions';

export class AchievementService {
  private static achievements: Achievement[] = [];
  private static playerProgress: Map<string, number> = new Map();

  static initialize(): void {
    this.achievements = this.createAchievements();
  }

  private static createAchievements(): Achievement[] {
    return [
      {
        id: 'ach-first-vehicle',
        name: 'First Ride',
        description: 'Add your first vehicle to the fleet',
        icon: '🚗',
        category: 'collector',
        tiers: [
          { tier: 1, requirement: 1, title: 'Starter', description: 'Add first vehicle', reward: { currency: 500, experience: 100 } },
          { tier: 2, requirement: 5, title: 'Collector', description: 'Add 5 vehicles', reward: { currency: 2000, experience: 500 } },
          { tier: 3, requirement: 10, title: 'Fleet Builder', description: 'Add 10 vehicles', reward: { currency: 5000, experience: 1000 } },
          { tier: 4, requirement: 25, title: 'Fleet Manager', description: 'Add 25 vehicles', reward: { currency: 10000, experience: 2500 } },
          { tier: 5, requirement: 50, title: 'Fleet Commander', description: 'Add 50 vehicles', reward: { currency: 25000, experience: 5000 } },
          { tier: 6, requirement: 100, title: 'Fleet Master', description: 'Add 100 vehicles', reward: { currency: 50000, experience: 10000, title: 'fleet_master' } },
        ],
        currentTier: 0,
        progress: 0,
        totalProgress: 100,
        unlocked: false,
        rewards: [],
        hidden: false,
      },
      {
        id: 'ach-part-collector',
        name: 'Part Collector',
        description: 'Collect vehicle parts',
        icon: '⚙️',
        category: 'collector',
        tiers: [
          { tier: 1, requirement: 5, title: 'Novice', description: 'Collect 5 parts', reward: { currency: 300, experience: 50 } },
          { tier: 2, requirement: 15, title: 'Gatherer', description: 'Collect 15 parts', reward: { currency: 1000, experience: 200 } },
          { tier: 3, requirement: 30, title: 'Collector', description: 'Collect 30 parts', reward: { currency: 2500, experience: 500 } },
          { tier: 4, requirement: 50, title: 'Hoarder', description: 'Collect 50 parts', reward: { currency: 5000, experience: 1000 } },
          { tier: 5, requirement: 100, title: 'Specialist', description: 'Collect 100 parts', reward: { currency: 15000, experience: 3000 } },
          { tier: 6, requirement: 200, title: 'Expert', description: 'Collect 200 parts', reward: { currency: 30000, experience: 7500, title: 'parts_expert' } },
        ],
        currentTier: 0,
        progress: 0,
        totalProgress: 200,
        unlocked: false,
        rewards: [],
        hidden: false,
      },
      {
        id: 'ach-mission-master',
        name: 'Mission Master',
        description: 'Complete missions',
        icon: '🎯',
        category: 'explorer',
        tiers: [
          { tier: 1, requirement: 1, title: 'Beginner', description: 'Complete 1 mission', reward: { currency: 500, experience: 100 } },
          { tier: 2, requirement: 10, title: 'Operative', description: 'Complete 10 missions', reward: { currency: 2000, experience: 500 } },
          { tier: 3, requirement: 25, title: 'Agent', description: 'Complete 25 missions', reward: { currency: 5000, experience: 1200 } },
          { tier: 4, requirement: 50, title: 'Veteran', description: 'Complete 50 missions', reward: { currency: 12000, experience: 3000 } },
          { tier: 5, requirement: 100, title: 'Elite', description: 'Complete 100 missions', reward: { currency: 25000, experience: 6000 } },
          { tier: 6, requirement: 250, title: 'Legend', description: 'Complete 250 missions', reward: { currency: 60000, experience: 15000, badge: 'legendary_agent' } },
        ],
        currentTier: 0,
        progress: 0,
        totalProgress: 250,
        unlocked: false,
        rewards: [],
        hidden: false,
      },
      {
        id: 'ach-big-spender',
        name: 'Big Spender',
        description: 'Spend currency on upgrades',
        icon: '💰',
        category: 'trader',
        tiers: [
          { tier: 1, requirement: 5000, title: 'Spender', description: 'Spend 5,000 currency', reward: { experience: 200, currency: 500 } },
          { tier: 2, requirement: 25000, title: 'Big Spender', description: 'Spend 25,000 currency', reward: { experience: 800, currency: 2000 } },
          { tier: 3, requirement: 100000, title: 'High Roller', description: 'Spend 100,000 currency', reward: { experience: 2000, currency: 7500 } },
          { tier: 4, requirement: 500000, title: 'Tycoon', description: 'Spend 500,000 currency', reward: { experience: 5000, currency: 25000 } },
          { tier: 5, requirement: 1000000, title: 'Magnate', description: 'Spend 1,000,000 currency', reward: { experience: 10000, currency: 75000 } },
          { tier: 6, requirement: 5000000, title: 'Financial Legend', description: 'Spend 5,000,000 currency', reward: { experience: 25000, currency: 200000, badge: 'high_roller' } },
        ],
        currentTier: 0,
        progress: 0,
        totalProgress: 5000000,
        unlocked: false,
        rewards: [],
        hidden: false,
      },
      {
        id: 'ach-speed-demon',
        name: 'Speed Demon',
        description: 'Achieve high vehicle performance ratings',
        icon: '⚡',
        category: 'racer',
        tiers: [
          { tier: 1, requirement: 100, title: 'Fast', description: 'Reach 100 performance points', reward: { currency: 1000, experience: 250 } },
          { tier: 2, requirement: 250, title: 'Speedy', description: 'Reach 250 performance points', reward: { currency: 3000, experience: 750 } },
          { tier: 3, requirement: 500, title: 'Rapid', description: 'Reach 500 performance points', reward: { currency: 7500, experience: 1500 } },
          { tier: 4, requirement: 1000, title: 'Lightning', description: 'Reach 1000 performance points', reward: { currency: 15000, experience: 3500 } },
          { tier: 5, requirement: 2000, title: 'Speed Demon', description: 'Reach 2000 performance points', reward: { currency: 35000, experience: 8000 } },
          { tier: 6, requirement: 5000, title: 'Performance King', description: 'Reach 5000 performance points', reward: { currency: 75000, experience: 20000, badge: 'performance_king' } },
        ],
        currentTier: 0,
        progress: 0,
        totalProgress: 5000,
        unlocked: false,
        rewards: [],
        hidden: false,
      },
      {
        id: 'ach-market-wizard',
        name: 'Market Wizard',
        description: 'Profit from market trading',
        icon: '📈',
        category: 'trader',
        tiers: [
          { tier: 1, requirement: 2000, title: 'Trader', description: 'Earn 2,000 in profit', reward: { currency: 500, experience: 150 } },
          { tier: 2, requirement: 10000, title: 'Dealer', description: 'Earn 10,000 in profit', reward: { currency: 2500, experience: 600 } },
          { tier: 3, requirement: 50000, title: 'Broker', description: 'Earn 50,000 in profit', reward: { currency: 10000, experience: 2000 } },
          { tier: 4, requirement: 200000, title: 'Investor', description: 'Earn 200,000 in profit', reward: { currency: 30000, experience: 6000 } },
          { tier: 5, requirement: 1000000, title: 'Market Wizard', description: 'Earn 1,000,000 in profit', reward: { currency: 100000, experience: 15000 } },
          { tier: 6, requirement: 5000000, title: 'Trading Mogul', description: 'Earn 5,000,000 in profit', reward: { currency: 300000, experience: 40000, badge: 'trading_mogul' } },
        ],
        currentTier: 0,
        progress: 0,
        totalProgress: 5000000,
        unlocked: false,
        rewards: [],
        hidden: false,
      },
    ];
  }

  static trackProgress(achievementId: string, value: number): Achievement | null {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return null;

    achievement.progress = value;

    // Check if new tier unlocked
    const currentTierData = achievement.tiers[achievement.currentTier];
    if (currentTierData && value >= currentTierData.requirement) {
      achievement.currentTier++;
      achievement.unlocked = true;
      return achievement;
    }

    return null;
  }

  static getAchievements(): Achievement[] {
    return this.achievements;
  }

  static getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  static getAchievementProgress(achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;

    const currentTierData = achievement.tiers[achievement.currentTier];
    if (!currentTierData) return 100;

    return (achievement.progress / currentTierData.requirement) * 100;
  }

  static claimReward(achievementId: string): Achievement['tiers'][0]['reward'] | null {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.currentTier === 0) return null;

    const tierData = achievement.tiers[achievement.currentTier - 1];
    return tierData.reward;
  }

  static getTotalBadges(): string[] {
    const badges: string[] = [];
    this.achievements.forEach(achievement => {
      achievement.tiers.forEach((tier, index) => {
        if (tier.reward.badge && achievement.currentTier > index) {
          badges.push(tier.reward.badge);
        }
      });
    });
    return badges;
  }
}

// Initialize on import
AchievementService.initialize();

export default AchievementService;
