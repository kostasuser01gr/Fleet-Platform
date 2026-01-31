export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'fleet' | 'assembly' | 'rental' | 'maintenance' | 'social' | 'special';
  icon: string;
  reward: {
    xp: number;
    coins: number;
    items?: string[];
    unlocks?: string[];
  };
  requirements: AchievementRequirement[];
  achieved: boolean;
  achievedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementRequirement {
  type: 'vehicle_count' | 'rental_count' | 'assembly_count' | 'xp_threshold' | 'revenue_threshold' | 'custom';
  value: number;
  current: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'story' | 'challenge' | 'team';
  objectives: QuestObjective[];
  rewards: QuestReward;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  progress: number;
}

export interface QuestObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  xp: number;
  coins: number;
  items?: string[];
  unlocks?: string[];
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'friends' | 'team' | 'category';
  category?: string;
  entries: LeaderboardEntry[];
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  updatedAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  rank: number;
  score: number;
  metric: string;
  change?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'assembly' | 'management' | 'optimization' | 'social';
  level: number;
  maxLevel: number;
  effects: SkillEffect[];
  requirements: {
    level?: number;
    skills?: string[];
    achievements?: string[];
  };
  unlocked: boolean;
}

export interface SkillEffect {
  type: 'xp_bonus' | 'cost_reduction' | 'speed_bonus' | 'quality_bonus' | 'unlock';
  value: number;
  target?: string;
}
