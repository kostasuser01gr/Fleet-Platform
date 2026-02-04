import React from 'react';
import { List } from 'react-window';
import { VehiclePart } from '../types/inventory';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface VirtualizedPartListProps {
  parts: VehiclePart[];
  onInstall: (part: VehiclePart) => void;
  height?: number;
}

interface PartRowProps {
  parts: VehiclePart[];
  onInstall: (part: VehiclePart) => void;
}

const PartRow = ({ index, style, parts, onInstall }: {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: { "aria-posinset": number; "aria-setsize": number; role: "listitem" };
} & PartRowProps) => {
  const part = parts[index];
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic':
        return 'bg-purple-500';
      case 'rare':
        return 'bg-blue-500';
      case 'uncommon':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div style={style} className="px-2">
      <Card className="p-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{part.name}</h4>
              <Badge className={getRarityColor(part.rarity)}>
                {part.rarity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {part.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span>⚡ +{part.performance}%</span>
              <span>💪 {part.durability}%</span>
              <span>🔧 {part.condition}%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold mb-2">
              ${part.price.toLocaleString()}
            </div>
            <Button
              onClick={() => onInstall(part)}
              disabled={part.installed}
              size="sm"
            >
              {part.installed ? 'Installed' : 'Install'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const VirtualizedPartList: React.FC<VirtualizedPartListProps> = ({
  parts,
  onInstall,
  height = 600,
}) => {
  return (
    <List
      defaultHeight={height}
      rowComponent={PartRow}
      rowCount={parts.length}
      rowHeight={120}
      rowProps={{ parts, onInstall }}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    />
  );
};

export default VirtualizedPartList;
