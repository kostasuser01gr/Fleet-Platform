import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss,
}) => {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    notifications.forEach((notification) => {
      setVisible((prev) => ({ ...prev, [notification.id]: true }));

      if (notification.duration !== 0) {
        const timeout = setTimeout(() => {
          setVisible((prev) => ({ ...prev, [notification.id]: false }));
          setTimeout(() => onDismiss(notification.id), 300);
        }, notification.duration || 5000);

        return () => clearTimeout(timeout);
      }
    });
  }, [notifications, onDismiss]);

  const getIcon = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} border rounded-lg shadow-lg p-4 transition-all transform ${
            visible[notification.id]
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          }`}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setVisible((prev) => ({ ...prev, [notification.id]: false }));
                setTimeout(() => onDismiss(notification.id), 300);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
