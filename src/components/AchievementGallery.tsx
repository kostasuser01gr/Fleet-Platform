import { Achievement } from '../types/gamification';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Trophy, 
  Star, 
  Award, 
  Crown,
  Sparkles,
  Lock
} from 'lucide-react';

interface AchievementGalleryProps {
  achievements: Achievement[];
}

export function AchievementGallery({ achievements }: AchievementGalleryProps) {
  const rarityColors = {
    common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const rarityIcons = {
    common: Star,
    rare: Award,
    epic: Trophy,
    legendary: Crown,
  };

  const achieved = achievements.filter(a => a.achieved);
  const locked = achievements.filter(a => !a.achieved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl mb-1">Achievements</h2>
          <p className="text-gray-400 text-sm">
            {achieved.length} of {achievements.length} unlocked
          </p>
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Trophy className="w-4 h-4 mr-1" />
          {achieved.length} Achieved
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = rarityIcons[achievement.rarity];
          return (
            <Card
              key={achievement.id}
              className={`${
                achievement.achieved
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
                  : 'bg-gray-900/50 border-gray-800 opacity-60'
              } transition-all hover:scale-105`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${rarityColors[achievement.rarity]}`}>
                    {achievement.achieved ? (
                      <Icon className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>
                  <Badge className={rarityColors[achievement.rarity]}>
                    {achievement.rarity}
                  </Badge>
                </div>

                <h3 className={`font-semibold mb-1 ${achievement.achieved ? 'text-white' : 'text-gray-500'}`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm mb-3 ${achievement.achieved ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>

                {achievement.achieved && achievement.achievedDate && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                      Unlocked: {new Date(achievement.achievedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {!achievement.achieved && (
                  <div className="pt-3 border-t border-gray-700">
                    <div className="space-y-1">
                      {achievement.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{req.type.replace('_', ' ')}</span>
                          <span className="text-gray-400">
                            {req.current} / {req.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
