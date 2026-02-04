import React from 'react';
import { VehiclePart } from '../../types/inventory';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Wrench,
  AlertCircle
} from 'lucide-react';

interface PartCardProps {
  part: VehiclePart;
  onClick?: () => void;
  onInstall?: () => void;
  compact?: boolean;
}

export const PartCard: React.FC<PartCardProps> = ({
  part,
  onClick,
  onInstall,
  compact = false
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 80) return 'text-green-500';
    if (condition >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (compact) {
    return (
      <div
        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <Badge className={getRarityColor(part.rarity)} variant="secondary">
            {part.rarity}
          </Badge>
          <div>
            <div className="font-medium">{part.name}</div>
            <div className="text-xs text-muted-foreground">
              {part.manufacturer} • {part.condition}%
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">
            ${part.price.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {part.type.replace('_', ' ')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{part.name}</h3>
            <p className="text-sm text-muted-foreground">{part.manufacturer}</p>
          </div>
          <Badge className={getRarityColor(part.rarity)}>
            {part.rarity}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {part.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Condition</div>
            <div className="flex items-center gap-2">
              <Progress value={part.condition} className="flex-1" />
              <span className={`font-medium ${getConditionColor(part.condition)}`}>
                {part.condition}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Performance</div>
            <div className="font-medium">+{part.performance}%</div>
          </div>
        </div>

        {/* Stat Bonuses */}
        {Object.keys(part.stats).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(part.stats).map(([stat, value]) => (
              value !== undefined && value !== 0 && (
                <Badge key={stat} variant="outline" className="text-xs">
                  {stat}: {value > 0 ? '+' : ''}{value}
                </Badge>
              )
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xl font-bold text-primary">
            ${part.price.toLocaleString()}
          </div>
          {onInstall && !part.installed && (
            <Button size="sm" onClick={(e) => {
              e.stopPropagation();
              onInstall();
            }}>
              <Wrench className="h-4 w-4 mr-1" />
              Install
            </Button>
          )}
          {part.installed && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
              Installed
            </Badge>
          )}
        </div>

        {/* Requirements Warning */}
        {part.requirements && (
          <div className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded text-xs">
            <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-700 dark:text-yellow-300">Requirements:</div>
              {part.requirements.level && <div>Level {part.requirements.level}</div>}
              {part.requirements.reputation && <div>Reputation {part.requirements.reputation}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
