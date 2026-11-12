import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Ensure global is polyfilled in all environments
if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

const WS_URL = 'http://localhost:8080/ws';

class WebSocketManager {
  constructor() {
    this.client = null;
    this.connected = false;
    this.connectPromise = null;
  }

  connect() {
    if (this.connected && this.client?.active) {
      return Promise.resolve(this.client);
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve) => {
      try {
        const token = localStorage.getItem('token') || '';

        this.client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            this.connected = true;
            this.connectPromise = null;
            resolve(this.client);
          },
          onStompError: (frame) => {
            console.warn('[STOMP Notice]:', frame?.headers?.message || 'Broker connection info');
            this.connectPromise = null;
            resolve(null);
          },
          onWebSocketClose: () => {
            this.connected = false;
          },
          onWebSocketError: () => {
            this.connected = false;
            this.connectPromise = null;
            resolve(null);
          }
        });

        this.client.activate();
      } catch (err) {
        console.warn('[WebSocket Init Warning]:', err.message || err);
        this.connectPromise = null;
        resolve(null);
      }
    });

    return this.connectPromise;
  }

  async subscribe(topic, callback) {
    try {
      await this.connect();
      if (!this.client || !this.client.connected) {
        return null;
      }
      return this.client.subscribe(topic, (message) => {
        try {
          const body = JSON.parse(message.body);
          callback(body);
        } catch (e) {
          callback(message.body);
        }
      });
    } catch (err) {
      console.warn('[WebSocket Subscription fallback to polling]:', topic);
      return null;
    }
  }

  async send(destination, payload) {
    try {
      await this.connect();
      if (this.client && this.client.connected) {
        this.client.publish({
          destination,
          body: JSON.stringify(payload)
        });
        return true;
      }
    } catch (err) {
      console.warn('[WebSocket Send falling back to HTTP REST]:', destination);
    }
    return false;
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (e) {}
      this.connected = false;
      this.client = null;
      this.connectPromise = null;
    }
  }
}

export const wsManager = new WebSocketManager();
export default wsManager;
