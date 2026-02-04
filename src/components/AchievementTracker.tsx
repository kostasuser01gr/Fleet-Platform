import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Lock, Star } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import AchievementService from '../services/achievementService';
import { Achievement } from '../types/missions';

export const AchievementTracker: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const playerStats = useAppSelector((state) => state.player.stats);

  useEffect(() => {
    // Track achievements based on player stats
    AchievementService.trackProgress('ach-first-vehicle', playerStats.partsInstalled || 0);
    AchievementService.trackProgress('ach-part-collector', playerStats.partsInstalled || 0);
    AchievementService.trackProgress('ach-mission-master', playerStats.missionsCompleted || 0);
    AchievementService.trackProgress('ach-big-spender', playerStats.totalEarnings || 0);

    setAchievements(AchievementService.getAchievements());
  }, [playerStats]);

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  const getTierColor = (tier: number): string => {
    if (tier >= 6) return 'text-purple-500';
    if (tier >= 5) return 'text-yellow-500';
    if (tier >= 4) return 'text-blue-500';
    if (tier >= 3) return 'text-green-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievement Tracker</h2>
          <p className="text-muted-foreground">Track your progress and unlock rewards</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Unlocked</div>
            <div className="text-2xl font-bold">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Badges</div>
            <div className="text-2xl font-bold">
              {AchievementService.getTotalBadges().length}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement) => {
          const progress = AchievementService.getAchievementProgress(achievement.id);
          const currentTierData = achievement.tiers[achievement.currentTier];
          const nextTierData = achievement.tiers[achievement.currentTier];

          return (
            <Card key={achievement.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{achievement.name}</h3>
                    {achievement.unlocked ? (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>

                  {/* Tier Progress */}
                  <div className="flex items-center gap-2 mb-3">
                    {achievement.tiers.map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < achievement.currentTier
                            ? getTierColor(index + 1) + ' fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">
                      Tier {achievement.currentTier}/{achievement.tiers.length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {nextTierData && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {achievement.progress} / {nextTierData.requirement}
                        </span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${getProgressColor(progress)} h-2 rounded-full transition-all`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Next Reward */}
                  {nextTierData && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Next Reward:</div>
                      <div className="flex flex-wrap gap-2">
                        {nextTierData.reward.currency && (
                          <Badge variant="outline">
                            💰 ${nextTierData.reward.currency.toLocaleString()}
                          </Badge>
                        )}
                        {nextTierData.reward.experience && (
                          <Badge variant="outline">
                            ⭐ {nextTierData.reward.experience} XP
                          </Badge>
                        )}
                        {nextTierData.reward.badge && (
                          <Badge className="bg-purple-500">
                            🎖️ {nextTierData.reward.badge}
                          </Badge>
                        )}
                        {nextTierData.reward.tokens && (
                          <Badge variant="outline">
                            🪙 {nextTierData.reward.tokens} Tokens
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {achievement.currentTier >= achievement.tiers.length && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-green-600 font-semibold">
                        🎉 Achievement Mastered!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementTracker;
