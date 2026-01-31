import { Achievement, Quest, Skill } from '../types/gamification';

export class GamificationService {
  private static xp = 0;
  private static coins = 0;
  private static level = 1;
  private static achievements: Achievement[] = [];
  private static quests: Quest[] = [];
  private static skills: Skill[] = [];

  static initialize(userData: {
    xp?: number;
    coins?: number;
    level?: number;
    achievements?: Achievement[];
    quests?: Quest[];
    skills?: Skill[];
  }) {
    this.xp = userData.xp || 0;
    this.coins = userData.coins || 0;
    this.level = userData.level || 1;
    this.achievements = userData.achievements || [];
    this.quests = userData.quests || [];
    this.skills = userData.skills || [];
  }

  static addXP(amount: number, source?: string) {
    const bonus = this.calculateXPBonus();
    const totalXP = Math.floor(amount * bonus);
    this.xp += totalXP;
    
    const oldLevel = this.level;
    this.checkLevelUp();
    
    return {
      gained: totalXP,
      bonus: bonus > 1 ? (bonus - 1) * 100 : 0,
      levelUp: this.level > oldLevel,
      newLevel: this.level,
      source,
    };
  }

  static addCoins(amount: number, source?: string) {
    const bonus = this.calculateCoinBonus();
    const totalCoins = Math.floor(amount * bonus);
    this.coins += totalCoins;
    
    return {
      gained: totalCoins,
      bonus: bonus > 1 ? (bonus - 1) * 100 : 0,
      source,
    };
  }

  static checkLevelUp() {
    const xpNeeded = this.getXPForLevel(this.level + 1);
    if (this.xp >= xpNeeded) {
      this.level++;
      return true;
    }
    return false;
  }

  static getXPForLevel(level: number): number {
    return Math.floor(1000 * Math.pow(1.5, level - 1));
  }

  static getXPToNextLevel(): number {
    const nextLevelXP = this.getXPForLevel(this.level + 1);
    return nextLevelXP - this.xp;
  }

  static calculateXPBonus(): number {
    let bonus = 1.0;
    this.skills.forEach(skill => {
      if (skill.unlocked) {
        skill.effects.forEach(effect => {
          if (effect.type === 'xp_bonus') {
            bonus += effect.value / 100;
          }
        });
      }
    });
    return Math.min(bonus, 3.0);
  }

  static calculateCoinBonus(): number {
    let bonus = 1.0;
    this.skills.forEach(skill => {
      if (skill.unlocked) {
        skill.effects.forEach(effect => {
          if (effect.type === 'cost_reduction') {
            bonus += effect.value / 100;
          }
        });
      }
    });
    return Math.min(bonus, 2.0);
  }

  static checkAchievements(type: string, value: number) {
    const newAchievements: Achievement[] = [];
    this.achievements.forEach(achievement => {
      if (!achievement.achieved) {
        const requirement = achievement.requirements.find(r => r.type === type);
        if (requirement) {
          requirement.current = Math.max(requirement.current, value);
          if (requirement.current >= requirement.value) {
            achievement.achieved = true;
            achievement.achievedDate = new Date();
            newAchievements.push(achievement);
          }
        }
      }
    });
    return newAchievements;
  }

  static updateQuestProgress(questId: string, objectiveId: string, progress: number) {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest) return false;
    
    const objective = quest.objectives.find(o => o.id === objectiveId);
    if (!objective) return false;
    
    objective.current = Math.min(objective.current + progress, objective.target);
    objective.completed = objective.current >= objective.target;
    
    const allCompleted = quest.objectives.every(o => o.completed);
    if (allCompleted && !quest.completed) {
      quest.completed = true;
      quest.progress = 100;
      return true;
    }
    
    quest.progress = (quest.objectives.filter(o => o.completed).length / quest.objectives.length) * 100;
    return false;
  }

  static getStats() {
    return {
      xp: this.xp,
      coins: this.coins,
      level: this.level,
      xpToNextLevel: this.getXPToNextLevel(),
      achievements: {
        total: this.achievements.length,
        completed: this.achievements.filter(a => a.achieved).length,
      },
      quests: {
        total: this.quests.length,
        active: this.quests.filter(q => !q.completed).length,
        completed: this.quests.filter(q => q.completed).length,
      },
      skills: {
        total: this.skills.length,
        unlocked: this.skills.filter(s => s.unlocked).length,
      },
    };
  }
}
