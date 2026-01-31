import { ChatChannel, ChatMessage, ChatUser } from '../types/chat';

export const mockUsers: ChatUser[] = [
  { id: 'u1', name: 'John Doe', status: 'online', role: 'Manager', email: 'john@fleet.com' },
  { id: 'u2', name: 'Jane Smith', status: 'online', role: 'Mechanic', email: 'jane@fleet.com' },
  { id: 'u3', name: 'Mike Johnson', status: 'away', role: 'Sales', email: 'mike@fleet.com' },
  { id: 'u4', name: 'Sarah Williams', status: 'offline', role: 'Admin', email: 'sarah@fleet.com' },
];

export const mockChannels: ChatChannel[] = [
  {
    id: 'c1',
    name: 'General',
    type: 'team',
    participants: ['u1', 'u2', 'u3', 'u4'],
    unreadCount: 2,
    isPremium: false,
    isPrivate: false,
    description: 'Company-wide announcements and discussions',
  },
  {
    id: 'c2',
    name: 'Operations',
    type: 'team',
    participants: ['u1', 'u2', 'u3'],
    unreadCount: 0,
    isPremium: false,
    isPrivate: false,
    description: 'Daily operations coordination',
  },
  {
    id: 'c3',
    name: 'Vehicle #ABC-1234',
    type: 'vehicle',
    participants: ['u1', 'u2'],
    unreadCount: 1,
    isPremium: false,
    isPrivate: false,
    relatedId: '1',
  },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  c1: [
    {
      id: 'm1',
      userId: 'u1',
      userName: 'John Doe',
      content: 'Welcome to Internal Fleet Management Tool! Let\'s make this a great day! 🚗',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      read: true,
    },
    {
      id: 'm2',
      userId: 'u2',
      userName: 'Jane Smith',
      content: 'Just completed maintenance on vehicle #ABC-1234. All systems good!',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      read: true,
    },
    {
      id: 'm3',
      userId: 'u3',
      userName: 'Mike Johnson',
      content: 'New rental booking for the weekend. Customer requested premium features.',
      timestamp: new Date(Date.now() - 600000),
      type: 'text',
      read: false,
    },
  ],
  c2: [
    {
      id: 'm4',
      userId: 'u1',
      userName: 'John Doe',
      content: 'Team meeting at 2 PM today. Please prepare your updates.',
      timestamp: new Date(Date.now() - 7200000),
      type: 'text',
      read: true,
    },
  ],
  c3: [
    {
      id: 'm5',
      userId: 'u2',
      userName: 'Jane Smith',
      content: 'Vehicle inspection completed. Minor wear on tires, but overall excellent condition.',
      timestamp: new Date(Date.now() - 900000),
      type: 'text',
      read: false,
    },
  ],
};
