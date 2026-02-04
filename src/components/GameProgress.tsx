import React from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Trophy, 
  Star, 
  Zap, 
  Award, 
  Crown,
  Sparkles,
  Gift
} from 'lucide-react';
import { toast } from 'sonner';

interface GameProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalEarnings: number;
}

export const GameProgress = React.memo(function GameProgress({ level, xp, xpToNextLevel, totalEarnings }: GameProgressProps) {
  const xpPercentage = (xp / xpToNextLevel) * 100;

  const achievements = [
    { 
      id: 1, 
      title: 'First Rental', 
      description: 'Complete your first rental', 
      achieved: true,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      id: 2, 
      title: '10 Vehicles', 
      description: 'Manage 10 vehicles in your fleet', 
      achieved: true,
      icon: Trophy,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      id: 3, 
      title: 'Profit Master', 
      description: 'Earn $50,000 in total profit', 
      achieved: true,
      icon: Award,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      id: 4, 
      title: 'Speed Demon', 
      description: 'Rent out 5 sports cars', 
      achieved: false,
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    { 
      id: 5, 
      title: 'Fleet Commander', 
      description: 'Own 25 vehicles', 
      achieved: false,
      icon: Crown,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
  ];

  const dailyRewards = [
    { day: 1, reward: 100, claimed: true },
    { day: 2, reward: 150, claimed: true },
    { day: 3, reward: 200, claimed: true },
    { day: 4, reward: 250, claimed: false },
    { day: 5, reward: 300, claimed: false },
    { day: 6, reward: 400, claimed: false },
    { day: 7, reward: 500, claimed: false },
  ];

  const claimDailyReward = (day: number, reward: number) => {
    toast.success('Daily Reward Claimed!', {
      description: `You earned $${reward} and +50 XP!`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-purple-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white">Level {level} - Fleet Manager</h3>
              <p className="text-purple-100 text-sm">{xp} / {xpToNextLevel} XP</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            ${totalEarnings.toLocaleString()} Earned
          </Badge>
        </div>
        <Progress value={xpPercentage} className="h-3 bg-purple-900/50" />
        <p className="text-purple-100 text-sm mt-2">
          {xpToNextLevel - xp} XP until Level {level + 1}
        </p>
      </Card>

      {/* Daily Rewards */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white">Daily Rewards</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {dailyRewards.map((reward) => (
            <button
              key={reward.day}
              onClick={() => !reward.claimed && reward.day === 4 && claimDailyReward(reward.day, reward.reward)}
              disabled={reward.claimed || reward.day !== 4}
              className={`
                relative p-3 rounded-lg border-2 transition-all
                ${reward.claimed 
                  ? 'bg-green-500/20 border-green-500/30 opacity-50' 
                  : reward.day === 4
                  ? 'bg-yellow-500/20 border-yellow-500 hover:scale-105 cursor-pointer'
                  : 'bg-gray-800 border-gray-700 opacity-50'}
              `}
            >
              <p className="text-white text-xs mb-1">Day {reward.day}</p>
              <p className={`${reward.day === 4 ? 'text-yellow-400' : 'text-gray-400'} text-sm`}>
                ${reward.reward}
              </p>
              {reward.claimed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-400" />
                </div>
              )}
              {reward.day === 4 && !reward.claimed && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Claim your daily rewards to earn bonus cash and XP!
        </p>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white">Achievements</h3>
          <Badge className="bg-gray-800 border-gray-700 ml-auto">
            {achievements.filter(a => a.achieved).length} / {achievements.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all
                  ${achievement.achieved 
                    ? `${achievement.bgColor} border-gray-700` 
                    : 'bg-gray-800/30 border-gray-800 opacity-60'}
                `}
              >
                <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                  <Icon className={`w-5 h-5 ${achievement.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{achievement.title}</p>
                  <p className="text-gray-400 text-xs">{achievement.description}</p>
                </div>
                {achievement.achieved && (
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Level Rewards Preview */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <h3 className="text-white mb-4">Next Level Rewards</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30">
            <Award className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <p className="text-white text-sm">Unlock Premium Features</p>
              <p className="text-gray-400 text-xs">Advanced analytics & reports</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
            <Gift className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-white text-sm">$1,000 Bonus Cash</p>
              <p className="text-gray-400 text-xs">Use for vehicle upgrades</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
            <Zap className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <p className="text-white text-sm">2x XP Multiplier</p>
              <p className="text-gray-400 text-xs">For the next 24 hours</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});
