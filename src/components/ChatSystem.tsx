import { useState, useEffect, useRef } from 'react';
import { ChatChannel, ChatMessage, ChatUser } from '../types/chat';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Hash,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Circle
} from 'lucide-react';

interface ChatSystemProps {
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  users: ChatUser[];
  currentUserId?: string;
  onSendMessage?: (channelId: string, content: string) => void;
  onChannelSelect?: (channel: ChatChannel) => void;
}

export function ChatSystem({ 
  channels, 
  messages, 
  users, 
  currentUserId = 'u1',
  onSendMessage,
  onChannelSelect 
}: ChatSystemProps) {
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(channels[0] || null);
  const [messageContent, setMessageContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChannel) {
      onChannelSelect?.(selectedChannel);
    }
  }, [selectedChannel, onChannelSelect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChannel, messages]);

  const handleSendMessage = () => {
    if (!messageContent.trim() || !selectedChannel) return;
    
    onSendMessage?.(selectedChannel.id, messageContent);
    setMessageContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getChannelMessages = (channelId: string): ChatMessage[] => {
    return messages[channelId] || [];
  };

  const getUser = (userId: string): ChatUser | undefined => {
    return users.find(u => u.id === userId);
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: ChatUser['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const channelMessages = selectedChannel ? getChannelMessages(selectedChannel.id) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* Channels Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-800 border-gray-700 text-white text-sm"
            />
          </div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Channels</h3>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {channels.length}
            </Badge>
          </div>
        </Card>

        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {filteredChannels.map((channel) => {
              const isSelected = selectedChannel?.id === channel.id;
              const channelUsers = channel.participants.map(id => getUser(id)).filter(Boolean) as ChatUser[];
              
              return (
                <Card
                  key={channel.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500'
                      : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {channel.type === 'team' ? (
                          <Hash className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        ) : (
                          <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        )}
                        <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-white'}`}>
                          {channel.name}
                        </h4>
                      </div>
                      {channel.unreadCount > 0 && (
                        <Badge className={`${isSelected ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'} border-0`}>
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {channel.lastMessage && (
                      <p className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        {channel.lastMessage.userName}: {channel.lastMessage.content.substring(0, 30)}...
                      </p>
                    )}

                    {channel.type === 'direct' && channelUsers.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {channelUsers.slice(0, 3).map((user) => (
                          <div key={user.id} className="relative">
                            <Avatar className="w-6 h-6 border-2 border-gray-700">
                              <AvatarFallback className="bg-gray-700 text-white text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedChannel.type === 'team' ? (
                    <Hash className="w-5 h-5 text-blue-400" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{selectedChannel.name}</h3>
                    {selectedChannel.description && (
                      <p className="text-gray-400 text-xs">{selectedChannel.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedChannel.type === 'direct' && (
                    <div className="flex -space-x-2">
                      {selectedChannel.participants.slice(0, 3).map((userId) => {
                        const user = getUser(userId);
                        if (!user) return null;
                        return (
                          <div key={userId} className="relative">
                            <Avatar className="w-8 h-8 border-2 border-gray-700">
                              <AvatarFallback className="bg-gray-700 text-white text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Messages */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 flex-1 flex flex-col mb-4">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {channelMessages.map((message) => {
                    const user = getUser(message.userId);
                    const isCurrentUser = message.userId === currentUserId;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user?.name.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${isCurrentUser ? 'items-end flex flex-col' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold text-sm">{message.userName}</span>
                            <span className="text-gray-400 text-xs">{formatTime(message.timestamp)}</span>
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-100'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {isCurrentUser && (
                              <>
                                {message.read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-400" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-500" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white resize-none min-h-[60px]"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl mb-2">No Channel Selected</h3>
              <p className="text-gray-400">Select a channel to start chatting</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
