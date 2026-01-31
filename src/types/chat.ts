export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file' | 'location' | 'vehicle' | 'rental';
  attachments?: ChatAttachment[];
  read: boolean;
  edited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
  replyTo?: string; // Message ID
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'vehicle' | 'rental';
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'team' | 'vehicle' | 'rental' | 'maintenance' | 'direct';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPremium: boolean;
  isPrivate: boolean;
  description?: string;
  icon?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  role?: string;
  email?: string;
}
