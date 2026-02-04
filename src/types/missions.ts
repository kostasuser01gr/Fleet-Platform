export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'delivery' | 'race' | 'maintenance' | 'exploration' | 'challenge' | 'collection';
  difficulty: 1 | 2 | 3 | 4 | 5;
  requirements: MissionRequirements;
  objectives: Objective[];
  rewards: MissionRewards;
  timeLimit?: number;
  repeatable: boolean;
  chain?: string;
  status: 'available' | 'active' | 'completed' | 'failed' | 'locked';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface MissionRequirements {
  vehicleType?: string[];
  minPerformance?: number;
  specificParts?: string[];
  completedMissions?: string[];
  level?: number;
  reputation?: number;
}

export interface Objective {
  id: string;
  description: string;
  type: 'deliver' | 'distance' | 'speed' | 'repair' | 'upgrade' | 'earn' | 'collect';
  target: number;
  current: number;
  completed: boolean;
  optional: boolean;
}

export interface MissionRewards {
  currency: number;
  experience: number;
  parts?: string[];
  unlocks?: string[];
  reputation?: number;
  tokens?: number;
  exclusiveItems?: string[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  missions: Mission[];
  currentMission: number;
  unlockLevel: number;
  rewards: CampaignRewards;
  completed: boolean;
}

export interface CampaignRewards {
  currency: number;
  experience: number;
  exclusivePart?: string;
  badge?: string;
  title?: string;
}

export interface DailyChallenge extends Mission {
  expiresAt: Date;
  bonusMultiplier: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'collector' | 'racer' | 'mechanic' | 'trader' | 'explorer' | 'social';
  tiers: AchievementTier[];
  currentTier: number;
  progress: number;
  totalProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rewards: AchievementReward[];
  hidden: boolean;
}

export interface AchievementTier {
  tier: number;
  requirement: number;
  title: string;
  reward: AchievementReward;
  description: string;
}

export interface AchievementReward {
  currency?: number;
  experience?: number;
  exclusivePart?: string;
  title?: string;
  badge?: string;
  unlockFeature?: string;
  tokens?: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'regional' | 'friends';
  category: 'speed' | 'earnings' | 'collection' | 'reputation';
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: LeaderboardEntry[];
  playerRank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  avatar?: string;
  badge?: string;
  change: number;
}
