import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
}

export function NotificationCenter({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead,
  onDelete 
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'achievement': return Zap;
      default: return Info;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'achievement': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-400" />
          <h2 className="text-white text-xl">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-blue-600 text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="text-gray-400 hover:text-white"
          >
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`${
                    notification.read
                      ? 'bg-gray-800/30 border-gray-700'
                      : 'bg-blue-600/10 border-blue-500/30'
                  } transition-all hover:scale-105`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-semibold ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-red-400"
                              onClick={() => onDelete?.(notification.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.timestamp, 'relative')}
                          </span>
                          {notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={notification.action.onClick}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
