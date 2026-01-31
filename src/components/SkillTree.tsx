import { useState } from 'react';
import { Skill } from '../types/gamification';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Zap, 
  Lock, 
  CheckCircle,
  TrendingUp,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface SkillTreeProps {
  skills: Skill[];
  availablePoints: number;
  onSkillUnlock?: (skillId: string) => void;
  onSkillUpgrade?: (skillId: string) => void;
}

export function SkillTree({ skills, availablePoints, onSkillUnlock, onSkillUpgrade }: SkillTreeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(skills.map(s => s.category)))];

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const canUnlock = (skill: Skill): boolean => {
    if (skill.unlocked) return false;
    if (availablePoints < 1) return false;
    
    if (skill.requirements.level && skill.requirements.level > 0) {
      // Check level requirement (would need level from context)
      // For now, assume level is met
    }
    
    if (skill.requirements.skills) {
      const requiredSkills = skills.filter(s => skill.requirements.skills?.includes(s.id));
      return requiredSkills.every(s => s.unlocked);
    }
    
    return true;
  };

  const handleUnlock = (skill: Skill) => {
    if (canUnlock(skill)) {
      onSkillUnlock?.(skill.id);
      toast.success('Skill Unlocked!', {
        description: `Unlocked ${skill.name}`,
      });
    } else {
      toast.error('Cannot unlock skill', {
        description: 'Requirements not met or insufficient points',
      });
    }
  };

  const handleUpgrade = (skill: Skill) => {
    if (skill.level < skill.maxLevel && availablePoints > 0) {
      onSkillUpgrade?.(skill.id);
      toast.success('Skill Upgraded!', {
        description: `${skill.name} upgraded to level ${skill.level + 1}`,
      });
    }
  };

  const categoryColors = {
    assembly: 'bg-blue-500/20 text-blue-400',
    management: 'bg-green-500/20 text-green-400',
    optimization: 'bg-purple-500/20 text-purple-400',
    social: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl mb-1">Skill Tree</h2>
          <p className="text-gray-400 text-sm">Unlock and upgrade skills to boost your performance</p>
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Star className="w-4 h-4 mr-1" />
          {availablePoints} Points Available
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-blue-600' : ''}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const canUnlockSkill = canUnlock(skill);
          const canUpgrade = skill.unlocked && skill.level < skill.maxLevel;
          
          return (
            <Card
              key={skill.id}
              className={`${
                skill.unlocked
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
                  : canUnlockSkill
                  ? 'bg-gray-800/50 border-blue-500/30'
                  : 'bg-gray-900/50 border-gray-800 opacity-60'
              } transition-all hover:scale-105`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[skill.category] || 'bg-gray-500/20'}`}>
                      {skill.unlocked ? (
                        <Zap className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${skill.unlocked ? 'text-white' : 'text-gray-500'}`}>
                        {skill.name}
                      </h3>
                      <p className={`text-xs ${skill.unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                        Level {skill.level} / {skill.maxLevel}
                      </p>
                    </div>
                  </div>
                  {skill.unlocked && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>

                <p className={`text-sm mb-3 ${skill.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                  {skill.description}
                </p>

                {skill.unlocked && (
                  <div className="mb-3">
                    <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2" />
                  </div>
                )}

                <div className="space-y-2 mb-3">
                  {skill.effects.map((effect, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span className={skill.unlocked ? 'text-gray-300' : 'text-gray-600'}>
                        {effect.type.replace('_', ' ')}: +{effect.value}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {!skill.unlocked && canUnlockSkill && (
                    <Button
                      onClick={() => handleUnlock(skill)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      Unlock
                    </Button>
                  )}
                  {canUpgrade && (
                    <Button
                      onClick={() => handleUpgrade(skill)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
