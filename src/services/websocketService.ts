import { Vehicle } from '../types/vehicle';
import { Notification } from '../components/NotificationCenter';

type WebSocketEventType = 
  | 'vehicle_update'
  | 'location_update'
  | 'rental_started'
  | 'rental_ended'
  | 'maintenance_alert'
  | 'achievement_unlocked'
  | 'notification';

interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: string;
}

type EventCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private eventHandlers: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private isConnecting = false;
  private url: string;

  constructor(url: string = 'ws://localhost:3001') {
    this.url = url;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.sendMessage('authenticate', { token: localStorage.getItem('auth_token') });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(callback => callback(message.data));
    }
  }

  on(event: WebSocketEventType, callback: EventCallback) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(callback);
  }

  off(event: WebSocketEventType, callback: EventCallback) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(callback);
    }
  }

  sendMessage(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data, timestamp: new Date().toISOString() }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Convenience methods for common events
  subscribeToVehicleUpdates(callback: (vehicle: Vehicle) => void) {
    this.on('vehicle_update', callback);
  }

  subscribeToLocationUpdates(callback: (data: { vehicleId: string; location: { lat: number; lng: number } }) => void) {
    this.on('location_update', callback);
  }

  subscribeToNotifications(callback: (notification: Notification) => void) {
    this.on('notification', callback);
  }

  trackVehicle(vehicleId: string) {
    this.sendMessage('track_vehicle', { vehicleId });
  }

  untrackVehicle(vehicleId: string) {
    this.sendMessage('untrack_vehicle', { vehicleId });
  }
}

export const websocketService = new WebSocketService();
