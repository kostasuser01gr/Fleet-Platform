import { Mission, Objective, DailyChallenge, Campaign } from '../types/missions';

export class MissionService {
  private static missions: Mission[] = [];
  private static campaigns: Campaign[] = [];
  private static dailyChallenges: DailyChallenge[] = [];

  static generateDailyMissions(playerLevel: number): Mission[] {
    const missions: Mission[] = [];
    const count = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < count; i++) {
      const mission = this.createRandomMission(playerLevel);
      missions.push(mission);
    }
    
    this.missions = missions;
    return missions;
  }

  private static createRandomMission(playerLevel: number): Mission {
    const types: Mission['type'][] = ['delivery', 'maintenance', 'exploration', 'challenge'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const difficulty = Math.min(5, Math.max(1, Math.floor(playerLevel / 10) + 1)) as 1 | 2 | 3 | 4 | 5;
    
    return {
      id: `mission-${Date.now()}-${Math.random()}`,
      title: this.generateMissionTitle(type),
      description: this.generateMissionDescription(type),
      type,
      difficulty,
      requirements: {
        level: playerLevel,
        minPerformance: playerLevel * 10
      },
      objectives: this.generateObjectives(type, difficulty),
      rewards: this.calculateRewards(difficulty, playerLevel),
      timeLimit: 86400000,
      repeatable: false,
      status: 'available',
      progress: 0
    };
  }

  private static generateMissionTitle(type: Mission['type']): string {
    const titles: Record<Mission['type'], string[]> = {
      delivery: ['Rush Delivery', 'Express Transport', 'Special Package'],
      race: ['Street Race', 'Time Trial', 'Speed Challenge'],
      maintenance: ['Full Service', 'Emergency Repair', 'Tune-Up'],
      exploration: ['New Routes', 'Discover Locations', 'Map the City'],
      challenge: ['Performance Test', 'Endurance Run', 'Master Challenge'],
      collection: ['Part Hunter', 'Rare Finds', 'Complete the Set']
    };
    
    const options = titles[type];
    return options[Math.floor(Math.random() * options.length)];
  }

  private static generateMissionDescription(type: Mission['type']): string {
    const descriptions: Record<Mission['type'], string> = {
      delivery: 'Transport goods across the city within the time limit',
      race: 'Compete in a high-speed race and finish in top position',
      maintenance: 'Perform vehicle maintenance and upgrades',
      exploration: 'Explore new areas and discover hidden locations',
      challenge: 'Complete difficult tasks to prove your skills',
      collection: 'Collect specific items or parts'
    };
    
    return descriptions[type];
  }

  private static generateObjectives(type: Mission['type'], difficulty: number): Objective[] {
    const baseTarget = difficulty * 100;
    
    const objectives: Objective[] = [
      {
        id: `obj-1`,
        description: `Complete main task`,
        type: type === 'race' ? 'speed' : 'deliver',
        target: baseTarget,
        current: 0,
        completed: false,
        optional: false
      }
    ];
    
    // Add optional objectives for higher difficulty
    if (difficulty >= 3) {
      objectives.push({
        id: `obj-2`,
        description: 'Bonus objective',
        type: 'collect',
        target: Math.floor(baseTarget * 0.5),
        current: 0,
        completed: false,
        optional: true
      });
    }
    
    return objectives;
  }

  private static calculateRewards(difficulty: number, playerLevel: number): Mission['rewards'] {
    const baseReward = difficulty * 100 * (1 + playerLevel / 10);
    
    return {
      currency: Math.floor(baseReward),
      experience: Math.floor(baseReward * 0.5),
      reputation: difficulty * 10,
      tokens: difficulty >= 4 ? 10 : 0
    };
  }

  static trackProgress(missionId: string, action: { type: string; value: number }): Mission | null {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission) return null;
    
    let progressMade = false;
    
    mission.objectives.forEach(obj => {
      if (!obj.completed && this.isActionRelevant(obj, action)) {
        obj.current = Math.min(obj.target, obj.current + action.value);
        if (obj.current >= obj.target) {
          obj.completed = true;
          progressMade = true;
        }
      }
    });
    
    // Calculate overall progress
    const completedObjectives = mission.objectives.filter(o => o.completed && !o.optional).length;
    const requiredObjectives = mission.objectives.filter(o => !o.optional).length;
    mission.progress = requiredObjectives > 0 ? (completedObjectives / requiredObjectives) * 100 : 0;
    
    // Check if mission is complete
    if (mission.progress >= 100 && mission.status === 'active') {
      mission.status = 'completed';
      mission.completedAt = new Date();
    }
    
    return mission;
  }

  private static isActionRelevant(objective: Objective, action: { type: string; value: number }): boolean {
    return objective.type === action.type;
  }

  static startMission(missionId: string): boolean {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission || mission.status !== 'available') return false;
    
    mission.status = 'active';
    mission.startedAt = new Date();
    return true;
  }

  static completeMission(missionId: string): Mission['rewards'] | null {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission || mission.status !== 'completed') return null;
    
    return mission.rewards;
  }

  static getActiveMissions(): Mission[] {
    return this.missions.filter(m => m.status === 'active');
  }

  static getAvailableMissions(): Mission[] {
    return this.missions.filter(m => m.status === 'available');
  }

  static getCompletedMissions(): Mission[] {
    return this.missions.filter(m => m.status === 'completed');
  }

  static createCampaign(name: string, missionCount: number): Campaign {
    const missions: Mission[] = [];
    
    for (let i = 0; i < missionCount; i++) {
      const mission = this.createRandomMission(i + 1);
      mission.chain = name;
      missions.push(mission);
    }
    
    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name,
      description: `Complete ${missionCount} missions to unlock exclusive rewards`,
      missions,
      currentMission: 0,
      unlockLevel: 1,
      rewards: {
        currency: missionCount * 1000,
        experience: missionCount * 500,
        badge: `${name}_champion`
      },
      completed: false
    };
    
    this.campaigns.push(campaign);
    return campaign;
  }

  static generateDailyChallenges(count: number = 3): DailyChallenge[] {
    const challenges: DailyChallenge[] = [];
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < count; i++) {
      const mission = this.createRandomMission(10);
      const challenge: DailyChallenge = {
        ...mission,
        expiresAt: tomorrow,
        bonusMultiplier: 1.5 + (Math.random() * 0.5)
      };
      challenges.push(challenge);
    }
    
    this.dailyChallenges = challenges;
    return challenges;
  }

  static getDailyChallenges(): DailyChallenge[] {
    // Remove expired challenges
    const now = new Date();
    this.dailyChallenges = this.dailyChallenges.filter(c => c.expiresAt > now);
    
    // Generate new ones if empty
    if (this.dailyChallenges.length === 0) {
      return this.generateDailyChallenges();
    }
    
    return this.dailyChallenges;
  }
}

export default MissionService;
