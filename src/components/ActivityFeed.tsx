import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Activity } from '../types/rental';
import { 
  Car, 
  Wrench, 
  Trophy, 
  CheckCircle,
  DollarSign,
  Star
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const iconMap = {
    car: Car,
    wrench: Wrench,
    trophy: Trophy,
    check: CheckCircle,
    dollar: DollarSign,
    star: Star,
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Car;
  };

  const typeColors = {
    rental: 'bg-blue-500/20 text-blue-400',
    maintenance: 'bg-orange-500/20 text-orange-400',
    achievement: 'bg-yellow-500/20 text-yellow-400',
    'vehicle-added': 'bg-green-500/20 text-green-400',
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-purple-400" />
        <h3 className="text-white">Activity Feed</h3>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.icon);
            return (
              <div 
                key={activity.id}
                className="relative flex gap-3 pb-3"
              >
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-700" />
                )}
                
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${typeColors[activity.type]} flex items-center justify-center relative z-10`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-white text-sm">{activity.title}</h4>
                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{activity.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
