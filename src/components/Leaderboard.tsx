import { Leaderboard as LeaderboardType } from '../types/gamification';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface LeaderboardProps {
  leaderboard: LeaderboardType;
  currentUserId?: string;
}

export function Leaderboard({ leaderboard, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold">{rank}</span>;
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return <Minus className="w-4 h-4 text-gray-500" />;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl mb-1">Leaderboard</h2>
          <p className="text-gray-400 text-sm capitalize">
            {leaderboard.type} • {leaderboard.period}
          </p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          {leaderboard.entries.length} Players
        </Badge>
      </div>

      <div className="space-y-3">
        {leaderboard.entries.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          return (
            <Card
              key={entry.userId}
              className={`${
                isCurrentUser
                  ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-500/50'
                  : 'bg-gray-800/50 border-gray-700'
              } transition-all hover:scale-105`}
            >
              <div className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {entry.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${isCurrentUser ? 'text-white' : 'text-white'}`}>
                      {entry.userName}
                    </h3>
                    {isCurrentUser && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{entry.metric}</p>
                </div>

                <div className="text-right">
                  <div className="text-white font-bold text-lg">{entry.score.toLocaleString()}</div>
                  {entry.change !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {getChangeIcon(entry.change)}
                      <span>{Math.abs(entry.change)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
