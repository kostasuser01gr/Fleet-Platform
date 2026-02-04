import React, { useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Clock, Target, Gift, ChevronRight } from 'lucide-react';
import { useMissions, useStartMission, useCompleteMission } from '../hooks/useMissionQueries';
import { useAppSelector } from '../store/hooks';
import { Mission } from '../types/missions';

export const MissionDashboard: React.FC = () => {
  const playerLevel = useAppSelector((state) => state.player.level);
  const { data: missions, isLoading } = useMissions(playerLevel);
  const startMission = useStartMission();
  const completeMission = useCompleteMission();

  const activeMissions = missions?.filter((m) => m.status === 'active') || [];
  const availableMissions = missions?.filter((m) => m.status === 'available') || [];
  const completedMissions = missions?.filter((m) => m.status === 'completed') || [];

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty === 1) return 'bg-green-500';
    if (difficulty === 2) return 'bg-blue-500';
    if (difficulty === 3) return 'bg-purple-500';
    if (difficulty === 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTypeIcon = (type: Mission['type']) => {
    switch (type) {
      case 'race':
        return '🏁';
      case 'delivery':
        return '📦';
      case 'maintenance':
        return '🔧';
      case 'exploration':
        return '🗺️';
      case 'challenge':
        return '⚔️';
      case 'collection':
        return '💎';
      default:
        return '📋';
    }
  };

  const formatTimeRemaining = (timeLimit?: number): string => {
    if (!timeLimit) return 'No limit';
    const hours = Math.floor(timeLimit / 3600000);
    return `${hours}h remaining`;
  };

  const handleStartMission = (missionId: string) => {
    startMission.mutate(missionId);
  };

  const handleCompleteMission = (missionId: string) => {
    completeMission.mutate(missionId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mission Control</h2>
          <p className="text-muted-foreground">Complete missions to earn rewards</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold">{activeMissions.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold">{completedMissions.length}</div>
          </Card>
        </div>
      </div>

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Missions
          </h3>
          <div className="grid gap-4">
            {activeMissions.map((mission) => (
              <Card key={mission.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(mission.type)}</span>
                      <div>
                        <h4 className="text-lg font-semibold">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{mission.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="mt-4 space-y-2">
                      {mission.objectives.map((obj) => (
                        <div key={obj.id} className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              obj.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}
                          >
                            {obj.completed && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className={obj.completed ? 'line-through text-muted-foreground' : ''}>
                            {obj.description} ({obj.current}/{obj.target})
                          </span>
                          {obj.optional && (
                            <Badge variant="outline" className="text-xs">
                              Optional
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(mission.difficulty)}>
                      Level {mission.difficulty}
                    </Badge>
                    {mission.timeLimit && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatTimeRemaining(mission.timeLimit)}
                      </div>
                    )}
                    {mission.progress >= 100 && (
                      <Button
                        onClick={() => handleCompleteMission(mission.id)}
                        className="mt-4"
                      >
                        Claim Rewards
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Missions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Missions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {availableMissions.map((mission) => (
            <Card key={mission.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(mission.type)}</span>
                  <div>
                    <h4 className="font-semibold">{mission.title}</h4>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(mission.difficulty)}>
                  Lv {mission.difficulty}
                </Badge>
              </div>

              {/* Rewards */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-sm">Rewards</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {mission.rewards.currency > 0 && (
                    <div>💰 ${mission.rewards.currency.toLocaleString()}</div>
                  )}
                  {mission.rewards.experience > 0 && (
                    <div>⭐ {mission.rewards.experience} XP</div>
                  )}
                  {mission.rewards.reputation && mission.rewards.reputation > 0 && (
                    <div>🏆 {mission.rewards.reputation} Rep</div>
                  )}
                  {mission.rewards.tokens && mission.rewards.tokens > 0 && (
                    <div>🎫 {mission.rewards.tokens} Tokens</div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => handleStartMission(mission.id)}
                className="w-full"
                disabled={startMission.isPending}
              >
                Start Mission
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionDashboard;
