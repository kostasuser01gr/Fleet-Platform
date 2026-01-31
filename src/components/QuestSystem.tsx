import { useState } from 'react';
import { Quest } from '../types/gamification';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Calendar,
  Trophy,
  Zap,
  Gift,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface QuestSystemProps {
  quests: Quest[];
  onQuestComplete?: (quest: Quest) => void;
}

export function QuestSystem({ quests, onQuestComplete }: QuestSystemProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleClaimReward = (quest: Quest) => {
    if (quest.completed) {
      onQuestComplete?.(quest);
      toast.success('Quest Completed!', {
        description: `Earned ${quest.rewards.xp} XP and ${quest.rewards.coins} coins!`,
      });
    }
  };

  const getQuestTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'daily': return Calendar;
      case 'weekly': return Clock;
      case 'story': return Star;
      case 'challenge': return Zap;
      case 'team': return Trophy;
      default: return Target;
    }
  };

  const getQuestTypeColor = (type: Quest['type']) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/20 text-blue-400';
      case 'weekly': return 'bg-purple-500/20 text-purple-400';
      case 'story': return 'bg-yellow-500/20 text-yellow-400';
      case 'challenge': return 'bg-red-500/20 text-red-400';
      case 'team': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl">Active Quests</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {activeQuests.length} Active
            </Badge>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {activeQuests.map((quest) => {
                const Icon = getQuestTypeIcon(quest.type);
                return (
                  <Card
                    key={quest.id}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 cursor-pointer hover:border-blue-500 transition-all"
                    onClick={() => setSelectedQuest(quest)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getQuestTypeColor(quest.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{quest.title}</h3>
                            <p className="text-gray-400 text-sm">{quest.description}</p>
                          </div>
                        </div>
                        <Badge className={getQuestTypeColor(quest.type)}>
                          {quest.type}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {quest.objectives.map((objective) => (
                          <div key={objective.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-300 text-sm">{objective.description}</span>
                              <span className="text-gray-400 text-xs">
                                {objective.current} / {objective.target}
                              </span>
                            </div>
                            <Progress 
                              value={(objective.current / objective.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-4 h-4" />
                              <span>{quest.rewards.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-400">
                              <Gift className="w-4 h-4" />
                              <span>{quest.rewards.coins} Coins</span>
                            </div>
                          </div>
                          <div className="text-gray-400 text-xs">
                            {Math.round(quest.progress)}% Complete
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <h2 className="text-white text-xl">Completed Quests</h2>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {completedQuests.map((quest) => (
                <Card
                  key={quest.id}
                  className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm">{quest.title}</h4>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-yellow-400">+{quest.rewards.xp} XP</span>
                      <span className="text-green-400">+{quest.rewards.coins} Coins</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
