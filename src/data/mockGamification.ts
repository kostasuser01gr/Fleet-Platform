import { Achievement, Quest, Leaderboard, Skill } from '../types/gamification';

export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Complete your first vehicle assembly',
    category: 'assembly',
    icon: 'star',
    reward: { xp: 100, coins: 50 },
    requirements: [{ type: 'assembly_count', value: 1, current: 0 }],
    achieved: false,
    rarity: 'common',
  },
  {
    id: 'ach2',
    title: 'Fleet Builder',
    description: 'Own 10 vehicles in your fleet',
    category: 'fleet',
    icon: 'trophy',
    reward: { xp: 500, coins: 250 },
    requirements: [{ type: 'vehicle_count', value: 10, current: 5 }],
    achieved: false,
    rarity: 'rare',
  },
  {
    id: 'ach3',
    title: 'Rental Master',
    description: 'Complete 50 rentals',
    category: 'rental',
    icon: 'award',
    reward: { xp: 1000, coins: 500 },
    requirements: [{ type: 'rental_count', value: 50, current: 23 }],
    achieved: false,
    rarity: 'epic',
  },
  {
    id: 'ach4',
    title: 'Legendary Mechanic',
    description: 'Assemble 100 vehicles with legendary quality',
    category: 'assembly',
    icon: 'crown',
    reward: { xp: 5000, coins: 2500, unlocks: ['legendary_parts'] },
    requirements: [{ type: 'assembly_count', value: 100, current: 12 }],
    achieved: false,
    rarity: 'legendary',
  },
];

export const mockQuests: Quest[] = [
  {
    id: 'q1',
    title: 'Daily Assembly Challenge',
    description: 'Complete 3 vehicle assemblies today',
    type: 'daily',
    objectives: [
      { id: 'o1', description: 'Complete assemblies', target: 3, current: 1, completed: false },
    ],
    rewards: { xp: 200, coins: 100 },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    completed: false,
    progress: 33,
  },
  {
    id: 'q2',
    title: 'Weekly Revenue Goal',
    description: 'Earn $10,000 in revenue this week',
    type: 'weekly',
    objectives: [
      { id: 'o2', description: 'Earn revenue', target: 10000, current: 6500, completed: false },
    ],
    rewards: { xp: 500, coins: 250 },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
    progress: 65,
  },
];

export const mockLeaderboard: Leaderboard = {
  id: 'lb1',
  type: 'global',
  period: 'weekly',
  updatedAt: new Date(),
  entries: [
    { userId: 'u1', userName: 'John Doe', rank: 1, score: 12500, metric: 'Total XP', change: 0 },
    { userId: 'u2', userName: 'Jane Smith', rank: 2, score: 11200, metric: 'Total XP', change: 1 },
    { userId: 'u3', userName: 'Mike Johnson', rank: 3, score: 9800, metric: 'Total XP', change: -1 },
    { userId: 'u4', userName: 'Sarah Williams', rank: 4, score: 8700, metric: 'Total XP', change: 0 },
  ],
};

export const mockSkills: Skill[] = [
  {
    id: 'sk1',
    name: 'Assembly Speed',
    description: 'Increase assembly speed by 10% per level',
    category: 'assembly',
    level: 2,
    maxLevel: 5,
    effects: [{ type: 'speed_bonus', value: 20 }],
    requirements: {},
    unlocked: true,
  },
  {
    id: 'sk2',
    name: 'XP Boost',
    description: 'Gain 5% more XP from all activities',
    category: 'optimization',
    level: 1,
    maxLevel: 3,
    effects: [{ type: 'xp_bonus', value: 5 }],
    requirements: { level: 5 },
    unlocked: true,
  },
  {
    id: 'sk3',
    name: 'Cost Reduction',
    description: 'Reduce part costs by 10%',
    category: 'optimization',
    level: 0,
    maxLevel: 3,
    effects: [{ type: 'cost_reduction', value: 10 }],
    requirements: { skills: ['sk2'] },
    unlocked: false,
  },
];
