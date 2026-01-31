export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'vehicle' | 'rental' | 'maintenance' | 'partner' | 'general';
  relatedId?: string; // ID of related vehicle, rental, etc.
  tags: string[];
  author: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isPremium: boolean;
  attachments?: NoteAttachment[];
  color?: string; // For visual organization
}

export interface NoteAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}
