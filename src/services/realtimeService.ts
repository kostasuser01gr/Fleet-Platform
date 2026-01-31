// Enhanced Real-time Service with reconnection, message queuing, and presence
export type RealtimeEvent = 
  | 'vehicle_update'
  | 'rental_update'
  | 'maintenance_update'
  | 'chat_message'
  | 'notification'
  | 'assembly_progress'
  | 'partner_update'
  | 'user_presence'
  | 'system_status';

export interface RealtimeMessage {
  type: RealtimeEvent;
  data: unknown;
  timestamp: Date;
  id?: string;
}

export interface PresenceUpdate {
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

export class RealtimeService {
  private static ws: WebSocket | null = null;
  private static listeners: Map<RealtimeEvent, Set<(data: unknown) => void>> = new Map();
  private static connected = false;
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 10;
  private static reconnectDelay = 1000;
  private static messageQueue: RealtimeMessage[] = [];
  private static presence: Map<string, PresenceUpdate> = new Map();
  private static heartbeatInterval: NodeJS.Timeout | null = null;
  private static connectionCheckInterval: NodeJS.Timeout | null = null;

  static connect(url?: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    
    const wsUrl = url || import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('WebSocket connected');
        
        // Send queued messages
        this.flushMessageQueue();
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Emit connection event
        this.emit('system_status', { status: 'connected' });
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
      };
      
      this.ws.onclose = () => {
        this.connected = false;
        this.stopHeartbeat();
        console.log('WebSocket disconnected');
        
        // Attempt reconnection
        this.attemptReconnect(url);
      };
      
      // Connection health check
      this.startConnectionCheck();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.attemptReconnect(url);
    }
  }

  static disconnect() {
    this.stopHeartbeat();
    this.stopConnectionCheck();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.connected = false;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    this.emit('system_status', { status: 'disconnected' });
  }

  static subscribe(event: RealtimeEvent, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => this.listeners.get(event)?.delete(callback);
  }

  static emit(event: RealtimeEvent, data: unknown) {
    const message: RealtimeMessage = {
      type: event,
      data,
      timestamp: new Date(),
      id: `${Date.now()}-${Math.random()}`,
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        // Queue message for later
        this.messageQueue.push(message);
      }
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
    }
  }

  private static handleMessage(message: RealtimeMessage) {
    // Handle presence updates
    if (message.type === 'user_presence') {
      const presence = message.data as PresenceUpdate;
      this.presence.set(presence.userId, presence);
    }

    // Notify listeners
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('Error in realtime callback:', error);
        }
      });
    }
  }

  private static flushMessageQueue() {
    if (this.messageQueue.length === 0) return;
    
    const queue = [...this.messageQueue];
    this.messageQueue = [];
    
    queue.forEach(message => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify(message));
        } catch (error) {
          // Re-queue if send fails
          this.messageQueue.push(message);
        }
      }
    });
  }

  private static attemptReconnect(url?: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('system_status', { status: 'failed', error: 'Max reconnection attempts reached' });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.connected) {
        this.connect(url);
      }
    }, delay);
  }

  private static startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.emit('system_status', { type: 'ping' });
      }
    }, 30000); // Every 30 seconds
  }

  private static stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private static startConnectionCheck() {
    this.connectionCheckInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.CLOSED || this.ws?.readyState === WebSocket.CLOSING) {
        if (!this.connected) {
          this.attemptReconnect();
        }
      }
    }, 5000); // Check every 5 seconds
  }

  private static stopConnectionCheck() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  static isConnected(): boolean {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }

  static getPresence(userId: string): PresenceUpdate | undefined {
    return this.presence.get(userId);
  }

  static getAllPresence(): Map<string, PresenceUpdate> {
    return new Map(this.presence);
  }

  static updatePresence(status: 'online' | 'away' | 'offline') {
    // In production, this would send to server
    this.emit('user_presence', {
      userId: 'current_user', // Would come from auth
      status,
      lastSeen: new Date(),
    });
  }
}
